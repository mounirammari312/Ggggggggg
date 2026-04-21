import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import i18n from './i18n';

export type Language = 'ar' | 'fr' | 'en';
export type Currency = 'DZD' | 'EUR' | 'USD';
export type UserRole = 'buyer' | 'supplier' | 'admin';

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  phone?: string;
  avatar_url?: string;
  role: UserRole;
  language: Language;
  currency: Currency;
}

export interface AppState {
  user: UserProfile | null;
  language: Language;
  currency: Currency;
  isRTL: boolean;
  isLoading: boolean;
  favorites: string[];
  cartItems: any[];
  notifications: number;
  exchangeRates: { DZD: number; EUR: number; USD: number };
  setUser: (user: UserProfile | null) => void;
  setLanguage: (lang: Language) => void;
  setCurrency: (currency: Currency) => void;
  setLoading: (loading: boolean) => void;
  addFavorite: (productId: string) => void;
  removeFavorite: (productId: string) => void;
  toggleFavorite: (productId: string) => void;
  isFavorite: (productId: string) => boolean;
  setNotifications: (count: number) => void;
  convertPrice: (price: number, fromCurrency: Currency) => number;
  formatPrice: (price: number, currency?: Currency) => string;
}

const EXCHANGE_RATES = { DZD: 1, EUR: 0.0068, USD: 0.0074 };

export const useAppStore = create<AppState>((set, get) => ({
  user: null,
  language: 'ar',
  currency: 'DZD',
  isRTL: true,
  isLoading: false,
  favorites: [],
  cartItems: [],
  notifications: 3,
  exchangeRates: EXCHANGE_RATES,

  setUser: (user) => set({ user }),

  setLanguage: async (lang) => {
    await i18n.changeLanguage(lang);
    await AsyncStorage.setItem('language', lang);
    set({ language: lang, isRTL: lang === 'ar' });
  },

  setCurrency: async (currency) => {
    await AsyncStorage.setItem('currency', currency);
    set({ currency });
  },

  setLoading: (isLoading) => set({ isLoading }),

  addFavorite: (productId) =>
    set((state) => ({ favorites: [...state.favorites, productId] })),

  removeFavorite: (productId) =>
    set((state) => ({ favorites: state.favorites.filter((id) => id !== productId) })),

  toggleFavorite: (productId) => {
    const { favorites } = get();
    if (favorites.includes(productId)) {
      get().removeFavorite(productId);
    } else {
      get().addFavorite(productId);
    }
  },

  isFavorite: (productId) => get().favorites.includes(productId),

  setNotifications: (notifications) => set({ notifications }),

  convertPrice: (price, fromCurrency) => {
    const { currency, exchangeRates } = get();
    if (fromCurrency === currency) return price;
    const inDZD = price / exchangeRates[fromCurrency];
    return inDZD * exchangeRates[currency];
  },

  formatPrice: (price, currency) => {
    const { currency: storeCurrency } = get();
    const curr = currency || storeCurrency;
    const symbols: Record<Currency, string> = { DZD: 'د.ج', EUR: '€', USD: '$' };
    const formatted = new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(price);
    return curr === 'EUR' || curr === 'USD'
      ? `${symbols[curr]}${formatted}`
      : `${formatted} ${symbols[curr]}`;
  },
}));
