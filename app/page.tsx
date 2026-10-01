import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-sage-50">
      <div className="border border-gold-300/30 bg-white/70 backdrop-blur-sm p-12 rounded-[32px] shadow-sm max-w-lg w-full animate-fade-in">
        <Link href="/admin" className="uppercase tracking-[0.26em] text-[0.72rem] font-semibold text-sage-600 mb-4 block hover:text-gold-500 transition-colors">
          Nuestra Boda
        </Link>
        <h1 className="font-serif text-5xl text-sage-900 mb-6">Ervin & Sindy</h1>
        <div className="w-16 h-px bg-gradient-to-r from-transparent via-gold-400 to-transparent mx-auto mb-6"></div>
        <p className="text-lg text-sage-700/80 mb-8 font-light">
          Por favor, utiliza el enlace personalizado que te hemos enviado para ver tu invitación.
        </p>
      </div>
    </div>
  );
}
