document.addEventListener('DOMContentLoaded', () => {
  const user = JSON.parse(localStorage.getItem('userLoggedIn'));
  if (!user || user.tipo !== 'explicador') {
    alert('Acesso restrito. Apenas explicadores podem ver esta página.');
    window.location.href = 'home.html';
    return;
  }

  carregarPerfilExplicador(user.email);
  carregarAlunos(user.email);
  atualizarEstatisticas(user.email);
});

function carregarPerfilExplicador(email) {
  console.log('Buscando perfil para o email:', email);
  const explicadores = JSON.parse(localStorage.getItem('explicadores')) || [];
  console.log('Todos os explicadores no localStorage:', explicadores);
  
  const meuPerfil = explicadores.find(e => e && e.email === email);
  console.log('Perfil encontrado:', meuPerfil);
  
  const conteudoPerfil = document.getElementById('conteudoPerfil');
  const semPerfil = document.getElementById('semPerfil');
  
  if (meuPerfil) {
    semPerfil.style.display = 'none';
    
    const horariosFormatados = Array.isArray(meuPerfil.horarios) 
      ? meuPerfil.horarios.join(', ') 
      : (meuPerfil.horarios || 'Não especificado');
    
    conteudoPerfil.innerHTML = `
      <div class="row">
        <div class="col-12">
          <h4>${meuPerfil.nome || 'Nome não informado'}</h4>
          <p class="text-muted">${meuPerfil.disciplina || 'Disciplina não informada'}</p>
          <p><strong>Modalidade:</strong> ${meuPerfil.modalidade || 'Não especificada'}</p>
          <p><strong>Localização:</strong> ${meuPerfil.localizacao || 'Não informada'}</p>
          <p><strong>Horários:</strong> ${horariosFormatados}</p>
          <p><strong>Preço:</strong> €${meuPerfil.preco || '0'}/hora</p>
          <p><strong>Classificação:</strong> ${meuPerfil.classificacao || '0'} ⭐</p>
          <p><strong>Descrição:</strong><br>${meuPerfil.descricao || 'Nenhuma descrição fornecida.'}</p>
        </div>
      </div>
    `;
  } else {
    semPerfil.style.display = 'block';
  }
}

function carregarAlunos(emailExplicador) {
  console.log('Carregando alunos para o explicador:', emailExplicador);
  const favoritos = JSON.parse(localStorage.getItem('favoritos')) || [];
  console.log('Todos os favoritos:', favoritos);
  
  const favoritosDesteExplicador = favoritos.filter(fav => fav.email === emailExplicador);
  console.log('Favoritos deste explicador:', favoritosDesteExplicador);
  
  const meusAlunos = [];
  const alunos = JSON.parse(localStorage.getItem('utilizadores')) || [];
  
  favoritosDesteExplicador.forEach(fav => {
    if (fav.alunoEmail) {
      const aluno = alunos.find(a => a.email === fav.alunoEmail);
      if (aluno) {
        meusAlunos.push({
          nome: aluno.nome,
          email: aluno.email,
          dataAdicao: fav.dataAdicao || 'Data não disponível'
        });
      }
    }
  });
  
  console.log('Alunos encontrados:', meusAlunos);
  
  const listaAlunos = document.getElementById('listaAlunos');
  
  if (meusAlunos.length > 0) {
    const alunosUnicos = Array.from(new Map(meusAlunos.map(item => [item.email, item])).values());
    
    listaAlunos.innerHTML = `
      <div class="table-responsive">
        <table class="table table-hover">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Email</th>
              <th>Adicionado em</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            ${alunosUnicos.map(aluno => `
              <tr>
                <td>${aluno.nome}</td>
                <td>${aluno.email}</td>
                <td>${aluno.dataAdicao}</td>
                <td>
                  <a href="mailto:${aluno.email}" class="btn btn-sm btn-outline-primary">
                    <i class="fas fa-envelope"></i> Email
                  </a>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
    
    document.getElementById('totalAlunos').textContent = alunosUnicos.length;
  } else {
    listaAlunos.innerHTML = `
      <div class="text-center py-5">
        <i class="fas fa-user-graduate fa-3x text-muted mb-3"></i>
        <p class="text-muted">Nenhum aluno adicionou você aos favoritos ainda.</p>
      </div>
    `;
    document.getElementById('totalAlunos').textContent = '0';
  }
}

function atualizarEstatisticas(emailExplicador) {
  const marcacoes = JSON.parse(localStorage.getItem('marcacoes')) || [];
  const minhasAulas = marcacoes.filter(m => m.email === emailExplicador);
  
  document.getElementById('totalAulas').textContent = minhasAulas.length;
  
  const explicadores = JSON.parse(localStorage.getItem('explicadores')) || [];
  const meuPerfil = explicadores.find(e => e.email === emailExplicador);
  
  if (meuPerfil && typeof meuPerfil.classificacao === 'number') {
    document.getElementById('avaliacaoMedia').innerHTML = `
      ${meuPerfil.classificacao.toFixed(1)} 
      ${'⭐'.repeat(Math.round(meuPerfil.classificacao))}
    `;
  }
}

setInterval(() => {
  const user = JSON.parse(localStorage.getItem('userLoggedIn'));
  if (user && user.tipo === 'explicador') {
    carregarAlunos(user.email);
    atualizarEstatisticas(user.email);
  }
}, 30000);
