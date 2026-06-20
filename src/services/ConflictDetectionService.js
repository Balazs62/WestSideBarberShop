// ConflictDetectionService - Booking conflict detection and prevention
import { getDatabase } from "../data/mockDatabase.js";
import { AvailabilityService } from "./AvailabilityService.js";

export class ConflictDetectionService {
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

  static generateLockKey(employeeId, date, time) {
    return `${date}-${employeeId}-${time}`;
  }

  static acquireLock(employeeId, date, time, duration) {
    const db = getDatabase();
    const lockKey = this.generateLockKey(employeeId, date, time);
    const lockId = `lock_${Date.now()}_${Math.random()}`;
    const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minute lock

    // Pessimistic locking: check if already locked
    if (db.bookingLocks[lockKey]) {
      const existingLock = db.bookingLocks[lockKey];
      if (existingLock.expires_at > Date.now()) {
        return null; // Lock acquisition failed
      }
    }

    // Acquire lock
    db.bookingLocks[lockKey] = {
      lock_id: lockId,
      employee_id: employeeId,
      date,
      time,
      duration,
      expires_at: expiresAt,
      acquired_at: Date.now(),
    };

    return lockId;
  }

  static releaseLock(lockId) {
    const db = getDatabase();
    for (const [key, lock] of Object.entries(db.bookingLocks)) {
      if (lock.lock_id === lockId) {
        delete db.bookingLocks[key];
        return true;
      }
    }
    return false;
  }

  static detectConflicts(employeeId, date, time, duration) {
    const conflicts = [];

    // Same-day booking is not allowed
    if (this.isTodayOrPast(date)) {
      conflicts.push("Same-day bookings are not allowed");
      return conflicts;
    }

    // 1. Check if employee exists and is active
    const db = getDatabase();
    const employee = db.employees.find((e) => e.id === employeeId);
    if (!employee) {
      conflicts.push("Barber not found");
      return conflicts;
    }
    if (!employee.active) {
      conflicts.push("Barber is not active");
      return conflicts;
    }

    // 2. Check if employee works on that date
    const schedule = AvailabilityService.getEmployeeScheduleForDate(
      employeeId,
      date
    );
    if (!schedule) {
      conflicts.push("Employee is not working on this date");
      return conflicts;
    }

    // 3. Check if time is within schedule
    const timeMin = AvailabilityService.timeToMinutes(time);
    const scheduleStart = AvailabilityService.timeToMinutes(schedule.start);
    const scheduleEnd = AvailabilityService.timeToMinutes(schedule.end);
    if (timeMin < scheduleStart || timeMin + duration > scheduleEnd) {
      conflicts.push("Selected time is outside working hours");
      return conflicts;
    }

    // 4. Check for overlapping bookings
    const bookings = AvailabilityService.getEmployeeBookingsForDate(
      employeeId,
      date
    );
    const slotEnd = timeMin + duration;
    for (const booking of bookings) {
      const bookingStart = AvailabilityService.timeToMinutes(booking.time);
      const bookingEnd = bookingStart + booking.duration;
      if (timeMin < bookingEnd && slotEnd > bookingStart) {
        conflicts.push(
          `Time slot conflicts with existing booking (${booking.time}–${AvailabilityService.minutesToTime(bookingEnd)})`
        );
        return conflicts;
      }
    }

    // 5. Check for breaks
    const breaks = AvailabilityService.getEmployeeBreaks(employeeId, date);
    for (const brk of breaks) {
      const breakStart = AvailabilityService.timeToMinutes(brk.start);
      const breakEnd = AvailabilityService.timeToMinutes(brk.end);
      if (timeMin < breakEnd && slotEnd > breakStart) {
        conflicts.push(
          `Time slot conflicts with employee break (${brk.start}–${brk.end})`
        );
        return conflicts;
      }
    }

    // 6. Check for blocked slots
    const blockedSlots = AvailabilityService.getBlockedSlots(
      employeeId,
      date
    );
    if (blockedSlots.includes(time)) {
      conflicts.push("This time slot is blocked");
      return conflicts;
    }

    // 7. Check for vacation/day off
    const db2 = getDatabase();
    const dateStr = this.formatDate(date);
    if (db2.vacations[dateStr]) {
      const vacation = db2.vacations[dateStr];
      if (vacation.employeeId === employeeId) {
        conflicts.push("Employee is on vacation/day off");
        return conflicts;
      }
    }

    // 8. Check if shop is open
    if (!AvailabilityService.isShopOpen(date)) {
      conflicts.push("Shop is closed on this date");
      return conflicts;
    }

    return conflicts; // Empty = no conflicts
  }

  static getAllConflictMessages(conflicts) {
    return conflicts.join("; ");
  }
}
