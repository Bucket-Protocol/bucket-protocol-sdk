import { vi } from 'vitest';

/** Mock fetch that returns non-ok response. */
export function mockFetchFail(status: number, text: string) {
  return vi.fn().mockResolvedValue({
    ok: false,
    status,
    text: () => Promise.resolve(text),
  });
}

/** Mock fetch that returns ok with JSON body. */
export function mockFetchOk(json: unknown) {
  return vi.fn().mockResolvedValue({
    ok: true,
    json: () => Promise.resolve(json),
  });
}
