
import { ThemeConfig } from './types';

export const THEMES: Record<string, ThemeConfig> = {
  modern: {
    primary: 'bg-black',
    secondary: 'text-slate-500',
    background: 'bg-white',
    card: 'bg-white border-transparent',
    text: 'text-black',
    accent: 'border-black'
  },
  steel: {
    primary: 'bg-slate-700',
    secondary: 'text-slate-500',
    background: 'bg-slate-50',
    card: 'bg-transparent border-slate-200',
    text: 'text-slate-900',
    accent: 'border-slate-400'
  },
  midnight: {
    primary: 'bg-white',
    secondary: 'text-slate-400',
    background: 'bg-black',
    card: 'bg-black border-slate-800',
    text: 'text-white',
    accent: 'border-white'
  },
  sand: {
    primary: 'bg-stone-800',
    secondary: 'text-stone-500',
    background: 'bg-[#fcfaf7]',
    card: 'bg-transparent border-stone-200',
    text: 'text-stone-900',
    accent: 'border-stone-400'
  }
};
