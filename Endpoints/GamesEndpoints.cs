using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace GameStore.Api;


public static class GamesEndpoints
{
    const string GetGameEndpointName = "GetGame";
    private static readonly List<GameSummaryDto> games = [

        new (1, "The Witcher 3: Wild Hunt", "RPG", 29.99m, new DateOnly(2015, 5, 19)),
    new (2, "Cyberpunk 2077", "RPG", 59.99m, new DateOnly(2020, 12, 10)),
    new (3, "Minecraft", "Sandbox", 26.95m, new DateOnly(2011, 11, 18))
    ];

    public static void MapGamesEndpoints(this WebApplication app)
    {
        var Group = app.MapGroup("/games");

        // Map the endpoints for the games API
        Group.MapGet("/", async (GameStoreContext dbcontext) =>
        await dbcontext.Games
        .Include(game => game.Genre)
        .Select(game => new GameSummaryDto(
            game.Id,
            game.Name,
            game.Genre!.Name,
            game.Price,
            game.ReleaseDate))
            .ToListAsync());

        // Map the endpoint for getting a game by ID
        Group.MapGet("/{id}", async (int id, GameStoreContext dbcontext) =>
        {
            var game = await dbcontext.Games.FindAsync(id);
            return game is not null
                ? Results.Ok(new GameDetailsDto(
                    game.Id,
                    game.Name,
                    game.GenreId,
                    game.Price,
                    game.ReleaseDate))
                : Results.NotFound();
        })
        .WithName(GetGameEndpointName);

        // Map the endpoint for creating a new game
        Group.MapPost("/", async (CreateGamesDto newGame, GameStoreContext dbcontext) =>
    {
        Game game = new Game
        {
            Name = newGame.Name,
            GenreId = newGame.GenreId,
            Price = newGame.Price,
            ReleaseDate = newGame.ReleaseDate
        };

        dbcontext.Games.Add(game);
        await dbcontext.SaveChangesAsync();

        GameDetailsDto gameDetails = new GameDetailsDto(
            game.Id,
            game.Name,
            game.GenreId,
            game.Price,
            game.ReleaseDate
        );

        return Results.CreatedAtRoute(GetGameEndpointName, new { id = game.Id }, gameDetails);
    });

        // Map the endpoint for updating an existing game
        Group.MapPut("/{id}", async (int id, UpdateGameDto updatedGame, GameStoreContext dbcontext) =>
        {
            var existingGame = await dbcontext.Games.FindAsync(id);

            if (existingGame is null)
            {
                return Results.NotFound();
            }

            existingGame.Name = updatedGame.Name;
            existingGame.GenreId = updatedGame.GenreId;
            existingGame.Price = updatedGame.Price;
            existingGame.ReleaseDate = updatedGame.ReleaseDate;

            await dbcontext.SaveChangesAsync();

            return Results.NoContent();
        });

        // Map the endpoint for deleting a game
        Group.MapDelete("/{id}", async (int id, GameStoreContext dbcontext) =>
    {
        var game = await dbcontext.Games.FindAsync(id);

        if (game is null)
        {
            return Results.NotFound();
        }

        dbcontext.Games
        .Where(g => g.Id == id)
        .ExecuteDelete();

        return Results.NoContent();
    });


    }


};
