// AvailabilityService - Szabad időpontok kiszámítása
import { getDatabase, persistData } from "../data/mockDatabase.js";

export class AvailabilityService {
  static getSlotGranularity() {
    return 15; // minutes
  }

  static formatDate(date) {
    if (typeof date === "string") {
      return date;
    }

    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
  }

  static isTodayOrPast(date) {
    const dateStr = this.formatDate(date);
    const today = new Date();
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

    return dateStr <= todayStr;
  }

  static getDayOfWeek(date) {
    const days = [
      "sunday",
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
    ];
    return days[new Date(date).getDay()];
  }

  static timeToMinutes(timeStr) {
    const [h, m] = timeStr.split(":").map(Number);
    return h * 60 + m;
  }

  static minutesToTime(minutes) {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
  }

  static isShopOpen(date) {
    const db = getDatabase();
    const dayOfWeek = this.getDayOfWeek(date);
    return db.shopHours[dayOfWeek] !== null;
  }

  static getEmployeeScheduleForDate(employeeId, date) {
    const db = getDatabase();
    const dayOfWeek = this.getDayOfWeek(date);
    const dateStr = this.formatDate(date);

    // Priority 1: Custom day override
    if (db.scheduleOverrides[dateStr]) {
      const override = db.scheduleOverrides[dateStr];
      if (override.employeeId === employeeId) {
        return override.start && override.end
          ? { start: override.start, end: override.end }
          : null; // Day off
      }
    }

    // Priority 2: Vacation / Day off
    if (db.vacations[dateStr]) {
      const vacation = db.vacations[dateStr];
      if (vacation.employeeId === employeeId) {
        return null;
      }
    }

    // Priority 3: Recurring schedule
    const employee = db.employees.find((e) => e.id === employeeId);
    if (employee) {
      return employee.recurringSchedule[dayOfWeek] || null;
    }

    return null;
  }

  static getEmployeeBreaks(employeeId, date) {
    const db = getDatabase();
    const dateStr = this.formatDate(date);
    const key = `${dateStr}-${employeeId}`;
    return db.breaks[key] || [];
  }

  static getBlockedSlots(employeeId, date) {
    const db = getDatabase();
    const dateStr = this.formatDate(date);
    const key = `${dateStr}-${employeeId}`;
    return db.blockedSlots[key] || [];
  }

  static getEmployeeBookingsForDate(employeeId, date) {
    const db = getDatabase();
    const dateStr = this.formatDate(date);
    return db.bookings.filter(
      (b) =>
        b.employeeId === employeeId &&
        b.date === dateStr &&
        b.status === "confirmed"
    );
  }

  static isSlotBlocked(employeeId, date, timeStr, duration) {
    // Check if blocked
    const blockedSlots = this.getBlockedSlots(employeeId, date);
    if (blockedSlots.includes(timeStr)) {
      return true;
    }

    // Check breaks
    const breaks = this.getEmployeeBreaks(employeeId, date);
    const slotStart = this.timeToMinutes(timeStr);
    const slotEnd = slotStart + duration;

    for (const brk of breaks) {
      const breakStart = this.timeToMinutes(brk.start);
      const breakEnd = this.timeToMinutes(brk.end);
      if (
        (slotStart < breakEnd && slotEnd > breakStart) // Overlapping
      ) {
        return true;
      }
    }

    // Check existing bookings
    const bookings = this.getEmployeeBookingsForDate(employeeId, date);
    for (const booking of bookings) {
      const bookingStart = this.timeToMinutes(booking.time);
      const bookingEnd = bookingStart + booking.duration;
      if (
        (slotStart < bookingEnd && slotEnd > bookingStart) // Overlapping
      ) {
        return true;
      }
    }

    return false;
  }

  static getAvailableSlots(employeeId, date, serviceDuration) {
    if (this.isTodayOrPast(date)) {
      return [];
    }

    const schedule = this.getEmployeeScheduleForDate(employeeId, date);
    if (!schedule) {
      return []; // Employee not working
    }

    const slots = [];
    const startMin = this.timeToMinutes(schedule.start);
    const endMin = this.timeToMinutes(schedule.end);
    const granularity = this.getSlotGranularity();

    for (let minutes = startMin; minutes + serviceDuration <= endMin; minutes += granularity) {
      const timeStr = this.minutesToTime(minutes);
      if (!this.isSlotBlocked(employeeId, date, timeStr, serviceDuration)) {
        slots.push(timeStr);
      }
    }

    return slots;
  }

  static getAvailableEmployeesForSlot(date, time, serviceDuration) {
    const db = getDatabase();
    const available = [];

    for (const employee of db.employees) {
      if (!employee.active) continue;

      const schedule = this.getEmployeeScheduleForDate(employee.id, date);
      if (!schedule) continue;

      const isAvailable = !this.isSlotBlocked(
        employee.id,
        date,
        time,
        serviceDuration
      );
      if (isAvailable) {
        available.push(employee);
      }
    }

    return available;
  }

  static getAvailableDatesForEmployee(employeeId, startDate, days = 30) {
    const available = [];
    const currentDate = new Date(startDate);
    currentDate.setDate(currentDate.getDate() + 1);

    for (let i = 0; i < days; i++) {
      const dateStr = this.formatDate(currentDate);
      const schedule = this.getEmployeeScheduleForDate(employeeId, dateStr);

      if (schedule) {
        available.push(dateStr);
      }

      currentDate.setDate(currentDate.getDate() + 1);
    }

    return available;
  }
}
