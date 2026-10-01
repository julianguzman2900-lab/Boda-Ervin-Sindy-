"use client";

import { useState } from "react";
import AdminDashboard from "./AdminDashboard";

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Use an environment variable for the admin password, passed via a Server Action or just 
    // a simple check if we are okay with it being somewhat client-side for this MVP.
    // To be secure without a full backend, we'll use a server action to verify it.
    verifyPassword(password);
  };

  const verifyPassword = async (pass: string) => {
    try {
      const res = await fetch("/api/admin-auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: pass }),
      });
      if (res.ok) {
        setIsAuthenticated(true);
      } else {
        setError("Contraseña incorrecta");
      }
    } catch (err) {
      setError("Error de conexión");
    }
  };

  if (isAuthenticated) {
    return <AdminDashboard />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-ivory p-6">
      <form onSubmit={handleLogin} className="bg-white p-8 rounded-2xl shadow-sm border border-olive/20 max-w-sm w-full">
        <h1 className="font-serif text-3xl text-olive mb-6 text-center">Panel de Administración</h1>
        
        {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}
        
        <div className="mb-6">
          <label className="block text-sm text-ink/70 mb-2">Contraseña</label>
          <input 
            type="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-olive/50"
            required
          />
        </div>
        
        <button 
          type="submit"
          className="w-full bg-olive text-white py-3 rounded-xl uppercase tracking-wider text-sm font-semibold hover:bg-olive/90 transition-colors"
        >
          Ingresar
        </button>
      </form>
    </div>
  );
}
