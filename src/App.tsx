import { useState, useEffect, useCallback } from 'react';
import { supabase, Item, Category, PetSize, CartItem } from './lib/supabase';
import {
  ShoppingBag,
  Package,
  Sparkles,
  Home,
  Search,
  Filter,
  ChevronDown,
  X,
  Star,
  Flame,
  Zap,
  Crown,
  Diamond,
  Coins,
  Ghost,
  Loader2,
} from 'lucide-react';

type View = 'home' | 'items' | 'sheckles' | 'cart';

const RARITY_COLORS: Record<string, string> = {
  Common: 'from-slate-400 to-slate-500',
  Uncommon: 'from-green-400 to-green-500',
  Rare: 'from-blue-400 to-blue-500',
  Epic: 'from-purple-400 to-purple-500',
  Legendary: 'from-amber-400 to-orange-500',
  Mythic: 'from-red-400 to-pink-500',
};

const RARITY_BG: Record<string, string> = {
  Common: 'bg-slate-100 border-slate-200',
  Uncommon: 'bg-green-50 border-green-200',
  Rare: 'bg-blue-50 border-blue-200',
  Epic: 'bg-purple-50 border-purple-200',
  Legendary: 'bg-amber-50 border-amber-200',
  Mythic: 'bg-red-50 border-red-200',
};

const RARITY_TEXT: Record<string, string> = {
  Common: 'text-slate-600',
  Uncommon: 'text-green-600',
  Rare: 'text-blue-600',
  Epic: 'text-purple-600',
  Legendary: 'text-amber-600',
  Mythic: 'text-red-600',
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
      supabase
        .from('items')
        .select('*, categories(*), pet_sizes(*)')
        .eq('is_active', true)
        .order('created_at', { ascending: false }),
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
        return prev.map((c) =>
          c.item.id === item.id ? { ...c, quantity: c.quantity + 1 } : c
        );
      }
      return [...prev, { item, quantity: 1 }];
    });
  };

  const removeFromCart = (itemId: string) => {
    setCart((prev) => prev.filter((c) => c.item.id !== itemId));
  };

  const updateCartQuantity = (itemId: string, quantity: number) => {
    setCart((prev) =>
      prev.map((c) => (c.item.id === itemId ? { ...c, quantity } : c))
    );
  };

  const cartTotal = cart.reduce((sum, c) => sum + c.item.price * c.quantity, 0);
  const cartCount = cart.reduce((sum, c) => sum + c.quantity, 0);

  const featuredItems = items.filter((i) => i.is_featured);

  const getFilteredItems = (categorySlug: string) => {
    return items.filter((item) => {
      const category = item.categories;
      if (!category || category.slug !== categorySlug) return false;
      if (selectedPetSize && category.slug === 'pets' && item.pet_size_id !== selectedPetSize) return false;
      if (searchQuery && !item.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      return true;
    });
  };

  const shecklesItems = items.filter((i) => i.categories?.slug === 'sheckles');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-40 -left-40 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-500" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-slate-900/70 border-b border-slate-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-18 py-3">
            {/* Logo */}
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => setView('home')}>
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 via-cyan-400 to-blue-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/30 transform hover:scale-105 transition-transform">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-amber-400 rounded-full animate-ping" />
              </div>
              <div>
                <h1 className="text-2xl font-black bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent">
                  NongkiStore
                </h1>
                <p className="text-xs text-slate-400 font-medium tracking-wider">GAME ITEM SHOP</p>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex items-center gap-2">
              <button
                onClick={() => setView('home')}
                className={`px-5 py-2.5 rounded-xl font-semibold transition-all flex items-center gap-2 ${
                  view === 'home'
                    ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-white shadow-lg shadow-emerald-500/30'
                    : 'text-slate-300 hover:bg-slate-700/50'
                }`}
              >
                <Home className="w-4 h-4" />
                <span>Home</span>
              </button>
              <button
                onClick={() => setView('items')}
                className={`px-5 py-2.5 rounded-xl font-semibold transition-all flex items-center gap-2 ${
                  view === 'items'
                    ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-white shadow-lg shadow-emerald-500/30'
                    : 'text-slate-300 hover:bg-slate-700/50'
                }`}
              >
                <Package className="w-4 h-4" />
                <span>Items</span>
              </button>
              <button
                onClick={() => setView('sheckles')}
                className={`px-5 py-2.5 rounded-xl font-semibold transition-all flex items-center gap-2 ${
                  view === 'sheckles'
                    ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-white shadow-lg shadow-emerald-500/30'
                    : 'text-slate-300 hover:bg-slate-700/50'
                }`}
              >
                <Coins className="w-4 h-4" />
                <span>Sheckles</span>
              </button>
              <button
                onClick={() => setShowCart(true)}
                className="relative ml-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold shadow-lg shadow-amber-500/30 flex items-center gap-2 hover:from-amber-600 hover:to-orange-600 transition-all"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Cart</span>
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 w-6 h-6 bg-rose-500 text-white text-xs rounded-full flex items-center justify-center font-bold shadow-lg animate-bounce">
                    {cartCount}
                  </span>
                )}
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32">
            <Loader2 className="w-16 h-16 text-emerald-400 animate-spin" />
            <p className="mt-4 text-slate-400 text-lg">Loading items...</p>
          </div>
        ) : (
          <>
            {view === 'home' && (
              <HomeView
                featuredItems={featuredItems}
                categories={categories}
                items={items}
                addToCart={addToCart}
                cart={cart}
                onViewItems={() => setView('items')}
              />
            )}
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
              />
            )}
            {view === 'sheckles' && (
              <ShecklesView
                items={shecklesItems}
                addToCart={addToCart}
                cart={cart}
              />
            )}
          </>
        )}
      </main>

      {/* Cart Modal */}
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

function HomeView({
  featuredItems,
  categories,
  items,
  addToCart,
  cart,
  onViewItems,
}: {
  featuredItems: Item[];
  categories: Category[];
  items: Item[];
  addToCart: (item: Item) => void;
  cart: CartItem[];
  onViewItems: () => void;
}) {
  return (
    <div>
      {/* Hero Section */}
      <div className="relative text-center py-16 mb-12">
        <div className="relative z-10">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Flame className="w-8 h-8 text-orange-400 animate-pulse" />
            <h2 className="text-4xl md:text-6xl font-black text-white">
              Selamat Datang
            </h2>
            <Flame className="w-8 h-8 text-orange-400 animate-pulse" />
          </div>
          <p className="text-xl text-slate-300 mb-4">
            di <span className="text-emerald-400 font-bold">NongkiStore</span>, toko item game terbaik!
          </p>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Temukan Seeds langka, Pets keren, Gear powerful, dan Sheckles untuk permainan Anda
          </p>
          <button
            onClick={onViewItems}
            className="mt-8 px-8 py-4 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-bold text-lg rounded-2xl shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 transition-all transform hover:scale-105"
          >
            Lihat Semua Item
          </button>
        </div>
      </div>

      {/* Best Sellers */}
      <section className="mb-16">
        <div className="flex items-center gap-3 mb-8">
          <Star className="w-8 h-8 text-amber-400" />
          <h3 className="text-3xl font-bold text-white">Item Terlaris</h3>
          <div className="flex-1 h-px bg-gradient-to-r from-amber-400/50 to-transparent" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredItems.slice(0, 8).map((item) => (
            <ItemCard key={item.id} item={item} addToCart={addToCart} cart={cart} />
          ))}
        </div>
      </section>

      {/* Categories */}
      <section>
        <div className="flex items-center gap-3 mb-8">
          <Zap className="w-8 h-8 text-cyan-400" />
          <h3 className="text-3xl font-bold text-white">Kategori</h3>
          <div className="flex-1 h-px bg-gradient-to-r from-cyan-400/50 to-transparent" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="group relative bg-gradient-to-br from-slate-800 to-slate-700 rounded-2xl p-6 border border-slate-600/50 hover:border-emerald-400/50 transition-all cursor-pointer overflow-hidden"
              onClick={onViewItems}
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-500/20 to-transparent rounded-full blur-2xl group-hover:from-emerald-400/30 transition-all" />
              <div className="text-5xl mb-4">{cat.icon}</div>
              <h4 className="text-xl font-bold text-white mb-1">{cat.name}</h4>
              <p className="text-slate-400 text-sm">{cat.description}</p>
              <p className="mt-3 text-emerald-400 font-semibold">
                {items.filter((i) => i.category_id === cat.id).length} items
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function ItemsView({
  items,
  categories,
  petSizes,
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  selectedPetSize,
  setSelectedPetSize,
  addToCart,
  cart,
}: {
  items: Item[];
  categories: Category[];
  petSizes: PetSize[];
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedCategory: string | null;
  setSelectedCategory: (c: string | null) => void;
  selectedPetSize: string | null;
  setSelectedPetSize: (s: string | null) => void;
  addToCart: (item: Item) => void;
  cart: CartItem[];
}) {
  const filteredItems = items.filter((item) => {
    if (item.categories?.slug === 'sheckles') return false;
    if (selectedCategory && item.category_id !== selectedCategory) return false;
    if (selectedPetSize && item.pet_size_id !== selectedPetSize) return false;
    if (searchQuery && !item.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const itemCategories = categories.filter((c) => c.slug !== 'sheckles');

  return (
    <div>
      <div className="flex items-center gap-3 mb-8">
        <Package className="w-8 h-8 text-emerald-400" />
        <h3 className="text-3xl font-bold text-white">Game Items</h3>
        <div className="flex-1 h-px bg-gradient-to-r from-emerald-400/50 to-transparent" />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-8">
        <div className="relative flex-1 min-w-[250px]">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Cari item..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-xl bg-slate-800 border border-slate-600 text-white placeholder-slate-400 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
          <select
            value={selectedCategory || ''}
            onChange={(e) => setSelectedCategory(e.target.value || null)}
            className="pl-12 pr-10 py-3 rounded-xl bg-slate-800 border border-slate-600 text-white appearance-none cursor-pointer min-w-[180px]"
          >
            <option value="">Semua Kategori</option>
            {itemCategories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.icon} {cat.name}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
        </div>
        {selectedCategory && categories.find((c) => c.id === selectedCategory)?.slug === 'pets' && (
          <div className="relative">
            <Ghost className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            <select
              value={selectedPetSize || ''}
              onChange={(e) => setSelectedPetSize(e.target.value || null)}
              className="pl-12 pr-10 py-3 rounded-xl bg-slate-800 border border-slate-600 text-white appearance-none cursor-pointer min-w-[150px]"
            >
              <option value="">Semua Ukuran</option>
              {petSizes.map((size) => (
                <option key={size.id} value={size.id}>
                  {size.name}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
          </div>
        )}
      </div>

      {filteredItems.length === 0 ? (
        <div className="text-center py-20">
          <Package className="w-16 h-16 text-slate-600 mx-auto mb-4" />
          <p className="text-slate-400 text-lg">Tidak ada item ditemukan</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map((item) => (
            <ItemCard key={item.id} item={item} addToCart={addToCart} cart={cart} />
          ))}
        </div>
      )}
    </div>
  );
}

function ShecklesView({
  items,
  addToCart,
  cart,
}: {
  items: Item[];
  addToCart: (item: Item) => void;
  cart: CartItem[];
}) {
  return (
    <div>
      <div className="flex items-center gap-3 mb-8">
        <Coins className="w-8 h-8 text-amber-400" />
        <h3 className="text-3xl font-bold text-white">Sheckles Catalog</h3>
        <div className="flex-1 h-px bg-gradient-to-r from-amber-400/50 to-transparent" />
      </div>

      <div className="bg-gradient-to-br from-amber-900/30 to-orange-900/20 rounded-2xl border border-amber-500/30 p-6 mb-8">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-14 h-14 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg shadow-amber-500/30">
            <Coins className="w-7 h-7 text-white" />
          </div>
          <div>
            <h4 className="text-xl font-bold text-white">Sheckles</h4>
            <p className="text-amber-300">Mata uang game untuk pembelian item premium</p>
          </div>
        </div>
        <p className="text-slate-300 text-sm">
          Dapatkan Sheckles untuk membuka item-item eksklusif di game. Semakin banyak Sheckles yang Anda miliki, semakin banyak item langka yang bisa Anda dapatkan!
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
  const rarityColor = RARITY_COLORS[item.rarity] || RARITY_COLORS.Common;
  const rarityBg = RARITY_BG[item.rarity] || RARITY_BG.Common;
  const rarityText = RARITY_TEXT[item.rarity] || RARITY_TEXT.Common;

  return (
    <div className="group relative bg-gradient-to-br from-slate-800 to-slate-800/50 rounded-2xl overflow-hidden border border-slate-600/50 hover:border-slate-500 transition-all duration-300">
      {/* Rarity glow */}
      <div className={`absolute inset-0 pointer-events-none bg-gradient-to-br ${rarityColor} opacity-0 group-hover:opacity-10 transition-opacity`} />

      {/* Image */}
      <div className="relative aspect-square bg-gradient-to-br from-slate-700 to-slate-800 overflow-hidden">
        {item.image_url ? (
          <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${rarityColor} flex items-center justify-center shadow-lg opacity-50`}>
              {item.categories?.slug === 'seeds' && <span className="text-3xl">🌱</span>}
              {item.categories?.slug === 'pets' && <span className="text-3xl">🐾</span>}
              {item.categories?.slug === 'gear' && <span className="text-3xl">🔧</span>}
              {item.categories?.slug === 'sheckles' && <span className="text-3xl">💰</span>}
            </div>
          </div>
        )}

        {/* Rarity badge */}
        <div className={`absolute top-3 left-3 px-3 py-1 rounded-full border ${rarityBg} ${rarityText} text-xs font-bold uppercase tracking-wider flex items-center gap-1`}>
          {item.rarity === 'Mythic' && <Crown className="w-3 h-3" />}
          {item.rarity === 'Legendary' && <Diamond className="w-3 h-3" />}
          {item.rarity === 'Epic' && <Star className="w-3 h-3" />}
          {item.rarity}
        </div>

        {/* Pet size badge */}
        {item.pet_sizes && (
          <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-slate-900/80 text-cyan-400 text-xs font-bold border border-cyan-400/30">
            {item.pet_sizes.name}
          </div>
        )}

        {/* Stock indicator */}
        {item.stock === 0 && (
          <div className="absolute inset-0 bg-slate-900/80 flex items-center justify-center">
            <span className="px-4 py-2 bg-rose-500/20 text-rose-400 rounded-lg font-bold border border-rose-500/30">
              OUT OF STOCK
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="mb-2">
          <span className="text-xs font-medium text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded">
            {item.categories?.name || 'Unknown'}
          </span>
        </div>
        <h3 className="font-bold text-white text-lg mb-1 truncate">{item.name}</h3>
        <p className="text-slate-400 text-sm line-clamp-2 mb-4">{item.description}</p>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-1">
            <span className="text-xl font-bold text-amber-400">
              {item.price < 1000000
                ? item.price.toLocaleString('id-ID')
                : item.price < 1000000000
                ? `${(item.price / 1000000).toFixed(1)}M`
                : `${(item.price / 1000000000).toFixed(1)}B`}
            </span>
            <Coins className="w-4 h-4 text-amber-400" />
          </div>
          <span className="text-sm text-slate-500">x{item.stock}</span>
        </div>

        <button
          disabled={!canAdd}
          onClick={() => addToCart(item)}
          className={`w-full py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${
            canAdd
              ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-white hover:from-emerald-400 hover:to-cyan-400 shadow-lg shadow-emerald-500/20'
              : 'bg-slate-700 text-slate-500 cursor-not-allowed'
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          {item.stock === 0 ? 'Out of Stock' : inCart ? 'Add More' : 'Add to Cart'}
        </button>
      </div>
    </div>
  );
}

function CartModal({
  cart,
  cartTotal,
  removeFromCart,
  updateCartQuantity,
  onClose,
}: {
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
                    <p className="text-slate-400 text-sm">
                      {c.item.price < 1000000
                        ? c.item.price.toLocaleString('id-ID')
                        : `${(c.item.price / 1000000).toFixed(1)}M`}{' '}
                      <Coins className="w-3 h-3 inline" />
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateCartQuantity(c.item.id, c.quantity - 1)}
                      disabled={c.quantity <= 1}
                      className="w-8 h-8 rounded-lg bg-slate-700 text-white flex items-center justify-center hover:bg-slate-600 disabled:opacity-50"
                    >
                      -
                    </button>
                    <span className="w-8 text-center text-white font-semibold">{c.quantity}</span>
                    <button
                      onClick={() => updateCartQuantity(c.item.id, c.quantity + 1)}
                      disabled={c.quantity >= c.item.stock}
                      className="w-8 h-8 rounded-lg bg-slate-700 text-white flex items-center justify-center hover:bg-slate-600 disabled:opacity-50"
                    >
                      +
                    </button>
                  </div>
                  <button onClick={() => removeFromCart(c.item.id)} className="p-2 text-rose-400 hover:bg-rose-500/20 rounded-lg">
                    <X className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>

            <div className="p-6 bg-slate-800/50 border-t border-slate-700">
              <div className="flex items-center justify-between mb-4">
                <span className="text-slate-400">Total</span>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-amber-400">
                    {cartTotal < 1000000
                      ? cartTotal.toLocaleString('id-ID')
                      : cartTotal < 1000000000
                      ? `${(cartTotal / 1000000).toFixed(1)}M`
                      : `${(cartTotal / 1000000000).toFixed(1)}B`}
                  </span>
                  <Coins className="w-5 h-5 text-amber-400" />
                </div>
              </div>
              <button className="w-full py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold text-lg rounded-2xl shadow-lg shadow-amber-500/30 hover:from-amber-600 hover:to-orange-600 transition-all">
                Checkout
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default App;
