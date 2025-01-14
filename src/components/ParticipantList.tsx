import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle } from 'lucide-react';
import ReactConfetti from 'react-confetti';
import type { Participant } from '../types';

interface ParticipantListProps {
  participants: Participant[];
}

const CELEBRATION_EMOJIS = ['🎉', '🎊', '🎯', '🏆', '⭐', '🌟', '💫', '✨', '🔥', '👏'];
const EMOJI_DURATION = 4000; // 4 seconds for emoji train
const CONFETTI_DURATION = 5000; // 5 seconds for confetti
const CONFETTI_DELAY = 3000; // 4 seconds delay before confetti starts

interface AnimationState {
  showConfetti: boolean;
  showRainbow: boolean;
  showEmoji: boolean;
  key: number;
}

export const ParticipantList: React.FC<ParticipantListProps> = ({ participants }) => {
  const [completedParticipants, setCompletedParticipants] = useState<Set<string>>(new Set());
  const [animationStates, setAnimationStates] = useState<Record<string, AnimationState>>({});

  // Sort participants: completed first, then by completion time, then by name
  const sortedParticipants = [...participants].sort((a, b) => {
    if (a.status === 'completed' && b.status !== 'completed') return -1;
    if (a.status !== 'completed' && b.status === 'completed') return 1;
    if (a.status === 'completed' && b.status === 'completed') {
      return (b.completedAt?.getTime() || 0) - (a.completedAt?.getTime() || 0);
    }
    return a.name.localeCompare(b.name);
  });

  useEffect(() => {
    participants.forEach((participant) => {
      if (participant.status === 'completed' && !completedParticipants.has(participant.id)) {
        setCompletedParticipants((prev) => new Set([...prev, participant.id]));
        
        // Start with emoji train and rainbow effect
        setAnimationStates((prev) => ({
          ...prev,
          [participant.id]: {
            showConfetti: false,
            showRainbow: true,
            showEmoji: true,
            key: Date.now(),
          }
        }));
        
        // Start confetti after delay
        setTimeout(() => {
          setAnimationStates((prev) => ({
            ...prev,
            [participant.id]: {
              ...prev[participant.id],
              showConfetti: true,
            }
          }));
        }, CONFETTI_DELAY);

        // End all animations
        setTimeout(() => {
          setAnimationStates((prev) => ({
            ...prev,
            [participant.id]: {
              showConfetti: false,
              showRainbow: false,
              showEmoji: false,
              key: prev[participant.id]?.key || 0,
            }
          }));
        }, CONFETTI_DELAY + CONFETTI_DURATION);
      }
    });
  }, [participants, completedParticipants]);

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-gray-700/50">
      <h2 className="text-xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500">
        Participants Status
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <AnimatePresence>
          {sortedParticipants.map((participant) => (
            <motion.div
              key={participant.id}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              layout
              transition={{
                layout: { duration: 0.3 },
                scale: { duration: 0.2 },
                opacity: { duration: 0.2 }
              }}
              className={`relative ${
                animationStates[participant.id]?.showRainbow ? 'rainbow-border' : ''
              }`}
            >
              {animationStates[participant.id]?.showConfetti && (
                <ReactConfetti
                  width={400}
                  height={100}
                  recycle={false}
                  numberOfPieces={200}
                  gravity={0.3}
                  initialVelocityY={20}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    pointerEvents: 'none',
                    zIndex: 30
                  }}
                />
              )}
              {animationStates[participant.id]?.showEmoji && (
                <div 
                  className="absolute inset-0 flex items-center justify-center"
                  style={{
                    zIndex: 20,
                    overflow: 'hidden'
                  }}
                >
                  <motion.div
                    key={animationStates[participant.id]?.key}
                    initial={{ x: '-100%' }}
                    animate={{ x: '100%' }}
                    transition={{ duration: 4, ease: 'linear' }}
                    style={{
                      display: 'flex',
                      gap: '1.5rem',
                      position: 'absolute',
                      whiteSpace: 'nowrap',
                      zIndex: 25
                    }}
                  >
                    {CELEBRATION_EMOJIS.map((emoji, index) => (
                      <span key={index} style={{ fontSize: '3rem' }}>{emoji}</span>
                    ))}
                  </motion.div>
                </div>
              )}
              <div className="relative flex items-center justify-between p-4 bg-gray-900/50 rounded-lg border border-gray-700/50 backdrop-blur-sm hover:bg-gray-900/70 transition-colors duration-200">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <div className={`absolute -inset-1 rounded-full blur opacity-75 ${
                      animationStates[participant.id]?.showRainbow ? 'bg-gradient-to-r from-green-400 to-blue-500' : 'bg-gray-700'
                    }`}></div>
                    <div className="relative w-10 h-10 bg-gray-900 rounded-full flex items-center justify-center">
                      <span className={`font-semibold ${
                        animationStates[participant.id]?.showRainbow ? 'text-rainbow' : 'text-green-400'
                      }`}>
                        {participant.name.charAt(0)}
                      </span>
                    </div>
                  </div>
                  <div>
                    <p className={`font-medium ${
                      animationStates[participant.id]?.showRainbow ? 'text-rainbow' : 'text-gray-100'
                    }`}>
                      {participant.name}
                    </p>
                    <p className="text-sm text-gray-400">
                      {participant.completedAt
                        ? `Completed at ${participant.completedAt.toLocaleTimeString()}`
                        : 'In Progress'}
                    </p>
                  </div>
                </div>
                {participant.status === 'completed' ? (
                  <CheckCircle className="w-6 h-6 text-green-400" />
                ) : (
                  <XCircle className="w-6 h-6 text-red-400" />
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      <style>{`
        @keyframes rainbow {
          0% { color: #ff0000; }
          16.67% { color: #ff00ff; }
          33.33% { color: #0000ff; }
          50% { color: #00ffff; }
          66.67% { color: #00ff00; }
          83.33% { color: #ffff00; }
          100% { color: #ff0000; }
        }

        @keyframes rainbow-border {
          0% { border-color: #ff0000; }
          16.67% { border-color: #ff00ff; }
          33.33% { border-color: #0000ff; }
          50% { border-color: #00ffff; }
          66.67% { border-color: #00ff00; }
          83.33% { border-color: #ffff00; }
          100% { border-color: #ff0000; }
        }

        .text-rainbow {
          animation: rainbow 5s linear;
          animation-iteration-count: 1;
        }

        .rainbow-border {
          border: 2px solid transparent;
          animation: rainbow-border 5s linear;
          animation-iteration-count: 1;
          border-radius: 0.5rem;
        }
      `}</style>
    </div>
  );
};