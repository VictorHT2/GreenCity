// Importando as funções necessárias do Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getFirestore, collection, addDoc, doc, updateDoc, getDoc, getDocs, serverTimestamp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

// Configuração do Firebase
const firebaseConfig = {
    apiKey: "AIzaSyDfObEb7L6mGjE2nrCXQvhv03kjZVO4sdw",
    authDomain: "green-city-8ef6b.firebaseapp.com",
    projectId: "green-city-8ef6b",
    storageBucket: "green-city-8ef6b.appspot.com",
    messagingSenderId: "624616315905",
    appId: "1:624616315905:web:ce74d73d8a7b33b3ac7400",
    measurementId: "G-C96WYV548C"
};

// Inicializando o Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Função para cadastrar fornecedor
class FornecedorController {
    constructor(db) {
        this.db = db; // Instância do Firestore
    }

    async cadastrarFornecedor() {
        // Obtendo valores dos campos do formulário
        
        try {
            // Adicionando o fornecedor ao banco de dados
            const docRef = await addDoc(collection(this.db, "fornecedores"), {
                nome: nome,
                cnpj: cnpj,
                telefone: telefone,
                email: email,
                status: status,
                criadoEm: serverTimestamp()
            });

            console.log("Fornecedor cadastrado com ID:", docRef.id);
            alert("Fornecedor cadastrado com sucesso!");

            // Limpando os campos do formulário
            this.limparFormulario();

            // Recarregando a lista de fornecedores
            this.carregarFornecedores();

        } catch (error) {
            console.error("Erro ao cadastrar fornecedor:", error);
            alert("Erro ao cadastrar fornecedor. Tente novamente.");
        }
    }

    limparFormulario() {
        document.getElementById('nome').value = "";
        document.getElementById('cnpj').value = "";
        document.getElementById('telefone').value = "";
        document.getElementById('email').value = "";
        document.getElementById('status').value = "";
    }

    async carregarFornecedores() {
        // Função de carregamento de fornecedores (pode ser adaptada ou implementada aqui)
        console.log("Carregar fornecedores chamado");
    }
}

// Inicializando o controlador
const fornecedorController = new FornecedorController(db);

// Associando os métodos da classe aos botões no HTML
document.getElementById('salvar-fornecedor').addEventListener('click', () => {
    fornecedorController.cadastrarFornecedor();
});


// Função para carregar os dados do fornecedor para edição
window.carregarFornecedorParaEdicao = async function(idFornecedor) {
    const fornecedorRef = doc(db, "fornecedores", idFornecedor);
    const fornecedorDoc = await getDoc(fornecedorRef);

    if (fornecedorDoc.exists()) {
        const fornecedor = fornecedorDoc.data();

        // Preencher o formulário com os dados do fornecedor
        document.getElementById('nome').value = fornecedor.nome;
        document.getElementById('cnpj').value = fornecedor.cnpj;
        document.getElementById('telefone').value = fornecedor.telefone;
        document.getElementById('email').value = fornecedor.email;
        document.getElementById('status').value = fornecedor.status;

        // Armazenar o ID do fornecedor para edição
        document.getElementById('form-cadastro').setAttribute('data-id', fornecedorDoc.id);

        // Alterar o botão para editar
        document.getElementById('salvar-fornecedor').style.display = 'none';  // Esconde o botão de salvar
        document.getElementById('editar-fornecedor').style.display = 'block';  // Exibe o botão de editar
    } else {
        alert("Fornecedor não encontrado.");
    }
}

// Função de edição de fornecedor
window.editarFornecedor = async function() {
    const idFornecedor = document.getElementById('form-cadastro').getAttribute('data-id');

    if (!idFornecedor) {
        alert("Nenhum fornecedor selecionado para editar.");
        return;
    }

    const nome = document.getElementById('nome').value;
    const cnpj = document.getElementById('cnpj').value;
    const telefone = document.getElementById('telefone').value;
    const email = document.getElementById('email').value;
    const status = document.getElementById('status').value;

    try {
        const fornecedorRef = doc(db, "fornecedores", idFornecedor);
        await updateDoc(fornecedorRef, {
            nome: nome,
            cnpj: cnpj,
            telefone: telefone,
            email: email,
            status: status
        });

        alert("Fornecedor atualizado com sucesso!");

        // Limpar os campos após a edição
        document.getElementById('nome').value = "";
        document.getElementById('cnpj').value = "";
        document.getElementById('telefone').value = "";
        document.getElementById('email').value = "";
        document.getElementById('status').value = "";

        // Remover o ID do fornecedor de edição
        document.getElementById('form-cadastro').removeAttribute('data-id');

        // Esconder o botão de editar e mostrar o botão de salvar
        document.getElementById('editar-fornecedor').style.display = 'none';
        document.getElementById('salvar-fornecedor').style.display = 'block';

        // Carregar novamente a lista de fornecedores
        carregarFornecedores();

    } catch (error) {
        console.error("Erro ao editar fornecedor:", error);
        alert("Erro ao editar fornecedor. Tente novamente.");
    }
}

// Função para carregar a lista de fornecedores
window.carregarFornecedores = async function() {
    const fornecedoresRef = collection(db, "fornecedores");
    const fornecedoresSnapshot = await getDocs(fornecedoresRef);
    const fornecedoresList = document.getElementById('lista-fornecedores');

    fornecedoresList.innerHTML = ""; // Limpa a lista antes de adicionar os novos itens

    fornecedoresSnapshot.forEach(doc => {
        const fornecedor = doc.data();
        const fornecedorItem = document.createElement('div');
        fornecedorItem.classList.add('fornecedor-item');
        fornecedorItem.innerHTML = `
            <strong>${fornecedor.nome}</strong><br>
            CNPJ: ${fornecedor.cnpj}<br>
            Telefone: ${fornecedor.telefone}<br>
            E-mail: ${fornecedor.email}<br>
            Status: ${fornecedor.status}<br>
            <button class="botao-editar" onclick="carregarFornecedorParaEdicao('${doc.id}')">Editar</button>
        `;
        fornecedoresList.appendChild(fornecedorItem);
    });
}

// Função de voltar para a tela inicial
window.voltarParaTelaInicial = function() {
    window.location.href = 'telainicial_admin.html';
}

// Carregar fornecedores ao iniciar
carregarFornecedores();


