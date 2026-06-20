import React from "react";
import { Clock, Calendar, User, Scissors, DollarSign, Edit2, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import { getDatabase } from "@/data/mockDatabase";

export default function BookingSummary({
  selectedService,
  selectedEmployee,
  selectedDate,
  selectedTime,
  customerData,
  onEditService,
  onEditBarber,
  onEditDateTime,
  onEditData,
  onConfirm,
  onBack,
  loading,
}) {
  const db = getDatabase();
  const service = db.services.find((s) => s.id === selectedService);
  const employee = db.employees.find((e) => e.id === selectedEmployee);

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("hu-HU", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card border border-border rounded-2xl p-6 space-y-6"
      >
        <h2 className="text-xl font-bold text-foreground mb-4">Foglalás összefoglalása</h2>

        {/* Service */}
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-border">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Scissors className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Szolgáltatás</p>
              <p className="font-semibold text-foreground">{service?.name}</p>
              <p className="text-sm text-muted-foreground">
                {service?.duration} perc • {service?.price} Ft
              </p>
            </div>
          </div>
          {onEditService && (
            <button
              onClick={onEditService}
              className="p-2 rounded-lg hover:bg-primary/10 transition"
              title="Módosítás"
            >
              <Edit2 className="w-4 h-4 text-muted-foreground" />
            </button>
          )}
        </div>

        {/* Barber */}
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-border">
          <div className="flex items-start gap-3">
            {employee?.photo ? (
              <img
                src={employee.photo}
                alt={employee.name}
                className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
              />
            ) : (
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <User className="w-6 h-6 text-primary" />
              </div>
            )}
            <div>
              <p className="text-sm text-muted-foreground mb-1">Barber</p>
              <p className="font-semibold text-foreground">{employee?.name || "Bármelyik elérhető"}</p>
            </div>
          </div>
          {onEditBarber && (
            <button
              onClick={onEditBarber}
              className="p-2 rounded-lg hover:bg-primary/10 transition"
              title="Módosítás"
            >
              <Edit2 className="w-4 h-4 text-muted-foreground" />
            </button>
          )}
        </div>

        {/* Date and Time */}
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-border">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Calendar className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Dátum és időpont</p>
              <p className="font-semibold text-foreground">{formatDate(selectedDate)}</p>
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {selectedTime}
              </p>
            </div>
          </div>
          {onEditDateTime && (
            <button
              onClick={onEditDateTime}
              className="p-2 rounded-lg hover:bg-primary/10 transition"
              title="Módosítás"
            >
              <Edit2 className="w-4 h-4 text-muted-foreground" />
            </button>
          )}
        </div>

        {/* Customer Data */}
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-border">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
              <User className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Ügyféladatok</p>
              <p className="font-semibold text-foreground">{customerData?.customerName}</p>
              <p className="text-sm text-muted-foreground">{customerData?.customerEmail}</p>
              <p className="text-sm text-muted-foreground">{customerData?.customerPhone}</p>
            </div>
          </div>
          {onEditData && (
            <button
              onClick={onEditData}
              className="p-2 rounded-lg hover:bg-primary/10 transition"
              title="Módosítás"
            >
              <Edit2 className="w-4 h-4 text-muted-foreground" />
            </button>
          )}
        </div>

        {/* Total Price */}
        <div className="flex items-center justify-between pt-4">
          <div className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-primary" />
            <span className="text-lg font-semibold text-foreground">Összesen</span>
          </div>
          <span className="text-2xl font-bold text-primary">{service?.price} Ft</span>
        </div>
      </motion.div>

      {/* Action Buttons */}
      <div className="space-y-3">
        <button
          onClick={onConfirm}
          disabled={loading}
          className="w-full py-4 px-6 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 transition disabled:opacity-50 flex items-center justify-center gap-2 text-lg"
        >
          {loading ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Feldolgozás...
            </>
          ) : (
            "Foglalás véglegesítése"
          )}
        </button>

        {onBack && (
          <button
            onClick={onBack}
            className="w-full py-3 px-6 border border-border rounded-lg hover:bg-muted transition flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Vissza
          </button>
        )}
      </div>

      {/* Note */}
      <div className="text-center text-sm text-muted-foreground">
        <p>A foglalás véglegesítése előtt a rendszer még egyszer ellenőrzi az időpont elérhetőségét.</p>
      </div>
    </div>
  );
}
