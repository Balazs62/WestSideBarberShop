import React, { useState } from "react";
import { AlertCircle, CheckCircle, Loader } from "lucide-react";
import { BookingService } from "@/services/BookingService";
import { ConflictDetectionService } from "@/services/ConflictDetectionService";
import { AvailabilityService } from "@/services/AvailabilityService";
import { getDatabase } from "@/data/mockDatabase";

export default function BookingForm({
  selectedDate,
  selectedTime,
  selectedEmployee,
  selectedService,
  onBookingSuccess,
  onBookingError,
}) {
  const [formData, setFormData] = useState({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!formData.customerName || !formData.customerEmail || !formData.customerPhone) {
      setError("Kérlek töltsd ki az összes mezőt!");
      return;
    }

    setLoading(true);

    try {
      // Get service info
      import("@/data/mockDatabase").then(({ getDatabase }) => {
        const db = getDatabase();
        const service = db.services.find((s) => s.id === selectedService);

        if (!service) {
          setError("A szolgáltatás nem található!");
          setLoading(false);
          return;
        }

        // Detect conflicts before booking
        const conflicts = ConflictDetectionService.detectConflicts(
          selectedEmployee,
          selectedDate,
          selectedTime,
          service.duration
        );

        if (conflicts.length > 0) {
          setError(
            `Ez az időpont már foglalt vagy nem elérhető: ${conflicts.join("; ")}`
          );
          onBookingError?.(conflicts);
          setLoading(false);
          return;
        }

        // Create booking
        const result = BookingService.createBooking(
          `cust_${Date.now()}`,
          formData.customerName,
          formData.customerEmail,
          formData.customerPhone,
          selectedEmployee,
          selectedService,
          selectedDate,
          selectedTime
        );

        if (result.success) {
          setSuccess("Foglalás sikeres! Hamarosan e-mailben megkapod a megerősítést.");
          onBookingSuccess?.(result.booking);
          setFormData({
            customerName: "",
            customerEmail: "",
            customerPhone: "",
          });
        } else {
          setError(result.error);
          onBookingError?.([result.error]);
        }

        setLoading(false);
      });
    } catch (err) {
      setError("Hiba történt a foglalás során!");
      onBookingError?.([err.message]);
      setLoading(false);
    }
  };

  const db = getDatabase();
  const employeeName = db.employees.find((e) => e.id === selectedEmployee)?.name || "";
  const serviceName = db.services.find((s) => s.id === selectedService)?.name || "";

  if (!selectedDate || !selectedTime || !selectedEmployee || !selectedService) {
    return (
      <div className="text-center text-muted-foreground">
        Kérlek válassz barbvert, napot és időpontot az alábbiakban!
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-red-700">{error}</div>
        </div>
      )}

      {/* Success Message */}
      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-green-700">{success}</div>
        </div>
      )}

      {/* Form Fields */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Név *
          </label>
          <input
            type="text"
            name="customerName"
            value={formData.customerName}
            onChange={handleInputChange}
            placeholder="pl. Nagy János"
            className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            disabled={loading}
          />
        </div>


      {/* Booking Summary */}
      <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
        <h3 className="font-semibold text-foreground mb-3">Foglalás összefoglalása</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Barber</p>
            <p className="font-semibold">{employeeName}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Szolgáltatás</p>
            <p className="font-semibold">{serviceName}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Dátum</p>
            <p className="font-semibold">{selectedDate}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Idő</p>
            <p className="font-semibold">{selectedTime}</p>
          </div>
        </div>
      </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            E-mail *
          </label>
          <input
            type="email"
            name="customerEmail"
            value={formData.customerEmail}
            onChange={handleInputChange}
            placeholder="pl. nagy@example.com"
            className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            disabled={loading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Telefon *
          </label>
          <input
            type="tel"
            name="customerPhone"
            value={formData.customerPhone}
            onChange={handleInputChange}
            placeholder="pl. +36 30 123 4567"
            className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            disabled={loading}
          />
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 px-4 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 transition disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {loading && <Loader className="w-4 h-4 animate-spin" />}
        {loading ? "Foglalás feldolgozása..." : "Foglalás megerősítése"}
      </button>
    </form>
  );
}
