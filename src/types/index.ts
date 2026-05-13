export type UserRole = 'Architect' | 'Builder' | 'Vibecoder Guest' | 'Subscribed User';

export interface Project {
  id: string;
  title: string;
  description: string;
  createdAt: any; // Firestore Timestamp
  architectId: string;
}

export interface Request {
  id: string;
  projectId: string;
  nonTechDescription: string;
  techDescription: string;
  timestamp: any; // Firestore Timestamp
  status: 'draft' | 'approved';
}

export interface UserProfile {
  name: string;
  role: UserRole;
  avatar: string;
}

export interface VibecoderProfile {
  uid: string;
  name: string;
  country: string;
  gender: string;
  skills: string[];
  purpose: string;
  twitter?: string;
  github?: string;
  photoUrl?: string;
  createdAt: any;
}
