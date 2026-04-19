const VOZ = document.body.dataset.voz;
const lista = document.getElementById("lista-audios");
const buscador = document.getElementById("buscador");

let audiosGlobal = [];
let audioActual = null;
let cardActual = null;

fetch("/api/audios")
    .then(res => res.json())
    .then(audios => {
        audiosGlobal = audios.filter(a =>
            a.carpeta.toLowerCase().includes(VOZ.toLowerCase())
        );
        render(audiosGlobal);
    });

function fmt(seg) {
    const m = Math.floor(seg / 60);
    const s = Math.floor(seg % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
}

function render(audios) {
    lista.innerHTML = "";

    audios.forEach(a => {
        const card = document.createElement("div");
        card.className = "audio";

        const audio = document.createElement("audio");
        audio.src = a.archivo;
        audio.preload = "metadata";

        const btn = document.createElement("button");
        btn.textContent = "Reproducir";

        const barra = document.createElement("div");
        barra.className = "barra";

        const prog = document.createElement("div");
        prog.className = "barra-progreso";
        barra.appendChild(prog);

        const tiempo = document.createElement("div");
        tiempo.className = "tiempo";
        tiempo.textContent = "0:00 / 0:00";

        btn.onclick = () => {

            if (audioActual && audioActual !== audio) {
                audioActual.pause();
                cardActual.classList.remove("activo");
            }

            if (audio.paused) {
                audio.play();
                btn.textContent = "Detener";
                card.classList.add("activo");
                audioActual = audio;
                cardActual = card;

                // ✅ EVENTO GOOGLE ANALYTICS
                if (typeof gtag === "function") {
                    gtag("event", "play_himno", {
                        voz: VOZ,
                        himno: a.nombre
                    });
                }

            } else {
                audio.pause();
                btn.textContent = "Reproducir";
                card.classList.remove("activo");
            }
        };

        audio.onloadedmetadata = () => {
            tiempo.textContent = `0:00 / ${fmt(audio.duration)}`;
        };

        audio.ontimeupdate = () => {
            prog.style.width = (audio.currentTime / audio.duration) * 100 + "%";
            tiempo.textContent = `${fmt(audio.currentTime)} / ${fmt(audio.duration)}`;
        };

        audio.onended = () => {
            btn.textContent = "Reproducir";
            card.classList.remove("activo");
        };

        barra.onclick = e => {
            const r = barra.getBoundingClientRect();
            audio.currentTime =
                ((e.clientX - r.left) / r.width) * audio.duration;
        };

        const controles = document.createElement("div");
        controles.className = "controles";
        controles.append(btn, barra, tiempo);

        card.innerHTML = `<strong>${a.nombre}</strong>`;
        card.append(controles, audio);
        lista.appendChild(card);
    });
}

buscador.oninput = () => {
    const t = buscador.value.toLowerCase();
    render(
        audiosGlobal.filter(a =>
            a.nombre.toLowerCase().includes(t)
        )
    );
};