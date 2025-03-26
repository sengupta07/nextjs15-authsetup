"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface LoadingTextProps {
  text: string;
  dots: string;
}

export function LoadingText({ text, dots }: LoadingTextProps) {
  return (
    <div className="relative">
      <AnimatePresence mode="wait">
        <motion.div
          key={text}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="text-base"
        >
          {text}
          {dots}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

interface LoadingProps {
  messages: string[];
  interval?: number;
  dotCount?: number;
}

export function TextLoader({
  messages,
  interval = 2000,
  dotCount = 3,
}: LoadingProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [dots, setDots] = useState("");

  useEffect(() => {
    const messageInterval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % messages.length);
    }, interval);

    const dotInterval = setInterval(() => {
      setDots((prev) => (prev.length >= dotCount ? "" : `${prev}.`));
    }, 500);

    return () => {
      clearInterval(messageInterval);
      clearInterval(dotInterval);
    };
  }, [messages.length, interval, dotCount]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-xl p-8 w-72 flex flex-col items-center justify-center text-gray-900">
        <div className="relative size-12 mb-4">
          <motion.div
            className="absolute inset-0 border-[3px] border-gray-300 border-t-gray-700 rounded-full"
            animate={{ rotate: 360 }}
            transition={{
              duration: 1,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <svg
              width="52"
              height="49"
              viewBox="0 0 52 49"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="size-8"
            >
              <path
                d="M24.0279 48.0558C10.7628 48.0558 0 37.293 0 24.0279C0 10.7628 10.7628 0 24.0279 0"
                fill="currentColor"
              ></path>
              <path
                d="M51.7691 24.0278C51.7691 37.2929 41.0063 48.0557 27.7412 48.0557V24.0278H51.7691Z"
                fill="#EB5843"
              ></path>
              <path
                d="M38.5576 20.5034C43.9073 20.5034 48.244 16.1666 48.244 10.8169C48.244 5.46716 43.9073 1.13037 38.5576 1.13037C33.2079 1.13037 28.8711 5.46716 28.8711 10.8169C28.8711 16.1666 33.2079 20.5034 38.5576 20.5034Z"
                fill="#EAB62F"
              ></path>
            </svg>
          </div>
        </div>
        <div className="text-center">
          <LoadingText text={messages[currentIndex]} dots={dots} />
        </div>
      </div>
    </div>
  );
}

export default TextLoader;
