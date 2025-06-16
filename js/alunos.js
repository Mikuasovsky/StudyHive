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
                  data-explicador='${JSON.stringify(explicador)}'>
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
  let favoritos = JSON.parse(localStorage.getItem('favoritos')) || [];

  const duplicado = favoritos.some(f => f.nome === explicador.nome && f.email === explicador.email);
  if (duplicado) {
    showToast('⚠️ Este explicador já está nos favoritos.', 'bg-warning');
    return;
  }

  favoritos.push(explicador);
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

let explicadorSelecionado = null;
let marcacaoModal = null;

// Inicializa o modal quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', function() {
  // Inicializa o modal
  const modalElement = document.getElementById('marcacaoModal');
  if (modalElement) {
    marcacaoModal = new bootstrap.Modal(modalElement);
    
    // Captura os dados ao abrir o modal
    modalElement.addEventListener('show.bs.modal', function (event) {
      const button = event.relatedTarget;
      const explicadorData = button.getAttribute('data-explicador');
      
      if (explicadorData) {
        try {
          const explicador = JSON.parse(explicadorData);
          explicadorSelecionado = explicador;
          
          document.getElementById('explicadorNome').textContent = `Explicador: ${explicador.nome}`;
          document.getElementById('dataMarcacao').value = '';
          document.getElementById('horaMarcacao').value = '';
        } catch (e) {
          console.error('Erro ao processar dados do explicador:', e);
        }
      }
    });
    
    // Limpa os dados quando o modal é fechado
    modalElement.addEventListener('hidden.bs.modal', function () {
      explicadorSelecionado = null;
      document.getElementById('marcacaoForm').reset();
    });
  }
  
  // Configura o evento de submissão do formulário
  const form = document.getElementById('marcacaoForm');
  if (form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      marcarExplicacao();
    });
  }
});

// 🟥 Processa marcação
function marcarExplicacao() {
  if (!explicadorSelecionado) {
    alert('Erro: Nenhum explicador selecionado.');
    return;
  }

  const dataElement = document.getElementById('dataMarcacao');
  const horaElement = document.getElementById('horaMarcacao');
  
  const data = dataElement.value;
  const hora = horaElement.value;
  
  if (!data) {
    alert('Por favor, selecione uma data!');
    dataElement.focus();
    return;
  }
  
  if (!hora) {
    alert('Por favor, selecione um horário!');
    horaElement.focus();
    return;
  }

  try {
    const user = JSON.parse(localStorage.getItem('userLoggedIn'));
    const marcacoes = JSON.parse(localStorage.getItem('marcacoes')) || [];
    
    marcacoes.push({
      explicador: explicadorSelecionado.nome,
      email: explicadorSelecionado.email,
      aluno: user?.nome || "Anônimo",
      data: data,
      hora: hora,
      disciplina: explicadorSelecionado.disciplina
    });

    localStorage.setItem('marcacoes', JSON.stringify(marcacoes));
    
    // Exibe mensagem de sucesso
    showToast(`✅ Aula marcada com ${explicadorSelecionado.nome} para ${data} às ${hora}`, 'bg-success');
    
    // Fecha o modal
    if (marcacaoModal) {
      marcacaoModal.hide();
    }
    
  } catch (error) {
    console.error('Erro ao marcar explicação:', error);
    showToast('❌ Erro ao marcar a explicação. Tente novamente.', 'bg-danger');
  }
}
