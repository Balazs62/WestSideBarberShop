import React, { useState, useMemo } from "react";
import { Search, Clock, DollarSign } from "lucide-react";
import { motion } from "framer-motion";

export default function ServiceSelection({ services, selectedService, onSelectService }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = useMemo(() => {
    const cats = new Set(services.map((s) => s.category || "Általános"));
    return ["all", ...Array.from(cats)];
  }, [services]);

  const filteredServices = useMemo(() => {
    return services.filter((service) => {
      const matchesSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === "all" || (service.category || "Általános") === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [services, searchTerm, selectedCategory]);

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
          <input
            type="text"
            placeholder="Keresés szolgáltatás..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary min-h-[44px]"
          />
        </div>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-4 py-3 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary min-h-[44px]"
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat === "all" ? "Összes kategória" : cat}
            </option>
          ))}
        </select>
      </div>

      {/* Service Cards */}
      <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {filteredServices.map((service, index) => (
          <motion.button
            key={service.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            onClick={() => onSelectService(service.id)}
            className={`text-left p-4 sm:p-6 rounded-xl sm:rounded-2xl border-2 transition-all duration-200 ${
              selectedService === service.id
                ? "border-primary bg-primary/5 shadow-lg scale-[1.02]"
                : "border-border hover:border-primary/50 hover:shadow-md"
            }`}
          >
            <div className="font-semibold text-base sm:text-lg text-foreground mb-2">
              {service.name}
            </div>
            <div className="space-y-1 sm:space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{service.duration} perc</span>
              </div>
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                <span className="font-semibold text-foreground">{service.price} Ft</span>
              </div>
            </div>
          </motion.button>
        ))}
      </div>

      {filteredServices.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          Nincs találat a megadott feltételek alapján.
        </div>
      )}
    </div>
  );
}
