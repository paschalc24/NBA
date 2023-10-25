# NBA
🏀 Mock NBA Stats and Odds API

## Overview

This API allows you to retrieve information about NBA games and perform various operations related to these games. It provides endpoints for retrieving game data by team, accessing game statistics, running Monte Carlo simulations, and performing CRUD operations on game records.

## To Get Started and Run Server

1. `git clone https://github.com/paschalc24/NBA`

2. `npm install`

3. `npm run dev`

### Base URL

`https://example.com/games/`

## Endpoints

### 1. Get Games by Team

Retrieve a list of games for a specific team.

- **Endpoint:** `/games/gamesbyteam/:teamname`
- **Method:** GET
- **Parameters:**
  - `teamname` (string): The name of the team for which you want to retrieve games.

**Request:**

`GET /games/gamesbyteam/:teamname`

**Response**

***Status Code: 200 OK***

***Response Format: JSON***

***Response Example:***

```
  {
    "id": 24,
    "teams": {
      "home": "Philadelphia 76ers",
      "away": "Boston Celtics"
    },
    "points": {
      "home": 103,
      "away": 101
    },
    "totalScore": 204
  },
```

---

### 2. Get Points Statistics for a Team

Retrieve statistics (mean, standard deviation, count, sum, sqsum) of points scored by a specific team.

- **Endpoint:** `/games/pointsStats/:teamname`
- **Method:** GET
- **Parameters:**
  - `teamname` (string): The name of the team for which you want to calculate statistics.

**Request:**

`GET /games/pointsStats/:teamname`

**Response**

***Status Code: 200 OK***

***Response Format: JSON***

***Response Example:***

```
{
  "mean": 112.83333333333333,
  "stdev": 8.454124568648398,
  "count": 6,
  "sum": 677,
  "sqsum": 76817
}
```

---

### 3. Run Monte Carlo Simulation

Run a Monte Carlo simulation to compare two teams' performance.

- **Endpoint:** `/games/monteCarlo/:team1/:team2/:numSims`
- **Method:** GET
- **Parameters:**
  - `team1` (string): The name of the first team.
  - `team2` (string): The name of the second team.
  - `numSims` (integer): The number of simulation runs.


**Request:**

`GET /games/monteCarlo/:team1/:team2/:numSims`

**Response**

***Status Code: 200 OK***

***Response Format: JSON***

***Response Example:***

```
{
  "team1": 0,
  "team2": 0.5472,
  "tie": 0.4528,
  "minScore": 82.05502227337698,
  "maxScore": 366.9023731576316
}
```

---

### 4. Get All Games

Retrieve a list of all game objects in the data set.

- **Endpoint:** `/games/all`
- **Method:** GET

**Request:**

`GET /games/all`

**Response**

***Status Code: 200 OK***

***Response Format: JSON***

---

### 5. Get Game by ID

Retrieve a specific game by its ID.

- **Endpoint:** `/games/:id`
- **Method:** GET
- **Parameters:**
  - `id` (integer): The unique ID of the game.

**Request:**

`GET /games/:id`

**Response**

***Status Code: 200 OK***

***Response Format: JSON***

---

### 6. Create a New Game

Create a new game record.

- **Endpoint:** `/games/`
- **Method:** POST
- **Request Body Format:** JSON

**Request:**

`POST /games/`

**Example:**

```
{
    "teams": {
        "home": "Team X",
        "away": "Team Y"
    },
    "points": {
        "home": 80,
        "away": 72
    }
    "totalScore": 152
}
```

**Response**

***Status Code: 200 OK***

***Response Format: JSON***

***Response Example:***

```
{
    "id": 42,
    "teams": {
        "home": "Team X",
        "away": "Team Y"
    },
    "points": {
        "home": 80,
        "away": 72
    },
    "totalScore": 152
}
```

---

### 7. Update a Game

Update an existing game by its ID.

- **Endpoint:** `/games/:id`
- **Method:** PUT
- **Request Body Format:** JSON

**Request:**

`PUT /games/:id`

**Example:**

```
{
  "teams": {
    "home": "Update Test",
    "away": "Update Test"
  },
  "points": {
    "home": 129,
    "away": 122
  },
  "totalScore": 251,
  "id": 90
}
```

**Response**

***Status Code: 200 OK***

***Response Format: JSON***

***Response Example:***

```
{
  "teams": {
    "home": "Update Test",
    "away": "Update Test"
  },
  "points": {
    "home": 129,
    "away": 122
  },
  "totalScore": 251,
  "id": 90
}
```

---

### 8. Delete a Game

Delete a game by its ID.

- **Endpoint:** `/games/:id`
- **Method:** DELETE
- **Parameters:**
  - `id` (integer): The unique ID of the game.

**Request:**

`DELETE /games/:id`

**Response**

***Status Code: 204 No Content***

***Response Format: JSON***

## Error Responses

In case of errors, the API may return the following response:

- **Status Code 400:** Bad Request
- **Status Code 405:** Not Found
- **Status Code 500:** Internal Server Error

## Notes

- All endpoints are based on the april2022.json data file. In the future, I will expand to a larger data set and add more factors to the simulations.