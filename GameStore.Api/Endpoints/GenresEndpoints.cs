using System;
using Microsoft.EntityFrameworkCore;

namespace GameStore.Api;

public static class GenresEndpoints
{
    public static void MapGenresEndpoints(this WebApplication app)
    {
        var Group = app.MapGroup("/genres");

        // Map the endpoint for getting all genres
        Group.MapGet("/", async (GameStoreContext dbcontext) =>
            await dbcontext.Genres
            .Select(genre => new GenreDto(
                genre.Id,
                genre.Name))
            .AsNoTracking()
            .ToListAsync());
    }
}
