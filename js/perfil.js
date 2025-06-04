document.addEventListener('DOMContentLoaded', () => {
  const user = JSON.parse(localStorage.getItem('userLoggedIn'));
  const perfilInfo = document.getElementById('perfilInfo');

  if (!user || user.tipo !== 'aluno') {
    alert('Acesso restrito. Apenas alunos podem ver esta página.');
    window.location.href = 'home.html';
    return;
  }

  perfilInfo.innerHTML = `
    <div class="dataContainer">
        <p><strong>Nome:</strong> ${user.nome}</p>
        <p><strong>Tipo:</strong> ${user.tipo}</p>
    </div>
  `;

  const favoritosContainer = document.getElementById('favoritosList');
  const favoritos = JSON.parse(localStorage.getItem('favoritos')) || [];

  if (favoritos.length === 0) {
    favoritosContainer.innerHTML = "<p class='text-center'>Nenhum explicador nos favoritos.</p>";
  } else {
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
            <p class="card-text"><strong>Classificação:</strong> ${explicador.classificacao || "N/A"} ⭐</p>
            <p class="card-text"><strong>Localização:</strong> ${explicador.localizacao || "N/A"}</p>
            <a href="${rotaLink}" target="_blank" class="btn btn-sm btn-outline-secondary">Ver no Google Maps</a>
            <button class="btn btn-sm btn-danger mt-2" onclick="removerFavorito(${index})">Remover</button>
          </div>
        </div>
      `;
      favoritosContainer.appendChild(card);
    });
  }
});

function removerFavorito(index) {
  const favoritos = JSON.parse(localStorage.getItem('favoritos')) || [];
  favoritos.splice(index, 1);
  localStorage.setItem('favoritos', JSON.stringify(favoritos));
  location.reload();
}
