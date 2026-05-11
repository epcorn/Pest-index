import { motion, useScroll, useTransform } from "motion/react"
import React, { useRef } from 'react'

function HeroImg() {
  const ref = useRef(null);
  const h1Ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  });
  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "150%"]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  return (
    <>
      <section ref={ref} className="relative h-130 overflow-hidden">
          <motion.img
            src="/images/pest-hero.webp"
            alt="hero"
            className="absolute inset-0 w-full h-full object-cover object-right"
            style={{ y: imageY }}
          />
          {/* overlay */}
          <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/30 to-transparent" />

          {/* hero text */}
          <motion.div style={{ y: textY, opacity: textOpacity }} className="absolute bottom-12 left-12 text-white max-w-xl">
            <h1 className="text-5xl font-bold mb-4">
              Pest Index Dashboard
            </h1>

            <p className="text-lg text-gray-200">
              Track seasonal pest activity across cities and identify
              the highest risk pests for the current month.
            </p>
          </motion.div>
        </section>
    </>
  )
}

export default HeroImg