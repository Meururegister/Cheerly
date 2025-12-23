
export interface Project {
  id: string;
  name: string;
  description: string;
  link: string;
}

export interface SocialLinks {
  github: string;
  linkedin: string;
  twitter: string;
  email: string;
}

export interface ProfileData {
  name: string;
  title: string;
  bio: string;
  location: string;
  skills: string[];
  projects: Project[];
  social: SocialLinks;
  theme: 'modern' | 'glass' | 'midnight' | 'emerald';
}

export type ThemeConfig = {
  primary: string;
  secondary: string;
  background: string;
  card: string;
  text: string;
  accent: string;
};
