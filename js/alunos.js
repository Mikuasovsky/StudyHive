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

          <a href="mailto:${explicador.email}" class="btn btn-sm btn-outline-success mt-2">Contactar por Email</a>
          <button class="btn btn-outline-primary mt-2" onclick='addFavorito(${JSON.stringify(explicador)})'>Favoritar</button>
          ${rotaLink ? `<a href="${rotaLink}" target="_blank" class="btn btn-outline-secondary btn-sm">Ver Rota no Google Maps</a>` : ""}
        </div>
      </div>
    `;
    container.appendChild(card);
  });
}

function addFavorito(explicador) {
  let favoritos = JSON.parse(localStorage.getItem('favoritos')) || [];
  favoritos.push(explicador);
  localStorage.setItem('favoritos', JSON.stringify(favoritos));
  alert('Adicionado aos favoritos!');
}
