fetch("/api/audios")
    .then(res => res.json())
    .then(audios => {
        const lista = document.getElementById("lista-audios");
        lista.innerHTML = "";

        audios.forEach(audio => {
            const div = document.createElement("div");
            div.className = "audio";

            div.innerHTML = `
                <p><strong>${audio.nombre}</strong></p>
                <p style="font-size: 0.9em; color: #555;">
                    Carpeta: ${audio.carpeta}
                </p>
                <audio controls>
                    <source src="${audio.archivo}" type="audio/mpeg">
                    Tu navegador no soporta audio.
                </audio>
            `;

            lista.appendChild(div);
        });
    })
    .catch(() => {
        document.getElementById("lista-audios").innerText =
            "Error cargando los audios";
    });