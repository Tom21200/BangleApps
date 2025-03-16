// Paquet de données à envoyer
var data = new Uint8Array([
  0x1e, 0xff, 0x4c, 0x00, 0x07, 0x19, 0x07, 0x02,
  0x20, 0x75, 0xaa, 0x30, 0x01, 0x00, 0x00, 0x45,
  0x12, 0x12, 0x12, 0x00, 0x00, 0x00, 0x00, 0x00,
  0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00
]);

// Fonction pour commencer l'annonce BLE
function startAdvertising() {
  NRF.setAdvertising({
    0xFF: data.buffer // Utilisation d'un paquet "Manufacturer Specific Data"
  }, { interval: 100 }); // Annonce toutes les 100ms (tu peux ajuster si besoin)
}

// Démarrer l'envoi
startAdvertising();

// Optionnel : arrêter l'envoi après un certain temps
// setTimeout(() => NRF.setAdvertising({}, {interval:1000}), 60000); // Arrête après 1 minute