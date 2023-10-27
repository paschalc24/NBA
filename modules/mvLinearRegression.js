import MLR from "ml-regression-multivariate-linear";

export default function mvLinearRegression (team1games, team2games) {
    let team1points = []
    let team2points = []
    let team1A = []
    let team2A = []
    let team1averages = Array.from({length:5}).fill(0)
    let team2averages = Array.from({length:5}).fill(0)
    for (let game of team1games) {
        team1points.push([game[28]]) // dependent variable
        team1A.push([game[12], game[14], game[17], game[19], game[24]]) //independent variables
        team1averages[0] += game[12]
        team1averages[1] += game[14]
        team1averages[2] += game[17]
        team1averages[3] += game[19]
        team1averages[4] += game[24]
    }
    team1averages = team1averages.map(avg => avg/team1games.length)
    for (let game of team2games) {
        team2points.push([game[28]]) // dependent variable
        team2A.push([game[12], game[14], game[17], game[19], game[24]]) //independent variables
        team2averages[0] += game[12]
        team2averages[1] += game[14]
        team2averages[2] += game[17]
        team2averages[3] += game[19]
        team2averages[4] += game[24]
    }
    team2averages = team2averages.map(avg => avg/team2games.length)

    const mlr1 = new MLR(team1A, team1points);
    const mlr2 = new MLR(team2A, team2points);
    return {p0: mlr1.predict(team1averages), p1: mlr2.predict(team2averages)}
}