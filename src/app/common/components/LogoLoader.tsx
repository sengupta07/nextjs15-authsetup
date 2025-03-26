import { motion, useAnimate } from "framer-motion";
import { useEffect } from "react";

export default function SvgPathLoader() {
  const [scope, animate] = useAnimate();

  useEffect(() => {
    const animateLoader = async () => {
      animate(
        [
          [".path1", { pathLength: 0.5, pathOffset: 0 }],
          [".path1", { pathLength: 0.005, pathOffset: 0 }],
          [".path2", { pathLength: 0.5, pathOffset: 0.5 }, { at: "<" }],
        ],
        { duration: 2, ease: "linear", repeat: Infinity }
      );
    };
    animateLoader();
  }, []);

  return (
    <svg
      ref={scope}
      width="52"
      height="49"
      viewBox="0 0 52 49"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="h-12 w-auto"
    >
      <motion.path
        className="path1"
        d="M24.0279 48.0558C10.7628 48.0558 0 37.293 0 24.0279C0 10.7628 10.7628 0 24.0279 0"
        fill="currentColor"
        initial={{ pathLength: 0, pathOffset: 1 }}
        animate={{ pathLength: 1, pathOffset: 0 }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
      />
      <motion.path
        className="path2"
        d="M51.7691 24.0278C51.7691 37.2929 41.0063 48.0557 27.7412 48.0557V24.0278H51.7691Z"
        fill="#EB5843"
        initial={{ pathLength: 0, pathOffset: 1 }}
        animate={{ pathLength: 1, pathOffset: 0 }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
      />
      <motion.path
        className="path3"
        d="M38.5576 20.5034C43.9073 20.5034 48.244 16.1666 48.244 10.8169C48.244 5.46716 43.9073 1.13037 38.5576 1.13037C33.2079 1.13037 28.8711 5.46716 28.8711 10.8169C28.8711 16.1666 33.2079 20.5034 38.5576 20.5034Z"
        fill="#EAB62F"
        initial={{ pathLength: 0, pathOffset: 1 }}
        animate={{ pathLength: 1, pathOffset: 0 }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
      />
    </svg>
  );
}
