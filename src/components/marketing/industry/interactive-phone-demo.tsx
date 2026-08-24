'use client';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { C } from '../foreman-landing';
import { Play, Pause, RotateCcw, Bot } from 'lucide-react';
import { TradeId, INDUSTRY_CONTENT } from './content';

export function PhoneDemoSection({ tradeId }: { tradeId: TradeId }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(60);
  const [activeMsg, setActiveMsg] = useState(1);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const chatContainerRef = useRef<HTMLDivElement | null>(null);

  const messages = INDUSTRY_CONTENT[tradeId]?.demoMessages || [
    { sender: 'customer', text: "Hi, my AC stopped blowing cold air." },
    { sender: 'ai', text: "I can help with that. Is the system blowing warm air, or is there no air coming out at all?" },
    { sender: 'customer', text: "It's blowing warm air." },
    { sender: 'ai', text: "Got it. Our diagnostic fee is $89. I can send a technician tomorrow between 2 PM and 4 PM. Does that work?" },
    { sender: 'customer', text: "Yes, tomorrow afternoon is great." },
    { sender: 'ai', text: "Perfect! You're booked for tomorrow. I just sent a confirmation text to this number. See you then!" }
  ];

  // Synchronize chat messages with audio playback time
  useEffect(() => {
    if (messages.length === 0) return;
    const stepDuration = (duration || 60) / (messages.length + 1);
    const calculatedIndex = Math.min(
      messages.length,
      Math.max(1, Math.floor(currentTime / stepDuration) + 1)
    );
    setActiveMsg(calculatedIndex);
  }, [currentTime, duration, messages.length]);

  // Auto-scroll chat area smoothly
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [activeMsg]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(() => {
        setIsPlaying(true);
      });
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current && audioRef.current.duration) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setCurrentTime(0);
    setActiveMsg(messages.length);
  };

  const handleRestart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {});
      setIsPlaying(true);
      setCurrentTime(0);
      setActiveMsg(1);
    }
  };

  const formatTime = (timeInSeconds: number) => {
    const mins = Math.floor(timeInSeconds / 60);
    const secs = Math.floor(timeInSeconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <section id="demo" className="py-28 relative overflow-hidden" style={{ background: C.bgCard }}>
      <audio
        ref={audioRef}
        src="/audio/demo-call.wav"
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
        preload="metadata"
      />
      
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#0A0F1C] pointer-events-none" />

      <div className="max-w-[1050px] mx-auto px-6 flex flex-col lg:flex-row items-center justify-between gap-16 relative z-10">
        
        {/* Left: Copy & Ultra-Clean Sleek Audio Player */}
        <div className="flex-1 text-center lg:text-left max-w-xl">
          
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="fm-eyebrow"
            style={{ marginBottom: "14px" }}
          >
            LIVE DEMO
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            style={{
              fontFamily: 'var(--font-playfair), "Playfair Display", "Libre Baskerville", "Georgia", serif',
              fontSize: "clamp(32px, 5vw, 56px)",
              lineHeight: 1.15,
              fontWeight: 400,
              letterSpacing: "-0.02em",
              color: "#FFFFFF",
              marginBottom: "16px",
            }}
          >
            Hear the AI in Action
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
            className="fm-secsub mb-10"
          >
            It sounds like a human, reasons like your best dispatcher, and never drops a call. Experience a live 1-minute simulation.
          </motion.p>

          {/* Clean, Responsive Sleek Audio Controller */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="rounded-2xl sm:rounded-3xl border border-white/10 p-3.5 sm:p-5 bg-[#0e1628]/80 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
          >
            <div className="flex items-center gap-3 sm:gap-4">
              
              {/* Responsive Play / Pause Circular Button */}
              <motion.button
                whileHover={{ scale: 1.06, boxShadow: "0 0 25px rgba(249,122,53,0.5)" }}
                whileTap={{ scale: 0.94 }}
                onClick={togglePlay}
                className="w-11 h-11 sm:w-13 sm:h-13 rounded-full flex items-center justify-center text-white shrink-0 cursor-pointer shadow-[0_0_20px_rgba(249,122,53,0.35)] transition-all"
                style={{
                  background: `linear-gradient(135deg, ${C.accentOrange}, #D9530F)`,
                }}
                aria-label={isPlaying ? "Pause audio demo" : "Play audio demo"}
              >
                {isPlaying ? (
                  <Pause className="w-4.5 h-4.5 sm:w-5 sm:h-5 fill-current" />
                ) : (
                  <Play className="w-4.5 h-4.5 sm:w-5 sm:h-5 fill-current ml-0.5" />
                )}
              </motion.button>

              {/* Scrubber Track & Live Timer */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between text-[11px] sm:text-xs mb-1.5 sm:mb-2">
                  <div className="flex items-center gap-2 truncate">
                    <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${isPlaying ? 'bg-orange-400 animate-pulse' : 'bg-slate-500'}`} />
                    <span className="font-semibold text-white truncate text-[11px] sm:text-xs tracking-wide" style={{ fontFamily: "var(--font-outfit), sans-serif" }}>
                      {isPlaying ? "Live Call Audio" : "Sample Call (1 min)"}
                    </span>

                    {/* Clean Equalizer Waves when playing */}
                    {isPlaying && (
                      <div className="flex items-end gap-[2px] sm:gap-[2.5px] h-3 ml-0.5 shrink-0">
                        <span className="w-[2px] sm:w-[2.5px] bg-orange-400 rounded-full animate-[bounce_0.6s_infinite_ease-in-out]" style={{ height: '60%' }} />
                        <span className="w-[2px] sm:w-[2.5px] bg-orange-400 rounded-full animate-[bounce_0.8s_infinite_ease-in-out_0.1s]" style={{ height: '100%' }} />
                        <span className="w-[2px] sm:w-[2.5px] bg-orange-400 rounded-full animate-[bounce_0.5s_infinite_ease-in-out_0.2s]" style={{ height: '40%' }} />
                        <span className="w-[2px] sm:w-[2.5px] bg-orange-400 rounded-full animate-[bounce_0.7s_infinite_ease-in-out_0.15s]" style={{ height: '80%' }} />
                      </div>
                    )}
                  </div>

                  <span className="text-slate-400 font-mono text-[11px] sm:text-[12px] shrink-0 ml-2">
                    {formatTime(currentTime)} <span className="text-slate-600">/</span> {formatTime(duration)}
                  </span>
                </div>

                {/* Ultra-Thin & Sleek Scrubber Bar */}
                <div
                  className="w-full h-[3px] sm:h-1 hover:h-[5px] bg-white/10 rounded-full overflow-hidden cursor-pointer relative transition-all duration-200"
                  onClick={(e) => {
                    if (!audioRef.current) return;
                    const rect = e.currentTarget.getBoundingClientRect();
                    const clickX = e.clientX - rect.left;
                    const newRatio = Math.max(0, Math.min(1, clickX / rect.width));
                    audioRef.current.currentTime = newRatio * duration;
                    setCurrentTime(newRatio * duration);
                  }}
                >
                  <motion.div
                    className="h-full rounded-full relative"
                    style={{
                      background: `linear-gradient(90deg, ${C.accentOrange}, #FF944D)`,
                      width: `${progressPercent}%`,
                      boxShadow: "0 0 8px rgba(249,122,53,0.8)",
                    }}
                  />
                </div>
              </div>

              {/* Minimal Responsive Replay Button */}
              {currentTime > 0 && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ scale: 1.1, rotate: -45 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleRestart}
                  className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:border-white/25 transition-colors cursor-pointer shrink-0"
                  title="Replay from start"
                >
                  <RotateCcw className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </motion.button>
              )}

            </div>
          </motion.div>
        </div>

        {/* Right: Clean Phone Simulation Mockup */}
        <div className="flex-1 w-full max-w-[360px] mx-auto">
          <div className="rounded-[40px] border-[8px] border-gray-800 bg-[#0A0F1C] h-[600px] relative overflow-hidden shadow-2xl flex flex-col">
            
            {/* Notch */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-gray-800 rounded-b-2xl z-20" />
            
            {/* Header */}
            <div className="pt-10 pb-4 px-6 border-b border-gray-800 bg-gray-900/50 flex flex-col items-center">
              <div className="w-12 h-12 rounded-full flex items-center justify-center mb-2" style={{ background: C.accentOrange }}>
                <Bot size={24} color="white" />
              </div>
              <div style={{ fontFamily: "var(--font-outfit), sans-serif", fontSize: "15px", fontWeight: 700, color: "#FFFFFF" }}>
                Foreman AI Voice
              </div>
            </div>

            {/* Chat Area */}
            <div ref={chatContainerRef} className="p-4 flex flex-col gap-4 overflow-y-auto flex-1 scroll-smooth">
              <AnimatePresence>
                {messages.slice(0, activeMsg).map((m: { sender: string; text: string }, i: number) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.3 }}
                    style={{ fontFamily: "var(--font-outfit), sans-serif", fontSize: "14px", lineHeight: "1.5" }}
                    className={`p-3 rounded-2xl max-w-[85%] ${
                      m.sender === 'ai' 
                        ? 'bg-gray-800 text-white rounded-tl-sm' 
                        : 'bg-orange-500 text-white self-end rounded-tr-sm'
                    }`}
                  >
                    <div className="text-[10px] uppercase font-bold tracking-wider mb-1 opacity-70" style={{ fontFamily: "var(--font-mono), monospace" }}>
                      {m.sender === 'ai' ? 'Foreman AI' : 'Caller'}
                    </div>
                    {m.text}
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Typing indicator */}
              {isPlaying && activeMsg < messages.length && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-1 p-2">
                  <div className="w-2 h-2 rounded-full bg-gray-600 animate-bounce" />
                  <div className="w-2 h-2 rounded-full bg-gray-600 animate-bounce delay-75" />
                  <div className="w-2 h-2 rounded-full bg-gray-600 animate-bounce delay-150" />
                </motion.div>
              )}
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
