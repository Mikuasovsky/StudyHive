function loadNavbar() {
    fetch('navbar.html')
      .then(response => response.text())
      .then(data => {
        document.getElementById('navbar-placeholder').innerHTML = data;
        checkAuth(); // Só depois da navbar ser carregada, verifica autenticação
      });
  }
  
  function checkAuth() {
    const user = JSON.parse(localStorage.getItem('userLoggedIn'));
    if (!user) {
      window.location.href = 'home.html'; // Se não estiver logado, volta para Home
    } else {
      document.getElementById('userName').textContent = `Olá, ${user.nome} (${user.tipo})`;
    }
  }
  
  function logout() {
    localStorage.removeItem('userLoggedIn');
    alert('Sessão terminada.');
    window.location.href = 'home.html';
  }
  