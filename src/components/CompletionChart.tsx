import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import type { ParticipantProgress } from '../types';

interface CompletionChartProps {
  progressData: ParticipantProgress[];
  participants: string[];
}

const generateColor = (index: number): string => {
  const colors = [
    '#00ff00',
    '#ff00ff',
    '#00ffff',
    '#ff0000',
    '#0000ff',
    '#ffff00',
  ];
  return colors[index % colors.length];
};

export const CompletionChart: React.FC<CompletionChartProps> = ({ progressData, participants }) => {
  return (
    <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-gray-700/50">
      <h2 className="text-xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500">
        Completion Timeline
      </h2>
      <div className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart 
            data={progressData} 
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <defs>
              {participants.map((_, index) => (
                <linearGradient key={index} id={`gradient-${index}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={generateColor(index)} stopOpacity={0.8}/>
                  <stop offset="95%" stopColor={generateColor(index)} stopOpacity={0.1}/>
                </linearGradient>
              ))}
            </defs>
            <XAxis
              dataKey="timestamp"
              tickFormatter={(timestamp) => new Date(timestamp).toLocaleTimeString()}
              stroke="#666"
              domain={['dataMin', 'dataMax']}
            />
            <YAxis 
              stroke="#666"
              domain={[0, 1]}
              ticks={[0, 1]}
              tickFormatter={(value) => value === 1 ? 'Completed' : 'Started'}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(26, 26, 26, 0.8)',
                border: '1px solid #333',
                borderRadius: '4px',
                color: '#fff',
                backdropFilter: 'blur(8px)'
              }}
              labelFormatter={(timestamp) => `Time: ${new Date(timestamp).toLocaleString()}`}
            />
            <Legend
              verticalAlign="bottom"
              height={36}
              content={({ payload }) => (
                <div className="flex flex-wrap gap-4 justify-center mt-4">
                  {payload?.map((entry, index) => (
                    <div key={entry.value} className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: entry.color }}
                      />
                      <span className="text-gray-300 text-sm">{entry.value}</span>
                    </div>
                  ))}
                </div>
              )}
            />
            {participants.map((participant, index) => (
              <Line
                key={participant}
                type="stepAfter"
                dataKey={participant}
                stroke={generateColor(index)}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 6, fill: '#fff' }}
                isAnimationActive={false}
                fill={`url(#gradient-${index})`}
                fillOpacity={0.1}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};