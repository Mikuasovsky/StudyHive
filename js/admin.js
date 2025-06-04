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
    renderNiveis();
    document.getElementById('novoNivel').value = '';
  }
});

renderNiveis();

// ---------------- BUSCAS ----------------
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
