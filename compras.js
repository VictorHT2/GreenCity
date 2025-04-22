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

class CompraController {
    constructor(db) {
        this.db = db; // Instância do Firestore
    }

    async cadastrarCompra() {
        // Obtendo valores dos campos do formulário
        const fornecedor = document.getElementById('fornecedor').value;
        const produto = document.getElementById('produto').value;
        const quantidade = document.getElementById('quantidade').value;

        try {
            // Adicionando a compra ao banco de dados
            const docRef = await addDoc(collection(this.db, "vendas"), {
                fornecedor: fornecedor,
                produto: produto,
                quantidade: quantidade,
                criadoEm: serverTimestamp()
            });

            console.log("Compra feita com ID:", docRef.id);
            alert("Compra realizada com sucesso!");

            // Limpando os campos do formulário
            this.limparFormulario();

            // Recarregando a lista de compras
            this.carregarVendas();

        } catch (error) {
            console.error("Erro ao realizar compra:", error);
            alert("Erro ao realizar compra. Tente novamente.");
        }
    }

    limparFormulario() {
        document.getElementById('fornecedor').value = "";
        document.getElementById('produto').value = "";
        document.getElementById('quantidade').value = "";
    }

    async carregarVendas() {
        // Função para carregar a lista de vendas (implementação necessária)
        console.log("Carregar vendas chamado");
    }
}

// Inicializando o controlador de compras
const compraController = new CompraController(db);

// Associando os métodos da classe ao botão no HTML
document.getElementById('salvar-compra').addEventListener('click', () => {
    compraController.cadastrarCompra();
});


// Função para carregar a lista de compras
window.carregarVendas = async function() {
    const vendasRef = collection(db, "vendas");
    const vendasSnapshot = await getDocs(vendasRef);
    const vendasList = document.getElementById('lista-vendas');

    vendasList.innerHTML = ""; // Limpa a lista antes de adicionar os novos itens

    vendasSnapshot.forEach(doc => {
        const venda = doc.data();
        const vendaItem = document.createElement('div');
        vendaItem.classList.add('venda-item');
        vendaItem.innerHTML = `
            <strong>${venda.fornecedor}</strong><br>
            Produto: ${venda.produto}<br>
            Quantidade: ${venda.quantidade}<br>
            <button class="botao-editar" onclick="carregarVendaParaEdicao('${doc.id}')">Editar</button>
        `;
        vendasList.appendChild(vendaItem);
    });
}

// Função para carregar os dados da compra para edição
window.carregarVendaParaEdicao = async function(idVenda) {
    const vendaRef = doc(db, "vendas", idVenda);
    const vendaDoc = await getDoc(vendaRef);

    if (vendaDoc.exists()) {
        const venda = vendaDoc.data();

        // Preencher o formulário com os dados da venda
        document.getElementById('fornecedor').value = venda.fornecedor;
        document.getElementById('produto').value = venda.produto;
        document.getElementById('quantidade').value = venda.quantidade;

        // Armazenar o ID da venda para edição
        document.getElementById('form-cadastro').setAttribute('data-id', vendaDoc.id);

        // Alterar o botão para editar
        document.getElementById('salvar-compra').style.display = 'none';  // Esconde o botão de salvar
        document.getElementById('editar-compra').style.display = 'block';  // Exibe o botão de editar
    } else {
        alert("Compra não encontrada.");
    }
}

// Função de edição de compra
window.editarCompra = async function() {
    const idVenda = document.getElementById('form-cadastro').getAttribute('data-id');

    if (!idVenda) {
        alert("Nenhuma Compra selecionada para editar.");
        return;
    }

    const fornecedor = document.getElementById('fornecedor').value;
    const produto = document.getElementById('produto').value;
    const quantidade = document.getElementById('quantidade').value;

    try {
        const vendaRef = doc(db, "vendas", idVenda);
        await updateDoc(vendaRef, {
            fornecedor: fornecedor,
            produto: produto,
            quantidade: quantidade
        });

        alert("Compra atualizada com sucesso!");

        // Limpar os campos após a edição
        document.getElementById('fornecedor').value = "";
        document.getElementById('produto').value = "";
        document.getElementById('quantidade').value = "";

        // Remover o ID da compra de edição
        document.getElementById('form-cadastro').removeAttribute('data-id');

        // Esconder o botão de editar e mostrar o botão de salvar
        document.getElementById('editar-compra').style.display = 'none';
        document.getElementById('salvar-compra').style.display = 'block';

        // Carregar novamente a lista de vendas
        carregarVendas();

    } catch (error) {
        console.error("Erro ao editar compra:", error);
        alert("Erro ao editar compra. Tente novamente.");
    }
}

// Função de voltar para a tela inicial
window.voltarParaTelaInicial = function() {
    window.location.href = 'telainicial_usuario.html';
}

// Carregar vendas ao iniciar a página
carregarVendas();
