function adicionarPontos(valor) {
  const user = JSON.parse(localStorage.getItem('userLoggedIn'));
  if (!user || user.tipo !== 'aluno') return;

  const ultima = parseInt(localStorage.getItem('ultimoContacto') || 0);
  const agora = Date.now();

  if (valor === 10 && agora - ultima < 10000) return; // 10s cooldown para contacto

  user.pontos = (user.pontos || 0) + valor;
  localStorage.setItem('userLoggedIn', JSON.stringify(user));

  if (valor === 10) {
    localStorage.setItem('ultimoContacto', agora);
  }
}

