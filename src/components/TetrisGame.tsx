import React, { useState, useEffect, useRef } from 'react';
import { Gamepad2, RotateCcw, ShieldAlert, LogOut, ArrowLeft, ArrowRight, ArrowDown, Rotate3D } from 'lucide-react';

interface TetrisGameProps {
  onClose: () => void;
}

export const TetrisGame: React.FC<TetrisGameProps> = ({ onClose }) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [level, setLevel] = useState(1);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Expose control functions to mobile buttons via refs
  const controlsRef = useRef<{
    moveLeft: () => void;
    moveRight: () => void;
    moveDown: () => void;
    rotate: () => void;
    start: () => void;
  } | null>(null);

  useEffect(() => {
    if (!isPlaying || gameOver) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const COLS = 10;
    const ROWS = 20;
    const BLOCK_SIZE = 40;

    canvas.width = COLS * BLOCK_SIZE;
    canvas.height = ROWS * BLOCK_SIZE;

    let board: (string | null)[][] = Array.from({ length: ROWS }, () => Array(COLS).fill(null));
    let localScore = score;
    let localLevel = level;
    let gameStarted = false;

    // Estado para animación de limpieza de filas
    let clearingLines: number[] = [];
    let clearTimer = 0;

    const SHAPES = [
      [[1, 1, 1, 1]], // I
      [[1, 1], [1, 1]], // O
      [[0, 1, 0], [1, 1, 1]], // T
      [[1, 0, 0], [1, 1, 1]], // L
      [[0, 0, 1], [1, 1, 1]], // J
      [[0, 1, 1], [1, 1, 0]], // S
      [[1, 1, 0], [0, 1, 1]]  // Z
    ];

    const COLORS = ['#df2531', '#10b981', '#a855f7', '#ec4899', '#3b82f6', '#eab308', '#00f3ff'];

    let currentPiece = {
      shape: SHAPES[Math.floor(Math.random() * SHAPES.length)],
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      x: 3,
      y: 0
    };

    let dropCounter = 0;
    let dropInterval = 500;
    let lastTime = performance.now();

    const updateDropInterval = () => {
      // Speed increases as level increases
      dropInterval = Math.max(100, 500 - (localLevel - 1) * 40);
    };

    const isValidMove = (shape: number[][], x: number, y: number) => {
      for (let r = 0; r < shape.length; r++) {
        for (let c = 0; c < shape[r].length; c++) {
          if (shape[r][c]) {
            let newX = x + c;
            let newY = y + r;
            if (newX < 0 || newX >= COLS || newY >= ROWS) return false;
            if (newY >= 0 && board[newY][newX]) return false;
          }
        }
      }
      return true;
    };

    const getGhostY = () => {
      let ghostY = currentPiece.y;
      while (isValidMove(currentPiece.shape, currentPiece.x, ghostY + 1)) {
        ghostY++;
      }
      return ghostY;
    };

    const mergePiece = () => {
      currentPiece.shape.forEach((row, r) => {
        row.forEach((value, c) => {
          if (value) {
            let boardY = currentPiece.y + r;
            let boardX = currentPiece.x + c;
            if (boardY >= 0) {
              board[boardY][boardX] = currentPiece.color;
            }
          }
        });
      });
    };

    const spawnPiece = () => {
      const idx = Math.floor(Math.random() * SHAPES.length);
      currentPiece = {
        shape: SHAPES[idx],
        color: COLORS[idx],
        x: 3,
        y: 0
      };
      if (!isValidMove(currentPiece.shape, currentPiece.x, currentPiece.y)) {
        setGameOver(true);
      }
    };

    const attemptMoveLeft = () => {
      if (!gameStarted || clearTimer > 0) return;
      if (isValidMove(currentPiece.shape, currentPiece.x - 1, currentPiece.y)) {
        currentPiece.x--;
      }
    };

    const attemptMoveRight = () => {
      if (!gameStarted || clearTimer > 0) return;
      if (isValidMove(currentPiece.shape, currentPiece.x + 1, currentPiece.y)) {
        currentPiece.x++;
      }
    };

    const attemptMoveDown = () => {
      if (!gameStarted || clearTimer > 0) return;
      if (isValidMove(currentPiece.shape, currentPiece.x, currentPiece.y + 1)) {
        currentPiece.y++;
      }
    };

    const attemptRotate = () => {
      if (!gameStarted || clearTimer > 0) return;
      const rotated = currentPiece.shape[0].map((_, index) =>
        currentPiece.shape.map(row => row[index]).reverse()
      );
      if (isValidMove(rotated, currentPiece.x, currentPiece.y)) {
        currentPiece.shape = rotated;
      }
    };

    const attemptStart = () => {
      if (!gameStarted) gameStarted = true;
    };

    // Attach to ref so buttons can call them
    controlsRef.current = {
      moveLeft: attemptMoveLeft,
      moveRight: attemptMoveRight,
      moveDown: attemptMoveDown,
      rotate: attemptRotate,
      start: attemptStart,
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if ([' ', 'Enter', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'w', 'a', 's', 'd'].includes(e.key)) {
        e.preventDefault(); 
      }
      if (e.key === 'Escape') {
        setIsPlaying(false);
        onClose();
        return;
      }
      if (!isPlaying || gameOver) return;

      if (e.key === 'Enter' || e.key === ' ') {
        attemptStart();
      }

      if (e.key === 'ArrowLeft' || e.key === 'a') attemptMoveLeft();
      if (e.key === 'ArrowRight' || e.key === 'd') attemptMoveRight();
      if (e.key === 'ArrowDown' || e.key === 's') attemptMoveDown();
      if (e.key === 'ArrowUp' || e.key === 'w') attemptRotate();
    };

    window.addEventListener('keydown', handleKeyDown, { passive: false });

    let animationFrameId: number;

    const update = (time: number) => {
      const deltaTime = time - lastTime;
      lastTime = time;

      ctx.fillStyle = '#050814';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      if (clearTimer > 0) {
        clearTimer -= deltaTime;
        if (clearTimer <= 0) {
          const newBoard = board.filter((_, idx) => !clearingLines.includes(idx));
          while(newBoard.length < ROWS) {
            newBoard.unshift(Array(COLS).fill(null));
          }
          board = newBoard;
          
          const points = [0, 100, 300, 500, 800];
          localScore += points[clearingLines.length] || 1000;
          setScore(localScore);

          localLevel = Math.floor(localScore / 1000) + 1;
          setLevel(localLevel);
          updateDropInterval();

          clearingLines = [];
          spawnPiece();
        }
      } else if (gameStarted) {
        dropCounter += deltaTime;
        if (dropCounter > dropInterval) {
          if (isValidMove(currentPiece.shape, currentPiece.x, currentPiece.y + 1)) {
            currentPiece.y++;
          } else {
            mergePiece();
            
            let linesToClear: number[] = [];
            for (let r = ROWS - 1; r >= 0; r--) {
              if (board[r].every(cell => cell !== null)) {
                linesToClear.push(r);
              }
            }
            if (linesToClear.length > 0) {
              clearingLines = linesToClear;
              clearTimer = 400; 
            } else {
              spawnPiece();
            }
          }
          dropCounter = 0;
        }
      }

      // Draw grid lines
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
      for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
          ctx.strokeRect(c * BLOCK_SIZE, r * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
        }
      }

      // Draw board
      board.forEach((row, r) => {
        const isClearing = clearingLines.includes(r);
        row.forEach((color, c) => {
          if (color || isClearing) {
            ctx.fillStyle = isClearing ? '#ffffff' : color!;
            ctx.shadowBlur = isClearing ? 25 : 15;
            ctx.shadowColor = isClearing ? '#ffffff' : color!;
            ctx.fillRect(c * BLOCK_SIZE + 2, r * BLOCK_SIZE + 2, BLOCK_SIZE - 4, BLOCK_SIZE - 4);
            ctx.shadowBlur = 0;
          }
        });
      });

      // Draw Ghost Piece
      if (clearTimer <= 0 && gameStarted) {
        const ghostY = getGhostY();
        currentPiece.shape.forEach((row, r) => {
          row.forEach((value, c) => {
            if (value) {
              ctx.fillStyle = currentPiece.color;
              ctx.globalAlpha = 0.2;
              ctx.fillRect((currentPiece.x + c) * BLOCK_SIZE + 2, (ghostY + r) * BLOCK_SIZE + 2, BLOCK_SIZE - 4, BLOCK_SIZE - 4);
              ctx.globalAlpha = 1.0;
            }
          });
        });
      }

      // Draw current piece
      if (clearTimer <= 0) {
        currentPiece.shape.forEach((row, r) => {
          row.forEach((value, c) => {
            if (value) {
              ctx.fillStyle = currentPiece.color;
              ctx.shadowBlur = 20;
              ctx.shadowColor = currentPiece.color;
              ctx.fillRect((currentPiece.x + c) * BLOCK_SIZE + 2, (currentPiece.y + r) * BLOCK_SIZE + 2, BLOCK_SIZE - 4, BLOCK_SIZE - 4);
              ctx.shadowBlur = 0;
            }
          });
        });
      }

      if (!gameStarted) {
        ctx.fillStyle = 'rgba(0,0,0,0.7)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 24px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('PRESIONA INICIAR', canvas.width / 2, canvas.height / 2 - 10);
      }

      animationFrameId = requestAnimationFrame(update);
    };

    animationFrameId = requestAnimationFrame(update);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isPlaying, gameOver]);

  return (
    <div className="fixed inset-0 z-[100] w-full flex flex-col items-center justify-center bg-[#050814]">
      
      <div className="w-full flex items-center justify-between px-4 sm:px-6 py-4 bg-[#0a0f25] border-b border-red-500/40">
        <div className="flex items-center space-x-2 sm:space-x-3">
          <Gamepad2 className="w-5 h-5 sm:w-6 sm:h-6 text-red-500" />
          <h3 className="text-sm sm:text-xl font-black text-white tracking-wider font-mono">TETRIS</h3>
        </div>
        <div className="flex items-center space-x-3 sm:space-x-6 font-mono text-xs sm:text-sm">
          <span className="text-red-400 font-bold sm:text-lg">LVL: {level}</span>
          <span className="text-red-400 font-bold sm:text-lg">PTS: {score}</span>
          <button
            onClick={onClose}
            className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl bg-red-600/20 border border-red-500/50 text-red-400 hover:bg-red-600 hover:text-white transition-all flex items-center space-x-1"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Salir</span>
          </button>
        </div>
      </div>

      <div className="w-full flex-1 relative overflow-hidden bg-black flex flex-col justify-center items-center pb-24 sm:pb-0">

        {gameOver && (
          <div className="absolute inset-0 bg-black/95 backdrop-blur-md flex flex-col items-center justify-center p-8 text-center z-20">
            <ShieldAlert className="w-16 h-16 sm:w-20 sm:h-20 text-red-500 mb-4 animate-bounce" />
            <h4 className="text-3xl sm:text-4xl font-black text-white mb-2">Game Over</h4>
            <p className="text-red-400 font-mono text-xl sm:text-2xl mb-6">Puntuación: {score}</p>
            <button
              onClick={() => {
                setScore(0);
                setLevel(1);
                setGameOver(false);
                setIsPlaying(true);
              }}
              className="px-6 py-3 sm:px-8 sm:py-4 rounded-xl font-bold text-white bg-gradient-to-r from-red-600 to-rose-500 shadow-[0_0_30px_rgba(220,38,38,0.6)] hover:scale-105 transition-all flex items-center space-x-2"
            >
              <RotateCcw className="w-5 h-5 sm:w-6 sm:h-6" />
              <span>Reintentar</span>
            </button>
          </div>
        )}

        <canvas ref={canvasRef} className="block w-full max-h-[80%] sm:max-h-full object-contain touch-none" style={{ aspectRatio: '1/2' }} />

        {/* Mobile On-Screen Controls Overlay */}
        <div className="absolute bottom-4 left-0 w-full px-4 flex justify-between items-center sm:hidden z-10 gap-2">
          <div className="flex gap-2">
             <button 
                onPointerDown={() => controlsRef.current?.moveLeft()} 
                className="w-14 h-14 bg-white/10 rounded-full flex items-center justify-center text-white active:bg-white/30 backdrop-blur-md"
             >
               <ArrowLeft className="w-6 h-6" />
             </button>
             <button 
                onPointerDown={() => controlsRef.current?.moveRight()} 
                className="w-14 h-14 bg-white/10 rounded-full flex items-center justify-center text-white active:bg-white/30 backdrop-blur-md"
             >
               <ArrowRight className="w-6 h-6" />
             </button>
          </div>
          <button 
              onPointerDown={() => controlsRef.current?.start()} 
              className="px-4 py-3 bg-red-600/30 border border-red-500/50 rounded-xl text-white font-mono text-xs active:bg-red-600 backdrop-blur-md"
          >
            INICIAR
          </button>
          <div className="flex gap-2">
             <button 
                onPointerDown={() => controlsRef.current?.moveDown()} 
                className="w-14 h-14 bg-white/10 rounded-full flex items-center justify-center text-white active:bg-white/30 backdrop-blur-md"
             >
               <ArrowDown className="w-6 h-6" />
             </button>
             <button 
                onPointerDown={() => controlsRef.current?.rotate()} 
                className="w-14 h-14 bg-white/10 rounded-full flex items-center justify-center text-white active:bg-white/30 backdrop-blur-md"
             >
               <Rotate3D className="w-6 h-6" />
             </button>
          </div>
        </div>

      </div>
    </div>
  );
};
