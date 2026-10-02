"use client";

import { useState, useEffect, useRef } from "react";
import RSVPForm from "./RSVPForm";
import Gallery from "./Gallery";
import { Sparkles, MailOpen, Heart, Crown, Calendar, MapPin, Church, Navigation, Info, Check, GlassWater, MailCheck, Ticket, Volume2, VolumeX } from "lucide-react";
import { CldImage } from "next-cloudinary";

interface Invitado {
  id: string;
  nombre: string;
  pases: number;
  confirmado: boolean;
  mensaje_personalizado?: string;
}

export default function InvitationClient({ invitado, fechaLimite }: { invitado: Invitado, fechaLimite: string }) {
  const [opened, setOpened] = useState(false);
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  const [scrollY, setScrollY] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const toggleAudio = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(e => console.log(e));
      }
      setIsPlaying(!isPlaying);
    }
  };

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  // Inicializar audio
  useEffect(() => {
    const audioUrl = `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/video/upload/q_auto,f_auto/All_of_Me_-_John_Legend_Daniele_Vitale_Saxophone_Cover_punaye`;
    // Creamos el elemento y evitamos que cargue de inmediato todo el archivo para optimizar
    audioRef.current = new Audio(audioUrl);
    audioRef.current.loop = true;

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!opened) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
      
      // Iniciar el audio desde el segundo 3
      if (audioRef.current) {
        audioRef.current.currentTime = 3;
        audioRef.current.volume = 0; // Inicia muteado para el fade-in
        
        audioRef.current.play().then(() => {
          setIsPlaying(true);
          // Fade in progresivo hasta volumen suave (ej. 0.4)
          let vol = 0;
          const targetVol = 0.4;
          const fadeInterval = setInterval(() => {
            if (vol < targetVol) {
              vol += 0.05;
              if (vol > targetVol) vol = targetVol;
              if (audioRef.current) audioRef.current.volume = vol;
            } else {
              clearInterval(fadeInterval);
            }
          }, 250);
        }).catch(err => {
          console.log("Audio autoplay prevented or failed:", err);
        });
      }
    }
    return () => document.body.classList.remove('overflow-hidden');
  }, [opened]);

  const [year, month, day] = fechaLimite.split('-');
  const meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
  const formattedLimite = `${parseInt(day)} de ${meses[parseInt(month) - 1]} de ${year}`;
  // Aseguramos la comparación con el final del día en hora local aproximada
  const isExpired = new Date() > new Date(`${fechaLimite}T23:59:59`);

  useEffect(() => {
    const targetDate = new Date('2026-11-14T16:00:00').getTime();
    const updateTimer = () => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance > 0) {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000)
        });
      }
    };
    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {/* 1. OVERLAY DE APERTURA / BIENVENIDA */}
      <div 
        className={`fixed inset-0 z-50 flex items-center justify-center transition-all duration-1000 ease-out bg-sage-950/70 backdrop-blur-md px-4 sm:px-6 ${opened ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
      >
        <div className="absolute inset-0 z-0 overflow-hidden">
          <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuBRpp38nJipGNbEWOP5i4oqHnL-Jqz9mCdHSJ2wCtEh9C-v0Q1AQMSMZYiUTfeSVLcSPVQKSaKSD7wsukUnnnvqwjPRZRkWf-WAmQE_RBJkFmeZtK0JZvsF51NoOpv0HDJBMt8N46KPjDWABxLbqG6zEWo4RI-LFILPbP-tZTDcn5SZ_o7w06_00I_HXLGqLzrMoU8Ia_ijvzV5IDHlKe1JV0xjgpiNW4DEj6ryKyRTSDWeNst-XEyB" alt="Ervin & Sindy Fondo" className="w-full h-full object-cover object-center scale-105 filter blur-sm opacity-40 brightness-75" fetchPriority="high" />
          <div className="absolute inset-0 bg-gradient-to-t from-sage-950/90 via-sage-900/60 to-sage-950/80"></div>
        </div>

        <div className="relative z-10 w-full max-w-xl p-8 sm:p-12 rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-glass-dark text-center text-white transform transition-all duration-700">
          <div className="w-24 h-24 sm:w-28 sm:h-28 mx-auto mb-6 relative flex items-center justify-center p-0 rounded-full border border-gold-300/40 bg-sage-900/40 shadow-inner overflow-hidden">
            <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuC1TsBNjZ4sfvSsi7KCvK2jhvvdKCX-4HauXvQswZ5mShDC6-kmS9wi5pw0WXpSdCGNh50FRtgSmZOiEET39GGsLQbAaYDaw1MInkHkBhJoXOz6zWeeK5zcwjn0-vBKQj72f3tHZ7ILIcp12GpBd8rk1DLYDUIWqZt5Sqlj0gkv16TuzEj43zRa_FCbZkEQ4gZYMmJtMVFUya--MWZFtZzbW19WVsfTtgrEzCfRe6JcwXbtWIqIfcO9" alt="Monograma Ervin & Sindy" className="w-full h-full object-cover filter drop-shadow-md rounded-full" />
          </div>

          <p className="text-xs uppercase tracking-[0.35em] text-gold-300 font-medium mb-3">Nuestra Boda Soñada</p>
          
          <h1 className="font-serif text-4xl sm:text-5xl font-medium tracking-tight text-white mb-2">
            Ervin <span className="font-script text-4xl sm:text-5xl text-gold-300 mx-1">&amp;</span> Sindy
          </h1>
          
          <div className="flex items-center justify-center gap-3 my-5 opacity-75">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-gold-400"></div>
            <Sparkles className="w-4 h-4 text-gold-300" />
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-gold-400"></div>
          </div>

          <div className="inline-block px-5 py-2.5 rounded-full bg-white/10 border border-white/15 backdrop-blur-md mb-8">
            <p className="text-xs text-cream-200 tracking-wider uppercase font-medium">Invitación especial para:</p>
            <p className="text-lg sm:text-xl font-serif text-white font-semibold mt-0.5 tracking-wide">{invitado.nombre}</p>
          </div>

          <p className="text-sm sm:text-base text-cream-100/90 font-cormorant text-lg italic max-w-md mx-auto mb-8 font-normal leading-relaxed">
            "{invitado.mensaje_personalizado || 'El amor no se mira con los ojos, sino con el alma. Nos llena de inmensa dicha compartir este momento sagrado con ustedes.'}"
          </p>

          <button 
            onClick={() => {
              window.scrollTo(0, 0);
              setOpened(true);
            }}
            className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-gold-500 via-gold-400 to-gold-600 text-sage-950 font-semibold text-sm uppercase tracking-widest hover:brightness-110 active:scale-95 transition-all duration-300 shadow-xl shadow-gold-500/20"
          >
            <span>Abrir Invitación</span>
            <MailOpen className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
          </button>

          <div className="mt-6 text-[11px] text-cream-300/60 uppercase tracking-widest font-light">
            14 de Noviembre de 2026
          </div>
        </div>
      </div>

      {/* 2. NAVBAR SUPERIOR FIJO */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-white/75 backdrop-blur-md border-b border-sage-100 transition-all duration-300">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-18 py-3 flex items-center justify-between">
          <a href="#hero" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-full border border-gold-300/60 p-0 overflow-hidden bg-sage-50/50">
              <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuC1TsBNjZ4sfvSsi7KCvK2jhvvdKCX-4HauXvQswZ5mShDC6-kmS9wi5pw0WXpSdCGNh50FRtgSmZOiEET39GGsLQbAaYDaw1MInkHkBhJoXOz6zWeeK5zcwjn0-vBKQj72f3tHZ7ILIcp12GpBd8rk1DLYDUIWqZt5Sqlj0gkv16TuzEj43zRa_FCbZkEQ4gZYMmJtMVFUya--MWZFtZzbW19WVsfTtgrEzCfRe6JcwXbtWIqIfcO9" alt="Logo" className="w-full h-full object-cover rounded-full" />
            </div>
            <div>
              <span className="font-serif text-lg tracking-wider font-semibold text-sage-900 group-hover:text-gold-600 transition-colors">Ervin & Sindy</span>
              <span className="block text-[10px] uppercase tracking-[0.2em] text-sage-500 font-medium">14 • 11 • 2026</span>
            </div>
          </a>
          <nav className="hidden md:flex items-center gap-7 text-xs uppercase tracking-[0.18em] font-medium text-sage-700">
            <a href="#hero" className="hover:text-gold-600 transition-colors">Inicio</a>
            <a href="#cuenta-regresiva" className="hover:text-gold-600 transition-colors">Cuenta Regresiva</a>
            <a href="#itinerario" className="hover:text-gold-600 transition-colors">Ubicación</a>
            <a href="#dresscode" className="hover:text-gold-600 transition-colors">Dress Code</a>
            <a href="#galeria" className="hover:text-gold-600 transition-colors">Galería</a>
          </nav>
          <div className="flex items-center gap-3">
            <a href="#rsvp" className="inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-full bg-sage-800 text-cream-50 hover:bg-sage-700 text-[10px] sm:text-xs uppercase tracking-widest font-semibold transition-all shadow-sm">
              <span className="hidden sm:inline">Confirmar Invitación</span>
              <span className="sm:hidden">Confirmar</span>
              <Check className="w-3.5 h-3.5 text-gold-400" />
            </a>
          </div>
        </div>
      </header>

      <main className="pt-20">
        {/* HERO */}
        <section id="hero" className="relative min-h-[92vh] flex items-center justify-center py-16 px-4 sm:px-6 bg-cream-50 overflow-hidden">
          {/* Background image fading on scroll */}
          <div 
            className="absolute inset-0 z-0 bg-cover bg-top bg-no-repeat transition-opacity duration-75"
            style={{ 
              backgroundImage: "url('https://res.cloudinary.com/rxjxlozd/image/upload/q_auto,f_auto,w_1600/FOTO_13_uxsga6')",
              opacity: Math.max(0, 0.85 - scrollY / 1000) 
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-cream-100/10 via-cream-100/40 to-cream-50"></div>
          </div>
          
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-sage-200/30 rounded-full filter blur-3xl pointer-events-none z-0"></div>
          <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-gold-200/20 rounded-full filter blur-3xl pointer-events-none z-0"></div>
          
          <div className="max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10">
            <div className="lg:col-span-6 lg:pr-10 text-center lg:text-left order-2 lg:order-1">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-sage-100 border border-sage-200/70 text-sage-800 text-xs uppercase tracking-[0.2em] font-semibold mb-6">
                <Heart className="w-3.5 h-3.5 text-gold-600 fill-gold-500" />
                <span>Nos Casamos</span>
              </div>
              <h1 className="font-serif text-5xl sm:text-6xl xl:text-7xl font-light text-sage-950 leading-[1.08] mb-4">
                Ervin <br />
                <span className="font-script text-5xl sm:text-6xl text-gold-500 font-normal pl-3">&amp;</span> Sindy
              </h1>
              <div className="h-1 w-20 bg-gold-400 my-6 mx-auto lg:mx-0 rounded-full"></div>
              <p className="font-cormorant text-xl sm:text-2xl text-sage-800 italic leading-relaxed mb-8 max-w-lg mx-auto lg:mx-0 font-normal">
                "Con la bendición de Dios y el amor de nuestras familias, tenemos el inmenso honor de invitarte a celebrar la unión de nuestras vidas en sagrado matrimonio."
              </p>

              <div className="p-6 rounded-2xl bg-white/80 border border-sage-200/80 shadow-sm backdrop-blur-sm mb-8">
                <p className="text-xs uppercase tracking-[0.25em] text-gold-600 font-bold mb-4 flex items-center justify-center lg:justify-start gap-2">
                  <Crown className="w-3.5 h-3.5" />
                  Junto con nuestros amados padres
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-sm text-sage-900">
                  <div className="border-l-2 border-sage-200 pl-3 text-left">
                    <span className="block text-xs uppercase tracking-wider text-sage-500 font-semibold mb-1">Padres del Novio</span>
                    <p className="font-serif font-medium text-[15px] sm:text-base text-sage-950 whitespace-nowrap tracking-tight">Sr. Eward Alexander López</p>
                    <p className="font-serif font-medium text-[15px] sm:text-base text-sage-950 whitespace-nowrap tracking-tight">Sra. Jenifer Johana Guzmán</p>
                  </div>
                  <div className="border-l-2 border-gold-300 pl-3 text-left">
                    <span className="block text-xs uppercase tracking-wider text-sage-500 font-semibold mb-1">Padres de la Novia</span>
                    <p className="font-serif font-medium text-[15px] sm:text-base text-sage-950 whitespace-nowrap tracking-tight">Sr. Roy Alfredo Salazar Donis</p>
                    <p className="font-serif font-medium text-[15px] sm:text-base text-sage-950 whitespace-nowrap tracking-tight">Sra. Evanelia Albanes Villeda</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 text-sm text-sage-700">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-sage-100 flex items-center justify-center text-sage-800">
                    <Calendar className="w-4 h-4 text-gold-600" />
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-sage-900 leading-tight">Sábado, 14 Noviembre 2026</p>
                    <p className="text-xs text-sage-500">16:00 Horas (Hora local)</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 lg:col-start-8 order-1 lg:order-2">
              <div className="relative max-w-sm sm:max-w-md mx-auto ml-auto lg:mr-0 lg:ml-auto">
                <div className="absolute -inset-3 rounded-[2.5rem] border border-gold-300/70 pointer-events-none"></div>
                <div className="absolute -inset-1.5 rounded-[2.5rem] bg-sage-200/50 pointer-events-none"></div>
                <div className="relative rounded-[2rem] overflow-hidden shadow-2xl border-4 border-white aspect-[4/5]">
                  <CldImage src="FOTO_12_kg5r5x" width={800} height={1000} crop="fill" alt="Ervin y Sindy" className="w-full h-full object-cover object-bottom scale-[1.15] hover:scale-[1.20] transition-transform duration-700 ease-out" />
                  <div className="absolute bottom-5 left-5 right-5 p-4 rounded-2xl bg-white/85 backdrop-blur-md border border-white/60 shadow-lg flex items-center justify-between text-left">
                    <div>
                      <p className="text-[11px] uppercase tracking-[0.2em] text-sage-600 font-semibold">Gran Celebración</p>
                      <p className="font-serif text-lg font-bold text-sage-900">14 de Noviembre de 2026</p>
                    </div>
                    <div className="w-11 h-11 rounded-full bg-sage-800 text-gold-400 flex items-center justify-center font-serif text-sm font-semibold">
                      E&amp;S
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* COUNTDOWN */}
        <section id="cuenta-regresiva" className="py-16 px-4 sm:px-6 bg-sage-900 text-cream-50 relative overflow-hidden">
          <div className="absolute inset-0 opacity-20 bg-center bg-cover pointer-events-none mix-blend-screen" style={{ backgroundImage: "url('/images/gold_roots_leaves.jpg')" }}></div>
          <div className="max-w-4xl mx-auto text-center relative z-10">
            <p className="text-xs uppercase tracking-[0.3em] text-gold-400 font-semibold mb-3">Cada segundo cuenta</p>
            <h2 className="font-serif text-3xl sm:text-4xl text-white font-medium mb-3">Esperando el Gran Día</h2>
            <p className="text-sm sm:text-base text-sage-200 font-cormorant italic max-w-lg mx-auto mb-10">
              La cuenta regresiva hacia el comienzo de nuestra nueva historia juntos.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 max-w-2xl mx-auto">
              <div className="p-5 sm:p-6 rounded-2xl bg-sage-800/80 border border-gold-400/20 backdrop-blur-sm shadow-xl flex flex-col items-center">
                <span className="font-serif text-4xl sm:text-5xl font-bold text-gold-300 leading-none">{String(timeLeft.days).padStart(2, '0')}</span>
                <span className="text-xs uppercase tracking-[0.2em] text-sage-300 font-medium mt-3">Días</span>
              </div>
              <div className="p-5 sm:p-6 rounded-2xl bg-sage-800/80 border border-gold-400/20 backdrop-blur-sm shadow-xl flex flex-col items-center">
                <span className="font-serif text-4xl sm:text-5xl font-bold text-gold-300 leading-none">{String(timeLeft.hours).padStart(2, '0')}</span>
                <span className="text-xs uppercase tracking-[0.2em] text-sage-300 font-medium mt-3">Horas</span>
              </div>
              <div className="p-5 sm:p-6 rounded-2xl bg-sage-800/80 border border-gold-400/20 backdrop-blur-sm shadow-xl flex flex-col items-center">
                <span className="font-serif text-4xl sm:text-5xl font-bold text-gold-300 leading-none">{String(timeLeft.minutes).padStart(2, '0')}</span>
                <span className="text-xs uppercase tracking-[0.2em] text-sage-300 font-medium mt-3">Minutos</span>
              </div>
              <div className="p-5 sm:p-6 rounded-2xl bg-sage-800/80 border border-gold-400/20 backdrop-blur-sm shadow-xl flex flex-col items-center">
                <span className="font-serif text-4xl sm:text-5xl font-bold text-gold-300 leading-none">{String(timeLeft.seconds).padStart(2, '0')}</span>
                <span className="text-xs uppercase tracking-[0.2em] text-sage-300 font-medium mt-3">Segundos</span>
              </div>
            </div>
          </div>
        </section>

        {/* DETAILS */}
        <section id="itinerario" className="py-20 px-4 sm:px-6 bg-cream-50 relative">
          <div className="max-w-5xl mx-auto">
            <div className="text-center max-w-xl mx-auto mb-14">
              <p className="text-xs uppercase tracking-[0.3em] text-sage-600 font-semibold mb-2">Dónde & Cuándo</p>
              <h2 className="font-serif text-3xl sm:text-4xl text-sage-950 font-medium mb-3">Detalles del Evento</h2>
              <div className="h-0.5 w-16 bg-gold-400 mx-auto rounded-full mb-4"></div>
              <p className="text-sage-700 text-sm sm:text-base font-cormorant italic">
                Hemos preparado cada detalle con amor para que vivamos juntos una experiencia inolvidable.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
              <div className="rounded-3xl bg-white p-8 border border-sage-200/80 shadow-luxury flex flex-col justify-between relative overflow-hidden group hover:border-gold-300 transition-all duration-300 text-left">
                <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-sage-600 to-sage-800"></div>
                <div>
                  <div className="w-14 h-14 rounded-2xl bg-sage-50 border border-sage-100 flex items-center justify-center text-sage-800 mb-6 group-hover:bg-gold-50 group-hover:text-gold-700 transition-colors">
                    <Church className="w-7 h-7" />
                  </div>
                  <div className="inline-block px-3 py-1 rounded-full bg-sage-100 text-sage-800 text-[11px] uppercase tracking-wider font-semibold mb-3">
                    16:00 Hrs • Ceremonia Sagrada
                  </div>
                  <h3 className="font-serif text-2xl text-sage-950 font-semibold mb-2">Ceremonia Religiosa</h3>
                  <p className="text-xs uppercase tracking-widest text-gold-600 font-bold mb-4">Parroquia San Carlos Borromeo</p>
                  <p className="text-sm text-sage-700 leading-relaxed mb-6">
                    La celebración del sacramento del matrimonio. Les rogamos llegar con 20 minutos de anticipación.
                  </p>
                  <div className="bg-cream-100 p-4 rounded-2xl border border-cream-300 mb-6 flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-gold-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="block text-xs uppercase tracking-wider text-sage-500 font-semibold">Ubicación:</span>
                      <p className="text-xs sm:text-sm font-medium text-sage-900">Parroquia San Carlos Borromeo</p>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 w-full">
                  <a href="https://maps.app.goo.gl/ojDTM1piKho9H6Mu5" target="_blank" rel="noopener noreferrer" className="flex-1 inline-flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-sage-800 hover:bg-sage-900 text-cream-50 text-[11px] sm:text-xs uppercase tracking-widest font-semibold transition-all shadow-sm">
                    <MapPin className="w-4 h-4 text-gold-400" />
                    <span>Google Maps</span>
                  </a>
                  <a href="https://waze.com/ul?ll=14.5743262,-90.5658081&navigate=yes" target="_blank" rel="noopener noreferrer" className="flex-1 inline-flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-sage-800 hover:bg-sage-900 text-cream-50 text-[11px] sm:text-xs uppercase tracking-widest font-semibold transition-all shadow-sm">
                    <Navigation className="w-4 h-4 text-gold-400" />
                    <span>Waze</span>
                  </a>
                </div>
              </div>

              <div className="rounded-3xl bg-white p-8 border border-sage-200/80 shadow-luxury flex flex-col justify-between relative overflow-hidden group hover:border-gold-300 transition-all duration-300 text-left">
                <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-gold-400 to-gold-600"></div>
                <div>
                  <div className="w-14 h-14 rounded-2xl bg-gold-50 border border-gold-200 flex items-center justify-center text-gold-700 mb-6 group-hover:bg-sage-50 group-hover:text-sage-800 transition-colors">
                    <GlassWater className="w-7 h-7" />
                  </div>
                  <div className="inline-block px-3 py-1 rounded-full bg-gold-100 text-gold-800 text-[11px] uppercase tracking-wider font-semibold mb-3">
                    18:00 Hrs • Recepción
                  </div>
                  <h3 className="font-serif text-2xl text-sage-950 font-semibold mb-2">Recepción & Fiesta</h3>
                  <p className="text-xs uppercase tracking-widest text-gold-600 font-bold mb-4">Jardín de Recepción</p>
                  <p className="text-sm text-sage-700 leading-relaxed mb-6">
                    Aquí celebraremos nuestra recepción y fiesta. ¡Acompáñanos a disfrutar de este gran día!
                  </p>
                  <div className="bg-cream-100 p-4 rounded-2xl border border-cream-300 mb-6 flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-gold-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="block text-xs uppercase tracking-wider text-sage-500 font-semibold">Ubicación:</span>
                      <p className="text-xs sm:text-sm font-medium text-sage-900">Ver ubicación en el mapa</p>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 w-full">
                  <a href="https://maps.app.goo.gl/8JixdeHjAaXXHzS3A" target="_blank" rel="noopener noreferrer" className="flex-1 inline-flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-sage-800 hover:bg-sage-900 text-cream-50 text-[11px] sm:text-xs uppercase tracking-widest font-semibold transition-all shadow-sm">
                    <MapPin className="w-4 h-4 text-gold-400" />
                    <span>Google Maps</span>
                  </a>
                  <a href="https://waze.com/ul?ll=14.5873965,-90.5946494&navigate=yes" target="_blank" rel="noopener noreferrer" className="flex-1 inline-flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-sage-800 hover:bg-sage-900 text-cream-50 text-[11px] sm:text-xs uppercase tracking-widest font-semibold transition-all shadow-sm">
                    <Navigation className="w-4 h-4 text-gold-400" />
                    <span>Waze</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* DRESS CODE */}
        <section id="dresscode" className="py-16 px-4 sm:px-6 bg-cream-100/70 border-y border-sage-100">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-sage-800 text-gold-400 mb-4 shadow-sm">
              <Sparkles className="w-6 h-6" />
            </div>
            <p className="text-xs uppercase tracking-[0.3em] text-sage-600 font-semibold mb-2">Etiqueta & Estilo</p>
            <h2 className="font-serif text-3xl sm:text-4xl text-sage-950 font-medium mb-3">Código de Vestimenta</h2>
            <div className="max-w-xl mx-auto bg-cream-200 p-8 rounded-3xl border border-cream-300 shadow-md text-center">
              {/* Imagen de referencia de vestimenta */}
              <div className="relative w-48 h-48 mx-auto mb-6 rounded-2xl overflow-hidden shadow-inner border border-cream-300 bg-white">
                <img src="/images/formal_attire.jpg?v=3" alt="Vestimenta Formal Outline" className="w-full h-full object-cover mix-blend-multiply opacity-80" />
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="p-4 rounded-2xl bg-sage-800 border border-sage-700 shadow-md">
                  <span className="block text-xs uppercase tracking-widest text-cream-200/80 font-semibold mb-1">Caballeros</span>
                  <p className="text-xl font-serif text-gold-400 font-medium italic">Formal</p>
                </div>
                <div className="p-4 rounded-2xl bg-sage-800 border border-sage-700 shadow-md">
                  <span className="block text-xs uppercase tracking-widest text-cream-200/80 font-semibold mb-1">Damas</span>
                  <p className="text-xl font-serif text-gold-400 font-medium italic">Formal</p>
                </div>
              </div>
              
              <div className="mt-6 inline-flex items-start sm:items-center gap-3 p-4 rounded-xl bg-gold-50/50 border border-gold-200/60 text-gold-900 text-sm text-left sm:text-center justify-center w-full shadow-sm">
                <Info className="w-5 h-5 text-gold-600 shrink-0 mt-0.5 sm:mt-0" />
                <span className="font-medium leading-snug">La ilustración es de referencia, pero sí deseamos que la vestimenta sea <strong>formal</strong> para acompañarnos el día del evento.</span>
              </div>
            </div>
          </div>
        </section>

        {/* GALLERY */}
        <section id="galeria" className="py-20 px-4 sm:px-6 bg-cream-50">
          <div className="max-w-6xl mx-auto">
            <div className="text-center max-w-xl mx-auto mb-12">
              <p className="text-xs uppercase tracking-[0.3em] text-sage-600 font-semibold mb-2">Recuerdos Inolvidables</p>
              <h2 className="font-serif text-3xl sm:text-4xl text-sage-950 font-medium mb-3">Nuestros Momentos</h2>
              <div className="h-0.5 w-16 bg-gold-400 mx-auto rounded-full mb-3"></div>
              <p className="text-sage-700 text-sm font-cormorant italic">
                Haz clic en cualquier imagen para abrir el visor interactivo de pantalla completa (lightbox).
              </p>
            </div>
            
            <Gallery 
              images={[
                "FOTO_1_knwxkj",
                "FOTO_2_oqxej3",
                "FOTO_3_k7sqtr",
                "FOTO_4_tu0gfj",
                "FOTO_5_ewtzvt",
                "FOTO_8_pppvkz",
                "FOTO_9_j21mhr",
                "FOTO_10_k4zmhk",
                "FOTO_11_neglmw",
                "FOTO_13_uxsga6",
                "FOTO_18_kbfic0",
                "FOTO_15_cgsk0o",
                "FOTO_16_tt4fum",
                "FOTO_17_h4ymbx",
                "FOTO_14_fneefh"
              ]} 
            />
          </div>
        </section>

        {/* RSVP FORM */}
        <section id="rsvp" className="py-20 px-4 sm:px-6 bg-gradient-to-b from-cream-50 via-sage-50 to-sage-100 relative">
          <div className="max-w-3xl mx-auto">
            <div className="rounded-3xl bg-white/90 backdrop-blur-xl p-8 sm:p-12 border border-sage-200 shadow-2xl relative overflow-hidden">
              <div className="absolute -right-12 -bottom-12 w-64 h-64 opacity-5 pointer-events-none overflow-hidden rounded-full">
                <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuC1TsBNjZ4sfvSsi7KCvK2jhvvdKCX-4HauXvQswZ5mShDC6-kmS9wi5pw0WXpSdCGNh50FRtgSmZOiEET39GGsLQbAaYDaw1MInkHkBhJoXOz6zWeeK5zcwjn0-vBKQj72f3tHZ7ILIcp12GpBd8rk1DLYDUIWqZt5Sqlj0gkv16TuzEj43zRa_FCbZkEQ4gZYMmJtMVFUya--MWZFtZzbW19WVsfTtgrEzCfRe6JcwXbtWIqIfcO9" alt="watermark" className="w-full h-full object-cover rounded-full" />
              </div>

              <div className="text-center mb-8">
                <div className="w-14 h-14 rounded-full bg-gold-50 border border-gold-300/60 mx-auto flex items-center justify-center text-gold-600 mb-4">
                  <MailCheck className="w-7 h-7" />
                </div>
                <p className="text-xs uppercase tracking-[0.3em] text-sage-600 font-semibold mb-2">Confirmación de Asistencia</p>
                <h2 className="font-serif text-3xl sm:text-4xl text-sage-950 font-medium mb-3">¿Nos Acompañas?</h2>
                
                <div className="p-4 rounded-2xl bg-cream-50 border border-sage-200/80 my-4 inline-block max-w-lg">
                  <p className="text-xs uppercase tracking-wider text-sage-500 font-semibold">Estimada / Estimado:</p>
                  <h3 className="font-serif text-xl sm:text-2xl text-sage-950 font-semibold mt-0.5">{invitado.nombre}</h3>
                  <p className="text-xs text-sage-700 mt-2 font-cormorant text-base italic leading-snug">
                    "Nos haría inmensamente felices contar con su presencia en la celebración del inicio de nuestro hogar."
                  </p>
                </div>

                <div className="mt-4 flex items-center justify-center gap-2">
                  <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-sage-800 text-cream-50 text-xs sm:text-sm font-semibold tracking-wide shadow-md">
                    <Ticket className="w-4 h-4 text-gold-400" />
                    <span>Pases Reservados Asignados: <strong className="text-gold-300 text-base font-bold ml-1">{invitado.pases} Pases</strong></span>
                  </span>
                </div>
                
                <p className="text-[11px] text-sage-500 uppercase tracking-widest mt-2">Por favor responder antes del {formattedLimite}</p>
              </div>
              <RSVPForm 
                id={invitado.id} 
                inicialConfirmado={invitado.confirmado} 
                nombre={invitado.nombre} 
                pases={invitado.pases} 
                isExpired={isExpired}
              />
            </div>
          </div>
        </section>

      </main>

      {/* FOOTER */}
      <footer className="bg-sage-950 text-cream-100 py-16 px-4 sm:px-6 text-center border-t border-gold-400/20">
        <div className="max-w-2xl mx-auto flex flex-col items-center">
          <div className="w-16 h-16 rounded-full border border-gold-400/40 p-0 mb-4 bg-sage-900/50 overflow-hidden shadow-inner">
            <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuC1TsBNjZ4sfvSsi7KCvK2jhvvdKCX-4HauXvQswZ5mShDC6-kmS9wi5pw0WXpSdCGNh50FRtgSmZOiEET39GGsLQbAaYDaw1MInkHkBhJoXOz6zWeeK5zcwjn0-vBKQj72f3tHZ7ILIcp12GpBd8rk1DLYDUIWqZt5Sqlj0gkv16TuzEj43zRa_FCbZkEQ4gZYMmJtMVFUya--MWZFtZzbW19WVsfTtgrEzCfRe6JcwXbtWIqIfcO9" alt="Ervin & Sindy Emblem" className="w-full h-full object-cover filter drop-shadow rounded-full" />
          </div>
          <h2 className="font-serif text-3xl font-light text-white mb-1">Ervin &amp; Sindy</h2>
          <p className="text-xs uppercase tracking-[0.3em] text-gold-400 font-medium mb-6">14 de Noviembre de 2026 • Para Siempre</p>
          <div className="h-px w-24 bg-gradient-to-r from-transparent via-gold-400 to-transparent mb-6"></div>
          <p className="font-cormorant text-lg italic text-cream-200/80 max-w-md mx-auto mb-8 font-light">
            "El amor nunca deja de ser." — 1 Corintios 13:8
          </p>
          <div className="flex items-center gap-6 text-xs text-cream-300/60 uppercase tracking-widest">
            <span>#BodaErvinYSindy</span>
          </div>
        </div>
      </footer>

      {opened && (
        <button 
          onClick={toggleAudio}
          className="fixed bottom-6 right-6 z-50 p-3 rounded-full bg-sage-800/90 text-gold-300 shadow-lg shadow-black/20 backdrop-blur hover:bg-sage-900 transition-colors"
          aria-label={isPlaying ? "Pausar música" : "Reproducir música"}
        >
          {isPlaying ? <Volume2 className="w-6 h-6" /> : <VolumeX className="w-6 h-6" />}
        </button>
      )}
    </>
  );
}
