import React from 'react';

const Key = ({ children }) => (
    <div className="w-8 h-8 flex items-center justify-center rounded bg-slate-700 border-b-2 border-slate-900 text-xs font-bold text-slate-300">
        {children}
    </div>
);

const Controls = ({ isPaused }) => {
    if (isPaused) return null; // Or show specific pause controls

    return (
        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-8 opacity-50 hover:opacity-100 transition-opacity">
            <div className="flex flex-col items-center gap-1">
                <Key>W</Key>
                <div className="flex gap-1">
                    <Key>A</Key>
                    <Key>S</Key>
                    <Key>D</Key>
                </div>
            </div>

            <div className="flex flex-col items-center gap-1">
                <Key>▲</Key>
                <div className="flex gap-1">
                    <Key>◀</Key>
                    <Key>▼</Key>
                    <Key>▶</Key>
                </div>
            </div>
        </div>
    );
};

export default Controls;
