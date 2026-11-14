"use client";

import React, { useEffect, useState } from "react";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Configurator } from "@/components/Configurator";
import { LivePreview } from "@/components/LivePreview";
import { NuvioGuide } from "@/components/NuvioGuide";
import { Footer } from "@/components/Footer";

interface HomeClientProps {
  initialTotalUsers: number | null;
  initialConfiguration?: string;
  autoScroll?: boolean;
}

export function HomeClient({
  initialTotalUsers,
  initialConfiguration,
  autoScroll = false,
}: HomeClientProps) {
  const [totalUsers, setTotalUsers] = useState<number | null>(initialTotalUsers);

  useEffect(() => {
    let scrollTimer: NodeJS.Timeout | null = null;

    if (
      autoScroll ||
      (typeof window !== "undefined" &&
        (window.location.pathname.includes("/configure") ||
          window.location.hash === "#configurator"))
    ) {
      scrollTimer = setTimeout(() => {
        const prefersReduced =
          typeof window !== "undefined" &&
          window.matchMedia("(prefers-reduced-motion: reduce)").matches;

        document.getElementById("configurator")?.scrollIntoView({
          behavior: prefersReduced ? "auto" : "smooth",
        });
      }, 200);
    }

    const controller = new AbortController();

    fetch("/api/stats", { signal: controller.signal })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (typeof data?.totalUsers === "number" && data.totalUsers > 0) {
          setTotalUsers((prev) => Math.max(prev ?? 0, data.totalUsers));
        }
      })
      .catch(() => {
        // Silently ignore background refresh failures
      });

    return () => {
      if (scrollTimer) clearTimeout(scrollTimer);
      controller.abort();
    };
  }, [autoScroll]);

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
          totalUsers={totalUsers}
        />
        <LivePreview />
        <Configurator initialConfiguration={initialConfiguration} />
        <NuvioGuide />
      </div>
      <Footer />
    </main>
  );
}
