fetch("/api/audios")
    .then(res => res.json())
    .then(audios => {
        const lista = document.getElementById("lista-audios");
        lista.innerHTML = "";

        audios.forEach(audio => {
            const div = document.createElement("div");
            div.className = "audio";

            const audioEl = document.createElement("audio");
            audioEl.src = audio.archivo;
            audioEl.preload = "none";

            const boton = document.createElement("button");
            boton.textContent = "▶ Reproducir";
            boton.onclick = () => {
                if (audioEl.paused) {
                    audioEl.play();
                    boton.textContent = "⏸ Pausar";
                } else {
                    audioEl.pause();
                    boton.textContent = "▶ Reproducir";
                }
            };

            div.innerHTML = `
                <p><strong>${audio.nombre}</strong></p>
                <p style="font-size: 0.9em; color:#555;">
                    Voz: ${audio.carpeta}
                </p>
            `;

            div.appendChild(boton);
            div.appendChild(audioEl);
            lista.appendChild(div);
        });
    });

// Bloqueo clic derecho
document.addEventListener("contextmenu", e => {
    if (e.target.tagName === "AUDIO" || e.target.tagName === "BUTTON") {
        e.preventDefault();
    }
});