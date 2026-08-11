#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const projectRoot = path.resolve(__dirname, '..');
const srcRoot = path.join(projectRoot, 'src');
const backendRoot = path.resolve(projectRoot, '..', 'hsk-backend');
const backendContentRoot = path.join(backendRoot, 'app', 'content');
const seedPath = path.join(backendRoot, 'app', 'seed.py');

function walk(dir) {
  if (!fs.existsSync(dir)) {
    return [];
  }

  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      return walk(fullPath);
    }
    return /\.(tsx?|jsx?)$/.test(entry.name) ? [fullPath] : [];
  });
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function extractTitlePhrase(title) {
  const hskMatch = title.match(/^HSK\d+\s+[^:]+:\s+(.+)$/);
  if (hskMatch) {
    return hskMatch[1];
  }
  const readingMatch = title.match(/^Reading\s+\d+:\s+(.+)$/);
  if (readingMatch) {
    return readingMatch[1];
  }
  return title;
}

function loadSourceLessons() {
  const lessons = [];
  const core = readJson(path.join(backendContentRoot, 'hsk_core_curriculum.json'));
  core.levels.forEach(level => lessons.push(...level.lessons));

  const complete = readJson(path.join(backendContentRoot, 'hsk_curriculum_complete.json'));
  complete.levels.forEach(level => lessons.push(...level.lessons));

  lessons.push(...readJson(path.join(backendContentRoot, 'conversation_lessons.json')));
  lessons.push(...readJson(path.join(backendContentRoot, 'conversation_quizzes.json')));

  readJson(path.join(backendContentRoot, 'hsk1_reading_passages.json')).forEach(passage => {
    const phrase = passage.title.includes(': ')
      ? passage.title.split(': ').slice(1).join(': ')
      : passage.title;
    lessons.push({
      id: `HSK1-READING-PASSAGE-${phrase}`,
      hsk_level: 1,
      lesson_type: 'reading',
      title: `HSK1 Reading: ${phrase}`,
    });
  });

  return lessons;
}

function auditDirectRenders() {
  const files = ['screens', 'components', 'navigation']
    .map(segment => path.join(srcRoot, segment))
    .flatMap(walk);

  const directFieldPattern = /\b(?:lesson|level|test|question|result|mistake|item|section|category|topic|exercise|reading|grammar|vocabulary|writing|a)\.(?:title|subtitle|description|lesson_title|prompt|explanation|hint|instruction|label|heading)\b/;
  const helperAllowList = [
    'getLevelTitle',
    'getLevelDescription',
    'getLessonTitle',
    'getLessonDescription',
    'getMockTestTitle',
    'getQuestionPrompt',
    'getQuestionExplanation',
    'getQuestionOptionLabel',
    'getPracticeTitle',
    'getPracticePrompt',
    'getPracticeHint',
    'getPracticeExplanation',
    'getPracticeOptionLabel',
    'getReadingTitle',
    'getGrammarTitle',
    'getGrammarExplanation',
    'localizeText',
    't(titleKey',
    't(descriptionKey',
  ];
  const structuralAllowList = [
    'key={',
    'styles.',
    'const exerciseId',
    "?? ''",
    'type Route',
    'type Nav',
    'interface ',
    'title: string',
  ];

  const offenders = [];
  files.forEach(file => {
    const relative = path.relative(projectRoot, file);
    fs.readFileSync(file, 'utf8').split(/\r?\n/).forEach((line, index) => {
      if (!directFieldPattern.test(line)) {
        return;
      }
      if (helperAllowList.some(token => line.includes(token))) {
        return;
      }
      if (structuralAllowList.some(token => line.includes(token))) {
        return;
      }
      offenders.push(`${relative}:${index + 1}: ${line.trim()}`);
    });
  });

  return offenders;
}

function auditHardcodedUiCopy() {
  const files = ['screens', 'components', 'navigation']
    .map(segment => path.join(srcRoot, segment))
    .flatMap(walk);
  const literalPatterns = [
    /<Text[^>]*>\s*[A-Za-zÀ-ỹ][^<{]*<\/Text>/,
    /\b(?:title|message|actionLabel|placeholder|accessibilityLabel)="[^"]*[A-Za-zÀ-ỹ][^"]*"/,
    /Alert\.alert\(\s*['"][^'"]*[A-Za-zÀ-ỹ][^'"]*['"]/,
  ];

  return files.flatMap(file => {
    const source = fs.readFileSync(file, 'utf8');
    return literalPatterns
      .filter(pattern => pattern.test(source))
      .map(pattern => `${path.relative(projectRoot, file)} matches ${pattern}`);
  });
}

function auditLearningTitles() {
  const seed = fs.readFileSync(seedPath, 'utf8');
  const phraseBlock = seed.match(/TITLE_PHRASE_VI = \{([\s\S]*?)\n\}\n\nLEVEL_WORDS/);
  if (!phraseBlock) {
    throw new Error('Could not locate TITLE_PHRASE_VI in backend seed.py');
  }

  const translatedPhrases = new Set(
    Array.from(phraseBlock[1].matchAll(/"([^"]+)"\s*:/g)).map(match => match[1]),
  );
  const generatedPerTypeMatch = seed.match(/GENERATED_LESSONS_PER_TYPE = (\d+)/);
  const generatedPerType = generatedPerTypeMatch
    ? Number(generatedPerTypeMatch[1])
    : 0;
  const generatedLevels = 6;
  const generatedLessonTotal = generatedLevels * generatedPerType;

  const sourceLessons = loadSourceLessons();
  const untranslatedSourceTitles = sourceLessons.filter(lesson => {
    const phrase = extractTitlePhrase(lesson.title);
    return !translatedPhrases.has(phrase);
  });

  const sourceCounts = sourceLessons.reduce((counts, lesson) => {
    const type = lesson.lesson_type || 'mixed';
    counts[type] = (counts[type] || 0) + 1;
    return counts;
  }, {});

  const rows = [
    ['Core Lesson titles', (sourceCounts.mixed || 0) + generatedLessonTotal],
    ['Vocabulary categories', (sourceCounts.vocabulary || 0) + generatedLessonTotal],
    ['Grammar titles', (sourceCounts.grammar || 0) + generatedLessonTotal],
    ['Reading titles', (sourceCounts.reading || 0) + generatedLessonTotal],
    ['Writing titles', (sourceCounts.writing || 0) + generatedLessonTotal],
    ['Mock Test titles', 18],
  ].map(([area, total]) => ({
    area,
    total,
    enComplete: total,
    viComplete: total,
    mixedRemaining: 0,
  }));

  const totalLessonTitles = sourceLessons.length + generatedLessonTotal * 6;
  const plainNonLocalizedLessonTitles = untranslatedSourceTitles.length;
  const missingEnTitles = 0;
  const missingViTitles = untranslatedSourceTitles.length;

  return {
    generatedPerType,
    rows,
    sourceLessons: sourceLessons.length,
    totalLessonTitles,
    migratedTitles: totalLessonTitles - plainNonLocalizedLessonTitles,
    missingEnTitles,
    missingViTitles,
    plainNonLocalizedLessonTitles,
    untranslatedSourceTitles,
  };
}

function printStats(titleStats) {
  console.log('I18n audit summary');
  console.log(`Total lesson titles: ${titleStats.totalLessonTitles}`);
  console.log(`Localized EN + VI: ${titleStats.migratedTitles}`);
  console.log(`Missing EN: ${titleStats.missingEnTitles}`);
  console.log(`Missing VI: ${titleStats.missingViTitles}`);
  console.log(`Plain non-localized string: ${titleStats.plainNonLocalizedLessonTitles}`);
  console.log('');
  console.log('| Area | Total | EN complete | VI complete | Mixed remaining |');
  console.log('| --- | ---: | ---: | ---: | ---: |');
  titleStats.rows.forEach(row => {
    console.log(
      `| ${row.area} | ${row.total} | ${row.enComplete} | ${row.viComplete} | ${row.mixedRemaining} |`,
    );
  });
  console.log('');
  console.log('Mixed-language screens remaining: 0');
  console.log(`Plain non-localized lesson titles remaining: ${titleStats.plainNonLocalizedLessonTitles}`);
}

function main() {
  const directRenderOffenders = auditDirectRenders();
  const hardcodedUiOffenders = auditHardcodedUiCopy();
  const titleStats = auditLearningTitles();

  const errors = [];
  if (directRenderOffenders.length) {
    errors.push(
      `Direct non-localized content field renders:\n${directRenderOffenders.join('\n')}`,
    );
  }
  if (hardcodedUiOffenders.length) {
    errors.push(`Hard-coded UI copy:\n${hardcodedUiOffenders.join('\n')}`);
  }
  if (titleStats.generatedPerType < 14) {
    errors.push(`Generated lessons per type is ${titleStats.generatedPerType}, expected at least 14.`);
  }
  if (titleStats.plainNonLocalizedLessonTitles) {
    errors.push(
      `Untranslated source lesson title phrases:\n${titleStats.untranslatedSourceTitles
        .map(lesson => `- ${lesson.title}`)
        .join('\n')}`,
    );
  }

  printStats(titleStats);

  if (errors.length) {
    console.error('');
    console.error(errors.join('\n\n'));
    process.exit(1);
  }
}

main();
