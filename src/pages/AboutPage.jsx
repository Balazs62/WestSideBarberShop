import React from "react";
import Navbar from "@/components/barbershop/Navbar";
import Footer from "@/components/barbershop/Footer";
import AboutSection from "@/components/barbershop/AboutSection";

const ABOUT_IMAGE = "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=1200&q=80";
const ABOUT_TEXT =
  "A WestSide Barbershop Gyöngyös célja, hogy minden vendég friss, magabiztos és stílusos külsővel távozzon. Precíz átmenetek, modern frizurák, szakálligazítás és prémium barber élmény egy helyen.";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <div className="pt-20">
        <AboutSection aboutImage={ABOUT_IMAGE} aboutText={ABOUT_TEXT} />
      </div>
      <Footer />
    </div>
  );
}