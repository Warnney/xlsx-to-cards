const t = window.TrelloPowerUp.iframe();

const API_KEY = 'b62b4a479cb8746d94e81eae68ee28ce';  // Substitua por sua chave API
const TOKEN = '1502ffcf41982dc5d615c9b67ae9eff692ca46d6fda7fccf2e7b86442c659c3f';        // Substitua por seu token

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
        const cards = processFile(data);

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

    reader.readAsText(file);
});

function processFile(data) {
    const rows = data.split("\n");
    return rows.map(row => {
        const [title, description, dueDate] = row.split(",");
        return { title, description, dueDate };
    });
}
