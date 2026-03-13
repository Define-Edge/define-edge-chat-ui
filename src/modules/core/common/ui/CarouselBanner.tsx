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
  // Internal index operates on extended array: [lastClone, ...slides, firstClone]
  const [internalIndex, setInternalIndex] = useState(1);
  const [isAnimating, setIsAnimating] = useState(true);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const dragStart = useRef(0);
  const autoPlayRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Extended slides: [last, ...original, first]
  const extendedSlides = [
    slides[slides.length - 1],
    ...slides,
    slides[0],
  ];

  const goToNext = useCallback(() => {
    setIsAnimating(true);
    setInternalIndex((prev) => prev + 1);
  }, []);

  const goToPrev = useCallback(() => {
    setIsAnimating(true);
    setInternalIndex((prev) => prev - 1);
  }, []);

  // After transition to a clone, instantly jump to the real slide
  const handleTransitionEnd = useCallback(() => {
    if (internalIndex === 0) {
      // Landed on last-clone → jump to real last
      setIsAnimating(false);
      setInternalIndex(slides.length);
    } else if (internalIndex === slides.length + 1) {
      // Landed on first-clone → jump to real first
      setIsAnimating(false);
      setInternalIndex(1);
    }
  }, [internalIndex, slides.length]);

  // Reset auto-play
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

    if (dragOffset < -threshold) {
      goToNext();
    } else if (dragOffset > threshold) {
      goToPrev();
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
    -(internalIndex * 100) +
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
        ref={trackRef}
        className={`flex h-full ${isDragging || !isAnimating ? "" : "transition-transform duration-500 ease-out"}`}
        style={{ transform: `translateX(${translateX}%)` }}
        onTransitionEnd={handleTransitionEnd}
      >
        {extendedSlides.map((slide, index) => (
          <div
            key={`${slide.id}-${index}`}
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
