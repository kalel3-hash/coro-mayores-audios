fetch("/api/audios")
    .then(response => response.json())
    .then(audios => {
        const lista = document.getElementById("lista-audios");
        lista.innerHTML = "";

        audios.forEach(audio => {
            const div = document.createElement("div");
            div.className = "audio";

            div.innerHTML = `
                <p><strong>${audio.nombre}</strong></p>
                <p style="font-size: 0.9em; color: #555;">
                    Voz: ${audio.carpeta}
                </p>
                <audio
                    controls
                    controlsList="nodownload noremoteplayback"
                    draggable="false"
                >
                    <source src="${audio.archivo}" type="audio/mpeg">
                    Tu navegador no soporta audio HTML5.
                </audio>
            `;

            lista.appendChild(div);
        });
    })
    .catch(error => {
        console.error("Error cargando audios:", error);
        document.getElementById("lista-audios").innerText =
            "Error cargando los audios";
    });

/*
 * ❌ Bloquear menú contextual (clic derecho) SOBRE los audios
 * Evita "Guardar audio como…" para usuarios comunes
 */
document.addEventListener("contextmenu", event => {
    if (event.target.tagName === "AUDIO") {
        event.preventDefault();
    }
});