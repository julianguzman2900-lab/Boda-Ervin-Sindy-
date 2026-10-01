import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const { data: result, error } = await supabaseAdmin
      .from('invitados')
      .insert([data])
      .select();

    if (error) throw error;
    return NextResponse.json({ success: true, data: result });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    
    if (!id) throw new Error('No id provided');
    
    const { error } = await supabaseAdmin
      .from('invitados')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function PATCH(req: Request) {
  try {
    const { id, confirmado, mensaje_personalizado } = await req.json();

    if (!id) throw new Error('No id provided');

    const { data: result, error } = await supabaseAdmin
      .from('invitados')
      .update({
        confirmado,
        mensaje_personalizado
      })
      .eq('id', id)
      .select();

    if (error) throw error;
    return NextResponse.json({ success: true, data: result });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
