import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const getSupabaseAdmin = () => createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

export async function GET() {
  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from('configuracion')
      .select('fecha_limite')
      .eq('id', 1)
      .single();

    if (error) throw error;
    return NextResponse.json({ fecha_limite: data.fecha_limite });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function PATCH(req: Request) {
  try {
    const { fecha_limite } = await req.json();

    if (!fecha_limite) throw new Error('No fecha provided');

    const supabaseAdmin = getSupabaseAdmin();
    const { data: result, error } = await supabaseAdmin
      .from('configuracion')
      .update({ fecha_limite })
      .eq('id', 1)
      .select();

    if (error) throw error;
    return NextResponse.json({ success: true, data: result });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
