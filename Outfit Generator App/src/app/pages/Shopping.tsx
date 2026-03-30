import React, { useState, useEffect, FormEvent } from "react";
import { Search, ExternalLink } from "lucide-react";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Input } from "../components/ui/input";
import { Product } from "../types/product";

interface Category {
  label: string;
  query: string;
}

interface ProductCardProps {
  product: Product;
}

const CATEGORIES: Category[] = [
  { label: "All", query: "men's streetwear clothing" },
  { label: "Tops", query: "men's graphic tees hoodies" },
  { label: "Bottoms", query: "men's cargo pants slim jeans" },
  { label: "Footwear", query: "men's sneakers shoes" },
  { label: "Outerwear", query: "men's jackets bombers" },
  { label: "Accessories", query: "men's caps bags accessories" },
];

export default function Shopping() {
  const [activeCategory, setActiveCategory] = useState<number>(0);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [searchInput, setSearchInput] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const fetchProducts = async (query: string): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `https://real-time-product-search.p.rapidapi.com/search-v2?q=${encodeURIComponent(query)}&country=us&language=en`,
        {
          headers: {
            "x-rapidapi-key": (import.meta as any).env.VITE_RAPIDAPI_KEY as string,
            "x-rapidapi-host": "real-time-product-search.p.rapidapi.com",
          },
        }
      );
      const data = await res.json();
      setProducts(data.data?.products ?? []);
    } catch {
      setError("Couldn't load products. Check your API key.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const query = searchQuery || CATEGORIES[activeCategory].query;
    fetchProducts(query);
  }, [activeCategory, searchQuery]);

  const handleSearch = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    setSearchQuery(searchInput.trim());
    setActiveCategory(0);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <form onSubmit={handleSearch} className="flex gap-2 w-full sm:w-auto">
          <Input
            type="text"
            placeholder="Search pieces..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-64"
          />
          <Button type="submit" variant="outline" size="sm">
            <Search className="w-4 h-4" />
          </Button>
        </form>

        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat, i) => (
            <button
              key={cat.label}
              onClick={() => {
                setActiveCategory(i);
                setSearchQuery("");
                setSearchInput("");
              }}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors border ${
                activeCategory === i && !searchQuery
                  ? "bg-purple-600 text-white border-purple-600"
                  : "bg-white text-gray-600 border-gray-200 hover:border-purple-300 hover:text-purple-600"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {loading && (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-purple-200 border-t-purple-600 animate-spin" />
          <p className="text-sm text-gray-500">Loading products...</p>
        </div>
      )}

      {error && !loading && (
        <div className="flex items-center justify-center py-20">
          <p className="text-sm text-red-500">{error}</p>
        </div>
      )}

      {!loading && !error && products.length === 0 && (
        <div className="flex items-center justify-center py-20">
          <p className="text-sm text-gray-400">No results found.</p>
        </div>
      )}

      {!loading && !error && products.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {products.map((product, i) => (
            <ProductCard key={product.product_id ?? i} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}

function ProductCard({ product }: ProductCardProps) {
  const price: string =
    product.offer?.price ??
    product.typical_price_range?.[0] ??
    "—";

  const image: string | null =
    product.product_photos?.[0] ??
    product.product_photo ??
    null;

  const retailer: string =
    product.offer?.store_name ?? product.product_source ?? "";

  const href = product.offer?.offer_page_url ?? product.product_page_url ?? "#";

  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="group block">
      <Card className="overflow-hidden h-full transition-shadow hover:shadow-md">
        <div className="relative aspect-[3/4] bg-gray-100 overflow-hidden">
          {image ? (
            <img
              src={image}
              alt={product.product_title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-3xl">
              👕
            </div>
          )}
          {retailer && (
            <Badge
              variant="secondary"
              className="absolute top-2 left-2 text-xs opacity-90"
            >
              {retailer}
            </Badge>
          )}
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="bg-white rounded-full p-1 shadow">
              <ExternalLink className="w-3 h-3 text-gray-600" />
            </div>
          </div>
        </div>

        <CardContent className="p-3">
          <p className="text-xs text-gray-800 leading-snug line-clamp-2 mb-2">
            {product.product_title}
          </p>
          <p className="text-sm font-semibold text-purple-600">{price}</p>
        </CardContent>
      </Card>
    </a>
  );
}