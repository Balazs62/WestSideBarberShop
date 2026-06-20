import React, { useEffect, useState } from "react";
import Navbar from "@/components/barbershop/Navbar";
import BookingSectionNew from "@/components/barbershop/BookingSectionNew";

export default function BookingPage() {
  const [preselected, setPreselected] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const s = params.get("service");
    if (s) setPreselected(decodeURIComponent(s));
  }, []);

  return (
    <div className="min-h-screen overflow-hidden bg-background text-foreground">
      <Navbar />
      <div className="pt-20 h-[calc(100vh-5rem)]">
        <BookingSectionNew preselectedService={preselected} />
      </div>
    </div>
  );
}