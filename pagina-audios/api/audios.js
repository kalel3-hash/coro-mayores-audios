import fs from "fs";
import path from "path";

export default function handler(req, res) {
    const basePath = path.join(process.cwd(), "public/audios");
    let resultado = [];

    // Leer carpetas (Sopranos MP3, etc.)
    const carpetas = fs.readdirSync(basePath, { withFileTypes: true })
        .filter(item => item.isDirectory())
        .map(item => item.name)
        .sort((a, b) => a.localeCompare(b, "es"));

    carpetas.forEach(carpeta => {
        const carpetaPath = path.join(basePath, carpeta);

        // Leer y ordenar mp3 dentro de cada carpeta
        const archivos = fs.readdirSync(carpetaPath)
            .filter(archivo => archivo.toLowerCase().endsWith(".mp3"))
            .sort((a, b) => a.localeCompare(b, "es"));

        archivos.forEach(archivo => {
            resultado.push({
                carpeta: carpeta,
                nombre: archivo.replace(/\.mp3$/i, ""),
                archivo: `/audios/${carpeta}/${archivo}`
            });
        });
    });

    res.status(200).json(resultado);
}