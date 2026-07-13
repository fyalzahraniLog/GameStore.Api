import type { GameDetails, GamePayload, GameSummary, Genre } from './types'

// All paths start with /api — the Vite dev server proxies them to the
// ASP.NET Core backend (see vite.config.ts), so the browser sees a
// same-origin request and CORS never comes into play.

async function http<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`/api${path}`, {
    headers: options?.body ? { 'Content-Type': 'application/json' } : undefined,
    ...options,
  })

  if (!response.ok) {
    // ASP.NET Core returns problem-details JSON for validation failures;
    // surface its title/errors instead of a bare status code when present.
    const problem = await response.json().catch(() => null)
    const detail =
      problem?.errors ? Object.values(problem.errors).flat().join(' ') : problem?.title
    throw new Error(detail ?? `Request failed with status ${response.status}`)
  }

  // 204 No Content (PUT/DELETE) has no body to parse.
  return response.status === 204 ? (undefined as T) : response.json()
}

export const getGames = () => http<GameSummary[]>('/games')

export const getGame = (id: number) => http<GameDetails>(`/games/${id}`)

export const getGenres = () => http<Genre[]>('/genres')

export const createGame = (game: GamePayload) =>
  http<GameDetails>('/games', { method: 'POST', body: JSON.stringify(game) })

export const updateGame = (id: number, game: GamePayload) =>
  http<void>(`/games/${id}`, { method: 'PUT', body: JSON.stringify(game) })

export const deleteGame = (id: number) =>
  http<void>(`/games/${id}`, { method: 'DELETE' })
