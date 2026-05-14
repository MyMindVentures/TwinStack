export type UserRole =
  | "Architect"
  | "Builder"
  | "Vibecoder Guest"
  | "Subscribed User";

export interface Project {
  id: string;
  slug: string;
  title: string;
  description: string;
  owner?: string;
  type?: string;
  visibility?: string;
  status?: string;
  createdByRole?: string;
  isPublicGlobalProject?: number;
  alwaysVisible?: number;
  architectId: string;
  createdAt: string;
}

export interface Request {
  id: string;
  projectId: string;
  nonTechDescription: string;
  techDescription: string;
  timestamp: string;
  status: "pending" | "draft" | "approved";
  implemented?: number;
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
  createdAt: string;
}
