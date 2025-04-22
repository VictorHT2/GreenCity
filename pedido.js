async function mostrarDetalhesVendas() {
    const detalhes = document.getElementById("detalhes-pedido");
    detalhes.style.display = "block"; // Mostra a seção de detalhes

    try {
        const response = await fetch('http://127.0.0.1:8080/vendas/');
        
        if (!response.ok) {
            throw new Error(`Erro HTTP! Status: ${response.status}`);
        }

        const vendas = await response.json();
        console.log(vendas); // Exibe a estrutura para depuração

        // Criando a estrutura da tabela
        let detalhesHTML = `
            <h3>Detalhes das Vendas Gerais</h3>
            <table>
                <thead>
                    <tr>
                        <th>Cliente</th>
                        <th>Produto</th>
                        <th>Status</th>
                        <th>Núm Pedido</th>
                        <th>Contato</th>
                        <th>Quantidade</th>
                        <th>Valor Total</th>
                        <th>CEP</th>
                    </tr>
                </thead>
                <tbody>
        `;

        // Preenchendo as linhas da tabela com as informações de cada venda
        vendas.forEach(venda => {
            detalhesHTML += `
                <tr>
                    <td>${venda.cliente?.nome || "Informação não disponível"}</td>
                    <td>${venda.informacoes_adicionais || "Informação não disponível"}</td>
                    <td>${venda.status}</td>
                    <td>${venda.numero}</td>
                    <td>${venda.cliente.telefone_1 || "Informação não disponível"}</td>
                    <td>${venda.cliente.quantidade || "Informação não disponível"}</td>
                    <td>${venda.cliente.valor_total || "Informação não disponível"}</td>
                    <td>${venda.cliente?.cep || "Informação não disponível"}</td>
            `;
        });

        // Fechando a estrutura da tabela
        detalhesHTML += `
                </tbody>
            </table>
        `;

        // Inserindo a tabela no elemento de detalhes
        detalhes.innerHTML = detalhesHTML;

    } catch (error) {
        console.error('Erro ao buscar vendas:', error);
        detalhes.innerHTML = '<p>Erro ao carregar vendas. Tente novamente mais tarde.</p>';
    }
}

function ocultarDetalhesVendas() {
    const detalhes = document.getElementById("detalhes-pedido");
    detalhes.style.display = "none"; // Oculta a seção de detalhes
}


