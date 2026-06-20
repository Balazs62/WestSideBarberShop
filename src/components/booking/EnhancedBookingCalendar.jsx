import React, { useState, useEffect, useMemo } from "react";
import { ChevronLeft, ChevronRight, Calendar, Clock, Sparkles, CalendarDays, Filter, Lock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { AvailabilityService } from "@/services/AvailabilityService";
import { getDatabase } from "@/data/mockDatabase";

export default function EnhancedBookingCalendar({
  selectedDate,
  setSelectedDate,
  selectedEmployee,
  setSelectedEmployee,
  selectedService,
  selectedTime,
  setSelectedTime,
  onDateSelect,
  onEmployeeSelect,
}) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [availableSlots, setAvailableSlots] = useState([]);
  const [breakSlots, setBreakSlots] = useState([]);
  const [allSlots, setAllSlots] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [filterMode, setFilterMode] = useState("all"); // all, today, tomorrow, nearest
  const [showCalendar, setShowCalendar] = useState(true);

  useEffect(() => {
    import("@/data/mockDatabase").then(({ getDatabase }) => {
      const db = getDatabase();
      setEmployees(db.employees.filter((e) => e.active));
    });
  }, []);

  useEffect(() => {
    if (selectedDate && selectedEmployee && selectedService) {
      setShowCalendar(false);
      setLoadingSlots(true);
      // Simulate real-time update
      const timer = setTimeout(() => {
        const slots = AvailabilityService.getAvailableSlots(
          selectedEmployee,
          selectedDate,
          selectedService.duration
        );
        setAvailableSlots(slots);
        
        // Get schedule to generate all possible slots
        const schedule = AvailabilityService.getEmployeeScheduleForDate(selectedEmployee, selectedDate);
        if (schedule) {
          const startMin = AvailabilityService.timeToMinutes(schedule.start);
          const endMin = AvailabilityService.timeToMinutes(schedule.end);
          const granularity = 30; // 30 minute granularity
          const allPossibleSlots = [];
          for (let min = startMin; min < endMin; min += granularity) {
            allPossibleSlots.push(AvailabilityService.minutesToTime(min));
          }
          setAllSlots(allPossibleSlots);
        }
        
        // Get break slots for the selected date
        const breaks = AvailabilityService.getEmployeeBreaks(selectedEmployee, selectedDate);
        const breakTimes = [];
        breaks.forEach(brk => {
          const startMin = AvailabilityService.timeToMinutes(brk.start);
          const endMin = AvailabilityService.timeToMinutes(brk.end);
          for (let min = startMin; min < endMin; min += 30) {
            breakTimes.push(AvailabilityService.minutesToTime(min));
          }
        });
        setBreakSlots(breakTimes);
        
        setLoadingSlots(false);
      }, 300);

      return () => clearTimeout(timer);
    } else {
      setShowCalendar(true);
    }
  }, [selectedDate, selectedEmployee, selectedService]);

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const handleDateClick = (day) => {
    const date = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      day
    );
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const dayStr = String(date.getDate()).padStart(2, "0");
    const dateStr = `${year}-${month}-${dayStr}`;
    setSelectedDate(dateStr);
    onDateSelect?.(dateStr);
    setSelectedTime(null);
  };

  const handlePrevMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1)
    );
  };

  const handleNextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1)
    );
  };

  const handleFilterToday = () => {
    const today = new Date();
    const dateStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
    setSelectedDate(dateStr);
    onDateSelect?.(dateStr);
    setFilterMode("today");
  };

  const handleFilterTomorrow = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dateStr = `${tomorrow.getFullYear()}-${String(tomorrow.getMonth() + 1).padStart(2, "0")}-${String(tomorrow.getDate()).padStart(2, "0")}`;
    setSelectedDate(dateStr);
    onDateSelect?.(dateStr);
    setFilterMode("tomorrow");
  };

  const handleFindNearestSlot = () => {
    if (!selectedEmployee || !selectedService) return;

    const db = getDatabase();
    const startDate = new Date();
    let nearestSlot = null;
    let nearestDate = null;

    // Search next 30 days
    for (let i = 1; i <= 30; i++) {
      const searchDate = new Date(startDate);
      searchDate.setDate(startDate.getDate() + i);
      const dateStr = `${searchDate.getFullYear()}-${String(searchDate.getMonth() + 1).padStart(2, "0")}-${String(searchDate.getDate()).padStart(2, "0")}`;

      const slots = AvailabilityService.getAvailableSlots(
        selectedEmployee,
        dateStr,
        selectedService.duration
      );

      if (slots.length > 0) {
        nearestSlot = slots[0];
        nearestDate = dateStr;
        break;
      }
    }

    if (nearestSlot && nearestDate) {
      setSelectedDate(nearestDate);
      onDateSelect?.(nearestDate);
      setSelectedTime(nearestSlot);
      setCurrentMonth(new Date(nearestDate));
      setFilterMode("nearest");
    }
  };

  const handleChangeDate = () => {
    setShowCalendar(true);
    setSelectedTime(null);
  };

  // Get slot state
  const getSlotState = (time) => {
    if (selectedTime === time) return "selected";
    if (breakSlots.includes(time)) return "break";
    if (availableSlots.includes(time)) return "available";
    return "occupied";
  };

  const monthName = currentMonth.toLocaleDateString("hu-HU", {
    month: "long",
    year: "numeric",
  });
  const daysInMonth = getDaysInMonth(currentMonth);
  const firstDay = getFirstDayOfMonth(currentMonth);
  const days = [];

  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    days.push(day);
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Filter Buttons */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={handleFilterToday}
          className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg border transition min-h-[44px] ${
            filterMode === "today"
              ? "border-primary bg-primary/10 text-primary"
              : "border-border hover:border-primary/50"
          }`}
        >
          <CalendarDays className="w-4 h-4" />
          <span className="text-sm">Ma</span>
        </button>
        <button
          onClick={handleFilterTomorrow}
          className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg border transition min-h-[44px] ${
            filterMode === "tomorrow"
              ? "border-primary bg-primary/10 text-primary"
              : "border-border hover:border-primary/50"
          }`}
        >
          <CalendarDays className="w-4 h-4" />
          <span className="text-sm">Holnap</span>
        </button>
        <button
          onClick={handleFindNearestSlot}
          disabled={!selectedEmployee || !selectedService}
          className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg border transition min-h-[44px] ${
            filterMode === "nearest"
              ? "border-primary bg-primary/10 text-primary"
              : "border-border hover:border-primary/50"
          } ${!selectedEmployee || !selectedService ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          <Sparkles className="w-4 h-4" />
          <span className="text-sm hidden sm:inline">Legközelebbi szabad</span>
          <span className="text-sm sm:hidden">Legközelebbi</span>
        </button>
      </div>

      {/* Employee Selection */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-3">
          Barber választása
        </label>
        <select
          value={selectedEmployee || ""}
          onChange={(e) => {
            setSelectedEmployee(Number(e.target.value));
            onEmployeeSelect?.(Number(e.target.value));
            setSelectedTime(null);
            setShowCalendar(true);
          }}
          className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary min-h-[44px]"
        >
          <option value="">Válassz barbvert...</option>
          {employees.map((emp) => (
            <option key={emp.id} value={emp.id}>
              {emp.name}
            </option>
          ))}
        </select>
      </div>

      {/* Calendar Grid - Hidden when date is selected */}
      <AnimatePresence>
        {showCalendar && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-card border border-border rounded-lg p-3 sm:p-4 md:p-6"
          >
            {/* Month Navigation */}
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <button
                onClick={handlePrevMonth}
                className="p-2 hover:bg-primary/10 rounded-lg transition min-h-[44px] min-w-[44px] flex items-center justify-center"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <h2 className="font-display text-base sm:text-lg font-bold text-center capitalize">
                {monthName}
              </h2>
              <button
                onClick={handleNextMonth}
                className="p-2 hover:bg-primary/10 rounded-lg transition min-h-[44px] min-w-[44px] flex items-center justify-center"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Day Headers */}
            <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-2">
              {["H", "K", "Sze", "Cs", "P", "Szo", "V"].map((day) => (
                <div
                  key={day}
                  className="text-center text-xs sm:text-sm font-semibold text-muted-foreground py-1 sm:py-2"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Days */}
            <div className="grid grid-cols-7 gap-1 sm:gap-2">
              {days.map((day, idx) => {
                if (day === null) {
                  return <div key={`empty-${idx}`} className="p-1 sm:p-2" />;
                }

                const date = new Date(
                  currentMonth.getFullYear(),
                  currentMonth.getMonth(),
                  day
                );
                const year = date.getFullYear();
                const month = String(date.getMonth() + 1).padStart(2, "0");
                const dayStr = String(date.getDate()).padStart(2, "0");
                const dateStr = `${year}-${month}-${dayStr}`;
                const isSelected = selectedDate === dateStr;

                const today = new Date();
                const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
                const isToday = dateStr === todayStr;
                const isPast = AvailabilityService.isTodayOrPast(dateStr);

                let isAvailable = true;
                if (selectedEmployee) {
                  const schedule = AvailabilityService.getEmployeeScheduleForDate(
                    selectedEmployee,
                    dateStr
                  );
                  isAvailable = schedule !== null;
                }

                return (
                  <button
                    key={day}
                    onClick={() => !isPast && isAvailable && handleDateClick(day)}
                    disabled={isPast || !isAvailable || !selectedEmployee}
                    className={`
                      p-1 sm:p-2 rounded-lg text-xs sm:text-sm font-medium transition min-h-[36px] sm:min-h-[44px]
                      ${
                        isSelected
                          ? "bg-primary text-white ring-2 ring-primary/30"
                          : isToday
                          ? "bg-muted text-muted-foreground border border-border"
                          : "bg-background border border-border"
                      }
                      ${
                        isPast || !isAvailable || !selectedEmployee
                          ? "opacity-50 cursor-not-allowed"
                          : "hover:border-primary cursor-pointer"
                      }
                    `}
                  >
                    {day}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Time Slots - Grouped by Hour */}
      <AnimatePresence>
        {selectedDate && selectedEmployee && selectedService && !showCalendar && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4"
          >
            {/* Date Header with Change Button */}
            <div className="flex items-center justify-between gap-2">
              <div className="flex-1">
                <h3 className="font-semibold text-foreground flex items-center text-sm sm:text-base">
                  <Calendar className="inline mr-2 w-4 h-4" />
                  {selectedDate}
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                  Válassz időpontot
                </p>
              </div>
              <button
                onClick={handleChangeDate}
                className="px-3 sm:px-4 py-2 text-xs sm:text-sm border border-border rounded-lg hover:bg-muted transition whitespace-nowrap min-h-[44px]"
              >
                Dátum módosítása
              </button>
            </div>

            {loadingSlots ? (
              <div className="text-center py-8 text-muted-foreground">
                Betöltés...
              </div>
            ) : availableSlots.length > 0 ? (
              <>
                {/* Time Slots - Simple Compact Grid with 30-minute intervals */}
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2">
                  {allSlots.map(time => {
                    const state = getSlotState(time);
                    return (
                      <button
                        key={time}
                        onClick={() => setSelectedTime?.(time)}
                        disabled={state !== "available" && state !== "selected"}
                        className={`
                          py-3 px-2 sm:py-2 sm:px-3 border-2 rounded-md font-medium transition text-xs sm:text-sm relative min-h-[48px] sm:min-h-[44px]
                          ${
                            state === "selected"
                              ? "bg-primary text-white border-primary shadow-lg shadow-primary/30"
                              : state === "available"
                              ? "bg-primary/10 border-primary text-primary hover:bg-primary hover:text-white"
                              : state === "break"
                              ? "bg-muted border-border text-muted-foreground cursor-not-allowed opacity-50 bg-[length:8px_8px] bg-[linear-gradient(45deg,rgba(0,0,0,0.05)_25%,transparent_25%,transparent_50%,rgba(0,0,0,0.05)_50%,rgba(0,0,0,0.05)_75%,transparent_75%,transparent)]"
                              : "bg-muted border-border text-muted-foreground cursor-not-allowed opacity-50"
                          }
                        `}
                      >
                        {state === "break" && (
                          <Lock className="absolute top-0.5 right-0.5 w-2.5 h-2.5 text-muted-foreground" />
                        )}
                        {time}
                      </button>
                    );
                  })}
                </div>
              </>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                Sajnos nincs szabad időpont erre a napra. Válassz másik napot vagy barbvert.
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
