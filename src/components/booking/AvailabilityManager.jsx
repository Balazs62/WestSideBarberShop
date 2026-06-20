import React, { useState, useEffect } from "react";
import { Clock, Plus, Trash2, Calendar, AlertCircle } from "lucide-react";
import { ScheduleService } from "@/services/ScheduleService";
import { getDatabase } from "@/data/mockDatabase";

const DAYS_OF_WEEK = [
  { key: "monday", label: "Hétfő" },
  { key: "tuesday", label: "Kedd" },
  { key: "wednesday", label: "Szerda" },
  { key: "thursday", label: "Csütörtök" },
  { key: "friday", label: "Péntek" },
  { key: "saturday", label: "Szombat" },
  { key: "sunday", label: "Vasárnap" },
];

export default function AvailabilityManager({ employeeId }) {
  const [schedule, setSchedule] = useState(null);
  const [editing, setEditing] = useState({});
  const [message, setMessage] = useState(null);

  useEffect(() => {
    loadSchedule();
  }, [employeeId]);

  const loadSchedule = () => {
    const sched = ScheduleService.getEmployeeSchedule(employeeId);
    setSchedule(sched);
  };

  const handleScheduleChange = (dayOfWeek, startTime, endTime) => {
    const result = ScheduleService.updateRecurringSchedule(
      employeeId,
      dayOfWeek,
      startTime,
      endTime
    );

    if (result.success) {
      setMessage({ type: "success", text: "Munkarend frissítve!" });
      loadSchedule();
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const handleAddVacation = (date) => {
    const result = ScheduleService.addVacation(employeeId, date, "Szabadság");
    if (result.success) {
      setMessage({ type: "success", text: "Szabadság hozzáadva!" });
      loadSchedule();
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const handleAddBreak = (date, startTime, endTime) => {
    const result = ScheduleService.addBreak(employeeId, date, startTime, endTime);
    if (result.success) {
      setMessage({ type: "success", text: "Szünet hozzáadva!" });
      loadSchedule();
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const handleBlockSlot = (date, time) => {
    const result = ScheduleService.blockSlot(employeeId, date, time);
    if (result.success) {
      setMessage({ type: "success", text: "Időpont blokkolva!" });
      loadSchedule();
      setTimeout(() => setMessage(null), 3000);
    }
  };

  if (!schedule) {
    return <div>Betöltés...</div>;
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Message */}
      {message && (
        <div
          className={`p-4 rounded-lg ${
            message.type === "success"
              ? "bg-green-50 border border-green-200 text-green-700"
              : "bg-red-50 border border-red-200 text-red-700"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Recurring Schedule */}
      <div className="bg-card border border-border rounded-lg p-4 sm:p-6">
        <h2 className="text-base sm:text-lg font-semibold text-foreground mb-4 sm:mb-6 flex items-center">
          <Calendar className="mr-2 w-4 h-4 sm:w-5 sm:h-5" />
          Heti Munkarend
        </h2>

        <div className="space-y-3 sm:space-y-4">
          {DAYS_OF_WEEK.map((day) => {
            const current = schedule.employee.recurringSchedule[day.key];
            const [editStart, editEnd] = editing[day.key] || [
              current?.start || "10:00",
              current?.end || "18:00",
            ];

            return (
              <div
                key={day.key}
                className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 p-3 bg-background border border-border rounded-lg"
              >
                <div className="w-full sm:w-24 font-medium text-foreground text-sm sm:text-base">{day.label}</div>

                {current ? (
                  <>
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <input
                        type="time"
                        value={editStart}
                        onChange={(e) => {
                          editing[day.key] = [e.target.value, editEnd];
                          setEditing({ ...editing });
                        }}
                        className="flex-1 sm:flex-none px-3 py-2 border border-border rounded bg-background min-h-[44px]"
                      />
                      <span>–</span>
                      <input
                        type="time"
                        value={editEnd}
                        onChange={(e) => {
                          editing[day.key] = [editStart, e.target.value];
                          setEditing({ ...editing });
                        }}
                        className="flex-1 sm:flex-none px-3 py-2 border border-border rounded bg-background min-h-[44px]"
                      />
                    </div>
                    <div className="flex sm:flex-none gap-2 w-full sm:w-auto">
                      <button
                        onClick={() => handleScheduleChange(day.key, editStart, editEnd)}
                        className="flex-1 sm:flex-none px-4 py-2 bg-primary/10 text-primary rounded hover:bg-primary/20 transition text-sm font-medium min-h-[44px]"
                      >
                        Mentés
                      </button>
                      <button
                        onClick={() => handleScheduleChange(day.key, null, null)}
                        className="flex-1 sm:flex-none px-4 py-2 bg-red-50 text-red-600 rounded hover:bg-red-100 transition text-sm font-medium min-h-[44px]"
                      >
                        Napi szünet
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <span className="text-muted-foreground text-sm">Nem dolgozik</span>
                    <button
                      onClick={() => handleScheduleChange(day.key, "10:00", "18:00")}
                      className="sm:ml-auto px-4 py-2 bg-primary/10 text-primary rounded hover:bg-primary/20 transition text-sm font-medium min-h-[44px] w-full sm:w-auto"
                    >
                      Hozzáadás
                    </button>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Vacation Management */}
      <div className="bg-card border border-border rounded-lg p-4 sm:p-6">
        <h2 className="text-base sm:text-lg font-semibold text-foreground mb-4 sm:mb-6 flex items-center">
          <Calendar className="mr-2 w-4 h-4 sm:w-5 sm:h-5" />
          Szabadságok és Napok
        </h2>

        <div className="space-y-3 sm:space-y-4">
          {Object.entries(schedule.vacations).map(([date, vac]) => (
            <div
              key={date}
              className="flex items-center justify-between p-3 bg-background border border-border rounded-lg"
            >
              <div>
                <p className="font-medium text-foreground text-sm sm:text-base">{date}</p>
                <p className="text-sm text-muted-foreground">{vac.reason}</p>
              </div>
              <button
                onClick={() => ScheduleService.removeVacation(date)}
                className="p-2 text-red-600 hover:bg-red-50 rounded transition min-h-[36px] min-w-[36px] flex items-center justify-center"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}

          <div className="pt-4 border-t border-border">
            <button
              onClick={() => {
                const date = prompt("Dátum (YYYY-MM-DD):");
                if (date) handleAddVacation(date);
              }}
              className="w-full py-2 px-4 border border-dashed border-primary text-primary rounded-lg hover:bg-primary/5 transition flex items-center justify-center gap-2 min-h-[48px]"
            >
              <Plus className="w-4 h-4" />
              Szabadság hozzáadása
            </button>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-card border border-border rounded-lg p-4 sm:p-6">
        <h2 className="text-base sm:text-lg font-semibold text-foreground mb-4 sm:mb-6 flex items-center">
          <Clock className="mr-2 w-4 h-4 sm:w-5 sm:h-5" />
          Nap Szünetei és Blokkolása
        </h2>

        <div className="space-y-3 sm:space-y-4">
          <button
            onClick={() => {
              const date = prompt("Dátum (YYYY-MM-DD):");
              if (date) {
                const start = prompt("Kezdés (HH:MM):");
                if (start) {
                  const end = prompt("Befejezés (HH:MM):");
                  if (end) handleAddBreak(date, start, end);
                }
              }
            }}
            className="w-full py-2 px-4 border border-dashed border-primary text-primary rounded-lg hover:bg-primary/5 transition flex items-center justify-center gap-2 min-h-[48px]"
          >
            <Plus className="w-4 h-4" />
            Szünet hozzáadása
          </button>

          <button
            onClick={() => {
              const date = prompt("Dátum (YYYY-MM-DD):");
              if (date) {
                const time = prompt("Idő (HH:MM):");
                if (time) handleBlockSlot(date, time);
              }
            }}
            className="w-full py-2 px-4 border border-dashed border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition flex items-center justify-center gap-2 min-h-[48px]"
          >
            <AlertCircle className="w-4 h-4" />
            Időpont blokkolása
          </button>
        </div>
      </div>
    </div>
  );
}
