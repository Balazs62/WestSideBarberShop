// Mock Database with employee schedules, bookings, and availability management
// In production, replace with actual database

export const mockDatabase = {
  // Users with authentication and roles
  users: [],

  // Employees / Barbers
  employees: [
    {
      id: 1,
      name: "János Kovács",
      email: "janos@westside.hu",
      active: true,
      photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      bio: "10 év tapasztalat, klasszikus és modern stílusok specialistája. Szakállformázás és borotválás mester.",
      rating: 4.9,
      reviewCount: 127,
      recurringSchedule: {
        monday: { start: "10:00", end: "18:00" },
        tuesday: { start: "10:00", end: "18:00" },
        wednesday: { start: "10:00", end: "18:00" },
        thursday: { start: "10:00", end: "18:00" },
        friday: { start: "10:00", end: "18:00" },
        saturday: { start: "10:00", end: "15:30" },
        sunday: null,
      },
    },
    {
      id: 2,
      name: "Péter Szabó",
      email: "peter@westside.hu",
      active: true,
      photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      bio: "Fiatalos, kreatív barber. Trendi frizurák és egyedi szakállstílusok szakértője.",
      rating: 4.7,
      reviewCount: 89,
      recurringSchedule: {
        monday: { start: "10:00", end: "18:00" },
        tuesday: { start: "10:00", end: "18:00" },
        wednesday: { start: "10:00", end: "18:00" },
        thursday: { start: "10:00", end: "18:00" },
        friday: { start: "10:00", end: "18:00" },
        saturday: null,
        sunday: null,
      },
    },
    {
      id: 3,
      name: "Tamás Nagy",
      email: "tamas@westside.hu",
      active: true,
      photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
      bio: "Precíz, részletekre odafigyelő barber. Hagyományos technikák és modern megoldások ötvözete.",
      rating: 4.8,
      reviewCount: 156,
      recurringSchedule: {
        monday: { start: "09:00", end: "17:00" },
        tuesday: { start: "09:00", end: "17:00" },
        wednesday: { start: "09:00", end: "17:00" },
        thursday: { start: "09:00", end: "17:00" },
        friday: { start: "09:00", end: "17:00" },
        saturday: { start: "09:00", end: "14:00" },
        sunday: null,
      },
    },
  ],

  // Schedule overrides per day (format: YYYY-MM-DD)
  scheduleOverrides: {
    // "2026-06-20": { employeeId: 1, start: "14:00", end: "18:00" }
  },

  // Day offs / Vacations
  vacations: {
    // "2026-07-15": { employeeId: 1, reason: "Family vacation" }
  },

  // Breaks during shift
  breaks: {
    // "2026-06-20-1": [{ start: "13:00", end: "13:45", employeeId: 1 }]
  },

  // Blocked time slots
  blockedSlots: {
    // "2026-06-20-1": ["10:00", "10:15", "10:30"]
  },

  // Services
  services: [
    { id: 1, name: "Hajvágás", duration: 30, price: 3500 },
    { id: 2, name: "Borotva", duration: 20, price: 2000 },
    { id: 3, name: "Hajvágás + Borotva", duration: 45, price: 5000 },
    { id: 4, name: "Gyerek vágás", duration: 25, price: 2500 },
    { id: 5, name: "Szakáll formázás", duration: 15, price: 1500 },
    { id: 6, name: "Teljes csomag", duration: 60, price: 7000 },
  ],

  // Bookings
  bookings: [
    {
      id: 1,
      customerId: "cust_001",
      customerName: "Nagy Lajos",
      customerEmail: "lajos@example.com",
      customerPhone: "+36301234567",
      employeeId: 1,
      employeeName: "János Kovács",
      serviceId: 1,
      serviceName: "Hajvágás",
      date: "2026-06-20",
      time: "10:00",
      duration: 30,
      status: "confirmed", // confirmed, pending, cancelled
      createdAt: new Date().toISOString(),
    },
  ],

  // Booking locks for concurrent access prevention
  bookingLocks: {
    // "2026-06-20-1-10:00": { lock_id: "uuid", expires_at: timestamp }
  },

  // Shop opening hours (global)
  shopHours: {
    monday: { start: "10:00", end: "18:00" },
    tuesday: { start: "10:00", end: "18:00" },
    wednesday: { start: "10:00", end: "18:00" },
    thursday: { start: "10:00", end: "18:00" },
    friday: { start: "10:00", end: "18:00" },
    saturday: { start: "10:00", end: "15:30" },
    sunday: null,
  },

  // Notifications queue
  notifications: [],
};

// Simulated persistence (localStorage in browser)
export const persistData = (key, data) => {
  if (typeof window !== "undefined") {
    localStorage.setItem(`booking_db_${key}`, JSON.stringify(data));
  }
};

export const loadData = (key, defaultValue) => {
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem(`booking_db_${key}`);
    return stored ? JSON.parse(stored) : defaultValue;
  }
  return defaultValue;
};

// Initialize from localStorage or use mock data
export const getDatabase = () => {
  return {
    users: loadData("users", mockDatabase.users),
    employees: loadData("employees", mockDatabase.employees),
    scheduleOverrides: loadData(
      "scheduleOverrides",
      mockDatabase.scheduleOverrides
    ),
    vacations: loadData("vacations", mockDatabase.vacations),
    breaks: loadData("breaks", mockDatabase.breaks),
    blockedSlots: loadData("blockedSlots", mockDatabase.blockedSlots),
    services: loadData("services", mockDatabase.services),
    bookings: loadData("bookings", mockDatabase.bookings),
    bookingLocks: loadData("bookingLocks", mockDatabase.bookingLocks),
    shopHours: loadData("shopHours", mockDatabase.shopHours),
    notifications: loadData("notifications", mockDatabase.notifications),
  };
};
