const t = window.TrelloPowerUp.iframe();

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
        // Aqui você processaria o arquivo (XLSX/CSV) e criaria os cards
        // Exemplo: const cards = processFile(data);

        // Chama a API do Trello para criar os cards no quadro atual
        cards.forEach(card => {
            t.card('all').then(function(cardData) {
                return t.post('/1/cards', {
                    key: 'SUA_API_KEY',
                    token: 'SEU_TOKEN',
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

function processFile(data) {
    // Processamento do arquivo para gerar os dados dos cards
    // Exemplo simples com CSV
    const rows = data.split("\n");
    return rows.map(row => {
        const [title, description, dueDate] = row.split(",");
        return { title, description, dueDate };
    });
}
