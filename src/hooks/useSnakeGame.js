import { useState, useCallback, useEffect } from 'react';
import { BOARD_SIZE, DIRECTIONS, INITIAL_SNAKE, INITIAL_SPEED, CONTROLS, SPEED_INCREMENT, MIN_SPEED, GAME_SPEEDS } from '../utils/constants';
import { useGameLoop } from './useGameLoop';
import { getHighScore, saveHighScore } from '../utils/storage';

const generateFood = (snake) => {
    let newFood;
    while (true) {
        newFood = {
            x: Math.floor(Math.random() * BOARD_SIZE),
            y: Math.floor(Math.random() * BOARD_SIZE),
        };
        // Check if food is on snake
        const onSnake = snake.some(segment => segment.x === newFood.x && segment.y === newFood.y);
        if (!onSnake) break;
    }
    return newFood;
};

export function useSnakeGame() {
    const [snake, setSnake] = useState(INITIAL_SNAKE);
    const [food, setFood] = useState({ x: 5, y: 5 });
    const [direction, setDirection] = useState(DIRECTIONS.UP);
    const [nextDirection, setNextDirection] = useState(DIRECTIONS.UP);

    // Difficulty / Speed State
    const [difficulty, setDifficulty] = useState(GAME_SPEEDS.MEDIUM);
    const [speed, setSpeed] = useState(GAME_SPEEDS.MEDIUM.value);

    const [score, setScore] = useState(0);
    const [highScore, setHighScore] = useState(getHighScore());
    const [isGameOver, setIsGameOver] = useState(false);
    const [isPaused, setIsPaused] = useState(false);

    useEffect(() => {
        setFood(generateFood(INITIAL_SNAKE));
    }, []);

    // Update speed when difficulty changes (only if game hasn't started moving / score is 0, or just let user restart)
    // For simplicity, we'll let the user change difficulty but it applies on next reset/start unless we add a specific handler.
    // Actually, let's allow changing difficulty which updates current speed if not paused/gameover
    const changeDifficulty = useCallback((newDifficulty) => {
        setDifficulty(newDifficulty);
        if (!isGameOver && !isPaused) {
            setSpeed(newDifficulty.value);
            // Note: This resets any speed increments from eating food. 
            // Ideally difficulty sets the BASE speed. 
            // For this simple implementation, changing difficulty mid-game resets speed progress.
        }
    }, [isGameOver, isPaused]);

    const resetGame = useCallback(() => {
        setSnake(INITIAL_SNAKE);
        setDirection(DIRECTIONS.UP);
        setNextDirection(DIRECTIONS.UP);
        setScore(0);
        setSpeed(difficulty.value);
        setIsGameOver(false);
        setIsPaused(false);
        setFood(generateFood(INITIAL_SNAKE));
    }, [difficulty]);

    const stopGame = useCallback(() => {
        setSpeed(null);
        setIsGameOver(true);
        if (score > highScore) {
            setHighScore(score);
            saveHighScore(score);
        }
    }, [score, highScore]);

    const moveSnake = useCallback(() => {
        setSnake((prevSnake) => {
            const head = prevSnake[0];
            const newHead = {
                x: head.x + nextDirection.x,
                y: head.y + nextDirection.y,
            };

            // Check Walls
            if (
                newHead.x < 0 ||
                newHead.x >= BOARD_SIZE ||
                newHead.y < 0 ||
                newHead.y >= BOARD_SIZE
            ) {
                stopGame();
                return prevSnake;
            }

            // Check Self Collision
            if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
                stopGame();
                return prevSnake;
            }

            const newSnake = [newHead, ...prevSnake];

            // Check Food - strict equality check on integers
            if (newHead.x === food.x && newHead.y === food.y) {
                setScore(s => s + 10);
                setFood(generateFood(newSnake));
                setSpeed(s => Math.max(MIN_SPEED, s - SPEED_INCREMENT));
                // Grow
            } else {
                newSnake.pop(); // Move
            }

            setDirection(nextDirection);
            return newSnake;
        });
    }, [nextDirection, food, stopGame]);

    useGameLoop(moveSnake, speed);

    useEffect(() => {
        const handleKeyDown = (e) => {
            const action = CONTROLS[e.key];
            if (!action) {
                if (e.key === ' ' || e.key === 'Escape') {
                    if (isGameOver) return;
                    setIsPaused(prev => {
                        const paused = !prev;
                        // Resume speed from pause
                        // We need to calculate current speed based on score or just save it.
                        // For now, let's just resume to difficulty value minus increments
                        if (!paused) {
                            const currentSpeed = Math.max(MIN_SPEED, difficulty.value - (score / 10 * SPEED_INCREMENT));
                            setSpeed(currentSpeed);
                        } else {
                            setSpeed(null);
                        }
                        return paused;
                    });
                }
                return;
            }

            const newDir = DIRECTIONS[action];
            const isOpposite = (
                newDir.x === -direction.x && newDir.x !== 0
            ) || (
                    newDir.y === -direction.y && newDir.y !== 0
                );

            if (!isOpposite) {
                setNextDirection(newDir);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [direction, isGameOver, score, difficulty]); // Added difficulty dependency

    return {
        snake,
        food,
        score,
        highScore,
        isGameOver,
        isPaused,
        direction,
        difficulty,
        changeDifficulty,
        resetGame,
        startGame: () => setSpeed(difficulty.value),
    };
}
