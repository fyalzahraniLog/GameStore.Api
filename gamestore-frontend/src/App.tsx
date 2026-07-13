import { useCallback, useEffect, useState } from 'react'
import { deleteGame, getGames, getGenres } from './api'
import GameForm from './components/GameForm'
import GamesTable from './components/GamesTable'
import type { GameSummary, Genre } from './types'

// The form is either closed, open for a new game, or open for an existing id.
type FormState = { open: false } | { open: true; gameId: number | null }

export default function App() {
  const [games, setGames] = useState<GameSummary[]>([])
  const [genres, setGenres] = useState<Genre[]>([])
  const [formState, setFormState] = useState<FormState>({ open: false })
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  const loadGames = useCallback(async () => {
    try {
      setGames(await getGames())
      setError(null)
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadGames()
    getGenres().then(setGenres).catch((err: Error) => setError(err.message))
  }, [loadGames])

  async function handleDelete(id: number) {
    if (!confirm('Delete this game?')) return
    try {
      await deleteGame(id)
      await loadGames()
    } catch (err) {
      setError((err as Error).message)
    }
  }

  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <header className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Game Store</h1>
          <p className="text-sm text-slate-500">
            React frontend for the ASP.NET Core GameStore API
          </p>
        </div>
        {!formState.open && (
          <button
            onClick={() => setFormState({ open: true, gameId: null })}
            className="rounded bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
          >
            + New Game
          </button>
        )}
      </header>

      {error && (
        <p className="mb-4 rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}

      {formState.open && (
        <GameForm
          gameId={formState.gameId}
          genres={genres}
          onSaved={() => {
            setFormState({ open: false })
            loadGames()
          }}
          onCancel={() => setFormState({ open: false })}
        />
      )}

      {loading ? (
        <p className="text-slate-500">Loading games…</p>
      ) : (
        <GamesTable
          games={games}
          onEdit={(id) => setFormState({ open: true, gameId: id })}
          onDelete={handleDelete}
        />
      )}
    </main>
  )
}
