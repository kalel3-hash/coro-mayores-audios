import fs from "fs";
import path from "path";

export default async function handler(req, res) {
    const basePath = path.join(process.cwd(), "public/audios");

    // ✅ formatos de audio soportados
    const EXTENSIONES_VALIDAS = [".mp3", ".mpeg", ".m4a", ".wav", ".ogg"];

    let resultado = [];

    const carpetas = fs.readdirSync(basePath, { withFileTypes: true })
        .filter(item => item.isDirectory())
        .map(item => item.name);

    carpetas.forEach(carpeta => {
        const carpetaPath = path.join(basePath, carpeta);

        const archivos = fs.readdirSync(carpetaPath)
            .filter(archivo =>
                EXTENSIONES_VALIDAS.some(ext =>
                    archivo.toLowerCase().endsWith(ext)
                )
            );

        archivos.forEach(archivo => {
            resultado.push({
                carpeta: carpeta,
                nombre: archivo.replace(/\.[^/.]+$/, ""),
                archivo: `/audios/${carpeta}/${archivo}`,
                reproducciones: 0
            });
        });
    });

    // ✅ Traer los contadores de reproducciones desde Supabase y mezclarlos
    const SUPABASE_URL = process.env.SUPABASE_URL;
    const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (SUPABASE_URL && SUPABASE_KEY) {
        try {
            const resp = await fetch(
                `${SUPABASE_URL}/rest/v1/reproducciones?select=archivo,contador`,
                {
                    headers: {
                        apikey: SUPABASE_KEY,
                        Authorization: `Bearer ${SUPABASE_KEY}`
                    }
                }
            );

            if (resp.ok) {
                const contadores = await resp.json();
                const mapa = new Map(contadores.map(c => [c.archivo, c.contador]));

                resultado.forEach(a => {
                    if (mapa.has(a.archivo)) {
                        a.reproducciones = mapa.get(a.archivo);
                    }
                });
            } else {
                console.error("No se pudieron traer los contadores de Supabase");
            }
        } catch (err) {
            console.error("Error consultando Supabase:", err);
        }
    }

    res.status(200).json(resultado);
}