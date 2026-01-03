import React from 'react';
import { Ghost } from 'lucide-react';
import clsx from 'clsx';

const PassthroughToggle = ({ isPassthrough, onToggle, disabled = false }) => {
    return (
        <button
            onClick={onToggle}
            disabled={disabled}
            className={clsx(
                "group relative flex items-center gap-2 px-4 py-2 rounded-lg border transition-all duration-200",
                isPassthrough
                    ? "bg-purple-900/50 border-purple-500/50 text-purple-200 hover:bg-purple-900/70"
                    : "bg-slate-900/50 border-slate-700 text-slate-400 hover:border-slate-500 hover:text-slate-200",
                disabled && "opacity-50 cursor-not-allowed"
            )}
            title={isPassthrough ? "Passthrough Mode: ON" : "Passthrough Mode: OFF"}
        >
            <div className={clsx(
                "p-1 rounded-md transition-colors",
                isPassthrough ? "bg-purple-500/20" : "bg-slate-800"
            )}>
                <Ghost size={16} className={clsx(
                    "transition-transform duration-300",
                    isPassthrough && "animate-pulse"
                )} />
            </div>

            <div className="flex flex-col items-start leading-none">
                <span className="text-xs font-bold uppercase tracking-wider">Ghost Mode</span>
                <span className="text-[10px] opacity-70">
                    {isPassthrough ? "Walls disabled" : "Walls enabled"}
                </span>
            </div>

            {/* Status Indicator */}
            <div className={clsx(
                "absolute top-2 right-2 w-1.5 h-1.5 rounded-full transition-colors",
                isPassthrough ? "bg-purple-400 shadow-[0_0_8px_rgba(192,132,252,0.6)]" : "bg-slate-700"
            )} />
        </button>
    );
};

export default PassthroughToggle;
