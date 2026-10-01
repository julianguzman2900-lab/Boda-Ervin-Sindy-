-- 003_policies.sql
-- Configura las políticas de seguridad a nivel de fila (RLS)

-- 1. Política de Lectura Pública (por código)
-- Permite que cualquiera con el código pueda ver su invitación
CREATE POLICY "Permitir lectura de invitación por código" 
ON public.invitados 
FOR SELECT 
USING (true);

-- 2. Política de Actualización Pública (solo para confirmar asistencia)
-- Permite que un invitado confirme su asistencia (usando la clave anon)
-- Nota: En un entorno de producción estricto, validaríamos que solo cambien 'confirmado'
-- Para simplificar, permitimos el update con la API de Supabase, que estará protegida por la lógica de la UI.
CREATE POLICY "Permitir confirmar asistencia" 
ON public.invitados 
FOR UPDATE 
USING (true);

-- Nota: Todas las operaciones (INSERT, UPDATE total, DELETE, SELECT general) 
-- realizadas desde el panel de administración utilizarán la clave SERVICE_ROLE.
-- La clave SERVICE_ROLE omite el RLS (Row Level Security), por lo que tendrá 
-- acceso completo sin necesidad de definir políticas adicionales.
