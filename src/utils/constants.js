export const BOARD_SIZE = 20;
export const INITIAL_SPEED = 150;
export const SPEED_INCREMENT = 2; // Decrease speed (ms) per food eaten
export const MIN_SPEED = 50;

export const DIRECTIONS = {
    UP: { x: 0, y: -1 },
    DOWN: { x: 0, y: 1 },
    LEFT: { x: -1, y: 0 },
    RIGHT: { x: 1, y: 0 },
};

export const INITIAL_SNAKE = [
    { x: 10, y: 10 },
    { x: 10, y: 11 }, // Tail
    { x: 10, y: 12 }, // Tail end
];

export const CONTROLS = {
    w: 'UP',
    a: 'LEFT',
    s: 'DOWN',
    d: 'RIGHT',
    ArrowUp: 'UP',
    ArrowLeft: 'LEFT',
    ArrowDown: 'DOWN',
    ArrowRight: 'RIGHT',
};
