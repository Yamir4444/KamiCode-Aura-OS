export interface Project {
  id: string;
  title: string;
  category: 'arcade' | 'strategy' | 'cosmic' | 'fullstack';
  description: string;
  tech: string[];
  image: string;
  metrics: string;
  demoUrl?: string;
  githubUrl?: string;
}

export interface UniverseTheme {
  id: string;
  name: string;
  icon: string;
  quote: string;
  color: string;
  accent: string;
  bgGradient: string;
  description: string;
}
