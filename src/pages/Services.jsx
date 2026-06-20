import React, { useState } from "react";
import Navbar from "@/components/barbershop/Navbar";
import Footer from "@/components/barbershop/Footer";
import SercicesSection from "@/components/barbershop/SercicesSection";
import { useNavigate } from "react-router-dom";

export default function Services() {
  const navigate = useNavigate();
  const handleBook = (service) => {
    const label = service.price ? `${service.name} – ${service.price}` : service.name;
    navigate(`/booking?service=${encodeURIComponent(label)}`);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <div className="pt-20">
        <SercicesSection onBookService={handleBook} />
      </div>
      <Footer />
    </div>
  );
}