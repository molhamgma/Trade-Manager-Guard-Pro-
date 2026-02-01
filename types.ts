
export type Language = string;
export type Currency = 'USD' | 'EUR' | 'GBP' | 'SAR' | 'AED' | 'USDT';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'admin' | 'user' | 'Admin';
  subscriptionEnd: number; // Timestamp
  isTrial: boolean;
  isPaid: boolean;
  status: 'active' | 'blocked';
  notes?: string;
  phone?: string;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  durationDays: number;
}

export interface Trade {
  id: string;
  timestamp: number;
  asset: string;
  stake: number;
  outcome: 'WIN' | 'LOSS';
  profit: number; // Positive for win, negative (stake) for loss
  balanceAfter: number;
  note?: string;
}

export interface Session {
  id: string;
  startTime: number;
  endTime: number;
  startBalance: number;
  endBalance: number;
  netProfit: number;
  tradeCount: number;
  winCount: number;
  lossCount: number;
  trades: Trade[]; // Added to store full history for reports
  strategyName?: string;
}

export interface AssetOption {
  name: string;
  defaultPayout: number | '';
}

export interface KeyboardShortcuts {
  win: string;
  loss: string;
  newSession: string;
  reset: string;
}

export interface AppSettings {
  initialCapital: number;
  initialStake: number;
  profitPercentage: number | ''; // Allow empty string for UI input
  winIncreasePercentage: number;
  lossIncreaseMultiplier: number;
  maxConsecutiveLosses: number;
  availableAssets: AssetOption[]; // Array of 10 assets
  selectedAssetIndex: number; // 0-9
  strategyName?: string;
}

export interface AppState {
  currentBalance: number;
  currentStake: number;
  nextStake: number;
  lastWinningStake: number;
  consecutiveLosses: number;
  trades: Trade[];
  sessions: Session[];
}

export const INITIAL_SETTINGS: AppSettings = {
  initialCapital: 20,
  initialStake: 1,
  profitPercentage: '',
  winIncreasePercentage: 5,
  lossIncreaseMultiplier: 2.84,
  maxConsecutiveLosses: 3,
  availableAssets: [
    { name: 'EUR/USD', defaultPayout: '' },
    { name: 'GBP/USD', defaultPayout: '' },
    { name: 'USD/JPY', defaultPayout: '' },
    { name: 'XAU/USD', defaultPayout: '' },
    { name: 'BTC/USD', defaultPayout: '' },
    { name: '', defaultPayout: '' },
    { name: '', defaultPayout: '' },
    { name: '', defaultPayout: '' },
    { name: '', defaultPayout: '' },
    { name: '', defaultPayout: '' }
  ],
  selectedAssetIndex: 0,
  strategyName: ''
};

export const DEFAULT_SHORTCUTS: KeyboardShortcuts = {
  win: 'w',
  loss: 'l',
  newSession: 'n',
  reset: 'r'
};
