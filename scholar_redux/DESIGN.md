---
name: Scholar Redux
colors:
  surface: '#fcf9f8'
  surface-dim: '#dcd9d9'
  surface-bright: '#fcf9f8'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f6f3f2'
  surface-container: '#f0eded'
  surface-container-high: '#eae7e7'
  surface-container-highest: '#e4e2e1'
  on-surface: '#1b1c1c'
  on-surface-variant: '#5b4040'
  inverse-surface: '#303030'
  inverse-on-surface: '#f3f0f0'
  outline: '#8f6f6f'
  outline-variant: '#e3bebd'
  surface-tint: '#ba1434'
  primary: '#9e0027'
  on-primary: '#ffffff'
  primary-container: '#c41e3a'
  on-primary-container: '#ffdada'
  inverse-primary: '#ffb3b4'
  secondary: '#705d00'
  on-secondary: '#ffffff'
  secondary-container: '#fcd400'
  on-secondary-container: '#6e5c00'
  tertiary: '#205555'
  on-tertiary: '#ffffff'
  tertiary-container: '#3b6d6d'
  on-tertiary-container: '#b8edec'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdad9'
  primary-fixed-dim: '#ffb3b4'
  on-primary-fixed: '#40000a'
  on-primary-fixed-variant: '#920023'
  secondary-fixed: '#ffe16d'
  secondary-fixed-dim: '#e9c400'
  on-secondary-fixed: '#221b00'
  on-secondary-fixed-variant: '#544600'
  tertiary-fixed: '#b8ecec'
  tertiary-fixed-dim: '#9cd0d0'
  on-tertiary-fixed: '#002020'
  on-tertiary-fixed-variant: '#194e4e'
  background: '#fcf9f8'
  on-background: '#1b1c1c'
  surface-variant: '#e4e2e1'
typography:
  display-zh:
    fontFamily: notoSans
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.2'
  headline-lg:
    fontFamily: inter
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
  headline-lg-mobile:
    fontFamily: inter
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
  headline-md:
    fontFamily: inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-zh:
    fontFamily: notoSans
    fontSize: 20px
    fontWeight: '400'
    lineHeight: 32px
  body-md:
    fontFamily: inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-md:
    fontFamily: inter
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
    letterSpacing: 0.02em
  label-sm:
    fontFamily: inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.04em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 4px
  margin-mobile: 20px
  gutter-mobile: 16px
  stack-sm: 8px
  stack-md: 16px
  stack-lg: 32px
  card-padding: 20px
---

## Brand & Style

The design system is engineered for the modern language learner, balancing the weight of academic achievement with the fluidity of a contemporary mobile experience. The brand personality is encouraging, disciplined, and clear. It targets global students and professionals who require a high-focus environment that feels premium yet accessible.

The aesthetic follows a **Corporate / Modern** approach with subtle **Minimalist** influences. By utilizing expansive whitespace and high-contrast typography, the interface minimizes cognitive load, allowing the complexity of Chinese characters to remain the focal point. The emotional response should be one of "calm productivity"—a sense that the mastery of a difficult language is structured, attainable, and elegant.

## Colors

The palette is rooted in cultural significance while maintaining modern UI standards. 

- **Primary (Chinese Red):** Reserved for high-intent actions, primary buttons, and critical brand identifiers. It signifies energy and importance.
- **Secondary (Gold):** A reward-tier color used exclusively for gamification elements, milestones, and high-level achievements to provide visual delight.
- **Tertiary (Muted Teal):** Provides a cooling contrast to the red, used for informational tags, secondary progress indicators, and non-critical UI decorations.
- **Surface & Background:** A strict adherence to off-white backgrounds (#F5F5F5) and pure white cards (#FFFFFF) ensures a clear distinction between the canvas and interactive content.

## Typography

The typography system prioritizes the legibility of CJK (Chinese, Japanese, Korean) characters alongside Latin text. **Inter** provides a systematic, neutral framework for UI instructions, while **Noto Sans SC** is utilized for Chinese characters to ensure stroke clarity at all sizes.

For learning modules, Chinese characters are scaled 10-15% larger than their English counterparts to maintain visual weight parity. High contrast (#2D2D2D on #FFFFFF) is mandatory for all instructional text. Use `display-zh` for flashcard-style hero characters and `body-zh` for sentence examples to ensure radicals are easily distinguishable for students.

## Layout & Spacing

This design system employs a **Fluid Grid** model optimized for mobile-first consumption. The layout is built on a 4px baseline grid to ensure vertical rhythm.

- **Margins:** A generous 20px side margin prevents content from feeling cramped on narrow devices.
- **Vertical Hierarchy:** Content is organized in a "Path-based" vertical flow. Each learning module or unit should be represented by a full-width or staggered card system.
- **Safe Areas:** Interactive elements must maintain a minimum 44px hit target, with 8px of internal padding within containers to ensure Chinese characters do not touch borders.

## Elevation & Depth

Hierarchy is established through **Tonal Layers** and **Ambient Shadows**. 

1.  **Level 0 (Background):** Soft Gray (#F5F5F5) acts as the base canvas.
2.  **Level 1 (Cards):** Pure White (#FFFFFF) surfaces used for the main content. These use a very soft, diffused shadow (Hex: #000000, Opacity: 4%, Blur: 12px, Y: 4px).
3.  **Level 2 (Active/Floating):** Primary buttons or active modal states use a more pronounced shadow to indicate interactability (Hex: #C41E3A, Opacity: 15%, Blur: 16px, Y: 6px).

Avoid heavy borders or harsh shadows. Depth should feel natural and light, mimicking paper layers in a clean workspace.

## Shapes

The shape language is approachable and friendly. 
- **Standard Cards:** Use a 16px (`rounded-lg`) corner radius to create a soft, non-threatening learning environment. 
- **Buttons:** Follow the `rounded-lg` rule for a consistent look, or use `rounded-xl` (24px) for prominent "Start Lesson" actions to make them feel more "pill-like" and inviting.
- **Selection States:** Input fields and secondary chips use an 8px radius to maintain a tighter, more precise feel for data entry.

## Components

- **Buttons:** Primary buttons use the Chinese Red background with white text. Secondary buttons should use a Muted Teal ghost-style (outline) or light tint.
- **Learning Cards:** Cards should contain a single focus point (e.g., one Hanzi character or one grammar rule). Padding must be consistent at 20px.
- **Progress Milestones:** Use Gold (#FFD700) for progress bars and circular rings when a user completes a set, paired with subtle haptic feedback patterns.
- **Chips:** Small, rounded-pill labels for HSK levels (e.g., HSK 1, HSK 2). Use Muted Teal for unselected states and Chinese Red for the active level.
- **Input Fields:** Bottom-aligned labels with a clean underline or a soft-gray background fill. Focus states should transition the border color to Primary Red.
- **Icons:** Use minimal 2pt line-art icons. Icons should be functional and never decorative; avoid filled versions unless representing an active/toggled state.
- **Navigation:** A clean bottom tab bar with labels in `label-sm`. The active icon receives a Primary Red tint and a small 4px dot indicator below it.