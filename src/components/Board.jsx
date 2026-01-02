import React from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';
import { BOARD_SIZE } from '../utils/constants';

// Helper to determine border radius based on neighbors
const getSegmentStyle = (index, snake) => {
    const segment = snake[index];
    const prev = snake[index - 1]; // Towards Head
    const next = snake[index + 1]; // Towards Tail

    if (!prev && !next) return { borderRadius: '9999px' };

    const radius = "8px";
    const style = {
        borderTopLeftRadius: radius,
        borderTopRightRadius: radius,
        borderBottomRightRadius: radius,
        borderBottomLeftRadius: radius,
    };

    const isUp = (neighbor) => neighbor && neighbor.y < segment.y;
    const isDown = (neighbor) => neighbor && neighbor.y > segment.y;
    const isLeft = (neighbor) => neighbor && neighbor.x < segment.x;
    const isRight = (neighbor) => neighbor && neighbor.x > segment.x;

    if (isUp(prev)) { style.borderTopLeftRadius = 0; style.borderTopRightRadius = 0; }
    if (isDown(prev)) { style.borderBottomLeftRadius = 0; style.borderBottomRightRadius = 0; }
    if (isLeft(prev)) { style.borderTopLeftRadius = 0; style.borderBottomLeftRadius = 0; }
    if (isRight(prev)) { style.borderTopRightRadius = 0; style.borderBottomRightRadius = 0; }

    if (isUp(next)) { style.borderTopLeftRadius = 0; style.borderTopRightRadius = 0; }
    if (isDown(next)) { style.borderBottomLeftRadius = 0; style.borderBottomRightRadius = 0; }
    if (isLeft(next)) { style.borderTopLeftRadius = 0; style.borderBottomLeftRadius = 0; }
    if (isRight(next)) { style.borderTopRightRadius = 0; style.borderBottomRightRadius = 0; }

    return style;
};

const Board = ({ snake, food, direction }) => {
    const grid = Array.from({ length: BOARD_SIZE * BOARD_SIZE }, (_, i) => {
        const x = i % BOARD_SIZE;
        const y = Math.floor(i / BOARD_SIZE);
        return { x, y };
    });

    return (
        <div
            className="relative bg-slate-900/50 backdrop-blur-md rounded-xl border border-slate-700/50 shadow-2xl overflow-hidden"
            style={{
                width: 'min(90vw, 600px)',
                aspectRatio: '1/1',
                display: 'grid',
                gridTemplateColumns: `repeat(${BOARD_SIZE}, 1fr)`,
                gridTemplateRows: `repeat(${BOARD_SIZE}, 1fr)`
            }}
        >
            {/* Background Grid */}
            {grid.map((cell) => (
                <div
                    key={`bg-${cell.x}-${cell.y}`}
                    className="border-[0.5px] border-slate-800/20 w-full h-full"
                />
            ))}

            {/* Apple (Food) */}
            <div
                className="absolute flex items-center justify-center p-[5%] z-20 transition-none"
                style={{
                    width: `${100 / BOARD_SIZE}%`,
                    height: `${100 / BOARD_SIZE}%`,
                    left: `${(food.x / BOARD_SIZE) * 100}%`,
                    top: `${(food.y / BOARD_SIZE) * 100}%`,
                    transitionDuration: '0ms'
                }}
            >
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-full h-full drop-shadow-lg"
                >
                    <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
                        {/* Apple Body */}
                        <circle cx="50" cy="55" r="40" fill="#ef4444" />
                        <circle cx="50" cy="55" r="40" fill="url(#shine)" fillOpacity="0.3" />
                        {/* Stem */}
                        <path d="M50 20 Q50 5 60 0" stroke="#78350f" strokeWidth="6" fill="none" />
                        {/* Leaf */}
                        <path d="M50 20 Q30 5 30 25 Q50 35 50 20" fill="#22c55e" />

                        <defs>
                            <radialGradient id="shine" cx="30%" cy="30%" r="50%">
                                <stop offset="0%" stopColor="white" stopOpacity="0.8" />
                                <stop offset="100%" stopColor="white" stopOpacity="0" />
                            </radialGradient>
                        </defs>
                    </svg>
                </motion.div>
            </div>

            {/* SnakeSegments */}
            {snake.map((segment, index) => {
                const isHead = index === 0;
                const style = getSegmentStyle(index, snake);

                return (
                    <div
                        key={`${index}-${segment.x}-${segment.y}`}
                        className={clsx(
                            "absolute w-full h-full transition-none", // Snappy movement
                            isHead ? "z-30" : "z-10" // Head above Apple (z-20), Body below Apple? 
                            // Actually, if we eat it, head should cover it. If body hits it (bug), body overlaps?
                            // Let's make head > apple > body
                        )}
                        style={{
                            width: `${100 / BOARD_SIZE}%`,
                            height: `${100 / BOARD_SIZE}%`,
                            left: `${(segment.x / BOARD_SIZE) * 100}%`,
                            top: `${(segment.y / BOARD_SIZE) * 100}%`
                        }}
                    >
                        <div className={clsx(
                            "w-full h-full shadow-[0_0_10px_rgba(16,185,129,0.3)]",
                            isHead ? "bg-gradient-to-br from-emerald-400 to-emerald-600" : "bg-emerald-500/90",
                        )}
                            style={style}
                        >
                            {isHead && (
                                <div className={clsx(
                                    "absolute inset-0 flex items-center justify-center gap-[15%]",
                                    direction.x === 1 ? "rotate-90" :
                                        direction.x === -1 ? "-rotate-90" :
                                            direction.y === 1 ? "rotate-180" : "rotate-0"
                                )}>
                                    <div className="w-[20%] h-[20%] bg-slate-900 rounded-full relative shadow-sm">
                                        <div className="absolute top-[20%] right-[20%] w-[30%] h-[30%] bg-white rounded-full" />
                                    </div>
                                    <div className="w-[20%] h-[20%] bg-slate-900 rounded-full relative shadow-sm">
                                        <div className="absolute top-[20%] right-[20%] w-[30%] h-[30%] bg-white rounded-full" />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default Board;
