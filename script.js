
var botaoTema = document.getElementById('botaoTema');

// quando a página abre, usa o tema que ficou salvo
if (localStorage.getItem('tema') === 'escuro') {
  document.body.classList.add('escuro');
}

botaoTema.addEventListener('click', function () {
  document.body.classList.toggle('escuro');

  if (document.body.classList.contains('escuro')) {
    localStorage.setItem('tema', 'escuro');
  } else {
    localStorage.setItem('tema', 'claro');
  }
});



function pegarCarrinho() {
  var texto = localStorage.getItem('carrinho');
  if (texto) {
    return JSON.parse(texto);
  }
  return [];
}

function salvarCarrinho(carrinho) {
  localStorage.setItem('carrinho', JSON.stringify(carrinho));
  atualizarContador();
}

function adicionarItem(nome, preco) {
  var carrinho = pegarCarrinho();
  var achou = false;

  for (var i = 0; i < carrinho.length; i++) {
    if (carrinho[i].nome === nome) {
      carrinho[i].quantidade = carrinho[i].quantidade + 1;
      achou = true;
    }
  }

  if (!achou) {
    carrinho.push({ nome: nome, preco: preco, quantidade: 1 });
  }

  salvarCarrinho(carrinho);
}

function removerItem(nome) {
  var carrinho = pegarCarrinho();
  var removeu = false;

  for (var i = 0; i < carrinho.length; i++) {
    if (carrinho[i].nome === nome) {
      carrinho[i].quantidade = carrinho[i].quantidade - 1;
      removeu = true;
      if (carrinho[i].quantidade <= 0) {
        carrinho.splice(i, 1);
      }
      break;
    }
  }

  salvarCarrinho(carrinho);
  return removeu;
}


function atualizarContador() {
  var contador = document.getElementById('contadorCarrinho');
  var carrinho = pegarCarrinho();
  var total = 0;

  for (var i = 0; i < carrinho.length; i++) {
    total = total + carrinho[i].quantidade;
  }

  contador.textContent = total;
  if (total > 0) {
    contador.classList.add('ativo');
  } else {
    contador.classList.remove('ativo');
  }
}

atualizarContador();


function formatarPreco(valor) {
  return 'R$ ' + valor.toFixed(2).replace('.', ',');
}



var caixaAviso = document.createElement('div');
caixaAviso.className = 'aviso';
document.body.appendChild(caixaAviso);
var tempoAviso;

function mostrarAviso(texto) {
  caixaAviso.textContent = texto;
  caixaAviso.classList.add('mostrar');
  clearTimeout(tempoAviso);
  tempoAviso = setTimeout(function () {
    caixaAviso.classList.remove('mostrar');
  }, 1800);
}



var botoesMais = document.querySelectorAll('.botao-mais');
var botoesMenos = document.querySelectorAll('.botao-menos');

for (var i = 0; i < botoesMais.length; i++) {
  botoesMais[i].addEventListener('click', function () {
    var nome = this.getAttribute('data-nome');
    var preco = parseFloat(this.getAttribute('data-preco'));
    adicionarItem(nome, preco);
    mostrarAviso(nome + ' adicionado ao carrinho!');
  });
}

for (var j = 0; j < botoesMenos.length; j++) {
  botoesMenos[j].addEventListener('click', function () {
    var nome = this.getAttribute('data-nome');
    if (removerItem(nome)) {
      mostrarAviso(nome + ' removido do carrinho.');
    } else {
      mostrarAviso(nome + ' não está no carrinho.');
    }
  });
}



var campoBusca = document.getElementById('campoBusca');


function normalizar(texto) {
  texto = texto.toLowerCase();
  texto = texto.replace(/[áàãâ]/g, 'a').replace(/[éê]/g, 'e').replace(/[í]/g, 'i');
  texto = texto.replace(/[óõô]/g, 'o').replace(/[ú]/g, 'u').replace(/[ç]/g, 'c');
  return texto;
}

if (campoBusca) {
  campoBusca.addEventListener('input', function () {
    var procurado = normalizar(campoBusca.value.trim());
    var bebidas = document.querySelectorAll('.bebida');
    var encontradas = 0;

    for (var i = 0; i < bebidas.length; i++) {
      var nome = normalizar(bebidas[i].getAttribute('data-nome'));
      if (nome.indexOf(procurado) !== -1) {
        bebidas[i].style.display = '';
        encontradas++;
      } else {
        bebidas[i].style.display = 'none';
      }
    }

    var semResultado = document.getElementById('semResultado');
    if (encontradas === 0) {
      semResultado.classList.add('mostrar');
    } else {
      semResultado.classList.remove('mostrar');
    }
  });
}



function mascaraCPF(valor) {
  valor = valor.replace(/\D/g, '');            
  valor = valor.substring(0, 11);              
  valor = valor.replace(/(\d{3})(\d)/, '$1.$2');
  valor = valor.replace(/(\d{3})(\d)/, '$1.$2');
  valor = valor.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  return valor;                                
}

function mascaraTelefone(valor) {
  valor = valor.replace(/\D/g, '');
  valor = valor.substring(0, 11);
  if (valor.length > 10) {
    valor = valor.replace(/(\d{2})(\d{5})(\d{1,4})/, '($1) $2-$3');   
  } else if (valor.length > 6) {
    valor = valor.replace(/(\d{2})(\d{4})(\d{1,4})/, '($1) $2-$3');   
  } else if (valor.length > 2) {
    valor = valor.replace(/(\d{2})(\d{1,4})/, '($1) $2');
  } else if (valor.length > 0) {
    valor = valor.replace(/(\d{1,2})/, '($1');
  }
  return valor;
}

function mascaraNome(valor) {
  valor = valor.replace(/[^A-Za-zÀ-ÿ ]/g, '');  
  valor = valor.replace(/ {2,}/g, ' ');        
  return valor;
}

function mascaraEmail(valor) {
  return valor.replace(/\s/g, '').toLowerCase(); 
}

var camposComMascara = document.querySelectorAll('[data-mascara]');

for (var k = 0; k < camposComMascara.length; k++) {
  camposComMascara[k].addEventListener('input', function () {
    var tipo = this.getAttribute('data-mascara');
    var novoValor = this.value;
    if (tipo === 'cpf') novoValor = mascaraCPF(this.value);
    if (tipo === 'telefone') novoValor = mascaraTelefone(this.value);
    if (tipo === 'nome') novoValor = mascaraNome(this.value);
    if (tipo === 'email') novoValor = mascaraEmail(this.value);

    
    if (novoValor !== this.value) {
      this.value = novoValor;
    }
  });
}


function emailValido(email) {
  return email.indexOf('@') > 0 && email.lastIndexOf('.') > email.indexOf('@') + 1 &&
         email.lastIndexOf('.') < email.length - 1;
}

function mostrarMensagem(texto, tipo) {
  var mensagem = document.getElementById('mensagem');
  mensagem.textContent = texto;
  mensagem.className = 'mensagem ' + tipo;
}


var botoesSociais = document.querySelectorAll('[data-aviso]');
for (var b = 0; b < botoesSociais.length; b++) {
  botoesSociais[b].addEventListener('click', function () {
    mostrarMensagem('Essa opção ainda está em desenvolvimento.', 'erro');
  });
}



var formCadastro = document.getElementById('formCadastro');

if (formCadastro) {
  formCadastro.addEventListener('submit', function (evento) {
    evento.preventDefault();   

    var nome = document.getElementById('nome').value.trim();
    var cpf = document.getElementById('cpf').value;
    var telefone = document.getElementById('telefone').value;
    var endereco = document.getElementById('endereco').value.trim();
    var email = document.getElementById('email').value;
    var senha = document.getElementById('senha').value;

    if (nome === '' || cpf === '' || telefone === '' || endereco === '' || email === '' || senha === '') {
      mostrarMensagem('Preencha todos os campos.', 'erro');
    } else if (nome.length < 3) {
      mostrarMensagem('Digite seu nome completo.', 'erro');
    } else if (cpf.length !== 14) {
      mostrarMensagem('CPF incompleto. Use o formato 000.000.000-00.', 'erro');
    } else if (telefone.length < 14) {
      mostrarMensagem('Telefone incompleto.', 'erro');
    } else if (!emailValido(email)) {
      mostrarMensagem('Digite um email válido.', 'erro');
    } else if (senha.length < 6) {
      mostrarMensagem('A senha precisa ter pelo menos 6 caracteres.', 'erro');
    } else {
      var usuario = {
        nome: nome, cpf: cpf, telefone: telefone,
        endereco: endereco, email: email, senha: senha
      };
      localStorage.setItem('usuario', JSON.stringify(usuario));
      mostrarMensagem('Cadastro feito com sucesso! Indo para o login...', 'sucesso');
      formCadastro.reset();
      setTimeout(function () {
        window.location.href = 'login.html';
      }, 1500);
    }
  });
}



var formLogin = document.getElementById('formLogin');

if (formLogin) {
  formLogin.addEventListener('submit', function (evento) {
    evento.preventDefault();

    var email = document.getElementById('loginEmail').value;
    var senha = document.getElementById('loginSenha').value;
    var usuario = JSON.parse(localStorage.getItem('usuario'));

    if (email === '' || senha === '') {
      mostrarMensagem('Preencha o email e a senha.', 'erro');
    } else if (!usuario) {
      mostrarMensagem('Nenhuma conta cadastrada. Faça seu cadastro primeiro.', 'erro');
    } else if (usuario.email !== email || usuario.senha !== senha) {
      mostrarMensagem('Email ou senha incorretos.', 'erro');
    } else {
      localStorage.setItem('logado', 'sim');
      mostrarMensagem('Bem-vindo(a), ' + usuario.nome + '!', 'sucesso');
      setTimeout(function () {
        window.location.href = 'index.html';
      }, 1200);
    }
  });
}



var formPerfil = document.getElementById('formPerfil');

if (formPerfil) {
  formPerfil.addEventListener('submit', function (evento) {
    evento.preventDefault();

    var usuario = JSON.parse(localStorage.getItem('usuario'));
    var novoNome = document.getElementById('novoNome').value.trim();
    var novoTelefone = document.getElementById('novoTelefone').value;
    var novoEndereco = document.getElementById('novoEndereco').value.trim();
    var novoEmail = document.getElementById('novoEmail').value;
    var senhaAtual = document.getElementById('senhaAtual').value;
    var novaSenha = document.getElementById('novaSenha').value;

    if (!usuario) {
      mostrarMensagem('Você ainda não tem cadastro.', 'erro');
    } else if (senhaAtual !== usuario.senha) {
      mostrarMensagem('Digite sua senha atual corretamente para alterar a conta.', 'erro');
    } else if (novoTelefone !== '' && novoTelefone.length < 14) {
      mostrarMensagem('Telefone incompleto.', 'erro');
    } else if (novoEmail !== '' && !emailValido(novoEmail)) {
      mostrarMensagem('Digite um email válido.', 'erro');
    } else if (novaSenha !== '' && novaSenha.length < 6) {
      mostrarMensagem('A nova senha precisa ter pelo menos 6 caracteres.', 'erro');
    } else {
      // só troca o que foi preenchido
      if (novoNome !== '') usuario.nome = novoNome;
      if (novoTelefone !== '') usuario.telefone = novoTelefone;
      if (novoEndereco !== '') usuario.endereco = novoEndereco;
      if (novoEmail !== '') usuario.email = novoEmail;
      if (novaSenha !== '') usuario.senha = novaSenha;

      localStorage.setItem('usuario', JSON.stringify(usuario));
      formPerfil.reset();
      mostrarMensagem('Conta atualizada com sucesso!', 'sucesso');
    }
  });
}



var listaProdutos = document.getElementById('listaProdutos');
var itemSelecionado = '';

function mostrarCarrinho() {
  var carrinho = pegarCarrinho();
  var molho = document.getElementById('molho');
  var total = 0;
  var html = '';

  if (carrinho.length === 0) {
    html = '<div class="produto">SEU CARRINHO ESTÁ VAZIO</div>';
  }

  for (var i = 0; i < carrinho.length; i++) {
    var item = carrinho[i];
    var subtotal = item.preco * item.quantidade;
    total = total + subtotal;

    var classe = 'produto';
    if (item.nome === itemSelecionado) classe = 'produto selecionado';

    html = html + '<div class="' + classe + '" data-nome="' + item.nome + '">' +
           '<span>' + item.nome.toUpperCase() + '</span>' +
           '<span class="qtd-preco">' + item.quantidade + 'x ' + formatarPreco(subtotal) + '</span>' +
           '</div>';
  }

  listaProdutos.innerHTML = html;

  if (carrinho.length > 0) {
    total = total + parseFloat(molho.value);
  }
  document.getElementById('totalPagar').textContent = formatarPreco(total);


  var produtos = listaProdutos.querySelectorAll('.produto[data-nome]');
  for (var p = 0; p < produtos.length; p++) {
    produtos[p].addEventListener('click', function () {
      itemSelecionado = this.getAttribute('data-nome');
      mostrarCarrinho();
    });
  }
}

if (listaProdutos) {
  var selectMolho = document.getElementById('molho');


  if (localStorage.getItem('molho')) {
    selectMolho.value = localStorage.getItem('molho');
  }

  selectMolho.addEventListener('change', function () {
    localStorage.setItem('molho', selectMolho.value);
    mostrarCarrinho();
  });

  document.getElementById('botaoRemover').addEventListener('click', function () {
    var carrinho = pegarCarrinho();

    if (carrinho.length === 0) {
      mostrarMensagem('O carrinho já está vazio.', 'erro');
      return;
    }


    if (itemSelecionado === '') {
      itemSelecionado = carrinho[carrinho.length - 1].nome;
    }

    removerItem(itemSelecionado);
    mostrarMensagem('Uma unidade de ' + itemSelecionado + ' foi removida.', 'sucesso');

  
    var aindaTem = false;
    var novoCarrinho = pegarCarrinho();
    for (var i = 0; i < novoCarrinho.length; i++) {
      if (novoCarrinho[i].nome === itemSelecionado) aindaTem = true;
    }
    if (!aindaTem) itemSelecionado = '';

    mostrarCarrinho();
  });

  document.getElementById('botaoConfirmar').addEventListener('click', function () {
    if (pegarCarrinho().length === 0) {
      mostrarMensagem('Adicione algum item antes de continuar.', 'erro');
    } else {
      window.location.href = 'pagamento.html';
    }
  });

  mostrarCarrinho();
}



var formasPagamento = document.querySelectorAll('.forma-pagamento');

for (var f = 0; f < formasPagamento.length; f++) {
  formasPagamento[f].addEventListener('click', function () {
    localStorage.setItem('formaPagamento', this.getAttribute('data-forma'));
    window.location.href = 'concluido.html';
  });
}



var estrelas = document.querySelectorAll('.estrela');
var nota = 0;

function pintarEstrelas(quantidade) {
  for (var i = 0; i < estrelas.length; i++) {
    if (i < quantidade) {
      estrelas[i].src = 'img/estrela-cheia.png';
      estrelas[i].classList.add('cheia');
    } else {
      estrelas[i].src = 'img/estrela.png';
      estrelas[i].classList.remove('cheia');
    }
  }
}

if (estrelas.length > 0) {

  localStorage.removeItem('carrinho');
  localStorage.removeItem('molho');
  atualizarContador();

  for (var e = 0; e < estrelas.length; e++) {
    estrelas[e].addEventListener('mouseover', function () {
      pintarEstrelas(parseInt(this.getAttribute('data-valor')));
    });
    estrelas[e].addEventListener('mouseout', function () {
      pintarEstrelas(nota);
    });
    estrelas[e].addEventListener('click', function () {
      nota = parseInt(this.getAttribute('data-valor'));
      pintarEstrelas(nota);
    });
  }

  document.getElementById('botaoEnviar').addEventListener('click', function () {
    if (nota === 0) {
      mostrarMensagem('Escolha de 1 a 5 estrelas.', 'erro');
    } else {
      localStorage.setItem('avaliacao', nota);
      mostrarMensagem('Obrigado pela sua avaliação de ' + nota + ' estrela(s)!', 'sucesso');
    }
  });
}
