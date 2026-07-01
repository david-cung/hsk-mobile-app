/**
 * MSW browser worker for local development without the FastAPI backend.
 *
 * Enable: set `VITE_ENABLE_MSW=true` in `.env` or `.env.local`, then restart `npm run dev`.
 * Disable: set `VITE_ENABLE_MSW=false` or remove the variable, then restart the dev server.
 *
 * The service worker script lives in `public/mockServiceWorker.js` (generated via `npx msw init public`).
 */
import { setupWorker } from 'msw/browser';

import { handlers } from './handlers';

export const worker = setupWorker(...handlers);

export function isMswEnabled(): boolean {
  return import.meta.env.DEV && import.meta.env.VITE_ENABLE_MSW === 'true';
}

export async function startMockServer(): Promise<void> {
  await worker.start({
    onUnhandledRequest: 'bypass',
    quiet: false,
    serviceWorker: {
      url: '/mockServiceWorker.js',
    },
  });
}
