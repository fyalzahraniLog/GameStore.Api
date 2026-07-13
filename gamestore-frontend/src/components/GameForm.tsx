import { useEffect, useState, type FormEvent } from 'react'
import { createGame, getGame, updateGame } from '../api'
import type { GamePayload, Genre } from '../types'

interface Props {
  gameId: number | null // null = creating a new game
  genres: Genre[]
  onSaved: () => void
  onCancel: () => void
}

const emptyForm: GamePayload = { name: '', genreId: 0, price: 0, releaseDate: '' }

export default function GameForm({ gameId, genres, onSaved, onCancel }: Props) {
  const [form, setForm] = useState<GamePayload>(emptyForm)
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const isEditing = gameId !== null

  // When editing, the summary row only has the genre *name*, so we fetch
  // GET /games/{id} for the full details (including genreId) to prefill.
  useEffect(() => {
    if (gameId === null) {
      setForm(emptyForm)
      return
    }
    getGame(gameId)
      .then(({ name, genreId, price, releaseDate }) =>
        setForm({ name, genreId, price, releaseDate }),
      )
      .catch((err: Error) => setError(err.message))
  }, [gameId])

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setError(null)
    setSaving(true)
    try {
      if (isEditing) {
        await updateGame(gameId, form)
      } else {
        await createGame(form)
      }
      onSaved()
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mb-6 space-y-4 rounded-lg border border-slate-200 bg-white p-6 shadow-sm"
    >
      <h2 className="text-lg font-semibold text-slate-800">
        {isEditing ? `Edit Game #${gameId}` : 'New Game'}
      </h2>

      {error && (
        <p className="rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm">
          <span className="mb-1 block font-medium text-slate-600">Name</span>
          <input
            type="text"
            required
            maxLength={50}
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full rounded border border-slate-300 px-3 py-2 focus:border-indigo-500 focus:outline-none"
          />
        </label>

        <label className="block text-sm">
          <span className="mb-1 block font-medium text-slate-600">Genre</span>
          <select
            required
            value={form.genreId || ''}
            onChange={(e) => setForm({ ...form, genreId: Number(e.target.value) })}
            className="w-full rounded border border-slate-300 px-3 py-2 focus:border-indigo-500 focus:outline-none"
          >
            <option value="" disabled>
              Select a genre
            </option>
            {genres.map((genre) => (
              <option key={genre.id} value={genre.id}>
                {genre.name}
              </option>
            ))}
          </select>
        </label>

        <label className="block text-sm">
          <span className="mb-1 block font-medium text-slate-600">Price ($)</span>
          <input
            type="number"
            required
            min={0}
            max={1000}
            step="0.01"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
            className="w-full rounded border border-slate-300 px-3 py-2 focus:border-indigo-500 focus:outline-none"
          />
        </label>

        <label className="block text-sm">
          <span className="mb-1 block font-medium text-slate-600">Release Date</span>
          <input
            type="date"
            required
            value={form.releaseDate}
            onChange={(e) => setForm({ ...form, releaseDate: e.target.value })}
            className="w-full rounded border border-slate-300 px-3 py-2 focus:border-indigo-500 focus:outline-none"
          />
        </label>
      </div>

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={saving}
          className="rounded bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
        >
          {saving ? 'Saving…' : isEditing ? 'Save Changes' : 'Create Game'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded border border-slate-300 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}
