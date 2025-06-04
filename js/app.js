document.getElementById('searchForm').addEventListener('submit', function(e){
  e.preventDefault();

  const disciplina = document.getElementById('disciplina').value.toLowerCase();
  const nivel = document.getElementById('nivel').value;
  const modalidade = document.getElementById('modalidade').value;
  const precoMax = parseFloat(document.getElementById('precoMax')?.value || 0);
  const localFiltro = document.getElementById('localFiltro')?.value.toLowerCase();

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
