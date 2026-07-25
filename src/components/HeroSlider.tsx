"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import type { DisplayArticle } from "@/lib/types";

interface HeroSliderProps {
  slides: DisplayArticle[];
}

export default function HeroSlider({ slides }: HeroSliderProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  useEffect(() => {
    if (slides.length === 0) return;
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, [nextSlide, slides.length]);

  if (slides.length === 0) {
    return (
      <div className="relative rounded-lg shadow-md overflow-hidden h-full flex items-center justify-center bg-gray-900 min-h-[400px]">
        <p className="text-gray-400 text-lg">No featured articles yet</p>
      </div>
    );
  }

  return (
    <div className="relative rounded-lg shadow-md overflow-hidden h-full min-h-[400px] flex flex-col">
      <div className="relative flex-1 min-h-0 overflow-hidden">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-transform duration-500 ease-in-out ${
              index === currentSlide ? "translate-x-0" : "translate-x-full"
            }`}
          >
            <Image
              src={slide.imageUrl}
              alt={slide.title}
              fill
              className="object-cover"
              priority={index === 0}
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
          </div>
        ))}

        <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 z-10">
          {slides.map((slide, index) => (
            <div
              key={slide.id}
              className={`transition-opacity duration-500 ${
                index === currentSlide ? "block" : "hidden"
              }`}
            >
              <span className="text-red-400 text-sm font-semibold">{slide.category}</span>
              <h1 className="mt-2 text-2xl sm:text-3xl font-bold text-white leading-tight">{slide.title}</h1>
              <p className="mt-3 text-gray-300 text-sm sm:text-base hidden sm:block">{slide.excerpt}</p>
              <div className="mt-4 flex items-center text-sm text-gray-400">
                <span>By {slide.author}</span>
                <span className="mx-2">&bull;</span>
                <time>{slide.date}</time>
              </div>
              <Link
                href={`/post/${slide.id}`}
                className="mt-4 inline-block bg-red-600 text-white px-5 py-2 rounded-md text-sm font-medium hover:bg-red-700 transition-colors"
              >
                Read More
              </Link>
            </div>
          ))}
        </div>

        <div className="absolute bottom-4 right-6 sm:right-8 flex space-x-2 z-20">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === currentSlide ? "bg-white" : "bg-white/40"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
