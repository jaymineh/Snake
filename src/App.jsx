import React from 'react';
import { useSnakeGame } from './hooks/useSnakeGame';
import Board from './components/Board';
import ScoreBoard from './components/ScoreBoard';
import GameOverModal from './components/GameOverModal';
import Controls from './components/Controls';
import SpeedControl from './components/SpeedControl';
import PassthroughToggle from './components/PassthroughToggle';
import { Pause } from 'lucide-react';

function App() {
    const {
        snake,
        food,
        direction,
        score,
        highScore,
        isGameOver,
        isPaused,
        difficulty,
        changeDifficulty,
        resetGame,
        startGame, // Actually used to start/unpause if needed, but we auto-start logic handled in hook state
        isPassthrough,
        togglePassthrough
    } = useSnakeGame();

    return (
        <div className="relative flex h-screen w-full flex-col items-center justify-center bg-slate-950 text-white overflow-hidden selection:bg-emerald-500/30">
            {/* Background Gradients */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-900/20 rounded-full blur-[100px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-900/20 rounded-full blur-[100px]" />
            </div>

            <ScoreBoard score={score} highScore={highScore} />

            <div className="relative z-10 flex flex-col items-center gap-6">
                <Board
                    snake={snake}
                    food={food}
                    direction={direction}
                    isGameOver={isGameOver}
                />

                <div className="h-6 flex items-center justify-center w-full">
                    {isPaused && !isGameOver ? (
                        <div className="flex items-center gap-2 text-amber-400 animate-pulse">
                            <Pause size={20} fill="currentColor" />
                            <span className="font-bold tracking-widest">PAUSED</span>
                        </div>
                    ) : (
                        /* Show Speed Controls when not paused (and implicitly not game over due to parent checks usually, but let's just show it always or mainly when playing/idle) */
                        <div className="flex items-center gap-4">
                            <SpeedControl
                                currentDifficulty={difficulty}
                                onDifficultyChange={changeDifficulty}
                                disabled={isGameOver}
                            />
                            <div className="w-px h-8 bg-slate-800" />
                            <PassthroughToggle
                                isPassthrough={isPassthrough}
                                onToggle={togglePassthrough}
                                disabled={isGameOver}
                            />
                        </div>
                    )}
                </div>
            </div>

            <Controls isPaused={isPaused} />

            {isGameOver && (
                <GameOverModal
                    score={score}
                    highScore={highScore}
                    onRestart={resetGame}
                />
            )}

            {/* Start Game Overlay for first load could be added here, but simple start is fine */}
        </div>
    );
}

export default App;
