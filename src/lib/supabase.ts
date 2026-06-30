import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  description: string | null;
  created_at: string;
}

export interface PetSize {
  id: string;
  name: string;
  created_at: string;
}

export interface Item {
  id: string;
  name: string;
  description: string | null;
  price: number;
  stock: number;
  image_url: string | null;
  category_id: string | null;
  pet_size_id: string | null;
  is_featured: boolean;
  is_active: boolean;
  rarity: string;
  created_at: string;
  categories?: Category;
  pet_sizes?: PetSize;
}

export interface CartItem {
  item: Item;
  quantity: number;
}
