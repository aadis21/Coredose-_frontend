import ProductCard from '@/components/ProductCard';
import { fetchProducts, ProductDTO } from '@/lib/api';

const getProducts = async (): Promise<Array<{ id: string; name: string; slug: string; price: number; image: string; rating: number; reviews: number }>> => {
  const products = await fetchProducts();
  return products.map((product) => ({
    id: product._id,
    name: product.name,
    slug: product.slug,
    price: product.price,
    image: product.images?.[0] ?? product.image ?? '/images/placeholder.jpg',
    rating: product.ratings ?? 0,
    reviews: product.numReviews ?? 0,
  }));
};

export default async function ShopPage() {
  const products = await getProducts();

  return (
    <div className="w-full min-h-screen bg-background">
      {/* Header Banner */}
      <section className="relative w-full h-[40vh] flex items-center justify-center overflow-hidden border-b border-muted/10">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0e] to-background z-0" />
        <div className="relative z-10 text-center px-4">
          <h1 className="text-6xl md:text-8xl font-bebas text-white tracking-wider mb-4 drop-shadow-2xl">
            THE <span className="text-primary">LINEUP</span>
          </h1>
          <p className="text-secondary font-sans uppercase tracking-[0.2em] text-sm">
            Zero proprietary blends. 100% Transparency.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-7xl mx-auto px-8 py-16 flex flex-col md:flex-row gap-12">
        {/* Sidebar Filters */}
        <aside className="w-full md:w-64 flex-shrink-0 flex flex-col gap-8">
          <div>
            <h3 className="font-bebas text-2xl tracking-wide text-white mb-4 border-b border-muted/20 pb-2">Categories</h3>
            <ul className="flex flex-col gap-3 font-sans text-sm text-secondary uppercase tracking-wider">
              <li className="hover:text-primary cursor-pointer transition-colors">All Products</li>
              <li className="hover:text-primary cursor-pointer transition-colors">Proteins</li>
              <li className="hover:text-primary cursor-pointer transition-colors">Pre-Workouts</li>
              <li className="hover:text-primary cursor-pointer transition-colors">Recovery & Aminos</li>
              <li className="hover:text-primary cursor-pointer transition-colors">Health & Wellness</li>
            </ul>
          </div>
          <div>
            <h3 className="font-bebas text-2xl tracking-wide text-white mb-4 border-b border-muted/20 pb-2">Filter By Goal</h3>
            <ul className="flex flex-col gap-3 font-sans text-sm text-secondary uppercase tracking-wider">
              <li className="hover:text-primary cursor-pointer transition-colors">Muscle Gain</li>
              <li className="hover:text-primary cursor-pointer transition-colors">Fat Loss</li>
              <li className="hover:text-primary cursor-pointer transition-colors">Endurance</li>
            </ul>
          </div>
        </aside>

        {/* Product Grid */}
        <div className="flex-1">
          <div className="flex justify-between items-center mb-8 border-b border-muted/10 pb-4">
            <p className="font-sans text-sm text-secondary uppercase tracking-widest">{products.length} Products Found</p>
            <select className="bg-transparent border border-muted/30 text-white font-sans text-sm uppercase px-4 py-2 focus:outline-none focus:border-primary">
              <option className="bg-[#050507]">Sort By: Recommended</option>
              <option className="bg-[#050507]">Sort By: Price Low-High</option>
              <option className="bg-[#050507]">Sort By: Price High-Low</option>
              <option className="bg-[#050507]">Sort By: Highest Rated</option>
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map(product => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
