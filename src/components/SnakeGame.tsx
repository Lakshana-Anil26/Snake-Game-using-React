import React, { useState, useEffect, useCallback, useRef } from 'react';

// Grid size
const GRID_SIZE = 20;
const CELL_SIZE = 20;

// Directions
const DIRECTIONS = {
  ArrowUp: { x: 0, y: -1 },
  ArrowDown: { x: 0, y: 1 },
  ArrowLeft: { x: -1, y: 0 },
  ArrowRight: { x: 1, y: 0 }
};

type Point = { x: number; y: number };

interface SnakeGameProps {
  onScoreChange: (score: number) => void;
}

export default function SnakeGame({ onScoreChange }: SnakeGameProps) {
  const [snake, setSnake] = useState<Point[]>([
    { x: 10, y: 10 },
    { x: 10, y: 11 },
    { x: 10, y: 12 }
  ]);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [direction, setDirection] = useState<Point>(DIRECTIONS.ArrowUp);
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [score, setScore] = useState(0);

  const directionRef = useRef(direction);
  const gameLoopRef = useRef<NodeJS.Timeout | null>(null);

  // Sync ref with state
  useEffect(() => {
    directionRef.current = direction;
  }, [direction]);

  const generateFood = useCallback((currentSnake: Point[]): Point => {
    let newFood: Point;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE)
      };
      // eslint-disable-next-line no-loop-func
      const isOnSnake = currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y);
      if (!isOnSnake) break;
    }
    return newFood;
  }, []);

  const resetGame = () => {
    const initialSnake = [
      { x: 10, y: 10 },
      { x: 10, y: 11 },
      { x: 10, y: 12 }
    ];
    setSnake(initialSnake);
    setDirection(DIRECTIONS.ArrowUp);
    directionRef.current = DIRECTIONS.ArrowUp;
    setFood(generateFood(initialSnake));
    setGameOver(false);
    setIsPaused(false);
    setScore(0);
    onScoreChange(0);
  };

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (gameOver) {
        if (e.key === 'Enter') resetGame();
        return;
      }

      if (e.key === ' ') {
        e.preventDefault();
        setIsPaused(prev => !prev);
        return;
      }

      if (isPaused) return;

      const newDirection = DIRECTIONS[e.key as keyof typeof DIRECTIONS];
      if (newDirection) {
        e.preventDefault(); // Prevent scrolling
        const currentDir = directionRef.current;
        // Prevent 180 degree turns
        if (
          !(newDirection.x === -currentDir.x && currentDir.y === 0) &&
          !(newDirection.y === -currentDir.y && currentDir.x === 0)
        ) {
          setDirection(newDirection);
        }
      }
    },
    [gameOver, isPaused]
  );
  
  // Need to correctly access currentDirection above
  // Let's fix that below.

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const moveSnake = useCallback(() => {
    if (gameOver || isPaused) return;

    setSnake(prevSnake => {
      const head = prevSnake[0];
      const newHead = {
        x: head.x + directionRef.current.x,
        y: head.y + directionRef.current.y
      };

      // Check wall collision
      if (
        newHead.x < 0 ||
        newHead.x >= GRID_SIZE ||
        newHead.y < 0 ||
        newHead.y >= GRID_SIZE
      ) {
        setGameOver(true);
        return prevSnake;
      }

      // Check self collision
      if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
        setGameOver(true);
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      // Check food collection
      if (newHead.x === food.x && newHead.y === food.y) {
        setFood(generateFood(newSnake));
        const newScore = score + 10;
        setScore(newScore);
        onScoreChange(newScore);
      } else {
        newSnake.pop(); // Remove tail if no food eaten
      }

      return newSnake;
    });
  }, [food, gameOver, isPaused, generateFood, score, onScoreChange]);

  useEffect(() => {
    gameLoopRef.current = setInterval(moveSnake, 150);
    return () => {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    };
  }, [moveSnake]);

  // Adjust handleKeyDown for scope issues
  return (
    <div className="flex flex-col items-center justify-center p-4 bg-black border-2 border-[#f0f] shadow-[8px_8px_0px_rgba(0,255,255,0.3)] max-w-fit mx-auto relative glitch-box">
      <div className="absolute top-0 left-0 bg-[#f0f] text-black text-xs font-mono px-2 py-1 z-10 hidden sm:block">PROCESS: SNAKE.EXE</div>
      <div 
        className="relative bg-black border-2 border-[#0ff] flex outline-none overflow-hidden mt-4 sm:mt-8 mix-blend-screen"
        style={{ width: GRID_SIZE * CELL_SIZE, height: GRID_SIZE * CELL_SIZE }}
      >
        {/* Render Food */}
        <div
          className="absolute bg-[#f0f] border border-black animate-pulse"
          style={{
            width: CELL_SIZE - 2,
            height: CELL_SIZE - 2,
            left: food.x * CELL_SIZE + 1,
            top: food.y * CELL_SIZE + 1
          }}
        />

        {/* Render Snake */}
        {snake.map((segment, index) => (
          <div
            key={`${segment.x}-${segment.y}-${index}`}
            className={`absolute border border-black ${
              index === 0 
                ? 'bg-[#0ff] z-10' 
                : 'bg-[#0ff]/80'
            }`}
            style={{
              width: CELL_SIZE - 2,
              height: CELL_SIZE - 2,
              left: segment.x * CELL_SIZE + 1,
              top: segment.y * CELL_SIZE + 1,
              transition: 'left 0.1s linear, top 0.1s linear'
            }}
          />
        ))}

        {/* Overlays */}
        {gameOver && (
          <div className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center text-center z-20">
            <h2 className="text-3xl md:text-4xl font-mono font-bold text-[#f0f] glitch-text mb-4" data-text="FATAL_ERROR">
              FATAL_ERROR
            </h2>
            <p className="text-[#0ff] font-mono mb-6 text-sm bg-black px-4 py-2 border border-[#0ff]">DATA: {score}</p>
            <button 
              onClick={resetGame}
              className="px-6 py-3 bg-black hover:bg-[#f0f] hover:text-black text-[#f0f] font-mono border-2 border-[#f0f] transition-colors cursor-pointer uppercase tracking-widest hover:glitch-box focus:outline-none"
            >
              REBOOT_SYSTEM
            </button>
          </div>
        )}
        
        {isPaused && !gameOver && (
          <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center z-20">
            <h2 className="text-2xl font-mono font-bold text-[#0ff] tracking-widest glitch-text" data-text="SYSTEM_PAUSED">SYSTEM_PAUSED</h2>
            <p className="text-[#f0f] mt-4 text-xs font-sans blink-animation">AWAITING_INPUT (SPACE)</p>
          </div>
        )}
      </div>
      
      <div className="mt-6 flex w-full flex-col sm:flex-row justify-between items-center text-[#0ff] font-sans text-xs opacity-70 gap-2">
        <span>CTRL: [ARROWS]</span>
        <span>BRK: [SPACE]</span>
      </div>
    </div>
  );
}
