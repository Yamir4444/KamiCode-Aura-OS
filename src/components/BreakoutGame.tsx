import React, { useState, useEffect, useRef } from 'react';
import { Gamepad2, RotateCcw, Sparkles, ShieldAlert, LogOut } from 'lucide-react';

interface BreakoutGameProps {
  onClose: () => void;
}

interface Brick {
  x: number;
  y: number;
  width: number;
  height: number;
  health: number;
  maxHealth: number;
  color: string;
  status: number;
}

interface PowerUp {
  x: number;
  y: number;
  type: 'paddle' | 'multiball' | 'shield' | 'fire';
  vy: number;
}

interface Ball {
  x: number;
  y: number;
  dx: number;
  dy: number;
  radius: number;
  fire: boolean;
  speedMultiplier: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  color: string;
}

export const BreakoutGame: React.FC<BreakoutGameProps> = ({ onClose }) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [gameOver, setGameOver] = useState(false);
  const [victory, setVictory] = useState(false);
  const [activePowerUpText, setActivePowerUpText] = useState<string>('');

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!isPlaying || gameOver || victory) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    let animationFrameId: number;
    let localScore = score;
    let localLives = lives;
    let gameStarted = false;

    // Set high-res internal resolution
    canvas.width = 1200;
    canvas.height = 800;

    let paddleWidth = 180;
    const paddleHeight = 20;
    let paddleX = (canvas.width - paddleWidth) / 2;
    let hasShield = false;

    let balls: Ball[] = [
      {
        x: canvas.width / 2,
        y: canvas.height - 120,
        dx: 0,
        dy: 0,
        radius: 12,
        fire: false,
        speedMultiplier: 1
      }
    ];

    let particles: Particle[] = [];

    const brickRowCount = 6;
    const brickColumnCount = 10;
    const brickPadding = 15;
    const brickOffsetTop = 80;
    const brickWidth = (canvas.width - (brickColumnCount + 1) * brickPadding) / brickColumnCount;
    const brickHeight = 35;

    let bricks: Brick[] = [];
    const baseColors = ['#df2531', '#ff4d4f', '#a855f7', '#3b82f6', '#00f3ff'];

    for (let r = 0; r < brickRowCount; r++) {
      for (let c = 0; c < brickColumnCount; c++) {
        const health = r <= 1 ? 10 : r <= 3 ? 5 : 2;
        bricks.push({
          x: c * (brickWidth + brickPadding) + brickPadding,
          y: r * (brickHeight + brickPadding) + brickOffsetTop,
          width: brickWidth,
          height: brickHeight,
          health: health,
          maxHealth: health,
          color: baseColors[r % baseColors.length],
          status: 1
        });
      }
    }

    let powerUps: PowerUp[] = [];
    let rightPressed = false;
    let leftPressed = false;

    const spawnParticles = (x: number, y: number, color: string) => {
      for (let i = 0; i < 15; i++) {
        particles.push({
          x,
          y,
          vx: (Math.random() - 0.5) * 12,
          vy: (Math.random() - 0.5) * 12,
          life: 1,
          color
        });
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if ([' ', 'Enter', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        e.preventDefault();
      }
      if (e.key === 'Escape') {
        setIsPlaying(false);
        onClose();
        return;
      }
      if (e.key === 'Enter' || e.key === ' ') {
        if (!gameStarted) {
          gameStarted = true;
          balls.forEach(b => {
            b.dx = 7 * b.speedMultiplier;
            b.dy = -7 * b.speedMultiplier;
          });
        }
      }
      if (e.key === 'Right' || e.key === 'ArrowRight' || e.key === 'd') rightPressed = true;
      if (e.key === 'Left' || e.key === 'ArrowLeft' || e.key === 'a') leftPressed = true;
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'Right' || e.key === 'ArrowRight' || e.key === 'd') rightPressed = false;
      if (e.key === 'Left' || e.key === 'ArrowLeft' || e.key === 'a') leftPressed = false;
    };

    const handleTouchStart = () => {
      if (!gameStarted) {
        gameStarted = true;
        balls.forEach(b => {
          b.dx = 7 * b.speedMultiplier;
          b.dy = -7 * b.speedMultiplier;
        });
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const touchX = (e.touches[0].clientX - rect.left) * scaleX;
      paddleX = Math.max(0, Math.min(canvas.width - paddleWidth, touchX - paddleWidth / 2));
    };

    window.addEventListener('keydown', handleKeyDown, { passive: false });
    window.addEventListener('keyup', handleKeyUp);
    
    // Bind touch events directly to the canvas for better mobile response
    canvas.addEventListener('touchstart', handleTouchStart, { passive: false });
    canvas.addEventListener('touchmove', handleTouchMove, { passive: false });

    const triggerPowerUp = (type: 'paddle' | 'multiball' | 'shield' | 'fire') => {
      if (type === 'paddle') {
        paddleWidth = Math.min(canvas.width * 0.4, paddleWidth + 60);
        setActivePowerUpText('¡EXPANSIÓN!');
      } else if (type === 'multiball') {
        const extraBalls: Ball[] = [];
        balls.forEach(b => {
          extraBalls.push({ x: b.x, y: b.y, dx: -b.dx, dy: b.dy, radius: b.radius, fire: b.fire, speedMultiplier: b.speedMultiplier });
        });
        balls.push(...extraBalls);
        setActivePowerUpText('¡MULTIBOLA!');
      } else if (type === 'shield') {
        hasShield = true;
        setActivePowerUpText('¡ESCUDO!');
      } else if (type === 'fire') {
        balls.forEach(b => b.fire = true);
        setActivePowerUpText('¡BOLA DE FUEGO!');
      }
      setTimeout(() => setActivePowerUpText(''), 2500);
    };

    const render = () => {
      ctx.fillStyle = '#050814';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      let activeBricksCount = 0;
      bricks.forEach(b => {
        if (b.status === 1) {
          activeBricksCount++;
          const alpha = Math.max(0.3, b.health / b.maxHealth);
          ctx.fillStyle = b.color;
          ctx.globalAlpha = alpha;
          ctx.shadowBlur = 12;
          ctx.shadowColor = b.color;
          ctx.fillRect(b.x, b.y, b.width, b.height);
          ctx.globalAlpha = 1.0;
          ctx.shadowBlur = 0;

          if (b.maxHealth > 2) {
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 16px monospace';
            ctx.textAlign = 'center';
            ctx.fillText(`${b.health}`, b.x + b.width / 2, b.y + b.height / 2 + 5);
          }
        }
      });

      if (activeBricksCount === 0) {
        setVictory(true);
        return;
      }

      // Particles
      particles.forEach((p, idx) => {
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 0.02;
        if (p.life <= 0) {
          particles.splice(idx, 1);
        } else {
          ctx.fillStyle = p.color;
          ctx.globalAlpha = p.life;
          ctx.fillRect(p.x, p.y, 6, 6);
          ctx.globalAlpha = 1.0;
        }
      });

      if (hasShield) {
        ctx.fillStyle = 'rgba(0, 243, 255, 0.4)';
        ctx.fillRect(0, canvas.height - 20, canvas.width, 10);
      }

      // Draw Paddle
      ctx.fillStyle = '#00f3ff';
      ctx.shadowBlur = 20;
      ctx.shadowColor = '#00f3ff';
      ctx.fillRect(paddleX, canvas.height - 50, paddleWidth, paddleHeight);
      ctx.shadowBlur = 0;

      if (!gameStarted && balls.length === 1) {
        balls[0].x = paddleX + paddleWidth / 2;
        balls[0].y = canvas.height - 50 - balls[0].radius;
      }

      // PowerUps
      powerUps.forEach((p, idx) => {
        p.y += p.vy;
        ctx.fillStyle = p.type === 'paddle' ? '#3b82f6' : p.type === 'multiball' ? '#a855f7' : p.type === 'shield' ? '#10b981' : '#df2531';
        ctx.beginPath();
        ctx.arc(p.x, p.y, 14, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 14px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(p.type === 'paddle' ? 'P' : p.type === 'multiball' ? 'M' : p.type === 'shield' ? 'S' : 'F', p.x, p.y + 5);

        if (
          p.x > paddleX &&
          p.x < paddleX + paddleWidth &&
          p.y > canvas.height - 65 &&
          p.y < canvas.height - 20
        ) {
          triggerPowerUp(p.type);
          powerUps.splice(idx, 1);
        } else if (p.y > canvas.height) {
          powerUps.splice(idx, 1);
        }
      });

      // Balls
      balls.forEach((ball, bIdx) => {
        if (gameStarted) {
          ball.x += ball.dx;
          ball.y += ball.dy;
        }

        if (ball.x + ball.radius > canvas.width || ball.x - ball.radius < 0) {
          ball.dx = -ball.dx;
        }
        if (ball.y - ball.radius < 0) {
          ball.dy = -ball.dy;
        }

        if (
          ball.y + ball.radius >= canvas.height - 50 &&
          ball.y - ball.radius <= canvas.height - 30 &&
          ball.x >= paddleX &&
          ball.x <= paddleX + paddleWidth
        ) {
          // Aumenta la velocidad ligeramente en cada rebote para hacerlo más divertido
          ball.speedMultiplier = Math.min(1.5, ball.speedMultiplier + 0.02); 
          ball.dy = -Math.abs(ball.dy);
          const hitPos = (ball.x - (paddleX + paddleWidth / 2)) / (paddleWidth / 2);
          ball.dx = hitPos * 12 * ball.speedMultiplier;
          ball.dy = Math.min(-7 * ball.speedMultiplier, -5); // Ensure it doesn't get too flat
          spawnParticles(ball.x, ball.y, '#00f3ff');
        }

        if (ball.y > canvas.height) {
          if (hasShield) {
            hasShield = false;
            ball.dy = -Math.abs(ball.dy);
            spawnParticles(ball.x, ball.y, '#10b981');
          } else {
            balls.splice(bIdx, 1);
            if (balls.length === 0) {
              localLives -= 1;
              setLives(localLives);
              if (localLives <= 0) {
                setGameOver(true);
                return;
              } else {
                gameStarted = false;
                balls.push({
                  x: canvas.width / 2,
                  y: canvas.height - 120,
                  dx: 0,
                  dy: 0,
                  radius: 12,
                  fire: false,
                  speedMultiplier: 1
                });
              }
            }
          }
        }

        bricks.forEach(brick => {
          if (brick.status === 1) {
            if (
              ball.x + ball.radius > brick.x &&
              ball.x - ball.radius < brick.x + brick.width &&
              ball.y + ball.radius > brick.y &&
              ball.y - ball.radius < brick.y + brick.height
            ) {
              if (ball.fire) {
                brick.health = 0;
              } else {
                brick.health -= 1;
              }

              if (brick.health <= 0) {
                brick.status = 0;
                localScore += 150;
                setScore(localScore);
                spawnParticles(brick.x + brick.width/2, brick.y + brick.height/2, brick.color);

                if (Math.random() < 0.25) { // 25% chance of powerup
                  const types: ('paddle' | 'multiball' | 'shield' | 'fire')[] = ['paddle', 'multiball', 'shield', 'fire'];
                  const chosenType = types[Math.floor(Math.random() * types.length)];
                  powerUps.push({
                    x: brick.x + brick.width / 2,
                    y: brick.y + brick.height,
                    type: chosenType,
                    vy: 5
                  });
                }
              }
              if (!ball.fire) {
                ball.dy = -ball.dy;
              }
            }
          }
        });

        ctx.beginPath();
        ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
        ctx.fillStyle = ball.fire ? '#df2531' : '#00f3ff';
        ctx.shadowBlur = 18;
        ctx.shadowColor = ball.fire ? '#df2531' : '#00f3ff';
        ctx.fill();
        ctx.closePath();
        ctx.shadowBlur = 0;
      });

      if (rightPressed && paddleX < canvas.width - paddleWidth) {
        paddleX += 14;
      } else if (leftPressed && paddleX > 0) {
        paddleX -= 14;
      }

      if (!gameStarted) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 36px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('PRESIONA [ENTER] O TOCA PARA INICIAR', canvas.width / 2, canvas.height / 2);
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      if (canvas) {
        canvas.removeEventListener('touchstart', handleTouchStart);
        canvas.removeEventListener('touchmove', handleTouchMove);
      }
    };
  }, [isPlaying, gameOver, victory]); 

  return (
    <div className="fixed inset-0 z-[100] w-full flex flex-col items-center justify-center bg-[#050814]">
      
      {/* HUD Bar */}
      <div className="w-full flex items-center justify-between px-4 sm:px-6 py-4 bg-[#0a0f25] border-b border-red-500/40">
        <div className="flex items-center space-x-2 sm:space-x-3">
          <Gamepad2 className="w-5 h-5 sm:w-6 sm:h-6 text-red-500" />
          <h3 className="text-sm sm:text-xl font-black text-white tracking-wider font-mono">NEOBREAKOUT</h3>
        </div>
        <div className="flex items-center space-x-3 sm:space-x-6 font-mono text-xs sm:text-sm">
          <span className="text-red-400 font-bold sm:text-lg">PTS: {score}</span>
          <span className="text-cyan-400 font-bold sm:text-lg">{'❤️'.repeat(Math.max(0, lives))}</span>
          <button
            onClick={onClose}
            className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl bg-red-600/20 border border-red-500/50 text-red-400 hover:bg-red-600 hover:text-white transition-all flex items-center space-x-1"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Salir</span>
          </button>
        </div>
      </div>

      {activePowerUpText && (
        <div className="absolute top-24 px-6 py-2 rounded-xl bg-red-600 text-white font-mono font-bold text-lg shadow-[0_0_25px_rgba(220,38,38,0.8)] z-50 animate-bounce">
          {activePowerUpText}
        </div>
      )}

      {/* BIG Canvas Container */}
      <div className="w-full flex-1 relative overflow-hidden bg-black flex justify-center items-center">
        
        {gameOver && (
          <div className="absolute inset-0 bg-black/95 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center z-20">
            <ShieldAlert className="w-16 h-16 sm:w-20 sm:h-20 text-red-500 mb-3 animate-bounce" />
            <h4 className="text-3xl sm:text-4xl font-black text-white mb-2">Simulación Terminada</h4>
            <p className="text-red-400 font-mono text-xl sm:text-2xl mb-8">Puntuación Final: {score}</p>
            <button
              onClick={() => {
                setScore(0);
                setLives(3);
                setGameOver(false);
                setVictory(false);
                setIsPlaying(true);
              }}
              className="px-6 py-3 sm:px-8 sm:py-4 rounded-xl font-bold text-white bg-gradient-to-r from-red-600 to-rose-500 shadow-[0_0_30px_rgba(220,38,38,0.6)] hover:scale-105 transition-all flex items-center space-x-2"
            >
              <RotateCcw className="w-5 h-5 sm:w-6 sm:h-6" />
              <span>Reintentar</span>
            </button>
          </div>
        )}

        {victory && (
          <div className="absolute inset-0 bg-black/95 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center z-20">
            <Sparkles className="w-16 h-16 sm:w-20 sm:h-20 text-cyan-400 mb-3 animate-bounce" />
            <h4 className="text-3xl sm:text-4xl font-black text-white mb-2">¡Victoria Completa!</h4>
            <p className="text-cyan-300 font-mono text-xl sm:text-2xl mb-8">Puntuación: {score}</p>
            <button
              onClick={() => {
                setScore(0);
                setLives(3);
                setGameOver(false);
                setVictory(false);
                setIsPlaying(true);
              }}
              className="px-6 py-3 sm:px-8 sm:py-4 rounded-xl font-bold text-white bg-gradient-to-r from-red-600 to-rose-500 shadow-[0_0_30px_rgba(220,38,38,0.6)] hover:scale-105 transition-all flex items-center space-x-2"
            >
              <RotateCcw className="w-5 h-5 sm:w-6 sm:h-6" />
              <span>Jugar Nuevamente</span>
            </button>
          </div>
        )}

        <canvas 
          ref={canvasRef} 
          className="w-full h-full object-contain touch-none" 
          style={{ aspectRatio: '16/9' }} 
        />
      </div>
    </div>
  );
};
