require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

// Fix URL formatting if needed
let url = process.env.NEXT_PUBLIC_SUPABASE_URL;
if (url.endsWith('/rest/v1/')) {
    url = url.substring(0, url.length - '/rest/v1/'.length);
}

const supabase = createClient(
    url,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function resetConfirmations() {
    console.log("Limpiando confirmaciones de la base de datos...");
    
    // RLS is bypassed with service role key, so we can update all rows
    const { data, error } = await supabase
        .from('invitados')
        .update({ 
            confirmado: false, 
            mensaje_personalizado: null 
        })
        .neq('id', 'dummy-id-to-update-all') // A trick to update all without matching a specific ID. Wait, eq/neq trick. Or better, just select and update, or update where id is not null
        .not('id', 'is', null);

    if (error) {
        console.error("Error al limpiar:", error);
    } else {
        console.log("¡Confirmaciones y dedicatorias limpiadas exitosamente!");
    }
}

resetConfirmations();
