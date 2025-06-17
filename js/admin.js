// ---------------- DISCIPLINAS ----------------
let disciplinas = JSON.parse(localStorage.getItem('disciplinas')) || ['Matemática', 'Física', 'Português'];

function renderDisciplinas() {
  const lista = document.getElementById('listaDisciplinas');
  lista.innerHTML = '';
  disciplinas.forEach((d, index) => {
    const item = document.createElement('li');
    item.className = 'list-group-item d-flex justify-content-between align-items-center';
    item.innerHTML = `
      ${d}
      <button onclick="removerDisciplina(${index})" class="btn btn-danger btn-sm">Remover</button>
    `;
    lista.appendChild(item);
  });
}

function removerDisciplina(index) {
  disciplinas.splice(index, 1);
  localStorage.setItem('disciplinas', JSON.stringify(disciplinas));
  renderDisciplinas();
}

document.getElementById('addDisciplinaForm').addEventListener('submit', function(e){
  e.preventDefault();
  const nova = document.getElementById('novaDisciplina').value.trim();
  if (nova) {
    disciplinas.push(nova);
    localStorage.setItem('disciplinas', JSON.stringify(disciplinas));
    renderDisciplinas();
    document.getElementById('novaDisciplina').value = '';
  }
});

renderDisciplinas();

// ---------------- NÍVEIS ----------------
let niveis = JSON.parse(localStorage.getItem('niveis')) || ['Basico', 'Secundario', 'Universitario'];

function renderNiveis() {
  const lista = document.getElementById('listaNiveis');
  lista.innerHTML = '';
  niveis.forEach((n, index) => {
    const item = document.createElement('li');
    item.className = 'list-group-item d-flex justify-content-between align-items-center';
    item.innerHTML = `
      ${n}
      <button onclick="removerNivel(${index})" class="btn btn-danger btn-sm">Remover</button>
    `;
    lista.appendChild(item);
  });
}

function removerNivel(index) {
  niveis.splice(index, 1);
  localStorage.setItem('niveis', JSON.stringify(niveis));
  renderNiveis();
}

document.getElementById('addNivelForm').addEventListener('submit', function(e){
  e.preventDefault();
  const novo = document.getElementById('novoNivel').value.trim();
  if (novo) {
    niveis.push(novo);
    localStorage.setItem('niveis', JSON.stringify(niveis));
    
    // Dispara um evento de storage para atualizar outras abas/páginas
    const event = new Event('storage');
    event.key = 'niveis';
    window.dispatchEvent(event);
    
    renderNiveis();
    document.getElementById('novoNivel').value = '';
    
    // Mostra mensagem de sucesso
    alert('Nível adicionado com sucesso!');
  }
});

renderNiveis();

// ---------------- GERENCIAR ALUNOS ----------------
function carregarAlunos() {
  const todosUsuarios = JSON.parse(localStorage.getItem('utilizadores')) || [];
  const tbody = document.getElementById('tabelaAlunos');
  tbody.innerHTML = '';

  const alunos = todosUsuarios.filter(usuario => usuario.tipo === 'aluno');
  
  const filtro = document.getElementById('filtroAlunos').value.toLowerCase();
  const alunosFiltrados = alunos.filter(aluno => 
    (aluno.nome && aluno.nome.toLowerCase().includes(filtro)) ||
    (aluno.email && aluno.email.toLowerCase().includes(filtro))
  );

  if (alunosFiltrados.length === 0) {
    tbody.innerHTML = '<tr><td colspan="5" class="text-center">Nenhum aluno encontrado</td></tr>';
    return;
  }

  alunosFiltrados.forEach(aluno => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${aluno.nome || 'N/A'}</td>
      <td>${aluno.email || 'N/A'}</td>
      <td>${aluno.dataRegisto || 'N/A'}</td>
      <td>${aluno.pontos || '0'}</td>
      <td>
        <button onclick="removerUsuario('${aluno.email}', 'aluno')" class="btn btn-danger btn-sm">
          <i class="fas fa-trash"></i> Remover
        </button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}


function carregarExplicadores() {
  
  const explicadores = JSON.parse(localStorage.getItem('explicadores')) || [];
  const usuarios = JSON.parse(localStorage.getItem('utilizadores')) || [];
  const tbody = document.getElementById('tabelaExplicadores');
  tbody.innerHTML = '';

 
  const filtro = document.getElementById('filtroExplicadores').value.toLowerCase();
  

  const emailsExplicadores = new Set(explicadores.map(e => e.email));
  
  
  usuarios.forEach(usuario => {
    if (usuario.tipo === 'explicador' && !emailsExplicadores.has(usuario.email)) {
      explicadores.push({
        nome: usuario.nome,
        email: usuario.email,
        semPerfil: true 
      });
    }
  });
  

  const explicadoresFiltrados = explicadores.filter(explicador => {

    if (explicador.semPerfil) {
      return filtro === '' || 
             (explicador.nome && explicador.nome.toLowerCase().includes(filtro)) ||
             (explicador.email && explicador.email.toLowerCase().includes(filtro));
    }
    

    return (explicador.nome && explicador.nome.toLowerCase().includes(filtro)) ||
           (explicador.email && explicador.email.toLowerCase().includes(filtro)) ||
           (explicador.disciplina && (Array.isArray(explicador.disciplina) ? 
             explicador.disciplina.some(d => d && d.toLowerCase().includes(filtro)) : 
             (explicador.disciplina || '').toLowerCase().includes(filtro)));
  });

  if (explicadoresFiltrados.length === 0) {
    tbody.innerHTML = '<tr><td colspan="6" class="text-center">Nenhum explicador encontrado</td></tr>';
    return;
  }

  explicadoresFiltrados.sort((a, b) => {
    if (a.semPerfil && !b.semPerfil) return 1;
    if (!a.semPerfil && b.semPerfil) return -1;
    return 0;
  });

  explicadoresFiltrados.forEach(explicador => {
    const tr = document.createElement('tr');
    
    if (explicador.semPerfil) {
      tr.classList.add('table-warning');
      tr.title = 'Conta de explicador sem perfil criado';
    }
    
    tr.innerHTML = `
      <td>${explicador.nome || 'N/A'}</td>
      <td>${explicador.email || 'N/A'}</td>
      <td>${explicador.semPerfil ? '<span class="badge bg-warning text-dark">Sem perfil</span>' : 
            (Array.isArray(explicador.disciplina) ? 
              explicador.disciplina.filter(Boolean).join(', ') : 
              (explicador.disciplina || 'N/A'))}</td>
      <td>${explicador.preco ? `€${explicador.preco}/h` : 'N/A'}</td>
      <td>${explicador.classificacao || '0'} ⭐</td>
      <td>
        <button onclick="removerUsuario('${explicador.email}', 'explicador')" class="btn btn-sm btn-danger">
          <i class="fas fa-trash"></i> Remover
        </button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function removerUsuario(email, tipo) {
  if (!confirm(`Tem certeza que deseja remover este ${tipo}?`)) return;

  if (tipo === 'aluno') {
    let alunos = JSON.parse(localStorage.getItem('utilizadores')) || [];
    alunos = alunos.filter(a => a.email !== email);
    localStorage.setItem('utilizadores', JSON.stringify(alunos));
  } else if (tipo === 'explicador') {
    let explicadores = JSON.parse(localStorage.getItem('explicadores')) || [];
    explicadores = explicadores.filter(e => e.email !== email);
    localStorage.setItem('explicadores', JSON.stringify(explicadores));
    
    if (confirm('Deseja remover também a conta de usuário deste explicador?')) {
      let usuarios = JSON.parse(localStorage.getItem('utilizadores')) || [];
      usuarios = usuarios.filter(u => u.email !== email);
      localStorage.setItem('utilizadores', JSON.stringify(usuarios));
    }
  }
  
  carregarAlunos();
  carregarExplicadores();
  alert(`${tipo.charAt(0).toUpperCase() + tipo.slice(1)} removido com sucesso!`);
}

// ---------------- Pesquisas ----------------
function mostrarBuscas() {
  const tabela = document.getElementById('tabelaBuscas');
  const historico = JSON.parse(localStorage.getItem('historicoBuscas')) || [];

  if (historico.length === 0) {
    tabela.innerHTML = "<p>Nenhuma busca registada.</p>";
    return;
  }

  let html = `
    <table class="table table-striped">
      <thead>
        <tr>
          <th>Aluno</th>
          <th>Disciplina</th>
          <th>Nível</th>
          <th>Modalidade</th>
          <th>Data</th>
        </tr>
      </thead>
      <tbody>
  `;

  historico.forEach(b => {
    html += `
      <tr>
        <td>${b.aluno}</td>
        <td>${b.disciplina || '-'}</td>
        <td>${b.nivel || '-'}</td>
        <td>${b.modalidade || '-'}</td>
        <td>${b.data}</td>
      </tr>
    `;
  });

  html += "</tbody></table>";
  tabela.innerHTML = html;
}

mostrarBuscas();

carregarAlunos();
carregarExplicadores();

document.getElementById('filtroAlunos').addEventListener('input', carregarAlunos);
document.getElementById('filtroExplicadores').addEventListener('input', carregarExplicadores);

document.getElementById('limparHistorico').addEventListener('click', function () {
  if (confirm('Tem certeza que deseja limpar todo o histórico de buscas?')) {
    localStorage.removeItem('historicoBuscas');
    mostrarBuscas();
    alert('Histórico de buscas limpo com sucesso.');
  }
});
