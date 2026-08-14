import * as Keychain from 'react-native-keychain';

import {
  apiFetch,
  clearTokens,
  setSessionExpiredListener,
  setTokens,
} from '../src/api/client';


const keychain = jest.mocked(Keychain);

function response(status: number, body: unknown) {
  return {
    ok: status >= 200 && status < 300,
    status,
    statusText: status === 401 ? 'Unauthorized' : 'OK',
    json: jest.fn(async () => body),
  } as unknown as Response;
}

describe('auth token client', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    setSessionExpiredListener(null);
  });

  it('stores and clears access and refresh tokens in Keychain', async () => {
    await setTokens('access', 'refresh');
    expect(keychain.setGenericPassword).toHaveBeenCalledTimes(2);

    await clearTokens();
    expect(keychain.resetGenericPassword).toHaveBeenCalledTimes(2);
  });

  it('rotates tokens and retries once after an access-token 401', async () => {
    keychain.getGenericPassword.mockImplementation(async ({ service }) => {
      if (service === 'hsk_access_token') {
        return { username: 'access_token', password: 'expired-access', service, storage: 'keychain' };
      }
      return { username: 'refresh_token', password: 'valid-refresh', service, storage: 'keychain' };
    });
    global.fetch = jest
      .fn()
      .mockResolvedValueOnce(response(401, { detail: 'expired' }))
      .mockResolvedValueOnce(
        response(200, {
          access_token: 'new-access',
          refresh_token: 'new-refresh',
          token_type: 'bearer',
        }),
      )
      .mockResolvedValueOnce(response(200, { id: 1 }));

    const result = await apiFetch<{ id: number }>('/api/v1/auth/me');
    expect(result).toEqual({ id: 1 });
    expect(global.fetch).toHaveBeenCalledTimes(3);
    expect(keychain.setGenericPassword).toHaveBeenCalledWith(
      'access_token',
      'new-access',
      expect.objectContaining({ service: 'hsk_access_token' }),
    );
  });

  it('clears the session when refresh fails', async () => {
    const expired = jest.fn();
    setSessionExpiredListener(expired);
    keychain.getGenericPassword.mockImplementation(async ({ service }) => ({
      username: service === 'hsk_access_token' ? 'access_token' : 'refresh_token',
      password: service === 'hsk_access_token' ? 'expired-access' : 'revoked-refresh',
      service,
      storage: 'keychain',
    }));
    global.fetch = jest
      .fn()
      .mockResolvedValueOnce(response(401, { detail: 'expired' }))
      .mockResolvedValueOnce(response(401, { detail: 'invalid refresh' }));

    await expect(apiFetch('/api/v1/auth/me')).rejects.toMatchObject({ status: 401 });
    expect(expired).toHaveBeenCalledTimes(1);
    expect(keychain.resetGenericPassword).toHaveBeenCalledTimes(2);
  });
});
