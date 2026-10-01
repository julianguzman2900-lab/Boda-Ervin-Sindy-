import { notFound } from "next/navigation";
import InvitationClient from "@/components/InvitationClient";
import { createClient } from "@supabase/supabase-js";

export default async function InvitacionPage({ params }: { params: Promise<{ codigo: string }> }) {
  const { codigo } = await params;
  
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data: invitado } = await supabase
    .from('invitados')
    .select('*')
    .eq('codigo', codigo)
    .single();

  if (!invitado) {
    notFound();
  }

  return <InvitationClient invitado={invitado} />;
}
