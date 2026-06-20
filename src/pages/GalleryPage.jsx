import React from "react";
import Navbar from "@/components/barbershop/Navbar";
import Footer from "@/components/barbershop/Footer";
import GallerySection from "@/components/barbershop/GallerySection";

export default function GalleryPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <div className="pt-20">
        <GallerySection />
      </div>
      <Footer />
    </div>
  );
}