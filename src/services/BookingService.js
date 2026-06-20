// BookingService - Booking creation, modification, and cancellation with locking
import { getDatabase, persistData } from "../data/mockDatabase.js";
import { ConflictDetectionService } from "./ConflictDetectionService.js";
import { NotificationService } from "./NotificationService.js";

export class BookingService {
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

  static createBooking(
    customerId,
    customerName,
    customerEmail,
    customerPhone,
    employeeId,
    serviceId,
    date,
    time
  ) {
    const db = getDatabase();

    if (this.isTodayOrPast(date)) {
      return { success: false, error: "Same-day bookings are not allowed" };
    }

    // Find service
    const service = db.services.find((s) => s.id === serviceId);
    if (!service) {
      return { success: false, error: "Service not found" };
    }

    // Acquire lock
    const lockId = ConflictDetectionService.acquireLock(
      employeeId,
      date,
      time,
      service.duration
    );
    if (!lockId) {
      return {
        success: false,
        error:
          "This time slot is being processed by another request. Please try again.",
      };
    }

    try {
      // Detect conflicts
      const conflicts = ConflictDetectionService.detectConflicts(
        employeeId,
        date,
        time,
        service.duration
      );
      if (conflicts.length > 0) {
        return {
          success: false,
          error: ConflictDetectionService.getAllConflictMessages(conflicts),
        };
      }

      // Find employee
      const employee = db.employees.find((e) => e.id === employeeId);
      if (!employee) {
        return { success: false, error: "Employee not found" };
      }

      // Create booking
      const booking = {
        id: `booking_${Date.now()}`,
        customerId,
        customerName,
        customerEmail,
        customerPhone,
        employeeId,
        employeeName: employee.name,
        serviceId,
        serviceName: service.name,
        date,
        time,
        duration: service.duration,
        status: "confirmed",
        createdAt: new Date().toISOString(),
        lockedWith: lockId,
      };

      db.bookings.push(booking);
      persistData("bookings", db.bookings);

      // Send notifications
      NotificationService.sendBookingConfirmation(booking, employee, service);

      return { success: true, booking };
    } finally {
      // Always release lock
      ConflictDetectionService.releaseLock(lockId);
    }
  }

  static cancelBooking(bookingId, reason = "Customer request") {
    const db = getDatabase();
    const booking = db.bookings.find((b) => b.id === bookingId);

    if (!booking) {
      return { success: false, error: "Booking not found" };
    }

    if (booking.status === "cancelled") {
      return { success: false, error: "Booking is already cancelled" };
    }

    booking.status = "cancelled";
    booking.cancelledAt = new Date().toISOString();
    booking.cancellationReason = reason;

    persistData("bookings", db.bookings);

    // Send notifications
    const employee = db.employees.find((e) => e.id === booking.employeeId);
    NotificationService.sendBookingCancellation(booking, employee);

    return { success: true, booking };
  }

  static rescheduleBooking(
    bookingId,
    newEmployeeId,
    newDate,
    newTime
  ) {
    const db = getDatabase();
    const booking = db.bookings.find((b) => b.id === bookingId);

    if (!booking) {
      return { success: false, error: "Booking not found" };
    }

    if (booking.status !== "confirmed") {
      return { success: false, error: "Can only reschedule confirmed bookings" };
    }

    const service = db.services.find((s) => s.id === booking.serviceId);
    if (!service) {
      return { success: false, error: "Service not found" };
    }

    // Check conflicts for new slot
    const conflicts = ConflictDetectionService.detectConflicts(
      newEmployeeId,
      newDate,
      newTime,
      service.duration
    );
    if (conflicts.length > 0) {
      return {
        success: false,
        error: ConflictDetectionService.getAllConflictMessages(conflicts),
      };
    }

    // Update booking
    const oldEmployee = db.employees.find((e) => e.id === booking.employeeId);
    booking.employeeId = newEmployeeId;
    const newEmployee = db.employees.find((e) => e.id === newEmployeeId);
    booking.employeeName = newEmployee.name;
    booking.date = newDate;
    booking.time = newTime;
    booking.rescheduledAt = new Date().toISOString();

    persistData("bookings", db.bookings);

    // Send notifications
    NotificationService.sendBookingRescheduled(booking, oldEmployee, newEmployee);

    return { success: true, booking };
  }

  static getBooking(bookingId) {
    const db = getDatabase();
    return db.bookings.find((b) => b.id === bookingId);
  }

  static getCustomerBookings(customerId) {
    const db = getDatabase();
    return db.bookings.filter((b) => b.customerId === customerId);
  }

  static getEmployeeBookings(employeeId, startDate, endDate) {
    const db = getDatabase();
    return db.bookings.filter(
      (b) =>
        b.employeeId === employeeId &&
        b.date >= startDate &&
        b.date <= endDate &&
        b.status === "confirmed"
    );
  }

  static getAllBookings(status = null) {
    const db = getDatabase();
    if (status) {
      return db.bookings.filter((b) => b.status === status);
    }
    return db.bookings;
  }
}
