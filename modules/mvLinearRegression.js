import MLR from "ml-regression-multivariate-linear";
import parameterMap from "./parameterMap.js"

export default function mvLinearRegression (team1games, team2games, query) {
    let team1b = [];
    let team2b = [];
    let team1A = [];
    let team2A = [];
    let indepVariableAverages1 = new Map();
    let indepVariableAverages2 = new Map();
    for (let key of Object.keys(query)) {
        indepVariableAverages1.set(key, 0);
        indepVariableAverages2.set(key, 0);
    }
    for (let game of team1games) {
        team1b.push([game[28]]) // dependent variable
        let A = [];
        for (let key of indepVariableAverages1.keys()) {
            let index = parameterMap[key];
            A.push(game[index]);
            indepVariableAverages1.set(key, indepVariableAverages1.get(key) + game[index]);
        }
        team1A.push(A);
    }
    for (let key of indepVariableAverages1.keys()) {
        indepVariableAverages1.set(key, indepVariableAverages1.get(key) / team1games.length)
    }

    for (let game of team2games) {
        team2b.push([game[28]]) // dependent variable
        let A = [];
        for (let key of indepVariableAverages2.keys()) {
            let index = parameterMap[key];
            A.push(game[index]);
            indepVariableAverages2.set(key, indepVariableAverages2.get(key) + game[index]);
        }
        team2A.push(A);
    }
    for (let key of indepVariableAverages2.keys()) {
        indepVariableAverages2.set(key, indepVariableAverages2.get(key) / team2games.length)
    }
    const team1averages = Array.from(indepVariableAverages1.values());
    const team2averages = Array.from(indepVariableAverages2.values())

    const mlr1 = new MLR(team1A, team1b);
    const mlr2 = new MLR(team2A, team2b);
    return {p0: mlr1.predict(team1averages), p1: mlr2.predict(team2averages)}
}