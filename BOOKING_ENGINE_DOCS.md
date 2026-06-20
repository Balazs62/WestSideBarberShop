# Enterprise-Grade Booking Engine Documentation

## Overview

Az időpontfoglaló rendszer egy teljes körű, valós üzleti igényekre fejlesztett megoldás, amely támogat:

- **Barber availability management** - Barberek saját ütemezésük kezelése
- **Slot-based booking** - Intelligens időpont-kezelés
- **Conflict detection** - Ütközések felismerése és megakadályozása
- **Pessimistic locking** - Concurrent booking protection
- **Notifications** - E-mail értesítések
- **Admin override** - Adminisztratív jogosultságok

## Architecture

### Service Layer

Minden funkcionalitás service-eken keresztül kerül megvalósításra:

```
src/services/
├── AvailabilityService.js      # Szabad időpontok kalkulálása
├── BookingService.js            # Foglalások kezelése (create, update, cancel)
├── ScheduleService.js           # Munkarend kezelése
├── ConflictDetectionService.js  # Ütközések detektálása
└── NotificationService.js       # Értesítések küldése
```

### Data Model

```
src/data/
└── mockDatabase.js
```

Az adatbázis struktúrája:

```javascript
{
  employees: [
    {
      id: 1,
      name: "János Kovács",
      email: "janos@westside.hu",
      active: true,
      recurringSchedule: {
        monday: { start: "10:00", end: "18:00" },
        // ...
      }
    }
  ],
  bookings: [
    {
      id: "booking_xyz",
      customerId: "cust_001",
      customerName: "Nagy Lajos",
      customerEmail: "lajos@example.com",
      employeeId: 1,
      serviceId: 1,
      date: "2026-06-20",
      time: "10:00",
      duration: 30,
      status: "confirmed",
      createdAt: "2026-06-18T10:00:00Z"
    }
  ],
  scheduleOverrides: {
    "2026-06-20": { employeeId: 1, start: "14:00", end: "18:00" }
  },
  vacations: {
    "2026-06-15": { employeeId: 1, reason: "Family vacation" }
  },
  breaks: {
    "2026-06-20-1": [{ start: "13:00", end: "13:45" }]
  },
  blockedSlots: {
    "2026-06-20-1": ["10:00", "10:15"]
  },
  bookingLocks: {
    "2026-06-20-1-10:00": { lock_id: "uuid", expires_at: timestamp }
  }
}
```

## Priority Rules

Az elérhetőségek számítása a következő prioritási sorrend szerint történik:

1. **Emergency block** - Nap szinten blokkolva
2. **Vacation / Day Off** - Teljes nap szabad
3. **Custom day override** - Speciális nap
4. **Break** - Szünet az adott napon
5. **Weekly recurring schedule** - Normál heti munkarend
6. **Global opening hours** - Bolt nyitvatartása

## Core Services

### 1. AvailabilityService

**Szabad időpontok kiszámítása:**

```javascript
import { AvailabilityService } from "@/services/AvailabilityService";

// Szabad időpontok egy nap és alkalmazott számára
const slots = AvailabilityService.getAvailableSlots(
  employeeId,
  "2026-06-20",
  serviceDurationMinutes
);
// Returns: ["10:00", "10:15", "10:30", ...]

// Szabad alkalmazottak egy időponthoz
const employees = AvailabilityService.getAvailableEmployeesForSlot(
  "2026-06-20",
  "10:00",
  30 // minutes
);

// Szabad napok (30 nap)
const dates = AvailabilityService.getAvailableDatesForEmployee(
  employeeId,
  startDate,
  30
);
```

### 2. BookingService

**Foglalások kezelése:**

```javascript
import { BookingService } from "@/services/BookingService";

// Foglalás létrehozása (conflict detection built-in)
const result = BookingService.createBooking(
  customerId,
  customerName,
  customerEmail,
  customerPhone,
  employeeId,
  serviceId,
  date,
  time
);
// Returns: { success: true, booking } or { success: false, error: "..." }

// Foglalás törlése
BookingService.cancelBooking(bookingId, "Customer request");

// Foglalás módosítása
BookingService.rescheduleBooking(
  bookingId,
  newEmployeeId,
  newDate,
  newTime
);
```

### 3. ScheduleService

**Munkarend kezelése:**

```javascript
import { ScheduleService } from "@/services/ScheduleService";

// Heti munkarend frissítése
ScheduleService.updateRecurringSchedule(
  employeeId,
  "monday", // day of week
  "10:00",  // start time
  "18:00"   // end time
);

// Nap szünet (override)
ScheduleService.setDayOverride(
  employeeId,
  "2026-06-20",
  "14:00", // custom start
  "18:00"  // custom end
);

// Szabadság
ScheduleService.addVacation(
  employeeId,
  "2026-06-15",
  "Family vacation"
);

// Szünet
ScheduleService.addBreak(
  employeeId,
  "2026-06-20",
  "13:00",
  "13:45"
);

// Időpont blokkolása
ScheduleService.blockSlot(
  employeeId,
  "2026-06-20",
  "10:00"
);
```

### 4. ConflictDetectionService

**Ütközések detektálása és locking:**

```javascript
import { ConflictDetectionService } from "@/services/ConflictDetectionService";

// Ütközések ellenőrzése
const conflicts = ConflictDetectionService.detectConflicts(
  employeeId,
  date,
  time,
  duration
);
// Returns: [] (no conflicts) or ["error1", "error2", ...]

// Lock acquisition (pessimistic locking)
const lockId = ConflictDetectionService.acquireLock(
  employeeId,
  date,
  time,
  duration
);
// Returns: lockId or null (lock already held)

// Lock release
ConflictDetectionService.releaseLock(lockId);
```

## Frontend Components

### BookingCalendar

Modern naptár komponens:

```jsx
import BookingCalendar from "@/components/booking/BookingCalendar";

<BookingCalendar
  selectedDate={selectedDate}
  setSelectedDate={setSelectedDate}
  selectedEmployee={selectedEmployee}
  setSelectedEmployee={setSelectedEmployee}
  selectedService={service}
  selectedTime={selectedTime}
  setSelectedTime={setSelectedTime}
/>
```

### BookingForm

Foglalási forma:

```jsx
import BookingForm from "@/components/booking/BookingForm";

<BookingForm
  selectedDate={selectedDate}
  selectedTime={selectedTime}
  selectedEmployee={employeeId}
  selectedService={serviceId}
  onBookingSuccess={(booking) => console.log(booking)}
  onBookingError={(errors) => console.error(errors)}
/>
```

### AvailabilityManager

Barber dashboard az elérhetőségek kezeléséhez:

```jsx
import AvailabilityManager from "@/components/booking/AvailabilityManager";

<AvailabilityManager employeeId={employeeId} />
```

## Concurrent Booking Prevention

A rendszer **pessimistic locking** módszert használ:

```
1. User A megnyitja a naptárt
2. User A megnyomja a "10:00" slotot
3. ConflictDetectionService.acquireLock() → lock acquired
4. Conflict check → OK
5. Booking created
6. Lock released
7. User B ugyanaz az időpont
   → acquireLock() → NULL (lock is held)
   → "This time slot is being processed..."
```

## Notifications

Értesítések a foglalásokról:

```javascript
// Booking created
- Customer: "Your booking is confirmed!"
- Barber: "New booking from [customer]"

// Booking cancelled
- Customer: "Your booking has been cancelled"
- Barber: "Booking cancelled: [customer]"

// Booking rescheduled
- Customer: "Your booking has been rescheduled"
- Old Barber: "Booking moved to another barber"
- New Barber: "New booking assigned to you"
```

## Database Persistence

Az adatok localStorage-ben tárolódnak (mock database):

```javascript
localStorage.setItem(
  "booking_db_employees",
  JSON.stringify(employees)
);
```

**Production-hoz:** Cseréld ki a `persistData()` és `loadData()` függvényeket az igazi adatbázis API-val.

## Implementation Steps

### 1. Barber Dashboard (Employee Route)

Szükség lesz egy új route-ra `/barber/schedule` ahol:

```jsx
import AvailabilityManager from "@/components/booking/AvailabilityManager";

export default function BarberSchedulePage() {
  const { user } = useAuth();
  return (
    <div>
      <Navbar />
      <AvailabilityManager employeeId={user.employeeId} />
      <Footer />
    </div>
  );
}
```

### 2. Admin Schedule Management

Admin page az összes barber ütemezésének kezeléséhez (todo).

### 3. Booking Statistics

Admin dashboard a foglalásokkal kapcsolatos statisztikákkal (todo).

## Testing

```bash
# Test booking creation
npm test -- BookingService.test.js

# Test availability calculation
npm test -- AvailabilityService.test.js

# Test conflict detection
npm test -- ConflictDetectionService.test.js
```

## Performance Considerations

- **Slot generation:** 15 perces granularitás
- **Lock timeout:** 5 perc
- **Available dates range:** 30 nap (konfigurálható)
- **Notification queue:** Async processing

## Future Enhancements

- [ ] SMS notifications
- [ ] Push notifications
- [ ] Waiting list
- [ ] Recurring bookings
- [ ] Payment integration
- [ ] Calendar sync (Google Calendar, Outlook)
- [ ] Customer feedback/ratings
- [ ] Resource-based availability (chairs, equipment)
