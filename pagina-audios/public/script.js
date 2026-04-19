let audioActual = null;
let botonActual = null;

fetch("/api/audios")
    .then(res => res.json())
    .then(audios => {
        const lista = document.getElementById("lista-audios");
        lista.innerHTML = "";

        audios.forEach(audio => {
            const card = document.createElement("div");
            card.className = "audio";

            const audioEl = document.createElement("audio");
            audioEl.src = audio.archivo;
            audioEl.preload = "none";

            const boton = document.createElement("button");
            boton.textContent = "▶ Reproducir";

            boton.onclick = () => {

                if (audioActual && audioActual !== audioEl) {
                    audioActual.pause();
                    botonActual.textContent = "▶ Reproducir";
                }

                if (audioEl.paused) {
                    audioEl.play();
                    boton.textContent = "⏸ Pausar";
                    audioActual = audioEl;
                    botonActual = boton;
                } else {
                    audioEl.pause();
                    boton.textContent = "▶ Reproducir";
                }
            };

            audioEl.onended = () => {
                boton.textContent = "▶ Reproducir";
            };

            card.innerHTML = `
                <strong>${audio.nombre}</strong>
                <div class="voz">Voz: ${audio.carpeta}</div>
            `;

            card.appendChild(boton);
            card.appendChild(audioEl);
            lista.appendChild(card);
        });
    });

// Bloquear clic derecho (extra)
document.addEventListener("contextmenu", e => {
    if (e.target.tagName === "AUDIO" || e.target.tagName === "BUTTON") {
        event.preventDefault();
    }
});