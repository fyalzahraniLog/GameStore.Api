// These mirror the API's DTOs (GameSummaryDto, GameDetailsDto, GenreDto).
// ASP.NET Core serializes PascalCase properties as camelCase JSON,
// and DateOnly as an ISO string ("2015-05-19").

export interface GameSummary {
  id: number
  name: string
  genre: string
  price: number
  releaseDate: string
}

export interface GameDetails {
  id: number
  name: string
  genreId: number
  price: number
  releaseDate: string
}

export interface Genre {
  id: number
  name: string
}

// Request body for POST /games and PUT /games/{id}
// (CreateGamesDto / UpdateGameDto share the same shape).
export interface GamePayload {
  name: string
  genreId: number
  price: number
  releaseDate: string
}
