import { Star, ShoppingBag, Filter } from 'lucide-react';
import { useProducts } from '../hooks/useAppData';
import { useState } from 'react';

const categories = ['all', 'cleanser', 'serum', 'moisturizer', 'treatment', 'sunscreen'];

export function ProductsTab() {
  const { products } = useProducts();
  const [activeCategory, setActiveCategory] = useState('all');
  const [sortBy, setSortBy] = useState<'rating' | 'price'>('rating');

  const filteredProducts = products
    .filter(p => activeCategory === 'all' || p.category === activeCategory)
    .sort((a, b) => {
      if (sortBy === 'rating') return b.rating - a.rating;
      return a.price - b.price;
    });

  return (
    <div className="min-h-screen pb-24 bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-600 to-teal-500 pt-12 pb-8 px-6">
        <div className="max-w-lg mx-auto">
          <h1 className="text-white text-2xl font-semibold">Products</h1>
          <p className="text-teal-100 text-sm mt-1">Recommended for your skin type</p>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-6 -mt-4">
        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-lg shadow-slate-200/50 p-4">
          {/* Category Filter */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                  activeCategory === category
                    ? 'bg-teal-500 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>

          {/* Sort */}
          <div className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-100">
            <Filter className="w-4 h-4 text-slate-400" />
            <span className="text-sm text-slate-500">Sort by:</span>
            <button
              onClick={() => setSortBy('rating')}
              className={`text-sm font-medium ${sortBy === 'rating' ? 'text-teal-600' : 'text-slate-400'}`}
            >
              Rating
            </button>
            <span className="text-slate-300">|</span>
            <button
              onClick={() => setSortBy('price')}
              className={`text-sm font-medium ${sortBy === 'price' ? 'text-teal-600' : 'text-slate-400'}`}
            >
              Price
            </button>
          </div>
        </div>

        {/* Product Grid */}
        <div className="mt-6 space-y-4">
          {filteredProducts.map(product => (
            <div
              key={product.id}
              className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="flex">
                {/* Product Image */}
                <div className="w-28 h-28 bg-slate-100 flex-shrink-0 overflow-hidden">
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = 'https://images.pexels.com/photos/4041392/pexels-photo-4041392.jpeg?auto=compress&cs=tinysrgb&w=400';
                    }}
                  />
                </div>

                {/* Product Info */}
                <div className="flex-1 p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs text-teal-600 font-medium uppercase tracking-wide">{product.category}</p>
                      <h3 className="font-semibold text-slate-800 mt-1">{product.name}</h3>
                      <p className="text-sm text-slate-500">{product.brand}</p>
                    </div>
                    <div className="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-lg">
                      <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                      <span className="text-sm font-medium text-amber-700">{product.rating}</span>
                    </div>
                  </div>

                  <p className="text-sm text-slate-500 mt-2 line-clamp-2">{product.description}</p>

                  <div className="flex items-center justify-between mt-3">
                    <span className="text-lg font-bold text-slate-800">${product.price.toFixed(2)}</span>
                    <button className="flex items-center gap-2 px-4 py-2 bg-teal-50 text-teal-600 rounded-xl font-medium hover:bg-teal-100 transition-colors">
                      <ShoppingBag className="w-4 h-4" />
                      Add
                    </button>
                  </div>
                </div>
              </div>

              {/* Benefits Tags */}
              <div className="px-4 pb-4 flex flex-wrap gap-2">
                {product.benefits.slice(0, 3).map((benefit, i) => (
                  <span
                    key={i}
                    className="text-xs px-2 py-1 bg-slate-50 text-slate-600 rounded-lg"
                  >
                    {benefit}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <ShoppingBag className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500">No products found in this category</p>
          </div>
        )}
      </div>
    </div>
  );
}
