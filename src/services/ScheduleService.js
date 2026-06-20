// ScheduleService - Employee schedule management
import { getDatabase, persistData } from "../data/mockDatabase.js";

export class ScheduleService {
  // Recurring schedule management
  static updateRecurringSchedule(employeeId, dayOfWeek, startTime, endTime) {
    const db = getDatabase();
    const employee = db.employees.find((e) => e.id === employeeId);

    if (!employee) {
      return { success: false, error: "Employee not found" };
    }

    if (startTime === null || endTime === null) {
      employee.recurringSchedule[dayOfWeek] = null; // Day off
    } else {
      employee.recurringSchedule[dayOfWeek] = {
        start: startTime,
        end: endTime,
      };
    }

    persistData("employees", db.employees);
    return { success: true };
  }

  // Custom day override
  static setDayOverride(employeeId, date, startTime, endTime) {
    const db = getDatabase();
    const dateStr = date instanceof Date ? date.toISOString().split("T")[0] : date;

    if (startTime === null || endTime === null) {
      // Remove override
      delete db.scheduleOverrides[dateStr];
    } else {
      db.scheduleOverrides[dateStr] = {
        employeeId,
        start: startTime,
        end: endTime,
      };
    }

    persistData("scheduleOverrides", db.scheduleOverrides);
    return { success: true };
  }

  // Vacation / Day off
  static addVacation(employeeId, date, reason = "Vacation") {
    const db = getDatabase();
    const dateStr = date instanceof Date ? date.toISOString().split("T")[0] : date;

    db.vacations[dateStr] = {
      employeeId,
      reason,
      createdAt: new Date().toISOString(),
    };

    persistData("vacations", db.vacations);
    return { success: true };
  }

  static removeVacation(date) {
    const db = getDatabase();
    const dateStr = date instanceof Date ? date.toISOString().split("T")[0] : date;
    delete db.vacations[dateStr];
    persistData("vacations", db.vacations);
    return { success: true };
  }

  // Breaks
  static addBreak(employeeId, date, startTime, endTime) {
    const db = getDatabase();
    const dateStr = date instanceof Date ? date.toISOString().split("T")[0] : date;
    const key = `${dateStr}-${employeeId}`;

    if (!db.breaks[key]) {
      db.breaks[key] = [];
    }

    db.breaks[key].push({
      start: startTime,
      end: endTime,
      createdAt: new Date().toISOString(),
    });

    persistData("breaks", db.breaks);
    return { success: true };
  }

  static removeBreak(employeeId, date, breakIndex) {
    const db = getDatabase();
    const dateStr = date instanceof Date ? date.toISOString().split("T")[0] : date;
    const key = `${dateStr}-${employeeId}`;

    if (db.breaks[key]) {
      db.breaks[key].splice(breakIndex, 1);
      if (db.breaks[key].length === 0) {
        delete db.breaks[key];
      }
    }

    persistData("breaks", db.breaks);
    return { success: true };
  }

  // Blocked slots
  static blockSlot(employeeId, date, time) {
    const db = getDatabase();
    const dateStr = date instanceof Date ? date.toISOString().split("T")[0] : date;
    const key = `${dateStr}-${employeeId}`;

    if (!db.blockedSlots[key]) {
      db.blockedSlots[key] = [];
    }

    if (!db.blockedSlots[key].includes(time)) {
      db.blockedSlots[key].push(time);
    }

    persistData("blockedSlots", db.blockedSlots);
    return { success: true };
  }

  static unblockSlot(employeeId, date, time) {
    const db = getDatabase();
    const dateStr = date instanceof Date ? date.toISOString().split("T")[0] : date;
    const key = `${dateStr}-${employeeId}`;

    if (db.blockedSlots[key]) {
      const index = db.blockedSlots[key].indexOf(time);
      if (index > -1) {
        db.blockedSlots[key].splice(index, 1);
      }
      if (db.blockedSlots[key].length === 0) {
        delete db.blockedSlots[key];
      }
    }

    persistData("blockedSlots", db.blockedSlots);
    return { success: true };
  }

  // Get employee schedule info
  static getEmployeeSchedule(employeeId) {
    const db = getDatabase();
    const employee = db.employees.find((e) => e.id === employeeId);

    if (!employee) {
      return null;
    }

    return {
      employee,
      recurringSchedule: employee.recurringSchedule,
      overrides: Object.entries(db.scheduleOverrides)
        .filter(([, val]) => val.employeeId === employeeId)
        .reduce((acc, [key, val]) => {
          acc[key] = val;
          return acc;
        }, {}),
      vacations: Object.entries(db.vacations)
        .filter(([, val]) => val.employeeId === employeeId)
        .reduce((acc, [key, val]) => {
          acc[key] = val;
          return acc;
        }, {}),
    };
  }

  // Shop opening hours
  static updateShopHours(dayOfWeek, startTime, endTime) {
    const db = getDatabase();

    if (startTime === null || endTime === null) {
      db.shopHours[dayOfWeek] = null;
    } else {
      db.shopHours[dayOfWeek] = {
        start: startTime,
        end: endTime,
      };
    }

    persistData("shopHours", db.shopHours);
    return { success: true };
  }

  static getShopHours() {
    const db = getDatabase();
    return db.shopHours;
  }
}
