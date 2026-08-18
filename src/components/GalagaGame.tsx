import React, { useState, useEffect, useRef } from 'react';
import { Gamepad2, RotateCcw, Sparkles, ShieldAlert, LogOut } from 'lucide-react';

interface GalagaGameProps {
  onClose: () => void;
}

interface Enemy {
  x: number;
  y: number;
  width: number;
  height: number;
  alive: boolean;
  color: string;
  initialY: number;
  timeOffset: number;
}

interface Bullet {
  x: number;
  y: number;
  vy: number;
  isEnemy: boolean;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  color: string;
}

export const GalagaGame: React.FC<GalagaGameProps> = ({ onClose }) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [gameOver, setGameOver] = useState(false);
  const [victory, setVictory] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!isPlaying || gameOver || victory) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 1200;
    canvas.height = 800;

    let localScore = score;
    let localLives = lives;
    let gameStarted = false;
    let globalTime = 0;

    let particles: Particle[] = [];

    // Background Stars Setup
    let stars: {x: number, y: number, size: number, speed: number}[] = [];
    for(let i=0; i<150; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2 + 1,
        speed: Math.random() * 2 + 1
      });
    }

    // Player
    const playerWidth = 60;
    const playerHeight = 50;
    let playerX = (canvas.width - playerWidth) / 2;
    const playerY = canvas.height - 100;

    // Enemies setup
    const enemyRows = 4;
    const enemyCols = 10;
    const enemyWidth = 45;
    const enemyHeight = 35;
    const enemyPadding = 30;
    const offsetTop = 80;
    const offsetLeft = 100;

    let enemies: Enemy[] = [];
    const colors = ['#df2531', '#a855f7', '#3b82f6', '#00f3ff'];

    for (let r = 0; r < enemyRows; r++) {
      for (let c = 0; c < enemyCols; c++) {
        enemies.push({
          x: c * (enemyWidth + enemyPadding) + offsetLeft,
          y: r * (enemyHeight + enemyPadding) + offsetTop,
          initialY: r * (enemyHeight + enemyPadding) + offsetTop,
          timeOffset: c * 0.5 + r * 0.2,
          width: enemyWidth,
          height: enemyHeight,
          alive: true,
          color: colors[r % colors.length]
        });
      }
    }

    let enemyDirection = 1;
    let enemySpeed = 2.5; // Increased speed for fun

    let bullets: Bullet[] = [];
    let leftPressed = false;
    let rightPressed = false;
    let shootCooldown = 0;
    let isTouching = false; // Auto-fire on mobile

    const spawnParticles = (x: number, y: number, color: string) => {
      for (let i = 0; i < 20; i++) {
        particles.push({
          x,
          y,
          vx: (Math.random() - 0.5) * 15,
          vy: (Math.random() - 0.5) * 15,
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
        }
      }
      if (!gameStarted) return;

      if (e.key === 'ArrowLeft' || e.key === 'a') leftPressed = true;
      if (e.key === 'ArrowRight' || e.key === 'd') rightPressed = true;
      
      if (e.key === ' ' || e.key === 'ArrowUp') {
        if (shootCooldown <= 0) {
          bullets.push({
            x: playerX + playerWidth / 2 - 2,
            y: playerY - 10,
            vy: -20, // Faster player bullets
            isEnemy: false
          });
          shootCooldown = 12; // lower cooldown
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'a') leftPressed = false;
      if (e.key === 'ArrowRight' || e.key === 'd') rightPressed = false;
    };

    const handleTouchStart = (e: TouchEvent) => {
      if (!gameStarted) {
        gameStarted = true;
        return;
      }
      isTouching = true;
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const touchX = (e.touches[0].clientX - rect.left) * scaleX;
      playerX = Math.max(0, Math.min(canvas.width - playerWidth, touchX - playerWidth / 2));
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!canvas || !gameStarted) return;
      isTouching = true;
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const touchX = (e.touches[0].clientX - rect.left) * scaleX;
      playerX = Math.max(0, Math.min(canvas.width - playerWidth, touchX - playerWidth / 2));
    };
    
    const handleTouchEnd = () => {
      isTouching = false;
    };

    window.addEventListener('keydown', handleKeyDown, { passive: false });
    window.addEventListener('keyup', handleKeyUp);
    
    // Bind touch directly to canvas to prevent scrolling
    canvas.addEventListener('touchstart', handleTouchStart, { passive: false });
    canvas.addEventListener('touchmove', handleTouchMove, { passive: false });
    canvas.addEventListener('touchend', handleTouchEnd, { passive: false });

    let animationFrameId: number;

    const render = () => {
      ctx.fillStyle = '#050814';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      globalTime += 0.05;

      // Draw Starfield Background
      stars.forEach(s => {
        s.y += s.speed;
        if (s.y > canvas.height) {
          s.y = 0;
          s.x = Math.random() * canvas.width;
        }
        ctx.fillStyle = `rgba(255, 255, 255, ${s.size / 3})`;
        ctx.fillRect(s.x, s.y, s.size, s.size);
      });

      if (!gameStarted) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 36px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('PRESIONA [ENTER] O TOCA PARA INICIAR', canvas.width / 2, canvas.height / 2);
        animationFrameId = requestAnimationFrame(render);
        return;
      }

      if (shootCooldown > 0) shootCooldown--;

      // Auto-shoot on mobile touch
      if (isTouching && shootCooldown <= 0) {
        bullets.push({
          x: playerX + playerWidth / 2 - 2,
          y: playerY - 10,
          vy: -20,
          isEnemy: false
        });
        shootCooldown = 12;
      }

      // Player movement keyboard
      if (leftPressed && playerX > 10) playerX -= 14;
      if (rightPressed && playerX < canvas.width - playerWidth - 10) playerX += 14;

      // Draw advanced player spaceship
      ctx.fillStyle = '#00f3ff';
      ctx.shadowBlur = 20;
      ctx.shadowColor = '#00f3ff';
      ctx.beginPath();
      ctx.moveTo(playerX + playerWidth / 2, playerY);
      ctx.lineTo(playerX + playerWidth, playerY + playerHeight);
      ctx.lineTo(playerX + playerWidth / 2, playerY + playerHeight - 15);
      ctx.lineTo(playerX, playerY + playerHeight);
      ctx.closePath();
      ctx.fill();
      ctx.shadowBlur = 0;

      // Particles
      particles.forEach((p, idx) => {
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 0.03;
        if (p.life <= 0) {
          particles.splice(idx, 1);
        } else {
          ctx.fillStyle = p.color;
          ctx.globalAlpha = p.life;
          ctx.beginPath();
          ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
          ctx.fill();
          ctx.globalAlpha = 1.0;
        }
      });

      // Move & draw enemies
      let hitEdge = false;
      let aliveCount = 0;

      enemies.forEach(e => {
        if (!e.alive) return;
        aliveCount++;
        e.x += enemySpeed * enemyDirection;
        // Sinusoidal vertical movement for fun
        e.y = e.initialY + Math.sin(globalTime + e.timeOffset) * 20;
        
        if (e.x + e.width > canvas.width - 30 || e.x < 30) {
          hitEdge = true;
        }

        // Random enemy shoot (more aggressive)
        if (Math.random() < 0.005) {
          bullets.push({
            x: e.x + e.width / 2,
            y: e.y + e.height,
            vy: 8,
            isEnemy: true
          });
        }

        // Advanced Enemy Bug Design
        ctx.fillStyle = e.color;
        ctx.shadowBlur = 15;
        ctx.shadowColor = e.color;
        ctx.beginPath();
        ctx.arc(e.x + e.width / 2, e.y + e.height / 2, e.width / 2.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        // Alien eyes
        ctx.fillStyle = '#050814';
        ctx.beginPath();
        ctx.arc(e.x + e.width * 0.35, e.y + e.height * 0.4, 4, 0, Math.PI * 2);
        ctx.arc(e.x + e.width * 0.65, e.y + e.height * 0.4, 4, 0, Math.PI * 2);
        ctx.fill();
      });

      if (hitEdge) {
        enemyDirection *= -1;
        enemies.forEach(e => {
          e.initialY += 40; // drop down
          if (e.initialY + e.height >= playerY) {
            setGameOver(true);
          }
        });
        // increase speed slightly every drop
        enemySpeed += 0.2;
      }

      if (aliveCount === 0) {
        setVictory(true);
        return;
      }

      // Update & draw bullets
      bullets.forEach((b, bIdx) => {
        b.y += b.vy;

        // Draw bullet (laser effect)
        ctx.fillStyle = b.isEnemy ? '#df2531' : '#00f3ff';
        ctx.shadowBlur = 15;
        ctx.shadowColor = b.isEnemy ? '#df2531' : '#00f3ff';
        ctx.fillRect(b.x - 2, b.y, 4, 20);
        ctx.shadowBlur = 0;

        // Collision player bullets with enemies
        if (!b.isEnemy) {
          enemies.forEach(e => {
            if (e.alive && b.x > e.x && b.x < e.x + e.width && b.y > e.y && b.y < e.y + e.height) {
              e.alive = false;
              bullets.splice(bIdx, 1);
              localScore += 200;
              setScore(localScore);
              spawnParticles(e.x + e.width/2, e.y + e.height/2, e.color);
            }
          });
        } else {
          // Collision enemy bullets with player
          if (
            b.x > playerX &&
            b.x < playerX + playerWidth &&
            b.y > playerY &&
            b.y < playerY + playerHeight
          ) {
            bullets.splice(bIdx, 1);
            localLives -= 1;
            setLives(localLives);
            spawnParticles(playerX + playerWidth/2, playerY + playerHeight/2, '#00f3ff');
            if (localLives <= 0) {
              setGameOver(true);
              return;
            }
          }
        }

        // Remove out of bounds bullets
        if (b.y < 0 || b.y > canvas.height) {
          bullets.splice(bIdx, 1);
        }
      });

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
        canvas.removeEventListener('touchend', handleTouchEnd);
      }
    };
  }, [isPlaying, gameOver, victory]);

  return (
    <div className="fixed inset-0 z-[100] w-full flex flex-col items-center justify-center bg-[#050814]">
      
      <div className="w-full flex items-center justify-between px-4 sm:px-6 py-4 bg-[#0a0f25] border-b border-red-500/40">
        <div className="flex items-center space-x-2 sm:space-x-3">
          <Gamepad2 className="w-5 h-5 sm:w-6 sm:h-6 text-red-500" />
          <h3 className="text-sm sm:text-xl font-black text-white tracking-wider font-mono">GALAGA</h3>
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

      <div className="w-full flex-1 relative overflow-hidden bg-black flex justify-center items-center">

        {gameOver && (
          <div className="absolute inset-0 bg-black/95 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center z-20">
            <ShieldAlert className="w-16 h-16 sm:w-20 sm:h-20 text-red-500 mb-4 animate-bounce" />
            <h4 className="text-3xl sm:text-4xl font-black text-white mb-2">Misión Fallida</h4>
            <p className="text-red-400 font-mono text-xl sm:text-2xl mb-8">Puntuación: {score}</p>
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
              <span>Reintentar Misión</span>
            </button>
          </div>
        )}

        {victory && (
          <div className="absolute inset-0 bg-black/95 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center z-20">
            <Sparkles className="w-16 h-16 sm:w-20 sm:h-20 text-cyan-400 mb-4 animate-bounce" />
            <h4 className="text-3xl sm:text-4xl font-black text-white mb-2">¡Sector Limpio!</h4>
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
