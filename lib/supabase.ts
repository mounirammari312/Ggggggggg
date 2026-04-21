import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SUPABASE_URL = 'https://your-project.supabase.co';
const SUPABASE_ANON_KEY = 'your-anon-key';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          phone: string | null;
          avatar_url: string | null;
          role: 'buyer' | 'supplier' | 'admin';
          language: 'ar' | 'fr' | 'en';
          currency: 'DZD' | 'EUR' | 'USD';
          created_at: string;
          updated_at: string;
        };
      };
      suppliers: {
        Row: {
          id: string;
          profile_id: string;
          company_name: string;
          description: string | null;
          logo_url: string | null;
          cover_url: string | null;
          category_id: string | null;
          rating: number;
          total_reviews: number;
          total_sales: number;
          is_verified: boolean;
          is_active: boolean;
          country: string;
          city: string;
          address: string | null;
          website: string | null;
          established_year: number | null;
          min_order_amount: number;
          response_time: string | null;
          created_at: string;
        };
      };
      products: {
        Row: {
          id: string;
          supplier_id: string;
          category_id: string;
          subcategory_id: string | null;
          name_ar: string;
          name_fr: string;
          name_en: string;
          description_ar: string | null;
          description_fr: string | null;
          description_en: string | null;
          price: number;
          currency: string;
          min_order_qty: number;
          unit: string;
          stock_qty: number;
          is_active: boolean;
          is_featured: boolean;
          rating: number;
          total_reviews: number;
          total_orders: number;
          created_at: string;
        };
      };
      categories: {
        Row: {
          id: string;
          name_ar: string;
          name_fr: string;
          name_en: string;
          icon: string;
          color: string;
          is_active: boolean;
          sort_order: number;
        };
      };
    };
  };
};
