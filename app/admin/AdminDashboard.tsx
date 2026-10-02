"use client";

import { useEffect, useState } from "react";
import { createBrowserSupabaseClient } from "@/lib/supabase";
import { Trash2, Link as LinkIcon, Plus, Users, CheckCircle, XCircle, Clock, RefreshCw } from "lucide-react";

interface Invitado {
  id: string;
  codigo: string;
  nombre: string;
  pases: number;
  confirmado: boolean | null;
  telefono: string;
  mensaje_personalizado: string;
}

const MAX_PERSONAS = 130;

export default function AdminDashboard() {
  const [invitados, setInvitados] = useState<Invitado[]>([]);
  const [loading, setLoading] = useState(true);
  const [hostUrl, setHostUrl] = useState("");
  
  // Form state
  const [nuevoNombre, setNuevoNombre] = useState("");
  const [nuevosPases, setNuevosPases] = useState<number | "">(1);
  const [creando, setCreando] = useState(false);
  const [filtro, setFiltro] = useState<"todas" | "confirmadas" | "pendientes" | "no_asistiran" | "mensajes">("todas");

  // Modals and Toasts
  const [modalDelete, setModalDelete] = useState<{ show: boolean, id: string, nombre: string }>({ show: false, id: "", nombre: "" });
  const [modalCreate, setModalCreate] = useState<{ show: boolean }>({ show: false });
  const [toast, setToast] = useState<{ show: boolean, message: string, type: 'success' | 'error' }>({ show: false, message: "", type: "success" });

  // Dev Mode State
  const [devModeUnlocked, setDevModeUnlocked] = useState(false);
  const [devClickCount, setDevClickCount] = useState(0);
  const [modalDevAuth, setModalDevAuth] = useState(false);
  const [devPassword, setDevPassword] = useState("");
  const [isDevCreate, setIsDevCreate] = useState(false);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type }), 3000);
  };

  const supabase = createBrowserSupabaseClient();

  const [fechaLimite, setFechaLimite] = useState<string>("2026-10-15");
  const [guardandoFecha, setGuardandoFecha] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setHostUrl(window.location.origin);
    }
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    await Promise.all([fetchInvitados(), fetchConfig()]);
    setLoading(false);
  };

  const fetchConfig = async () => {
    try {
      const res = await fetch('/api/configuracion');
      const data = await res.json();
      if (data.fecha_limite) {
        setFechaLimite(data.fecha_limite);
      }
    } catch (err) {
      console.error("Error al cargar configuración", err);
    }
  };

  const fetchInvitados = async () => {
    const { data, error } = await supabase
      .from('invitados')
      .select('*')
      .order('nombre', { ascending: true });
      
    if (error) {
      console.error("Error fetching invitados:", error);
      showToast("Error al cargar los datos.", 'error');
    } else {
      setInvitados(data || []);
    }
  };

  const updateFechaLimite = async (nuevaFecha: string) => {
    setFechaLimite(nuevaFecha);
    setGuardandoFecha(true);
    try {
      const res = await fetch('/api/configuracion', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fecha_limite: nuevaFecha })
      });
      const result = await res.json();
      if (result.error) throw new Error(result.error);
      showToast("Fecha límite actualizada con éxito.", 'success');
    } catch (err) {
      console.error("Error actualizando fecha límite", err);
      showToast("Error al actualizar la fecha.", 'error');
    } finally {
      setGuardandoFecha(false);
    }
  };

  const generarCodigo = (isDev = false) => {
    const code = Math.random().toString(36).substring(2, 7).toUpperCase();
    return isDev ? `DEV-${code}` : code;
  };

  const handleSubmitClick = (e: React.FormEvent, isDev: boolean = false) => {
    e.preventDefault();
    const pasesValue = typeof nuevosPases === 'number' ? nuevosPases : parseInt(nuevosPases) || 1;

    if (!nuevoNombre.trim() || pasesValue < 1) return;
    
    if (!isDev && (totalPases + pasesValue > MAX_PERSONAS)) {
      showToast(`¡Límite excedido! Solo quedan ${MAX_PERSONAS - totalPases} lugares disponibles.`, 'error');
      return;
    }

    setIsDevCreate(isDev);
    setModalCreate({ show: true });
  };

  const confirmarCrearInvitado = async () => {
    setModalCreate({ show: false });
    setCreando(true);
    const codigo = generarCodigo(isDevCreate);

    const res = await fetch('/api/invitados', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        nombre: isDevCreate && !nuevoNombre.startsWith('[DEV]') ? `[DEV] ${nuevoNombre.trim()}` : nuevoNombre.trim(), 
        pases: typeof nuevosPases === 'number' ? nuevosPases : parseInt(nuevosPases) || 1, 
        codigo: codigo,
        confirmado: null
      })
    });

    const result = await res.json();

    if (result.error) {
      console.error("Error creando invitado:", result.error);
      showToast("Error al crear la invitación.", 'error');
    } else {
      setNuevoNombre("");
      setNuevosPases(1);
      fetchInvitados();
      showToast("¡Invitación creada con éxito!", 'success');
    }
    setCreando(false);
  };

  const solicitarEliminar = (id: string, nombre: string) => {
    setModalDelete({ show: true, id, nombre });
  };

  const confirmarEliminarInvitado = async () => {
    const { id } = modalDelete;
    setModalDelete({ show: false, id: "", nombre: "" });

    const res = await fetch(`/api/invitados?id=${id}`, {
      method: 'DELETE'
    });
    const result = await res.json();

    if (result.error) {
      console.error("Error eliminando:", result.error);
      showToast("Error al eliminar la invitación.", 'error');
    } else {
      fetchInvitados();
      showToast("Invitación eliminada correctamente.", 'success');
    }
  };

  const copiarEnlace = (codigo: string) => {
    const url = `${hostUrl}/invitacion/${codigo}`;
    navigator.clipboard.writeText(url);
    showToast("¡Enlace copiado al portapapeles!", 'success');
  };

  const handleTitleClick = () => {
    if (devModeUnlocked) return;
    const newCount = devClickCount + 1;
    setDevClickCount(newCount);
    if (newCount >= 5) {
      setModalDevAuth(true);
      setDevClickCount(0);
    }
  };

  const handleDevAuth = () => {
    if (devPassword === "julian29") {
      setDevModeUnlocked(true);
      setModalDevAuth(false);
      showToast("Panel de desarrollador activado", "success");
    } else {
      showToast("Contraseña incorrecta", "error");
    }
    setDevPassword("");
  };

  const invitadosNormales = invitados.filter(i => !i.codigo.startsWith('DEV-'));
  const invitadosDev = invitados.filter(i => i.codigo.startsWith('DEV-'));

  const listaBase = invitadosNormales;

  const totalInvitados = invitadosNormales.length;
  const totalConfirmados = invitadosNormales.filter(i => i.confirmado === true).length;
  const totalNoAsistiran = invitadosNormales.filter(i => i.confirmado === false).length;
  const totalPendientes = invitadosNormales.filter(i => i.confirmado === null).length;
  const totalPases = invitadosNormales.reduce((acc, curr) => acc + curr.pases, 0);

  const invitadosFiltrados = listaBase.filter(i => {
    if (filtro === "confirmadas") return i.confirmado === true;
    if (filtro === "no_asistiran") return i.confirmado === false;
    if (filtro === "pendientes") return i.confirmado === null;
    if (filtro === "mensajes") return i.mensaje_personalizado && i.mensaje_personalizado.trim() !== "";
    return true;
  });

  if (loading && invitados.length === 0) {
    return <div className="min-h-screen flex items-center justify-center bg-cream-50 font-serif text-2xl text-sage-800">Cargando panel...</div>;
  }

  return (
    <>
      {devModeUnlocked ? (
        <div className="min-h-screen bg-slate-950 text-slate-200 p-4 sm:p-8 font-sans">
          <div className="max-w-7xl mx-auto">
            <header className="mb-8 border-b border-slate-800 pb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-4xl font-bold text-amber-500 tracking-tight">DEV PANEL</h1>
                <p className="text-slate-400 mt-2">Gestión aislada de invitaciones de prueba.</p>
              </div>
              <button 
                onClick={() => setDevModeUnlocked(false)}
                className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-colors font-semibold shadow-sm border border-slate-700"
              >
                Salir de Dev Mode
              </button>
            </header>

            <div className="bg-slate-900 p-6 rounded-3xl shadow-lg border border-slate-800 mb-8">
              <h2 className="text-xl font-semibold text-slate-100 mb-4">Nueva Invitación DEV</h2>
              <form onSubmit={(e) => handleSubmitClick(e, true)} className="flex flex-col sm:flex-row gap-4 items-end">
                <div className="flex-1 w-full">
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Nombre de Prueba</label>
                  <input 
                    type="text" 
                    value={nuevoNombre}
                    onChange={e => setNuevoNombre(e.target.value)}
                    placeholder="Ej. Juan Prueba"
                    className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all"
                    required
                  />
                </div>
                <div className="w-full sm:w-32">
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Pases</label>
                  <input 
                    type="number" 
                    min="1"
                    value={nuevosPases}
                    onChange={e => setNuevosPases(e.target.value === "" ? "" : parseInt(e.target.value))}
                    className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all"
                    required
                  />
                </div>
                <button 
                  type="submit" 
                  disabled={creando}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white font-bold tracking-wider uppercase text-sm transition-colors flex items-center justify-center gap-2"
                >
                  {creando ? "Creando..." : <><Plus className="w-4 h-4" /> Crear DEV</>}
                </button>
              </form>
            </div>

            <div className="bg-slate-900 rounded-3xl shadow-lg border border-slate-800 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-950 text-slate-400">
                    <tr>
                      <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider">Nombre</th>
                      <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider">Código DEV</th>
                      <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider">Pases</th>
                      <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {invitadosDev.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="px-6 py-8 text-center text-slate-500">
                          No hay invitaciones de prueba.
                        </td>
                      </tr>
                    ) : (
                      invitadosDev.map((invitado) => (
                        <tr key={invitado.id} className="hover:bg-slate-800/50 transition-colors">
                          <td className="px-6 py-4 font-medium text-slate-200">{invitado.nombre}</td>
                          <td className="px-6 py-4 font-mono text-sm text-amber-500">{invitado.codigo}</td>
                          <td className="px-6 py-4 text-slate-300 font-medium">{invitado.pases}</td>
                          <td className="px-6 py-4 text-right space-x-3">
                            <button 
                              onClick={() => copiarEnlace(invitado.codigo)}
                              className="inline-flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 font-medium bg-indigo-950/50 hover:bg-indigo-900/50 border border-indigo-900/50 px-3 py-1.5 rounded-lg transition-colors"
                            >
                              <LinkIcon className="w-3.5 h-3.5" /> Copiar Link
                            </button>
                            <button 
                              onClick={() => solicitarEliminar(invitado.id, invitado.nombre)}
                              className="inline-flex items-center gap-1.5 text-xs text-red-400 hover:text-red-300 font-medium bg-red-950/50 hover:bg-red-900/50 border border-red-900/50 px-3 py-1.5 rounded-lg transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" /> Eliminar
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="min-h-screen bg-sage-50/30 p-4 sm:p-8">
          <div className="max-w-7xl mx-auto">
            <header className="mb-8 border-b border-sage-200 pb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h1 
                  onClick={handleTitleClick}
                  className="font-serif text-4xl text-sage-950 cursor-default select-none"
                >
                  Panel de Administración
                </h1>
                <p className="text-sage-600 mt-2">Gestión de invitaciones y confirmaciones de asistencia.</p>
              </div>
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <button 
              onClick={fetchData} 
              disabled={loading}
              className="bg-white p-3 rounded-full border border-sage-200 shadow-sm hover:bg-sage-50 transition-colors disabled:opacity-50"
              title="Actualizar datos"
            >
              <RefreshCw className={`w-5 h-5 text-sage-600 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <div className="bg-white px-5 py-3 rounded-2xl border border-sage-200 shadow-sm flex items-center gap-3">
              <Clock className="w-5 h-5 text-gold-500" />
              <div className="flex flex-col items-start">
                <p className="text-xs text-sage-500 uppercase tracking-wider font-semibold">Cierre de RSVPs</p>
                <input 
                  type="date"
                  value={fechaLimite}
                  onChange={(e) => updateFechaLimite(e.target.value)}
                  disabled={guardandoFecha}
                  className="text-sm font-bold font-serif text-sage-900 focus:outline-none focus:ring-1 focus:ring-gold-400 rounded px-1 -ml-1 mt-0.5"
                />
              </div>
            </div>
            <div className="bg-white px-5 py-3 rounded-2xl border border-sage-200 shadow-sm flex items-center gap-3">
              <Users className="w-5 h-5 text-gold-500" />
              <div>
                <p className="text-xs text-sage-500 uppercase tracking-wider font-semibold">Total Personas</p>
                <p className={`text-xl font-bold font-serif ${totalPases >= MAX_PERSONAS ? 'text-red-500' : 'text-sage-900'}`}>
                  {totalPases} <span className="text-sm font-normal text-sage-400">/ {MAX_PERSONAS}</span>
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Formulario de Creación */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-sage-200 mb-8">
          <h2 className="font-serif text-2xl text-sage-900 mb-4">Nueva Invitación</h2>
          <form onSubmit={handleSubmitClick} className="flex flex-col sm:flex-row gap-4 items-end">
            <div className="flex-1 w-full">
              <label className="block text-xs font-semibold text-sage-600 uppercase tracking-wider mb-2">Nombre del Invitado / Familia</label>
              <input 
                type="text" 
                value={nuevoNombre}
                onChange={e => setNuevoNombre(e.target.value)}
                placeholder="Ej. Familia Pérez"
                className="w-full px-4 py-3 rounded-xl border border-sage-300 focus:outline-none focus:ring-2 focus:ring-gold-400 focus:border-transparent transition-all"
                required
              />
            </div>
            <div className="w-full sm:w-32">
              <label className="block text-xs font-semibold text-sage-600 uppercase tracking-wider mb-2">Pases</label>
              <input 
                type="number" 
                min="1"
                value={nuevosPases}
                onChange={e => setNuevosPases(e.target.value === "" ? "" : parseInt(e.target.value))}
                className="w-full px-4 py-3 rounded-xl border border-sage-300 focus:outline-none focus:ring-2 focus:ring-gold-400 focus:border-transparent transition-all"
                required
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <button 
                type="submit" 
                onClick={(e) => handleSubmitClick(e, false)}
                disabled={creando || totalPases >= MAX_PERSONAS}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-sage-800 hover:bg-sage-900 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold tracking-wider uppercase text-sm transition-colors flex items-center justify-center gap-2"
              >
                {creando ? "Creando..." : <><Plus className="w-4 h-4" /> Crear</>}
              </button>
            </div>
          </form>
          {totalPases >= MAX_PERSONAS && (
            <p className="text-red-500 text-sm mt-3 font-medium">Se ha alcanzado el límite de {MAX_PERSONAS} personas permitidas. No puedes crear más invitaciones.</p>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-sage-200">
            <p className="text-xs text-sage-500 uppercase tracking-wider font-semibold mb-1">Total Invitaciones</p>
            <p className="text-3xl text-sage-900 font-serif">{totalInvitados}</p>
          </div>
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-sage-200 flex items-center justify-between">
            <div>
              <p className="text-xs text-green-600 uppercase tracking-wider font-semibold mb-1">Asistirán</p>
              <p className="text-3xl text-sage-900 font-serif">{totalConfirmados}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-500/20" />
          </div>
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-sage-200 flex items-center justify-between">
            <div>
              <p className="text-xs text-red-500 uppercase tracking-wider font-semibold mb-1">No Asistirán</p>
              <p className="text-3xl text-sage-900 font-serif">{totalNoAsistiran}</p>
            </div>
            <XCircle className="w-8 h-8 text-red-500/20" />
          </div>
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-sage-200 flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Pendientes</p>
              <p className="text-3xl text-sage-900 font-serif">{totalPendientes}</p>
            </div>
            <Clock className="w-8 h-8 text-gray-400/20" />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex overflow-x-auto gap-2 mb-4 pb-2">
          {[
            { id: "todas", label: "Todas las Invitaciones" },
            { id: "confirmadas", label: "Confirmadas" },
            { id: "pendientes", label: "Pendientes" },
            { id: "no_asistiran", label: "No Asistirán" },
            { id: "mensajes", label: "Mensajes Recibidos" }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setFiltro(tab.id as any)}
              className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                filtro === tab.id 
                  ? "bg-sage-800 text-white shadow-sm" 
                  : "bg-white text-sage-600 hover:bg-sage-100 border border-sage-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* List / Mensajes */}
        <div className="bg-white rounded-3xl shadow-sm border border-sage-200 overflow-hidden">
          {filtro === "mensajes" ? (
            <div className="p-6">
              {invitadosFiltrados.length === 0 ? (
                <div className="text-center text-sage-500 py-8">No hay mensajes recibidos aún.</div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {invitadosFiltrados.map(inv => (
                    <div key={inv.id} className="bg-sage-50/50 p-6 rounded-2xl border border-sage-100 relative">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-full bg-gold-100 text-gold-700 flex items-center justify-center font-serif text-lg shadow-sm">
                          {inv.nombre.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-sage-900">{inv.nombre}</p>
                          <p className="text-xs font-medium text-sage-500">
                            {inv.confirmado ? "Sí asistirá" : "No asistirá"}
                          </p>
                        </div>
                      </div>
                      <div className="relative">
                        <span className="absolute -top-3 -left-2 text-4xl text-gold-200 font-serif opacity-50">"</span>
                        <p className="text-sage-700 font-cormorant text-lg italic bg-white p-4 rounded-xl shadow-sm border border-sage-100 relative z-10 leading-relaxed">
                          {inv.mensaje_personalizado}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-sage-100 text-sage-800">
                  <tr>
                    <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider">Nombre</th>
                    <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider">Código</th>
                    <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider">Pases</th>
                    <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider">Estado</th>
                    <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-sage-100">
                  {invitadosFiltrados.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-8 text-center text-sage-500">
                        No hay invitaciones en esta categoría.
                      </td>
                    </tr>
                  ) : (
                    invitadosFiltrados.map((invitado) => (
                      <tr key={invitado.id} className="hover:bg-sage-50/50 transition-colors">
                        <td className="px-6 py-4 font-medium text-sage-900">
                          <div className="flex items-center gap-2">
                            {invitado.nombre}
                            {invitado.mensaje_personalizado && invitado.mensaje_personalizado.trim() !== "" && (
                              <span className="inline-block w-2 h-2 rounded-full bg-gold-400" title="Dejó un mensaje"></span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 font-mono text-sm text-sage-600">{invitado.codigo}</td>
                        <td className="px-6 py-4 text-sage-900 font-medium">{invitado.pases}</td>
                        <td className="px-6 py-4">
                          {invitado.confirmado === true && (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium border border-green-200">
                              <CheckCircle className="w-3.5 h-3.5" /> Sí Asistirá
                            </span>
                          )}
                          {invitado.confirmado === false && (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium border border-red-200">
                              <XCircle className="w-3.5 h-3.5" /> No Asistirá
                            </span>
                          )}
                          {invitado.confirmado === null && (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium border border-gray-200">
                              <Clock className="w-3.5 h-3.5" /> Pendiente
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-right space-x-3">
                          <button 
                            onClick={() => copiarEnlace(invitado.codigo)}
                            className="inline-flex items-center gap-1.5 text-xs text-gold-600 hover:text-gold-700 font-medium bg-gold-50 hover:bg-gold-100 px-3 py-1.5 rounded-lg transition-colors"
                          >
                            <LinkIcon className="w-3.5 h-3.5" /> Copiar Link
                          </button>
                          <button 
                            onClick={() => solicitarEliminar(invitado.id, invitado.nombre)}
                            className="inline-flex items-center gap-1.5 text-xs text-red-600 hover:text-red-700 font-medium bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" /> Eliminar
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modal Crear */}
      {modalCreate.show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-sage-900/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl shadow-xl max-w-sm w-full p-6 animate-scale-in">
            <h3 className="font-serif text-2xl text-sage-900 mb-2">Confirmar Invitación</h3>
            <p className="text-sage-600 text-sm mb-6">
              Estás a punto de crear una invitación {isDevCreate ? <strong className="text-gold-600">DE DESARROLLADOR</strong> : ''} para <strong className="text-sage-900">{nuevoNombre}</strong> con <strong className="text-sage-900">{nuevosPases} pase{Number(nuevosPases) > 1 ? 's' : ''}</strong>. 
              {isDevCreate ? " Esta invitación no afectará el límite máximo." : " Por favor, verifica que la información sea correcta antes de continuar."}
            </p>
            <div className="flex gap-3 justify-end">
              <button 
                onClick={() => setModalCreate({ show: false })}
                className="px-4 py-2 text-sm font-medium text-sage-600 hover:text-sage-900 bg-sage-100 hover:bg-sage-200 rounded-xl transition-colors"
              >
                Cancelar
              </button>
              <button 
                onClick={confirmarCrearInvitado}
                className="px-4 py-2 text-sm font-medium text-white bg-gold-600 hover:bg-gold-700 rounded-xl transition-colors"
              >
                Sí, crear invitación
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Eliminar */}
      {modalDelete.show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-sage-900/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl shadow-xl max-w-sm w-full p-6 animate-scale-in">
            <div className="flex items-center gap-3 mb-4 text-red-600">
              <div className="p-2 bg-red-50 rounded-full">
                <Trash2 className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-2xl">Eliminar Invitación</h3>
            </div>
            <p className="text-sage-600 text-sm mb-6">
              ¿Estás seguro que deseas eliminar la invitación de <strong className="text-sage-900">{modalDelete.nombre}</strong>? Esta acción no se puede deshacer.
            </p>
            <div className="flex gap-3 justify-end">
              <button 
                onClick={() => setModalDelete({ show: false, id: "", nombre: "" })}
                className="px-4 py-2 text-sm font-medium text-sage-600 hover:text-sage-900 bg-sage-100 hover:bg-sage-200 rounded-xl transition-colors"
              >
                Cancelar
              </button>
              <button 
                onClick={confirmarEliminarInvitado}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-xl transition-colors shadow-sm"
              >
                Eliminar definitivamente
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Dev Auth */}
      {modalDevAuth && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-sage-900/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl shadow-xl max-w-sm w-full p-6 animate-scale-in border-t-4 border-gold-500">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-serif text-2xl text-sage-900">Acceso Desarrollador</h3>
              <button onClick={() => setModalDevAuth(false)} className="text-sage-400 hover:text-sage-600">
                <XCircle className="w-6 h-6" />
              </button>
            </div>
            <p className="text-sage-600 text-sm mb-4">
              Ingresa la contraseña para desbloquear las opciones de desarrollo y pruebas.
            </p>
            <input 
              type="password"
              value={devPassword}
              onChange={e => setDevPassword(e.target.value)}
              placeholder="Contraseña"
              className="w-full px-4 py-3 rounded-xl border border-sage-300 focus:outline-none focus:ring-2 focus:ring-gold-400 focus:border-transparent transition-all mb-6"
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleDevAuth();
              }}
            />
            <div className="flex gap-3 justify-end">
              <button 
                onClick={handleDevAuth}
                className="px-6 py-2 text-sm font-medium text-white bg-sage-900 hover:bg-black rounded-xl transition-colors shadow-sm w-full"
              >
                Desbloquear
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast.show && (
        <div className={`fixed bottom-6 right-6 z-50 px-5 py-3 rounded-2xl shadow-lg border animate-slide-up flex items-center gap-3 ${
          toast.type === 'success' 
            ? 'bg-white border-green-200 text-sage-900' 
            : 'bg-white border-red-200 text-red-900'
        }`}>
          {toast.type === 'success' ? (
            <CheckCircle className="w-5 h-5 text-green-500" />
          ) : (
            <XCircle className="w-5 h-5 text-red-500" />
          )}
          <span className="text-sm font-medium">{toast.message}</span>
        </div>
      )}
    </>
  );
}
