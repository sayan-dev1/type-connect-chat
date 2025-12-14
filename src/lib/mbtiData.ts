export type MBTIGroup = 'analyst' | 'diplomat' | 'sentinel' | 'explorer';

export interface MBTIType {
  code: string;
  name: string;
  subtitle: string;
  group: MBTIGroup;
}

export const mbtiTypes: MBTIType[] = [
  // Analysts (Purple)
  { code: 'INTJ', name: 'INTJ', subtitle: 'The Architect', group: 'analyst' },
  { code: 'INTP', name: 'INTP', subtitle: 'The Logician', group: 'analyst' },
  { code: 'ENTJ', name: 'ENTJ', subtitle: 'The Commander', group: 'analyst' },
  { code: 'ENTP', name: 'ENTP', subtitle: 'The Debater', group: 'analyst' },
  
  // Diplomats (Green)
  { code: 'INFJ', name: 'INFJ', subtitle: 'The Advocate', group: 'diplomat' },
  { code: 'INFP', name: 'INFP', subtitle: 'The Mediator', group: 'diplomat' },
  { code: 'ENFJ', name: 'ENFJ', subtitle: 'The Protagonist', group: 'diplomat' },
  { code: 'ENFP', name: 'ENFP', subtitle: 'The Campaigner', group: 'diplomat' },
  
  // Sentinels (Blue)
  { code: 'ISTJ', name: 'ISTJ', subtitle: 'The Logistician', group: 'sentinel' },
  { code: 'ISFJ', name: 'ISFJ', subtitle: 'The Defender', group: 'sentinel' },
  { code: 'ESTJ', name: 'ESTJ', subtitle: 'The Executive', group: 'sentinel' },
  { code: 'ESFJ', name: 'ESFJ', subtitle: 'The Consul', group: 'sentinel' },
  
  // Explorers (Yellow)
  { code: 'ISTP', name: 'ISTP', subtitle: 'The Virtuoso', group: 'explorer' },
  { code: 'ISFP', name: 'ISFP', subtitle: 'The Adventurer', group: 'explorer' },
  { code: 'ESTP', name: 'ESTP', subtitle: 'The Entrepreneur', group: 'explorer' },
  { code: 'ESFP', name: 'ESFP', subtitle: 'The Entertainer', group: 'explorer' },
];

export const getMBTIByCode = (code: string): MBTIType | undefined => {
  return mbtiTypes.find(type => type.code === code);
};

export const getMBTIsByGroup = (group: MBTIGroup): MBTIType[] => {
  return mbtiTypes.filter(type => type.group === group);
};

export const groupColors: Record<MBTIGroup, string> = {
  analyst: 'mbti-analyst',
  diplomat: 'mbti-diplomat',
  sentinel: 'mbti-sentinel',
  explorer: 'mbti-explorer',
};

export const groupGlowClasses: Record<MBTIGroup, string> = {
  analyst: 'glow-analyst',
  diplomat: 'glow-diplomat',
  sentinel: 'glow-sentinel',
  explorer: 'glow-explorer',
};

export const groupBgClasses: Record<MBTIGroup, string> = {
  analyst: 'bg-mbti-analyst',
  diplomat: 'bg-mbti-diplomat',
  sentinel: 'bg-mbti-sentinel',
  explorer: 'bg-mbti-explorer',
};

export const groupTextClasses: Record<MBTIGroup, string> = {
  analyst: 'text-mbti-analyst',
  diplomat: 'text-mbti-diplomat',
  sentinel: 'text-mbti-sentinel',
  explorer: 'text-mbti-explorer',
};

export const groupBorderClasses: Record<MBTIGroup, string> = {
  analyst: 'border-mbti-analyst',
  diplomat: 'border-mbti-diplomat',
  sentinel: 'border-mbti-sentinel',
  explorer: 'border-mbti-explorer',
};
