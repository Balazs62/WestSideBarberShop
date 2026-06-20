import React, { useState } from "react";
import { AlertCircle, CheckCircle, Loader, User, Mail, Phone, MessageSquare } from "lucide-react";
import { BookingService } from "@/services/BookingService";
import { ConflictDetectionService } from "@/services/ConflictDetectionService";
import { getDatabase } from "@/data/mockDatabase";
import GoogleIcon from "@/components/GoogleIcon";

export default function UserDataForm({
  selectedDate,
  selectedTime,
  selectedEmployee,
  selectedService,
  onBookingSuccess,
  onBookingError,
  onBack,
}) {
  const [formData, setFormData] = useState({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    customerNote: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isGuest, setIsGuest] = useState(true);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleGoogleLogin = () => {
    // Simulate Google login - in production, integrate with actual OAuth
    setIsGuest(false);
    setFormData({
      customerName: "Google Felhasználó",
      customerEmail: "felhasznalo@gmail.com",
      customerPhone: "",
      customerNote: "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!formData.customerName || !formData.customerEmail || !formData.customerPhone) {
      setError("Kérlek töltsd ki a kötelező mezőket!");
      return;
    }

    setLoading(true);

    try {
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
          "Ez az időpont időközben betelt. Kérlek válassz másik időpontot."
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
      } else {
        setError(result.error);
        onBookingError?.([result.error]);
      }

      setLoading(false);
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
    <div className="space-y-6">
      {/* Google Login Option */}
      {!isGuest && (
        <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="font-semibold text-foreground">Bejelentkezve</p>
              <p className="text-sm text-muted-foreground">{formData.customerEmail}</p>
            </div>
          </div>
        </div>
      )}

      {isGuest && (
        <button
          disabled
          className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-border rounded-lg bg-muted opacity-50 cursor-not-allowed"
        >
          <GoogleIcon className="w-5 h-5" />
          <span className="font-medium">Google bejelentkezés (Hamarosan elérhető)</span>
        </button>
      )}

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

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2 flex items-center gap-2">
            <User className="w-4 h-4" />
            Név *
          </label>
          <input
            type="text"
            name="customerName"
            value={formData.customerName}
            onChange={handleInputChange}
            placeholder="pl. Nagy János"
            className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary min-h-[48px]"
            disabled={loading}
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2 flex items-center gap-2">
            <Mail className="w-4 h-4" />
            E-mail *
          </label>
          <input
            type="email"
            name="customerEmail"
            value={formData.customerEmail}
            onChange={handleInputChange}
            placeholder="pl. nagy@example.com"
            className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary min-h-[48px]"
            disabled={loading}
          />
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2 flex items-center gap-2">
            <Phone className="w-4 h-4" />
            Telefonszám *
          </label>
          <input
            type="tel"
            name="customerPhone"
            value={formData.customerPhone}
            onChange={handleInputChange}
            placeholder="pl. +36 30 123 4567"
            className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary min-h-[48px]"
            disabled={loading}
          />
        </div>

        {/* Note (Optional) */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2 flex items-center gap-2">
            <MessageSquare className="w-4 h-4" />
            Megjegyzés (opcionális)
          </label>
          <textarea
            name="customerNote"
            value={formData.customerNote}
            onChange={handleInputChange}
            placeholder="Bármilyen kérés vagy megjegyzés..."
            rows={3}
            className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none min-h-[96px]"
            disabled={loading}
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 px-6 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 transition disabled:opacity-50 flex items-center justify-center gap-2 text-lg min-h-[52px]"
        >
          {loading && <Loader className="w-5 h-5 animate-spin" />}
          {loading ? "Foglalás feldolgozása..." : "Foglalás véglegesítése"}
        </button>
      </form>

      {/* Back Button */}
      {onBack && (
        <button
          onClick={onBack}
          className="w-full py-3 px-6 border border-border rounded-lg hover:bg-muted transition text-foreground min-h-[48px]"
        >
          Vissza
        </button>
      )}
    </div>
  );
}
