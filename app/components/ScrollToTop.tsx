"use client";
import { ChevronUp } from "lucide-react";
import { useState, useEffect } from "react";

const ScrollToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  // Show button when page is scrolled down 500px
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 5) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);

    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  // Scroll to top handler
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return isVisible ? (
    <button
      onClick={scrollToTop}
      className="group flex items-center ml-auto mr-10"
    >
      <div
        className="
        flex mx-3 h-[48px] w-[48px] rounded-[24px] group-hover:rounded-[16px] transition-all overflow-hidden 
        items-center justify-center bg-background dark:bg-zinc-400/10 group-hover:bg-rose-500
        "
      >
        <ChevronUp
          className="group-hover:text-white transition text-emerald-500"
          size={25}
        />
      </div>
    </button>
  ) : null;
};

export default ScrollToTopButton;
