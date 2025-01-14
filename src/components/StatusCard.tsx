import React from 'react';
import { motion } from 'framer-motion';
import { Users, CheckCircle2, Clock } from 'lucide-react';

interface StatusCardProps {
  title: string;
  value: number;
  icon: 'participants' | 'completed' | 'pending';
}

const icons = {
  participants: Users,
  completed: CheckCircle2,
  pending: Clock,
};

const colors = {
  participants: 'bg-blue-500',
  completed: 'bg-green-500',
  pending: 'bg-yellow-500',
};

export const StatusCard: React.FC<StatusCardProps> = ({ title, value, icon }) => {
  const Icon = icons[icon];
  const bgColor = colors[icon];

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700"
    >
      <div className="flex items-center space-x-4">
        <div className={`${bgColor} p-4 rounded-lg`}>
          <Icon className="w-6 h-6 text-gray-900" />
        </div>
        <div>
          <h3 className="text-gray-400 text-sm font-medium">{title}</h3>
          <p className="text-3xl font-bold text-gray-100">{value}</p>
        </div>
      </div>
    </motion.div>
  );
};