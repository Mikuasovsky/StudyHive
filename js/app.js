document.getElementById('searchForm').addEventListener('submit', function(e){
  e.preventDefault();

  const disciplina = document.getElementById('disciplina').value.toLowerCase();
  const nivel = document.getElementById('nivel').value;
  const modalidade = document.getElementById('modalidade').value;

  const resultados = getExplicadores().filter(explicador => {
    return (
      (disciplina === '' || explicador.disciplina.toLowerCase().includes(disciplina)) &&
      (nivel === '' || explicador.nivel === nivel) &&
      (modalidade === '' || explicador.modalidade === modalidade)
    );
  });

  renderExplicadores(resultados);
});

// preencher o dropdown das disciplinas
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

//dropdown assim que carregar
preencherDisciplinasDropdown();
