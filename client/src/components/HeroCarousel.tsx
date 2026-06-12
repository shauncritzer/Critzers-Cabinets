import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CarouselSlide {
  image: string;
  title: string;
  subtitle: string;
}

const slides: CarouselSlide[] = [
  {
    image: "/manus-storage/hero-bg_50413bf6.webp",
    title: "Critzer's Cabinet Creations",
    subtitle: "Serving Charlottesville Since 1986"
  },
  {
    image: "/manus-storage/7nAUkEFBXEaf_785b0bb9.jpg",
    title: "Custom Kitchen Design",
    subtitle: "Transform Your Space with Expert Craftsmanship"
  },
  {
    image: "/manus-storage/RHHoKWmplcBC_6685e73b.jpg",
    title: "Quality Cabinetry",
    subtitle: "Authorized Omega & Wolf Dealer"
  },
  {
    image: "/manus-storage/bt6Vi4lpCf4B_2a2f6618.jpg",
    title: "Premium Hardware",
    subtitle: "Top Knobs Collection Available Online"
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
    <div className="relative bg-cover bg-center min-h-[600px] flex flex-col overflow-hidden">
      {/* Slides */}
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? "opacity-100" : "opacity-0"
          }`}
          style={{
            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url('${slide.image}')`,
            backgroundPosition: "center",
            backgroundSize: "cover"
          }}
        >
          {/* Slide Content */}
          <div className="flex-1 flex items-center justify-center h-full">
            <div className="container text-center">
              <div className="max-w-3xl mx-auto space-y-6">
                <h1 className="text-5xl md:text-6xl font-bold text-white drop-shadow-lg animate-fade-in">
                  {slide.title}
                </h1>
                <p className="text-xl md:text-2xl text-white/95 drop-shadow-md animate-fade-in">
                  {slide.subtitle}
                </p>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Arrows */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white z-10"
        onClick={prevSlide}
      >
        <ChevronLeft className="h-8 w-8" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white z-10"
        onClick={nextSlide}
      >
        <ChevronRight className="h-8 w-8" />
      </Button>

      {/* Dots Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-10">
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
    </div>
  );
}
