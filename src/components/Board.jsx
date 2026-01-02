import React from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';
import { BOARD_SIZE } from '../utils/constants';

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

            {/* Apple (Food) - Enhanced Visibility */}
            <div
                className="absolute z-20"
                style={{
                    width: `${100 / BOARD_SIZE}%`,
                    height: `${100 / BOARD_SIZE}%`,
                    left: `${(food.x / BOARD_SIZE) * 100}%`,
                    top: `${(food.y / BOARD_SIZE) * 100}%`,
                }}
            >
                <motion.div
                    key={`${food.x}-${food.y}`}
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className="w-full h-full p-[8%] filter drop-shadow-[0_0_8px_rgba(239,68,68,0.6)]"
                >
                    <svg viewBox="0 0 100 100" className="w-full h-full" style={{ overflow: 'visible' }}>
                        {/* Apple Body - Brighter Red */}
                        <circle cx="50" cy="55" r="42" fill="#dc2626" />
                        <circle cx="50" cy="55" r="42" fill="url(#appleShine)" />

                        {/* Highlight for 3D effect */}
                        <ellipse cx="38" cy="45" rx="15" ry="20" fill="rgba(255,255,255,0.4)" />

                        {/* Stem - Thicker and more visible */}
                        <path d="M50 18 Q48 8 55 3" stroke="#92400e" strokeWidth="4" strokeLinecap="round" fill="none" />

                        {/* Leaf - Larger and brighter */}
                        <path d="M50 18 Q35 8 32 28 Q45 38 50 18" fill="#16a34a" stroke="#15803d" strokeWidth="1" />

                        <defs>
                            <radialGradient id="appleShine" cx="35%" cy="35%" r="60%">
                                <stop offset="0%" stopColor="#fca5a5" stopOpacity="0.8" />
                                <stop offset="50%" stopColor="#dc2626" stopOpacity="0.3" />
                                <stop offset="100%" stopColor="#991b1b" stopOpacity="0.6" />
                            </radialGradient>
                        </defs>
                    </svg>
                </motion.div>
            </div>

            {/* Snake Segments - Realistic Design */}
            {snake.map((segment, index) => {
                const isHead = index === 0;
                const isTail = index === snake.length - 1;
                const isNeck = index === 1;

                // Calculate segment size for tapering tail
                const segmentScale = isTail ? 0.7 : isNeck ? 0.95 : 1;

                return (
                    <div
                        key={`${index}-${segment.x}-${segment.y}`}
                        className="absolute transition-none"
                        style={{
                            width: `${100 / BOARD_SIZE}%`,
                            height: `${100 / BOARD_SIZE}%`,
                            left: `${(segment.x / BOARD_SIZE) * 100}%`,
                            top: `${(segment.y / BOARD_SIZE) * 100}%`,
                            zIndex: isHead ? 30 : 10,
                        }}
                    >
                        <div className="w-full h-full flex items-center justify-center">
                            {isHead ? (
                                /* Snake Head - Rounded and Realistic */
                                <div
                                    className="relative"
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                    }}
                                >
                                    <div className={clsx(
                                        "absolute inset-0 flex items-center justify-center",
                                        direction.x === 1 ? "rotate-90" :
                                            direction.x === -1 ? "-rotate-90" :
                                                direction.y === 1 ? "rotate-180" : "rotate-0"
                                    )}>
                                        <svg viewBox="0 0 100 100" className="w-full h-full">
                                            {/* Head shape - rounded */}
                                            <ellipse cx="50" cy="50" rx="45" ry="48" fill="url(#snakeHeadGradient)" />

                                            {/* Eyes - larger and more prominent */}
                                            <g>
                                                {/* Left eye */}
                                                <ellipse cx="35" cy="40" rx="10" ry="12" fill="#1f2937" />
                                                <ellipse cx="35" cy="38" rx="7" ry="9" fill="#fbbf24" />
                                                <ellipse cx="37" cy="36" rx="4" ry="5" fill="#000" />
                                                <circle cx="38" cy="34" r="2" fill="rgba(255,255,255,0.8)" />

                                                {/* Right eye */}
                                                <ellipse cx="65" cy="40" rx="10" ry="12" fill="#1f2937" />
                                                <ellipse cx="65" cy="38" rx="7" ry="9" fill="#fbbf24" />
                                                <ellipse cx="67" cy="36" rx="4" ry="5" fill="#000" />
                                                <circle cx="68" cy="34" r="2" fill="rgba(255,255,255,0.8)" />
                                            </g>

                                            {/* Nostrils */}
                                            <circle cx="45" cy="28" r="2" fill="#065f46" opacity="0.6" />
                                            <circle cx="55" cy="28" r="2" fill="#065f46" opacity="0.6" />

                                            {/* Tongue (occasionally visible) */}
                                            <path d="M50 20 L48 10 M50 20 L52 10" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" opacity="0.7" />

                                            {/* Scale texture overlay */}
                                            <circle cx="30" cy="55" r="5" fill="#059669" opacity="0.3" />
                                            <circle cx="70" cy="55" r="5" fill="#059669" opacity="0.3" />
                                            <circle cx="50" cy="62" r="5" fill="#059669" opacity="0.3" />

                                            <defs>
                                                <radialGradient id="snakeHeadGradient" cx="40%" cy="35%">
                                                    <stop offset="0%" stopColor="#6ee7b7" />
                                                    <stop offset="40%" stopColor="#34d399" />
                                                    <stop offset="100%" stopColor="#059669" />
                                                </radialGradient>
                                            </defs>
                                        </svg>
                                    </div>
                                </div>
                            ) : isTail ? (
                                /* Tail - Tapered and rounded */
                                <div
                                    className="relative"
                                    style={{
                                        width: `${segmentScale * 100}%`,
                                        height: `${segmentScale * 100}%`,
                                    }}
                                >
                                    <svg viewBox="0 0 100 100" className="w-full h-full">
                                        <ellipse cx="50" cy="50" rx="35" ry="35" fill="url(#snakeTailGradient)" />

                                        {/* Scale pattern */}
                                        <circle cx="50" cy="40" r="6" fill="#059669" opacity="0.25" />
                                        <circle cx="40" cy="50" r="5" fill="#059669" opacity="0.25" />
                                        <circle cx="60" cy="50" r="5" fill="#059669" opacity="0.25" />

                                        <defs>
                                            <radialGradient id="snakeTailGradient" cx="50%" cy="50%">
                                                <stop offset="0%" stopColor="#6ee7b7" />
                                                <stop offset="60%" stopColor="#10b981" />
                                                <stop offset="100%" stopColor="#047857" />
                                            </radialGradient>
                                        </defs>
                                    </svg>
                                </div>
                            ) : (
                                /* Body segments - Rounded with scale texture */
                                <div
                                    className="relative"
                                    style={{
                                        width: `${segmentScale * 100}%`,
                                        height: `${segmentScale * 100}%`,
                                    }}
                                >
                                    <svg viewBox="0 0 100 100" className="w-full h-full">
                                        <circle cx="50" cy="50" r="46" fill="url(#snakeBodyGradient)" />

                                        {/* Scale pattern overlay */}
                                        <circle cx="50" cy="35" r="7" fill="#059669" opacity="0.2" />
                                        <circle cx="35" cy="50" r="6" fill="#059669" opacity="0.2" />
                                        <circle cx="65" cy="50" r="6" fill="#059669" opacity="0.2" />
                                        <circle cx="50" cy="65" r="7" fill="#059669" opacity="0.2" />

                                        {/* Belly highlight */}
                                        <ellipse cx="50" cy="50" rx="25" ry="30" fill="rgba(167, 243, 208, 0.3)" />

                                        <defs>
                                            <radialGradient id="snakeBodyGradient" cx="40%" cy="40%">
                                                <stop offset="0%" stopColor="#6ee7b7" />
                                                <stop offset="50%" stopColor="#10b981" />
                                                <stop offset="100%" stopColor="#059669" />
                                            </radialGradient>
                                        </defs>
                                    </svg>
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
