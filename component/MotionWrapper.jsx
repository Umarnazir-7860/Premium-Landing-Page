"use client";

import { motion } from "framer-motion";

// className prop add kiya taake grid isey stretch kar sakay
export default function FadeIn({ children, delay = 0, direction = "up", duration = 0.5, className = "" }) {
  const directions = {
    up: { y: 40, x: 0 },
    down: { y: -40, x: 0 },
    left: { x: 40, y: 0 },
    right: { x: -40, y: 0 },
    none: { x: 0, y: 0 }
  };

  return (
    /* 🔹 FIX: className={className} add kiya aur h-full taake wrapper stretch ho */
    <div className={`w-full overflow-x-clip ${className}`}> 
      <motion.div
        // 🔹 FIX: motion.div ko bhi h-full diya taake card poori height le
        className="h-full w-full"
        initial={{ 
          opacity: 0, 
          x: directions[direction].x, 
          y: directions[direction].y 
        }}
        whileInView={{ 
          opacity: 1, 
          x: 0, 
          y: 0 
        }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ 
          duration: duration, 
          delay: delay, 
          ease: "easeOut" 
        }}
      >
        {children}
      </motion.div>
    </div>
  );
}