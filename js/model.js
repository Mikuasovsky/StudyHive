const explicadoresDefault = [
  {
    id: 1,
    nome: "Ana Silva",
    disciplina: "Matemática",
    nivel: "Secundario",
    modalidade: "Presencial",
    preco: 20,
    descricao: "Explicadora com 5 anos de experiência.",
    horarios: ["Seg 10h-12h", "Qua 14h-16h"],
    classificacao: 4.7,
    localizacao: "Porto",
    email: "ana.silva@email.com"
  },
  {
    id: 2,
    nome: "Bruno Costa",
    disciplina: "Física",
    nivel: "Universitario",
    modalidade: "Online",
    preco: 25,
    descricao: "Doutorado em Física.",
    horarios: ["Ter 15h-17h", "Sex 10h-12h"],
    classificacao: 4.9,
    localizacao: "Lisboa",
    email: "bruno.costa@email.com"
  },
  {
    id: 3,
    nome: "Pedro Salgado",
    disciplina: "História",
    nivel: "Basico",
    modalidade: "Online",
    preco: 30,
    descricao: "Aprende a história comigo.",
    horarios: ["Seg 14h-16h", "Qua 10h-12h"],
    classificacao: 4.2,
    localizacao: "Coimbra",
    email: "pedro.salgado@email.com"
  },
  {
    id: 4,
    nome: "Américo Tomás",
    disciplina: "Ciencias",
    nivel: "Basico",
    modalidade: "Presencial",
    preco: 15,
    descricao: "Por que as estrelas não fazem miau? Porque astronomia.",
    horarios: ["Seg 09h-11h", "Qui 15h-17h"],
    classificacao: 4.1,
    localizacao: "Braga",
    email: "americo.tomas@email.com"
  },
  {
    id: 5,
    nome: "Jorge Nuno Pinto da Costa",
    disciplina: "Economia II",
    nivel: "Universitario",
    modalidade: "Presencial",
    preco: 45,
    descricao: "Aprende a contar os pontos.",
    horarios: ["Sex 10h-12h", "Sex 15h-17h"],
    classificacao: 4.8,
    localizacao: "Porto",
    email: "jorge.pdc@email.com"
  },
  {
    id: 6,
    nome: "Sónia Malhão",
    disciplina: "Português",
    nivel: "Secundario",
    modalidade: "Presencial",
    preco: 20,
    descricao: "Adoro Eça de Queirós.",
    horarios: ["Ter 09h-11h", "Qua 13h-15h"],
    classificacao: 4.6,
    localizacao: "Aveiro",
    email: "sonia.malhao@email.com"
  }
];

function getExplicadores() {
  const personalizados = JSON.parse(localStorage.getItem('explicadores')) || [];
  return explicadoresDefault.concat(personalizados);
}

if (!localStorage.getItem('explicadoresIniciaisGuardados')) {
  localStorage.setItem('explicadoresIniciaisGuardados', 'true');

  const explicadoresDefault = [ /* os teus explicadores fixos com disciplina */ ];

  const existentes = JSON.parse(localStorage.getItem('explicadores')) || [];
  const todos = existentes.concat(explicadoresDefault);

  localStorage.setItem('explicadores', JSON.stringify(todos));
}
