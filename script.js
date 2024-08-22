// Aguarde até que o DOM esteja completamente carregado antes de inicializar
document.addEventListener('DOMContentLoaded', function() {
    // Inicialize o Trello Power-Up
    const t = TrelloPowerUp.iframe();

    // API Key e Token fornecidos
    const API_KEY = 'b62b4a479cb8746d94e81eae68ee28ce';
    const TOKEN = '1502ffcf41982dc5d615c9b67ae9eff692ca46d6fda7fccf2e7b86442c659c3f';

    // Função que será chamada quando o botão no quadro for clicado
    window.importCards = function(t) {
        const signedUrl = t.signUrl('https://xlsx-to-cards.vercel.app/index.html'); // Assina a URL do iframe

        // Abrir um popup para selecionar o arquivo
        t.popup({
            title: 'Importar Cards',
            url: signedUrl,  // URL do seu HTML para upload do arquivo
            height: 200         // Altura do popup
        });
    };

    // Adiciona um listener para o evento de clique no botão de importação
    document.getElementById('importButton').addEventListener('click', function() {
        const fileInput = document.getElementById('fileInput');
        if (fileInput.files.length === 0) {
            alert("Por favor, selecione um arquivo primeiro.");
            return;
        }

        const file = fileInput.files[0];
        const reader = new FileReader();

        reader.onload = function(event) {
            const data = event.target.result;

            // Processar o arquivo para criar os cards
            const cards = processFile(data);

            // Criar os cards no Trello
            cards.forEach(card => {
                t.card('all').then(function(cardData) {
                    return t.post('/1/cards', {
                        key: API_KEY,
                        token: TOKEN,
                        idList: cardData.idList,
                        name: card.title,
                        desc: card.description,
                        due: card.dueDate
                    });
                });
            });
        };

        reader.readAsText(file);  // ou readAsBinaryString para XLSX
    });

    // Função para processar o arquivo CSV ou XLSX
    function processFile(data) {
        // Processar os dados do arquivo e retornar um array de objetos de cards
        const rows = data.split("\n");
        return rows.map(row => {
            const [title, description, dueDate] = row.split(",");
            return { title, description, dueDate };
        });
    }
});
