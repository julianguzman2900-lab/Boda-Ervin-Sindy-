import { notFound } from "next/navigation";
import InvitationClient from "@/components/InvitationClient";
import { createClient } from "@supabase/supabase-js";

export default async function InvitacionPage({ params }: { params: Promise<{ codigo: string }> }) {
  const { codigo } = await params;
  
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  let invitado;

  if (codigo.toUpperCase() === 'DEMO1') {
    invitado = {
      id: 'demo-id',
      codigo: 'DEMO1',
      nombre: 'Invitado de Prueba',
      pases: 2,
      confirmado: null,
      telefono: '12345678',
      mensaje_personalizado: null
    };
  } else {
    const { data } = await supabase
      .from('invitados')
      .select('*')
      .eq('codigo', codigo)
      .single();
    invitado = data;
  }

  if (!invitado) {
    notFound();
  }

  const { data: config } = await supabase
    .from('configuracion')
    .select('fecha_limite')
    .eq('id', 1)
    .single();

  const fechaLimite = config?.fecha_limite || '2026-10-15';

  return <InvitationClient invitado={invitado} fechaLimite={fechaLimite} />;
}
