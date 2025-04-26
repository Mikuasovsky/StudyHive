function renderExplicadores(lista) {
    const container = document.getElementById('results');
    container.innerHTML = '';
  
    lista.forEach(explicador => {
      const card = document.createElement('div');
      card.className = 'col-md-4';
      card.innerHTML = `
        <div class="card h-100">
          <div class="card-body">
            <h5 class="card-title">${explicador.nome}</h5>
            <p class="card-text">${explicador.descricao}</p>
            <p class="card-text"><strong>Disciplina:</strong> ${explicador.disciplina}</p>
            <p class="card-text"><strong>Modalidade:</strong> ${explicador.modalidade}</p>
            <p class="card-text"><strong>Preço:</strong> €${explicador.preco}</p>
            <button class="btn btn-outline-primary" onclick='addFavorito(${JSON.stringify(explicador)})'>Favoritar</button>
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