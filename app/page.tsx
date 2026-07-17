'use client';

import { useState, useEffect, useRef } from 'react';

// Tipos estructurados
type Team = { 
  id: string; 
  name: string; 
  code: string; 
  flagUrl: string;
};

// Equipos finalistas (Argentina vs España)
const finalistTeams: Team[] = [
  { id: 'team1', name: 'Argentina', code: 'ARG', flagUrl: 'https://purecatamphetamine.github.io/country-flag-icons/3x2/AR.svg' },
  { id: 'team2', name: 'España', code: 'ESP', flagUrl: 'https://purecatamphetamine.github.io/country-flag-icons/3x2/ES.svg' },
];

// Equipos del tercer puesto (Francia vs Inglaterra)
const thirdPlaceTeams: Team[] = [
  { id: 'team3', name: 'Francia', code: 'FRA', flagUrl: 'https://purecatamphetamine.github.io/country-flag-icons/3x2/FR.svg' },
  { id: 'team4', name: 'Inglaterra', code: 'ENG', flagUrl: 'https://upload.wikimedia.org/wikipedia/commons/b/be/Flag_of_England.svg' },
];

// ==========================================
// COMPONENTE: BARRA DE ESTADÍSTICAS (ESTILO SOFASCORE / FUTBIN)
// ==========================================
function MatchProgressBar({ 
  team1, 
  team2, 
  winStats 
}: { 
  team1: Team; 
  team2: Team; 
  winStats: Record<string, number>; 
}) {
  const wins1 = winStats[team1.id] || 0;
  const wins2 = winStats[team2.id] || 0;
  const total = wins1 + wins2;

  const pct1 = total === 0 ? 50 : Math.round((wins1 / total) * 100);
  const pct2 = total === 0 ? 50 : 100 - pct1;

  return (
    <div className="w-full mt-5 pt-4 border-t border-zinc-800">
      {/* Datos y Porcentajes */}
      <div className="flex justify-between items-center mb-2.5 text-xs">
        <div className="text-left">
          <span className="text-zinc-400 font-medium block text-[11px] uppercase tracking-wider">{team1.name}</span>
          <span className="text-white font-mono text-base font-black">{pct1}%</span>
        </div>
        <div className="text-zinc-600 font-bold text-[10px] uppercase tracking-widest bg-zinc-950 px-2.5 py-1 rounded-md border border-zinc-800/60">
          {total === 0 ? 'Sin registros' : `${total} Votos`}
        </div>
        <div className="text-right">
          <span className="text-zinc-400 font-medium block text-[11px] uppercase tracking-wider">{team2.name}</span>
          <span className="text-[#00e676] font-mono text-base font-black">{pct2}%</span>
        </div>
      </div>

      {/* Barra de progreso plana */}
      <div className="w-full h-2 bg-zinc-950 rounded-full overflow-hidden flex border border-zinc-800">
        <div 
          className="bg-zinc-400 h-full transition-all duration-700 ease-out" 
          style={{ width: `${pct1}%` }} 
        />
        <div 
          className="bg-[#00e676] h-full transition-all duration-700 ease-out" 
          style={{ width: `${pct2}%` }} 
        />
      </div>
    </div>
  );
}

// ==========================================
// COMPONENTE PRINCIPAL
// ==========================================
export default function WorldCupFair() {
  const [champion, setChampion] = useState<string | null>(null);
  const [thirdPlace, setThirdPlace] = useState<string | null>(null);
  const [activeMatch, setActiveMatch] = useState<{ team1: Team; team2: Team; type: 'final' | 'third' } | null>(null);
  const [winStats, setWinStats] = useState<Record<string, number>>({});

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('arcade_soccer_wins');
      if (saved) {
        setWinStats(JSON.parse(saved));
      }
    }
  }, []);

  useEffect(() => {
    if (Object.keys(winStats).length > 0) {
      localStorage.setItem('arcade_soccer_wins', JSON.stringify(winStats));
    }
  }, [winStats]);

 

  const handleGameFinished = (winnerId: string) => {
    if (activeMatch?.type === 'final') {
      setChampion(winnerId);
    } else if (activeMatch?.type === 'third') {
      setThirdPlace(winnerId);
    }

    setWinStats((prev) => ({
      ...prev,
      [winnerId]: (prev[winnerId] || 0) + 1,
    }));

    setActiveMatch(null);
  };

  

  return (
    <main className="min-h-screen bg-[#111213] text-zinc-100 flex flex-col font-sans selection:bg-[#00e676]/30">
      
      {/* 1. FUTBIN Estilo: Top Header */}
      <header className="w-full bg-[#1c1e22] border-b border-zinc-800 px-6 py-3 flex flex-wrap items-center justify-between gap-4 z-10">
        <div className="flex items-center gap-6">
          {/* Logo FUTBIN Re-imaginado */}
          <div className="flex items-center gap-2">
            <span className="bg-[#00e676] text-black font-black px-2.5 py-1 rounded text-sm tracking-tighter">WCF</span>
            <span className="font-black text-xl tracking-tight text-white">WORLD<span className="text-[#00e676]">CUP</span></span>
          </div>
          
          {/* Menú de navegación dummy para dar contexto real */}
          <nav className="hidden md:flex items-center gap-5 text-xs font-bold text-zinc-400 uppercase tracking-wider">
            <span className="text-white border-b-2 border-[#00e676] pb-1 cursor-pointer">Simulador</span>
          </nav>
        </div>

        {/* Simulador de buscador */}
       
      </header>

      {/* Banner promocional estilo FUTBIN */}
      <div className="w-full bg-gradient-to-r from-emerald-950/40 via-zinc-900 to-zinc-950 border-b border-zinc-800/80 py-2.5 px-4 text-center text-xs font-bold text-zinc-400 flex justify-center items-center gap-2">
        <span className="bg-[#00e676]/10 text-[#00e676] text-[10px] px-2 py-0.5 rounded font-black uppercase">LIVE OFFER</span>
        <span>Play the simulation matches to register your votes in real time.</span>
      </div>

      {/* Contenedor Principal de la App */}
      <div className="max-w-6xl w-full mx-auto px-4 py-8 md:py-12 flex flex-col flex-grow">
        
        {/* Cabecera / Hero */}
        <div className="flex flex-col items-center text-center mb-10">
          <h1 className="text-3xl md:text-5xl font-black tracking-tight text-white uppercase">
            WORLD CUP <span className="text-[#00e676]">CHALLENGE</span>
          </h1>
          <p className="text-zinc-500 text-sm mt-2 max-w-md font-medium">
            Record the final results by controlling your favorite teams in our integrated simulator.
          </p>

          {/* Filtros de Píldoras estéticas de FUTBIN */}
          <div className="flex gap-2.5 mt-6 flex-wrap justify-center">
            <span className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-[#00e676]/10 text-[#00e676] border border-[#00e676]/20 cursor-default">🏆 Torneo Activo</span>
          </div>
        </div>

        {/* Sección de partidos (Grid idéntico al de bases de datos) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          
          {/* Tarjeta Final */}
          <div className="bg-[#1c1e22] border border-zinc-800 p-5 rounded-xl shadow-lg hover:border-zinc-700 transition duration-300 flex flex-col justify-between">
            <MatchSetupCard 
              teams={finalistTeams}
              title="Gran Final"
              icon="🏆"
              onPlay={() => setActiveMatch({ team1: finalistTeams[0], team2: finalistTeams[1], type: 'final' })}
              winnerId={champion}
            />
            <MatchProgressBar 
              team1={finalistTeams[0]} 
              team2={finalistTeams[1]} 
              winStats={winStats} 
            />
          </div>

          {/* Tarjeta 3er Lugar */}
          <div className="bg-[#1c1e22] border border-zinc-800 p-5 rounded-xl shadow-lg hover:border-zinc-700 transition duration-300 flex flex-col justify-between">
            <MatchSetupCard 
              teams={thirdPlaceTeams}
              title="Tercer Puesto"
              icon="🥉"
              onPlay={() => setActiveMatch({ team1: thirdPlaceTeams[0], team2: thirdPlaceTeams[1], type: 'third' })}
              winnerId={thirdPlace}
            />
            <MatchProgressBar 
              team1={thirdPlaceTeams[0]} 
              team2={thirdPlaceTeams[1]} 
              winStats={winStats} 
            />
          </div>

        </div>

        {/* Botón de envío final (Abajo del todo, estético, verde menta) */}

      </div>

   

      {/* MODAL DEL JUEGO ACTIVO */}
      {activeMatch && (
        <SoccerGameModal 
          team1={activeMatch.team1} 
          team2={activeMatch.team2} 
          onClose={() => setActiveMatch(null)} 
          onWin={handleGameFinished}
        />
      )}

    </main>
  );
}

// ==========================================
// COMPONENTE: TARJETA DE PREPARACIÓN DE PARTIDO
// ==========================================
function MatchSetupCard({ teams, title, icon, onPlay, winnerId }: {
  teams: Team[];
  title: string;
  icon: string;
  onPlay: () => void;
  winnerId: string | null;
}) {
  const winner = teams.find(t => t.id === winnerId);

  if (!teams || teams.length < 2) {
    return null;
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Header Interno */}
      <div className="flex items-center justify-between border-b border-zinc-800/60 pb-3">
        <div className="flex items-center gap-2.5">
          <span className="text-2xl">{icon}</span>
          <h3 className="text-sm font-black uppercase tracking-wider text-white">{title}</h3>
        </div>
        <span className="text-[10px] font-bold text-zinc-500 font-mono bg-zinc-950 px-2 py-0.5 rounded border border-zinc-800">
          {teams[0].code} vs {teams[1].code}
        </span>
      </div>

      {/* Visual de los contrincantes */}
      <div className="flex items-center justify-between bg-zinc-950/65 p-3 rounded-lg border border-zinc-800/80 my-1">
        {/* Lado Local */}
        <div className="flex items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={teams[0].flagUrl} alt="" className="w-8 h-5.5 object-cover rounded shadow-md border border-zinc-800" />
          <span className="font-mono text-sm font-extrabold text-zinc-200">{teams[0].code}</span>
        </div>
        
        <span className="text-zinc-600 font-black text-xs font-mono tracking-widest px-2">VS</span>
        
        {/* Lado Visitante */}
        <div className="flex items-center gap-3">
          <span className="font-mono text-sm font-extrabold text-zinc-200">{teams[1].code}</span>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={teams[1].flagUrl} alt="" className="w-8 h-5.5 object-cover rounded shadow-md border border-zinc-800" />
        </div>
      </div>

      {/* Botón de Acción Estilo Base de Datos */}
      <button 
        onClick={onPlay}
        className={`w-full py-2.5 rounded-lg font-bold text-xs tracking-wider uppercase transition-all duration-200 
          ${winnerId 
            ? 'bg-emerald-500/10 border border-emerald-500/30 text-[#00e676]' 
            : 'bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-700/80'
          }`}
      >
        {winnerId ? `✔ Ganador: ${winner?.name} (Re-jugar)` : '🎮 Simular en el Campo'}
      </button>
    </div>
  );
}

// ==========================================
// COMPONENTE: MODAL CON EL MINIJUEGO DE FÚTBOL
// ==========================================
function SoccerGameModal({ team1, team2, onClose, onWin }: {
  team1: Team;
  team2: Team;
  onClose: () => void;
  onWin: (winnerId: string) => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [score, setScore] = useState({ p1: 0, p2: 0 });
  const [gameWinner, setGameWinner] = useState<Team | null>(null);

  const flagImg1Ref = useRef<HTMLImageElement | null>(null);
  const flagImg2Ref = useRef<HTMLImageElement | null>(null);


  // Cláusula de seguridad crítica
  if (!team1 || !team2) {
    return null;
  }

  // Precargar banderas
  useEffect(() => {
    if (!team1.flagUrl || !team2.flagUrl) return;

    const img1 = new Image();
    img1.src = team1.flagUrl;
    img1.crossOrigin = "anonymous";
    img1.onload = () => { flagImg1Ref.current = img1; };

    const img2 = new Image();
    img2.src = team2.flagUrl;
    img2.crossOrigin = "anonymous";
    img2.onload = () => { flagImg2Ref.current = img2; };
  }, [team1, team2]);

  

  // ==========================================
  // AUDIO SINTETIZADO ULTRA-PREMIUM (ESTADIO Y GRITO)
  // ==========================================
  const playSynthSound = (type: 'kick' | 'goal' | 'post') => {
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      const now = ctx.currentTime;

      if (type === 'kick') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(130, now);
        osc.frequency.exponentialRampToValueAtTime(30, now + 0.12);

        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);

        osc.start(now);
        osc.stop(now + 0.12);
      } 
      else if (type === 'post') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.type = 'sine';
        osc.frequency.setValueAtTime(520, now);
        osc.frequency.exponentialRampToValueAtTime(260, now + 0.18);

        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.18);

        osc.start(now);
        osc.stop(now + 0.18);
      }
      else if (type === 'goal') {
        // 1. SILBATO INICIAL DEL ÁRBITRO
        const whistle1 = ctx.createOscillator();
        const whistle2 = ctx.createOscillator();
        const whistleGain = ctx.createGain();
        
        whistle1.type = 'sine';
        whistle1.frequency.setValueAtTime(950, now);
        whistle1.frequency.linearRampToValueAtTime(970, now + 0.15);
        whistle1.frequency.linearRampToValueAtTime(950, now + 0.35);

        whistle2.type = 'sine';
        whistle2.frequency.setValueAtTime(955, now);
        whistle2.frequency.linearRampToValueAtTime(975, now + 0.15);
        whistle2.frequency.linearRampToValueAtTime(955, now + 0.35);

        whistleGain.gain.setValueAtTime(0, now);
        whistleGain.gain.linearRampToValueAtTime(0.08, now + 0.05);
        whistleGain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

        whistle1.connect(whistleGain);
        whistle2.connect(whistleGain);
        whistleGain.connect(ctx.destination);
        whistle1.start(now); whistle1.stop(now + 0.4);
        whistle2.start(now); whistle2.stop(now + 0.4);

        // 2. RUGIDO DE ESTADIO Y GRITO DE "¡GOL!"
        const bufferSize = ctx.sampleRate * 1.8;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        
        for (let i = 0; i < bufferSize; i++) {
          data[i] = Math.random() * 2 - 1;
        }

        const noiseSource = ctx.createBufferSource();
        noiseSource.buffer = buffer;

        const vocalFilter = ctx.createBiquadFilter();
        vocalFilter.type = 'bandpass';
        vocalFilter.frequency.setValueAtTime(450, now);
        vocalFilter.Q.setValueAtTime(1.2, now);

        const rumbleFilter = ctx.createBiquadFilter();
        rumbleFilter.type = 'lowpass';
        rumbleFilter.frequency.setValueAtTime(200, now);

        const crowdGain = ctx.createGain();
        crowdGain.gain.setValueAtTime(0, now);
        crowdGain.gain.linearRampToValueAtTime(0.35, now + 0.1);
        crowdGain.gain.exponentialRampToValueAtTime(0.12, now + 0.6);
        crowdGain.gain.exponentialRampToValueAtTime(0.001, now + 1.8);

        const delay = ctx.createDelay();
        delay.delayTime.setValueAtTime(0.15, now);
        const delayGain = ctx.createGain();
        delayGain.gain.setValueAtTime(0.28, now);

        noiseSource.connect(vocalFilter);
        noiseSource.connect(rumbleFilter);

        vocalFilter.connect(crowdGain);
        rumbleFilter.connect(crowdGain);
        
        crowdGain.connect(ctx.destination);

        crowdGain.connect(delay);
        delay.connect(delayGain);
        delayGain.connect(ctx.destination);
        delayGain.connect(delay);

        noiseSource.start(now);
        noiseSource.stop(now + 1.8);
      }
    } catch (e) {
      console.log("Contexto de Audio bloqueado.");
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    const W = 800; const H = 450;
    canvas.width = W; canvas.height = H;

    const gravity = 0.55;
    
    let screenShakeTime = 0;
    let goalTextTimer = 0;
    let goalTextScale = 0;
    let goalTextRotation = 0;
    let flashAlpha = 0;
    
    // Bandera para evitar doble conteo de gol por turno
    let isGoalTriggered = false;

    // Configuración de Confetti
    type Particle = { 
      x: number; y: number; 
      vx: number; vy: number; 
      color: string; size: number; 
      alpha: number; rotation: number; 
      rotSpeed: number; sway: number;
    };
    let particles: Particle[] = [];

    const spawnConfetti = (x: number, y: number) => {
      const colors = ['#f59e0b', '#ef4444', '#3b82f6', '#10b981', '#ec4899', '#ffffff', '#a855f7'];
      for (let i = 0; i < 70; i++) {
        particles.push({
          x: x,
          y: y + (Math.random() - 0.5) * 50,
          vx: (x < W / 2 ? 1 : -1) * (Math.random() * 9 + 5),
          vy: (Math.random() - 0.7) * 12,
          color: colors[Math.floor(Math.random() * colors.length)],
          size: Math.random() * 8 + 5,
          alpha: 1,
          rotation: Math.random() * Math.PI * 2,
          rotSpeed: (Math.random() - 0.5) * 0.2,
          sway: Math.random() * 0.05
        });
      }
    };

    const ball = { x: W / 2, y: 80, vx: 0, vy: 0, radius: 14, bounce: 0.78, rotation: 0 };
    
    const p1 = { 
      x: 150, y: H - 60, vx: 0, vy: 0, radius: 35, speed: 7.5, isGrounded: true,
      scaleX: 1, scaleY: 1
    };
    const p2 = { 
      x: W - 150, y: H - 60, vx: 0, vy: 0, radius: 35, speed: 7.5, isGrounded: true,
      scaleX: 1, scaleY: 1
    };

    const goals = { width: 50, height: 145, p1Y: H - 145, p2Y: H - 145 };

    const keys: { [key: string]: boolean } = {};
    const handleKeyDown = (e: KeyboardEvent) => { keys[e.key] = true; };
    const handleKeyUp = (e: KeyboardEvent) => { keys[e.key] = false; };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    let p1Score = 0; let p2Score = 0;

    const resetPositions = () => {
      ball.x = W / 2; ball.y = 50; ball.vx = 0; ball.vy = 0;
      p1.x = 150; p1.y = H - p1.radius - 30; p1.vx = 0; p1.vy = 0;
      p2.x = W - 150; p2.y = H - p2.radius - 30; p2.vx = 0; p2.vy = 0;
      isGoalTriggered = false; // Permitimos registrar goles de nuevo
    };

    const update = () => {
      const isCelebrating = goalTextTimer > 0;

      if (!isCelebrating) {
        if (keys['a'] || keys['A']) p1.vx = -p1.speed;
        else if (keys['d'] || keys['D']) p1.vx = p1.speed;
        else p1.vx = 0;
        if ((keys['w'] || keys['W']) && p1.isGrounded) { 
          p1.vy = -13.5; 
          p1.isGrounded = false;
          p1.scaleX = 0.8; p1.scaleY = 1.25;
        }

        if (keys['ArrowLeft']) p2.vx = -p2.speed;
        else if (keys['ArrowRight']) p2.vx = p2.speed;
        else p2.vx = 0;
        if (keys['ArrowUp'] && p2.isGrounded) { 
          p2.vy = -13.5; 
          p2.isGrounded = false;
          p2.scaleX = 0.8; p2.scaleY = 1.25;
        }
      } else {
        p1.vx = 0; p2.vx = 0;
      }

      p1.vy += gravity; p2.vy += gravity; ball.vy += gravity * 0.75;
      p1.x += p1.vx; p1.y += p1.vy; p2.x += p2.vx; p2.y += p2.vy;
      ball.x += ball.vx; ball.y += ball.vy;
      ball.rotation += ball.vx * 0.04;

      ball.vx *= 0.99; ball.vy *= 0.99;
      const groundY = H - 30;

      p1.scaleX += (1 - p1.scaleX) * 0.15; p1.scaleY += (1 - p1.scaleY) * 0.15;
      p2.scaleX += (1 - p2.scaleX) * 0.15; p2.scaleY += (1 - p2.scaleY) * 0.15;

      if (p1.y >= groundY - p1.radius) { 
        if (!p1.isGrounded) { p1.scaleX = 1.25; p1.scaleY = 0.8; }
        p1.y = groundY - p1.radius; p1.vy = 0; p1.isGrounded = true; 
      }
      if (p2.y >= groundY - p2.radius) { 
        if (!p2.isGrounded) { p2.scaleX = 1.25; p2.scaleY = 0.8; }
        p2.y = groundY - p2.radius; p2.vy = 0; p2.isGrounded = true; 
      }
      if (ball.y >= groundY - ball.radius) {
        ball.y = groundY - ball.radius;
        ball.vy = -Math.abs(ball.vy) * ball.bounce;
        ball.vx *= 0.96;
        if (Math.abs(ball.vy) > 1.5) playSynthSound('kick');
      }

      if (p1.x < p1.radius) p1.x = p1.radius; if (p1.x > W - p1.radius) p1.x = W - p1.radius;
      if (p2.x < p2.radius) p2.x = p2.radius; if (p2.x > W - p2.radius) p2.x = W - p2.radius;

      if (ball.x < ball.radius) { ball.x = ball.radius; ball.vx = -ball.vx * ball.bounce; playSynthSound('kick'); }
      if (ball.x > W - ball.radius) { ball.x = W - ball.radius; ball.vx = -ball.vx * ball.bounce; playSynthSound('kick'); }
      if (ball.y < ball.radius) { ball.y = ball.radius; ball.vy = -ball.vy * ball.bounce; }

      [p1, p2].forEach((player) => {
        const dx = ball.x - player.x;
        const dy = ball.y - player.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const minDist = ball.radius + player.radius;

        if (dist < minDist) {
          const overlap = minDist - dist;
          const nx = dx / dist;
          const ny = dy / dist;
          ball.x += nx * overlap;
          ball.y += ny * overlap;

          const rvx = ball.vx - player.vx;
          const rvy = ball.vy - player.vy;
          const velAlongNormal = rvx * nx + rvy * ny;

          if (velAlongNormal < 0) {
            const restitution = 0.85;
            const impulse = -(1 + restitution) * velAlongNormal;
            
            ball.vx += nx * impulse + player.vx * 0.4;
            ball.vy += ny * impulse + player.vy * 0.4;
            
            player.scaleX = 0.85; player.scaleY = 1.15;
            playSynthSound('kick');
          }
        }
      });

      const checkPostCollision = (px: number, py: number) => {
        const dx = ball.x - px;
        const dy = ball.y - py;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const postRadius = 8;

        if (dist < ball.radius + postRadius) {
          const overlap = (ball.radius + postRadius) - dist;
          const nx = dx / dist;
          const ny = dy / dist;
          ball.x += nx * overlap;
          ball.y += ny * overlap;

          const dotProduct = ball.vx * nx + ball.vy * ny;
          ball.vx = (ball.vx - 2 * dotProduct * nx) * ball.bounce;
          ball.vy = (ball.vy - 2 * dotProduct * ny) * ball.bounce;
          
          playSynthSound('post');
        }
      };
      checkPostCollision(goals.width, goals.p1Y);
      checkPostCollision(W - goals.width, goals.p2Y);

      // DETECCCIÓN DE GOL PROTEGIDA CONTRA BUG DE MULTI-CONTEO
      if (!isGoalTriggered && goalTextTimer === 0) {
        // Portería izquierda (Gol de P2)
        if (ball.x < goals.width && ball.y > goals.p1Y) {
          isGoalTriggered = true; // Bloquea más detecciones inmediatamente
          p2Score++; 
          setScore({ p1: p1Score, p2: p2Score });
          playSynthSound('goal'); 
          spawnConfetti(goals.width, ball.y);
          screenShakeTime = 28; 
          goalTextTimer = 95; 
          goalTextScale = 0; 
          flashAlpha = 0.8;
          goalTextRotation = (Math.random() - 0.5) * 0.3;
          
          if (p2Score >= 3) {
            setTimeout(() => setGameWinner(team2), 2200);
          } else {
            setTimeout(resetPositions, 2200);
          }
        }
        
        // Portería derecha (Gol de P1)
        if (ball.x > W - goals.width && ball.y > goals.p2Y) {
          isGoalTriggered = true; // Bloquea más detecciones inmediatamente
          p1Score++; 
          setScore({ p1: p1Score, p2: p2Score });
          playSynthSound('goal'); 
          spawnConfetti(W - goals.width, ball.y);
          screenShakeTime = 28; 
          goalTextTimer = 95; 
          goalTextScale = 0; 
          flashAlpha = 0.8;
          goalTextRotation = (Math.random() - 0.5) * 0.3;
          
          if (p1Score >= 3) {
            setTimeout(() => setGameWinner(team1), 2200);
          } else {
            setTimeout(resetPositions, 2200);
          }
        }
      }

      particles.forEach((p, idx) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vx += Math.sin(p.rotation) * p.sway;
        p.vy += gravity * 0.35;
        p.rotation += p.rotSpeed;
        p.alpha -= 0.012;
        if (p.alpha <= 0) particles.splice(idx, 1);
      });

      ctx.save();
      
      if (screenShakeTime > 0) {
          ctx.translate((Math.random() - 0.5) * 16, (Math.random() - 0.5) * 16);
          screenShakeTime--;
      }

      // --- DIBUJAR FONDO DEL ESTADIO VIVO (Reemplaza tu antiguo borrado de fondo por esto) ---
{
  const stdWidth = canvas.width;
  const stdHeight = canvas.height;

  ctx.save();

  // A. Cielo nocturno con gradiente suave (Sin filtros, rendimiento óptimo)
  const skyGrad = ctx.createLinearGradient(0, 0, 0, 90);
  skyGrad.addColorStop(0, '#050714');
  skyGrad.addColorStop(0.6, '#0f1326');
  skyGrad.addColorStop(1, '#1b1f38');
  ctx.fillStyle = skyGrad;
  ctx.fillRect(0, 0, stdWidth, 90);

  // B. Gradas y público (Logramos el efecto difuminado usando transparencias 'rgba' sin ralentizar)
  ctx.fillStyle = '#0f1220';
  ctx.fillRect(0, 80, stdWidth, stdHeight - 200);

  // Estructura de las gradas con líneas finas y suaves
  for (let stdY = 90; stdY < stdHeight - 120; stdY += 12) {
    ctx.fillStyle = 'rgba(23, 28, 48, 0.3)';
    ctx.fillRect(0, stdY, stdWidth, 3);
    
    // Público sutil y estilizado con colores muy suaves y transparentes
    for (let seatX = 10; seatX < stdWidth; seatX += 16) {
      const seatId = (seatX * 3 + stdY * 7) % 5;
      let crowdColor = 'rgba(38, 45, 69, 0.35)'; // Asiento vacío / apagado
      
      if (seatId === 1) crowdColor = 'rgba(239, 68, 68, 0.45)';  // Rojo translúcido
      else if (seatId === 2) crowdColor = 'rgba(59, 130, 246, 0.45)'; // Azul translúcido
      else if (seatId === 3) crowdColor = 'rgba(253, 224, 71, 0.45)'; // Amarillo translúcido
      else if (seatId === 4) crowdColor = 'rgba(255, 255, 255, 0.5)';  // Destellos suaves
      
      ctx.fillStyle = crowdColor;
      ctx.beginPath();
      // Dibujamos arcos simples (mucho más ligeros para el procesador)
      ctx.arc(seatX + (seatId % 2), stdY - 3, 3, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // C. Iluminación superior (Quitamos 'shadowBlur' porque también consume mucho)
  // En su lugar, simulamos la luz con un gradiente lineal suave de arriba a abajo
  const lightGlow = ctx.createLinearGradient(0, 70, 0, 110);
  lightGlow.addColorStop(0, 'rgba(255, 255, 255, 0.15)');
  lightGlow.addColorStop(1, 'rgba(255, 255, 255, 0)');
  ctx.fillStyle = lightGlow;
  ctx.fillRect(0, 70, stdWidth, 40);

  // Estructura del techo
  ctx.fillStyle = '#1c2030';
  ctx.fillRect(0, 70, stdWidth, 10);

  // D. Vallas publicitarias integradas (Feria escolar)
  const adPosY = stdHeight - 120;
  const adSizeH = 26;
  ctx.fillStyle = '#181d28';
  ctx.fillRect(0, adPosY, stdWidth, adSizeH);

  const singleAdW = 120;
  const adSpaceGap = 25;
  const adsData = [
    { color: '#172554', text: 'ENGLISH FAIR' },
    { color: '#7f1d1d', text: 'GOAL!!!' },
    { color: '#064e3b', text: 'WORLD CUP' },
    { color: '#4c1d95', text: 'PLAY NOW!' }
  ];

  for (let adIdx = 0; adIdx < stdWidth; adIdx += singleAdW + adSpaceGap) {
    const currentAd = adsData[(adIdx / (singleAdW + adSpaceGap)) % adsData.length];
    
    ctx.fillStyle = currentAd.color;
    ctx.fillRect(adIdx + 10, adPosY + 3, singleAdW, adSizeH - 6);
    
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 1;
    ctx.strokeRect(adIdx + 10, adPosY + 3, singleAdW, adSizeH - 6);
    
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.font = 'bold 8px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(currentAd.text, adIdx + 10 + singleAdW / 2, adPosY + 15);
  }

  // E. Pista de atletismo con colores suaves
  ctx.fillStyle = '#9b6259'; 
  ctx.fillRect(0, stdHeight - 94, stdWidth, 14);
  ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
  ctx.fillRect(0, stdHeight - 88, stdWidth, 1.2);

  // F. Césped con degradado base rápido
  const grassGrad = ctx.createLinearGradient(0, stdHeight - 80, 0, stdHeight);
  grassGrad.addColorStop(0, '#166534');
  grassGrad.addColorStop(1, '#22c55e');
  ctx.fillStyle = grassGrad;
  ctx.fillRect(0, stdHeight - 80, stdWidth, 80);

  // Franjas verdes en perspectiva
  ctx.fillStyle = 'rgba(21, 128, 61, 0.3)';
  for (let stripeIdx = -4; stripeIdx < 16; stripeIdx += 2) {
    ctx.beginPath();
    const stripeTop1 = (stripeIdx / 10) * stdWidth;
    const stripeTop2 = ((stripeIdx + 0.8) / 10) * stdWidth;
    const stripeBot1 = stdWidth / 2 + (stripeTop1 - stdWidth / 2) * 1.6;
    const stripeBot2 = stdWidth / 2 + (stripeTop2 - stdWidth / 2) * 1.6;
    
    ctx.moveTo(stripeTop1, stdHeight - 80);
    ctx.lineTo(stripeTop2, stdHeight - 80);
    ctx.lineTo(stripeBot2, stdHeight);
    ctx.lineTo(stripeBot1, stdHeight);
    ctx.closePath();
    ctx.fill();
  }

  // G. Líneas de campo de juego
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
  ctx.lineWidth = 2;

  // Línea de banda
  ctx.beginPath();
  ctx.moveTo(0, stdHeight - 80);
  ctx.lineTo(stdWidth, stdHeight - 80);
  ctx.stroke();

  // Línea divisoria
  ctx.beginPath();
  ctx.moveTo(stdWidth / 2, stdHeight - 80);
  ctx.lineTo(stdWidth / 2, stdHeight);
  ctx.stroke();

  // Círculo central elíptico
  ctx.beginPath();
  ctx.ellipse(stdWidth / 2, stdHeight - 80, 75, 20, 0, 0, Math.PI);
  ctx.stroke();

  ctx.restore();
}

// --- (A partir de aquí continúa dibujando tus porterías, los jugadores y el balón en tu juego) ---);
      
      // Iluminación
      ctx.fillStyle = 'rgba(56, 189, 248, 0.02)';
      ctx.beginPath(); ctx.moveTo(0,0); ctx.lineTo(120, H); ctx.lineTo(W - 120, H); ctx.lineTo(W, 0); ctx.fill();

      // Porterías
      const drawGoal = (x: number, isLeft: boolean, colorTheme: string) => {
        ctx.save();
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
        ctx.lineWidth = 1.5;
        
        const goalStart = isLeft ? 0 : W;
        const goalEnd = isLeft ? x : W - x;

        for (let i = goals.p1Y; i < H - 30; i += 12) {
          ctx.beginPath();
          ctx.moveTo(goalStart, i);
          ctx.lineTo(goalEnd, i + 6);
          ctx.stroke();
        }
        for (let i = goalStart; isLeft ? i < goalEnd : i > goalEnd; isLeft ? i += 10 : i -= 10) {
          ctx.beginPath();
          ctx.moveTo(i, goals.p1Y);
          ctx.lineTo(i + (isLeft ? 5 : -5), H - 30);
          ctx.stroke();
        }

        ctx.strokeStyle = colorTheme;
        ctx.lineWidth = 6;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(goalStart, goals.p1Y);
        ctx.lineTo(goalEnd, goals.p1Y);
        ctx.lineTo(goalEnd, H - 30);
        ctx.stroke();

        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(goalEnd, goals.p1Y, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      };

      drawGoal(goals.width, true, '#38bdf8');
      drawGoal(goals.width, false, '#f43f5e');

      // Césped
      for(let i=0; i < W; i+=80) {
          ctx.fillStyle = (i / 80) % 2 === 0 ? '#0f4423' : '#114f29';
          ctx.fillRect(i, groundY, 80, 30);
      }
      
      // Líneas de cancha
      ctx.strokeStyle = 'rgba(255,255,255,0.12)'; ctx.lineWidth = 4;
      ctx.beginPath(); ctx.moveTo(W/2, 0); ctx.lineTo(W/2, groundY); ctx.stroke();
      ctx.beginPath(); ctx.arc(W/2, groundY, 90, Math.PI, 0, false); ctx.stroke();

      // Render de los Jugadores
      const drawFlagPlayer = (player: any, flagImg: HTMLImageElement | null, borderStrokeColor: string) => {
        ctx.save();
        ctx.translate(player.x, player.y);
        ctx.scale(player.scaleX, player.scaleY);

        ctx.beginPath();
        ctx.arc(0, 0, player.radius, 0, Math.PI * 2);
        ctx.clip();

        if (flagImg) {
          ctx.drawImage(flagImg, -player.radius, -player.radius, player.radius * 2, player.radius * 2);
        } else {
          ctx.fillStyle = '#334155'; ctx.fill();
        }
        
        ctx.restore();

        ctx.save();
        ctx.translate(player.x, player.y);
        ctx.scale(player.scaleX, player.scaleY);
        ctx.strokeStyle = borderStrokeColor;
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.arc(0, 0, player.radius, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      };

      drawFlagPlayer(p1, flagImg1Ref.current, '#38bdf8');
      drawFlagPlayer(p2, flagImg2Ref.current, '#f43f5e');

      // Render del Balón
      ctx.save();
      ctx.translate(ball.x, ball.y);
      ctx.rotate(ball.rotation);
      ctx.shadowColor = 'rgba(255, 255, 255, 0.4)';
      ctx.shadowBlur = 10;
      ctx.fillStyle = '#ffffff'; ctx.beginPath(); ctx.arc(0, 0, ball.radius, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = '#000000'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(0, 0, ball.radius, 0, Math.PI * 2); ctx.stroke();
      
      ctx.fillStyle = '#000000';
      ctx.beginPath(); ctx.arc(0, 0, 3, 0, Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.arc(-6, -4, 2.5, 0, Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.arc(6, 4, 2.5, 0, Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.arc(-4, 6, 2.5, 0, Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.arc(4, -6, 2.5, 0, Math.PI*2); ctx.fill();
      ctx.restore();

      // Render de partículas (Confetti)
      particles.forEach((p) => {
        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
        ctx.restore();
      });

      // Animación de Gol
      if (goalTextTimer > 0) {
          if (goalTextScale < 1) {
            goalTextScale += 0.08;
          } else {
            goalTextScale = 1 + Math.sin(goalTextTimer * 0.15) * 0.06;
          }

          if (flashAlpha > 0) {
            ctx.save();
            ctx.fillStyle = `rgba(255, 255, 255, ${flashAlpha})`;
            ctx.fillRect(0, 0, W, H);
            ctx.restore();
            flashAlpha -= 0.04;
          }

          ctx.save();
          ctx.translate(W / 2, H / 2 - 30);
          ctx.scale(goalTextScale, goalTextScale);
          ctx.rotate(goalTextRotation);
          
          ctx.shadowColor = 'rgba(239, 68, 68, 0.8)';
          ctx.shadowBlur = 35;
          
          ctx.strokeStyle = '#000000';
          ctx.lineWidth = 14;
          ctx.font = 'black 110px Impact, sans-serif'; 
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.strokeText("¡GOOOOOL!", 0, 0);

          const gradient = ctx.createLinearGradient(0, -40, 0, 40);
          gradient.addColorStop(0, '#fef08a');
          gradient.addColorStop(0.5, '#f59e0b');
          gradient.addColorStop(1, '#dc2626');
          ctx.fillStyle = gradient;
          
          ctx.fillText("¡GOOOOOL!", 0, 0);
          
          ctx.restore();
          goalTextTimer--;
      }

      ctx.restore();

      if (p1Score < 3 && p2Score < 3) animationFrameId = requestAnimationFrame(update);
    };

    animationFrameId = requestAnimationFrame(update);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('keydown', handleKeyDown); window.removeEventListener('keyup', handleKeyUp);
    };
  }, [team1, team2]);

 return (
    <div className="fixed inset-0 z-50 bg-neutral-950/90 backdrop-blur-md flex flex-col items-center justify-center p-4 transition-opacity duration-300 ease-out">
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 max-w-4xl w-full flex flex-col items-center shadow-2xl relative transform transition-all duration-300 scale-100">
        
        {/* Header - English Fair Project */}
        <div className="w-full flex items-center justify-between mb-4 pb-3 border-b border-neutral-800">
          <div className="flex items-center gap-2">
            <span className="text-sm font-mono tracking-widest text-neutral-400 uppercase">WORLD CUP PREDICTIONS - SIMULATOR</span>
          </div>
          <button 
            onClick={onClose} 
            className="text-xs font-mono tracking-wider uppercase border border-neutral-700 hover:bg-neutral-800 text-neutral-300 px-3 py-1.5 rounded transition-all active:scale-95"
          >
            Close
          </button>
        </div>

        {/* Scoreboard */}
        <div className="flex items-center justify-center gap-8 my-4 w-full">
          <div className="flex items-center gap-3 w-1/3 justify-end">
            <span className="text-xl font-mono font-bold text-neutral-100">{team1.code}</span>
            <img src={team1.flagUrl} alt="" className="w-10 h-6 object-cover rounded-sm border border-neutral-800" />
          </div>

          <div className="text-3xl font-mono font-bold bg-neutral-950 px-6 py-2 rounded border border-neutral-800 shadow-inner text-neutral-100 min-w-[120px] text-center">
            <span className={score.p1 > score.p2 ? "text-white" : "text-neutral-500"}>{score.p1}</span>
            <span className="text-neutral-700 mx-2">:</span>
            <span className={score.p2 > score.p1 ? "text-white" : "text-neutral-500"}>{score.p2}</span>
          </div>

          <div className="flex items-center gap-3 w-1/3 justify-start">
            <img src={team2.flagUrl} alt="" className="w-10 h-6 object-cover rounded-sm border border-neutral-800" />
            <span className="text-xl font-mono font-bold text-neutral-100">{team2.code}</span>
          </div>
        </div>

        {/* Game Canvas */}
        <div className="border border-neutral-800 rounded-xl overflow-hidden my-4 relative shadow-2xl bg-neutral-950 w-full">
          <canvas ref={canvasRef} className="w-full h-auto aspect-[16/9] block" />
          
          {/* Game Over Screen */}
          {gameWinner && (
            <div className="absolute inset-0 bg-neutral-950/95 flex flex-col items-center justify-center text-center p-6 transition-opacity duration-500 ease-in">
              <span className="text-5xl mb-4">🏆</span>
              <h3 className="text-3xl font-mono font-bold uppercase tracking-wider text-white">
                {gameWinner.name} WINS!
              </h3>
              <p className="text-neutral-400 mt-2 text-xs font-mono max-w-sm">This result will save the prediction for this match.</p>
              <button 
                onClick={() => onWin(gameWinner.id)}
                className="mt-6 bg-white hover:bg-neutral-200 text-neutral-950 font-mono font-bold px-8 py-3 rounded-md uppercase tracking-wider text-xs transition-all active:scale-95"
              >
                Confirm & Exit
              </button>
            </div>
          )}
        </div>

        {/* Keyboard Controls Legend */}
        <div className="w-full grid grid-cols-2 gap-4 pt-4 border-t border-neutral-800 text-[10px] font-mono text-neutral-500">
          <div className="text-center border-r border-neutral-800">
            <p className="font-bold text-neutral-300 uppercase mb-1 tracking-wider">PLAYER 1 ({team1.code})</p>
            <p>MOVE: <strong className="text-neutral-300 bg-neutral-800 px-1 py-0.5 rounded">A</strong> <strong className="text-neutral-300 bg-neutral-800 px-1 py-0.5 rounded">D</strong> | JUMP: <strong className="text-neutral-300 bg-neutral-800 px-1 py-0.5 rounded">W</strong></p>
          </div>
          <div className="text-center">
            <p className="font-bold text-neutral-400 uppercase mb-1 tracking-wider">PLAYER 2 ({team2.code})</p>
            <p>MOVE: <strong className="text-neutral-300 bg-neutral-800 px-1 py-0.5 rounded">←</strong> <strong className="text-neutral-300 bg-neutral-800 px-1 py-0.5 rounded">→</strong> | JUMP: <strong className="text-neutral-300 bg-neutral-800 px-1 py-0.5 rounded">↑</strong></p>
          </div>
        </div>

      </div>
    </div>
  );
}