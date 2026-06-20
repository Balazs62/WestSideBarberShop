import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Calendar, Clock, User } from "lucide-react";
import { AvailabilityService } from "@/services/AvailabilityService";

export default function BookingCalendar({
  selectedDate,
  setSelectedDate,
  selectedEmployee,
  setSelectedEmployee,
  selectedService,
  onDateSelect,
  onEmployeeSelect,
  selectedTime,
  setSelectedTime,
  startDate = new Date(),
}) {
  const [currentMonth, setCurrentMonth] = useState(new Date(startDate));
  const [availableSlots, setAvailableSlots] = useState([]);
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    // Load employees
    import("@/data/mockDatabase").then(({ getDatabase }) => {
      const db = getDatabase();
      setEmployees(db.employees.filter((e) => e.active));
    });
  }, []);

  useEffect(() => {
    if (selectedDate && selectedEmployee && selectedService) {
      const slots = AvailabilityService.getAvailableSlots(
        selectedEmployee,
        selectedDate,
        selectedService.duration
      );
      setAvailableSlots(slots);
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
    // Use local date format to avoid UTC timezone issues
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const dayStr = String(date.getDate()).padStart(2, "0");
    const dateStr = `${year}-${month}-${dayStr}`;
    setSelectedDate(dateStr);
    onDateSelect?.(dateStr);
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

  const monthName = currentMonth.toLocaleDateString("hu-HU", {
    month: "long",
    year: "numeric",
  });
  const daysInMonth = getDaysInMonth(currentMonth);
  const firstDay = getFirstDayOfMonth(currentMonth);
  const days = [];

  // Empty cells
  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }

  // Days of month
  for (let day = 1; day <= daysInMonth; day++) {
    days.push(day);
  }

  return (
    <div className="w-full">
      {/* Employee Selection */}
      <div className="mb-8">
        <label className="block text-sm font-medium text-foreground mb-3">
          <User className="inline mr-2 w-4 h-4" />
          Barber választása
        </label>
        <select
          value={selectedEmployee || ""}
          onChange={(e) => {
            setSelectedEmployee(Number(e.target.value));
            onEmployeeSelect?.(Number(e.target.value));
          }}
          className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="">Válassz barbvert...</option>
          {employees.map((emp) => (
            <option key={emp.id} value={emp.id}>
              {emp.name}
            </option>
          ))}
        </select>
      </div>

      {/* Calendar Grid */}
      <div className="bg-card border border-border rounded-lg p-4 sm:p-6">
        {/* Month Navigation */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={handlePrevMonth}
            className="p-2 hover:bg-primary/10 rounded-lg transition"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h2 className="font-display text-lg font-bold text-center capitalize">
            {monthName}
          </h2>
          <button
            onClick={handleNextMonth}
            className="p-2 hover:bg-primary/10 rounded-lg transition"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Day Headers */}
        <div className="grid grid-cols-7 gap-2 mb-2">
          {["H", "K", "Sze", "Cs", "P", "Szo", "V"].map((day) => (
            <div
              key={day}
              className="text-center text-sm font-semibold text-muted-foreground py-2"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7 gap-2">
          {days.map((day, idx) => {
            if (day === null) {
              return <div key={`empty-${idx}`} className="p-2" />;
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

            // Check if employee works this day
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
                  p-2 rounded-lg text-sm font-medium transition
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
      </div>

      {/* Time Slots */}
      {selectedDate && selectedEmployee && selectedService && (
        <div className="mt-8 bg-card border border-border rounded-lg p-6">
          <h3 className="font-semibold text-foreground mb-4 flex items-center">
            <Clock className="inline mr-2 w-4 h-4" />
            Szabad időpontok: {selectedDate}
          </h3>

          {availableSlots.length > 0 ? (
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
              {availableSlots.map((time) => (
                <button
                  key={time}
                  className={`py-2 px-3 border-2 rounded-lg font-medium transition ${
                    selectedTime === time
                      ? "bg-primary text-white border-primary"
                      : "bg-primary/10 border-primary text-primary hover:bg-primary hover:text-white"
                  }`}
                  onClick={() => setSelectedTime?.(time)}
                >
                  {time}
                </button>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">
              Sajnos nincs szabad időpont erre a napra. Válassz másik napot vagy barbvert.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
