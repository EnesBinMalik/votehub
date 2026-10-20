export interface User {
  id: string;
  username: string; // e.g. "enes", "ayse" (without @ or with @ normalized)
  fullName: string;
  avatarColor: string;
  avatarInitial: string;
  createdAt: string;
}

export interface VoteOption {
  id: string;
  title: string;
  description: string;
  badge?: string;
  iconName?: string;
}

export interface Category {
  id: string;
  title: string;
  description: string;
  icon: string;
  themeColor: string; // hex or tailwind palette
  options: VoteOption[];
  createdAt?: string;
  isCustom?: boolean;
}

export interface VoteRecord {
  id: string;
  categoryId: string;
  optionId: string;
  userId: string;
  username: string;
  timestamp: string;
}

export interface OptionStats {
  option: VoteOption;
  count: number;
  percentage: number;
  isLeading: boolean;
  userVoted: boolean;
}

export interface CategoryStats {
  category: Category;
  totalVotes: number;
  optionsStats: OptionStats[];
  winnerOption?: VoteOption;
}
