"use client";

import React from "react";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Configurator } from "@/components/Configurator";
import { LivePreview } from "@/components/LivePreview";
import { NuvioGuide } from "@/components/NuvioGuide";
import { Footer } from "@/components/Footer";

export default function Home() {
  const scrollToConfig = () => {
    document.getElementById("configurator")?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToGuide = () => {
    document.getElementById("guide")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <main className="min-h-screen flex flex-col justify-between">
      <Header />
      <div className="flex-1">
        <Hero
          onScrollToConfig={scrollToConfig}
          onScrollToGuide={scrollToGuide}
        />
        <LivePreview />
        <Configurator />
        <NuvioGuide />
      </div>
      <Footer />
    </main>
  );
}
