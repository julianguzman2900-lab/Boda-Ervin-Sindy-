import Link from "next/link";
import { Cormorant_Garamond } from "next/font/google";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-ivory">
      <div className="border border-gold/30 bg-white/70 backdrop-blur-sm p-12 rounded-[28px] shadow-[0_16px_46px_rgba(35,38,32,0.1)] max-w-lg w-full animate-fade-in">
        <h1 className="font-serif text-4xl md:text-5xl text-olive mb-6">Lo sentimos</h1>
        <div className="w-16 h-px bg-gradient-to-r from-transparent via-gold to-transparent mx-auto mb-6"></div>
        <p className="text-lg text-ink/80 mb-8 font-light">
          La invitación no fue encontrada o el enlace no es válido.
        </p>
        <Link 
          href="/"
          className="inline-flex items-center justify-center px-6 py-3 rounded-full border border-olive/30 bg-white/80 text-olive uppercase tracking-widest text-xs font-semibold hover:bg-olive hover:text-white transition-all duration-300 shadow-sm"
        >
          Volver al inicio
        </Link>
      </div>
    </div>
  );
}
