export type AppEnvironment = 'development' | 'production' | 'test';

export type EnvConfig = Readonly<{
  apiBaseUrl: string;
  appEnv: AppEnvironment;
  isDevelopment: boolean;
  isProduction: boolean;
  isTest: boolean;
}>;

const APP_ENVIRONMENTS: readonly AppEnvironment[] = ['development', 'production', 'test'];

function isAppEnvironment(value: string): value is AppEnvironment {
  return APP_ENVIRONMENTS.includes(value as AppEnvironment);
}

function parseAppEnvironment(mode: string): AppEnvironment {
  if (isAppEnvironment(mode)) {
    return mode;
  }

  throw new Error(
    `Unsupported Vite mode "${mode}". Expected one of: ${APP_ENVIRONMENTS.join(', ')}.`,
  );
}

function readRequiredEnvVar(name: keyof ImportMetaEnv): string {
  const value = import.meta.env[name];

  if (typeof value !== 'string' || value.trim() === '') {
    throw new Error(
      [
        `Missing required environment variable ${name}.`,
        'Create apps/web/.env from .env.example and set a valid value.',
        'Example: VITE_API_BASE_URL=http://localhost:8000',
      ].join(' '),
    );
  }

  return value.trim();
}

function parseApiBaseUrl(rawValue: string): string {
  let parsedUrl: URL;

  try {
    parsedUrl = new URL(rawValue);
  } catch {
    throw new Error(`VITE_API_BASE_URL must be a valid absolute URL. Received: "${rawValue}".`);
  }

  if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') {
    throw new Error(
      `VITE_API_BASE_URL must use http or https. Received protocol: "${parsedUrl.protocol}".`,
    );
  }

  const normalizedPath = parsedUrl.pathname.replace(/\/+$/, '');
  return `${parsedUrl.origin}${normalizedPath}`;
}

function createEnvConfig(): EnvConfig {
  const appEnv = parseAppEnvironment(import.meta.env.MODE);
  const apiBaseUrl = parseApiBaseUrl(readRequiredEnvVar('VITE_API_BASE_URL'));

  return Object.freeze({
    apiBaseUrl,
    appEnv,
    isDevelopment: appEnv === 'development',
    isProduction: appEnv === 'production',
    isTest: appEnv === 'test',
  });
}

export const env: EnvConfig = createEnvConfig();
