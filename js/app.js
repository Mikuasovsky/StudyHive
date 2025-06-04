document.getElementById('searchForm').addEventListener('submit', function (e) {
  e.preventDefault();

  const disciplina = document.getElementById('disciplina').value;
  const nivel = document.getElementById('nivel').value;
  const modalidade = document.getElementById('modalidade').value;
  const precoMax = document.getElementById('precoMax')?.value;
  const user = JSON.parse(localStorage.getItem('userLoggedIn'));

  if (user && user.tipo === 'aluno') {
    const historico = JSON.parse(localStorage.getItem('historicoBuscas')) || [];
    historico.push({
      aluno: user.nome,
      disciplina,
      nivel,
      modalidade,
      data: new Date().toLocaleString()
    });
    localStorage.setItem('historicoBuscas', JSON.stringify(historico));
  }

  const resultados = getExplicadores().filter(explicador => {
    return (
      (disciplina === '' || explicador.disciplina.toLowerCase().includes(disciplina)) &&
      (nivel === '' || explicador.nivel === nivel) &&
      (modalidade === '' || explicador.modalidade === modalidade) &&
      (!precoMax || explicador.preco <= precoMax) &&
      (!localFiltro || explicador.localizacao?.toLowerCase().includes(localFiltro))
    );
  });

  renderExplicadores(resultados);
});



function preencherDisciplinasDropdown() {
  const disciplinas = JSON.parse(localStorage.getItem('disciplinas')) || ['Matemática', 'Física', 'Inglês','História','Ciencias','Economia II','Português'];
  const disciplinaSelect = document.getElementById('disciplina');

  disciplinas.forEach(d => {
    const option = document.createElement('option');
    option.value = d;
    option.textContent = d;
    disciplinaSelect.appendChild(option);
  });
}


preencherDisciplinasDropdown();
