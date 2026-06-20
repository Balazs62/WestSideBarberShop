// NotificationService - Booking and schedule change notifications
import { getDatabase, persistData } from "../data/mockDatabase.js";

export class NotificationService {
  static createNotification(type, recipient, subject, message, data = {}) {
    const db = getDatabase();

    const notification = {
      id: `notif_${Date.now()}`,
      type, // booking_created, booking_cancelled, booking_rescheduled, schedule_changed
      recipient, // email or id
      subject,
      message,
      data,
      status: "pending", // pending, sent, failed
      createdAt: new Date().toISOString(),
      sentAt: null,
      error: null,
    };

    db.notifications.push(notification);
    persistData("notifications", db.notifications);

    // Simulate sending
    this.sendNotification(notification);

    return notification;
  }

  static sendNotification(notification) {
    // In production, integrate with email service, SMS, push notifications, etc.
    console.log(`[NOTIFICATION] ${notification.type}:`, {
      to: notification.recipient,
      subject: notification.subject,
      message: notification.message,
    });

    // Simulate success
    notification.status = "sent";
    notification.sentAt = new Date().toISOString();

    const db = getDatabase();
    persistData("notifications", db.notifications);

    return true;
  }

  static sendBookingConfirmation(booking, employee, service) {
    const customerMessage = `
Your booking has been confirmed!

Service: ${service.name}
Barber: ${employee.name}
Date: ${booking.date}
Time: ${booking.time}
Duration: ${service.duration} minutes
Price: ${service.price} Ft

Please arrive 5 minutes early.

Confirmation: ${booking.id}
    `.trim();

    const employeeMessage = `
New booking!

Customer: ${booking.customerName}
Service: ${service.name}
Date: ${booking.date}
Time: ${booking.time}
Duration: ${service.duration} minutes

Contact: ${booking.customerPhone}
    `.trim();

    this.createNotification(
      "booking_created",
      booking.customerEmail,
      `Booking Confirmation: ${service.name} with ${employee.name}`,
      customerMessage,
      { bookingId: booking.id }
    );

    this.createNotification(
      "booking_created",
      employee.email,
      `New Booking: ${booking.customerName}`,
      employeeMessage,
      { bookingId: booking.id }
    );
  }

  static sendBookingCancellation(booking, employee) {
    const customerMessage = `
Your booking has been cancelled.

Service: ${booking.serviceName}
Barber: ${employee.name}
Date: ${booking.date}
Time: ${booking.time}

Booking ID: ${booking.id}
    `.trim();

    const employeeMessage = `
Booking cancelled.

Customer: ${booking.customerName}
Service: ${booking.serviceName}
Date: ${booking.date}
Time: ${booking.time}
    `.trim();

    this.createNotification(
      "booking_cancelled",
      booking.customerEmail,
      "Booking Cancelled",
      customerMessage,
      { bookingId: booking.id }
    );

    this.createNotification(
      "booking_cancelled",
      employee.email,
      `Booking Cancelled: ${booking.customerName}`,
      employeeMessage,
      { bookingId: booking.id }
    );
  }

  static sendBookingRescheduled(booking, oldEmployee, newEmployee) {
    const customerMessage = `
Your booking has been rescheduled!

Service: ${booking.serviceName}
New Barber: ${newEmployee.name}
New Date: ${booking.date}
New Time: ${booking.time}

Previous: ${oldEmployee.name} - (rescheduled)

Confirmation: ${booking.id}
    `.trim();

    const oldEmployeeMessage = `
Booking rescheduled (moved to another barber).

Customer: ${booking.customerName}
Service: ${booking.serviceName}
Previous Date/Time: (moved)
New Barber: ${newEmployee.name}
    `.trim();

    const newEmployeeMessage = `
New booking assigned to you!

Customer: ${booking.customerName}
Service: ${booking.serviceName}
Date: ${booking.date}
Time: ${booking.time}

Contact: ${booking.customerPhone}
    `.trim();

    this.createNotification(
      "booking_rescheduled",
      booking.customerEmail,
      "Booking Rescheduled",
      customerMessage,
      { bookingId: booking.id }
    );

    this.createNotification(
      "booking_rescheduled",
      oldEmployee.email,
      `Booking Rescheduled: ${booking.customerName}`,
      oldEmployeeMessage,
      { bookingId: booking.id }
    );

    this.createNotification(
      "booking_rescheduled",
      newEmployee.email,
      `New Booking: ${booking.customerName}`,
      newEmployeeMessage,
      { bookingId: booking.id }
    );
  }

  static sendScheduleChangeNotification(employeeId, changeType, details) {
    const db = getDatabase();
    const employee = db.employees.find((e) => e.id === employeeId);

    if (!employee) return;

    let subject = "";
    let message = "";

    switch (changeType) {
      case "vacation_added":
        subject = "Vacation Added";
        message = `Vacation added: ${details.date} (${details.reason})`;
        break;
      case "break_added":
        subject = "Break Added";
        message = `Break added: ${details.date} ${details.startTime}–${details.endTime}`;
        break;
      case "schedule_changed":
        subject = "Schedule Changed";
        message = `Your schedule has been updated: ${details.dayOfWeek} ${details.startTime}–${details.endTime}`;
        break;
      default:
        subject = "Schedule Update";
        message = JSON.stringify(details);
    }

    this.createNotification(
      "schedule_changed",
      employee.email,
      subject,
      message,
      { employeeId, changeType, details }
    );
  }

  static getNotifications(recipient, status = null) {
    const db = getDatabase();
    let notifications = db.notifications.filter(
      (n) => n.recipient === recipient
    );

    if (status) {
      notifications = notifications.filter((n) => n.status === status);
    }

    return notifications;
  }

  static getAllNotifications(status = null) {
    const db = getDatabase();
    if (status) {
      return db.notifications.filter((n) => n.status === status);
    }
    return db.notifications;
  }
}
