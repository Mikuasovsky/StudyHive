function renderExplicadores(lista) {
  const container = document.getElementById('results');
  container.innerHTML = '';

  lista.forEach(explicador => {
    const rotaLink = explicador.localizacao
      ? `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(explicador.localizacao)}`
      : null;

    const card = document.createElement('div');
    card.className = 'col-md-4';

    card.innerHTML = `
      <div class="card h-100">
        <div class="card-body">
          <h5 class="card-title">${explicador.nome}</h5>
          <p class="card-text">${explicador.descricao || "Sem descrição."}</p>
          <p class="card-text"><strong>Disciplina:</strong> ${explicador.disciplina}</p>
          <p class="card-text"><strong>Modalidade:</strong> ${explicador.modalidade}</p>
          <p class="card-text"><strong>Preço:</strong> €${explicador.preco}</p>
          <p class="card-text"><strong>Horários:</strong> ${explicador.horarios?.join(', ') || "Não especificado"}</p>
          <p class="card-text"><strong>Email:</strong> ${explicador.email || "Não disponível"}</p>
          <p class="card-text"><strong>Localização:</strong> ${explicador.localizacao || "Não especificada"}</p>
          <p class="card-text"><strong>Classificação:</strong> ${explicador.classificacao || "N/A"} ⭐</p>

          <a href="mailto:${explicador.email}" onclick="adicionarPontos(10)" class="btn btn-sm btn-outline-success mt-2">
            Contactar por Email
          </a>

          <button class="btn btn-outline-primary mt-2"
                  data-bs-toggle="modal"
                  data-bs-target="#marcacaoModal"
                  data-explicador='${JSON.stringify(explicador).replace(/'/g, "'")}'>
            Marcar Explicação
          </button>

          <button class="btn btn-outline-primary mt-2" onclick='addFavorito(${JSON.stringify(explicador)})'>
            Favoritar
          </button>

          ${rotaLink ? `<a href="${rotaLink}" target="_blank" class="btn btn-outline-secondary btn-sm">Ver Rota no Google Maps</a>` : ""}
        </div>
      </div>
    `;
    container.appendChild(card);
  });
}

function addFavorito(explicador) {
  const user = JSON.parse(localStorage.getItem('userLoggedIn'));
  if (!user || user.tipo !== 'aluno') {
    showToast('⚠️ Apenas alunos podem favoritar explicadores.', 'bg-warning');
    return;
  }

  let favoritos = JSON.parse(localStorage.getItem('favoritos')) || [];

  const jaFavoritado = favoritos.some(f => 
    f.email === explicador.email && f.alunoEmail === user.email
  );

  if (jaFavoritado) {
    showToast('⚠️ Você já favoritou este explicador.', 'bg-warning');
    return;
  }

  const favoritoComAluno = {
    ...explicador,
    alunoEmail: user.email,
    dataAdicao: new Date().toLocaleDateString('pt-PT')
  };

  favoritos.push(favoritoComAluno);
  localStorage.setItem('favoritos', JSON.stringify(favoritos));
  adicionarPontos(5);
  showToast('✅ Explicador adicionado aos favoritos!', 'bg-success');
}

function showToast(mensagem = '✅ Explicador adicionado aos favoritos!', cor = 'bg-success') {
  const toastContainer = document.getElementById('favoritoToast');
  const toastCard = document.getElementById('toastCard');
  const toastMsg = document.getElementById('toastMessage');

  toastMsg.innerText = mensagem;
  toastCard.className = `card text-white ${cor} shadow`;
  toastContainer.style.display = 'block';

  setTimeout(() => {
    toastContainer.style.display = 'none';
  }, 3000);
}

function fecharToast() {
  document.getElementById('favoritoToast').style.display = 'none';
}

const modal = document.getElementById('marcacaoModal');
if (modal) {
  modal.addEventListener('show.bs.modal', function (event) {
    const button = event.relatedTarget;
    const explicador = JSON.parse(button.getAttribute('data-explicador'));
    
    const hoje = new Date().toISOString().split('T')[0];
    const dataInput = document.getElementById('dataExplicacao');
    dataInput.min = hoje;
    dataInput.value = hoje;
    
    document.getElementById('explicadorEmailSelecionado').value = explicador.email;
    document.getElementById('nomeExplicadorSelecionado').innerText = explicador.nome;
  });
}

document.getElementById('formMarcacao').addEventListener('submit', function (e) {
  e.preventDefault();
  
  const dataInput = document.getElementById('dataExplicacao');
  const data = dataInput.value;
  const hora = document.getElementById('horaExplicacao').value;
  const mensagem = document.getElementById('mensagem').value;
  const emailExplicador = document.getElementById('explicadorEmailSelecionado').value;
  const nomeExplicador = document.getElementById('nomeExplicadorSelecionado').textContent;
  
  
  const hoje = new Date();
  const dataSelecionada = new Date(data);
  
  
  hoje.setHours(0, 0, 0, 0);
  dataSelecionada.setHours(0, 0, 0, 0);
  
  if (dataSelecionada < hoje) {
    showToast('⚠️ Por favor, selecione uma data igual ou posterior a hoje.', 'bg-warning');
    dataInput.focus();
    return;
  }
  

  const user = JSON.parse(localStorage.getItem('userLoggedIn'));
  
  if (!user) {
    alert('Por favor, faça login para marcar uma explicação.');
    window.location.href = 'login.html';
    return;
  }
  
  const pedidoMarcacao = {
    id: Date.now(), 
    idExplicador: emailExplicador,
    nomeExplicador: nomeExplicador,
    idAluno: user.email,
    nomeAluno: user.nome,
    data: data,
    hora: hora,
    mensagem: mensagem,
    status: 'pendente',
    dataPedido: new Date().toISOString()
  };
  
  
  const pedidos = JSON.parse(localStorage.getItem('pedidosMarcacao')) || [];
  pedidos.push(pedidoMarcacao);
  localStorage.setItem('pedidosMarcacao', JSON.stringify(pedidos));
  
 
  showToast(`✅ Pedido de explicação enviado para ${nomeExplicador}`, 'bg-success');
  
  
  const modalEl = bootstrap.Modal.getInstance(modal);
  modalEl.hide();
  
  
  e.target.reset();
});