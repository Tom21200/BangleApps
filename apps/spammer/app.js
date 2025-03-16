// Initialisation du compteur
let counter = 0;

// Paquet de données à envoyer
var data = new Uint8Array([
  0x1e, 0xff, 0x4c, 0x00, 0x07, 0x19, 0x07, 0x02,
  0x20, 0x75, 0xaa, 0x30, 0x01, 0x00, 0x00, 0x45,
  0x12, 0x12, 0x12, 0x00, 0x00, 0x00, 0x00, 0x00,
  0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00
]);

// Efface l'écran au début
g.clear();

// Fonction pour afficher le compteur
function updateDisplay() {
  g.clear(); // Efface pour mettre à jour
  g.setFont("6x8", 4); // Police plus grande (tu peux ajuster)
  let msg = "Sent (" + counter + ")";
  let w = g.stringWidth(msg);
  let h = 8 * 4; // Hauteur de la police (6x8, taille 4)
  g.drawString(msg, (g.getWidth() - w) / 2, (g.getHeight() - h) / 2);
  g.flip(); // Actualise l'écran
}

// Fonction pour envoyer les données et mettre à jour l'affichage
function sendData() {
  counter++; // Incrémente le compteur
  NRF.setAdvertising({
    0xFF: data.buffer
  }, { interval: 100 }); // Envoie les données BLE
  updateDisplay(); // Met à jour le texte affiché
}

// Lancement de l'envoi toutes les secondes
setInterval(sendData, 1000); // Envoi et mise à jour toutes les 1000ms (1s)

// Premier affichage immédiat
updateDisplay();
