import { http, HttpResponse } from 'msw';

import { API_ENDPOINTS } from '@/services/http/endpoints';

import { createTokenResponse } from '../factories/auth.factory';
import { createHskLevelList } from '../factories/lesson.factory';

const mockHskLevels = createHskLevelList();

export const handlers = [
  http.post(`*${API_ENDPOINTS.auth.login}`, async () => {
    return HttpResponse.json(createTokenResponse());
  }),

  http.get(`*${API_ENDPOINTS.content.levels}`, () => {
    return HttpResponse.json(mockHskLevels);
  }),
];
