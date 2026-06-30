import { useState, useEffect, useCallback } from 'react';
import { supabase, Item, Category, PetSize, CartItem } from './lib/supabase';
import {
  ShoppingBag,
  Package,
  Sparkles,
  Home,
  Search,
  X,
  Star,
  Crown,
  Diamond,
  Coins,
  Loader2,
  Minus,
  Plus,
  Trash2,
} from 'lucide-react';

type View = 'home' | 'items' | 'sheckles';

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
              <button onClick={() => { setView('items'); setSelectedPetSize(null); }} className={`px-5 py-2.5 rounded-xl font-semibold transition-all flex items-center gap-2 ${view === 'items' ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-white' : 'text-slate-300 hover:bg-slate-700/50'}`}>
                <Package className="w-4 h-4" />
                <span>Item</span>
              </button>
              <button onClick={() => setView('sheckles')} className={`px-5 py-2.5 rounded-xl font-semibold transition-all flex items-center gap-2 ${view === 'sheckles' ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-white' : 'text-slate-300 hover:bg-slate-700/50'}`}>
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
            {view === 'items' && <ItemsView items={items} petSizes={petSizes} searchQuery={searchQuery} setSearchQuery={setSearchQuery} selectedPetSize={selectedPetSize} setSelectedPetSize={setSelectedPetSize} addToCart={addToCart} cart={cart} />}
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

function HomeView({ featuredItems, categories, addToCart, cart, onViewItems, onViewSheckles }: any) {
  return (
    <div className="space-y-10">
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

function ItemsView({ items, searchQuery, setSearchQuery, selectedPetSize, setSelectedPetSize, addToCart, cart }: any) {
  const filteredItems = items.filter((item: Item) => {
    if (item.categories?.slug === 'sheckles') return false;
    if (selectedPetSize && item.pet_size_id !== selectedPetSize) return false;
    if (searchQuery && !item.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const petItems = items.filter((item: Item) => item.categories?.slug === 'pets');

  return (
    <div>
      <div className="flex items-center justify-between gap-3 mb-8">
        <div className="flex items-center gap-3">
          <Package className="w-8 h-8 text-emerald-400" />
          <h3 className="text-3xl font-bold text-white">Item Catalog</h3>
        </div>
      </div>

      <div className="flex gap-3 mb-8 overflow-x-auto pb-2">
        {petItems.length > 0 && (
          <div className="relative min-w-[150px]">
            <select
              value={selectedPetSize || ''}
              onChange={(e) => setSelectedPetSize(e.target.value || null)}
              className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-600 text-white appearance-none cursor-pointer"
            >
              <option value="">Semua Ukuran</option>
              <option value="big">Big</option>
              <option value="huge">Huge</option>
            </select>
          </div>
        )}

        <div className="relative min-w-[250px] ml-auto">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Cari item..." className="w-full pl-12 pr-4 py-3 rounded-xl bg-slate-800 border border-slate-600 text-white placeholder-slate-400" />
        </div>
      </div>

      {filteredItems.length === 0 ? (
        <div className="text-center py-20">
          <Package className="w-16 h-16 text-slate-600 mx-auto mb-4" />
          <p className="text-slate-400 text-lg">Tidak ada item ditemukan</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map((item: Item) => (
            <ItemCard key={item.id} item={item} addToCart={addToCart} cart={cart} />
          ))}
        </div>
      )}
    </div>
  );
}

function ShecklesView({ items, addToCart, cart }: { items: Item[]; addToCart: (item: Item) => void; cart: CartItem[] }) {
  return (
    <div>
      <div className="flex items-center gap-3 mb-8">
        <Coins className="w-8 h-8 text-amber-400" />
        <h3 className="text-3xl font-bold text-white">Sheckles Catalog</h3>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {items.map((item) => (
          <ItemCard key={item.id} item={item} addToCart={addToCart} cart={cart} />
        ))}
      </div>
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
  removeFromCart: (id: string) => void;
  updateCartQuantity: (id: string, qty: number) => void;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm">
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden border border-slate-700">
        <div className="p-6 border-b border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ShoppingBag className="w-6 h-6 text-emerald-400" />
            <h3 className="text-xl font-bold text-white">Shopping Cart</h3>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-700 rounded-lg transition-all">
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        {cart.length === 0 ? (
          <div className="p-12 text-center">
            <ShoppingBag className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400 text-lg">Cart is empty</p>
          </div>
        ) : (
          <>
            <div className="max-h-96 overflow-y-auto divide-y divide-slate-700">
              {cart.map((c) => (
                <div key={c.item.id} className="p-4 flex items-center gap-4">
                  <div className="w-16 h-16 bg-slate-700 rounded-xl flex items-center justify-center">
                    <span className="text-2xl">
                      {c.item.categories?.slug === 'seeds' && '🌱'}
                      {c.item.categories?.slug === 'pets' && '🐾'}
                      {c.item.categories?.slug === 'gear' && '🔧'}
                      {c.item.categories?.slug === 'sheckles' && '💰'}
                    </span>
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-white">{c.item.name}</p>
                    <p className="text-slate-400 text-sm">{c.item.price.toLocaleString('id-ID')} <Coins className="w-3 h-3 inline" /></p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => updateCartQuantity(c.item.id, c.quantity - 1)} disabled={c.quantity <= 1} className="w-8 h-8 rounded-lg bg-slate-700 text-white flex items-center justify-center hover:bg-slate-600 disabled:opacity-50">
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-8 text-center text-white font-semibold">{c.quantity}</span>
                    <button onClick={() => updateCartQuantity(c.item.id, c.quantity + 1)} disabled={c.quantity >= c.item.stock} className="w-8 h-8 rounded-lg bg-slate-700 text-white flex items-center justify-center hover:bg-slate-600 disabled:opacity-50">
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <button onClick={() => removeFromCart(c.item.id)} className="p-2 text-rose-400 hover:bg-rose-500/20 rounded-lg">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>

            <div className="p-6 bg-slate-800/50 border-t border-slate-700">
              <div className="flex items-center justify-between mb-4">
                <span className="text-slate-400">Total</span>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-amber-400">{cartTotal.toLocaleString('id-ID')}</span>
                  <Coins className="w-5 h-5 text-amber-400" />
                </div>
              </div>
              <button
                onClick={() => {
                  if (cart.length === 0) return;
                  const pesan = cart.map((item) => `• ${item.item.name} x${item.quantity} = ${item.item.price * item.quantity}`).join('\n');
                  const total = cart.reduce((sum, item) => sum + item.item.price * item.quantity, 0);
                  const text = `Halo NongkiStore!\n\nSaya ingin melakukan pemesanan.\n\n${pesan}\n\nTotal: ${total}\n\nTerima kasih.`;
                  window.open(`https://wa.me/6285338506309?text=${encodeURIComponent(text)}`, '_blank');
                }}
                className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold text-lg rounded-2xl hover:scale-[1.02] transition-all"
              >
                Checkout via WhatsApp
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default App;