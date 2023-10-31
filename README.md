# NBA
🏀 NBA Game Simulation API

## Overview

This API facilitates local CRUD operations for NBA game simulations, offering endpoints for data retrieval, simulation execution, result updates, and deletion. Simulations consist of team-name-score pairs predicted through multivariate linear regression. The API enables the selection of independent variables from a specified list of basketball statistics for precise and tailorable simulation generation.

## To Get Started and Run Server

1. Clone the repository: `git clone https://github.com/paschalc24/NBA`

2. Install dependencies: `npm install`

3. Start the development server: `npm run dev`

### Base URL

The base URL for the API is `https://example.com/simulations/`.

## Endpoints

### 1. Get All Simulations

Retrieve a list of all simulation data.

- **Endpoint:** `/simulations/all`
- **Method:** GET

**Request:**

`GET /simulations/all`

**Response**

***Status Code: 200 OK***

***Response Format: JSON***

***Response Example:***

```
[
  {
    "id": "2960662e-f119-4149-b947-f91fad9c0962",
    "trailblazers": [
      113.40243902439131
    ],
    "jazz": [
      117.07317073170455
    ]
  }
]
```

### 2. Get Simulation by ID

Retrieve a specific simulation by its ID.

- **Endpoint:** `/simulations/:id`
- **Method:** GET
- **Parameters:**
  - `id` (string): The unique ID of the simulation.

**Request:**

`GET /simulations/:id`

**Response**

***Status Code: 200 OK***

***Response Format: JSON***

***Response Example:***

```
[
  {
    "id": "14b6015f-b5f2-44c8-b37a-5cb9b4a81064",
    "raptors": [
      112.85365853658843
    ],
    "jazz": [
      117.07317073170455
    ]
  }
]
```

### 3. Run Multivariate Linear Regression Simulation

Run a Multivariate Linear Regression simulation for two teams.

- **Endpoint:** `/simulations/mvLinearRegression/:team1/:team2?optionalparam=true`
- **Method:** POST
- **Required Parameters:**
  - `team1` (string): The name of the first team.
  - `team2` (string): The name of the second team.
  (hawks|celtics|nets|hornets|bulls|cavaliers|mavericks|nuggets|pistons|warriors|rockets|pacers|clippers|lakers|grizzlies|heat|bucks|timberwolves|pelicans|knicks|thunder|magic|sixers|suns|trailblazers|kings|spurs|raptors|jazz|wizards)
- **Optional Parameters:**
  - Set all optional parameters to true in the query that are desired independent variables. If no optional parameters are specified, the default independent variables are 3PM, 3P%, FT%, DRB, and BL. Many optional parameters can be applied i.e. `http://localhost:3000/simulations/mvLinearRegression/trailblazers/jazz?FG3M=true&FG3_PCT=true&DREB=true`

  - `FGM` (Field Goals Made): The total number of successful field goals a player or team has made.
  - `FGA` (Field Goals Attempted): The total number of field goal attempts, including both made and missed shots.
  - `FG_PCT` (Field Goal Percentage): The ratio of successful field goals (FGM) to field goal attempts (FGA), indicating shooting accuracy.
  - `FG3M` (Three-Point Field Goals Made): The number of successful three-point field goals made by a player or team.
  - `FG3A` (Three-Point Field Goals Attempted): The total number of three-point field goal attempts.
  - `FG3_PCT` (Three-Point Field Goal Percentage): The ratio of successful three-point field goals (FG3M) to three-point field goal attempts (FG3A).
  - `FTM` (Free Throws Made): The total number of successful free throws made.
  - `FTA` (Free Throws Attempted): The total number of free throw attempts.
  - `FT_PCT` (Free Throw Percentage): The ratio of successful free throws (FTM) to free throw attempts (FTA), indicating free throw shooting accuracy.
  - `OREB` (Offensive Rebounds): The number of rebounds a player or team retrieves on the offensive end.
  - `DREB` (Defensive Rebounds): The number of rebounds a player or team retrieves on the defensive end.
  - `REB` (Total Rebounds): The total number of rebounds, including both offensive and defensive rebounds.
  - `AST` (Assists): The number of times a player passes the ball to a teammate in a way that leads to a score.
  - `TOV` (Turnovers): The number of times a player or team loses possession of the ball to the opposing team.
  - `STL` (Steals): The number of times a player legally takes the ball away from an opponent.
  - `BLK` (Blocks): The number of times a player prevents an opponent's shot attempt.
  - `BLKA` (Blocked Shots Against): The number of blocked shot attempts by the opposing team.
  - `PF` (Personal Fouls): The number of personal fouls committed by a player or team.
  - `PFD` (Personal Fouls Drawn): The number of personal fouls drawn by a player.
  - `PTS` (Points): The total number of points scored by a player or team during a game or season.
  - `PLUS_MINUS` (Plus-Minus): The difference in points scored by a player's team while they are on the court compared to when they are off the court.
  - `GP_RANK` (Games Played Rank): A ranking of players or teams based on the number of games played.
  - `W_RANK` (Wins Rank): A ranking based on the number of wins.
  - `L_RANK` (Losses Rank): A ranking based on the number of losses.
  - `W_PCT_RANK` (Win Percentage Rank): A ranking based on the win percentage, calculated as (Wins / (Wins + Losses)).
  - `MIN_RANK` (Minutes Played Rank): A ranking based on the total minutes played by players.
  - `FGM_RANK` (Field Goals Made Rank): A ranking based on the number of successful field goals made.
  - `FGA_RANK` (Field Goals Attempted Rank): A ranking based on the number of field goal attempts.
  - `FG_PCT_RANK` (Field Goal Percentage Rank): A ranking based on the field goal shooting percentage.
  - `FG3M_RANK` (Three-Point Field Goals Made Rank): A ranking based on the number of successful three-point field goals made.
  - `FG3A_RANK` (Three-Point Field Goals Attempted Rank): A ranking based on the number of three-point field goal attempts.
  - `FG3_PCT_RANK` (Three-Point Field Goal Percentage Rank): A ranking based on the three-point shooting percentage.
  - `FTM_RANK` (Free Throws Made Rank): A ranking based on the number of successful free throws made.
  - `FTA_RANK` (Free Throws Attempted Rank): A ranking based on the number of free throw attempts.
  - `FT_PCT_RANK` (Free Throw Percentage Rank): A ranking based on free throw shooting percentage.
  - `OREB_RANK` (Offensive Rebounds Rank): A ranking based on the number of offensive rebounds.
  - `DREB_RANK` (Defensive Rebounds Rank): A ranking based on the number of defensive rebounds.
  - `REB_RANK` (Total Rebounds Rank): A ranking based on the total number of rebounds.
  - `AST_RANK` (Assists Rank): A ranking based on the number of assists.
  - `TOV_RANK` (Turnovers Rank): A ranking based on the number of turnovers.
  - `STL_RANK` (Steals Rank): A ranking based on the number of steals.
  - `BLK_RANK` (Blocks Rank): A ranking based on the number of blocks.
  - `BLKA_RANK` (Blocked Shots Against Rank): A ranking based on the number of blocked shot attempts by the opposing team.
  - `PF_RANK` (Personal Fouls Rank): A ranking based on the number of personal fouls committed.
  - `PFD_RANK` (Personal Fouls Drawn Rank): A ranking based on the number of personal fouls drawn by a player.
  - `PTS_RANK` (Points Rank): A ranking based on the total number of points scored.
  - `PLUS_MINUS_RANK` (Plus-Minus Rank): A ranking based on the plus-minus statistic, indicating a player's impact on the team's performance.

**Request:**

`POST /simulations/mvLinearRegression/:team1/:team2?optionalparam=true`

**Response**

***Status Code: 200 OK***

***Response Format: JSON***

***Response Example:***

```
{
  "id": "2960662e-f119-4149-b947-f91fad9c0962",
  "trailblazers": [
    113.40243902439131
  ],
  "jazz": [
    117.07317073170455
  ]
}
```

### 4. Update Simulation

Update an existing simulation by its ID.

- **Endpoint:** `/simulations/:id`
- **Method:** PUT
- **Parameters:**
  - `id` (string): The unique ID of the simulation.

**Request:**

`PUT /simulations/:id`

***Request Example:***

```
{
    "id": "1f051c47-92f5-4900-964c-45543751eeb4",
    "celtics": [
        120
    ],
    "hawks": [
        120
    ]
}
```

**Response**

***Status Code: 200 OK***

***Response Format: JSON***

***Response Example:***

```
{
  "id": "1f051c47-92f5-4900-964c-45543751eeb4",
  "celtics": [
    120
  ],
  "hawks": [
    120
  ]
}
```

### 5. Delete Simulation

Delete a simulation by its ID.

- **Endpoint:** `/simulations/:id`
- **Method:** DELETE
- **Parameters:**
  - `id` (string): The unique ID of the simulation.

## Error Responses

In case of errors, the API may return the following responses:

- **Status Code 400:** Bad Request
- **Status Code 404:** Not Found
- **Status Code 500:** Internal Server Error

- All simulation data is stored in the 'out.json' file.

## Note

After there is a reasonable data in the current season the data will dynamically be pulled from this season. I also plan on adding an endpoint to run a similar prediction using Monte Carlo simulations.
Advice is always appreciated, thank you 🙌🏼