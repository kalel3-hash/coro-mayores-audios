import fs from "fs";
import path from "path";

export default function handler(req, res) {
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
                archivo: `/audios/${carpeta}/${archivo}`
            });
        });
    });

    res.status(200).json(resultado);
}