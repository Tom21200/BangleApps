let count = 0; // Compteur d'envoi

// Paquet à envoyer (représentation en tableau d'octets)
const payload = [
  0x1e, 0xff, 0x4c, 0x00, 0x07, 0x19, 0x07, 0x02,
  0x20, 0x75, 0xaa, 0x30, 0x01, 0x00, 0x00, 0x45,
  0x12, 0x12, 0x12, 0x00, 0x00, 0x00, 0x00, 0x00,
  0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00
];

// Fonction pour lancer la pub BLE
function startAdvertising() {
  NRF.setAdvertising({}, { // Données vides car on passe directement le manufacturer data
    name: "AirPods 69",    // Nom personnalisé
    manufacturer: 0x004C,  // Apple Manufacturer ID (0x004C)
    manufacturerData: payload, // Nos données custom
    connectable: false,   // Pour envoyer en "ADV_NONCONN_IND"
    interval: 80          // 80 * 0.625ms = 50ms (rapide sans trop vider la batterie)
  });
}

// Fonction pour afficher "Sent (X)" sur l'écran et gérer les cycles
function updateAndSend() {
  g.clear(); // Clear écran
  count++; // Incrément compteur
  const msg = "S (" + count + ")";
  g.setFont("6x8", 4); // Police et taille
  const textWidth = g.stringWidth(msg);
  g.drawString(msg, (g.getWidth() - textWidth) / 2, (g.getHeight() - 32) / 2); // Centre
  g.flip(); // Actualisation de l'écran

  startAdvertising(); // Relancer la publicité BLE

  // Arrêter la pub après un court instant (pour mimer l'ESP32 qui start/stop)
  setTimeout(() => NRF.setAdvertising({}, { connectable: false }), 200); // Stop après 200ms
}

// Lancer la boucle toutes les secondes
setInterval(updateAndSend, 1000);

// Clear écran et lancer le premier cycle
g.clear();
updateAndSend();
