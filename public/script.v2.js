const VOZ = document.body.dataset.voz;
const lista = document.getElementById("lista-audios");
const buscador = document.getElementById("buscador");

let audioActual = null;
let cardActual = null;
let audiosGlobal = [];

fetch("/api/audios")
    .then(r => r.json())
    .then(audios => {
        audiosGlobal = audios.filter(a => a.carpeta === VOZ);
        render(audiosGlobal);
    });

function fmt(s){
    const m=Math.floor(s/60), d=Math.floor(s%60);
    return`${m}:${d.toString().padStart(2,"0")}`;
}

function render(audios){
    lista.innerHTML="";
    audios.forEach(a=>{
        const card=document.createElement("div");
        card.className="audio";

        const audio=document.createElement("audio");
        audio.src=a.archivo;

        const btn=document.createElement("button");
        btn.textContent="Reproducir";

        const barra=document.createElement("div");
        barra.className="barra";

        const prog=document.createElement("div");
        prog.className="barra-progreso";
        barra.appendChild(prog);

        const t=document.createElement("div");
        t.className="tiempo";
        t.textContent="0:00 / 0:00";

        btn.onclick=()=>{
            if(audioActual&&audioActual!==audio){
                audioActual.pause();
                cardActual.classList.remove("activo");
            }
            if(audio.paused){
                audio.play();
                btn.textContent="Detener";
                card.classList.add("activo");
                audioActual=audio;
                cardActual=card;
            }else{
                audio.pause();
                btn.textContent="Reproducir";
                card.classList.remove("activo");
            }
        };

        audio.onloadedmetadata=()=>t.textContent=`0:00 / ${fmt(audio.duration)}`;
        audio.ontimeupdate=()=>{
            prog.style.width=(audio.currentTime/audio.duration)*100+"%";
            t.textContent=`${fmt(audio.currentTime)} / ${fmt(audio.duration)}`;
        };
        audio.onended=()=>{btn.textContent="Reproducir";card.classList.remove("activo");};

        barra.onclick=e=>{
            const r=barra.getBoundingClientRect();
            audio.currentTime=((e.clientX-r.left)/r.width)*audio.duration;
        };

        const c=document.createElement("div");
        c.className="controles";
        c.append(btn,barra,t);

        card.innerHTML=`<strong>${a.nombre}</strong><div class="voz">${a.carpeta}</div>`;
        card.append(c,audio);
        lista.appendChild(card);
    });
}

buscador.oninput=()=>render(
    audiosGlobal.filter(a=>a.nombre.toLowerCase().includes(buscador.value.toLowerCase()))
);
