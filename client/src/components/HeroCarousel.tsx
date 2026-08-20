import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Phone, ArrowRight } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { BUSINESS } from "@shared/business";

interface CarouselSlide {
  image: string;
  /** Accessible description of the background image. */
  imageAlt: string;
  title: string;
  subtitle: string;
}

const slides: CarouselSlide[] = [
  {
    image: "/images/hero-bg.webp",
    imageAlt:
      "Custom kitchen cabinetry built by Critzer's Cabinet Creations in Charlottesville, Virginia",
    title: "Serving Charlottesville Since 1986",
    subtitle: "40 Years of Family Craftsmanship"
  },
  {
    image: "/images/gallery/7nAUkEFBXEaf.jpg",
    imageAlt: "Rustic farmhouse kitchen with distressed cabinetry and vintage hardware",
    title: "Cabinet Refacing & Full Remodels",
    subtitle: "Transform Your Kitchen in Days, Not Months"
  },
  {
    image: "/images/gallery/RHHoKWmplcBC.jpg",
    imageAlt: "Shaker style kitchen cabinets with flat panel doors and simple knobs",
    title: "Quality Cabinetry & Cambria Quartz",
    subtitle: "Authorized Omega, Wolf & Cambria Dealer"
  },
  {
    image: "/images/gallery/bt6Vi4lpCf4B.jpg",
    imageAlt: "Custom bathroom vanity with drawer storage and stone countertop",
    title: "Premium Top Knobs Hardware",
    subtitle: "7,000+ Knobs & Pulls Available Online"
  }
];

export default function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Auto-advance slides every 5 seconds
  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
    setIsAutoPlaying(false);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    setIsAutoPlaying(false);
  };

  return (
    <section
      className="relative bg-secondary min-h-[620px] flex flex-col overflow-hidden"
      aria-label="Featured highlights"
    >
      {/* Slides */}
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
          aria-hidden={index !== currentSlide}
        >
          {/* Real <img> so the hero imagery is indexable and has alt text */}
          <img
            src={slide.image}
            alt={slide.imageAlt}
            className="absolute inset-0 w-full h-full object-cover"
            loading={index === 0 ? "eager" : "lazy"}
          />
          <div className="absolute inset-0 bg-black/50" />

          {/* Slide Content */}
          <div className="relative flex items-center justify-center h-full">
            <div className="container text-center">
              <div className="max-w-3xl mx-auto space-y-6">
                {index === 0 ? (
                  <h1 className="text-4xl md:text-6xl font-bold text-white drop-shadow-lg">
                    {slide.title}
                    <span className="block text-2xl md:text-3xl mt-3 font-semibold text-white/95">
                      {slide.subtitle}
                    </span>
                  </h1>
                ) : (
                  <>
                    <p className="text-4xl md:text-6xl font-bold text-white drop-shadow-lg">
                      {slide.title}
                    </p>
                    <p className="text-xl md:text-2xl text-white/95 drop-shadow-md">
                      {slide.subtitle}
                    </p>
                  </>
                )}

                {index === 0 && (
                  <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto">
                    Cabinet refacing, cabinet repair, Cambria quartz countertops,
                    hardware upgrades, closet design, and full kitchen and bath
                    remodeling for Charlottesville and Albemarle County.
                  </p>
                )}

                <div className="flex flex-wrap gap-4 justify-center pt-2">
                  <Link href="/quote">
                    <Button size="lg" className="gap-2">
                      Get a Free Quote{" "}
                      <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </Button>
                  </Link>
                  <a href={BUSINESS.phoneHref}>
                    <Button
                      size="lg"
                      variant="outline"
                      className="gap-2 bg-white/10 border-white text-white hover:bg-white hover:text-secondary"
                    >
                      <Phone className="h-4 w-4" aria-hidden="true" /> {BUSINESS.phone}
                    </Button>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Arrows */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white z-20"
        onClick={prevSlide}
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-8 w-8" aria-hidden="true" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white z-20"
        onClick={nextSlide}
        aria-label="Next slide"
      >
        <ChevronRight className="h-8 w-8" aria-hidden="true" />
      </Button>

      {/* Dots Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full transition-all ${
              index === currentSlide
                ? "bg-white w-8"
                : "bg-white/50 hover:bg-white/75"
            }`}
            onClick={() => goToSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
