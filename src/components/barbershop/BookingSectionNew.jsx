import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ServiceSelection from "@/components/booking/ServiceSelection";
import BarberSelection from "@/components/booking/BarberSelection";
import EnhancedBookingCalendar from "@/components/booking/EnhancedBookingCalendar";
import UserDataForm from "@/components/booking/UserDataForm";
import BookingSummary from "@/components/booking/BookingSummary";
import { getDatabase } from "@/data/mockDatabase";
import confetti from "canvas-confetti";

export default function BookingSection({ preselectedService }) {
  const [step, setStep] = useState(1);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [customerData, setCustomerData] = useState(null);
  const [services, setServices] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const db = getDatabase();
    setServices(db.services);
    setEmployees(db.employees.filter((e) => e.active));

    // Preselect service if provided
    if (preselectedService) {
      const svc = db.services.find((s) =>
        preselectedService.includes(s.name)
      );
      if (svc) {
        setSelectedService(svc.id);
        setStep(2);
      }
    }
  }, [preselectedService]);

  const goToStart = () => {
    setBookingSuccess(false);
    setStep(1);
    setSelectedService(null);
    setSelectedEmployee(null);
    setSelectedDate(null);
    setSelectedTime(null);
    setCustomerData(null);
  };

  const handleBookingSuccess = (booking) => {
    setBookingSuccess(true);
    // Trigger confetti animation
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  const handleConfirmBooking = async () => {
    setLoading(true);
    // The actual booking is handled in UserDataForm, this is just for the summary step
    // In a real implementation, you would call the booking service here
    setLoading(false);
  };

  const currentService = services.find((s) => s.id === selectedService);

  const steps = [
    { number: 1, title: "Szolgáltatás" },
    { number: 2, title: "Barber" },
    { number: 3, title: "Időpont" },
    { number: 4, title: "Adatok" },
    { number: 5, title: "Összegzés" },
  ];

  return (
    <section className="min-h-full overflow-visible bg-background pb-20 sm:pb-6 md:pb-8">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-4 sm:mb-6 text-center"
        >
          <h1 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-2">
            Foglalj időpontot
          </h1>
          <p className="text-xs sm:text-sm md:text-base text-muted-foreground">
            Egyszerű, gyors foglalás 5 lépésben
          </p>
        </motion.div>

        {/* Progress Steps - Compact on Mobile */}
        <div className="mb-4 sm:mb-8">
          <div className="flex items-center justify-between">
            {steps.map((s, index) => (
              <React.Fragment key={s.number}>
                <div className="flex flex-col items-center flex-1">
                  <div
                    className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-semibold transition text-xs sm:text-sm ${
                      step >= s.number
                        ? "bg-primary text-white"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {step > s.number ? "✓" : s.number}
                  </div>
                  <span
                    className={`text-[10px] sm:text-xs mt-1 sm:mt-2 hidden xs:block ${
                      step >= s.number ? "text-foreground font-medium" : "text-muted-foreground"
                    }`}
                  >
                    {s.title}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`flex-1 h-0.5 sm:h-1 mx-1 sm:mx-2 transition ${
                      step > s.number ? "bg-primary" : "bg-muted"
                    }`}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Success Message */}
        <AnimatePresence>
          {bookingSuccess && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="mb-6 rounded-2xl border border-green-200 bg-green-50 p-8 text-center"
            >
              <div className="text-6xl mb-4">🎉</div>
              <h2 className="text-2xl font-bold text-green-700 mb-2">
                Foglalás sikeres!
              </h2>
              <p className="text-green-600 mb-6">
                Az e-mailben hamarosan megkapod a megerősítést.
              </p>
              <button
                onClick={goToStart}
                className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold"
              >
                Új foglalás
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Booking Steps */}
        {!bookingSuccess && (
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="rounded-2xl border border-border bg-card p-6 sm:p-8"
            >
              {/* Step 1: Service Selection */}
              {step === 1 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-foreground">1. Szolgáltatás kiválasztása</h2>
                    <button
                      onClick={goToStart}
                      className="text-sm text-muted-foreground hover:text-primary transition"
                    >
                      Újrakezdés
                    </button>
                  </div>
                  <p className="text-muted-foreground">
                    Válassz a szolgáltatásaink közül. Keresés és szűrés segíthet a döntésben.
                  </p>
                  <ServiceSelection
                    services={services}
                    selectedService={selectedService}
                    onSelectService={(id) => {
                      setSelectedService(id);
                      setStep(2);
                    }}
                  />
                </div>
              )}

              {/* Step 2: Barber Selection */}
              {step === 2 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-foreground">2. Barber kiválasztása</h2>
                    <button
                      onClick={() => setStep(1)}
                      className="text-sm text-muted-foreground hover:text-primary transition"
                    >
                      Vissza
                    </button>
                  </div>
                  <p className="text-muted-foreground">
                    Válassz barbert, vagy hagyd a rendszerre a döntést.
                  </p>
                  <BarberSelection
                    employees={employees}
                    selectedEmployee={selectedEmployee}
                    onSelectEmployee={(id) => {
                      setSelectedEmployee(id);
                      setStep(3);
                    }}
                    selectedDate={selectedDate}
                    selectedService={currentService}
                  />
                </div>
              )}

              {/* Step 3: Date and Time Selection */}
              {step === 3 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-foreground">3. Időpont kiválasztása</h2>
                    <button
                      onClick={() => setStep(2)}
                      className="text-sm text-muted-foreground hover:text-primary transition"
                    >
                      Vissza
                    </button>
                  </div>
                  <p className="text-muted-foreground">
                    Válassz napot és időpontot. A rendszer csak a szabad időpontokat mutatja.
                  </p>
                  <EnhancedBookingCalendar
                    selectedDate={selectedDate}
                    setSelectedDate={setSelectedDate}
                    selectedEmployee={selectedEmployee}
                    setSelectedEmployee={setSelectedEmployee}
                    selectedService={currentService}
                    selectedTime={selectedTime}
                    setSelectedTime={setSelectedTime}
                    onDateSelect={setSelectedDate}
                    onEmployeeSelect={setSelectedEmployee}
                  />
                </div>
              )}

              {/* Sticky CTA Button for Mobile - Step 3 */}
              {step === 3 && selectedDate && selectedTime && (
                <div className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-md border-t border-border p-4 sm:hidden z-40" style={{ paddingBottom: 'calc(1rem + env(safe-area-inset-bottom))' }}>
                  <button
                    onClick={() => setStep(4)}
                    className="w-full py-4 bg-primary text-white rounded-lg hover:bg-primary/90 transition font-semibold min-h-[52px]"
                  >
                    Tovább
                  </button>
                </div>
              )}

              {/* Desktop CTA Button - Step 3 */}
              {step === 3 && selectedDate && selectedTime && (
                <button
                  onClick={() => setStep(4)}
                  className="hidden sm:block w-full py-4 bg-primary text-white rounded-lg hover:bg-primary/90 transition font-semibold"
                >
                  Tovább
                </button>
              )}

              {/* Step 4: User Data */}
              {step === 4 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-foreground">4. Személyes adatok</h2>
                    <button
                      onClick={() => setStep(3)}
                      className="text-sm text-muted-foreground hover:text-primary transition"
                    >
                      Vissza
                    </button>
                  </div>
                  <p className="text-muted-foreground">
                    Add meg az adataidat a foglaláshoz. Google bejelentkezéssel gyorsíthatod a folyamatot.
                  </p>
                  <UserDataForm
                    selectedDate={selectedDate}
                    selectedTime={selectedTime}
                    selectedEmployee={selectedEmployee}
                    selectedService={selectedService}
                    onBookingSuccess={(booking) => {
                      setCustomerData({
                        customerName: booking.customerName,
                        customerEmail: booking.customerEmail,
                        customerPhone: booking.customerPhone,
                      });
                      setStep(5);
                    }}
                    onBookingError={(errors) => {
                      console.error("Booking error:", errors);
                    }}
                    onBack={() => setStep(3)}
                  />
                </div>
              )}

              {/* Step 5: Summary */}
              {step === 5 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-foreground">5. Összegzés és megerősítés</h2>
                    <button
                      onClick={() => setStep(4)}
                      className="text-sm text-muted-foreground hover:text-primary transition"
                    >
                      Vissza
                    </button>
                  </div>
                  <p className="text-muted-foreground">
                    Ellenőrizd a foglalás adatait, majd véglegesítsd a foglalást.
                  </p>
                  <BookingSummary
                    selectedService={selectedService}
                    selectedEmployee={selectedEmployee}
                    selectedDate={selectedDate}
                    selectedTime={selectedTime}
                    customerData={customerData}
                    onEditService={() => setStep(1)}
                    onEditBarber={() => setStep(2)}
                    onEditDateTime={() => setStep(3)}
                    onEditData={() => setStep(4)}
                    onConfirm={handleBookingSuccess}
                    onBack={() => setStep(4)}
                    loading={loading}
                  />
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </section>
  );
}
