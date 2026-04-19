let audioActual = null;
let cardActual = null;
let audiosGlobal = [];

const lista = document.getElementById("lista-audios");
const buscador = document.getElementById("buscador");

fetch("/api/audios")
    .then(res => res.json())
    .then(audios => {
        audiosGlobal = audios;
        renderAudios(audios);
    });

function formatTime(sec) {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
}

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

        const tiempo = document.createElement("div");
        tiempo.className = "tiempo";
        tiempo.textContent = "0:00 / 0:00";

        boton.onclick = () => {
            if (audioActual && audioActual !== audioEl) {
                audioActual.pause();
                cardActual.classList.remove("activo");
            }

            if (audioEl.paused) {
                audioEl.play();
                boton.textContent = "Detener";
                card.classList.add("activo");
                audioActual = audioEl;
                cardActual = card;
            } else {
                audioEl.pause();
                boton.textContent = "Reproducir";
                card.classList.remove("activo");
            }
        };

        audioEl.onloadedmetadata = () => {
            tiempo.textContent = `0:00 / ${formatTime(audioEl.duration)}`;
        };

        audioEl.ontimeupdate = () => {
            progreso.style.width = (audioEl.currentTime / audioEl.duration) * 100 + "%";
            tiempo.textContent = `${formatTime(audioEl.currentTime)} / ${formatTime(audioEl.duration)}`;
        };

        audioEl.onended = () => {
            boton.textContent = "Reproducir";
            progreso.style.width = "0%";
            card.classList.remove("activo");
        };

        barra.onclick = (e) => {
            const rect = barra.getBoundingClientRect();
            audioEl.currentTime = ((e.clientX - rect.left) / rect.width) * audioEl.duration;
        };

        const controles = document.createElement("div");
        controles.className = "controles";
        controles.append(boton, barra, tiempo);

        card.innerHTML = `
            <strong>${audio.nombre}</strong>
            <div class="voz">${audio.carpeta}</div>
        `;

        card.appendChild(controles);
        card.appendChild(audioEl);
        lista.appendChild(card);
    });
}

/* 🔎 Buscador */
buscador.addEventListener("input", () => {
    const texto = buscador.value.toLowerCase();
    renderAudios(
        audiosGlobal.filter(a => a.nombre.toLowerCase().includes(texto))
    );
});