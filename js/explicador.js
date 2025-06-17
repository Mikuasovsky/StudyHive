document.getElementById('registerForm').addEventListener('submit', function(e){
  e.preventDefault();

  const nome = document.getElementById('nome').value;
  const disciplinas = document.getElementById('disciplinas').value;
  const preco = parseFloat(document.getElementById('preco').value);
  const modalidade = document.getElementById('modalidadeReg').value;
  const localizacao = document.getElementById('localizacao').value;
  const horarios = document.getElementById('horarios').value.split(',').map(h => h.trim());
  const email = document.getElementById('email').value;
  const descricao = document.getElementById('descricao').value;
  const classificacao = parseFloat((Math.random() * 2 + 3).toFixed(1));

  const novoExplicador = {
    nome,
    disciplina: disciplinas,
    preco,
    modalidade,
    localizacao,
    horarios,
    classificacao,
    email,
    descricao
  };

  const explicadoresGuardados = JSON.parse(localStorage.getItem('explicadores')) || [];
  
  const perfisAtualizados = explicadoresGuardados.filter(e => e.email !== email);
  
  perfisAtualizados.push(novoExplicador);
  localStorage.setItem('explicadores', JSON.stringify(perfisAtualizados));

  const user = JSON.parse(localStorage.getItem('userLoggedIn'));
  if (user) {
    user.tipo = 'explicador';
    localStorage.setItem('userLoggedIn', JSON.stringify(user));
  }

  alert('Perfil de explicador atualizado com sucesso!');
  window.location.href = 'perfil-explicador.html';
});

document.addEventListener('DOMContentLoaded', () => {
  const disciplinasPadrao = [
    'Matemática',
    'Português',
    'Física',
    'Química',
    'Biologia',
    'Geografia',
    'História',
    'Inglês',
    'Filosofia',
    'Economia',
    'Programação',
    'Geometria',
  ];

  const lista = JSON.parse(localStorage.getItem('disciplinas')) || disciplinasPadrao;
  
  if (!localStorage.getItem('disciplinas')) {
    localStorage.setItem('disciplinas', JSON.stringify(disciplinasPadrao));
  }

  const select = document.getElementById('disciplinas');
  lista.forEach(d => {
    const opt = document.createElement('option');
    opt.value = d;
    opt.textContent = d;
    select.appendChild(opt);
  });
});