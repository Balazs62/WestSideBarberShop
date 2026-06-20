import React from "react";
import Navbar from "@/components/barbershop/Navbar";
import Footer from "@/components/barbershop/Footer";
import AvailabilityManager from "@/components/booking/AvailabilityManager";

// Simple mock: assume logged-in barber is employee ID 1
export default function BarberSchedulePage() {
  const employeeId = 1; // In production: get from auth context

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <div className="pt-20 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Az Elérhetőségeim
            </h1>
            <p className="text-muted-foreground">
              Kezelje a munkarendjét, szabadságait és szüneteit
            </p>
          </div>

          <AvailabilityManager employeeId={employeeId} />
        </div>
      </div>
      <Footer />
    </div>
  );
}
