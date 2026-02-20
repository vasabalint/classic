import React, { useState, useMemo, useEffect } from 'react';
import { ShoppingBag, Star, Calendar, Gauge, Settings, Trash2, ArrowRight, CheckCircle, Mail, MapPin, Phone, Wrench, Search, Filter, X, Info, ChevronDown, Shield, FileText, CornerUpLeft } from 'lucide-react';
import Navbar from './components/Navbar';
import ChatBot from './components/ChatBot';
import { Car, Part, CartItem } from './types';

// --- MOCK DATA ---
const FEATURED_CARS: Car[] = [
  {
    id: 'c1',
    name: 'Mercedes-Benz 300SL Gullwing',
    year: 1955,
    price: 1450000,
    image: 'https://picsum.photos/id/111/800/600',
    engine: '3.0L Inline-6',
    horsepower: 215,
    transmission: '4-speed Manual',
    mileage: 45000,
    category: 'sports',
    description: "Az ikonikus sirályszárnyas ajtókkal rendelkező modell, a német mérnöki csoda megtestesítője. Tökéletesen restaurált állapotban."
  },
  {
    id: 'c2',
    name: 'Aston Martin DB5',
    year: 1964,
    price: 980000,
    image: 'https://picsum.photos/id/133/800/600',
    engine: '4.0L Inline-6',
    horsepower: 282,
    transmission: '5-speed ZF Manual',
    mileage: 62000,
    category: 'luxury',
    description: "A leghíresebb Bond-autó. Silver Birch fényezés, fekete bőrbelső. Eredeti állapotban megőrzött példány."
  },
  {
    id: 'c3',
    name: 'Jaguar E-Type Series 1',
    year: 1961,
    price: 220000,
    image: 'https://picsum.photos/id/234/800/600',
    engine: '3.8L Inline-6',
    horsepower: 265,
    transmission: '4-speed Manual',
    mileage: 38000,
    category: 'convertible',
    description: "Enzo Ferrari szerint a világ legszebb autója. Versenyzöld fényezés, kiváló mechanikai állapot."
  },
  {
    id: 'c4',
    name: 'Porsche 911 Carrera RS 2.7',
    year: 1973,
    price: 650000,
    image: 'https://picsum.photos/id/146/800/600',
    engine: '2.7L Flat-6',
    horsepower: 210,
    transmission: '5-speed Manual',
    mileage: 51000,
    category: 'sports',
    description: "A legendás 'kacsafarok' spoilerrel. A tiszta vezetési élmény netovábbja, ritka gyűjtői darab."
  },
  {
    id: 'c5',
    name: 'Ferrari 250 GT Lusso',
    year: 1963,
    price: 1850000,
    image: 'https://picsum.photos/id/1071/800/600',
    engine: '3.0L V12',
    horsepower: 240,
    transmission: '4-speed Manual',
    mileage: 28000,
    category: 'luxury',
    description: "A Ferrari egyik legelegánsabb túraautója. Pininfarina karosszéria, Scaglietti építés. Múzeumi állapot."
  },
  {
    id: 'c6',
    name: 'Ford Mustang Fastback',
    year: 1967,
    price: 85000,
    image: 'https://picsum.photos/id/655/800/600',
    engine: '390 V8',
    horsepower: 320,
    transmission: '4-speed Manual',
    mileage: 82000,
    category: 'sports',
    description: "Amerikai izomautó klasszikus. Highland Green fényezés, Bullitt stílusban. Erős V8-as motorral."
  },
  {
    id: 'c7',
    name: 'Rolls-Royce Silver Cloud II',
    year: 1960,
    price: 125000,
    image: 'https://picsum.photos/id/674/800/600',
    engine: '6.2L V8',
    horsepower: 185,
    transmission: '4-speed Auto',
    mileage: 95000,
    category: 'luxury',
    description: "A luxus és a kényelem csúcsa. Jobbkormányos kivitel, eredeti Connolly bőrbelsővel és diófa betétekkel."
  },
  {
    id: 'c8',
    name: 'Alfa Romeo Giulietta Spider',
    year: 1959,
    price: 95000,
    image: 'https://picsum.photos/id/403/800/600',
    engine: '1.3L Inline-4',
    horsepower: 80,
    transmission: '4-speed Manual',
    mileage: 56000,
    category: 'convertible',
    description: "A Dolce Vita életérzés négy keréken. Pinin Farina design, élénk motor, tökéletes nyári autózáshoz."
  }
];

const PARTS: Part[] = [
  { id: 'p1', name: 'Weber 45 DCOE Karburátor', price: 450, image: 'https://picsum.photos/id/250/400/300', category: 'Motor', compatibility: ['Alfa Romeo', 'Ford', 'Lotus'], inStock: true },
  { id: 'p2', name: 'Jaguar E-Type Kormánykerék', price: 1200, image: 'https://picsum.photos/id/191/400/300', category: 'Belső', compatibility: ['Jaguar E-Type S1', 'S2'], inStock: true },
  { id: 'p3', name: 'Bosch Régi Típusú Fényszóró', price: 350, image: 'https://picsum.photos/id/188/400/300', category: 'Elektromos', compatibility: ['Mercedes W113', 'Porsche 356'], inStock: false },
  { id: 'p4', name: 'Borrani Küllős Felni 15"', price: 2100, image: 'https://picsum.photos/id/145/400/300', category: 'Futómű', compatibility: ['Ferrari 250', 'Maserati 3500'], inStock: true },
  { id: 'p5', name: 'Connolly Bőrülés Felújító Készlet', price: 150, image: 'https://picsum.photos/id/160/400/300', category: 'Ápolás', compatibility: ['Universal'], inStock: true },
  { id: 'p6', name: 'Smiths Fordulatszámmérő', price: 550, image: 'https://picsum.photos/id/132/400/300', category: 'Műszerfal', compatibility: ['MG B', 'Triumph TR6'], inStock: true },
  { id: 'p7', name: 'Porsche 911 Motorháztető Jelvény', price: 120, image: 'https://picsum.photos/id/102/400/300', category: 'Karosszéria', compatibility: ['Porsche 911', 'Porsche 912'], inStock: true },
  { id: 'p8', name: 'Váltógomb (Fa)', price: 85, image: 'https://picsum.photos/id/24/400/300', category: 'Belső', compatibility: ['Universal Classic'], inStock: true },
  { id: 'p9', name: 'Krómozott Lökhárító Szett', price: 1800, image: 'https://picsum.photos/id/400/400/300', category: 'Karosszéria', compatibility: ['VW Beetle 1960-1967'], inStock: true },
  { id: 'p10', name: 'Gyújtáselosztó Fedél', price: 45, image: 'https://picsum.photos/id/500/400/300', category: 'Motor', compatibility: ['Lucas Systems'], inStock: false },
];

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);

  // Scroll to top when page changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage]);

  // --- ACTIONS ---
  const addToCart = (item: Car | Part, type: 'vehicle' | 'part') => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { id: item.id, name: item.name, price: item.price, image: item.image, quantity: 1, type }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(i => i.id !== id));
  };

  const totalAmount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // --- SUB-COMPONENTS ---

  const CarDetailModal = () => {
    if (!selectedCar) return null;

    return (
      <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 animate-fade-in">
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setSelectedCar(null)}></div>
        <div className="bg-white rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto relative z-10 flex flex-col md:flex-row animate-scale-in">
          <button 
            onClick={() => setSelectedCar(null)}
            className="absolute top-4 right-4 bg-white/50 p-2 rounded-full hover:bg-white text-vintage-dark z-20 transition-all duration-300"
          >
            <X size={24} />
          </button>
          
          <div className="md:w-1/2 h-64 md:h-auto relative">
            <img src={selectedCar.image} alt={selectedCar.name} className="w-full h-full object-cover" />
          </div>
          
          <div className="md:w-1/2 p-8">
            <div className="mb-6">
              <span className="text-vintage-gold text-sm font-bold tracking-widest uppercase animate-fade-in-up delay-75">{selectedCar.category}</span>
              <h2 className="text-3xl font-serif font-bold text-vintage-dark mt-1 animate-fade-in-up delay-100">{selectedCar.name}</h2>
              <div className="text-2xl text-vintage-red font-bold mt-2 animate-fade-in-up delay-150">{selectedCar.price.toLocaleString()} €</div>
            </div>

            <p className="text-gray-600 mb-8 leading-relaxed animate-fade-in-up delay-200">
              {selectedCar.description} Ezt az autót szakértőink alaposan átvizsgálták, és rendelkezik a "Velvet Certified" minősítéssel, amely garantálja az eredetiséget és a kiváló műszaki állapotot.
            </p>

            <div className="grid grid-cols-2 gap-y-4 gap-x-8 mb-8 text-sm animate-fade-in-up delay-300">
              <div className="border-b border-gray-100 pb-2">
                <span className="text-gray-400 block text-xs uppercase">Évjárat</span>
                <span className="font-bold text-vintage-dark">{selectedCar.year}</span>
              </div>
              <div className="border-b border-gray-100 pb-2">
                <span className="text-gray-400 block text-xs uppercase">Futásteljesítmény</span>
                <span className="font-bold text-vintage-dark">{selectedCar.mileage.toLocaleString()} km</span>
              </div>
              <div className="border-b border-gray-100 pb-2">
                <span className="text-gray-400 block text-xs uppercase">Motor</span>
                <span className="font-bold text-vintage-dark">{selectedCar.engine}</span>
              </div>
              <div className="border-b border-gray-100 pb-2">
                <span className="text-gray-400 block text-xs uppercase">Váltó</span>
                <span className="font-bold text-vintage-dark">{selectedCar.transmission}</span>
              </div>
              <div className="border-b border-gray-100 pb-2">
                <span className="text-gray-400 block text-xs uppercase">Teljesítmény</span>
                <span className="font-bold text-vintage-dark">{selectedCar.horsepower} LE</span>
              </div>
              <div className="border-b border-gray-100 pb-2">
                <span className="text-gray-400 block text-xs uppercase">Azonosító</span>
                <span className="font-bold text-vintage-dark">#{selectedCar.id.toUpperCase()}</span>
              </div>
            </div>

            <button 
              onClick={() => {
                setSelectedCar(null);
                setCurrentPage('contact');
              }}
              className="w-full bg-vintage-green text-white py-4 rounded-sm font-bold tracking-wider hover:bg-vintage-dark transition-all duration-300 flex items-center justify-center gap-2 animate-fade-in-up delay-500 hover:scale-105"
            >
              <Mail size={20} />
              VÉTELI AJÁNLAT
            </button>
          </div>
        </div>
      </div>
    );
  };

  // --- VIEWS ---

  const VehiclesPage = () => {
    const [filters, setFilters] = useState({
      search: '',
      minYear: 1950,
      maxYear: 1980,
      minPrice: 0,
      maxPrice: 2000000,
      category: 'all'
    });

    const [isFilterOpen, setIsFilterOpen] = useState(false);

    const filteredCars = useMemo(() => {
      return FEATURED_CARS.filter(car => {
        const matchSearch = car.name.toLowerCase().includes(filters.search.toLowerCase());
        const matchYear = car.year >= filters.minYear && car.year <= filters.maxYear;
        const matchPrice = car.price >= filters.minPrice && car.price <= filters.maxPrice;
        const matchCategory = filters.category === 'all' || car.category === filters.category;
        return matchSearch && matchYear && matchPrice && matchCategory;
      });
    }, [filters]);

    const categories = ['all', 'sports', 'luxury', 'convertible', 'utility'];

    return (
      <div className="pt-24 pb-12 px-4 max-w-7xl mx-auto min-h-screen animate-fade-in">
        <div className="flex flex-col md:flex-row gap-8">
          
          {/* Sidebar Filter */}
          <div className={`md:w-1/4 bg-white p-6 rounded-lg shadow-lg h-fit border border-gray-100 transition-all duration-300 ${isFilterOpen ? 'block animate-slide-in-right' : 'hidden md:block'}`}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-serif font-bold text-xl text-vintage-dark flex items-center gap-2">
                <Filter size={20} /> Szűrők
              </h3>
              <button className="md:hidden" onClick={() => setIsFilterOpen(false)}><X size={20} /></button>
            </div>

            <div className="space-y-6">
              {/* Search */}
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Márka / Típus</label>
                <div className="relative">
                  <Search size={16} className="absolute left-3 top-3 text-gray-400" />
                  <input 
                    type="text" 
                    value={filters.search}
                    onChange={(e) => setFilters({...filters, search: e.target.value})}
                    placeholder="Keresés..." 
                    className="w-full pl-10 pr-4 py-2 border border-gray-400 rounded-sm focus:border-vintage-gold focus:ring-1 focus:ring-vintage-gold text-sm text-gray-900 placeholder-gray-600 bg-white transition-all duration-200"
                  />
                </div>
              </div>

              {/* Year Range */}
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Évjárat ({filters.minYear} - {filters.maxYear})</label>
                <div className="flex gap-2 items-center">
                  <input 
                    type="number" 
                    value={filters.minYear}
                    onChange={(e) => setFilters({...filters, minYear: Number(e.target.value)})}
                    className="w-full px-2 py-1 border border-gray-400 rounded-sm text-sm text-gray-900 bg-white transition-all duration-200"
                    min="1900" max="2026"
                  />
                  <span className="text-gray-400">-</span>
                  <input 
                    type="number" 
                    value={filters.maxYear}
                    onChange={(e) => setFilters({...filters, maxYear: Number(e.target.value)})}
                    className="w-full px-2 py-1 border border-gray-400 rounded-sm text-sm text-gray-900 bg-white transition-all duration-200"
                    min="1900" max="2026"
                  />
                </div>
              </div>

              {/* Category */}
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Kategória</label>
                <div className="space-y-2">
                  {categories.map(cat => (
                    <label key={cat} className="flex items-center gap-2 cursor-pointer group">
                      <input 
                        type="radio" 
                        name="category"
                        checked={filters.category === cat}
                        onChange={() => setFilters({...filters, category: cat})}
                        className="text-vintage-gold focus:ring-vintage-gold h-4 w-4 border-gray-300"
                      />
                      <span className="text-sm text-gray-700 capitalize group-hover:text-vintage-gold transition-colors">
                        {cat === 'all' ? 'Minden' : cat}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

               {/* Price Range */}
               <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Ár (EUR)</label>
                <div className="flex flex-col gap-2">
                   <div className="flex justify-between text-xs text-gray-500">
                     <span>Min</span>
                     <span>Max</span>
                   </div>
                   <div className="flex gap-2">
                    <input 
                      type="number"
                      value={filters.minPrice}
                      onChange={(e) => setFilters({...filters, minPrice: Number(e.target.value)})}
                      className="w-full px-2 py-1 border border-gray-400 rounded-sm text-sm text-gray-900 bg-white transition-all duration-200"
                      placeholder="0"
                    />
                     <input 
                      type="number"
                      value={filters.maxPrice}
                      onChange={(e) => setFilters({...filters, maxPrice: Number(e.target.value)})}
                      className="w-full px-2 py-1 border border-gray-400 rounded-sm text-sm text-gray-900 bg-white transition-all duration-200"
                      placeholder="Max"
                    />
                   </div>
                </div>
              </div>

              <button 
                onClick={() => setFilters({search: '', minYear: 1900, maxYear: 2026, minPrice: 0, maxPrice: 5000000, category: 'all'})}
                className="w-full py-2 text-xs text-vintage-red hover:text-red-700 font-bold uppercase tracking-wider border border-transparent hover:border-vintage-red rounded-sm transition-all duration-300"
              >
                Szűrők Törlése
              </button>
            </div>
          </div>

          {/* Results Grid */}
          <div className="flex-1">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-serif font-bold text-vintage-green">Találatok ({filteredCars.length})</h2>
              <button 
                className="md:hidden flex items-center gap-2 bg-white px-4 py-2 rounded-sm shadow-sm text-sm font-bold transition-all"
                onClick={() => setIsFilterOpen(!isFilterOpen)}
              >
                <Filter size={16} /> Szűrés
              </button>
            </div>

            {filteredCars.length === 0 ? (
               <div className="bg-white p-12 text-center rounded-lg shadow-sm animate-fade-in-up">
                 <Search className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                 <h3 className="text-lg font-bold text-gray-900">Nincs találat</h3>
                 <p className="text-gray-500">Próbájon módosítani a szűrési feltételeken.</p>
               </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {filteredCars.map((car, index) => (
                  <div key={car.id} className="bg-white rounded-lg shadow-md overflow-hidden group hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 ease-out border border-gray-100 flex flex-col" style={{ animationDelay: `${index * 50}ms` }}>
                    <div className="relative h-64 overflow-hidden">
                      <img src={car.image} alt={car.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-vintage-dark font-bold px-3 py-1 rounded-sm text-sm shadow-sm">
                        {car.year}
                      </div>
                    </div>
                    <div className="p-6 flex-1 flex flex-col">
                      <div className="mb-4">
                        <div className="flex justify-between items-start">
                           <h3 className="text-xl font-serif font-bold text-vintage-dark leading-tight group-hover:text-vintage-gold transition-colors">{car.name}</h3>
                        </div>
                        <span className="text-lg text-vintage-red font-bold block mt-1">{car.price.toLocaleString()} €</span>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-y-2 gap-x-4 mb-6 text-xs text-gray-500">
                        <div className="flex items-center gap-2"><Gauge size={14} className="text-vintage-gold" /> {car.mileage.toLocaleString()} km</div>
                        <div className="flex items-center gap-2"><Settings size={14} className="text-vintage-gold" /> {car.transmission}</div>
                      </div>
                      
                      <div className="mt-auto">
                         <button 
                          onClick={() => setSelectedCar(car)}
                          className="w-full border border-vintage-green text-vintage-green py-2 rounded-sm hover:bg-vintage-green hover:text-white transition-all duration-300 text-sm font-bold flex items-center justify-center gap-1"
                        >
                          <Info size={16} /> Részletek
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const PartsPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('Mind');

    const categories = ['Mind', 'Motor', 'Belső', 'Elektromos', 'Futómű', 'Karosszéria', 'Ápolás', 'Műszerfal'];

    const filteredParts = PARTS.filter(part => {
      const matchesSearch = part.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            part.compatibility.some(c => c.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesCategory = selectedCategory === 'Mind' || part.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });

    return (
      <div className="min-h-screen bg-vintage-cream animate-fade-in">
        {/* Header Search Section - Increased Padding Top */}
        <div className="bg-vintage-green text-white pt-32 pb-16 px-4">
           <div className="max-w-4xl mx-auto text-center animate-fade-in-up">
             <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6">Eredeti Alkatrészek Keresése</h2>
             <div className="relative max-w-2xl mx-auto">
               <input 
                type="text" 
                placeholder="Keresés alkatrész neve, cikkszáma vagy autótípus alapján..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-6 py-4 rounded-full text-gray-900 bg-white focus:outline-none focus:ring-4 focus:ring-vintage-gold/50 shadow-xl text-lg placeholder-gray-600 transition-all duration-300"
               />
               <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" size={24} />
             </div>
           </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Category Pills */}
          <div className="flex overflow-x-auto gap-2 pb-6 mb-6 border-b border-gray-200 scrollbar-hide animate-fade-in-up delay-100">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-6 py-2 rounded-full whitespace-nowrap text-sm font-bold transition-all duration-300 ${
                  selectedCategory === cat
                    ? 'bg-vintage-dark text-vintage-gold shadow-md transform scale-105'
                    : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200 hover:scale-105'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Results Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredParts.map((part, index) => (
              <div key={part.id} className="bg-white rounded-lg shadow-md hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 ease-out border border-gray-100 group flex flex-col h-full" style={{ animationDelay: `${index * 50}ms` }}>
                <div className="relative h-48 overflow-hidden bg-gray-100 rounded-t-lg">
                  <img src={part.image} alt={part.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  {!part.inStock && (
                    <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] flex items-center justify-center">
                      <span className="bg-red-600 text-white px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-sm shadow-sm">Készlethiány</span>
                    </div>
                  )}
                  <div className="absolute top-2 left-2 bg-black/50 backdrop-blur-md text-white px-2 py-0.5 text-[10px] uppercase font-bold rounded-sm">
                    {part.category}
                  </div>
                </div>
                
                <div className="p-5 flex-1 flex flex-col">
                  <h3 className="text-lg font-bold text-vintage-dark mb-2 leading-tight group-hover:text-vintage-gold transition-colors">{part.name}</h3>
                  
                  <div className="mb-4">
                     <p className="text-xs text-gray-500 font-bold uppercase mb-1">Kompatibilitás:</p>
                     <div className="flex flex-wrap gap-1">
                       {part.compatibility.slice(0, 3).map((comp, idx) => (
                         <span key={idx} className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-sm text-[10px]">{comp}</span>
                       ))}
                       {part.compatibility.length > 3 && <span className="text-[10px] text-gray-400">+...</span>}
                     </div>
                  </div>

                  <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
                    <span className="text-xl font-bold text-vintage-green">{part.price} €</span>
                    <button 
                      onClick={() => addToCart(part, 'part')}
                      disabled={!part.inStock}
                      className={`p-2 rounded-full transition-all duration-300 ${
                        part.inStock 
                        ? 'bg-vintage-gold text-vintage-dark hover:bg-yellow-500 shadow-sm hover:scale-110' 
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      }`}
                      title={part.inStock ? "Kosárba tesz" : "Nem elérhető"}
                    >
                      <ShoppingBag size={20} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredParts.length === 0 && (
            <div className="text-center py-20 text-gray-500 animate-fade-in-up">
              <Wrench size={48} className="mx-auto mb-4 opacity-20" />
              <p className="text-lg">Sajnos nem találtunk a keresésnek megfelelő alkatrészt.</p>
              <button onClick={() => {setSearchTerm(''); setSelectedCategory('Mind');}} className="text-vintage-gold hover:underline mt-2">Szűrők törlése</button>
            </div>
          )}
        </div>
      </div>
    );
  };

  const HeroSection = () => (
    <div className="relative h-[90vh] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <img 
          src="https://picsum.photos/id/1072/1920/1080" 
          alt="Vintage Car Garage" 
          className="w-full h-full object-cover filter brightness-50 animate-scale-in"
          style={{ animationDuration: '2s' }}
        />
      </div>
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <h1 className="text-5xl md:text-7xl font-serif font-bold text-vintage-cream mb-6 drop-shadow-lg animate-fade-in-up">
          Időtlen Elegancia
        </h1>
        <p className="text-xl md:text-2xl text-gray-200 mb-10 font-light tracking-wide animate-fade-in-up delay-100">
          Fedezze fel a világ legkiválóbb restaurált oldtimer gyűjteményét. 
          Ahol a történelem és a szenvedély találkozik.
        </p>
        <div className="flex flex-col md:flex-row gap-4 justify-center items-center animate-fade-in-up delay-200">
            <button 
              onClick={() => setCurrentPage('parts')}
              className="w-full md:w-auto bg-transparent text-white border-2 border-white px-10 py-4 rounded-sm font-bold tracking-widest hover:bg-white hover:text-vintage-dark transition-all duration-300 transform hover:scale-105"
            >
              ALKATRÉSZEK
            </button>
            <button 
              onClick={() => setCurrentPage('vehicles')}
              className="w-full md:w-auto bg-vintage-gold text-vintage-dark px-10 py-4 rounded-sm font-bold tracking-widest hover:bg-white transition-all duration-300 transform hover:scale-105 border-2 border-vintage-gold hover:border-white"
            >
              JÁRMŰVEK
            </button>
        </div>
      </div>
    </div>
  );

  const AboutSection = () => (
    <div className="bg-vintage-cream py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <div className="lg:w-1/2 relative animate-fade-in-up">
            <div className="absolute -top-4 -left-4 w-full h-full border-4 border-vintage-gold rounded-lg"></div>
            <img 
              src="https://picsum.photos/id/237/800/600" 
              alt="Velvet Classics Műhely" 
              className="relative rounded-lg shadow-xl w-full hover:scale-[1.02] transition-transform duration-500"
            />
          </div>
          <div className="lg:w-1/2 animate-fade-in-up delay-200">
             <h2 className="text-3xl font-serif font-bold text-vintage-dark mb-6">A Velvet Classics Története</h2>
             <div className="w-16 h-1 bg-vintage-gold mb-6"></div>
             <p className="text-gray-700 leading-relaxed mb-4">
               A Velvet Classics nem csupán egy autókereskedés; egy életre szóló szenvedély megtestesülése. Alapítóink 1990-ben nyitották meg az első kis műhelyüket Budapest szívében, azzal az egyszerű, de nemes céllal, hogy megmentsék a feledésre ítélt klasszikus autókat.
             </p>
             <p className="text-gray-700 leading-relaxed mb-6">
               Mára Európa egyik legelismertebb restaurátor műhelyévé és kereskedésévé nőttük ki magunkat. Csapatunk minden tagja – a szerelőktől az értékesítőkig – osztja azt a mélységes tiszteletet a gépészet iránt, amely minden egyes általunk kezelt járműben megmutatkozik. Nálunk az autóvásárlás nem tranzakció, hanem belépő egy exkluzív közösségbe.
             </p>
             <button onClick={() => setCurrentPage('contact')} className="text-vintage-green font-bold border-b-2 border-vintage-green hover:text-vintage-gold hover:border-vintage-gold transition-colors pb-1">
               Lépjen Kapcsolatba Velünk
             </button>
          </div>
        </div>
      </div>
    </div>
  );

  const ContactPage = () => (
    <div className="pt-24 pb-12 px-4 max-w-7xl mx-auto animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="bg-white p-8 shadow-xl rounded-lg animate-slide-in-right">
          <h2 className="text-3xl font-serif font-bold text-vintage-green mb-6">Lépjen Kapcsolatba Velünk</h2>
          <form className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Teljes Név</label>
              <input type="text" className="w-full border-gray-400 border p-3 rounded-md focus:ring-2 focus:ring-vintage-gold focus:outline-none text-gray-900 placeholder-gray-600 bg-white transition-all duration-200 focus:shadow-md" placeholder="Kovács János" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Cím</label>
              <input type="email" className="w-full border-gray-400 border p-3 rounded-md focus:ring-2 focus:ring-vintage-gold focus:outline-none text-gray-900 placeholder-gray-600 bg-white transition-all duration-200 focus:shadow-md" placeholder="janos@pelda.hu" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Üzenet</label>
              <textarea rows={4} className="w-full border-gray-400 border p-3 rounded-md focus:ring-2 focus:ring-vintage-gold focus:outline-none text-gray-900 placeholder-gray-600 bg-white transition-all duration-200 focus:shadow-md" placeholder="Érdeklődnék a Jaguar E-Type iránt..."></textarea>
            </div>
            <button type="button" className="w-full bg-vintage-gold text-vintage-dark font-bold py-3 rounded-md hover:bg-yellow-500 transition-all duration-300 transform hover:scale-[1.02] shadow-sm">
              Üzenet Küldése
            </button>
          </form>
        </div>

        <div className="flex flex-col justify-center space-y-8 animate-fade-in-up delay-200">
          <div>
            <h3 className="text-2xl font-serif font-bold text-vintage-dark mb-4">Bemutatóterem</h3>
            <p className="text-gray-600 mb-4">
              Látogassa meg exkluzív bemutatótermünket, ahol személyesen tekintheti meg kínálatunkat. 
              Kérjük, érkezés előtt egyeztessen időpontot.
            </p>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-gray-700 group cursor-pointer">
                <MapPin className="text-vintage-gold group-hover:scale-110 transition-transform" />
                <span className="group-hover:text-vintage-green transition-colors">1055 Budapest, Falk Miksa utca 12.</span>
              </div>
              <div className="flex items-center gap-3 text-gray-700 group cursor-pointer">
                <Phone className="text-vintage-gold group-hover:scale-110 transition-transform" />
                <span className="group-hover:text-vintage-green transition-colors">+36 1 234 5678</span>
              </div>
              <div className="flex items-center gap-3 text-gray-700 group cursor-pointer">
                <Mail className="text-vintage-gold group-hover:scale-110 transition-transform" />
                <span className="group-hover:text-vintage-green transition-colors">info@velvetclassics.hu</span>
              </div>
            </div>
          </div>
          
          <div className="bg-vintage-green text-vintage-cream p-6 rounded-lg shadow-lg">
            <h4 className="font-bold text-lg mb-2">Nyitvatartás</h4>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between"><span>Hétfő - Péntek:</span> <span>10:00 - 18:00</span></div>
              <div className="flex justify-between"><span>Szombat:</span> <span>10:00 - 14:00</span></div>
              <div className="flex justify-between"><span>Vasárnap:</span> <span>Zárva</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // --- LEGAL PAGES ---
  const TermsPage = () => (
    <div className="pt-28 pb-12 px-4 max-w-4xl mx-auto animate-fade-in">
      <h2 className="text-4xl font-serif font-bold text-vintage-green mb-8">Általános Szerződési Feltételek</h2>
      <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100 prose prose-lg text-gray-700 animate-fade-in-up">
        <h3>1. Bevezetés</h3>
        <p>A jelen Általános Szerződési Feltételek (a továbbiakban: ÁSZF) a Velvet Classics (székhely: 1055 Budapest, Falk Miksa utca 12.) által nyújtott szolgáltatások igénybevételének feltételeit tartalmazza.</p>
        <h3>2. A szolgáltatás tárgya</h3>
        <p>A Szolgáltató oldtimer és klasszikus gépjárművek, valamint alkatrészek értékesítésével foglalkozik.</p>
        <h3>3. Megrendelés és Vásárlás</h3>
        <p>A weboldalon keresztül leadott megrendelések ajánlattételnek minősülnek. A szerződés a Szolgáltató visszaigazolásával jön létre.</p>
      </div>
    </div>
  );

  const PrivacyPage = () => (
    <div className="pt-28 pb-12 px-4 max-w-4xl mx-auto animate-fade-in">
      <h2 className="text-4xl font-serif font-bold text-vintage-green mb-8">Adatkezelési Tájékoztató</h2>
      <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100 prose prose-lg text-gray-700 animate-fade-in-up">
        <div className="flex items-center gap-2 mb-4 text-vintage-gold">
          <Shield size={24} />
          <span className="font-bold text-sm">GDPR Megfelelőség</span>
        </div>
        <p>A Velvet Classics elkötelezett az Ön személyes adatainak védelme iránt. Jelen tájékoztató célja, hogy információt nyújtson arról, hogyan kezeljük adatait.</p>
        <h3>Kezelt adatok köre</h3>
        <ul>
          <li>Név, lakcím, telefonszám, e-mail cím.</li>
          <li>Vásárlási előzmények.</li>
        </ul>
        <h3>Adatfeldolgozás célja</h3>
        <p>A megrendelések teljesítése, számlázás, valamint hírlevél küldése (hozzájárulás esetén).</p>
      </div>
    </div>
  );

  const LegalNoticePage = () => (
    <div className="pt-28 pb-12 px-4 max-w-4xl mx-auto animate-fade-in">
      <h2 className="text-4xl font-serif font-bold text-vintage-green mb-8">Jogi Nyilatkozat</h2>
      <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100 prose prose-lg text-gray-700 animate-fade-in-up">
        <h3>Szerzői Jogok</h3>
        <p>A weboldalon található minden tartalom (szöveg, kép, grafika) a Velvet Classics tulajdonát képezi, és szerzői jogi védelem alatt áll.</p>
        <h3>Felelősségkizárás</h3>
        <p>A weboldalon található információk tájékoztató jellegűek. A Szolgáltató mindent megtesz az adatok pontosságáért, de nem vállal felelősséget az esetleges elírásokért vagy technikai hibákért.</p>
      </div>
    </div>
  );

  const ReturnPolicyPage = () => (
    <div className="pt-28 pb-12 px-4 max-w-4xl mx-auto animate-fade-in">
      <h2 className="text-4xl font-serif font-bold text-vintage-green mb-8">Visszaküldési és Garanciális Szabályzat</h2>
      <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100 prose prose-lg text-gray-700 animate-fade-in-up">
        <div className="flex items-center gap-2 mb-4 text-vintage-gold">
          <CornerUpLeft size={24} />
          <span className="font-bold text-sm">14 Napos Elállás</span>
        </div>
        <h3>Elállási Jog</h3>
        <p>A fogyasztót a termék átvételétől számított 14 napon belül indokolás nélküli elállási jog illeti meg alkatrészek vásárlása esetén.</p>
        <h3>Visszaküldés Menete</h3>
        <ol>
          <li>Jelezze elállási szándékát írásban az info@velvetclassics.hu címen.</li>
          <li>Juttassa vissza a terméket sértetlen állapotban címünkre.</li>
          <li>A termék beérkezését követően 14 napon belül visszatérítjük a vételárat.</li>
        </ol>
        <p className="italic text-sm mt-4">*Gépjárművek vásárlása esetén egyedi szerződési feltételek érvényesek.</p>
      </div>
    </div>
  );

  // --- CART DRAWER ---
  const CartDrawer = () => (
    <div className={`fixed inset-0 z-[60] ${isCartOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}>
      {/* Backdrop */}
      <div 
        className={`absolute inset-0 bg-black/50 transition-opacity duration-300 ${isCartOpen ? 'opacity-100' : 'opacity-0'}`}
        onClick={() => setIsCartOpen(false)}
      />
      
      {/* Drawer */}
      <div className={`absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl transform transition-transform duration-300 ease-out ${isCartOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex flex-col h-full">
          <div className="p-6 bg-vintage-green text-white flex justify-between items-center">
            <h2 className="text-xl font-serif font-bold flex items-center gap-2">
              <ShoppingBag /> Kosár
            </h2>
            <button onClick={() => setIsCartOpen(false)} className="hover:text-vintage-gold transition-colors">
              <ArrowRight size={24} />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {cart.length === 0 ? (
              <div className="text-center text-gray-500 mt-10 animate-fade-in">
                <p className="mb-4">A kosara jelenleg üres.</p>
                <button onClick={() => { setIsCartOpen(false); setCurrentPage('vehicles'); }} className="text-vintage-gold hover:underline">
                  Vásárlás folytatása
                </button>
              </div>
            ) : (
              cart.map(item => (
                <div key={item.id} className="flex gap-4 border-b border-gray-100 pb-4 animate-slide-in-right">
                  <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-md" />
                  <div className="flex-1">
                    <h3 className="font-bold text-vintage-dark text-sm">{item.name}</h3>
                    <p className="text-gray-500 text-xs uppercase">{item.type === 'vehicle' ? 'Jármű' : 'Alkatrész'}</p>
                    <div className="flex justify-between items-center mt-2">
                      <span className="font-bold text-vintage-green">{item.price.toLocaleString()} €</span>
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-gray-500">{item.quantity} db</span>
                        <button onClick={() => removeFromCart(item.id)} className="text-red-400 hover:text-red-600 transition-colors">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
          
          {cart.length > 0 && (
            <div className="p-6 bg-gray-50 border-t border-gray-200">
              <div className="flex justify-between items-center mb-4 text-lg font-bold text-vintage-dark">
                <span>Összesen:</span>
                <span>{totalAmount.toLocaleString()} €</span>
              </div>
              <button className="w-full bg-vintage-gold text-vintage-dark py-3 rounded-sm font-bold hover:bg-yellow-500 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1">
                Pénztár
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  // --- FOOTER ---
  const Footer = () => (
    <footer className="bg-vintage-green text-gray-300 py-12 border-t-4 border-vintage-gold">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <h3 className="text-2xl font-serif text-vintage-gold font-bold mb-4">VELVET Classics</h3>
          <p className="text-sm leading-relaxed text-gray-400">
            Prémium minőségű oldtimer autók kereskedelme és restaurálása több mint 30 éve. 
            Minden autó egy történet, mi segítünk továbbírni azt.
          </p>
        </div>
        <div>
          <h4 className="font-bold text-white mb-4">Navigáció</h4>
          <ul className="space-y-2 text-sm">
            <li><button onClick={() => setCurrentPage('home')} className="hover:text-vintage-gold transition-colors">Főoldal</button></li>
            <li><button onClick={() => setCurrentPage('parts')} className="hover:text-vintage-gold transition-colors">Alkatrészek</button></li>
            <li><button onClick={() => setCurrentPage('vehicles')} className="hover:text-vintage-gold transition-colors">Járművek</button></li>
            <li><button onClick={() => setCurrentPage('contact')} className="hover:text-vintage-gold transition-colors">Kapcsolat</button></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-white mb-4">Jogi</h4>
          <ul className="space-y-2 text-sm">
            <li><button onClick={() => setCurrentPage('terms')} className="hover:text-vintage-gold transition-colors">ÁSZF</button></li>
            <li><button onClick={() => setCurrentPage('privacy')} className="hover:text-vintage-gold transition-colors">Adatkezelési Tájékoztató</button></li>
            <li><button onClick={() => setCurrentPage('legal')} className="hover:text-vintage-gold transition-colors">Jogi nyilatkozat</button></li>
            <li><button onClick={() => setCurrentPage('returns')} className="hover:text-vintage-gold transition-colors">Visszaküldési nyilatkozat</button></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-white mb-4">Hírlevél</h4>
          <p className="text-xs mb-3 text-gray-400">Iratkozzon fel az új érkezésekért.</p>
          <div className="flex">
            <input type="email" placeholder="Email cím" className="bg-vintage-dark border-none text-white px-3 py-2 w-full text-sm focus:outline-none focus:ring-1 focus:ring-vintage-gold transition-all" />
            <button className="bg-vintage-gold text-vintage-dark px-3 py-2 font-bold hover:bg-white transition-colors">OK</button>
          </div>
        </div>
      </div>
      <div className="text-center mt-12 pt-8 border-t border-gray-700 text-xs text-gray-500">
        &copy; 2026 Velvet Classics. Minden jog fenntartva.
      </div>
    </footer>
  );

  // --- RENDER ---
  return (
    <div className="min-h-screen font-sans bg-vintage-cream flex flex-col">
      <Navbar 
        currentPage={currentPage} 
        setCurrentPage={setCurrentPage} 
        cartItems={cart} 
        toggleCart={() => setIsCartOpen(true)}
      />
      
      <CartDrawer />
      <CarDetailModal />
      
      <main className="flex-grow">
        {currentPage === 'home' && (
          <>
            <HeroSection />
            <div className="bg-white py-16 animate-fade-in">
              <div className="max-w-7xl mx-auto px-4 text-center">
                 <h3 className="text-3xl font-serif font-bold text-vintage-dark mb-12 animate-fade-in-up">Miért Válasszon Minket?</h3>
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                   <div className="p-6 group hover:-translate-y-2 transition-transform duration-300 animate-fade-in-up delay-100">
                     <div className="w-16 h-16 bg-vintage-gold/20 rounded-full flex items-center justify-center mx-auto mb-4 text-vintage-gold group-hover:bg-vintage-gold group-hover:text-white transition-colors duration-300">
                       <CheckCircle size={32} />
                     </div>
                     <h4 className="font-bold text-lg mb-2">Eredetiség Garancia</h4>
                     <p className="text-gray-500">Minden járművünket szakértők vizsgálják át és igazolják az eredetiségét.</p>
                   </div>
                   <div className="p-6 group hover:-translate-y-2 transition-transform duration-300 animate-fade-in-up delay-200">
                     <div className="w-16 h-16 bg-vintage-gold/20 rounded-full flex items-center justify-center mx-auto mb-4 text-vintage-gold group-hover:bg-vintage-gold group-hover:text-white transition-colors duration-300">
                       <Wrench size={32} />
                     </div>
                     <h4 className="font-bold text-lg mb-2">Szakértő Szerviz</h4>
                     <p className="text-gray-500">Saját műhelyünkben gondoskodunk a veterán autók speciális karbantartásáról.</p>
                   </div>
                   <div className="p-6 group hover:-translate-y-2 transition-transform duration-300 animate-fade-in-up delay-300">
                     <div className="w-16 h-16 bg-vintage-gold/20 rounded-full flex items-center justify-center mx-auto mb-4 text-vintage-gold group-hover:bg-vintage-gold group-hover:text-white transition-colors duration-300">
                       <Star size={32} />
                     </div>
                     <h4 className="font-bold text-lg mb-2">Exkluzív Közösség</h4>
                     <p className="text-gray-500">Vásárlóink meghívást kapnak zártkörű rendezvényeinkre és túráinkra.</p>
                   </div>
                 </div>
              </div>
            </div>
            <AboutSection />
          </>
        )}
        {currentPage === 'vehicles' && <VehiclesPage />}
        {currentPage === 'parts' && <PartsPage />}
        {currentPage === 'contact' && <ContactPage />}
        {currentPage === 'terms' && <TermsPage />}
        {currentPage === 'privacy' && <PrivacyPage />}
        {currentPage === 'legal' && <LegalNoticePage />}
        {currentPage === 'returns' && <ReturnPolicyPage />}
      </main>

      <Footer />
      <ChatBot />
    </div>
  );
};

export default App;