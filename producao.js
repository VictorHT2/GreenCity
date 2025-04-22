// Função para carregar produções
async function carregarProducoes() {
    const url = `http://127.0.0.1:8080/producao`; // Use o endpoint correto

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Erro ao carregar os dados');
        }

        const data = await response.json();

        const tbody = document.getElementById('producoes');
        tbody.innerHTML = ''; // Limpa o conteúdo anterior

        data.forEach(producao => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${producao.produto || "Informação não disponível"}</td>
                <td>${new Date(producao.data_inicio).toLocaleDateString('pt-BR') || "Informação não disponível"}</td>
                <td>${new Date(producao.data_fim).toLocaleDateString('pt-BR') || "Informação não disponível"}</td>
                <td>${producao.status || "Informação não disponível"}</td>
            `;
            tbody.appendChild(tr);
        });
    } catch (error) {
        alert(error.message);
    }
}
