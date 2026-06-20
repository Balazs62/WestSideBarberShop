import React, { useState } from "react";
import { Star, Clock, Heart } from "lucide-react";
import { motion } from "framer-motion";

export default function BarberSelection({ employees, selectedEmployee, onSelectEmployee, selectedDate, selectedService }) {
  const [favoriteBarber, setFavoriteBarber] = useState(null);

  const handleFavoriteToggle = (e, barberId) => {
    e.stopPropagation();
    setFavoriteBarber(favoriteBarber === barberId ? null : barberId);
  };

  return (
    <div className="space-y-3 sm:space-y-4">
      {/* Any Available Barber Option */}
      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        onClick={() => onSelectEmployee(null)}
        className={`w-full text-left p-4 sm:p-6 rounded-xl sm:rounded-2xl border-2 transition-all duration-200 min-h-[88px] ${
          selectedEmployee === null
            ? "border-primary bg-primary/5 shadow-lg scale-[1.02]"
            : "border-border hover:border-primary/50 hover:shadow-md"
        }`}
      >
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
            <Clock className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
          </div>
          <div className="flex-1">
            <div className="font-semibold text-base sm:text-lg text-foreground">
              Bármelyik elérhető barber
            </div>
            <div className="text-xs sm:text-sm text-muted-foreground">
              A rendszer automatikusan kiválasztja a legközelebbi szabad időpontot
            </div>
          </div>
        </div>
      </motion.button>

      {/* Individual Barbers */}
      <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {employees.map((barber, index) => (
          <motion.button
            key={barber.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            onClick={() => onSelectEmployee(barber.id)}
            className={`text-left p-4 sm:p-6 rounded-xl sm:rounded-2xl border-2 transition-all duration-200 relative min-h-[200px] sm:min-h-auto ${
              selectedEmployee === barber.id
                ? "border-primary bg-primary/5 shadow-lg scale-[1.02]"
                : "border-border hover:border-primary/50 hover:shadow-md"
            }`}
          >
            {/* Favorite Button */}
            <button
              onClick={(e) => handleFavoriteToggle(e, barber.id)}
              className="absolute top-3 sm:top-4 right-3 sm:right-4 p-2 rounded-full hover:bg-primary/10 transition min-h-[36px] min-w-[36px] flex items-center justify-center"
            >
              <Heart
                className={`w-5 h-5 ${
                  favoriteBarber === barber.id
                    ? "fill-red-500 text-red-500"
                    : "text-muted-foreground"
                }`}
              />
            </button>

            <div className="flex flex-col items-center text-center">
              {/* Profile Photo */}
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden mb-3 sm:mb-4 border-2 border-border">
                <img
                  src={barber.photo}
                  alt={barber.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Name */}
              <div className="font-semibold text-base sm:text-lg text-foreground mb-1">
                {barber.name}
              </div>

              {/* Rating */}
              <div className="flex items-center gap-1 mb-2">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="font-semibold text-foreground">{barber.rating}</span>
                <span className="text-xs sm:text-sm text-muted-foreground">({barber.reviewCount})</span>
              </div>

              {/* Bio */}
              <div className="text-xs sm:text-sm text-muted-foreground mb-2 sm:mb-3 line-clamp-2">
                {barber.bio}
              </div>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
