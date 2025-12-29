import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../lib/firebase";
import MenuCard from "../../components/ui/MenuCard";
import { Loader, Search } from "lucide-react";

export default function Menu() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState(["All"]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "menuItems"));
        const menuItems = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setItems(menuItems);

        // Extract unique categories from array or string fields
        const allCategories = menuItems.flatMap((item) => {
          if (Array.isArray(item.categories)) return item.categories;
          if (item.category) return [item.category];
          return [];
        });

        const uniqueCategories = [
          "All",
          ...new Set(allCategories.filter(Boolean)),
        ];
        setCategories(uniqueCategories);
      } catch (error) {
        console.error("Error fetching menu:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMenu();
  }, []);

  const filteredItems = items.filter((item) => {
    const matchesCategory =
      activeCategory === "All" ||
      (Array.isArray(item.categories)
        ? item.categories.includes(activeCategory)
        : item.category === activeCategory);

    const matchesSearch = item.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <div className="glass shadow-sm border-b border-gray-200 py-8 px-4 sm:px-6 mb-8 sticky top-16 z-40">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <h1 className="text-3xl font-bold text-midnight">Our Menu</h1>
            
            {/* Search Bar */}
            <div className="relative w-full md:max-w-xs">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-white/20 rounded-xl leading-5 bg-white/20 backdrop-blur-md text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm transition-colors duration-200 shadow-sm"
                placeholder="Search food items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Category Filter */}
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${
                  activeCategory === cat
                    ? "bg-primary text-white shadow-lg shadow-primary/30"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Search Bar */}


        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div
                key={i}
                className="h-80 bg-gray-200 rounded-2xl animate-pulse"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredItems.map((item) => (
              <MenuCard key={item.id} item={item} />
            ))}
          </div>
        )}

        {!loading && filteredItems.length === 0 && (
          <div className="col-span-full text-center py-20 glass rounded-3xl border border-gray-100 shadow-sm">
            <div className="text-gray-400 text-6xl mb-4">🍽️</div>
            <p className="text-xl text-gray-500 font-medium">
              {searchQuery
                ? `No items found matching "${searchQuery}"`
                : "No items found in this category."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
