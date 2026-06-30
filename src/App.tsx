import { useState, useEffect, useCallback } from 'react';
import { supabase, Item, Category, PetSize, CartItem } from './lib/supabase';
import {
  ShoppingBag,
  Package,
  Sparkles,
  Home,
  Search,
  Star,
  Crown,
  Diamond,
  Coins,
  Loader2,
  X,
  Minus,
  Plus,
  Trash2,
} from 'lucide-react';

type View = 'home' | 'items' | 'sheckles' | 'cart';

const RARITY_COLORS: Record<string, string> = {
  Common: 'from-slate-400 to-slate-500',
  Uncommon: 'from-green-400 to-green-500',
  Rare: 'from-blue-400 to-blue-500',
  Epic: 'from-purple-400 to-purple-500',
  Legendary: 'from-amber-400 to-orange-500',
  Mythic: 'from-red-400 to-pink-500',
  Super: 'from-pink-500 via-yellow-400 via-green-400 via-cyan-400 to-purple-500',
};

const RARITY_BG: Record<string, string> = {
  Common: 'bg-slate-100 border-slate-200',
  Uncommon: 'bg-green-50 border-green-200',
  Rare: 'bg-blue-50 border-blue-200',
  Epic: 'bg-purple-50 border-purple-200',
  Legendary: 'bg-amber-50 border-amber-200',
  Mythic: 'bg-red-50 border-red-200',
  Super: 'bg-white border-transparent',
};

const RARITY_TEXT: Record<string, string> = {
  Common: 'text-slate-600',
  Uncommon: 'text-green-600',
  Rare: 'text-blue-600',
  Epic: 'text-purple-600',
  Legendary: 'text-amber-600',
  Mythic: 'text-red-600',
  Super: 'text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-yellow-400 via-green-400 via-cyan-400 to-purple-500 animate-pulse',
};

function App() {
  const [view, setView] = useState<View>('home');
  const [items, setItems] = useState<Item[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [petSizes, setPetSizes] = useState<PetSize[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedPetSize, setSelectedPetSize] = useState<string | null>(null);
  const [showCart, setShowCart] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    const [itemsRes, categoriesRes, petSizesRes] = await Promise.all([
      supabase.from('items').select('*, categories(*), pet_sizes(*)').eq('is_active', true).order('created_at', { ascending: false }),
      supabase.from('categories').select('*').order('name'),
      supabase.from('pet_sizes').select('*').order('name'),
    ]);

    if (itemsRes.data) setItems(itemsRes.data);
    if (categoriesRes.data) setCategories(categoriesRes.data);
    if (petSizesRes.data) setPetSizes(petSizesRes.data);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const addToCart = (item: Item) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.item.id === item.id);
      if (existing) {
        if (existing.quantity >= item.stock) return prev;
        return prev.map((c) => (c.item.id === item.id ? { ...c, quantity: c.quantity + 1 } : c));
      }
      return [...prev, { item, quantity: 1 }];
    });
  };

  const removeFromCart = (itemId: string) => setCart((prev) => prev.filter((c) => c.item.id !== itemId));

  const updateCartQuantity = (itemId: string, quantity: number) => {
    setCart((prev) => prev.map((c) => (c.item.id === itemId ? { ...c, quantity } : c)));
  };

  const cartTotal = cart.reduce((sum, c) => sum + c.item.price * c.quantity, 0);
  const cartCount = cart.reduce((sum, c) => sum + c.quantity, 0);
  const featuredItems = items.filter((i) => i.is_featured);
  const shecklesItems = items.filter((i) => i.categories?.slug === 'sheckles');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-slate-900/70 border-b border-slate-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-18 py-3">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => setView('home')}>
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 via-cyan-400 to-blue-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/30">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-black bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent">NongkiStore</h1>
                <p className="text-xs text-slate-400 font-medium tracking-wider">GAME ITEM SHOP</p>
              </div>
            </div>

            <nav className="flex items-center gap-2">
              <button onClick={() => setView('home')} className={`px-5 py-2.5 rounded-xl font-semibold transition-all flex items-center gap-2 ${view === 'home' ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-white' : 'text-slate-300 hover:bg-slate-700/50'}`}>
                <Home className="w-4 h-4" />
                <span>Home</span>
              </button>
              <button onClick={() => { setView('items'); setSelectedCategory(null); setSelectedPetSize(null); }} className={`px-5 py-2.5 rounded-xl font-semibold transition-all flex items-center gap-2 ${view === 'items' ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-white' : 'text-slate-300 hover:bg-slate-700/50'}`}>
                <Package className="w-4 h-4" />
                <span>Items</span>
              </button>
              <button onClick={() => { setView('sheckles'); setSelectedCategory(null); setSelectedPetSize(null); }} className={`px-5 py-2.5 rounded-xl font-semibold transition-all flex items-center gap-2 ${view === 'sheckles' ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-white' : 'text-slate-300 hover:bg-slate-700/50'}`}>
                <Coins className="w-4 h-4" />
                <span>Sheckles</span>
              </button>
              <button onClick={() => setShowCart(true)} className="relative ml-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold flex items-center gap-2">
                <ShoppingBag className="w-4 h-4" />
                <span>Cart</span>
                {cartCount > 0 && <span className="absolute -top-2 -right-2 w-6 h-6 bg-rose-500 text-white text-xs rounded-full flex items-center justify-center font-bold">{cartCount}</span>}
              </button>
            </nav>
          </div>
        </div>
      </header>

      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32">
            <Loader2 className="w-16 h-16 text-emerald-400 animate-spin" />
            <p className="mt-4 text-slate-400 text-lg">Loading items...</p>
          </div>
        ) : (
          <>
            {view === 'home' && <HomeView featuredItems={featuredItems} categories={categories} addToCart={addToCart} cart={cart} onViewItems={() => setView('items')} onViewSheckles={() => setView('sheckles')} />}
            {view === 'items' && (
              <ItemsView
                items={items}
                categories={categories}
                petSizes={petSizes}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                selectedPetSize={selectedPetSize}
                setSelectedPetSize={setSelectedPetSize}
                addToCart={addToCart}
                cart={cart}
                onOpenSheckles={() => setView('sheckles')}
              />
            )}
            {view === 'sheckles' && <ShecklesView items={shecklesItems} addToCart={addToCart} cart={cart} />}
          </>
        )}
      </main>

      {showCart && (
        <CartModal
          cart={cart}
          cartTotal={cartTotal}
          removeFromCart={removeFromCart}
          updateCartQuantity={updateCartQuantity}
          onClose={() => setShowCart(false)}
        />
      )}
    </div>
  );
}

function ItemsView({ items, categories, petSizes, searchQuery, setSearchQuery, selectedCategory, setSelectedCategory, selectedPetSize, setSelectedPetSize, addToCart, cart, onOpenSheckles }: any) {
  const navCategories = categories.filter((c: Category) => c.slug !== 'sheckles');
  const petSizesWithDefaults = petSizes.length ? petSizes : [{ id: 'big', name: 'Big' }, { id: 'huge', name: 'Huge' }];

  const filteredItems = items.filter((item: Item) => {
    if (item.categories?.slug === 'sheckles') return false;
    if (selectedCategory && item.category_id !== selectedCategory) return false;
    if (selectedPetSize && item.pet_size_id !== selectedPetSize) return false;
    if (searchQuery && !item.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  return (
    <div>
      <div className="flex items-center justify-between gap-3 mb-8">
        <div className="flex items-center gap-3">
          <Package className="w-8 h-8 text-emerald-400" />
          <h3 className="text-3xl font-bold text-white">Game Items</h3>
        </div>
        <button onClick={onOpenSheckles} className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold flex items-center gap-2">
          <Coins className="w-4 h-4" />
          Sheckles
        </button>
      </div>

      <div className="flex gap-3 mb-8 overflow-x-auto pb-2">
        <button onClick={() => { setSelectedCategory(null); setSelectedPetSize(null); }} className={`px-5 py-3 rounded-xl font-semibold whitespace-nowrap ${!selectedCategory ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-white' : 'bg-slate-800 text-slate-300'}`}>
          Semua Item
        </button>

        {navCategories.map((cat: Category) => (
          <button key={cat.id} onClick={() => { setSelectedCategory(cat.id); setSelectedPetSize(null); }} className={`px-5 py-3 rounded-xl font-semibold whitespace-nowrap flex items-center gap-2 ${selectedCategory === cat.id ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-white' : 'bg-slate-800 text-slate-300'}`}>
            <span>{cat.icon}</span>
            <span>{cat.name}</span>
          </button>
        ))}

        {selectedCategory && categories.find((c) => c.id === selectedCategory)?.slug === 'pets' && (
          <select value={selectedPetSize || ''} onChange={(e) => setSelectedPetSize(e.target.value || null)} className="px-4 py-3 rounded-xl bg-slate-800 border border-slate-600 text-white">
            <option value="">Semua Ukuran</option>
            {petSizesWithDefaults.map((size: PetSize) => (
              <option key={size.id} value={size.id}>{size.name}</option>
            ))}
          </select>
        )}

        <div className="relative min-w-[250px] ml-auto">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Cari item..." className="w-full pl-12 pr-4 py-3 rounded-xl bg-slate-800 border border-slate-600 text-white" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredItems.map((item: Item) => (
          <ItemCard key={item.id} item={item} addToCart={addToCart} cart={cart} />
        ))}
      </div>
    </div>
  );
}

function HomeView({ featuredItems, categories, addToCart, cart, onViewItems, onViewSheckles }: any) {
  return (
    <div className="space-y-10">
      <div className="flex flex-wrap gap-3">
        <button onClick={onViewItems} className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-semibold">Browse Items</button>
        <button onClick={onViewSheckles} className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold">Sheckles</button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {categories.map((cat: Category) => (
          <button
            key={cat.id}
            onClick={() => {
              if (cat.slug === 'sheckles') onViewSheckles();
              else onViewItems();
            }}
            className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 text-left"
          >
            <div className="text-2xl mb-2">{cat.icon}</div>
            <div className="text-white font-semibold">{cat.name}</div>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
        {featuredItems.slice(0, 6).map((item: Item) => (
          <ItemCard key={item.id} item={item} addToCart={addToCart} cart={cart} />
        ))}
      </div>
    </div>
  );
}

function ShecklesView({ items, addToCart, cart }: { items: Item[]; addToCart: (item: Item) => void; cart: CartItem[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {items.map((item) => (
        <ItemCard key={item.id} item={item} addToCart={addToCart} cart={cart} />
      ))}
    </div>
  );
}

function ItemCard({ item, addToCart, cart }: { item: Item; addToCart: (item: Item) => void; cart: CartItem[] }) {
  const inCart = cart.find((c) => c.item.id === item.id);
  const canAdd = item.stock > 0 && (!inCart || inCart.quantity < item.stock);
  const isSheckles = item.categories?.slug === 'sheckles';
  const rarityColor = RARITY_COLORS[item.rarity] || RARITY_COLORS.Common;
  const rarityBg = RARITY_BG[item.rarity] || RARITY_BG.Common;
  const rarityText = RARITY_TEXT[item.rarity] || RARITY_TEXT.Common;
  const isSuper = item.rarity === 'Super';

  return (
    <div className="group relative bg-gradient-to-br from-slate-800 to-slate-800/50 rounded-2xl overflow-hidden border border-slate-600/50">
      <div className={`absolute inset-0 pointer-events-none bg-gradient-to-br ${rarityColor} opacity-0 group-hover:opacity-10 transition-opacity`} />
      <div className="relative aspect-square bg-gradient-to-br from-slate-700 to-slate-800 overflow-hidden">
        {item.image_url ? <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center" />}
        {!isSheckles && (
          <div className={`absolute top-3 left-3 px-3 py-1 rounded-full border text-xs font-bold uppercase tracking-wider flex items-center gap-1 ${isSuper ? 'bg-gradient-to-r from-pink-500 via-yellow-400 via-green-400 via-cyan-400 to-purple-500 text-white border-white/20 animate-pulse' : `${rarityBg} ${rarityText}`}`}>
            {item.rarity === 'Mythic' && <Crown className="w-3 h-3" />}
            {item.rarity === 'Legendary' && <Diamond className="w-3 h-3" />}
            {item.rarity === 'Epic' && <Star className="w-3 h-3" />}
            {item.rarity}
          </div>
        )}
      </div>
      <div className="p-5">
        <h3 className="font-bold text-white text-lg mb-1 truncate">{item.name}</h3>
        <button disabled={!canAdd} onClick={() => addToCart(item)} className={`w-full py-3 rounded-xl font-bold ${canAdd ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-white' : 'bg-slate-700 text-slate-500 cursor-not-allowed'}`}>
          {item.stock === 0 ? 'Out of Stock' : inCart ? 'Add More' : 'Add to Cart'}
        </button>
      </div>
    </div>
  );
}

function CartModal({ cart, cartTotal, removeFromCart, updateCartQuantity, onClose }: {
  cart: CartItem[];
  cartTotal: number;
  removeFromCart: (itemId: string) => void;
  updateCartQuantity: (itemId: string, quantity: number) => void;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-slate-900 rounded-2xl border border-slate-700 overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-slate-700">
          <h3 className="text-xl font-bold text-white">Cart</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto">
          {cart.length === 0 ? (
            <div className="p-8 text-center text-slate-400">Cart masih kosong</div>
          ) : (
            cart.map((c) => (
              <div key={c.item.id} className="p-4 border-b border-slate-800 flex items-center justify-between gap-4">
                <div>
                  <div className="text-white font-semibold">{c.item.name}</div>
                  <div className="text-slate-400 text-sm">{c.item.price.toLocaleString('id-ID')}</div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => updateCartQuantity(c.item.id, Math.max(1, c.quantity - 1))} className="p-2 rounded-lg bg-slate-800 text-white"><Minus className="w-4 h-4" /></button>
                  <span className="text-white w-8 text-center">{c.quantity}</span>
                  <button onClick={() => updateCartQuantity(c.item.id, Math.min(c.item.stock, c.quantity + 1))} className="p-2 rounded-lg bg-slate-800 text-white"><Plus className="w-4 h-4" /></button>
                  <button onClick={() => removeFromCart(c.item.id)} className="p-2 rounded-lg bg-rose-500/20 text-rose-400"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="p-4 border-t border-slate-700 flex items-center justify-between">
          <div className="text-white font-bold">Total: {cartTotal.toLocaleString('id-ID')}</div>
          <button onClick={onClose} className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-semibold">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;