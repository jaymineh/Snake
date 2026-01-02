import { useState, useCallback, useEffect } from 'react';
import { BOARD_SIZE, DIRECTIONS, INITIAL_SNAKE, INITIAL_SPEED, CONTROLS, SPEED_INCREMENT, MIN_SPEED } from '../utils/constants';
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
    // Start with INITIAL_SPEED to auto-start
    const [speed, setSpeed] = useState(INITIAL_SPEED);
    const [score, setScore] = useState(0);
    const [highScore, setHighScore] = useState(getHighScore());
    const [isGameOver, setIsGameOver] = useState(false);
    const [isPaused, setIsPaused] = useState(false);

    useEffect(() => {
        setFood(generateFood(INITIAL_SNAKE));
    }, []);

    const resetGame = useCallback(() => {
        setSnake(INITIAL_SNAKE);
        setDirection(DIRECTIONS.UP);
        setNextDirection(DIRECTIONS.UP);
        setScore(0);
        setSpeed(INITIAL_SPEED);
        setIsGameOver(false);
        setIsPaused(false);
        setFood(generateFood(INITIAL_SNAKE));
    }, []);

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
                        setSpeed(paused ? null : Math.max(MIN_SPEED, INITIAL_SPEED - (score / 10 * SPEED_INCREMENT)));
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
    }, [direction, isGameOver, score]);

    return {
        snake,
        food,
        score,
        highScore,
        isGameOver,
        isPaused,
        direction,
        resetGame,
        startGame: () => setSpeed(INITIAL_SPEED),
    };
}
