const velinicial = 100

let Canvas = document.getElementById("quadro"),
    Ctx = Canvas.getContext("2d"),
    nLinhas = 40,
    nColunas = 40,

    Mapa = [],
    Cobra = { i: 7, j: 7 },
    Direcao,
    DirecaoAnt,
    compCorpo,
    score,
    ranking = 0,
    cleaning = false,
    perdeu = false,
    telep = false,
    hit,
    hitmax,
    hitmaxranking = 0,
    velocidade,
    pause = false;
    pauseUsu = false;
    Filters = {};
    corFundo = "#050";

function teclaApertada(evento) {
    let codigo = {
        37: "esquerda", 38: "cima",
        39: "direita", 40: "baixo",
        82: "resetar", 80: "pausar",
        70: "pausar"
    };

    if (codigo[evento.keyCode]) {
        Direcao = codigo[evento.keyCode];
    }
}

function iniciarVariaveisGlobais(){
    Direcao = "";
    DirecaoAnt = "";
    compCorpo = 0;
    velocidade = velinicial;
    score = 0;
    perdeu = false;
    hit = 0;
    hitmax = 0;
    switch (true) {
        case (ranking>15e3):
            corFundo = "#FFF";
            break;
        case (ranking>14e3):
            corFundo = "#2D7";
            break;
        case (ranking>13e3):
            corFundo = "#27D";
            break;
        case (ranking>12e3):
            corFundo = "#72D";
            break;
        case (ranking>11e3):
            corFundo = "#D72";
            break;
        case (ranking>10e3):
            corFundo = "#000";
            break;
        case (ranking>9e3):
            corFundo = "#CCC";
            break;
        case (ranking>8e3):
            corFundo = "#333";
            break;
        case (ranking>7e3):
            corFundo = "#999";
            break;
        case(ranking>6e3):
            corFundo = "#555";
            break;
        case(ranking>5e3):
            corFundo = "#055";
            break;
        case(ranking>4e3):
            corFundo = "#005";
            break;
        case(ranking>3e3):
            corFundo = "#505";
            break;
        case(ranking>2e3):
            corFundo = "#500";
            break;
        case(ranking>1e3):
            corFundo = "#550";
            break;
        default:
            corFundo = "#050";
    }
}

function iniciarMundo() {
    iniciarVariaveisGlobais();
    document.getElementById("score").innerHTML = score;
    document.getElementById("hit").innerHTML = hit;
    document.getElementById("highesthit").innerHTML = hitmax;
    for (let i = 0; i < nLinhas; ++i) {
        Mapa[i] = []
        for (let j = 0; j < nColunas; ++j) {
            Mapa[i][j] = []
            Mapa[i][j][0] = "vazio";
            Mapa[i][j][1] = 0;
        }
    }

    Cobra = { i: nLinhas / 2, j: nColunas / 2 };
    Mapa[Cobra.i][Cobra.j][0] = "cobra";
    gerarFruta("fruta",1);
    window.addEventListener("keydown", teclaApertada);

    window.addEventListener("keydown", pausarDespausar);

    window.addEventListener("blur", () => {
        if (!pause) {
            pause = true;
            Direcao = DirecaoAnt;
        }
    });

    window.addEventListener("focus", () => {
        if (!pauseUsu && pause) {
            pause = false;
            Direcao = DirecaoAnt;
        }
    });
}

function coordenadaAleatoria() {
    let i, j;
    do {
        i = Math.floor((Math.random() * nLinhas));
        j = Math.floor((Math.random() * nColunas));
    } while (Mapa[i][j][0] != "vazio")
    return [i, j];
}

function gerarFruta(tipo,timerK) {
    let coord = coordenadaAleatoria(),
            i = coord[0],
            j = coord[1],
            k = ((nLinhas + nColunas) + Math.floor((Math.random() * velocidade / 2)))*timerK;
    Mapa[i][j][0] = tipo;
    Mapa[i][j][1] = parseInt(k);
}

function tratarFrutasEspeciais(i, j) {
    if (perdeu)
        Mapa[i][j][0] = "vazio";
    Mapa[i][j][1]--;
    if (Mapa[i][j][1] < 0)
        Mapa[i][j][0] = "vazio";
}

function desenharCelula(nomeImg, tileHeight, tileWidth, i, j, tam) {
    let cel = document.getElementById(nomeImg);
    cel.setAttribute("width", "height");
    //Filters.changeColor(Filters.getPixels(cel), 1, 0, 0);
    Ctx.drawImage(cel, (j * tileWidth) - tam, (i * tileHeight) - tam, tileWidth + tam, tileHeight + tam);
}


function desenharCabeca(nomeImg, mounth, tileHeight, tileWidth, i, j) {
    let auxii=(i * tileHeight) - 5, 
        auxif=tileWidth + 8,
        auxji=(j * tileWidth) - 7,
        auxjf=tileHeight + 8;
    let angle,dirc;
    switch (Direcao) {
        case "cima":
            dirc = "up";
            angle = 90;
            break;
        case "baixo":
            dirc = "down";
            angle = -90;
            break;
        case "direita":
            dirc = "right";
            angle = 180;
            break;
        default:
            dirc = "lefth";
            angle = 0;
    }
    let ende = nomeImg + dirc + mounth;
    let cel = document.getElementById(ende);

    Ctx.drawImage(cel, auxji, auxii, auxjf, auxif);
}


function desenharMundo() {

    if (pause)
        return "";

    let tileWidth = Canvas.width / nColunas,
        tileHeight = Canvas.height / nLinhas;
    contvazio = 0;
    Ctx.fillStyle = (perdeu)?"#FFF":corFundo;
    Ctx.fillRect(0, 0, tileWidth*nColunas, tileHeight*nLinhas);
    for (let i = 0; i < nLinhas; ++i) {
        for (let j = 0; j < nColunas; ++j) {
            perdeu:
                switch (Mapa[i][j][0]) {
                   /* case "vazio":
                        if (perdeu)
                            Ctx.fillStyle = "#FFF";
                        else Ctx.fillStyle = "#000";
                        break;*/
                    case "cobra":
                        if (perdeu) {
                            Ctx.fillStyle = "#000";
                            Ctx.fillRect((j * tileWidth) + 1, (i * tileHeight) + 1, (tileWidth) - 1, (tileHeight) - 1);
                            break;
                        }
                        if ((i + j) % 2 === 1)
                            mouthsnake = 1;
                        else if (((i+j)/2)% 2 === 0)
                            mouthsnake = 0;
                        else
                            mouthsnake = 2;
                            desenharCabeca("headsnake", mouthsnake, tileHeight, tileWidth, i, j);
                        break;
                    case "corpo":
                        if (perdeu)
                            Mapa[i][j][0] = "vazio";
                        Mapa[i][j][1]--;
                        let r = Mapa[i][j][1];
                        tam = ((r/compCorpo))*4;
                        desenharCelula("bodysnake", tileHeight, tileWidth, i, j, tam);
                        if (r === 0)
                            Mapa[i][j][0] = "vazio";/*
                        let vargreen = 255 - compCorpo + r;
                        Ctx.fillStyle = "rgba( " + (compCorpo - r) + " , " + vargreen + " , " + (compCorpo - r) + " , 1.0)";*/
                        break;
                    case "fruta":
                        if (perdeu)
                            Mapa[i][j][0] = "vazio";
                        let k = Mapa[i][j][1];
                        if (k < 0) {
                            Mapa[i][j][0] = "obstaculo";
                            gerarFruta("fruta", 1);
                            break;
                        }
                        Mapa[i][j][1]--;
                        desenharCelula("fruit" + ((k>30)?0:parseInt((30-k)/5)), tileHeight, tileWidth, i, j, 3);
                        break;
                    case "frutadourada":
                        tratarFrutasEspeciais(i, j);
                        switch (Mapa[i][j][1] % 6) {
                            case 0:
                                Ctx.fillStyle = "#FFF";
                                break;
                            case 1:
                                Ctx.fillStyle = "#FFA";
                                break;
                            case 2:
                                Ctx.fillStyle = "#FF5";
                                break;
                            case 3:
                                Ctx.fillStyle = "#FF0";
                                break;
                            case 4:
                                Ctx.fillStyle = "#FF5";
                                break;
                            default:
                                Ctx.fillStyle = "#FFA";
                        }
                        desenharCelula("goldfruit", tileHeight, tileWidth, i, j, 8);
                        break;
                    case "frutaazul":
                        tratarFrutasEspeciais(i, j)
                        Ctx.fillStyle = "#00F";
                        desenharCelula("bluefruit", tileHeight, tileWidth, i, j, 8);
                        break;
                    case "frutasubvel":
                        tratarFrutasEspeciais(i, j)
                        Ctx.fillStyle = "#0FF";
                        desenharCelula("decvelfruit", tileHeight, tileWidth, i, j, 6);
                        break;
                    case "frutaaddvel":
                        tratarFrutasEspeciais(i, j)
                        Ctx.fillStyle = "#FF0";
                        desenharCelula("incvelfruit", tileHeight, tileWidth, i, j, 6);
                        break;
                    case "frutaruim":
                        tratarFrutasEspeciais(i, j);
                        desenharCelula("purplefruit", tileHeight, tileWidth, i, j, 5);
                        break;
                    case "frutateleportadora":
                        tratarFrutasEspeciais(i, j);
                        if (Mapa[i][j][1] % 2 === 0)
                            Ctx.fillStyle = "#FFF";
                        else
                            Ctx.fillStyle = "#AAA";
                        desenharCelula("whitefruit", tileHeight, tileWidth, i, j, 3);
                        break;
                    case "frutaaleatoria":
                        desenharCelula("randomfruit" + Mapa[i][j][1] % 6, tileHeight, tileWidth, i, j, 3);
                        tratarFrutasEspeciais(i, j);
                        break;
                    case "obstaculo":
                        if (perdeu)
                            Mapa[i][j][0] = "vazio";
                        if (cleaning) {
                            Mapa[i][j][0] = "vazio";
                            compCorpo++;
                            hit += parseInt(calcularScore(status) * 0.1);
                        }
                        Ctx.fillStyle = "#444";
                        desenharCelula("rottenfruit", tileHeight, tileWidth, i, j, 3);
                        break;
                }
            //Ctx.fillRect((j * tileWidth)+1, (i * tileHeight)+1, (tileWidth)-1, (tileHeight)-1);
        }
    }
    cleaning = false;
}

function calcularScore(status) {
    let scoreVelocidade = (velinicial - (velocidade * 0.9)) / velinicial;
    let scoreComp = Math.pow(((compCorpo + 1) / ((nLinhas * nColunas))), (1 / (3.2)));
    let scoreStatus = Math.pow((((1+status) * 2) / ((nLinhas + nColunas + velocidade))), (1 / 5));
    return parseInt((1000 * scoreVelocidade * scoreComp * scoreStatus));
}

function colisao(objeto, status) {
    switch (objeto) {
        case "fruta":
            hit += calcularScore(status);
            gerarFruta("fruta",1);
            velocidade -= 1;
            compCorpo++;
            for (aux = velinicial / 10; aux < velinicial; aux += velinicial / 10)
                if (velocidade == velinicial - aux)
                    gerarFruta("fruta",1);
            break;
        case "obstaculo":
            compCorpo -= 5;
            break;
        case "corpo":
            if (compCorpo === 4 && score < 50) {
                perdeu = true;
                score = "SECRET_1001_1101"
            }
            compCorpo = -1;
            break;
        case "frutaazul":
            hit += parseInt(calcularScore(status) * 0.5);
            hit += calcularScore(status);
            cleaning = true;
            break;
        case "frutasubvel":
            hit += parseInt(calcularScore(status) * 0.5);
            velocidade += 10;
            if (velocidade > velinicial)
                velocidade = velinicial;
            break;
        case "frutaaddvel":
            hit += calcularScore(status) * 2;
            velocidade -= 10;
            break;
        case "frutaruim":
            hit += parseInt(calcularScore(status) * 0.5);
            let range = Math.floor((Math.random() * 7)),
                sort;
            for (let a = -3 ; a < range ; a++) {
                sort = Math.floor((Math.random() * 4))
                if (sort === 0)
                    gerarFruta("frutaruim", 1);
                else {
                    gerarFruta("obstaculo", 0);
                    hit += parseInt(calcularScore(status) * 0.1);
                }
            }
            break;
        case "frutadourada":
            hit += parseInt(calcularScore(status) * (1 + (Math.pow(compCorpo / nLinhas * nColunas, 1 / 5))));
            compCorpo = 1 + compCorpo * 2;
            break;
        case "frutateleportadora":
            hit += parseInt(calcularScore(status) * 1.5);
            telep = true;
            if (compCorpo != 0) {
                Mapa[Cobra.i][Cobra.j][0] = "corpo";
                Mapa[Cobra.i][Cobra.j][1] = compCorpo;
            }
            else {
                Mapa[Cobra.i][Cobra.j][0] = "vazio";
            }
            let coord = coordenadaAleatoria(),
                    i = coord[0],
                    j = coord[1];
            Mapa[i][j][0] = "cobra";
            Mapa[i][j][1] = 0;
            Cobra = { i: i, j: j };
            break;
        case "frutaaleatoria":
            let rndtipo = Math.floor((Math.random() * 8)),
                tipo;
            switch(rndtipo) {
                case 0:
                    tipo = "fruta";
                    break;
                case 1:
                    tipo = "frutaazul";
                    break;
                case 2:
                    tipo = "frutadourada";
                    break;
                case 3:
                    tipo = "frutaruim";
                    break;
                case 4:
                    tipo = "frutaaddvel";
                    break;
                case 5:
                    tipo = "frutasubvel";
                    break;
                case 6:
                    tipo = "frutateleportadora";
                    break;
                default:
                    tipo = "obstaculo";
            }
            colisao(tipo, status);
            hit += calcularScore(status) * 2;
    }
    score += hit;
    document.getElementById("score").innerHTML = score;
    document.getElementById("hit").innerHTML = hit;
}

function pausarDespausar() {
    if (Direcao == "pausar") {
        pause = !pause;
        Direcao = DirecaoAnt;
        pauseUsu = pause;
    }
}

function atualizarMundo() {
       

    if (pause) {
        return false;
    }

            let i = Cobra.i,
                j = Cobra.j;

            switch (Direcao) {
                case "resetar":
                    compCorpo = -1;
                    perdeu = false;
                    break;
                case "cima":
                    if (DirecaoAnt != "baixo") {
                        i -= 1;
                        DirecaoAnt = Direcao;
                    }
                    else {
                        i += 1;
                        Direcao = DirecaoAnt;
                    }
                    break;
                case "baixo":
                    if (DirecaoAnt != "cima") {
                        i += 1;
                        DirecaoAnt = Direcao;
                    }
                    else {
                        i -= 1;
                        Direcao = DirecaoAnt;
                    }
                    break;
                case "direita":
                    if (DirecaoAnt != "esquerda") {
                        j += 1;
                        DirecaoAnt = Direcao;
                    }
                    else {
                        j -= 1;
                        Direcao = DirecaoAnt;
                    }
                    break;
                case "esquerda":
                    if (DirecaoAnt != "direita") {
                        j -= 1;
                        DirecaoAnt = Direcao;
                    }
                    else {
                        j += 1;
                        Direcao = DirecaoAnt;
                    }
                    break;
            }
            if (Cobra.i == 0 && Direcao === "cima") {
                i = nLinhas - 1;
            }
            else if (Cobra.i == nLinhas - 1 && Direcao === "baixo") {
                i = 0;
            }
            else if (Cobra.j == 0 && Direcao === "esquerda") {
                j = nColunas - 1;
            }
            else if (Cobra.j == nColunas - 1 && Direcao === "direita") {
                j = 0;
            }
            if (Mapa[i][j][0] != "vazio" && Mapa[i][j][0] != "cobra") {
                hit = 0;
                colisao(Mapa[i][j][0], Mapa[i][j][1]);
                if (hitmax < hit) {
                    hitmax = hit;
                    document.getElementById("highesthit").innerHTML = hitmax;
                }
            }
            Mapa[Cobra.i][Cobra.j][1] = compCorpo;

            if (!perdeu) {
                if (compCorpo)
                    Mapa[Cobra.i][Cobra.j][0] = "corpo";
                else
                    Mapa[Cobra.i][Cobra.j][0] = "vazio";


                let fd = Math.floor((Math.random() * 1500));
                switch (true) {
                    case (fd === 0):
                        gerarFruta("frutadourada", (0.5));
                        break;
                    case (fd < 3):
                        gerarFruta("frutasubvel", (0.5));
                        break;
                    case (fd < 6):
                        gerarFruta("frutaaddvel", (0.5));
                        break;
                    case (fd === 6):
                        gerarFruta("frutaazul", (2.5));
                        break;
                    case (fd === 7):
                        gerarFruta("frutaruim", (0.5));
                        break;
                    case (fd === 8):
                        gerarFruta("frutateleportadora", (1.5));
                        break;
                    case (fd === 9):
                        gerarFruta("frutaaleatoria", 1);
                        break;
                }
            }
            if (!telep) {
                Mapa[i][j][0] = "cobra";
                Cobra = { i: i, j: j };
            }
            else {
                Mapa[i][j][0] = "vazio";
                telep = false;
            }
            if (compCorpo < 0) {
                if (perdeu) {
                    Mapa[j][i][0] = "cobra";
                    Mapa[nLinhas - i - 1][nColunas - j - 1][0] = "cobra";
                    Mapa[nColunas - j - 1][nLinhas - i - 1][0] = "cobra";
                }
                else {
                    if (score > ranking) {
                        ranking = score;
                        document.getElementById("ranking").innerHTML = ranking;
                    }
                    if (hitmax > hitmaxranking){
                        hitmaxranking = hitmax;
                        document.getElementById("highesthitranking").innerHTML = hitmaxranking;
                    }
                    iniciarMundo();
                }
            }
}


function pausar() {
    pause = true;
}

function despausar() {
    pause = false;
}

let start = 0;
function gameLoop(tempo) {
    if (!start) start = tempo;

        let passado = tempo - start;

        if (passado > velocidade) {
            atualizarMundo();
            desenharMundo();
            start += velocidade;
        }
        requestAnimationFrame(gameLoop, Canvas);
}

iniciarMundo();
gameLoop();