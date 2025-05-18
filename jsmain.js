const SENHA_CORRETA = "teste"; // ⚠️ Altere isso pra algo mais seguro
let humorSelecionado = null;

function verificarLogin() {
  if (localStorage.getItem("logado") === "sim") {
    document.getElementById("login-area").style.display = "none";
    document.getElementById("conteudo-diario").style.display = "block";
    carregarHistorico();
    if (localStorage.getItem("tema") === "dark") {
      document.body.classList.add("dark-mode");
    }
  } else {
    document.getElementById("login-area").style.display = "block";
    document.getElementById("conteudo-diario").style.display = "none";
  }
}

function logar() {
  const senhaDigitada = document.getElementById("senha-acesso").value;
  if (senhaDigitada === SENHA_CORRETA) {
    localStorage.setItem("logado", "sim");
    location.reload();
  } else {
    alert("Senha incorreta!");
  }
}

function selecionarHumor(tipo, emoji) {
  humorSelecionado = { tipo, emoji };
  document.getElementById("mostrar-humor").innerHTML = `Você escolheu: <strong>${emoji}</strong>`;
}

function salvarRegistro() {
  const data = document.getElementById("data").value;
  const pan = document.getElementById("pan").value.trim();
  const distorcao = document.getElementById("distorcao").value;
  const descricao = document.getElementById("descricao").value.trim();
  const pensamentoAlt = document.getElementById("pensamento-alternativo").value.trim();

  if (!data || !pan || !pensamentoAlt) {
    alert("Por favor, preencha todos os campos obrigatórios.");
    return;
  }

  if (!humorSelecionado) {
    alert("Por favor, selecione seu humor antes de salvar.");
    return;
  }

  const registro = {
    data,
    ...humorSelecionado,
    pan,
    distorcao,
    descricao,
    pensamentoAlt
  };

  let registros = JSON.parse(localStorage.getItem("meuDiarioTCC") || "[]");
  registros.push(registro);
  localStorage.setItem("meuDiarioTCC", JSON.stringify(registros));

  alert("✅ Registro salvo com sucesso!");
  limparCampos();
  carregarHistorico();
}

function limparCampos() {
  document.getElementById("pan").value = "";
  document.getElementById("descricao").value = "";
  document.getElementById("pensamento-alternativo").value = "";
  document.getElementById("distorcao").selectedIndex = 0;
  document.getElementById("mostrar-humor").innerHTML = "";
  humorSelecionado = null;
}

function carregarHistorico() {
  const historicoDiv = document.getElementById("historico");
  historicoDiv.innerHTML = "";

  const registros = JSON.parse(localStorage.getItem("meuDiarioTCC") || "[]");

  registros.forEach(r => {
    const div = document.createElement("div");
    div.className = "registro " + r.tipo;

    div.innerHTML = `
      <strong>${r.data}</strong> - ${r.emoji}<br/>
      <b>Pensamento Automático:</b> ${r.pan}<br/>
      <b>Distorção:</b> ${r.distorcao || 'não identificada'}<br/>
      <b>Descrição:</b> ${r.descricao || 'sem descrição'}<br/>
      <b>Pensamento Alternativo:</b> ${r.pensamentoAlt}
      <hr/>
    `;
    historicoDiv.appendChild(div);
  });
}

async function exportarPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  const registros = JSON.parse(localStorage.getItem("meuDiarioTCC") || "[]");

  let texto = "Meu Diário TCC\n\n";
  registros.forEach((r, i) => {
    texto += `${i+1}. Data: ${r.data} - ${r.emoji}\n`;
    texto += `Pensamento Automático: ${r.pan}\n`;
    texto += `Distorção: ${r.distorcao || 'não identificada'}\n`;
    texto += `Descrição: ${r.descricao || 'sem descrição'}\n`;
    texto += `Pensamento Alternativo: ${r.pensamentoAlt}\n\n`;
  });

  doc.text(texto, 10, 10);
  doc.save("meu_diario_tcc.pdf");
}

function exportarJSON() {
  const registros = JSON.parse(localStorage.getItem("meuDiarioTCC") || "[]");
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(registros, null, 2));
  const downloadAnchorNode = document.createElement('a');
  downloadAnchorNode.setAttribute("href", dataStr);
  downloadAnchorNode.setAttribute("download", "meu_diario_tcc.json");
  document.body.appendChild(downloadAnchorNode);
  downloadAnchorNode.click();
  downloadAnchorNode.remove();
}

function alternarTema() {
  document.body.classList.toggle("dark-mode");
  localStorage.setItem("tema", document.body.classList.contains("dark-mode") ? "dark" : "light");
}
