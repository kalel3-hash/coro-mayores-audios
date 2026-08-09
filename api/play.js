export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Método no permitido" });
    }

    const { archivo } = req.body || {};

    if (!archivo || typeof archivo !== "string") {
        return res.status(400).json({ error: "Falta el campo 'archivo'" });
    }

    const SUPABASE_URL = process.env.SUPABASE_URL;
    const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!SUPABASE_URL || !SUPABASE_KEY) {
        return res.status(500).json({ error: "Faltan variables de entorno de Supabase" });
    }

    try {
        const resp = await fetch(
            `${SUPABASE_URL}/rest/v1/rpc/incrementar_reproduccion`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    apikey: SUPABASE_KEY,
                    Authorization: `Bearer ${SUPABASE_KEY}`,
                },
                body: JSON.stringify({ archivo_param: archivo }),
            }
        );

        if (!resp.ok) {
            const texto = await resp.text();
            console.error("Error de Supabase:", texto);
            return res.status(500).json({ error: "Error al actualizar el contador" });
        }

        const nuevoValor = await resp.json();
        return res.status(200).json({ archivo, contador: nuevoValor });
    } catch (err) {
        console.error("Error inesperado:", err);
        return res.status(500).json({ error: "Error inesperado" });
    }
}