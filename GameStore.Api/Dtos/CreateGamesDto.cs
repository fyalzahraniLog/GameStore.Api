using System.ComponentModel.DataAnnotations;

namespace GameStore.Api;

public record CreateGamesDto(
    [Required][StringLength(50)] string Name,
    [Range(1, 50)] int GenreId,
    [Required][Range(0, 1000)] decimal Price,
    [Required] DateOnly ReleaseDate
);
