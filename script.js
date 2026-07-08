const contas = []; // array de guardar as contas
let contaAtiva = null // constante que pega a conta selecionada


// pegando os inputs de cadastro
const formCadastro = document.getElementById("formCadastro")
const nomeTitular = document.getElementById("nomeTitular");
const numeroConta = document.getElementById("numeroConta");
const saldoInicial = document.getElementById("saldoInicial");
const erro = document.getElementById("erro");
const sucessoCadastro = document.getElementById("sucessoCadastro");

//pegar select de conta
const selectConta = document.getElementById("selectConta");

//campos da conta selecionada
const infoTitular = document.getElementById("infoTitular");
const infoSaldo = document.getElementById("infoSaldo");
const infoNumero = document.getElementById("infoNumero");

//botoes de operacao
const btnDeposito = document.getElementById("btnDeposito");
const btnSaque = document.getElementById("btnSaque");
const btnTransferir = document.getElementById("btnTransferir");

 
// Campos de operação
const valorOperacao = document.getElementById("valorOperacao");
const contaDestino = document.getElementById("contaDestino");
const erroOperacao = document.getElementById("erroOperacao");
const sucessoOperacao = document.getElementById("sucessoOperacao")
 
// Tabela de histórico
const listaHistorico = document.getElementById("listaHistorico");

//eventos
formCadastro.addEventListener("submit", cadastrarConta);
selectConta.addEventListener("change", selecionarConta);

btnDeposito.addEventListener("click", depositar);
btnSaque.addEventListener("click", sacar);
btnTransferir.addEventListener("click", transferir);

//funções


function cadastrarConta(event) { // função cadastro
    event.preventDefault(); // previnir evento padrão

    erro.textContent= ""; // limpando mensagem de erro

    //lendo valores digitados
    const nome = nomeTitular.value.trim();
    const numero = numeroConta.value.trim();
    const saldo = Number(saldoInicial.value.trim());

    if (nome === ""){
        erro.textContent = "digite o titular da conta."; //  verificando se não informou o nome
        return;
    }

    //verificação de numeros da conta
    if (numero === ""){
        erro.textContent = "Digite um numero da conta.";
        return;
    }
      const contaExiste = contas.find(conta => conta.numero === numero);
         if (contaExiste) {
        erro.textContent = "Essa conta já está cadastrada!";
        return;
    }

    //verificação dos dados de saldo
    if (isNaN(saldo) || saldo < 0) {
        erro.textContent = "Digite um saldo inicial válido.";
        return;
    }

    const novaConta = { //cadastro da novaConta
        nome: nome,
        numero: numero,
        saldo: saldo,
        historico: []
    };


    contas.push(novaConta); // coloca a nova conta no array contas
    console.log(contas); // veiricação de erro
    listarContas(); // chamando a função listarContas
    formCadastro.reset(); // limpando o formulario

    sucessoCadastro.textContent = "Conta cadastrada com sucesso.";
}

function listarContas(){ // funcao de listar a conta
    selectConta.innerHTML = ""; // limpando o select para não repetir o o que já foi cadastrado

    if(contas.length === 0){ // contando quantas contas tem
        const opcaoPadrao = document.createElement("option");
        opcaoPadrao.value = ""; // caso esteja vazia exibe a mensagem
        opcaoPadrao.textContent = " ---- Nenhuma conta cadastrada ----";
        selectConta.appendChild(opcaoPadrao);
        return;

    }

    const opacaoInicial = document.createElement("option");  // criando um elemento option, a opção inical é nula, não tem nada
    opacaoInicial.value = ""; 
    opacaoInicial.textContent = " ---- Selecione uma conta ----"; 
    selectConta.appendChild(opacaoInicial);

    for(const conta of contas){ // cria uma option para cada conta no array
        const opcao = document.createElement("option");
        opcao.value = conta.numero;
        opcao.textContent = conta.numero + " - " + conta.nome;
        selectConta.appendChild(opcao);

    }
}

function buscarConta(numero){ //buscar conta pelo numero 
    for(const conta of contas){
        if(conta.numero === numero){
            return conta;
        }
    }
    return null;
}

function selecionarConta(){ // função de selecionar a conta
    erroOperacao.textContent = ""; // esavaziando as mensagens de erro
    const numeroSelecionado = selectConta.value; // pegando o valor da conta selecionada

    if(numeroSelecionado === ""){ // se nenhuma conta foi selecionada

        contaAtiva = null;
        infoTitular.textContent = "nenhuma conta ativa";
        infoSaldo.textContent = "R$ 0,00";
        infoNumero.textContent = "selecione uma conta para realizar operação";

        exibirHistorico(); // chama a funçção exibir histórico e não exibe nada
        return;
    }
    contaAtiva = buscarConta(numeroSelecionado); // a conta ativa vai receber o numero da conta selecionada, vai atualizar p painel com os dad0s da conta

    atualizarPainel();

    exibirHistorico();// exibe o histórico dessa conta
}

function atualizarPainel(){ // função de atualizar o painel
    if(contaAtiva === null){ // se não for nenhuma, os valores não aparecem
        return;
    }

    infoTitular.textContent = contaAtiva.nome; // se não, exibe os dada contaAtiva
    infoNumero.textContent = `Conta número: ${contaAtiva.numero}`;
    infoSaldo.textContent = `R$ ${contaAtiva.saldo.toFixed(2)}`;

}

function validarValor(valor){ // evita repetição de ifs nas funções depositar, sacar, transferir
    if(isNaN(valor)){ // valor tem que ser um número
        return false;
    }

    if(valor <= 0){ // valor não pode ser menor ou igual a zero
        return false;
    }

    return true;

}

function depositar(){ // função depositar
    if(contaAtiva === null){ 
        erroOperacao.textContent = "selecione uma conta antes de operar.";
        return;
    }

    const valor = Number(valorOperacao.value); // pega o valor para depositar

    if (validarValor(valor) === false){
        erroOperacao.textContent = "digite um valor para fazer o deposito.";
        return;
    }

    contaAtiva.saldo += valor; // pega a conta ativa e adiciona o valor do deposito

    registrarHistorico(contaAtiva, "Depósito", valor); // registra o histórico

    atualizarPainel(); // atualiza o valor no painel
    exibirHistorico(); // exibe o histórico

    erroOperacao.textContent = ""
    valorOperacao.value = ""; // limpa a operação
    sucessoOperacao.textContent = "deposito realizado com sucesso"

}

function sacar(){ // função sacar
    erroOperacao.textContent = ""; // limpa o campo

    if (contaAtiva === null){
        erroOperacao.textContent = "Selecione um valor para operar";
        return;
    }
 
    const valor = Number(valorOperacao.value); // pega o valor que quer sacar

    if(validarValor(valor) === false){ // veirifca se é nulo
        erroOperacao.textContent = "digite um valor para saque";
        return;

    }

    if(valor > contaAtiva.saldo){ // verifica se o valor digitado é maior do que o que tem disponível
        erroOperacao.textContent = "Saldo insuficiente para o saque.";
        return;
    }

    contaAtiva.saldo -= valor; // se não for, tira o valor digitado do saldo

    // regustra, atualiza e exibe
    registrarHistorico(contaAtiva, "saque", valor);

    atualizarPainel();
    exibirHistorico();
    
    erroOperacao.textContent = ""
    valorOperacao.value = "";
    sucessoOperacao.textContent = "saque realizado com sucesso"
    
}

function transferir(){
    erroOperacao.textContent = "";

    if(contaAtiva === null){ // veirifica se não foi selecionado nenhuma conta
        erroOperacao.textContent = "selecione uma conta antes de realizar operações";
        return;
    }

    const valor = Number(valorOperacao.value); // pega o valor que vai transfir

    if(validarValor(valor) === false){ //verifica se o valor não foi selecionado
        erroOperacao.textContent = "digite um valor válido para a transferência";
        return;
    }

    const numeroDestino = contaDestino.value.trim(); // pega o numero da conta que vai ser realizada a transferencia

    if(numeroDestino === ""){
        erroOperacao.textContent = "digite o número da conta de destino";
        return;
    }

    if (numeroDestino === contaAtiva.numero) { // não transfere pra conta propria
        erroOperacao.textContent = "Não é possível transferir para a própria conta.";
        return;
    }

    const destino = buscarConta(numeroDestino); // busca a conta que vai ser transsferido

    if (destino === null){
        erroOperacao.textContent = "conta de destino não encontrada";
        return;
    }

    if(valor > contaAtiva.saldo){
        erroOperacao.textContent = "Saldo insuficiente para realizar a transferência.";
        return;
    }

    contaAtiva.saldo -= valor; // tira da conta que faz a transferencia

    destino.saldo += valor; // coloca na conta de destino

    //registra os históricos
    registrarHistorico(contaAtiva, `transferência enviada ${destino.numero}`, valor); 
    registrarHistorico(destino, `Transferencia recebida (Conta ${contaAtiva.numero})`, valor);

    infoSaldo.textContent = `R$: ${contaAtiva.saldo.toFixed(2)}`;
    exibirHistorico();

    valorOperacao.value = "";
    contaDestino.value = "";
    
    erroOperacao.textContent = ""
    sucessoOperacao.textContent = "transferência realizada com sucesso"
}

function registrarHistorico(conta, tipo, valor){ // função de registrar o histórioco
    const movimentacao ={ // pega todos os parametros de uma transação
        tipo: tipo,
        valor: valor,
        data: new Date().toLocaleString("pt-BR"),
        saldoFinal: conta.saldo

    };

    conta.historico.push(movimentacao);
}

function exibirHistorico(){ // função de exibir

    listaHistorico.innerHTML = ""; // limpa a tabela

    if(contaAtiva === null || contaAtiva.historico.length === 0){ //verifica se não tem conta ativa
        listaHistorico.innerHTML =`
        <tr>
            <td colspan="3">Nenhuma movimentação registrada.</td>
        </td> `;

        return;
    }

    for (let movimentacao of contaAtiva.historico){ // percorre todas as movimentações da contaAtiva slecionada
        const linha = document.createElement("tr"); // criando linhas na tabela

        //criando colunas
        const colunaTitular = document.createElement("td");
        colunaTitular.textContent = contaAtiva.nome;


        const colunaTipo = document.createElement("td"); 
        colunaTipo.textContent = movimentacao.tipo;

        const colunaValor = document.createElement("td");
        colunaValor.textContent = `R$: ${movimentacao.valor.toFixed(2)}`;

        const colunaData = document.createElement("td");
        colunaData.textContent = movimentacao.data;

        // Adiciona as três colunas na linha
        linha.appendChild(colunaTitular);
        linha.appendChild(colunaTipo);
        linha.appendChild(colunaValor);
        linha.appendChild(colunaData);

        listaHistorico.appendChild(linha); //adiciona a linha completa na tabela 
    }

}