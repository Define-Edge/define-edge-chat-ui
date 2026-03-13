"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

export interface CarouselSlide {
  id: number;
  title: string;
  subtitle: string;
  image: string;
}

interface CarouselBannerProps {
  slides: CarouselSlide[];
  autoPlayInterval?: number;
}

export function CarouselBanner({
  slides,
  autoPlayInterval = 5000,
}: CarouselBannerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragStart = useRef(0);
  const autoPlayRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) =>
      prev === slides.length - 1 ? 0 : prev + 1,
    );
  }, [slides.length]);

  // Pause auto-play while dragging
  const resetAutoPlay = useCallback(() => {
    if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    if (autoPlayInterval > 0) {
      autoPlayRef.current = setInterval(goToNext, autoPlayInterval);
    }
  }, [autoPlayInterval, goToNext]);

  useEffect(() => {
    resetAutoPlay();
    return () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    };
  }, [resetAutoPlay]);

  const handleDragStart = (clientX: number) => {
    setIsDragging(true);
    dragStart.current = clientX;
    if (autoPlayRef.current) clearInterval(autoPlayRef.current);
  };

  const handleDragMove = (clientX: number) => {
    if (!isDragging) return;
    setDragOffset(clientX - dragStart.current);
  };

  const handleDragEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);

    const width = containerRef.current?.offsetWidth ?? 1;
    const threshold = width * 0.2;

    if (dragOffset < -threshold && currentIndex < slides.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else if (dragOffset > threshold && currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }

    setDragOffset(0);
    resetAutoPlay();
  };

  // Mouse events
  const onMouseDown = (e: React.MouseEvent) => handleDragStart(e.clientX);
  const onMouseMove = (e: React.MouseEvent) => handleDragMove(e.clientX);
  const onMouseUp = () => handleDragEnd();
  const onMouseLeave = () => {
    if (isDragging) handleDragEnd();
  };

  // Touch events
  const onTouchStart = (e: React.TouchEvent) =>
    handleDragStart(e.touches[0].clientX);
  const onTouchMove = (e: React.TouchEvent) =>
    handleDragMove(e.touches[0].clientX);
  const onTouchEnd = () => handleDragEnd();

  const translateX =
    -(currentIndex * 100) +
    (dragOffset / (containerRef.current?.offsetWidth ?? 1)) * 100;

  return (
    <div
      ref={containerRef}
      className="relative h-48 overflow-hidden rounded-2xl shadow-lg select-none md:h-80"
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseLeave}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {/* Slides */}
      <div
        className={`flex h-full ${isDragging ? "" : "transition-transform duration-500 ease-out"}`}
        style={{ transform: `translateX(${translateX}%)` }}
      >
        {slides.map((slide) => (
          <div
            key={slide.id}
            className="relative h-full min-w-full flex-shrink-0"
          >
            <Image
              src={slide.image}
              alt={slide.title}
              fill
              className="pointer-events-none object-cover"
              draggable={false}
              priority={slide.id === 1}
            />

            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--primary-main-dark)]/85 via-[var(--primary-main-dark)]/50 to-[var(--primary-main-dark)]/30" />

            {/* Content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
              <h2 className="mb-3 text-2xl font-bold text-white drop-shadow-lg md:mb-5 md:text-5xl">
                {slide.title}
              </h2>
              <p className="text-sm font-medium text-white/95 drop-shadow md:text-lg">
                {slide.subtitle}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
