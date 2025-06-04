document.getElementById('registerForm').addEventListener('submit', function(e){
  e.preventDefault();

  const nome = document.getElementById('nome').value;
  const disciplinas = document.getElementById('disciplinas').value;
  const preco = parseFloat(document.getElementById('preco').value);
  const modalidade = document.getElementById('modalidadeReg').value;
  const localizacao = document.getElementById('localizacao').value;
  const horarios = document.getElementById('horarios').value.split(',').map(h => h.trim()); 
  const email = document.getElementById('email').value;
  const classificacao = parseFloat((Math.random() * 2 + 3).toFixed(1));
 

  const novoExplicador = {
    nome,
    disciplina: disciplinas,
    preco,
    modalidade,
    localizacao,
    horarios,
    email,
    classificacao

  };

  console.log('Novo explicador:', novoExplicador);
  alert('Cadastro Criado!');
});
