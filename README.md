# NBA
🏀 Mock NBA Stats and Odds API

## Overview

This API allows you to perform various operations related to NBA simulations. It provides endpoints for retrieving simulation data, running simulations, updating simulation results, and deleting simulations. Simulations at the moment are simply key value pairs of team names and their predicted scores. These scores are reached through multivariate linear regression. This application currently uses 3PM, 3P%, FT%, DRB, and BL as independent variables and PTS as a dependent variable. I used these specific parameters as they are specified in this PLOS journal as being the statistics that have the least consistency between regular and post-season competitive periods `https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0273427#sec005`.

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

- **Endpoint:** `/simulations/mvLinearRegression/:team1/:team2`
- **Method:** POST
- **Parameters:**
  - `team1` (string): The name of the first team.
  - `team2` (string): The name of the second team.
  (hawks|celtics|nets|hornets|bulls|cavaliers|mavericks|nuggets|pistons|warriors|rockets|pacers|clippers|lakers|grizzlies|heat|bucks|timberwolves|pelicans|knicks|thunder|magic|sixers|suns|trailblazers|kings|spurs|raptors|jazz|wizards)

**Request:**

`POST /simulations/mvLinearRegression/:team1/:team2`

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

## Notes

In the future, the factors used will be provided as optional parameters. This is the complete list of factors in the dataset:["WL", "MIN", "FGM", "FGA", "FG_PCT", "FG3M", "FG3A", "FG3_PCT", "FTM", "FTA", "FT_PCT", "OREB", "DREB", "REB", "AST", "TOV", "STL", "BLK", "BLKA", "PF", "PFD", "PTS", "PLUS_MINUS", "GP_RANK", "W_RANK", "L_RANK", "W_PCT_RANK", "MIN_RANK", "FGM_RANK", "FGA_RANK", "FG_PCT_RANK", "FG3M_RANK", "FG3A_RANK", "FG3_PCT_RANK", "FTM_RANK", "FTA_RANK", "FT_PCT_RANK", "OREB_RANK", "DREB_RANK", "REB_RANK", "AST_RANK", "TOV_RANK", "STL_RANK", "BLK_RANK", "BLKA_RANK", "PF_RANK", "PFD_RANK", "PTS_RANK", "PLUS_MINUS_RANK", "AVAILABLE_FLAG"] All data is pulled from `https://github.com/swar/nba_api`. Furthermore, after there is a reasonable data in the current season the data will dynamically be pulled from this season.

