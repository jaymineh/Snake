const PREFIX = 'snake-game-';

export const getHighScore = () => {
    const score = localStorage.getItem(PREFIX + 'highscore');
    return score ? parseInt(score, 10) : 0;
};

export const saveHighScore = (score) => {
    localStorage.setItem(PREFIX + 'highscore', score.toString());
};
