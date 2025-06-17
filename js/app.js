document.getElementById('searchForm').addEventListener('submit', function (e) {
  e.preventDefault();

  const disciplina = document.getElementById('disciplina').value;
  const nivel = document.getElementById('nivel').value;
  const modalidade = document.getElementById('modalidade').value;
  const precoMax = parseFloat(document.getElementById('precoMax')?.value);
  const localidade = document.getElementById('localFiltro')?.value;

  const todos = getExplicadores();
  const filtrados = todos.filter(exp => {
    return (
      (!disciplina || exp.disciplina.toLowerCase().includes(disciplina.toLowerCase())) &&
      (!nivel || exp.nivel === nivel) &&
      (!modalidade || exp.modalidade === modalidade) &&
      (!precoMax || exp.preco <= precoMax) &&
      (!localidade || exp.localizacao.toLowerCase().includes(localidade.toLowerCase()))


    );
  });

  renderExplicadores(filtrados);

  // 🎯 HISTÓRICO DE BUSCAS
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
});




function preencherNiveisDropdown() {
  // Carrega os níveis do localStorage ou usa valores padrão
  const niveis = JSON.parse(localStorage.getItem('niveis')) || ['Básico', 'Secundário', 'Universitário'];
  const nivelSelect = document.getElementById('nivel');
  
  // Limpa opções existentes, mantendo apenas a primeira opção
  while (nivelSelect.options.length > 1) {
    nivelSelect.remove(1);
  }
  
  // Adiciona os níveis do localStorage
  niveis.forEach(nivel => {
    if (nivel && nivel.trim() !== '') {  // Verifica se o nível não está vazio
      const option = document.createElement('option');
      option.value = nivel;
      option.textContent = nivel;
      nivelSelect.appendChild(option);
    }
  });
}

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


// Inicializa os dropdowns quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', function() {
  preencherDisciplinasDropdown();
  preencherNiveisDropdown();
  
  // Atualiza os níveis quando houver mudanças no localStorage
  window.addEventListener('storage', function(event) {
    if (event.key === 'niveis') {
      preencherNiveisDropdown();
    }
  });
});
