import React from 'react';
import { Trophy, Activity } from 'lucide-react';

const ScoreBoard = ({ score, highScore }) => {
    return (
        <div className="absolute top-4 left-0 right-0 flex justify-center gap-8 pointer-events-none z-10">
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800/80 backdrop-blur border border-slate-600 shadow-xl">
                <Activity size={20} className="text-emerald-400" />
                <span className="text-xl font-bold font-mono text-emerald-100">{score.toString().padStart(3, '0')}</span>
            </div>

            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800/80 backdrop-blur border border-slate-600 shadow-xl">
                <Trophy size={20} className="text-amber-400" />
                <span className="text-xl font-bold font-mono text-amber-100">{highScore.toString().padStart(3, '0')}</span>
            </div>
        </div>
    );
};

export default ScoreBoard;
