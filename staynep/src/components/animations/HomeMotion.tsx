"use client";

import { useEffect } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";

export default function HomeMotion() {
  useEffect(() => {
    if (prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      // —— Hero entrance ——
      const heroTl = gsap.timeline({ defaults: { ease: "power3.out" } });

      heroTl
        .from("[data-gsap='hero-badge']", {
          y: 14,
          opacity: 0,
          duration: 0.55,
        })
        .from(
          "[data-gsap='hero-title']",
          { y: 32, opacity: 0, duration: 0.75 },
          "-=0.25"
        )
        .from(
          "[data-gsap='hero-sub']",
          { y: 20, opacity: 0, duration: 0.55 },
          "-=0.4"
        )
        .from(
          "[data-gsap='hero-cta']",
          { y: 16, opacity: 0, duration: 0.45, stagger: 0.1 },
          "-=0.3"
        )
        .from(
          "[data-gsap='hero-map']",
          { y: 48, opacity: 0, scale: 0.97, duration: 0.9 },
          "-=0.15"
        )
        .from(
          "[data-gsap='hero-stat']",
          { y: 20, opacity: 0, duration: 0.5, stagger: 0.08 },
          "-=0.35"
        )
        .from(
          "[data-gsap='map-marker']",
          {
            scale: 0,
            opacity: 0,
            duration: 0.45,
            stagger: 0.06,
            ease: "back.out(1.6)",
          },
          "-=0.5"
        );

      // —— Section headers on scroll ——
      gsap.utils.toArray<HTMLElement>("[data-gsap-reveal]").forEach((el) => {
        gsap.from(el, {
          scrollTrigger: {
            trigger: el,
            start: "top 88%",
            once: true,
          },
          y: 36,
          opacity: 0,
          duration: 0.75,
          ease: "power2.out",
        });
      });

      // —— Staggered card grids ——
      gsap.utils.toArray<HTMLElement>("[data-gsap-stagger]").forEach((container) => {
        const items = container.querySelectorAll("[data-gsap-stagger-item]");
        if (!items.length) return;

        gsap.from(items, {
          scrollTrigger: {
            trigger: container,
            start: "top 82%",
            once: true,
          },
          y: 40,
          opacity: 0,
          duration: 0.65,
          stagger: 0.1,
          ease: "power2.out",
        });
      });

      // —— Dashboard charts row ——
      gsap.utils.toArray<HTMLElement>("[data-gsap-chart]").forEach((el, i) => {
        gsap.from(el, {
          scrollTrigger: {
            trigger: el,
            start: "top 90%",
            once: true,
          },
          y: 28,
          opacity: 0,
          duration: 0.7,
          delay: i * 0.08,
          ease: "power2.out",
        });
      });

      // —— Map block ——
      const mapEl = document.querySelector("[data-gsap='map-panel']");
      if (mapEl) {
        gsap.from(mapEl, {
          scrollTrigger: {
            trigger: mapEl,
            start: "top 85%",
            once: true,
          },
          y: 48,
          opacity: 0,
          scale: 0.98,
          duration: 0.9,
          ease: "power2.out",
        });
      }

      // —— Subtle parallax on hero map while scrolling ——
      const heroMap = document.querySelector("[data-gsap='hero-map']");
      if (heroMap) {
        gsap.to(heroMap, {
          y: 40,
          ease: "none",
          scrollTrigger: {
            trigger: "#hero",
            start: "top top",
            end: "bottom top",
            scrub: 0.6,
          },
        });
      }
    });

    return () => ctx.revert();
  }, []);

  return null;
}
