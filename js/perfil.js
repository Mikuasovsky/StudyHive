document.addEventListener('DOMContentLoaded', () => {
  const user = JSON.parse(localStorage.getItem('userLoggedIn'));
  if (!user || user.tipo !== 'aluno') {
    alert('Acesso restrito. Apenas alunos podem ver esta página.');
    window.location.href = 'home.html';
    return;
  }

  const pontos = user.pontos || 0;
  const nivel = getNivel(pontos);

  
  document.getElementById('perfilNome').textContent = user.nome || 'Não informado';
  document.getElementById('perfilEmail').textContent = user.email || 'Não informado';
  document.getElementById('perfilTipo').textContent = user.tipo === 'aluno' ? 'Aluno' : 'Explicador';
  document.getElementById('perfilPontos').textContent = pontos;
  document.getElementById('perfilNivel').textContent = nivel;

  if (pontos >= 50 && !user.conquistaExpert) {
    alert("🎉 Conquista desbloqueada: Expert da Aprendizagem!");
    user.conquistaExpert = true;
    localStorage.setItem('userLoggedIn', JSON.stringify(user));
  }

  renderFavoritos();
});

function getNivel(pontos) {
  if (pontos >= 100) return "Mestre dos Estudos";
  if (pontos >= 50) return "Expert";
  if (pontos >= 20) return "Explorador";
  return "Iniciante";
}

function renderFavoritos() {
  const container = document.getElementById('favoritosList');
  const favoritos = JSON.parse(localStorage.getItem('favoritos')) || [];

  if (favoritos.length === 0) {
    container.innerHTML = "<p class='text-center'>Nenhum explicador nos favoritos.</p>";
    return;
  }

  favoritos.forEach((explicador, index) => {
    const rotaLink = explicador.localizacao
      ? `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(explicador.localizacao)}`
      : "#";

    const card = document.createElement('div');
    card.className = 'col-md-4';
    card.innerHTML = `
      <div class="card h-100">
        <div class="card-body">
          <h5 class="card-title">${explicador.nome}</h5>
          <p class="card-text"><strong>Disciplina:</strong> ${explicador.disciplina}</p>
          <p class="card-text"><strong>Preço:</strong> €${explicador.preco}</p>
          <p class="card-text"><strong>Classificação:</strong> ${explicador.classificacao} ⭐</p>
          <p class="card-text"><strong>Localização:</strong> ${explicador.localizacao}</p>
          <a href="mailto:${explicador.email}" onclick="adicionarPontos(10)" class="btn btn-sm btn-outline-success mt-2">
            Contactar por Email
          </a>
          <a href="${rotaLink}" target="_blank" class="btn btn-sm btn-outline-secondary">Ver no Google Maps</a>
          <button class="btn btn-sm btn-danger mt-2" onclick="removerFavorito(${index})">Remover</button>
        </div>
      </div>
    `;
    container.appendChild(card);
  });
}

function removerFavorito(index) {
  const favoritos = JSON.parse(localStorage.getItem('favoritos')) || [];
  favoritos.splice(index, 1);
  localStorage.setItem('favoritos', JSON.stringify(favoritos));
  location.reload();
}
