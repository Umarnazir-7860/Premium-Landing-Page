"use client";
import { useEffect, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { Float, MeshDistortMaterial, Icosahedron, Environment } from "@react-three/drei";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

gsap.registerPlugin(ScrollTrigger);

function Scene() {
  return (
    <>
      <Environment preset="city" />
      <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
        <Icosahedron args={[1, 10]} scale={2.5}>
          <MeshDistortMaterial color="#0a0a0a" roughness={0.1} metalness={1} distort={0.3} speed={2} />
        </Icosahedron>
      </Float>
    </>
  );
}

export default function Home() {
  const container = useRef();
  const cursorRef = useRef();

  useEffect(() => {
    const lenis = new Lenis({ lerp: 0.05, duration: 1.2, smoothWheel: true });
    function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
    requestAnimationFrame(raf);

    const moveCursor = (e) => {
      gsap.to(cursorRef.current, { x: e.clientX, y: e.clientY, duration: 0.4, ease: "power2.out" });
    };
    window.addEventListener("mousemove", moveCursor);

    const ctx = gsap.context(() => {
      // 1. Hero Text Parallax
      gsap.to(".hero-h1", {
        yPercent: -20,
        scrollTrigger: { trigger: ".hero-sec", start: "top top", scrub: true }
      });

      gsap.to(".mission", {
       yPercent: -20,
        scrollTrigger: { trigger: ".mission", start: "top top", scrub: true }
      });
      // 2. Horizontal Scroll
      const items = gsap.utils.toArray(".h-item");
      gsap.to(items, {
        xPercent: -100 * (items.length - 1),
        ease: "none",
        scrollTrigger: {
          trigger: ".h-section",
          pin: true,
          scrub: 0.1,
          start: "top top",
          end: () => "+=" + window.innerWidth * 2.5,
        }
      });

      // 3. Project Stacking (WITH LAST CARD HOLD)
      const cards = gsap.utils.toArray(".p-card");
      gsap.set(cards.slice(1), { yPercent: 100 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: ".p-section",
          pin: true,
          scrub: 1,
          start: "top top",
          // Extra length (+200%) last card ko hold karne ke liye
          end: () => "+=" + (cards.length + 1) * 100 + "%", 
        }
      });

      cards.forEach((card, i) => {
        if (i > 0) {
          tl.to(card, { yPercent: 0, ease: "none" }, i);
          tl.to(cards[i - 1], { scale: 0.85, opacity: 0.2, filter: "blur(8px)", ease: "none" }, i);
        }
      });
      // Ye empty tween last card ko thora aur der screen par rokega
      tl.to({}, { duration: 1 }); 

      // 4. Marquee Animation
      gsap.to(".marquee-inner", {
        xPercent: -50,
        repeat: -1,
        duration: 20,
        ease: "none"
      });

    }, container);

    return () => {
      ctx.revert();
      lenis.destroy();
      window.removeEventListener("mousemove", moveCursor);
    };
  }, []);

  return (
    <main ref={container} className="bg-[#020202] text-white cursor-none overflow-x-hidden">
      
      {/* Custom Cursor */}
      <div ref={cursorRef} className="fixed top-0 left-0 w-6 h-6 bg-white rounded-full pointer-events-none z-[9999] mix-blend-difference -translate-x-1/2 -translate-y-1/2"></div>

      {/* 3D Background */}
      <div className="fixed inset-0 z-0 opacity-20 pointer-events-none">
        <Canvas dpr={1} gl={{ antialias: false }}><Scene /></Canvas>
      </div>
        {/* Glass Navbar */}
      <nav className="fixed top-0 w-full z-[100] flex justify-between items-center px-10 py-6 backdrop-blur-md border-b border-white/5 bg-black/10">
        <div className="font-black italic text-2xl tracking-tighter uppercase leading-none">Nexus</div>
        <div className="flex gap-8 text-[10px] font-bold tracking-[0.4em] uppercase opacity-60">
          <span className="hover:opacity-100 transition-opacity cursor-pointer">Projects</span>
          <span className="hover:opacity-100 transition-opacity cursor-pointer">About</span>
          <span className="hover:opacity-100 transition-opacity cursor-pointer text-white">Contact</span>
        </div>
      </nav>
      {/* Hero Section */}
      <section className="hero-sec h-[120vh] flex items-center justify-center relative z-10 overflow-hidden">
        <h1 className="hero-h1 text-[22vw] font-black italic tracking-tighter uppercase leading-none select-none">Nexus</h1>
        <div className="absolute bottom-20 left-10 flex gap-20 opacity-40 text-[10px] font-bold tracking-[0.5em] uppercase">
          <p>London / 2026</p>
          <p>Creative Studio</p>
        </div>
      </section>

      {/* New Section: Mission Statement */}
      <section className="mission py-60 px-10 relative z-10 flex flex-col items-center">
        <p className="max-w-4xl text-center text-3xl md:text-5xl font-light leading-tight italic">
          We bridge the gap between <span className="text-zinc-500">imagination</span> and <span className="text-zinc-500">execution</span> through high-end digital experiences.
        </p>
      </section>

      {/* Horizontal Scroll */}
      <section className="h-section h-screen overflow-hidden relative z-10">
        <div className="flex h-full items-center">
          {["INNOVATE", "DESIGN", "DEPLOY", "SCALE"].map((text, i) => (
            <div key={i} className="h-item w-screen flex-shrink-0 flex items-center justify-center">
              <h2 className="text-[12vw] font-black italic border-b border-white/5">{text}</h2>
            </div>
          ))}
        </div>
      </section>

      {/* New Section: Marquee */}
      <section className="py-20 border-y border-white/5 overflow-hidden whitespace-nowrap relative z-10">
        <div className="marquee-inner flex gap-10 text-[8vw] font-black italic uppercase opacity-10">
          <span>Nexus Labs — Nextjs — ReactJs  —</span>
        </div>
      </section>

      {/* Projects Stacking Section (WITH HOLD FIX) */}
      <section className="p-section h-screen w-full relative z-20 overflow-hidden bg-black">
        <div className="relative w-full h-full">
          {[
            { t: "Sales Dashboard", img: "/sales-dashboard.png" },
            { t: "DevSync Social Platform for Developers", img: "/devsync.png" },
            { t: "Clg Student Certificates Management System", img: "/student-crtfct.png" }
          ].map((proj, i) => (
            <div key={i} className="p-card absolute inset-0 w-full h-full flex items-center justify-center" style={{ zIndex: i + 1 }}>
              <div className="relative w-[90vw] h-[80vh] rounded-[3rem] overflow-hidden border border-white/10 bg-[#0a0a0a]">
                <img src={proj.img} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent flex flex-col justify-end p-16">
                  <h2 className="text-6xl md:text-[6vw] font-black italic uppercase tracking-tighter leading-none">{proj.t}</h2>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* New Section: Expertise/Services */}
      <section className="py-60 px-10 relative border-t border-white z-10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-40">
          <div>
            <h3 className="text-6xl font-black italic uppercase mb-10 tracking-tighter">Capabilities</h3>
            <p className="text-zinc-500 leading-relaxed text-lg max-w-md">From secure compliance management for UK firms to high-performance Next.js architectures.</p>
          </div>
          <div className="flex flex-col gap-20">
             {["Web Development", "UI/UX Design", "SEO Strategy", "IT Consulting"].map((s, i) => (
               <div key={i} className="border-b border-white/10 pb-10 flex justify-between items-end group cursor-pointer hover:border-white transition-colors">
                  <span className="text-4xl font-bold italic">{s}</span>
                  <span className="text-[10px] opacity-40 font-mono">0{i+1}</span>
               </div>
             ))}
          </div>
        </div>
      </section>

      {/* Lengthy Footer */}
      <footer className="relative z-10 bg-black text-white border-t border-white py-40 px-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-end gap-20">
          <h2 className="text-[8vw] font-black italic tracking-tighter leading-none uppercase">Nexus</h2>
          <div className="text-right">
            <p className="uppercase tracking-[0.5em] text-[10px] font-bold mb-6">Let's build the future</p>
            <p className="text-5xl font-black italic underline hover:opacity-50 transition-opacity">hello@nexus.com</p>
          </div>
        </div>
        <div className="mt-60 pt-10 border-t border-black/10 flex flex-wrap justify-between text-[10px] font-bold tracking-[0.3em] uppercase opacity-40">
          <p>© 2026 Nexus Digital Studio</p>
          <div className="flex gap-10">
            <span>Instagram</span>
            <span>LinkedIn</span>
            <span>Twitter</span>
          </div>
          <p>Always remember ICCS (College Project)</p>
        </div>
      </footer>
    </main>
  );
}