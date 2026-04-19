let audioActual = null;
let botonActual = null;
let barraActual = null;
let audiosGlobal = [];

const lista = document.getElementById("lista-audios");
const buscador = document.getElementById("buscador");

fetch("/api/audios")
    .then(res => res.json())
    .then(audios => {
        audiosGlobal = audios;
        renderAudios(audios);
    });

function renderAudios(audios) {
    lista.innerHTML = "";

    audios.forEach(audio => {
        const card = document.createElement("div");
        card.className = "audio";

        const audioEl = document.createElement("audio");
        audioEl.src = audio.archivo;
        audioEl.preload = "metadata";

        const boton = document.createElement("button");
        boton.textContent = "Reproducir";

        const barra = document.createElement("div");
        barra.className = "barra";

        const progreso = document.createElement("div");
        progreso.className = "barra-progreso";
        barra.appendChild(progreso);

        boton.onclick = () => {
            if (audioActual && audioActual !== audioEl) {
                audioActual.pause();
                botonActual.textContent = "Reproducir";
                barraActual.style.width = "0%";
            }

            if (audioEl.paused) {
                audioEl.play();
                boton.textContent = "Detener";
                audioActual = audioEl;
                botonActual = boton;
                barraActual = progreso;
            } else {
                audioEl.pause();
                boton.textContent = "Reproducir";
            }
        };

        audioEl.ontimeupdate = () => {
            const porcentaje = (audioEl.currentTime / audioEl.duration) * 100;
            progreso.style.width = porcentaje + "%";
        };

        audioEl.onended = () => {
            boton.textContent = "Reproducir";
            progreso.style.width = "0%";
        };

        barra.onclick = (e) => {
            const rect = barra.getBoundingClientRect();
            const porcentaje = (e.clientX - rect.left) / rect.width;
            audioEl.currentTime = porcentaje * audioEl.duration;
        };

        const controles = document.createElement("div");
        controles.className = "controles";
        controles.appendChild(boton);
        controles.appendChild(barra);

        card.innerHTML = `
            <strong>${audio.nombre}</strong>
            <div class="voz">${audio.carpeta}</div>
        `;

        card.appendChild(controles);
        card.appendChild(audioEl);
        lista.appendChild(card);
    });
}

/* Buscador */
buscador.addEventListener("input", () => {
    const texto = buscador.value.toLowerCase();
    const filtrados = audiosGlobal.filter(a =>
        a.nombre.toLowerCase().includes(texto)
    );
    renderAudios(filtrados);
});

/* Bloqueo clic derecho */
document.addEventListener("contextmenu", e => {
    if (e.target.tagName === "AUDIO") {
        e.preventDefault();
    }
});