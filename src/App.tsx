import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { StatusCard } from './components/StatusCard';
import { ParticipantList } from './components/ParticipantList';
import type { Participant, ParticipantProgress } from './types';
import { CloudLightning } from 'lucide-react';

// Simulated data - replace with actual API calls
const mockParticipants: Participant[] = [
  { id: '1', name: 'hello Doe', fileUrl: 'https://example.com/1', status: 'pending' },
  { id: '2', name: 'Jane Smith', fileUrl: 'https://example.com/2', status: 'pending' },
  { id: '3', name: 'Alice Johnson', fileUrl: 'https://example.com/3', status: 'pending' },
  { id: '4', name: 'Michael Brown', fileUrl: 'https://example.com/4', status: 'pending' },
  { id: '5', name: 'Emma Wilson', fileUrl: 'https://example.com/5', status: 'pending' },
  { id: '6', name: 'James Taylor', fileUrl: 'https://example.com/6', status: 'pending' },
  { id: '7', name: 'Olivia Davis', fileUrl: 'https://example.com/7', status: 'pending' },
  { id: '8', name: 'William Martinez', fileUrl: 'https://example.com/8', status: 'pending' },
  { id: '9', name: 'Sophia Anderson', fileUrl: 'https://example.com/9', status: 'pending' },
  { id: '10', name: 'Lucas Garcia', fileUrl: 'https://example.com/10', status: 'pending' },
  { id: '11', name: 'Isabella Moore', fileUrl: 'https://example.com/11', status: 'pending' },
  { id: '12', name: 'Mason Lee', fileUrl: 'https://example.com/12', status: 'pending' },
  { id: '13', name: 'Charlotte Clark', fileUrl: 'https://example.com/13', status: 'pending' }
];

export default function App() {
  const [participants, setParticipants] = useState<Participant[]>(mockParticipants);
  const [progressData, setProgressData] = useState<ParticipantProgress[]>([]);
  const [lastCompletedIndex, setLastCompletedIndex] = useState<number>(-1);

  useEffect(() => {
    const checkUrls = async () => {
      const pendingParticipants = participants.filter(p => p.status === 'pending');
      if (pendingParticipants.length === 0) return;

      // Find the next participant to complete
      const nextParticipantIndex = participants.findIndex(
        (p, index) => p.status === 'pending' && index > lastCompletedIndex
      );

      if (nextParticipantIndex === -1) return; // No more participants to process

      const updatedParticipants = [...participants];
      const participant = updatedParticipants[nextParticipantIndex];

      // Simulate completion with 70% probability
      const shouldComplete = Math.random() > 0.3;

      if (shouldComplete) {
        updatedParticipants[nextParticipantIndex] = {
          ...participant,
          status: 'completed',
          completedAt: new Date(),
        };
        setLastCompletedIndex(nextParticipantIndex);
      }

      setParticipants(updatedParticipants);
    };

    const interval = setInterval(checkUrls, 5000);
    return () => clearInterval(interval);
  }, [participants, lastCompletedIndex]);

  const completedCount = participants.filter((p) => p.status === 'completed').length;

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.3),rgba(255,0,0,0))]" />
        <motion.div
          className="absolute inset-0 opacity-30"
          animate={{
            background: [
              'radial-gradient(circle at 0% 0%, #4f46e5 0%, transparent 50%)',
              'radial-gradient(circle at 100% 100%, #4f46e5 0%, transparent 50%)',
              'radial-gradient(circle at 0% 0%, #4f46e5 0%, transparent 50%)',
            ],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8 relative z-10">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex items-center space-x-4 mb-8 bg-gray-800/50 p-6 rounded-xl backdrop-blur-sm border border-gray-700/50"
        >
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-green-400 to-blue-500 rounded-full blur opacity-75"></div>
            <div className="relative bg-gray-900 rounded-full p-2">
              <CloudLightning className="w-10 h-10 text-green-400" />
            </div>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500">
              Tech Academy
            </h1>
            <p className="text-gray-400 mt-1"></p>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <StatusCard
            title="Total Participants"
            value={participants.length}
            icon="participants"
          />
          <StatusCard
            title="Completed"
            value={completedCount}
            icon="completed"
          />
        </div>

        <div className="w-full max-w-3xl mx-auto">
          <ParticipantList participants={participants} />
        </div>
      </div>
    </div>
  );
}