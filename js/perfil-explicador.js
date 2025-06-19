document.addEventListener('DOMContentLoaded', () => {
  const user = JSON.parse(localStorage.getItem('userLoggedIn'));
  if (!user || user.tipo !== 'explicador') {
    alert('Acesso restrito. Apenas explicadores podem ver esta página.');
    window.location.href = 'home.html';
    return;
  }

  carregarPerfilExplicador(user.email);
  carregarAlunos(user.email);
  carregarPedidosMarcacao(user.email);
  atualizarEstatisticas(user.email);
  

  setInterval(() => {
    carregarPedidosMarcacao(user.email);
    atualizarEstatisticas(user.email);
  }, 30000);
});

function carregarPerfilExplicador(email) {
  console.log('Buscando perfil para o email:', email);
  const explicadores = JSON.parse(localStorage.getItem('explicadores')) || [];
  console.log('Todos os explicadores no localStorage:', explicadores);
  
  const meuPerfil = explicadores.find(e => e && e.email === email);
  console.log('Perfil encontrado:', meuPerfil);
  
  const conteudoPerfil = document.getElementById('conteudoPerfil');
  const semPerfil = document.getElementById('semPerfil');
  
  if (meuPerfil) {
    semPerfil.style.display = 'none';
    
    const horariosFormatados = Array.isArray(meuPerfil.horarios) 
      ? meuPerfil.horarios.join(', ') 
      : (meuPerfil.horarios || 'Não especificado');
    
    conteudoPerfil.innerHTML = `
      <div class="row">
        <div class="col-12">
          <h4>${meuPerfil.nome || 'Nome não informado'}</h4>
          <p class="text-muted">${meuPerfil.disciplina || 'Disciplina não informada'}</p>
          <p><strong>Modalidade:</strong> ${meuPerfil.modalidade || 'Não especificada'}</p>
          <p><strong>Localização:</strong> ${meuPerfil.localizacao || 'Não informada'}</p>
          <p><strong>Horários:</strong> ${horariosFormatados}</p>
          <p><strong>Preço:</strong> €${meuPerfil.preco || '0'}/hora</p>
          <p><strong>Classificação:</strong> ${meuPerfil.classificacao || '0'} ⭐</p>
          <p><strong>Descrição:</strong><br>${meuPerfil.descricao || 'Nenhuma descrição fornecida.'}</p>
        </div>
      </div>
    `;
  } else {
    semPerfil.style.display = 'block';
  }
}

function carregarAlunos(emailExplicador) {
  console.log('Carregando alunos para o explicador:', emailExplicador);
  const favoritos = JSON.parse(localStorage.getItem('favoritos')) || [];
  console.log('Todos os favoritos:', favoritos);
  
  const favoritosDesteExplicador = favoritos.filter(fav => fav.email === emailExplicador);
  console.log('Favoritos deste explicador:', favoritosDesteExplicador);
  
  const meusAlunos = [];
  const alunos = JSON.parse(localStorage.getItem('utilizadores')) || [];
  
  favoritosDesteExplicador.forEach(fav => {
    if (fav.alunoEmail) {
      const aluno = alunos.find(a => a.email === fav.alunoEmail);
      if (aluno) {
        meusAlunos.push({
          nome: aluno.nome,
          email: aluno.email,
          dataAdicao: fav.dataAdicao || 'Data não disponível'
        });
      }
    }
  });
  
  console.log('Alunos encontrados:', meusAlunos);
  
  const listaAlunos = document.getElementById('listaAlunos');
  
  if (meusAlunos.length > 0) {
    const alunosUnicos = Array.from(new Map(meusAlunos.map(item => [item.email, item])).values());
    
    listaAlunos.innerHTML = `
      <div class="table-responsive">
        <table class="table table-hover">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Email</th>
              <th>Adicionado em</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            ${alunosUnicos.map(aluno => `
              <tr>
                <td>${aluno.nome}</td>
                <td>${aluno.email}</td>
                <td>${aluno.dataAdicao}</td>
                <td>
                  <a href="mailto:${aluno.email}" class="btn btn-sm btn-outline-primary">
                    <i class="fas fa-envelope"></i> Email
                  </a>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
    
    document.getElementById('totalAlunos').textContent = alunosUnicos.length;
  } else {
    listaAlunos.innerHTML = `
      <div class="text-center py-5">
        <i class="fas fa-user-graduate fa-3x text-muted mb-3"></i>
        <p class="text-muted">Nenhum aluno adicionou você aos favoritos ainda.</p>
      </div>
    `;
    document.getElementById('totalAlunos').textContent = '0';
  }
}

function carregarPedidosMarcacao(emailExplicador) {
  const pedidosContainer = document.getElementById('pedidosMarcacaoContainer');
  if (!pedidosContainer) return;
  
  const pedidos = JSON.parse(localStorage.getItem('pedidosMarcacao')) || [];
  const meusPedidos = pedidos
    .filter(pedido => pedido.idExplicador === emailExplicador && pedido.status === 'pendente')
    .sort((a, b) => new Date(a.dataPedido) - new Date(b.dataPedido));
  
  if (meusPedidos.length > 0) {
    pedidosContainer.innerHTML = `
      <div class="card mb-4">
        <div class="card-header bg-warning text-dark">
          <h3 class="mb-0">Pedidos de Marcação Pendentes</h3>
        </div>
        <div class="card-body">
          <div class="table-responsive">
            <table class="table table-hover">
              <thead>
                <tr>
                  <th>Aluno</th>
                  <th>Data</th>
                  <th>Hora</th>
                  <th>Mensagem</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                ${meusPedidos.map(pedido => `
                  <tr>
                    <td>${pedido.nomeAluno}</td>
                    <td>${new Date(pedido.data).toLocaleDateString('pt-PT')}</td>
                    <td>${pedido.hora}</td>
                    <td>${pedido.mensagem || 'Sem mensagem'}</td>
                    <td>
                      <button class="btn btn-sm btn-success me-1" onclick="atualizarStatusPedido(${pedido.id}, 'aceite')">
                        <i class="fas fa-check"></i> Aceitar
                      </button>
                      <button class="btn btn-sm btn-danger" onclick="atualizarStatusPedido(${pedido.id}, 'rejeitado')">
                        <i class="fas fa-times"></i> Recusar
                      </button>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;
  } else {
    pedidosContainer.innerHTML = `
      <div class="alert alert-info">
        <i class="fas fa-info-circle me-2"></i>
        Não há pedidos de marcação pendentes no momento.
      </div>
    `;
  }
}

function atualizarStatusPedido(pedidoId, novoStatus) {
  const pedidos = JSON.parse(localStorage.getItem('pedidosMarcacao')) || [];
  const pedidoIndex = pedidos.findIndex(p => p.id === pedidoId);
  
  if (pedidoIndex !== -1) {
    pedidos[pedidoIndex].status = novoStatus;
    localStorage.setItem('pedidosMarcacao', JSON.stringify(pedidos));
    
    
    const user = JSON.parse(localStorage.getItem('userLoggedIn'));
    if (user && user.tipo === 'explicador') {
      carregarPedidosMarcacao(user.email);
      atualizarEstatisticas(user.email);
      
      
      const toast = new bootstrap.Toast(document.getElementById('statusToast'));
      const toastMessage = document.getElementById('toastMessage');
      
      if (novoStatus === 'aceite') {
        toastMessage.textContent = 'Pedido aceite com sucesso!';
        toastMessage.parentElement.className = 'toast-header bg-success text-white';
      } else {
        toastMessage.textContent = 'Pedido recusado.';
        toastMessage.parentElement.className = 'toast-header bg-danger text-white';
      }
      
      toast.show();
    }
  }
}

function atualizarEstatisticas(emailExplicador) {
 
  const pedidos = JSON.parse(localStorage.getItem('pedidosMarcacao')) || [];
  const totalAulas = pedidos.filter(p => p.idExplicador === emailExplicador && p.status === 'aceite').length;
  document.getElementById('totalAulas').textContent = totalAulas;
  

  const explicadores = JSON.parse(localStorage.getItem('explicadores')) || [];
  const meuPerfil = explicadores.find(e => e.email === emailExplicador);
  
  if (meuPerfil) {
   
    if (typeof meuPerfil.classificacao === 'number') {
      document.getElementById('avaliacaoMedia').innerHTML = `
        ${meuPerfil.classificacao.toFixed(1)} 
        ${'⭐'.repeat(Math.round(meuPerfil.classificacao))}
      `;
    }
    
    
    const alunosUnicos = new Set();
    pedidos
      .filter(p => p.idExplicador === emailExplicador)
      .forEach(p => alunosUnicos.add(p.idAluno));
      
    document.getElementById('totalAlunos').textContent = alunosUnicos.size;
  }
}

setInterval(() => {
  const user = JSON.parse(localStorage.getItem('userLoggedIn'));
  if (user && user.tipo === 'explicador') {
    carregarAlunos(user.email);
    atualizarEstatisticas(user.email);
  }
}, 30000);
