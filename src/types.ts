export interface Participant {
  id: string;
  name: string;
  fileUrl: string;
  status: 'pending' | 'completed';
  completedAt?: Date;
}

export interface CompletionData {
  name: string;
  timestamp: number;
  value: number;
}

export interface ParticipantProgress {
  timestamp: number;
  [key: string]: number | string | undefined;
}