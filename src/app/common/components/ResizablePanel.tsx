import React, { ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import useMeasure from "react-use-measure";

interface ResizablePanelProps {
  children: ReactNode;
  duration?: number;
  className?: string;
  style?: React.CSSProperties;
}

function ResizablePanel({ children, duration = 0.3 }: ResizablePanelProps) {
  const [ref, { height }] = useMeasure();

  return (
    <motion.div
      className="relative "
      animate={{ height: height }}
      transition={{ duration }}
    >
      <AnimatePresence initial={false}>
        <motion.div
          key={JSON.stringify(children, ignoreCircularReferences())}
          className={"relative"}
        >
          <div ref={ref} className="w-full">
            {children}
          </div>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}

/**
 * Replacer function to JSON.stringify that ignores
 * circular references and internal React properties.
 */
const ignoreCircularReferences = () => {
  const seen = new WeakSet();
  return (key: string, value: WeakKey) => {
    if (key.startsWith("_")) return; // Don't compare React's internal props.
    if (typeof value === "object" && value !== null) {
      if (seen.has(value)) return;
      seen.add(value);
    }
    return value;
  };
};

export default ResizablePanel;
