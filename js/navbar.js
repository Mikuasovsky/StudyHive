function loadNavbar() {
    fetch('/elements/navbar.html')
      .then(response => response.text())
      .then(data => {
        document.getElementById('navbar-placeholder').innerHTML = data;
        checkAuth(); 
      });
  }
  
  function checkAuth() {
    const user = JSON.parse(localStorage.getItem('userLoggedIn'));
    if (!user) {
      window.location.href = 'home.html'; 
    } else {
      
      const userNameElement = document.getElementById('userName');
      if (userNameElement) {
        userNameElement.textContent = `Olá, ${user.nome} (${user.tipo})`;
      }
      
      
      const perfilLink = document.getElementById('perfilLink');
      if (perfilLink) {
        perfilLink.href = user.tipo === 'explicador' ? 'perfil-explicador.html' : 'perfil.html';
      }
    }
  }
  
  function logout() {
    localStorage.removeItem('userLoggedIn');
    alert('Sessão terminada.');
    window.location.href = 'home.html';
  }
  