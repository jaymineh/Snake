import React from 'react';
import { Settings } from 'lucide-react';
import { GAME_SPEEDS } from '../utils/constants';
import clsx from 'clsx';

const SpeedControl = ({ currentDifficulty, onDifficultyChange, disabled = false }) => {
    return (
        <div className="flex flex-col items-center gap-2 z-10">
            <div className="flex items-center gap-2 text-slate-400 text-sm font-medium tracking-wider uppercase">
                <Settings size={14} />
                <span>Difficulty</span>
            </div>

            <div className="flex bg-slate-900/80 backdrop-blur rounded-lg p-1 border border-slate-700/50">
                {Object.values(GAME_SPEEDS).map((speed) => {
                    const isActive = currentDifficulty.value === speed.value;

                    return (
                        <button
                            key={speed.label}
                            onClick={() => onDifficultyChange(speed)}
                            disabled={disabled}
                            className={clsx(
                                "px-4 py-1.5 rounded-md text-sm font-bold transition-all duration-200",
                                disabled && "opacity-50 cursor-not-allowed",
                                isActive
                                    ? "bg-slate-700 text-white shadow-sm ring-1 ring-slate-600"
                                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
                            )}
                        >
                            {speed.label}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default SpeedControl;
