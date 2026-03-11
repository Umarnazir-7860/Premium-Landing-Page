"use client";

import { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import FadeIn from "./MotionWrapper";

gsap.registerPlugin(ScrollTrigger);

const HorizontalProcess = () => {
  const sectionRef = useRef(null);
  const wrapperRef = useRef(null);
  const [isVertical, setIsVertical] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsVertical(window.innerWidth < 1024);
    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (isVertical) return;

    const ctx = gsap.context(() => {
      const sections = gsap.utils.toArray(".process-panel");

      gsap.to(sections, {
        xPercent: -100 * (sections.length - 1),
        ease: "none",
        scrollTrigger: {
          trigger: wrapperRef.current,
          pin: true,
          scrub: 1,
          snap: 1 / (sections.length - 1),
          end: () => "+=" + wrapperRef.current.offsetWidth
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [isVertical]);

  const sections = [
    {
      id: "01",
      title: "STRATEGY",
      tag: "PLANNING",
      img: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2026",
      description:
        "We analyse your business, audience, and goals to create a clear roadmap for growth.",
    },
    {
      id: "02",
      title: "DIGITAL",
      tag: "MARKETING",
      img: "https://images.unsplash.com/photo-1557838923-2985c318be48?q=80&w=2000",
      description:
        "We implement targeted digital solutions that improve visibility and generate leads.",
    },
    {
      id: "03",
      title: "CREATIVE",
      tag: "DESIGN",
      img: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=2000",
      description:
        "We craft visually engaging designs that strengthen your brand identity.",
    },
    {
      id: "04",
      title: "DEVELOP",
      tag: "CODING",
      img: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=2000",
      description:
        "We build fast, secure, and scalable digital products.",
    },
  ];

  return (
    <section
      ref={sectionRef}
      className="relative bg-white dark:bg-black overflow-hidden"
    >
      <div
        ref={wrapperRef}
        className={`flex ${
          isVertical ? "flex-col px-6 py-20 gap-32" : "w-[400vw]"
        }`}
      >
        {sections.map((item) => (
          <div
            key={item.id}
            className={`process-panel flex-shrink-0 flex flex-col lg:flex-row items-center justify-between
            ${
              isVertical
                ? "w-full max-w-4xl mx-auto"
                : "w-screen h-screen p-10 lg:pt-40"
            }`}
          >
            {/* TEXT */}
            <div className="w-full lg:w-1/2 mb-10 lg:mb-0 text-center lg:text-left">
              <FadeIn direction="up">
                <span className="text-[#B54118] font-bold tracking-[0.3em] uppercase text-sm">
                  {item.id} {item.tag}
                </span>
              </FadeIn>

              <FadeIn direction="up" delay={0.2}>
                <h3 className="text-5xl sm:text-7xl lg:text-[6rem] font-black dark:text-white text-slate-900 leading-none mt-4">
                  {item.title}
                </h3>
              </FadeIn>

              <FadeIn direction="up" delay={0.4}>
                <p className="mt-6 text-lg dark:text-gray-300 text-black max-w-md mx-auto lg:mx-0">
                  {item.description}
                </p>
              </FadeIn>
            </div>

            {/* IMAGE */}
            <div className="w-full lg:w-1/2 h-[40vh] lg:h-[60vh] relative">
              <img
                src={item.img}
                alt={item.title}
                className="w-full h-full object-cover rounded-[2rem] shadow-2xl"
              />

              <div className="absolute -bottom-10 -left-10 text-[10rem] font-black text-slate-200 dark:text-white/5">
                {item.id}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default HorizontalProcess;