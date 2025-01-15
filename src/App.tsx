import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { StatusCard } from './components/StatusCard';
import { ParticipantList } from './components/ParticipantList';
import type { Participant, ParticipantProgress } from './types';
import { CloudLightning } from 'lucide-react';

const mockParticipants: Participant[] = [
  { 
    id: '1', 
    name: 'Vebjorn Risa', 
    fileUrl: 'https://sttademovebjornr.blob.core.windows.net/sensitive-files-vebjornr/interne_hr_data.json', 
    status: 'pending' 
  },
  { 
    id: '2', 
    name: 'Asif Amin', 
    fileUrl: 'https://sttademoasifa.blob.core.windows.net/sensitive-files-asifa/interne_hr_data.json', 
    status: 'pending' 
  },
  {
    id: '3',
    name: 'Eirik Berntsen (old)',
    fileUrl: 'https://steirik.blob.core.windows.net/container-eirik/interne_hr_data.json',
    status: 'pending'
  }
];

export default function App() {
  const [participants, setParticipants] = useState<Participant[]>(mockParticipants);
  const [progressData, setProgressData] = useState<ParticipantProgress[]>([]);
  const [lastCompletedIndex, setLastCompletedIndex] = useState<number>(-1);

  useEffect(() => {
    const checkUrls = async () => {
      const pendingParticipants = participants.filter(p => p.status === 'pending');
      if (pendingParticipants.length === 0) return;
  
      const updatedParticipants = [...participants];
  
      await Promise.all(pendingParticipants.map(async (participant) => {
        const participantIndex = participants.findIndex(p => p.id === participant.id);
        
        console.log(`[${new Date().toISOString()}] Checking URL for ${participant.name}:`, participant.fileUrl);
  
        try {
          const response = await fetch(participant.fileUrl, {
            method: 'HEAD',
            cache: 'no-cache',
            headers: {
              'Accept': '*/*'
            }
          });
  
          const responseDetails = {
            status: response.status,
            statusText: response.statusText,
            ok: response.ok,
            url: response.url
          };
  
          console.log(`[${new Date().toISOString()}] Response for ${participant.name}:`, responseDetails);
  
          if (response.status === 200) {
            console.log(`[${new Date().toISOString()}] ${participant.name} has not completed the task yet (file still exists)`);
          } else if (response.status === 404) {
            console.log(`[${new Date().toISOString()}] ${participant.name} has completed the task (file deleted)`);
            updatedParticipants[participantIndex] = {
              ...participant,
              status: 'completed',
              completedAt: new Date(),
            };
          } else {
            console.log(`[${new Date().toISOString()}] ${participant.name}'s task status could not be determined (status code: ${response.status})`);
          }
        } catch (error) {
          console.log(`[${new Date().toISOString()}] Error checking URL for ${participant.name}:`, {
            error,
            message: error.message,
            name: error.name,
            stack: error.stack
          });
          
          console.log(`[${new Date().toISOString()}] ${participant.name}'s task status could not be determined (network error)`);
        }
      }));
  
      setParticipants(updatedParticipants);
    };
  
    const interval = setInterval(checkUrls, 5000);
    return () => clearInterval(interval);
  }, [participants]);

  const completedCount = participants.filter((p) => p.status === 'completed').length;

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
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