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