import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, 
  UserPlus, 
  Shuffle, 
  Trophy, 
  RefreshCw, 
  ChevronRight,
  UserCheck,
  CircleDot,
  Target,
  Sword
} from 'lucide-react';
import confetti from 'canvas-confetti';

type Step = 'count' | 'names' | 'result';

interface Player {
  id: string;
  name: string;
  power: number;
}

const BackgroundGraphics = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Floating Cricket Balls */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={`ball-${i}`}
          initial={{ 
            x: Math.random() * 100 + '%', 
            y: Math.random() * 100 + '%',
            opacity: 0.1
          }}
          animate={{ 
            x: [
              Math.random() * 100 + '%', 
              Math.random() * 100 + '%', 
              Math.random() * 100 + '%'
            ],
            y: [
              Math.random() * 100 + '%', 
              Math.random() * 100 + '%', 
              Math.random() * 100 + '%'
            ],
            rotate: [0, 360],
            scale: [1, 1.2, 1]
          }}
          transition={{ 
            duration: 20 + Math.random() * 20, 
            repeat: Infinity, 
            ease: "linear" 
          }}
          className="absolute"
        >
          <div className="w-16 h-16 rounded-full bg-red-600/20 blur-sm flex items-center justify-center border border-red-500/30">
            <div className="w-full h-1 bg-white/10 rotate-45" />
          </div>
        </motion.div>
      ))}

      {/* Floating Bats (Sword icons as proxy) */}
      {[...Array(4)].map((_, i) => (
        <motion.div
          key={`bat-${i}`}
          initial={{ 
            x: Math.random() * 100 + '%', 
            y: Math.random() * 100 + '%',
            opacity: 0.05,
            rotate: Math.random() * 360
          }}
          animate={{ 
            y: ['-10%', '110%'],
            rotate: [0, 360]
          }}
          transition={{ 
            duration: 30 + Math.random() * 30, 
            repeat: Infinity, 
            ease: "linear" 
          }}
          className="absolute text-white"
        >
          <Sword size={80} strokeWidth={1} />
        </motion.div>
      ))}

      {/* Radial Glows */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(21,128,61,0.1),transparent_70%)]" />
    </div>
  );
};

export default function App() {
  const [step, setStep] = useState<Step>('count');
  const [playerCount, setPlayerCount] = useState<number>(10);
  const [playerNames, setPlayerNames] = useState<Player[]>([]);
  const [teamA, setTeamA] = useState<string[]>([]);
  const [teamB, setTeamB] = useState<string[]>([]);
  const [commonPlayer, setCommonPlayer] = useState<string | null>(null);

  const handleStartNaming = () => {
    const initialPlayers = Array.from({ length: playerCount }, (_, i) => ({
      id: Math.random().toString(36).substr(2, 9),
      name: '',
      power: 50
    }));
    setPlayerNames(initialPlayers);
    setStep('names');
  };

  const updatePlayerName = (id: string, name: string) => {
    setPlayerNames(prev => prev.map(p => p.id === id ? { ...p, name } : p));
  };

  const updatePlayerPower = (id: string, power: number) => {
    setPlayerNames(prev => prev.map(p => p.id === id ? { ...p, power } : p));
  };

  const generateTeams = () => {
    // Filter and prepare players
    const players = playerNames.map((p, i) => ({
      name: p.name.trim() || `Player ${i + 1}`,
      power: p.power
    }));

    // Sort by power descending
    const sortedPlayers = [...players].sort((a, b) => b.power - a.power);
    
    const isOdd = sortedPlayers.length % 2 !== 0;
    let pool = [...sortedPlayers];
    let common: string | null = null;

    if (isOdd) {
      // For odd numbers, we take the middle player or a random one to be common
      // Let's take the last one (lowest power) to keep the top ones split
      common = pool.pop()?.name || null;
    }

    const tA: string[] = [];
    const tB: string[] = [];
    let powerA = 0;
    let powerB = 0;

    // Pairwise distribution for balance
    for (let i = 0; i < pool.length; i += 2) {
      const p1 = pool[i];
      const p2 = pool[i + 1];

      if (p2) {
        // Randomly assign the pair to keep it unpredictable but balanced
        if (Math.random() > 0.5) {
          tA.push(p1.name);
          tB.push(p2.name);
          powerA += p1.power;
          powerB += p2.power;
        } else {
          tA.push(p2.name);
          tB.push(p1.name);
          powerA += p2.power;
          powerB += p1.power;
        }
      } else {
        // Should not happen with even pool, but for safety:
        tA.push(p1.name);
      }
    }

    setTeamA(tA);
    setTeamB(tB);
    setCommonPlayer(common);
    setStep('result');

    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#22c55e', '#fde68a', '#ffffff']
    });
  };

  const reset = () => {
    setStep('count');
    setPlayerNames([]);
    setTeamA([]);
    setTeamB([]);
    setCommonPlayer(null);
  };

  return (
    <div className="min-h-screen animate-gradient flex flex-col items-center py-8 px-4 sm:px-6 relative">
      <BackgroundGraphics />

      {/* Header */}
      <header className="w-full max-w-2xl mb-12 text-center relative z-10">
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex items-center justify-center gap-4 mb-4"
        >
          <div className="bg-green-500 p-4 rounded-3xl shadow-2xl shadow-green-500/40 rotate-3">
            <Trophy className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tighter text-white uppercase italic">
            Turf <span className="text-green-400">Teams</span>
          </h1>
        </motion.div>
        <p className="text-green-100/60 font-medium tracking-wide uppercase text-xs">The Ultimate Squad Randomizer</p>
      </header>

      <main className="w-full max-w-xl relative z-10">
        <AnimatePresence mode="wait">
          {step === 'count' && (
            <motion.div
              key="step-count"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              className="glass-card p-10"
            >
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center">
                  <Users className="text-green-400 w-6 h-6" />
                </div>
                <h2 className="text-2xl font-bold text-white">Squad Size</h2>
              </div>
              
              <div className="space-y-8">
                <div className="flex items-center justify-between bg-black/20 p-6 rounded-3xl border border-white/5">
                  <button 
                    onClick={() => setPlayerCount(Math.max(2, playerCount - 1))}
                    className="w-16 h-16 flex items-center justify-center bg-white/10 rounded-2xl border border-white/10 hover:bg-white/20 active:scale-90 transition-all text-3xl font-bold text-white"
                  >
                    -
                  </button>
                  <div className="text-center">
                    <input 
                      type="number"
                      min="2"
                      max="50"
                      value={playerCount === 0 ? '' : playerCount}
                      onChange={(e) => {
                        const val = parseInt(e.target.value);
                        if (!isNaN(val)) {
                          setPlayerCount(Math.min(50, val));
                        } else {
                          setPlayerCount(0);
                        }
                      }}
                      onBlur={() => {
                        if (playerCount < 2) setPlayerCount(2);
                      }}
                      className="text-6xl font-black text-white bg-transparent border-none w-32 text-center focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                    <span className="text-[10px] uppercase tracking-widest text-green-400 font-bold mt-2 block">Players</span>
                  </div>
                  <button 
                    onClick={() => setPlayerCount(Math.min(30, playerCount + 1))}
                    className="w-16 h-16 flex items-center justify-center bg-white/10 rounded-2xl border border-white/10 hover:bg-white/20 active:scale-90 transition-all text-3xl font-bold text-white"
                  >
                    +
                  </button>
                </div>
                
                <div className="flex items-center justify-center gap-2 text-green-100/40">
                  <Target size={16} />
                  <p className="text-sm font-medium">
                    {playerCount % 2 !== 0 ? "Odd squad detected. Common player mode active." : "Even squad. Perfect balance."}
                  </p>
                </div>

                <button 
                  onClick={handleStartNaming}
                  className="btn-primary w-full group"
                >
                  Set Names <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </motion.div>
          )}

          {step === 'names' && (
            <motion.div
              key="step-names"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              className="glass-card p-10"
            >
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center">
                    <UserPlus className="text-green-400 w-6 h-6" />
                  </div>
                  <h2 className="text-2xl font-bold text-white">Player Names</h2>
                </div>
                <button onClick={reset} className="p-3 rounded-xl hover:bg-white/10 text-white/40 hover:text-white transition-all">
                  <RefreshCw className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4 max-h-[45vh] overflow-y-auto pr-3 mb-10 custom-scrollbar">
                {playerNames.map((player, index) => (
                  <motion.div 
                    key={player.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.03 }}
                    className="flex flex-col gap-2 p-4 rounded-2xl bg-white/5 border border-white/10 group focus-within:bg-white/10 transition-all"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 shrink-0 rounded-lg bg-green-500/20 flex items-center justify-center text-xs font-black text-green-400 group-focus-within:bg-green-500 group-focus-within:text-white transition-all">
                        {index + 1}
                      </div>
                      <input
                        type="text"
                        placeholder={`Enter name...`}
                        value={player.name}
                        onChange={(e) => updatePlayerName(player.id, e.target.value)}
                        className="w-full bg-transparent border-none p-0 text-white placeholder:text-white/20 focus:outline-none font-bold"
                      />
                    </div>
                    
                    <div className="flex items-center gap-4 mt-2">
                      <span className="text-[10px] uppercase tracking-widest text-white/40 font-bold w-16">Power</span>
                      <input 
                        type="range"
                        min="0"
                        max="100"
                        value={player.power}
                        onChange={(e) => updatePlayerPower(player.id, parseInt(e.target.value))}
                        className="flex-1 h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-green-500"
                      />
                      <span className="text-xs font-black text-green-400 w-8 text-right">{player.power}</span>
                    </div>
                  </motion.div>
                ))}
              </div>

              <button 
                onClick={generateTeams}
                className="btn-primary w-full"
              >
                <Shuffle className="w-5 h-5" /> Randomize Squads
              </button>
            </motion.div>
          )}

          {step === 'result' && (
            <motion.div
              key="step-result"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full space-y-8"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                {/* Team A */}
                <motion.div 
                  initial={{ x: -30, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="glass-card overflow-hidden border-blue-500/30"
                >
                  <div className="bg-blue-600/80 backdrop-blur-md p-5 text-white flex items-center justify-between border-b border-white/10">
                    <h3 className="font-black italic uppercase tracking-tighter text-lg">Alpha Squad</h3>
                    <CircleDot className="w-5 h-5 opacity-50" />
                  </div>
                  <div className="p-8 space-y-4">
                    {teamA.map((name, i) => (
                      <motion.div 
                        key={i} 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 + (i * 0.1) }}
                        className="flex items-center gap-4 p-3 rounded-2xl bg-white/5 border border-white/5"
                      >
                        <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center text-xs font-black">
                          {i + 1}
                        </div>
                        <span className="font-bold text-white tracking-tight">{name}</span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                {/* Team B */}
                <motion.div 
                  initial={{ x: 30, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="glass-card overflow-hidden border-orange-500/30"
                >
                  <div className="bg-orange-600/80 backdrop-blur-md p-5 text-white flex items-center justify-between border-b border-white/10">
                    <h3 className="font-black italic uppercase tracking-tighter text-lg">Beta Squad</h3>
                    <CircleDot className="w-5 h-5 opacity-50" />
                  </div>
                  <div className="p-8 space-y-4">
                    {teamB.map((name, i) => (
                      <motion.div 
                        key={i} 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 + (i * 0.1) }}
                        className="flex items-center gap-4 p-3 rounded-2xl bg-white/5 border border-white/5"
                      >
                        <div className="w-8 h-8 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center text-xs font-black">
                          {i + 1}
                        </div>
                        <span className="font-bold text-white tracking-tight">{name}</span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </div>

              {/* Common Player */}
              {commonPlayer && (
                <motion.div 
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.8, type: "spring" }}
                  className="bg-yellow-400/10 backdrop-blur-xl border-2 border-dashed border-yellow-400/30 rounded-3xl p-8 text-center"
                >
                  <div className="flex items-center justify-center gap-3 text-yellow-400 mb-3">
                    <UserCheck className="w-6 h-6" />
                    <span className="font-black uppercase tracking-[0.2em] text-xs">Common Player</span>
                  </div>
                  <p className="text-4xl font-black text-white italic tracking-tighter">{commonPlayer}</p>
                  <p className="text-[10px] text-yellow-400/60 uppercase font-bold mt-3 tracking-widest">Plays for both squads</p>
                </motion.div>
              )}

              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={generateTeams}
                  className="flex-1 bg-white/10 border border-white/10 hover:bg-white/20 text-white font-bold py-5 px-8 rounded-2xl transition-all flex items-center justify-center gap-3 shadow-xl backdrop-blur-md"
                >
                  <Shuffle className="w-6 h-6" /> Re-shuffle
                </button>
                <button 
                  onClick={reset}
                  className="flex-1 bg-white text-black font-bold py-5 px-8 rounded-2xl transition-all flex items-center justify-center gap-3 shadow-2xl hover:bg-green-50"
                >
                  <RefreshCw className="w-6 h-6" /> New Session
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="mt-auto pt-16 text-white/30 text-[10px] text-center relative z-10 font-bold uppercase tracking-[0.3em]">
        <p>© {new Date().getFullYear()} Turf Cricket Squads</p>
        <p className="mt-2">Built for the love of the game by <span className="text-white/60">Jay P Ghughriwala</span></p>
      </footer>
    </div>
  );
}
