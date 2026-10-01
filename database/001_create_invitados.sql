-- 001_create_invitados.sql
-- Crea la tabla principal de invitados

CREATE TABLE IF NOT EXISTS public.invitados (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    codigo VARCHAR(20) UNIQUE NOT NULL,
    nombre VARCHAR(255) NOT NULL,
    pases INTEGER NOT NULL DEFAULT 1 CHECK (pases > 0),
    confirmado BOOLEAN DEFAULT false,
    telefono VARCHAR(50),
    mensaje_personalizado TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Habilitar Row Level Security (RLS)
ALTER TABLE public.invitados ENABLE ROW LEVEL SECURITY;

-- Función para actualizar el timestamp updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para ejecutar la función anterior
CREATE TRIGGER update_invitados_updated_at
    BEFORE UPDATE ON public.invitados
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
