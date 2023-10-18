const html = document.querySelector("html");
const focoBtn = document.querySelector(".app__card-button--foco");
const curtoBtn = document.querySelector(".app__card-button--curto");
const longoBtn = document.querySelector(".app__card-button--longo");
const banner = document.querySelector(".app__image");
const btn = document.querySelectorAll(".app__card-button");
const titulo = document.querySelector(".app__title");
const musicaBtn = document.querySelector("#alternar-musica");
const musica = new Audio("./sons/luna-rise-part-one.mp3");
const tempoNaTela = document.querySelector("#timer");
const startPauseBt = document.querySelector("#start-pause");
const iniciarOuPausarBtn = document.querySelector("#start-pause span");
const iniciarOuPausarImg = document.querySelector("#start-pause img");

const contadorMusica = document.querySelector("#contadorMusica");
const volume = document.querySelector("#volume");
const audioPlay = new Audio("/sons/play.wav");
const audioPausa = new Audio("/sons/pause.mp3");
const audioTempoFinalizado = new Audio("./sons/beep.mp3");

let tempoDecorridoEmSegundos = 25*60;
let intervaloId = null;

musica.loop = true;
musicaBtn.addEventListener("change", () => {
  if (musica.paused) {
    musica.play();
    volume.style.display = "inline";
  } else {
    musica.pause();
    volume.style.display = "none";
  }
});
volume.addEventListener("change", () => {
  console.log(volume.value);
  musica.volume = volume.value;
});

btn.forEach((btn) => {
  btn.addEventListener("click", (evento) => {
    const contexto = evento.target.dataset.contexto;
    html.setAttribute("data-contexto", contexto);
    banner.setAttribute("src", `/imagens/${contexto}.png`);
    longoBtn.classList.remove("active");
    curtoBtn.classList.remove("active");
    focoBtn.classList.remove("active");
    btn.classList.add("active");
    switch (contexto) {
      case "foco":
        tempoDecorridoEmSegundos = 25 * 60;
        titulo.innerHTML = `
            Otimize sua produtividade,<br>
                <strong class="app__title-strong">mergulhe no que importa.</strong>
            `;
            break;
      case "descanso-curto":
        tempoDecorridoEmSegundos = 5 * 60;
        titulo.innerHTML = `
            Que tal dar uma respirada? <strong class="app__title-strong">Faça uma pausa curta!</strong>
            `;
        break;
      case "descanso-longo":
        tempoDecorridoEmSegundos = 15 * 60;
        titulo.innerHTML = `
            Hora de voltar à superfície.<strong class="app__title-strong"> Faça uma pausa longa.</strong>
            `;

      default:
        break;
    }
    mostrarTempo();
  });
});

const contagemRegressiva = () => {
  if (tempoDecorridoEmSegundos <= 0) {
      zerar()
      const focoAtivo = html.getAttribute('data-contexto') === 'foco'
      if (focoAtivo) {            
          var event = new CustomEvent("TarefaFinalizada", {
              detail: {
                  message: "A tarefa foi concluída com sucesso!",
                  time: new Date(),
              },
              bubbles: true,
              cancelable: true
          });
          document.dispatchEvent(event);
          tempoDecorridoEmSegundos = 5
          mostrarTempo()
      }

      return
  }
  tempoDecorridoEmSegundos -= 1
  mostrarTempo()
}


startPauseBt.addEventListener("click", iniciarOuPausar);

function iniciarOuPausar() {
  if (intervaloId) {
    audioPausa.play();
    zerar();
    return;
  }
  audioPlay.play();
  intervaloId = setInterval(contagemRegressiva, 1000);
  iniciarOuPausarBtn.textContent = "Pausar";
  iniciarOuPausarImg.setAttribute("src", `/imagens/pause.png`);
}

function zerar() {
  clearInterval(intervaloId);
  iniciarOuPausarBtn.textContent = "Começar";
  iniciarOuPausarImg.setAttribute("src", `/imagens/play_arrow.png`);
  intervaloId = null;
}

function mostrarTempo() {
  const tempo = new Date(tempoDecorridoEmSegundos * 1000);
  const tempoFormatado = tempo.toLocaleTimeString("pt-Br", {
    minute: "2-digit",
    second: "2-digit",
  });
  tempoNaTela.innerHTML = `${tempoFormatado}`;
}

mostrarTempo();
