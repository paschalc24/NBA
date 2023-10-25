export default function monteCarlo (team1Stats, team2Stats, numSims) {
    let team1Wins = 0;
    let team2Wins = 0;
    let minScore = 1000;
    let maxScore = 0;
    
    for (let i = 0; i < numSims; ++i) {
        const team1Score = generateRandomScore(team1Stats.mean, team1Stats.stdev);
        const team2Score = generateRandomScore(team2Stats.mean, team2Stats.stdev);
        if (maxScore < team1Score + team2Score) {
            maxScore = team1Score + team2Score
        }
        if (minScore > team1Score + team2Score) {
            minScore = team1Score + team2Score
        }
        else if (team2Score > team1Score) {
            team2Wins++;
        }
    }
    let ties = numSims - (team1Wins + team2Wins)

    function generateRandomScore(mean, stdev) {
        const randomValue = (Math.random() * 6 - 3) + (Math.random() * 6 - 3) + (Math.random() * 6 - 3);
        return mean + stdev * randomValue;
    }

    return {team1: (team1Wins/numSims), 
            team2: (team2Wins/numSims), 
            tie: (ties/numSims),
            minScore: minScore,
            maxScore: maxScore}
}