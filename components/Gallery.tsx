"use client";

import React, { useState, useEffect } from "react";
import { CldImage } from "next-cloudinary";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
// @ts-ignore
import HTMLFlipBook from "react-pageflip";
import { Globe, Heart } from "lucide-react";

interface GalleryProps {
  images: string[];
}

const Page = React.forwardRef((props: any, ref: any) => {
  return (
    <div className="page bg-[#F9F7F1] overflow-hidden shadow-[inset_0_0_20px_rgba(0,0,0,0.1)] border border-sage-200/40 before:content-[''] before:absolute before:inset-0 before:bg-[url('https://www.transparenttextures.com/patterns/aged-paper.png')] before:opacity-30 before:pointer-events-none" ref={ref}>
      <div className="h-full w-full relative flex items-center justify-center p-6">
        {/* Línea del pliegue de la página */}
        <div className="absolute top-0 bottom-0 left-0 w-10 bg-gradient-to-r from-sage-950/20 to-transparent z-10 pointer-events-none"></div>
        {props.children}
      </div>
    </div>
  );
});

Page.displayName = "Page";

const CoverPage = React.forwardRef((props: any, ref: any) => {
  return (
    <div className="page overflow-hidden shadow-2xl" ref={ref}>
      <div className="h-full w-full relative">
        {props.children}
      </div>
    </div>
  );
});

CoverPage.displayName = "CoverPage";

export default function Gallery({ images }: GalleryProps) {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const slides = images.map((id) => ({
    src: `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/q_auto,f_auto/${id.replace(/ /g, "%20")}`,
  }));

  // Agrupación dinámica de fotos en páginas (1, 2 o 3 por página)
  const pageLayouts = [
    { type: 'single_large', count: 1 },
    { type: 'two_polaroids', count: 2 },
    { type: 'collage_three', count: 3 },
    { type: 'single_map', count: 1 },
    { type: 'two_scrapbook', count: 2 },
    { type: 'single_ticket', count: 1 }
  ];

  const pages = [];
  let imgIndex = 0;
  let layoutIndex = 0;

  while (imgIndex < images.length) {
    const layout = pageLayouts[layoutIndex % pageLayouts.length];
    const pageImages = images.slice(imgIndex, imgIndex + layout.count);
    pages.push({ layout: layout.type, pageImages, startIndex: imgIndex });
    imgIndex += layout.count;
    layoutIndex++;
  }

  const quotes = [
    "Nuestra mayor aventura comienza aquí",
    "Lugares por descubrir juntos",
    "Tú eres mi destino favorito",
    "Coleccionando momentos, no cosas",
    "Contigo, cada día es un viaje",
    "Hacia las cataratas del Paraíso y más allá",
    "El mejor equipo",
    "Recuerdos que durarán toda la vida"
  ];

  if (!mounted) return <div className="min-h-[500px] flex items-center justify-center"><div className="animate-pulse text-sage-500">Cargando libro...</div></div>;

  return (
    <div className="w-full relative py-12 flex justify-center perspective-[2000px]">

      <div className="relative z-10 w-full flex justify-center max-w-6xl">
        {/* @ts-expect-error react-pageflip typed incorrectly */}
        <HTMLFlipBook 
          width={450} 
          height={600} 
          size="stretch"
          minWidth={300}
          maxWidth={500}
          minHeight={400}
          maxHeight={650}
          maxShadowOpacity={0.6}
          showCover={true}
          mobileScrollSupport={true}
          className="flip-book shadow-2xl mx-auto"
        >
          {/* Cover Page */}
          <CoverPage>
            <div className="h-full w-full bg-sage-900 relative overflow-hidden before:content-[''] before:absolute before:inset-0 before:bg-[url('https://www.transparenttextures.com/patterns/leather.png')] before:opacity-60 shadow-inner">
              
              {/* Rectángulos de doble línea y óvalo */}
              <div className="absolute inset-4 left-24 border-[1px] border-gold-500/40 rounded-sm pointer-events-none z-10"></div>
              <div className="absolute inset-[22px] left-[102px] border-[1px] border-gold-500/40 rounded-sm pointer-events-none z-10"></div>
              <div className="absolute inset-y-12 inset-x-6 left-[100px] border-[2px] border-gold-500/30 rounded-[100%] pointer-events-none z-10"></div>
              
              {/* Lomo / Bisagra izquierda */}
              <div className="absolute top-0 bottom-0 left-0 w-20 bg-sage-800 border-r-2 border-sage-950/60 shadow-[3px_0_15px_rgba(0,0,0,0.6)] z-20 before:content-[''] before:absolute before:inset-0 before:bg-[url('https://www.transparenttextures.com/patterns/leather.png')] before:opacity-60">
                {/* Ojales negros (Grommets) */}
                <div className="absolute top-[25%] left-1/2 -translate-x-1/2 w-6 h-6 bg-sage-950 rounded-full border-4 border-sage-950 shadow-[0_2px_4px_rgba(0,0,0,0.5),inset_0_2px_5px_rgba(0,0,0,1)] flex items-center justify-center">
                  <div className="w-2.5 h-2.5 bg-black rounded-full"></div>
                </div>
                <div className="absolute bottom-[25%] left-1/2 -translate-x-1/2 w-6 h-6 bg-sage-950 rounded-full border-4 border-sage-950 shadow-[0_2px_4px_rgba(0,0,0,0.5),inset_0_2px_5px_rgba(0,0,0,1)] flex items-center justify-center">
                  <div className="w-2.5 h-2.5 bg-black rounded-full"></div>
                </div>

                {/* Hilo SVG con moño */}
                <svg className="absolute top-[20%] bottom-[20%] left-1/2 -translate-x-1/2 w-24 h-[60%] overflow-visible z-30 filter drop-shadow-[1px_2px_2px_rgba(0,0,0,0.8)]" viewBox="0 0 100 200" preserveAspectRatio="none">
                  {/* Línea recta */}
                  <path d="M50,20 L50,180" stroke="#D1C2A5" strokeWidth="3" fill="none" />
                  {/* Lazo izquierdo */}
                  <path d="M50,100 C 10,70 -10,130 50,100" stroke="#D1C2A5" strokeWidth="3" fill="none" />
                  {/* Lazo derecho */}
                  <path d="M50,100 C 90,70 110,130 50,100" stroke="#D1C2A5" strokeWidth="3" fill="none" />
                  {/* Puntas del hilo */}
                  <path d="M50,100 L 30,150" stroke="#D1C2A5" strokeWidth="3" fill="none" strokeLinecap="round" />
                  <path d="M50,100 L 65,145" stroke="#D1C2A5" strokeWidth="3" fill="none" strokeLinecap="round" />
                </svg>
              </div>

              {/* Contenido Central: Letras y Globo */}
              <div className="pl-20 relative z-20 flex flex-col items-center justify-center h-full pt-12 pb-8">
                
                {/* Textos escalonados */}
                <h2 className="font-serif font-bold text-gold-400 flex flex-col items-center drop-shadow-xl" style={{ textShadow: "2px 3px 5px rgba(0,0,0,0.7)" }}>
                  <div className="flex gap-2 text-5xl mb-4">
                    <span className="transform -rotate-6 translate-y-1">O</span>
                    <span className="transform rotate-3 -translate-y-2 text-6xl">U</span>
                    <span className="transform -rotate-3 translate-y-1">R</span>
                  </div>
                  
                  <div className="flex gap-1 text-[2.5rem] md:text-5xl mb-3 tracking-tighter">
                    <span className="transform -rotate-2">A</span>
                    <span className="transform rotate-4 translate-y-2">D</span>
                    <span className="transform -rotate-6 text-6xl -translate-y-2">V</span>
                    <span className="transform rotate-2 translate-y-1">E</span>
                    <span className="transform -rotate-4">N</span>
                    <span className="transform rotate-6 -translate-y-2">T</span>
                    <span className="transform -rotate-2 text-6xl translate-y-1">U</span>
                    <span className="transform rotate-3 -translate-y-1">R</span>
                    <span className="transform -rotate-5 translate-y-1">E</span>
                  </div>
                  
                  <div className="flex gap-3 text-6xl mt-4">
                    <span className="transform rotate-6 -translate-y-1">B</span>
                    <span className="transform -rotate-3 translate-y-2 text-[5rem]">O</span>
                    <span className="transform rotate-2 -translate-y-2">O</span>
                    <span className="transform -rotate-6 translate-y-1">K</span>
                  </div>
                </h2>
                
                {/* Globo con cinta */}
                <div className="mt-12 relative inline-block">
                  <div className="w-24 h-24 bg-cream-100 rounded-full border-4 border-sage-800 flex items-center justify-center overflow-hidden relative shadow-[0_5px_15px_rgba(0,0,0,0.5)]">
                     <Globe className="w-20 h-20 text-sage-700/80 -ml-1 mt-1" strokeWidth={1} />
                     <div className="absolute inset-0 bg-gradient-to-tr from-sage-900/20 to-transparent"></div>
                  </div>
                  {/* Tape */}
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-20 h-7 bg-cream-50/50 backdrop-blur-[2px] border border-cream-100/30 shadow-md transform -rotate-12 opacity-80 z-20"></div>
                </div>
              </div>

            </div>
          </CoverPage>

          {/* Photo Pages */}
          {pages.map((page, pageIdx) => {
            const { layout, pageImages, startIndex } = page;
            const quote = quotes[pageIdx % quotes.length];

            return (
              <Page key={`page-${pageIdx}`}>
                {/* Animaciones y estilos en línea para esta página */}
                <style>{`
                  @import url('https://fonts.googleapis.com/css2?family=Gochi+Hand&display=swap');
                  @keyframes float {
                    0%, 100% { transform: translateY(0px) rotate(var(--tw-rotate)); }
                    50% { transform: translateY(-4px) rotate(calc(var(--tw-rotate) + 2deg)); }
                  }
                  .sticker { animation: float 5s ease-in-out infinite; }
                  .pencil-text { 
                    font-family: 'Gochi Hand', cursive; 
                    color: #4a4a4a; 
                    mix-blend-mode: multiply; 
                    opacity: 0.9; 
                    filter: drop-shadow(0px 0px 0.5px rgba(0,0,0,0.3)); 
                  }
                  .washi-tape { mix-blend-mode: multiply; clip-path: polygon(0% 5%, 5% 0%, 95% 5%, 100% 10%, 95% 95%, 100% 100%, 5% 95%, 0% 90%); }
                `}</style>

                {/* Textura de papel envejecido ultra realista */}
                <div className="absolute inset-0 bg-[#E0D0B0] before:content-[''] before:absolute before:inset-0 before:bg-[url('https://www.transparenttextures.com/patterns/aged-paper.png')] before:opacity-70 shadow-[inset_0_0_120px_rgba(60,40,20,0.5),inset_0_0_20px_rgba(0,0,0,0.3)] z-0 pointer-events-none"></div>

                <div className="w-full h-full relative z-10 p-4 md:p-8 flex flex-col items-center justify-center">
                  
                  {/* === LAYOUT 1: SINGLE LARGE === */}
                  {layout === 'single_large' && pageImages[0] && (
                    <div className="relative w-full h-full flex flex-col items-center justify-center">
                      <div 
                        className="relative p-4 bg-[#FAFAFA] shadow-[5px_15px_30px_rgba(0,0,0,0.4)] transform -rotate-2 w-[85%] max-h-[70%] group cursor-pointer hover:scale-[1.03] transition-transform duration-500"
                        onClick={() => { setIndex(startIndex); setOpen(true); }}
                      >
                        {/* Esquineros Realistas */}
                        <div className="absolute -top-3 -left-3 w-10 h-10 bg-gradient-to-br from-[#2A2B2A] to-[#111111] shadow-[2px_2px_5px_rgba(0,0,0,0.6)] z-30" style={{ clipPath: 'polygon(0 0, 100% 0, 0 100%)' }}>
                          <div className="absolute inset-[1px] border border-white/20" style={{ clipPath: 'polygon(0 0, 100% 0, 0 100%)' }}></div>
                        </div>
                        <div className="absolute -top-3 -right-3 w-10 h-10 bg-gradient-to-bl from-[#2A2B2A] to-[#111111] shadow-[-2px_2px_5px_rgba(0,0,0,0.6)] z-30" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%)' }}>
                          <div className="absolute inset-[1px] border border-white/20" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%)' }}></div>
                        </div>
                        <div className="absolute -bottom-3 -left-3 w-10 h-10 bg-gradient-to-tr from-[#2A2B2A] to-[#111111] shadow-[2px_-2px_5px_rgba(0,0,0,0.6)] z-30" style={{ clipPath: 'polygon(0 0, 0 100%, 100% 100%)' }}>
                          <div className="absolute inset-[1px] border border-white/20" style={{ clipPath: 'polygon(0 0, 0 100%, 100% 100%)' }}></div>
                        </div>
                        <div className="absolute -bottom-3 -right-3 w-10 h-10 bg-gradient-to-tl from-[#2A2B2A] to-[#111111] shadow-[-2px_-2px_5px_rgba(0,0,0,0.6)] z-30" style={{ clipPath: 'polygon(100% 0, 100% 100%, 0 100%)' }}>
                          <div className="absolute inset-[1px] border border-white/20" style={{ clipPath: 'polygon(100% 0, 100% 100%, 0 100%)' }}></div>
                        </div>
                        
                        <div className="relative w-full aspect-[4/5] bg-black/5 overflow-hidden border border-black/10">
                          <CldImage src={pageImages[0]} alt="Recuerdo" fill sizes="50vw" className="object-cover sepia-[0.1] contrast-[1.1] saturate-[0.85]" />
                        </div>
                      </div>
                      <p className="text-[2.5rem] mt-10 transform rotate-2 pencil-text z-20 relative">{quote}</p>
                      

                    </div>
                  )}

                  {/* === LAYOUT 2: TWO POLAROIDS === */}
                  {layout === 'two_polaroids' && (
                    <div className="relative w-full h-full flex flex-col items-center justify-around py-2">
                      {/* Vuelo decorativo dibujado a mano */}
                      <svg className="absolute inset-0 w-full h-full opacity-40 pointer-events-none z-0 mix-blend-multiply" viewBox="0 0 100 100" preserveAspectRatio="none">
                        <path d="M10,20 Q60,40 90,80" stroke="#1E1A1D" strokeWidth="0.4" strokeDasharray="2,3" fill="none"/>
                      </svg>

                      {/* Dibujo a lápiz - Avión de papel */}
                      <svg viewBox="0 0 100 100" className="absolute top-10 left-4 w-16 h-16 opacity-60 mix-blend-multiply text-[#4a4a4a] transform -rotate-12 z-10 pointer-events-none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none">
                         <polygon points="10,50 90,20 60,90 50,60 10,50" />
                         <line x1="50" y1="60" x2="90" y2="20" />
                      </svg>

                      {pageImages[0] && (
                        <div 
                          className="relative p-3 pb-10 bg-[#FAFAFA] shadow-[3px_10px_20px_rgba(0,0,0,0.3)] transform rotate-3 w-[70%] self-start ml-2 group cursor-pointer hover:scale-[1.04] transition-all z-10"
                          onClick={() => { setIndex(startIndex); setOpen(true); }}
                        >
                          {/* Washi Tape roja translucida */}
                          <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-14 h-5 bg-gradient-to-r from-red-400/60 to-red-500/50 backdrop-blur-md transform rotate-6 shadow-sm washi-tape"></div>
                          
                          <div className="relative w-full aspect-square bg-gray-200 overflow-hidden border border-black/5">
                            <CldImage src={pageImages[0]} alt="Recuerdo" fill sizes="30vw" className="object-cover sepia-[0.1]" />
                          </div>
                          <p className="absolute bottom-3 left-0 w-full text-center text-xl pencil-text">2026</p>
                        </div>
                      )}
                      
                      {pageImages[1] && (
                        <div 
                          className="relative p-3 pb-10 bg-[#FAFAFA] shadow-[5px_15px_25px_rgba(0,0,0,0.35)] transform -rotate-4 w-[75%] self-end mr-2 group cursor-pointer hover:scale-[1.04] transition-all z-20"
                          onClick={() => { setIndex(startIndex + 1); setOpen(true); }}
                        >
                          {/* Tachuela brillante ultrarrealista */}
                          <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-gradient-to-br from-gold-300 via-gold-500 to-gold-700 shadow-[1px_3px_5px_rgba(0,0,0,0.6),inset_-1px_-1px_2px_rgba(0,0,0,0.4)] z-30 sticker">
                            <div className="absolute top-[2px] left-[2px] w-1.5 h-1.5 bg-white/80 rounded-full blur-[0.5px]"></div>
                            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-[2px] h-3 bg-gray-500 -z-10 shadow-sm"></div>
                          </div>

                          <div className="relative w-full aspect-square bg-gray-200 overflow-hidden border border-black/5">
                            <CldImage src={pageImages[1]} alt="Recuerdo" fill sizes="30vw" className="object-cover sepia-[0.1]" />
                          </div>
                        </div>
                      )}

                    </div>
                  )}

                  {/* === LAYOUT 3: COLLAGE THREE === */}
                  {layout === 'collage_three' && (
                    <div className="relative w-full h-full">
                      {/* Dibujo a lápiz - Corazón con flecha */}
                      <svg viewBox="0 0 100 100" className="absolute top-20 right-8 w-20 h-20 opacity-60 mix-blend-multiply text-[#4a4a4a] transform rotate-12 z-0 pointer-events-none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none">
                         <path d="M50 80 C 20 50 10 30 30 15 C 45 5 50 20 50 20 C 50 20 55 5 70 15 C 90 30 80 50 50 80 Z" />
                         <path d="M10 90 L 90 10 M 15 90 L 10 90 L 10 85 M 85 10 L 90 10 L 90 15" />
                      </svg>
                      
                      {pageImages[0] && (
                        <div onClick={() => { setIndex(startIndex); setOpen(true); }} className="absolute top-2 left-2 p-1.5 bg-[#FFF] shadow-[2px_5px_10px_rgba(0,0,0,0.4)] transform -rotate-6 w-[55%] z-20 cursor-pointer hover:scale-110 transition-all border border-black/10">
                          <div className="relative w-full aspect-square bg-sage-100 overflow-hidden"><CldImage src={pageImages[0]} alt="Recuerdo" fill sizes="25vw" className="object-cover sepia-[0.1]" /></div>
                        </div>
                      )}
                      {pageImages[1] && (
                        <div onClick={() => { setIndex(startIndex + 1); setOpen(true); }} className="absolute top-32 right-0 p-1.5 bg-[#FAFAFA] shadow-[3px_8px_15px_rgba(0,0,0,0.4)] transform rotate-8 w-[50%] z-10 cursor-pointer hover:scale-110 transition-all">
                          <div className="absolute -top-3 right-4 w-10 h-4 bg-sage-700/40 washi-tape rotate-12"></div>
                          <div className="relative w-full aspect-square bg-sage-100 overflow-hidden"><CldImage src={pageImages[1]} alt="Recuerdo" fill sizes="25vw" className="object-cover sepia-[0.1]" /></div>
                        </div>
                      )}
                      {pageImages[2] && (
                        <div onClick={() => { setIndex(startIndex + 2); setOpen(true); }} className="absolute bottom-20 left-1/2 -translate-x-1/2 p-2 pb-8 bg-white shadow-[0_15px_30px_rgba(0,0,0,0.5)] transform -rotate-2 w-[70%] z-30 cursor-pointer hover:scale-110 transition-all border border-black/5">
                          <div className="absolute -top-3 left-4 w-10 h-4 bg-gold-400/50 washi-tape -rotate-12"></div>
                          <div className="absolute -bottom-3 right-4 w-10 h-4 bg-gold-400/50 washi-tape -rotate-12"></div>
                          <div className="relative w-full aspect-[4/3] bg-sage-100 overflow-hidden"><CldImage src={pageImages[2]} alt="Recuerdo" fill sizes="30vw" className="object-cover sepia-[0.1]" /></div>
                        </div>
                      )}
                      <p className="absolute bottom-2 right-2 text-[1.6rem] pencil-text rotate-3 w-44 text-right leading-[0.9]">{quote}</p>
                    </div>
                  )}

                  {/* === LAYOUT 4: SINGLE WITH MAP === */}
                  {layout === 'single_map' && pageImages[0] && (
                    <div className="relative w-full h-full flex flex-col items-center pt-4">
                      <div className="w-full flex justify-between items-start mb-10 z-20">
                        {/* Sello de mapa */}
                        <div className="w-24 h-24 bg-[url('https://www.transparenttextures.com/patterns/old-map.png')] bg-[#D4C3A3] rounded-full flex items-center justify-center shadow-[inset_0_0_15px_rgba(0,0,0,0.5),2px_5px_10px_rgba(0,0,0,0.4)] sticker border-[3px] border-[#F9F7F1]" style={{ '--tw-rotate': '-6deg' } as React.CSSProperties}>
                           <Globe className="w-12 h-12 text-[#3A2D1F] opacity-70 mix-blend-multiply" strokeWidth={1.5} />
                        </div>
                        {/* Nota Post-It Despegándose */}
                        <div className="relative w-28 h-28 bg-gradient-to-br from-[#FEF08A] to-[#FDE047] shadow-[2px_5px_10px_rgba(0,0,0,0.3)] transform rotate-3 p-3 flex flex-col items-center justify-center sticker border border-yellow-300" style={{ '--tw-rotate': '3deg' } as React.CSSProperties}>
                          <div className="absolute bottom-0 right-0 w-1/2 h-4 shadow-[10px_10px_10px_rgba(0,0,0,0.4)] transform rotate-6 -z-10 bg-transparent"></div>
                          <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-8 h-3 bg-red-400/40 washi-tape rotate-2"></div>
                          <p className="text-[1.4rem] leading-[0.9] text-center pencil-text">Lugares<br/>por<br/>visitar</p>
                        </div>
                      </div>
                      
                      {/* Foto con borde de estampilla postal */}
                      <div 
                        className="relative p-2 bg-[#F5F2EA] shadow-[5px_15px_30px_rgba(0,0,0,0.4)] transform rotate-1 w-[90%] border-2 border-dashed border-[#BCAE91] group cursor-pointer hover:scale-[1.03] transition-all"
                        onClick={() => { setIndex(startIndex); setOpen(true); }}
                      >
                        <div className="absolute top-1/2 -left-8 -translate-y-1/2 bg-[#3A2D1F] text-white text-[9px] py-1 px-5 -rotate-90 tracking-[0.3em] uppercase shadow-md mix-blend-overlay">EST. 2026</div>
                        <div className="relative w-full aspect-[4/3] bg-black/5 overflow-hidden">
                          <CldImage src={pageImages[0]} alt="Recuerdo" fill sizes="40vw" className="object-cover sepia-[0.1]" />
                        </div>
                      </div>
                      <p className="text-[2rem] mt-10 text-center pencil-text w-[90%] leading-none">{quote}</p>
                    </div>
                  )}

                  {/* === LAYOUT 5: TWO SCRAPBOOK === */}
                  {layout === 'two_scrapbook' && (
                    <div className="relative w-full h-full flex flex-col justify-between py-6">
                      {pageImages[0] && (
                        <div 
                          className="relative p-2 bg-white shadow-[0_10px_20px_rgba(0,0,0,0.3)] transform -rotate-2 w-[80%] mx-auto z-20 cursor-pointer hover:scale-105 transition-all"
                          onClick={() => { setIndex(startIndex); setOpen(true); }}
                        >
                          <div className="absolute -top-4 -right-4 w-14 h-14 border-4 border-[#3A2D1F]/40 rounded-full flex items-center justify-center opacity-70 rotate-12 mix-blend-multiply sticker" style={{ '--tw-rotate': '12deg' } as React.CSSProperties}>
                             <span className="font-serif text-[12px] text-[#3A2D1F] font-bold">A&B</span>
                          </div>
                          <div className="relative w-full aspect-video bg-gray-200"><CldImage src={pageImages[0]} alt="Recuerdo" fill sizes="35vw" className="object-cover sepia-[0.15]" /></div>
                        </div>
                      )}
                      
                      <div className="w-full text-center my-4 z-10">
                         <span className="text-[2.2rem] pencil-text">{quote}</span>
                      </div>

                      {pageImages[1] && (
                        <div 
                          className="relative p-2 bg-[#FAFAFA] shadow-[0_10px_20px_rgba(0,0,0,0.3)] transform rotate-2 w-[80%] mx-auto z-20 cursor-pointer hover:scale-105 transition-all"
                          onClick={() => { setIndex(startIndex + 1); setOpen(true); }}
                        >
                          <div className="absolute -bottom-3 -left-3 w-10 h-4 bg-sage-600/40 -rotate-12 washi-tape"></div>
                          <div className="relative w-full aspect-video bg-gray-200"><CldImage src={pageImages[1]} alt="Recuerdo" fill sizes="35vw" className="object-cover sepia-[0.15]" /></div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* === LAYOUT 6: SINGLE TICKET === */}
                  {layout === 'single_ticket' && pageImages[0] && (
                    <div className="relative w-full h-full flex flex-col items-center justify-center">
                      <div className="absolute top-6 left-2 w-36 h-14 bg-[#D15C54] flex items-center justify-between px-2 shadow-[2px_5px_10px_rgba(0,0,0,0.4)] transform -rotate-12 z-20 sticker border border-[#A63C35]" style={{ '--tw-rotate': '-12deg' } as React.CSSProperties}>
                         <div className="w-4 h-full border-r-2 border-[#A63C35] border-dashed"></div>
                         <div className="flex flex-col items-center w-full">
                            <span className="text-[10px] uppercase tracking-[0.2em] text-[#FAFAFA] font-bold opacity-90 drop-shadow-sm">Ticket de Vida</span>
                            <span className="font-serif text-sm text-[#FAFAFA] tracking-widest mt-1">ADMIT ONE</span>
                         </div>
                      </div>

                      <div 
                        className="relative p-4 pb-12 bg-white shadow-[10px_20px_40px_rgba(0,0,0,0.5)] transform rotate-1 w-[85%] mt-12 group cursor-pointer hover:scale-[1.03] transition-all z-10"
                        onClick={() => { setIndex(startIndex); setOpen(true); }}
                      >
                         <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-5 h-5 rounded-full bg-gradient-to-br from-[#222] to-[#000] shadow-[1px_4px_5px_rgba(0,0,0,0.5)] z-30 sticker">
                            <div className="absolute top-1 left-1 w-1.5 h-1.5 bg-white/60 rounded-full blur-[0.5px]"></div>
                            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-[2px] h-3 bg-gray-400 -z-10 shadow-sm"></div>
                         </div>
                         <div className="relative w-full aspect-square bg-gray-100 overflow-hidden border border-black/10"><CldImage src={pageImages[0]} alt="Recuerdo" fill sizes="40vw" className="object-cover sepia-[0.1]" /></div>
                         <span className="absolute bottom-3 right-4 text-2xl pencil-text">Juntos...</span>
                      </div>
                      
                      <p className="text-[2.2rem] mt-12 w-full text-center px-4 leading-none pencil-text">{quote}</p>
                    </div>
                  )}

                </div>
              </Page>
            );
          })}

          {/* Back Cover */}
          <CoverPage>
            <div className="h-full w-full bg-sage-800 flex items-center justify-center relative before:content-[''] before:absolute before:inset-0 before:bg-[url('https://www.transparenttextures.com/patterns/leather.png')] before:opacity-40 shadow-inner">
              
              {/* Protectores de Esquinas Dorados Traseros */}
              <div className="absolute top-0 left-0 w-16 h-16 bg-gradient-to-br from-gold-600 via-gold-500 to-gold-700 shadow-md border-b border-r border-gold-800/50" style={{ clipPath: 'polygon(0 0, 100% 0, 0 100%)' }}></div>
              <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-gold-600 via-gold-500 to-gold-700 shadow-md border-b border-l border-gold-800/50" style={{ clipPath: 'polygon(0 0, 100% 0, 0 100%)' }}></div>
              <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-gold-600 via-gold-500 to-gold-700 shadow-md border-t border-r border-gold-800/50" style={{ clipPath: 'polygon(0 100%, 100% 100%, 0 0)' }}></div>
              <div className="absolute bottom-0 right-0 w-16 h-16 bg-gradient-to-tl from-gold-600 via-gold-500 to-gold-700 shadow-md border-t border-l border-gold-800/50" style={{ clipPath: 'polygon(100% 100%, 0 100%, 100% 0)' }}></div>

              <div className="text-center relative z-10 bg-sage-950/20 p-8 rounded-full border-2 border-gold-500/30 backdrop-blur-sm">
                <div className="w-20 h-20 mx-auto mb-6 border-2 border-gold-400 p-0 rounded-full bg-sage-900/80 shadow-[0_0_15px_rgba(0,0,0,0.5)] overflow-hidden">
                  <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuC1TsBNjZ4sfvSsi7KCvK2jhvvdKCX-4HauXvQswZ5mShDC6-kmS9wi5pw0WXpSdCGNh50FRtgSmZOiEET39GGsLQbAaYDaw1MInkHkBhJoXOz6zWeeK5zcwjn0-vBKQj72f3tHZ7ILIcp12GpBd8rk1DLYDUIWqZt5Sqlj0gkv16TuzEj43zRa_FCbZkEQ4gZYMmJtMVFUya--MWZFtZzbW19WVsfTtgrEzCfRe6JcwXbtWIqIfcO9" alt="Monograma" className="w-full h-full object-contain filter drop-shadow opacity-90 rounded-full" />
                </div>
                <p className="font-serif text-gold-400 text-2xl uppercase tracking-widest font-semibold" style={{ textShadow: "1px 1px 3px rgba(0,0,0,0.5)" }}>Lo mejor</p>
                <p className="font-serif text-cream-200 text-sm uppercase tracking-[0.2em] mt-2 opacity-80">está por venir</p>
              </div>
            </div>
          </CoverPage>
        </HTMLFlipBook>
      </div>

      <Lightbox
        index={index}
        open={open}
        close={() => setOpen(false)}
        slides={slides}
        on={{ view: ({ index: currentIndex }) => setIndex(currentIndex) }}
        styles={{
          container: { 
            backgroundColor: "rgba(0, 0, 0, 0.85)", 
            backdropFilter: "blur(10px)" 
          }
        }}
      />
    </div>
  );
}
