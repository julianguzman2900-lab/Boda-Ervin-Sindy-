import { createClient } from '@supabase/supabase-js';

// Cliente para uso en el navegador (componentes cliente)
export const createBrowserSupabaseClient = () => {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
};

// Cliente para uso en el servidor (RSC, Server Actions, Route Handlers)
// Utiliza la Service Role Key para tener permisos completos
export const createServerSupabaseClient = () => {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
};
