import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const getSupabaseAdmin = () => createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const supabaseAdmin = getSupabaseAdmin();
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
    
    const supabaseAdmin = getSupabaseAdmin();
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
    const { id, confirmado, mensaje_personalizado, limpiar_mensajes, eliminar_mensaje_id } = await req.json();

    if (!id) throw new Error('No id provided');

    if (id === 'demo-id') {
      return NextResponse.json({ success: true, data: [{ id: 'demo-id', confirmado: null, mensaje_personalizado }] });
    }

    const supabaseAdmin = getSupabaseAdmin();

    // Comprobar si es invitación de desarrollador (DEV-)
    const { data: invitadoActual } = await supabaseAdmin
      .from('invitados')
      .select('codigo, mensaje_personalizado')
      .eq('id', id)
      .single();

    const isDev = invitadoActual?.codigo?.startsWith('DEV-');

    let nuevoMensaje = mensaje_personalizado;

    if (isDev) {
      if (limpiar_mensajes) {
        nuevoMensaje = null;
      } else {
        // Parsear historial existente de mensajes dev
        let historial: { id: string; mensaje: string; fecha: string }[] = [];
        if (invitadoActual?.mensaje_personalizado) {
          try {
            const parsed = JSON.parse(invitadoActual.mensaje_personalizado);
            if (Array.isArray(parsed)) {
              historial = parsed;
            } else {
              historial = [{ id: 'msg-1', mensaje: String(invitadoActual.mensaje_personalizado), fecha: 'Anterior' }];
            }
          } catch {
            historial = [{ id: 'msg-1', mensaje: String(invitadoActual.mensaje_personalizado), fecha: 'Anterior' }];
          }
        }

        if (eliminar_mensaje_id) {
          // Eliminar un mensaje específico del historial
          historial = historial.filter(m => m.id !== eliminar_mensaje_id);
          nuevoMensaje = historial.length > 0 ? JSON.stringify(historial) : null;
        } else if (mensaje_personalizado && typeof mensaje_personalizado === 'string' && mensaje_personalizado.trim() !== '') {
          // Agregar nuevo mensaje al historial con timestamp
          const ahora = new Date();
          const fechaStr = ahora.toLocaleString('es-GT', { 
            timeZone: 'America/Guatemala',
            day: '2-digit', 
            month: '2-digit', 
            year: 'numeric', 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: true 
          });

          historial.push({
            id: 'dev-' + Math.random().toString(36).substring(2, 9),
            mensaje: mensaje_personalizado.trim(),
            fecha: fechaStr
          });

          nuevoMensaje = JSON.stringify(historial);
        } else {
          // Si no se envió mensaje nuevo en este intento, conservar el historial previo
          nuevoMensaje = invitadoActual?.mensaje_personalizado || null;
        }
      }
    }

    const { data: result, error } = await supabaseAdmin
      .from('invitados')
      .update({
        // Si es de desarrollador, siempre guardamos confirmado como null para que siempre aparezca en pendiente
        confirmado: isDev ? null : confirmado,
        mensaje_personalizado: nuevoMensaje
      })
      .eq('id', id)
      .select();

    if (error) throw error;
    return NextResponse.json({ success: true, data: result });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
