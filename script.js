// ============================================================
// GUIA RÁPIDO DE EDIÇÃO
// - Adicionar personagem no modo "Personagem": array `personagensFotos` mais abaixo.
// - Adicionar imagem no modo "Tier list": array `tierLists` mais abaixo.
// - Cores do site (laranja, verde de acerto, vermelho de erro etc.): topo do style.css.
// - Modo "Clássico" (array `personagens` logo abaixo) ainda não está pronto: falta
//   preencher o campo `caracteristica` de cada um. O botão dele fica desabilitado
//   no index.html até isso ser feito.
// ============================================================

const personagens = [
  { nome: "Zaquel", participacao: "Youtuber", caracteristica: "" },
  { nome: "Lésbicamovies", participacao: "Mod", caracteristica: "" },
  { nome: "Kekoisinhas", participacao: "Mod", caracteristica: "" },
  { nome: "Riruza", participacao: "Mod", caracteristica: "" },
  { nome: "Paulo Sergio", participacao: "Mod", caracteristica: "" },
  { nome: "Lucas Vargas", participacao: "Membro", caracteristica: "" },
  { nome: "MotoMoto", participacao: "Mod", caracteristica: "" },
  { nome: "Queda", participacao: "Mod", caracteristica: "" },
  { nome: "GabrielSD", participacao: "Mod", caracteristica: "" },
  { nome: "Heitor", participacao: "Participante", caracteristica: "" },
  { nome: "Lucas", participacao: "Participante", caracteristica: "" },
  { nome: "Felipe", participacao: "Participante", caracteristica: "" },
  { nome: "Eduardo", participacao: "Participante", caracteristica: "" },
  { nome: "HugoGordao", participacao: "Membro", caracteristica: "" },
  { nome: "GoticoSulista", participacao: "Membro", caracteristica: "" },
  { nome: "FeijaoArtico", participacao: "Membro", caracteristica: "" }
];

let personagemSecreto = personagens[Math.floor(Math.random() * personagens.length)];
let tentativas = 0;

// Navegação entre menu e páginas (comum a todos os modos)
function mostrarPagina(id) {
  document.body.classList.remove('menu-ativo');
  document.getElementById('menu').style.display = 'none';
  document.querySelectorAll('.pagina').forEach(function(p) {
    p.classList.remove('ativa');
  });
  document.getElementById(id).classList.add('ativa');

  if (id === 'tierlist') {
    iniciarJogoFoto();
  } else if (id === 'personagem') {
    iniciarJogoPersonagem();
  } else if (id === 'classico') {
    resetarJogo();
  }
}

function mostrarMenu() {
  document.body.classList.add('menu-ativo');
  document.querySelectorAll('.pagina').forEach(function(p) {
    p.classList.remove('ativa');
  });
  document.getElementById('menu').style.display = 'flex';
}

// Modo clássico (adivinhar o personagem)
function mostrarSugestoes() {
  const texto = document.getElementById('palpite').value.toLowerCase();
  const caixa = document.getElementById('sugestoes');
  caixa.innerHTML = '';

  if (!texto) return;

  const encontrados = personagens.filter(function(p) {
    return p.nome.toLowerCase().indexOf(texto) === 0;
  });

  encontrados.forEach(function(p) {
    const item = document.createElement('button');
    item.type = 'button';
    item.textContent = p.nome;
    item.onclick = function() {
      document.getElementById('palpite').value = p.nome;
      caixa.innerHTML = '';
      verificar();
    };
    caixa.appendChild(item);
  });
}

function verificar() {
  const nome = document.getElementById('palpite').value.trim();
  if (!nome) return;

  const chute = personagens.find(function(p) {
    return p.nome.toLowerCase() === nome.toLowerCase();
  });

  if (!chute) {
    alert('Personagem não encontrado!');
    return;
  }

  const linha = document.createElement('tr');

  const acertouCaracteristica = chute.caracteristica === personagemSecreto.caracteristica;
  const simbolo = acertouCaracteristica ? ' ✓' : ' ✗';

  linha.innerHTML =
    '<td>' + chute.nome + '</td>' +
    '<td class="' + (acertouCaracteristica ? 'certo' : 'errado') + '">' + chute.caracteristica + simbolo + '</td>' +
    '<td class="' + (acertouCaracteristica ? 'certo' : 'errado') + '">' + chute.caracteristica + simbolo + '</td>' +
    '<td class="' + (acertouCaracteristica ? 'certo' : 'errado') + '">' + chute.caracteristica + simbolo + '</td>' +
    '<td class="' + (acertouCaracteristica ? 'certo' : 'errado') + '">' + (chute.caracteristica || '-') + simbolo + '</td>';

  document.getElementById('corpoResultados').prepend(linha);

  tentativas++;

  if (chute.nome === personagemSecreto.nome) {
    mostrarVitoria();
  }

  document.getElementById('palpite').value = '';
  document.getElementById('sugestoes').innerHTML = '';
}

let ultimoFocoAntesDoModal = null;

function abrirModalVitoria() {
  ultimoFocoAntesDoModal = document.activeElement;
  document.getElementById('overlayVitoria').classList.add('ativo');
  document.getElementById('botaoFecharVitoria').focus();

  // Toca o som de foguete (reseta antes, caso o jogador ganhe de novo)
  somFoguete.currentTime = 0;
  somFoguete.play().catch(function(erro) {
    console.log("O navegador bloqueou o som até que o usuário interaja com a página:", erro);
  });
}

// Mantém o foco dentro do modal (Tab) e fecha com Esc, sem sair do fluxo do teclado
document.getElementById('caixaVitoria').addEventListener('keydown', function(evento) {
  if (evento.key === 'Escape') {
    fecharVitoria();
    return;
  }

  if (evento.key !== 'Tab') return;

  const focaveis = this.querySelectorAll('button:not([disabled])');
  const primeiro = focaveis[0];
  const ultimo = focaveis[focaveis.length - 1];

  if (evento.shiftKey && document.activeElement === primeiro) {
    evento.preventDefault();
    ultimo.focus();
  } else if (!evento.shiftKey && document.activeElement === ultimo) {
    evento.preventDefault();
    primeiro.focus();
  }
});

// Modal de vitória (usado pelo modo clássico e pelo tier list)
function mostrarVitoria() {
  document.getElementById('tituloVitoria').textContent = 'Você acertou:';
  document.getElementById('nomeAcertado').textContent = personagemSecreto.nome;
  document.getElementById('tentativasTexto').textContent = 'Número de tentativas: ' + tentativas;
  document.getElementById('fotoAcertadaModal').classList.add('oculto');
  abrirModalVitoria();
}

function fecharVitoria() {
  document.getElementById('overlayVitoria').classList.remove('ativo');
  if (ultimoFocoAntesDoModal) {
    ultimoFocoAntesDoModal.focus();
  }
  if (document.getElementById('tierlist').classList.contains('ativa')) {
    iniciarJogoFoto();
  } else if (document.getElementById('personagem').classList.contains('ativa')) {
    iniciarJogoPersonagem();
  } else {
    resetarJogo();
  }
}

function resetarJogo() {
  personagemSecreto = personagens[Math.floor(Math.random() * personagens.length)];
  tentativas = 0;
  document.getElementById('corpoResultados').innerHTML = '';
  document.getElementById('palpite').value = '';
  document.getElementById('sugestoes').innerHTML = '';
}

// Modo tier list (imagem borrada)
// Para adicionar uma tier list nova: colocar a foto na pasta "tierlists/"
// e incluir { nome, arquivo } no array abaixo.
const pastaFotos = "tierlists/";

const tierLists = [
  { nome: "Tier list de mães", arquivo: "tier_list_de_maes.jpeg" },
  { nome: "Tier list de pais", arquivo: "tier_list_de_pais.jpeg" },
  { nome: "Tier list de personagens contra a escala 6x1", arquivo: "tier_list_de_personagens_contra_a_escala_6x1.jpeg" },
  { nome: "Tier list de personagens fiéis", arquivo: "tier_list_de_personagens_fieis.jpeg" },
  { nome: "Tier list de personagens mais gostosos", arquivo: "tier_list_de_personagens_mais_gostosos.jpeg" },
  { nome: "Tier list de poderes", arquivo: "tier_list_de_poderes.jpeg" },
  { nome: "Tier list de pokémon", arquivo: "tier_list_de_pokemon.jpeg" },
  { nome: "Tier list de portas", arquivo: "tier_list_de_portas.jpeg" },
  { nome: "Tier list de rodrigos", arquivo: "tier_list_de_rodrigos.jpeg" },
  { nome: "Tier list de traficantes", arquivo: "tier_list_de_traficantes.jpeg" },
  { nome: "Tier list de trancas", arquivo: "tier_list_de_trancas.jpeg" },
  { nome: "Tier list de tudo", arquivo: "tier_list_de_tudo.jpeg" },
  { nome: "Tier list de vilões", arquivo: "tier_list_de_viloes.jpeg" },
  { nome: "Tier list de xingamentos", arquivo: "tier_list_de_xingamentos.jpeg" },
  { nome: "Tier list de animais que venceria na porrada", arquivo: "tier_list_de_animais_que_venceria_na_porrada.jpeg" },
  { nome: "Tier list de coisas que dão raiva", arquivo: "tier_list_de_coisas_que_dao_raiva.jpeg" },
  { nome: "Tier list de embalagem de cigarros", arquivo: "tier_list_de_embalagem_de_cigarros.jpeg" },
  { nome: "Tier list de fobias", arquivo: "tier_list_de_fobias.jpeg" },
  { nome: "Tier list de janelas", arquivo: "tier_list_de_janelas.jpeg" },
  { nome: "Tier list de lugares para cagar", arquivo: "tier_list_de_lugares_para_cagar.jpeg" },
  { nome: "Tier list de macacos", arquivo: "tier_list_de_macacos.jpeg" }
];

function normalizarTexto(str) {
  return str
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim();
}

// Monta a caixa de sugestões (usado pelo modo tier list e pelo modo personagem)
function criarSugestoes(lista, valorInput, caixa, aoSelecionar) {
  const texto = normalizarTexto(valorInput);
  caixa.innerHTML = '';

  if (!texto) return;

  const encontrados = lista.filter(function(item) {
    return normalizarTexto(item.nome).indexOf(texto) !== -1;
  });

  encontrados.forEach(function(item) {
    const botao = document.createElement('button');
    botao.type = 'button';
    botao.textContent = item.nome;
    botao.onclick = function() {
      aoSelecionar(item);
    };
    caixa.appendChild(botao);
  });
}

let tierListSecreta = null;
let tentativasFoto = 0;
const maxTentativasFoto = 5;
let acertouFoto = false;

// Níveis de blur para cada tentativa (index 0 = antes de qualquer chute)
const niveisBlur = [20, 15, 10, 5, 0];

function iniciarJogoFoto() {
  tierListSecreta = tierLists[Math.floor(Math.random() * tierLists.length)];
  tentativasFoto = 0;
  acertouFoto = false;
  document.getElementById('corpoResultadosFoto').innerHTML = '';
  document.getElementById('palpiteFoto').value = '';
  document.getElementById('sugestoesFoto').innerHTML = '';

  const img = document.getElementById('fotoSecreta');
  img.style.filter = 'blur(' + niveisBlur[0] + 'px)';
  img.src = pastaFotos + tierListSecreta.arquivo;
}

function mostrarSugestoesFoto() {
  const input = document.getElementById('palpiteFoto');
  const caixa = document.getElementById('sugestoesFoto');
  criarSugestoes(tierLists, input.value, caixa, function(item) {
    input.value = item.nome;
    caixa.innerHTML = '';
    verificarFoto();
  });
}

function verificarFoto() {
  if (acertouFoto) return;

  const nome = document.getElementById('palpiteFoto').value.trim();
  if (!nome) return;

  const chute = tierLists.find(function(t) {
    return normalizarTexto(t.nome) === normalizarTexto(nome);
  });

  if (!chute) {
    alert('Tier list não encontrada!');
    return;
  }

  const linha = document.createElement('tr');
  const acertou = chute.nome === tierListSecreta.nome;
  linha.innerHTML = '<td class="' + (acertou ? 'certo' : 'errado') + '">' + chute.nome + '</td>';
  document.getElementById('corpoResultadosFoto').prepend(linha);

  document.getElementById('palpiteFoto').value = '';
  document.getElementById('sugestoesFoto').innerHTML = '';

  if (acertou) {
    acertouFoto = true;
    document.getElementById('fotoSecreta').style.filter = 'blur(0px)';
    tentativasFoto++;
    mostrarVitoriaFoto();
    return;
  }

  if (tentativasFoto < maxTentativasFoto - 1) {
    tentativasFoto++;
    document.getElementById('fotoSecreta').style.filter = 'blur(' + niveisBlur[tentativasFoto] + 'px)';
  } else {
    // Acabaram as 5 chances: a imagem já está no nível mais nítido definido,
    // mas o jogador pode continuar tentando (sem revelar o nome)
    tentativasFoto++;
  }
}

function mostrarVitoriaFoto() {
  document.getElementById('tituloVitoria').textContent = 'Você acertou:';
  document.getElementById('nomeAcertado').textContent = tierListSecreta.nome;
  document.getElementById('tentativasTexto').textContent = 'Número de tentativas: ' + tentativasFoto;
  const imgModal = document.getElementById('fotoAcertadaModal');
  imgModal.src = pastaFotos + tierListSecreta.arquivo;
  imgModal.classList.remove('oculto');
  abrirModalVitoria();
}

// Modo personagem (foto distorcida em vez de borrada)
// Para adicionar um personagem novo: colocar a foto na pasta "personagens/"
// e incluir { nome, arquivo } no array abaixo.
const pastaPersonagens = "personagens/";

const personagensFotos = [
  { nome: "Zaquel", arquivo: "zaquel.jpeg" },
  { nome: "Lésbicamovies", arquivo: "lesbicamovies.jpeg" },
  { nome: "Kekoisinhas", arquivo: "kekoisinhas.jpeg" },
  { nome: "Riruza", arquivo: "riruza.jpeg" },
  { nome: "Paulo Sergio", arquivo: "paulo_sergio.jpeg" },
  { nome: "Lucas Vargas", arquivo: "lucas_vargas.jpeg" },
  { nome: "GabrielSD", arquivo: "gabrielsd.jpeg" },
  { nome: "Heitor", arquivo: "heitor.jpeg" },
  { nome: "Felipe", arquivo: "felipe.jpeg" },
  { nome: "Eduardo", arquivo: "eduardo.jpeg" },
  { nome: "HugoGordao", arquivo: "hugo_gordao.jpeg" },
  { nome: "GoticoSulista", arquivo: "gotico_sulista.jpeg" },
  { nome: "Lyar", arquivo: "lyar.jpeg" },
  { nome: "Maduda", arquivo: "maduda.jpeg" },
  { nome: "Nakime", arquivo: "nakime.jpeg" },
  { nome: "Peixe Formiga", arquivo: "peixe_formiga.jpeg" },
  { nome: "Bruno", arquivo: "bruno.jpeg" },
  { nome: "Carol", arquivo: "carol.jpeg" },
  { nome: "Cellbit", arquivo: "cellbit.jpeg" },
  { nome: "Charlie Durk", arquivo: "charlie_durk.jpeg" },
  { nome: "Emma", arquivo: "emma.jpeg" },
  { nome: "Gabriel Ferreira", arquivo: "gabriel_ferreira.jpeg" },
  { nome: "Larissa", arquivo: "larissa.jpeg" },
  { nome: "Sonim", arquivo: "sonim.jpeg" },
  { nome: "Tal do Bambas", arquivo: "tal_do_bambas.jpeg" },
  { nome: "Tayronej", arquivo: "tayronej.jpeg" },
  { nome: "Transbooks", arquivo: "transbooks.jpeg" },
  { nome: "Zezinho", arquivo: "zezinho.jpeg" },
  { nome: "Jabal", arquivo: "jabal.jpeg" },
  { nome: "Jorzin", arquivo: "jorzin.jpeg" }
];

let personagemFotoSecreto = null;
let tentativasPersonagem = 0;
const maxTentativasPersonagem = 9;
const tentativasParaDica = 10;
let acertouPersonagem = false;
let dicaJaMostrada = false;

// Níveis de distorção (escala do feDisplacementMap) para cada tentativa
// (index 0 = antes de qualquer chute, último = imagem nítida)
const niveisDistorcao = [150, 120, 90, 75, 60, 45, 30, 15, 0];

function aplicarDistorcao(nivel) {
  document.querySelector('#filtroDistorcao feDisplacementMap').setAttribute('scale', nivel);
}

function iniciarJogoPersonagem() {
  personagemFotoSecreto = personagensFotos[Math.floor(Math.random() * personagensFotos.length)];
  tentativasPersonagem = 0;
  acertouPersonagem = false;
  dicaJaMostrada = false;
  document.getElementById('corpoResultadosPersonagem').innerHTML = '';
  document.getElementById('palpitePersonagem').value = '';
  document.getElementById('sugestoesPersonagem').innerHTML = '';

  const dica = document.getElementById('dicaPersonagem');
  dica.textContent = '';
  dica.classList.add('oculto');

  aplicarDistorcao(niveisDistorcao[0]);
  document.getElementById('fotoPersonagem').src = pastaPersonagens + personagemFotoSecreto.arquivo;
}

function mostrarSugestoesPersonagem() {
  const input = document.getElementById('palpitePersonagem');
  const caixa = document.getElementById('sugestoesPersonagem');
  criarSugestoes(personagensFotos, input.value, caixa, function(item) {
    input.value = item.nome;
    caixa.innerHTML = '';
    verificarPersonagem();
  });
}

function mostrarDicaPersonagem() {
  dicaJaMostrada = true;
  const dica = document.getElementById('dicaPersonagem');
  dica.textContent = personagemFotoSecreto.nome;
  dica.classList.remove('oculto');
}

function verificarPersonagem() {
  if (acertouPersonagem) return;

  const nome = document.getElementById('palpitePersonagem').value.trim();
  if (!nome) return;

  const chute = personagensFotos.find(function(p) {
    return normalizarTexto(p.nome) === normalizarTexto(nome);
  });

  if (!chute) {
    alert('Personagem não encontrado!');
    return;
  }

  const linha = document.createElement('tr');
  const acertou = chute.nome === personagemFotoSecreto.nome;
  linha.innerHTML = '<td class="' + (acertou ? 'certo' : 'errado') + '">' + chute.nome + '</td>';
  document.getElementById('corpoResultadosPersonagem').prepend(linha);

  document.getElementById('palpitePersonagem').value = '';
  document.getElementById('sugestoesPersonagem').innerHTML = '';

  if (acertou) {
    acertouPersonagem = true;
    aplicarDistorcao(0);
    tentativasPersonagem++;
    mostrarVitoriaPersonagem();
    return;
  }

  tentativasPersonagem++;

  if (tentativasPersonagem < maxTentativasPersonagem) {
    aplicarDistorcao(niveisDistorcao[tentativasPersonagem]);
  }

  if (tentativasPersonagem >= tentativasParaDica && !dicaJaMostrada) {
    mostrarDicaPersonagem();
  }
}

function mostrarVitoriaPersonagem() {
  document.getElementById('tituloVitoria').textContent = 'Você acertou:';
  document.getElementById('nomeAcertado').textContent = personagemFotoSecreto.nome;
  document.getElementById('tentativasTexto').textContent = 'Número de tentativas: ' + tentativasPersonagem;
  const imgModal = document.getElementById('fotoAcertadaModal');
  imgModal.src = pastaPersonagens + personagemFotoSecreto.arquivo;
  imgModal.classList.remove('oculto');
  abrirModalVitoria();
}

// Eventos do menu, do modo tier list e do modal de vitória
// (o modo clássico usa onclick/oninput direto no HTML)
document.getElementById('titulo').addEventListener('click', mostrarMenu);
document.getElementById('botaoTierlist').addEventListener('click', function() {
  mostrarPagina('tierlist');
});
document.getElementById('botaoPersonagem').addEventListener('click', function() {
  mostrarPagina('personagem');
});
document.getElementById('botaoPersonagemModal').addEventListener('click', function() {
  document.getElementById('overlayVitoria').classList.remove('ativo');
  mostrarPagina('personagem');
});
document.getElementById('botaoChutarFoto').addEventListener('click', verificarFoto);
document.getElementById('botaoFecharVitoria').addEventListener('click', fecharVitoria);
document.getElementById('palpiteFoto').addEventListener('input', mostrarSugestoesFoto);
document.getElementById('palpiteFoto').addEventListener('keydown', function(evento) {
  if (evento.key === 'Enter') {
    evento.preventDefault();
    verificarFoto();
  }
});
document.getElementById('botaoChutarPersonagem').addEventListener('click', verificarPersonagem);
document.getElementById('palpitePersonagem').addEventListener('input', mostrarSugestoesPersonagem);
document.getElementById('palpitePersonagem').addEventListener('keydown', function(evento) {
  if (evento.key === 'Enter') {
    evento.preventDefault();
    verificarPersonagem();
  }
});

// Efeito do som de foguete quando abre o modal de vitória
const somFoguete = new Audio('foguete.mp3');
