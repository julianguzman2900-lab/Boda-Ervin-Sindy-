"use client";

import { useState } from "react";
import { createBrowserSupabaseClient } from "@/lib/supabase";
import { Smile, HeartCrack, Send, CheckCircle2 } from "lucide-react";

interface RSVPFormProps {
  id: string;
  inicialConfirmado: boolean | null;
  nombre: string;
  pases: number;
}

export default function RSVPForm({ id, inicialConfirmado, nombre, pases }: RSVPFormProps) {
  const [attendance, setAttendance] = useState(inicialConfirmado === true ? "confirmed" : inicialConfirmado === false ? "declined" : "confirmed");
  const [guestMessage, setGuestMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const supabase = createBrowserSupabaseClient();

  const handleConfirmar = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      // Actualizar a través de la API segura para saltar el bloqueo (RLS)
      const res = await fetch('/api/invitados', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id,
          confirmado: attendance === 'confirmed',
          mensaje_personalizado: guestMessage.trim() !== "" ? guestMessage.trim() : null
        })
      });

      const result = await res.json();

      if (result.error) {
        throw new Error(result.error);
      }
      
      setSuccess(true);
      
      if (attendance === "confirmed") {
        const mensaje = `¡Hola Ervin y Sindy! ✨\nSoy *${nombre}* y me emociona confirmar mi asistencia a su boda.\n\n🎟️ *Pases confirmados:* ${pases}`;
        const telefonoWhatsApp = "50259482876"; 
        const whatsappUrl = `https://wa.me/${telefonoWhatsApp}?text=${encodeURIComponent(mensaje)}`;
        window.location.href = whatsappUrl;
      }
    } catch (err: any) {
      console.error("Error completo:", err);
      // Extraemos el mensaje real del error de Supabase
      const msg = err?.message || err?.details || JSON.stringify(err);
      setError(`Error al guardar en base de datos: ${msg}`);
    } finally {
      setLoading(false);
    }
  };

  if (inicialConfirmado !== null && !success) {
    return (
      <div className={`mt-8 p-6 rounded-2xl border text-center animate-fade-in ${inicialConfirmado ? 'bg-emerald-50 border-emerald-200 text-emerald-900' : 'bg-red-50 border-red-200 text-red-900'}`}>
        {inicialConfirmado ? (
          <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto mb-3" />
        ) : (
          <HeartCrack className="w-10 h-10 text-red-500 mx-auto mb-3" />
        )}
        <h4 className="font-serif font-bold text-xl mb-1">
          {inicialConfirmado ? "¡Asistencia Confirmada!" : "Asistencia Declinada"}
        </h4>
        <p className="text-sm opacity-80 mt-2 max-w-sm mx-auto">
          {inicialConfirmado 
            ? "Tu respuesta ya está registrada. ¡Nos emociona mucho compartir este día contigo!" 
            : "Lamentamos que no puedas acompañarnos, pero agradecemos tu respuesta."}
        </p>
      </div>
    );
  }

  if (success) {
    return (
      <div className={`mt-8 p-6 rounded-2xl border text-center animate-fade-in ${attendance === 'confirmed' ? 'bg-emerald-50 border-emerald-200 text-emerald-900' : 'bg-red-50 border-red-200 text-red-900'}`}>
        {attendance === 'confirmed' ? (
          <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto mb-3" />
        ) : (
          <HeartCrack className="w-10 h-10 text-red-500 mx-auto mb-3" />
        )}
        <h4 className="font-serif font-bold text-xl mb-1">
          {attendance === 'confirmed' ? "¡Confirmación Guardada con Éxito!" : "¡Respuesta Registrada!"}
        </h4>
        <p className="text-sm opacity-80 mt-2 max-w-sm mx-auto">
          {attendance === 'confirmed' 
            ? "Gracias por tu respuesta. Ha sido registrada exitosamente. ¡Nos vemos muy pronto!" 
            : "Lamentamos que no puedas acompañarnos, gracias por notificarnos."}
        </p>
      </div>
    );
  }

  return (
    <form className="space-y-6 mt-8" onSubmit={handleConfirmar}>
      {error && (
        <p className="text-red-500 text-sm mb-4 text-center">{error}</p>
      )}

      {/* Decisión de Asistencia */}
      <div>
        <label className="block text-xs uppercase tracking-wider text-sage-700 font-bold mb-3 text-center sm:text-left">
          Confirmación de Asistencia *
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <label className={`relative flex items-center p-4 rounded-2xl border-2 cursor-pointer transition-all ${attendance === 'confirmed' ? 'border-sage-800 bg-sage-50/70 shadow-md' : 'border-sage-200 bg-white hover:border-sage-500'}`}>
            <input 
              type="radio" 
              name="attendance" 
              value="confirmed" 
              checked={attendance === "confirmed"}
              onChange={() => setAttendance("confirmed")}
              className="w-4 h-4 text-sage-800 focus:ring-sage-600 border-gray-300"
            />
            <div className="ml-3 flex items-center gap-2">
              <Smile className="w-5 h-5 text-sage-700" />
              <div className="text-left">
                <span className="block text-sm font-semibold text-sage-950">¡Sí, allí estaré!</span>
                <span className="block text-xs text-sage-500">Con alegría celebro junto a ustedes</span>
              </div>
            </div>
          </label>

          <label className={`relative flex items-center p-4 rounded-2xl border-2 cursor-pointer transition-all ${attendance === 'declined' ? 'border-sage-800 bg-sage-50/70 shadow-md' : 'border-sage-200 bg-white hover:border-sage-500'}`}>
            <input 
              type="radio" 
              name="attendance" 
              value="declined"
              checked={attendance === "declined"}
              onChange={() => setAttendance("declined")}
              className="w-4 h-4 text-sage-800 focus:ring-sage-600 border-gray-300"
            />
            <div className="ml-3 flex items-center gap-2">
              <HeartCrack className="w-5 h-5 text-gray-500" />
              <div className="text-left">
                <span className="block text-sm font-semibold text-sage-950">No podré asistir</span>
                <span className="block text-xs text-sage-500">Les acompañaré en corazón y oración</span>
              </div>
            </div>
          </label>
        </div>
      </div>



      {/* Mensaje o Deseo para los Novios */}
      <div className="text-left">
        <label htmlFor="guestMessage" className="block text-xs uppercase tracking-wider text-sage-700 font-bold mb-1.5">
          Dedicatoria o Mensaje especial para Ervin & Sindy
        </label>
        <textarea 
          id="guestMessage" 
          rows={3} 
          value={guestMessage}
          onChange={(e) => setGuestMessage(e.target.value)}
          placeholder="Escribe aquí tus mejores deseos y bendiciones para los novios..." 
          className="w-full px-4 py-3 rounded-xl border border-sage-200 bg-cream-50 text-sage-900 focus:ring-2 focus:ring-sage-600 focus:border-sage-600 focus:bg-white outline-none transition-all placeholder:text-sage-400 text-sm"
        ></textarea>
      </div>

      {/* Submit Button */}
      <button 
        type="submit" 
        disabled={loading}
        className="w-full group py-4 px-8 rounded-full bg-gradient-to-r from-sage-800 to-sage-900 hover:from-sage-700 hover:to-sage-800 text-cream-50 font-semibold text-xs uppercase tracking-[0.2em] transition-all shadow-lg shadow-sage-900/20 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
      >
        <span>{loading ? "Guardando..." : "Enviar Confirmación"}</span>
        {!loading && <Send className="w-4 h-4 text-gold-400 transition-transform group-hover:translate-x-1" />}
      </button>

    </form>
  );
}
