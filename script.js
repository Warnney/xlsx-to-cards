// Inicialização do Trello Power-Up
const t = window.TrelloPowerUp.iframe();

// Renderização do Power-Up
t.render(() => {
  // Este código é executado quando o Power-Up é carregado
});

// Função que será chamada quando o botão no quadro for clicado
window.importCards = function(t) {
  // Abrir um popup para selecionar o arquivo
  t.popup({
    title: 'Importar Cards',
    url: 'index.html',  // URL do seu HTML para upload do arquivo
    height: 200         // Altura do popup
  });
};

// Adiciona um listener para o evento de clique no botão de importação
document.addEventListener('DOMContentLoaded', function() {
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
            key: 'b62b4a479cb8746d94e81eae68ee28ce',
            token: '1502ffcf41982dc5d615c9b67ae9eff692ca46d6fda7fccf2e7b86442c659c3f',
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