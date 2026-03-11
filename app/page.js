"use client";
import { useEffect, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { Float, MeshDistortMaterial, Icosahedron, Environment, ContactShadows } from "@react-three/drei";
import { EffectComposer, Bloom, Noise } from "@react-three/postprocessing";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

gsap.registerPlugin(ScrollTrigger);

function Scene({ modelRef }) {
  return (
    <>
      <Environment preset="city" />
      <Float speed={4} rotationIntensity={1} floatIntensity={1}>
        <Icosahedron ref={modelRef} args={[1, 15]} scale={2.5}>
          <MeshDistortMaterial color="#0a0a0a" roughness={0.1} metalness={1} distort={0.5} speed={3} />
        </Icosahedron>
      </Float>
      <ContactShadows position={[0, -3.5, 0]} opacity={0.4} scale={10} blur={2} />
    </>
  );
}

export default function Home() {
  const container = useRef();
  const modelRef = useRef();
  const cursorRef = useRef();

  useEffect(() => {
    const lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
    function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
    requestAnimationFrame(raf);

    const ctx = gsap.context(() => {
      /* --- HERO --- */
      gsap.from(".hero-title", { y: 200, opacity: 0, duration: 2, ease: "expo.out" });
      gsap.from(".hero-sub", { y: 50, opacity: 0, duration: 1.5, delay: 0.8 });

      /* --- SERVICES (Horizontal) --- */
      const services = gsap.utils.toArray(".service-card");
      gsap.to(services, {
        xPercent: -100 * (services.length - 1),
        ease: "none",
        scrollTrigger: {
          trigger: ".services-section",
          pin: true,
          scrub: 1,
          start: "top top",
          end: () => "+=" + document.querySelector(".services-wrapper").offsetWidth,
        }
      });

      /* --- PROJECTS (Cinematic) --- */
      const projects = gsap.utils.toArray(".project-card");
      const projectMain = gsap.to(projects, {
        xPercent: -100 * (projects.length - 1),
        ease: "none",
        scrollTrigger: {
          trigger: ".projects-section",
          pin: true,
          scrub: 1.5,
          start: "top top",
          end: () => "+=" + (window.innerWidth * 3),
        }
      });

      projects.forEach((card) => {
        const img = card.querySelector(".project-main-img");
        const content = card.querySelector(".project-content");
        gsap.fromTo(img, { scale: 1.6, filter: "brightness(0)" }, { scale: 1, filter: "brightness(0.6)", scrollTrigger: { trigger: card, containerAnimation: projectMain, start: "left right", end: "center center", scrub: true } });
        gsap.fromTo(content, { y: 150, opacity: 0 }, { y: 0, opacity: 1, scrollTrigger: { trigger: card, containerAnimation: projectMain, start: "left center", end: "center center", scrub: true } });
      });

      /* --- NEW: ABOUT SECTION REVEAL --- */
      // Text Line-by-Line Reveal
      gsap.from(".about-title", {
        scrollTrigger: { trigger: ".about-section", start: "top 70%" },
        y: 100,
        opacity: 0,
        duration: 1.5,
        ease: "power4.out"
      });

      gsap.from(".about-para", {
        scrollTrigger: { trigger: ".about-section", start: "top 60%" },
        y: 50,
        opacity: 0,
        duration: 1.5,
        stagger: 0.3,
        ease: "power3.out"
      });

      gsap.from(".stat-item", {
        scrollTrigger: { trigger: ".stats-grid", start: "top 85%" },
        scale: 0.5,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        ease: "back.out(1.7)"
      });

      /* --- NEW: FOOTER ZOOM-OUT REVEAL --- */
      gsap.from(".footer-title", {
        scrollTrigger: {
          trigger: "footer",
          start: "top bottom",
          end: "bottom bottom",
          scrub: 2
        },
        scale: 0.2,
        opacity: 0,
        filter: "blur(20px)",
        ease: "none"
      });

      gsap.from(".footer-btn", {
        scrollTrigger: { trigger: "footer", start: "top 30%" },
        y: 50,
        opacity: 0,
        duration: 1,
        ease: "power2.out"
      });

    }, container);

    const moveCursor = (e) => {
      gsap.to(cursorRef.current, { x: e.clientX, y: e.clientY, duration: 0.5 });
      if (modelRef.current) {
        const x = (e.clientX / window.innerWidth - 0.5) * 2;
        const y = (e.clientY / window.innerHeight - 0.5) * 2;
        gsap.to(modelRef.current.rotation, { x: y * 0.4, y: x * 0.6, duration: 1.5 });
      }
    };
    window.addEventListener("mousemove", moveCursor);

    return () => { ctx.revert(); window.removeEventListener("mousemove", moveCursor); lenis.destroy(); };
  }, []);

  return (
    <main ref={container} className="bg-[#050505] text-white overflow-hidden">
      
      <div ref={cursorRef} className="fixed w-4 h-4 bg-white rounded-full z-[9999] pointer-events-none mix-blend-difference hidden md:block" style={{ transform: 'translate(-50%, -50%)' }}></div>

      <div className="fixed inset-0 z-0 pointer-events-none opacity-50">
        <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
          <Scene modelRef={modelRef} />
          <EffectComposer><Bloom luminanceThreshold={1} intensity={1.5} /><Noise opacity={0.04} /></EffectComposer>
        </Canvas>
      </div>

      {/* NAVBAR */}
      <nav className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-16 py-8 backdrop-blur-md bg-black/10 border-b border-white/5">
        <h1 className="text-2xl font-black italic tracking-tighter">NEXUS</h1>
        <div className="flex gap-12 text-[10px] uppercase tracking-[0.4em] font-bold">
          {["Work", "Services", "About", "Contact"].map(item => <a key={item} className="hover:text-zinc-400 transition cursor-pointer">{item}</a>)}
        </div>
      </nav>

      {/* SECTIONS (Hero, Services, Projects - Purani logic bilkul same) */}
      <section className="h-screen flex flex-col justify-center items-center text-center relative z-10">
        <h1 className="hero-title text-[20vw] font-black italic leading-none tracking-tighter">NEXUS</h1>
        <p className="hero-sub text-xs tracking-[1.2em] text-zinc-500 mt-6 uppercase">Future of Digital Interaction</p>
      </section>

      <section className="services-section h-screen flex items-center overflow-hidden relative z-10">
        <div className="services-wrapper flex">
          {[
            { title: "Web Design", img: "https://images.unsplash.com/photo-1559028012-481c04fa702d" },
            { title: "3D Experiences", img: "https://images.unsplash.com/photo-1531297484001-80022131f5a1" },
            { title: "Development", img: "https://images.unsplash.com/photo-1555066931-4365d14bab8c" }
          ].map((s, i) => (
            <div key={i} className="service-card w-screen h-screen flex flex-col justify-center items-center relative overflow-hidden group">
              <img src={s.img} className="absolute w-full h-[140%] object-cover  grayscale transition-all duration-1000 group-hover:grayscale-0" />
              <h2 className="text-[12vw] font-black uppercase relative z-20 transition-all duration-700 group-hover:italic">{s.title}</h2>
            </div>
          ))}
        </div>
      </section>

   
      <section className="projects-section h-screen flex items-center overflow-hidden relative z-10 bg-[#020202]">
        <div className="projects-wrapper flex relative">
          {[
            { t: "AETHER", img: "https://images.unsplash.com/photo-1518770660439-4636190af475" },
            { t: "CHRONOS", img: "https://images.unsplash.com/photo-1522199710521-72d69614c702" },
            { t: "NEO-GEN", img: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee" }
          ].map((proj, i) => (
            <div key={i} className="project-card w-screen h-screen flex items-center justify-center relative overflow-hidden">
              <div className="relative w-[60vw] h-[70vh] overflow-hidden rounded-2xl z-10 shadow-2xl border border-white/10">
                 <img src={proj.img} className="project-main-img absolute w-full h-full object-cover" />
              </div>
              <div className="project-content absolute z-20 text-center pointer-events-none">
                <h2 className="text-[13vw] font-black italic uppercase tracking-tighter">{proj.t}</h2>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* --- REFINED: ABOUT SECTION (Animated) --- */}
      <section className="about-section min-h-screen flex items-center px-20 relative z-10 bg-[#050505]">
        <div className="max-w-6xl">
          <h2 className="about-title text-[10vw] font-black uppercase leading-[0.85] tracking-tighter mb-16 italic">Digital <br/> Sovereignty</h2>
          <p className="about-para text-4xl text-zinc-400 leading-[1.4] font-light max-w-4xl mb-20">
            We craft experiences that bypass the conscious mind, hitting the soul through <span className="text-white">perfect motion</span> and <span className="text-white">raw aesthetics</span>.
          </p>
          <div className="stats-grid grid grid-cols-3 gap-20">
            {[["99+", "Legacy"], ["14", "Awards"], ["06", "Hubs"]].map((item, idx) => (
              <div key={idx} className="stat-item">
                <p className="text-white font-black text-7xl mb-2">{item[0]}</p>
                <p className="text-zinc-600 uppercase tracking-widest text-[10px] font-bold">{item[1]}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- REFINED: FOOTER SECTION (Animated) --- */}
      <footer className="h-screen flex flex-col items-center justify-center relative z-10 bg-[#050505] overflow-hidden">
        <h2 className="footer-title text-[16vw] font-black uppercase italic tracking-tighter leading-none text-center">Inquire <br/> Now</h2>
        <button className="footer-btn group my-20 relative px-24 py-8 overflow-hidden rounded-full border border-white/20 transition-all duration-700 hover:border-white">
          <span className="relative z-10 text-xs  uppercase tracking-[0.6em] font-black group-hover:text-black transition-colors duration-700">Start Transmission</span>
          <div className="absolute inset-0 bg-white translate-y-[100%] group-hover:translate-y-0 transition-transform duration-700"></div>
        </button>
      </footer>

    </main>
  );
}