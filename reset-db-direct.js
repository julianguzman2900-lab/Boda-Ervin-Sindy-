const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
    'https://migbqwxhhmcckeabsoej.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1pZ2Jxd3hoaG1jY2tlYWJzb2VqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4ODMxNDU0OCwiZXhwIjoyMTAzODkwNTQ4fQ.bCAvo0c4rfl24gr4hacf67ST3eXWxJoB7Z7hY7oT7GM'
);

async function resetConfirmations() {
    console.log("Limpiando confirmaciones de la base de datos...");
    
    const { data, error } = await supabase
        .from('invitados')
        .update({ 
            confirmado: false, 
            mensaje_personalizado: null 
        })
        .not('id', 'is', null);

    if (error) {
        console.error("Error al limpiar:", error);
    } else {
        console.log("¡Confirmaciones y dedicatorias limpiadas exitosamente!");
    }
}

resetConfirmations();
