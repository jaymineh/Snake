import React from 'react';
import { motion } from 'framer-motion';
import { RefreshCw } from 'lucide-react';

const GameOverModal = ({ score, highScore, onRestart }) => {
    return (
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-slate-900 border border-slate-700 p-8 rounded-2xl shadow-2xl max-w-sm w-full text-center"
            >
                <h2 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500 mb-2">
                    GAME OVER
                </h2>

                <div className="my-6 space-y-2">
                    <div className="flex justify-between text-slate-400">
                        <span>Score</span>
                        <span className="text-white font-mono text-xl">{score}</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                        <span>High Score</span>
                        <span className="text-amber-400 font-mono text-xl">{highScore}</span>
                    </div>
                </div>

                <button
                    onClick={onRestart}
                    className="group relative w-full flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold transition-all hover:scale-105 active:scale-95"
                >
                    <RefreshCw className="group-hover:rotate-180 transition-transform duration-500" />
                    Play Again
                </button>
            </motion.div>
        </div>
    );
};

export default GameOverModal;
