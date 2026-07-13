import type { GameSummary } from '../types'

interface Props {
  games: GameSummary[]
  onEdit: (id: number) => void
  onDelete: (id: number) => void
}

export default function GamesTable({ games, onEdit, onDelete }: Props) {
  if (games.length === 0) {
    return (
      <p className="rounded-lg border border-dashed border-slate-300 p-8 text-center text-slate-500">
        No games yet — add your first one.
      </p>
    )
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-slate-200 shadow-sm">
      <table className="w-full text-left text-sm">
        <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
          <tr>
            <th className="px-4 py-3">Id</th>
            <th className="px-4 py-3">Name</th>
            <th className="px-4 py-3">Genre</th>
            <th className="px-4 py-3">Price</th>
            <th className="px-4 py-3">Release Date</th>
            <th className="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {games.map((game) => (
            <tr key={game.id} className="hover:bg-slate-50">
              <td className="px-4 py-3 text-slate-400">{game.id}</td>
              <td className="px-4 py-3 font-medium text-slate-800">{game.name}</td>
              <td className="px-4 py-3">
                <span className="rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-medium text-indigo-700">
                  {game.genre}
                </span>
              </td>
              <td className="px-4 py-3 tabular-nums">${game.price.toFixed(2)}</td>
              <td className="px-4 py-3 tabular-nums">{game.releaseDate}</td>
              <td className="px-4 py-3 text-right">
                <button
                  onClick={() => onEdit(game.id)}
                  className="rounded px-2 py-1 text-indigo-600 hover:bg-indigo-50"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete(game.id)}
                  className="ml-1 rounded px-2 py-1 text-red-600 hover:bg-red-50"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
