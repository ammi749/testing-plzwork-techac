import type { Participant } from '../types';

export const participants: Participant[] = [
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