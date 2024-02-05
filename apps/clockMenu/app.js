const clockWidth = 80; // Largeur de l'horloge carrée
const clockHeight = 80; // Hauteur de l'horloge carrée
const calendarWidth = 77; // Largeur du calendrier carré
const calendarHeight = 65; // Hauteur du calendrier carré
const centerX = Math.floor(g.getWidth() / 2);
const centerY = Math.floor(g.getHeight() / 2);
const calendarX = Math.floor(g.getWidth() - calendarWidth - 5); // Place le calendrier à droite
const calendarY = centerY - Math.floor(calendarHeight / 2 - 7);

let invertedColors = require("Storage").readJSON("invertedColors.json", 1) || false;
let autoInvertedColors = require("Storage").readJSON("autoInvertedColors.json", 1) || false;
let flicker = false;
let isAlarmSounding = false;
let showClock = true;
let awake = true;

let xOffset = 0;
let yOffset = 50;
const speed = 0.2; // Ajustez la vitesse de défilement selon vos préférences
const shadowOffset = 5; // Offset pour l'ombre


const tileImg = {
  width : 176, height : 176, bpp : 2,
  transparent : 0,
  palette : new Uint16Array([65535,65535,0,65503]),
  buffer : require("heatshrink").decompress(atob("AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AFEq1QAH1ArgktVAA9YFf4r5tWlq2qqoEBrWpFcVmstWs1VAgNZzIr/Qc8C1QAJK78CepFVqwryQbIXBAJArGHhArQrWqzQBGywrgTYIBIFaj0D1ArYV5ByBAARgKV6Vmso3BqoEBrOZrSMOK6QrrQZInDAwWpFY6UBzQBGyxXQE4YGBAIIrHepFVQaInDFbqDJE4YGC1QAJDIIBGFYw8IQY5OJrSvPDJKDGFZSdBAIwrULIQraV5KDDEANZAwYBGV59mso3BqoEBKQRMFrKKGMgZXPFdaDJUQivBQZWa1QBFyxXQDwZOCK5TkHQaIiGFbSDJDwiDMDIIBGFYw7HVQKDGCBARBV54ZJPQwrKToIBGFahZCFaNq1QAHV5CDDEAKvSCoQAGtI5Bqtmsr1IrKKGMgZXGtIr2QYyiEV4KDKzWqAIgKCEYWqyolBK5AeDJwRXKJowSCEYWZyolBFZAiGFbqDGDwiDMDIIBEQZQ9GQY7IICIKvHK5IZHPQwrKEIIBEtIrVLIQrSQZKvHQYbICV6Q9IFYJfBLoL1IegQBHK5Ar2QYyiEV4KDKzWqAIgKCV5BXGDwZOCK5RNGCQQjCzOVEoIrIEQwrdQYweEQZgZBAIiDKHoyDHZBARBV45XJDI56GFZQhBAIlpFapZCFaSDJV46DDZASvSHpArBL4JdBepD0CAI5XIFeyDGUQivBQZWa1QBEBQSvIK4weDJwRXKJowSCEYWZyolBFZAiGFbqDGDwiDMDIIBEQZQ9GQY7IICIKvHK5IZHPQwrKEIIBEtIrVLIQrSQZKvHQYbICV6Q9IFYJfBLoL1IegQBHK5Ar2QYyiEV4KDKzWqAIgKCV5BXGDwZOCK5RNGCQQjCzOVEoIrIEQwrdQYweEQZgZBAIiDKHoyDHZBARBV45XJDI56GFZQhBAIlpFapZCFaSDJV46DDZASvSHpArBL4JdBepD0CAI5XIFeyDGUQivBQZWa1QBEBQSvIK4weDJwRXKJowSCEYWZyolBFZAiGFbqDGDwiDC1RgDtSDDDIIBBywDBQYgWBQYYqBAAYNCQYo6CAAQZBXgSvHK4Y8BK4VqFYo3BPQwrKEIJXCAYNpFapZCBIJmEFY1mFYaDDHoSDCEoKvEtSDDZASvFAIivHJgmlAYQrBcYJdBKQNqeg+aMAgDDK44r2QYy1EV4KDKzWqAIgKCV5BXGDwZSCK5TjGCQOZL4NV1OVEoIrIEQYrgQYwiEQZh5BAIOWAYKDLagqDHWYINDJ4avIK5QrGQYwrKEIIBBywDBtIrVLIQrSQZSvGQYbICV6RLE0oDCFYJfBLoJSBtReFegOaMAgDDK44r2QYwQDV4SDKzWqAIgKCV5BXGDwZSCK5TjGCQOZL4NV1OVEoIrIEQYrgQYwiEQZh5BAIOWAYKDLagqDHWYINDJ4daGwKvFK5QrGK4YA=="))
};

const tileImgNight = {
  width : 176, height : 176, bpp : 2,
  transparent : 0,
  palette : new Uint16Array([65535,0,65535,65504]),
  buffer : require("heatshrink").decompress(atob("AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AFEq1QAH1ArgktVAA9YFf4r5tWlq2qqoEBrWpFcVu8tW91VAgNb3Ir/Qc8C1QAJK78CepFVqwryQbIXBAJArGHhArQrWqzQBGywrgTYIBIFaj0D1ArYV5ByBAARgKV6Vu8o3BqoEBre5rSMOK6QrrQZInDAwWpFY6UBzQBGyxXQE4YGBAIIrHepFVQaInDFbqDJE4YGC1QAJDIIBGFYw8IQY1ZJxNaV54ZJQIorLToIBGFahZBFbavJQYYgBrIGDAIyvPt3lG4NVAgJSCJgtZRQpkEK54rrQZKiEV4KDKzWqAIuWK6AeDAwJXLcg6DREAorbQZIeEQZgZBAIwrGHY6qBQYwQICIKvPDJKDGFZSdBAIwrUQYQrR9WqAA6vIQYYgBV6QVCAA1pHINVt3lepFZRQpkEK43pFeyDGUQivBQZWa1QBEBQQjC1WVEoJXIDwYGBK5ZNGCQQjC3eVEoIrIEAoreQYweEQZgZBAIiDKHoyDHZBARBV45XJDI6DGFZQhBAInpFaqDCFaSDJV46DDZASvSHpArBL4JdBepD0CAI5XIFeyDGUQivBQZWa1QBEBQSvIK4weDAwJXLJowSCEYW7yolBFZAgFFbyDGDwiDMDIIBEQZQ9GQY7IICIKvHK5IZHQYwrKEIIBE9IrVQYQrSQZKvHQYbICV6Q9IFYJfBLoL1IegQBHK5Ar2QYyiEV4KDKzWqAIgKCV5BXGDwYGBK5ZNGCQQjC3eVEoIrIEAoreQYweEQZgZBAIiDKHoyDHZBARBV45XJDI6DGFZQhBAInpFaqDCFaSDJV46DDZASvSHpArBL4JdBepD0CAI5XIFeyDGUQivBQZWa1QBEBQSvIK4weDAwJXLJowSCEYW7yolBFZAgFFbyDGDwiDMDIIBEQZQ9GQY7IICIKvHK5IZHQYwrKEIIBE9IrVQYQrSQZKvHQYbICV6Q9IFYJfBLoL1IegQBHK5Ar2QYyiEV4KDKzWqAIgKCV5BXGDwYGBK5ZNGCQQjC3eVEoIrIEAoreQYweEQYWqMAdqQYYZBAIOWAYKDECwKDDFQIADBoSDFHQQACDIK8CV45XDtWrK4VqFYo3BQYwrKEIJXCAYPpFaqDCqv6Bwd+FY3+FYaDDr6DE/SvE1fqQYbICrX6BAd+V42+V4Y8Dr+lAgQrBcYJdBre79T0H/RgD/xkDK44XDv4rDtYrF34rlQYmvFYivCr6DD1f+QYea1Wb/wDBzQKCRoP/V4dvK46mDJgIrCK4W7K4g7Bq/+cYRqB3JhB/+ryolBFZB6DFYV/FYe/FY1fFY/vFYgbBQYn/FYiDCB4JgC16DEPIIrBy2qqyDD1aDEDYLTEFYKDG/4PDv5PDV4RfBV4ZXIDYiYBK4orNUoIHBy3uq3pFapZCB4n/FYwHBFYaDC36DD04bBV4dfQYogBFYQICEYKvFFYSvCNAf/0pQD/XuqpdBFYS2EfIIPBMAQjBMgZ5CK4hoDFYYbCFYY3BFcqDDFYx4BBAKDCCgKDEzWvA4Oa1WaBQR9BV4a0BK4gLBV4hMBFYQEBFYRXDJATjDrIKBFYWrytuAgIrHPQQBCB4QwDFYoHCFYo0BFYyDC04rGLIIPCRAaDEqx0BV4OqqwKCFYSDCDYSnCMYSDF3YPEAgJPDrVaA4SvDNAZXCt4rFG4RXE"))
};

const tileImg2 = {
  width : 176, height : 176, bpp : 2,
  transparent : -1,
  palette : new Uint16Array([65535,0,52857,0]),
  buffer : require("heatshrink").decompress(atob("AH4A/AH4A/AH4A/AH4AKitVqoqngNq1WqqArmi2gAYMUFc1awADBgiCnAgUFFc2oAgcFqqyLBoIACoArSQQQEBqiyMBoIAB1VVFayGNipSE1JpLEYwrGgI9JEgsCyosQiwrQMI8JygrPrRNHCJEQA40CkrhCXQZwItArQPREC1QABgq7EQQ2gFZ8BDpQ5LQRKlIMBQXNQRMAggSIdgxmQioYIFZKVHAA0URqKDJNRAYNY5QKJtQrNDA64JAAIrJQhwYGUhAABhWQBI8a1QrNiC3OAAOqXREF1RYNFYwGGKweqQZEBtRYNEgxLIKwOpcxNWLBorGD48C1Wqyr5KrWqwArKKAwrGFQWpMRIABiqFBLJMBEgwGFVYIABqqiMqosBAAWoHAoTGFYkqKoVVVpIsFAAVqrQsDgJwHEIZAC0tUFJovGirkBDRVQVITWCVZYALgpcBIpMWFQZ/PAC0BrSqCFMhlEVSgA/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A4qtVDzkBqtUBhNAgJAUEQ4dBggWJosUoArRCQQiGglRogreCgIiHFZ0QP59QFZUQFZZVBFZjqDCAIrKV5roKHQdRoofBV5NUQZorMKIQrCK5IrOqIIFip+BP4QrOgIIFgIbCYoJuCgKZHBIYlBV5gRCRgYiDD4QWBqCdCAAURMIivDMIKWCEQRpCohXGNogrPQYZaBgoiEDoQrBPoVVoArJAoQrNAQYrCCIVQfIgrHKgQrFV5IrLRYIMCFYKvHYwyvJFYQIBgp6BBIQBBqgrECQS9CBIKREV6wrKOAQNCSIavRAgIRCDoxXEGYSRFV6IrEDop3BW4MAFYRlFQwQgDV5QjCK4oPCFIJXFBo6DCXoS+CV6QCFV44RCFYQICV6gSEV5ArCIoLBDV6hUEQZBXFCgSvoK4iv/V/6v/V/6v/V/6v/V/6v/V/6v/V/6v/V/6v/V+YA/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/ADY"))
};

const tileImgNight2 = {
  width : 176, height : 176, bpp : 2,
  transparent : 1,
  palette : new Uint16Array([0,65535,65504,65535]),
  buffer : require("heatshrink").decompress(atob("qoA/AH4A/AH4A/AH4A/ABN////FU9X4EAgH1Fc18FQMAnorm+ArChqCpgEPFcwqCgEDr//WRYNBAAXVFa/8WRgNBAAX/FayGNv6WDH4JpLN4wrGgY9JdoYACn4sQvgrQHpCWLAAhEGFZVwCIyWBcIX9VxabEFZg9HF4vVQSIrJHpAAFWhREIh4rIFRgXJIhUNFa0DQhF/CZArXgE9Y6KDJV5oYIC5RrJFZwYHr4TKFa4YHrgSKmorHuArODA18CRX1FY5sLFZRCLQZDcPFY3wYSIAC/grUIJU/FRBYBIRScJFZMDVxAACv6FLOA4TJ/4qKAAP/OCQSHgf/VpIsFAAXARQhwIFY0P/opNF41/cgQaJYgs/VZYALr5cBIpN8VQh/OAC1XLAKqBFMhlEVSgA/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A4///DzlX//9BhPAgZAUEQ9XgENCxPKlHVFaPAgAiHrmixoreCgIiHFZ01P5/1FZVwFZZuBFZgpBPwIQBFZSvN1qpN0WKFYKvJ9CDNFZhRCFYRXJFZ2jBAt/PwP/FaFXBAtXDYTFBNwUDTI4JDEoKvMq6MFAwTWDCwOg6oWEuWKMIavDn///giENIVcK4xtEFZ6DDnkAh4iENIQrB15+C6orJAoQrN0WPFYgRCuEo1h+CFY50BRIavMFZcAhglBlArBV47GGV5IrCDQMPPQPyCIIdB1grEK4TFB/4NBSIivQxguBmACBFZQVBBoaRDV6GMA4MyK4ivHnwNBOgKREV6ArFDop3B+AVBFYRlFQwSdCV5YjCK4odCFIISBK4YNHgAZBlYxCV6hGBFYSvI/BFDlYICV6grEV5ArCIoMDE4SvUFYSvKK4orCV9BXEV/6v/V/6v/V/6v/V/6v/V/6v/V/6v/V/6v/V/6vzAH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4AbA="))
};

const tileImgNight3 = {
  width : 176, height : 176, bpp : 2,
  transparent : -1,
  palette : new Uint16Array([0,65504,0,0]),
  buffer : require("heatshrink").decompress(atob("AH4AnoAqpgNQK98BTv7H6gglgfTA6UAC0VDC77SK9YA/AH4A/fn4ASiBA/AH7f4XJ8VK9760gLS/AH6JVaAgA/ABUQCB5g2oDCpAH4A/AH4AyiBA/AH4AbgJA/Jv5l6ggHGoAragocGipXyAFw2LIU66bAH6hYOn4ACgIyxOv4A/AH4A/ACMQHvkEP35/+AGsBXr6UiIY4A/ACaXYSc4IGYy7eiSn4A/AH4A/AAMBIH4A/ADlAIH4AOiBA/AH7XUBoUEKP4AogIPeZ34A/J/4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4AsA="))
};

// Définissez la vitesse pour la deuxième image
const speed2 = 0.20; // Ajustez selon votre préférence

function drawBackground() {
  const margin = 50; // Marge autour de l'écran

  // Dessinez la deuxième image en arrière-plan
  for (let x = -margin; x < g.getWidth() + margin; x += tileImg2.width) {
    // Vérifier si la tuile est à l'intérieur de la zone visible
    if (x - xOffset * speed2 + tileImg2.width >= 0 && x - xOffset * speed2 <= g.getWidth()) {
      // Dessinez la deuxième tuile à une hauteur fixe
      const y = g.getHeight() / 2 - tileImg2.height / 2;
      if (invertedColors) {
        g.drawImage(tileImgNight3, x, y);
        g.drawImage(tileImgNight2, x - xOffset * speed2, y);
      } else {
        g.drawImage(tileImg2, x - xOffset * speed2, y);
      }
    }
  }

  // Dessinez la première image par-dessus la deuxième
  for (let x = -margin; x < g.getWidth() + margin; x += tileImg.width) {
    // Vérifier si la tuile est à l'intérieur de la zone visible
    if (x - xOffset + tileImg.width >= 0 && x - xOffset <= g.getWidth()) {
      // Dessinez la première tuile à une hauteur fixe
      const y = g.getHeight() / 2 - tileImg.height / 2;
      if (invertedColors) {
        g.drawImage(tileImgNight, x - xOffset, y);
      } else {
        g.drawImage(tileImg, x - xOffset, y);
      }
    }
  }
}



require("Font5x9Numeric7Seg").add(Graphics);

function drawClock() {
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();
  const offset = 45;

  // Dessinez l'horloge carrée centrée (décalée un peu plus à gauche)
  g.drawRect(centerX - clockWidth / 2 - offset, centerY - clockHeight / 2, centerX + clockWidth / 2 - offset, centerY + clockHeight / 2);

  // Ajoutez une ombre en bas à droite
  g.fillRect(centerX - clockWidth / 2 + shadowOffset - offset, centerY - clockHeight / 2 + shadowOffset, centerX + clockWidth / 2 + shadowOffset - offset, centerY + clockHeight / 2 + shadowOffset);

  // Effacez l'ancienne horloge
  g.clearRect(centerX - clockWidth / 2 + 1 - offset, centerY - clockHeight / 2 + 1, centerX + clockWidth / 2 - 1 - offset, centerY + clockHeight / 2 - 1);

  // Dessinez les chiffres 12, 3, 6 et 9 pour les heures
  const fontSize = 12;
  const numberRadius = Math.min(clockWidth, clockHeight) / 2 - fontSize / 2; // Ajustez la position horizontale et verticale

  const numbers = [12, 3, 6, 9];

for (const number of numbers) {
  const angle = ((number - 3) / 6) * Math.PI;
  const x = centerX + Math.cos(angle) * numberRadius - fontSize / 2 - offset;
  const y = centerY + Math.sin(angle) * numberRadius - fontSize / 2;

  // Affichez le chiffre 12 avec une position x différente
  if (number === 12) {
    g.setFont("5x9Numeric7Seg");
    g.drawString(number.toString(), x + 1, y + 2);
  } else {
    g.setFont("5x9Numeric7Seg");
    g.drawString(number.toString(), x + 4, y + 2);
  }

  g.setFont("4x6");
}

  // Dessinez les carrés entre les chiffres non présents
  const squareNumbers = [1, 2, 4, 5, 7, 8, 10, 11];

  for (const number of squareNumbers) {
    const angle = ((number - 3) / 6) * Math.PI;
    const x = centerX + Math.cos(angle) * numberRadius - fontSize / 2 - offset;
    const y = centerY + Math.sin(angle) * numberRadius - fontSize / 2;

    // Affichez des carrés pour les chiffres non présents
    g.fillRect(x + 6, y + 6, x + 8, y + 8);
  }

  // Calculez les positions des aiguilles
  const hoursAngle = Math.PI * 2 * (hours % 12) / 12 - Math.PI / 2;
  const minutesAngle = Math.PI * 2 * minutes / 60 - Math.PI / 2;
  const secondsAngle = Math.PI * 2 * seconds / 60 - Math.PI / 2;

  const hoursLength = 20;
  const minutesLength = 30;
  const secondsLength = 35;

  // Dessinez les aiguilles
  g.drawLine(centerX - offset, centerY, centerX - offset + Math.cos(hoursAngle) * hoursLength, centerY + Math.sin(hoursAngle) * hoursLength);
  g.drawLine(centerX - offset, centerY, centerX - offset + Math.cos(minutesAngle) * minutesLength, centerY + Math.sin(minutesAngle) * minutesLength);

  // Dessinez les aiguilles des secondes
  g.setColor(0, 0, 1); // Couleur bleue
  g.drawLine(calendarX - offset - 6, centerY, calendarX + Math.cos(secondsAngle) * secondsLength - offset - 6, centerY + Math.sin(secondsAngle) * secondsLength);
  g.setColor(0, 0, 0); // Revenez à la couleur noire par défaut
}

const birthdayDate = "3/7";

function drawCalendar() {
  if (invertedColors) {
    g.setColor(1, 1, 1);
  } else {
    g.setColor(0, 0, 0);
  }
  // Ajoutez une ombre en bas à droite du calendrier
  g.fillRect(calendarX + shadowOffset, calendarY + shadowOffset - 15, calendarX + calendarWidth + shadowOffset, calendarY + calendarHeight + shadowOffset);
if (invertedColors) {
    g.setColor(0, 0, 0);
  } else {
    g.setColor(1, 1, 1);
  }

  // Dessinez le carré du calendrier avec fond blanc et contour noir
  if (invertedColors) {
    g.setColor(0, 0, 0);
  } else {
    g.setColor(1, 1, 1);
  }
  g.fillRect(calendarX, calendarY, calendarX + calendarWidth, calendarY + calendarHeight);
  if (invertedColors) {
    g.setColor(1, 1, 1);
  } else {
    g.setColor(0, 0, 0);
  }
  g.drawRect(calendarX, calendarY, calendarX + calendarWidth, calendarY + calendarHeight);
  if (invertedColors) {
    g.setColor(1, 1, 1);
  } else {
    g.setColor(0, 0, 0);
  }

  // Dessinez les noms des jours
  const daysOfWeek = ["Di", "Lu", "Ma", "Me", "Je", "Ve", "Sa"];
  const dayWidth = Math.floor(calendarWidth / 7);

  for (let i = 0; i < 7; i++) {
    const dayX = calendarX + i * dayWidth;
    const dayY = calendarY - 15;

    // Coloriez la colonne du dimanche en rouge et la colonne du samedi en bleu
    if (i === 0) {
      g.setColor(1, 0, 0); // Rouge pour le dimanche
    } else if (i === 6) {
      g.setColor(0, 0, 1); // Bleu pour le samedi
    } else {
      if (invertedColors) {
    g.setColor(1, 1, 1);
  } else {
    g.setColor(0, 0, 0);
  }
    }

    g.fillRect(dayX, dayY, dayX + dayWidth, dayY + 15);
    if (invertedColors) {
    g.setColor(0, 0, 0);
  } else {
    g.setColor(1, 1, 1);
  }
    g.drawString(daysOfWeek[i], dayX + Math.floor(dayWidth / 2), dayY + 5);
  }

  // Dessinez les cases pour chaque jour du mois
  const daysInMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1).getDay();
  const cellWidth = Math.floor(calendarWidth / 7);
  const cellHeight = Math.floor(calendarHeight / 5); // Fixez le nombre de rangées à 6
  const currentDate = new Date().getDate();

  // Calculer le jour du mois précédent
  const daysInPreviousMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 0).getDate();
  const dayOfPreviousMonth = daysInPreviousMonth - firstDayOfMonth + 1;

  for (let row = 0; row < 6; row++) {
    for (let col = 0; col < 7; col++) {
      const day = row * 7 + col + 1 - firstDayOfMonth;
      const cellX = calendarX + col * cellWidth;
      const cellY = calendarY + row * cellHeight;

      if (day >= 1 && day <= daysInMonth) {
        // Dessinez les cases avec le jour actuel

        // Vérifiez si la case correspond à la date d'anniversaire
const currentDateStr = `${day}/${new Date().getMonth() + 1}`;
if (currentDateStr === birthdayDate) {
  // Remplissez la case en jaune pour le jour d'anniversaire
  g.setColor(1, 1, 0); // Jaune
  g.fillRect(cellX, cellY, cellX + cellWidth - 1, cellY + cellHeight - 1);

  // Remettez la couleur du contour au noir ou blanc en fonction de l'inversion des couleurs
  if (invertedColors) {
    g.setColor(1, 1, 1);
  } else {
    g.setColor(0, 0, 0);
  }
}

        if (day === currentDate) {
          // Ajoutez des contours bleus autour du jour actuel
          g.setColor(0, 0, 1); // Couleur bleue
          g.drawRect(cellX, cellY, cellX + cellWidth - 1, cellY + cellHeight - 1);
          if (invertedColors) {
    g.setColor(1, 1, 1);
  } else {
    g.setColor(0, 0, 0);
  }
        } else {
          // Dessinez les contours des autres cases
          g.drawRect(cellX, cellY, cellX + cellWidth, cellY + cellHeight);
        }

        // Affichez le numéro du jour au centre de la case
        const numX = cellX + Math.floor(cellWidth / 2);
        const numY = cellY + Math.floor(cellHeight / 2);
        g.drawString(day.toString(), numX, numY);
      } else if (day < 1) {
        // Affichez les jours du mois précédent dans la première semaine
        const prevMonthDay = dayOfPreviousMonth + day;
        g.setColor(0.6, 0.6, 0.6); // Couleur grise pour les jours du mois précédent
        g.drawRect(cellX, cellY, cellX + cellWidth, cellY + cellHeight);
        if (invertedColors) {
    g.setColor(1, 1, 1);
  } else {
    g.setColor(0, 0, 0);
  }
        // Affichez le numéro du jour précédent au centre de la case
        const numX = cellX + Math.floor(cellWidth / 2);
        const numY = cellY + Math.floor(cellHeight / 2);
        g.drawString(prevMonthDay.toString(), numX, numY);
      }
    }
  }
}

function drawDate() {
  // Obtenez la date au format "mm/yyyy"
  const currentDate = new Date();
  const month = currentDate.getMonth() + 1;
  const year = currentDate.getFullYear();
  const formattedDate = (month < 10 ? '0' : '') + month + '/' + year;

  // Calculez la taille du texte
  const textSize = g.stringWidth(formattedDate, '6x8');

  // Dessinez un fond blanc pour la boîte de date
  const dateX = calendarX + Math.floor((calendarWidth - textSize) / 2);
  const dateY = calendarY - 30; // Déplacez la boîte de date à 40 pixels au-dessus du calendrier
  const dateWidth = textSize;
  const dateHeight = 10; // Hauteur du texte avec la police '6x8'

  if (invertedColors) {
    g.setColor(0, 0, 0); // Couleur noire
  } else {
    g.setColor(1, 1, 1); // Couleur blanche
  }
  
  g.fillRect(dateX, dateY, dateX + dateWidth, dateY + dateHeight);
  if (invertedColors) {
    g.setColor(1, 1, 1); // Couleur blanche
  } else {
    g.setColor(0, 0, 0); // Couleur noire
  }

  // Affichez la date au centre de la case
  const textX = dateX + Math.floor(dateWidth / 10);
  const textY = dateY + Math.floor(dateHeight / 10 + 3);
  g.drawString(formattedDate, textX, textY);
}

function drawTopBar() {
  // Dessinez la barre supérieure avec fond bleu
  if (isAlarmSounding) {
  if (flicker) {
    g.setColor(1, 0, 0);
  } else {
    g.setColor(0, 0, 1);
  }
  } else {
    g.setColor(0, 0, 1);
  }
  g.fillRect(0, 0, g.getWidth(), 15);

  // Affichez le texte "Tom21200" centré verticalement et horizontalement
  const username = "Tom21200";
  const usernameWidth = g.stringWidth(username, "6x8");
  const usernameX = 1;
  const usernameY = Math.floor(20 / 2 - 4); // Centré verticalement

  g.setColor(1, 1, 1); // Couleur blanche
  g.drawString(username, usernameX, usernameY);

  // Affichez le pourcentage de la batterie à droite de la barre
  const batteryPercentage = E.getBattery();
  const batteryTextWidth = g.stringWidth(batteryPercentage + "%", "6x8");
  g.drawString(batteryPercentage + "%", 160, usernameY);

  // Affichez la date européenne à droite du pourcentage de la batterie
  const currentDate = new Date();
  const day = currentDate.getDate();
  const month = currentDate.getMonth() + 1;
  const formattedDate = (day < 10 ? '0' : '') + day + '/' + (month < 10 ? '0' : '') + month;
  const dateTextWidth = g.stringWidth(formattedDate, "6x8");
  g.drawString(formattedDate, 137, usernameY);

  // Affichez l'heure avec clignotement des deux-points chaque seconde
const hours = currentDate.getHours();
const minutes = currentDate.getMinutes();
const seconds = currentDate.getSeconds();
const blinkColon = seconds % 2 === 0 && seconds < 59 ? ':' : ' ';
const timeString = (hours < 10 ? '0' : '') + hours + blinkColon + (minutes < 10 ? '0' : '') + minutes;
const timeWidth = g.stringWidth(timeString, "6x8");
g.drawString(timeString, 114, usernameY);

  g.setColor(0, 0, 0); // Revenez à la couleur noire par défaut

  g.fillRect(111, 15,111, 0);
  g.fillRect(134, 15,134, 0);
  g.fillRect(157, 15,157, 0);
}

function drawBottomButtons() {
  const buttonSize = 20;
  const buttonSpacing = 5;
  const buttonY = g.getHeight() - buttonSize - 2;

  if (invertedColors) {
  g.setColor(0, 0, 0); 
  } else {
  g.setColor(1, 1, 1);
  }
  g.fillRect(leftButtonX, buttonY, leftButtonX + buttonSize, buttonY + buttonSize);
  if (invertedColors) {
  g.setColor(1, 1, 1); 
  } else {
  g.setColor(0, 0, 0);
  }

// Dessinez un petit cercle jaune pour représenter le soleil
const centerX = leftButtonX + buttonSize / 2;
const centerY = buttonY + buttonSize / 2;
const radius = 4;
const numRays = 8;

// Dessinez le cercle jaune
if (invertedColors) {
    g.setColor(1, 1, 0);
  } else {
    g.setColor(1, 1, 0);
  }
g.fillCircle(centerX, centerY, radius);

// Dessinez les petits traits jaunes autour du cercle
if (invertedColors) {
    g.setColor(1, 1, 0);
  } else {
    g.setColor(1, 1, 0);
  }
for (let i = 0; i < numRays; i++) {
  const angle = (i / numRays) * 2 * Math.PI;
  const startX = centerX + Math.cos(angle) * radius;
  const startY = centerY + Math.sin(angle) * radius;
  const endX = centerX + Math.cos(angle) * (radius + 3); // Longueur des traits
  const endY = centerY + Math.sin(angle) * (radius + 3);
  g.drawLine(startX, startY, endX, endY);
}
g.setColor(0, 0, 0);

  // Bouton au milieu
  const middleButtonX = Math.floor((g.getWidth() - buttonSize) / 2);
  g.setColor(0, 0, 1); // Couleur bleue
  g.fillRect(middleButtonX, buttonY, middleButtonX + buttonSize, buttonY + buttonSize);

  // Bouton à droite
const rightButtonX = g.getWidth() - buttonSize - 2;
const buttonCenterX = rightButtonX + buttonSize / 2;
const buttonCenterY = buttonY + buttonSize / 2;
const circleRadius = buttonSize / 2 - 4; // Ajustez la taille du cercle ici

if (invertedColors) {
  g.setColor(0, 0, 0); 
} else {
  g.setColor(1, 1, 1);
}

// Dessiner le bouton rectangulaire
g.fillRect(rightButtonX, buttonY, rightButtonX + buttonSize, buttonY + buttonSize);

if (invertedColors) {
  g.setColor(1, 1, 1); 
} else {
  g.setColor(0, 0, 0);
}

// Dessiner un cercle non rempli
g.drawCircle(buttonCenterX, buttonCenterY, circleRadius);

// Dessiner un trait du centre vers le haut
g.drawLine(buttonCenterX, buttonCenterY, buttonCenterX, buttonY + 4);

// Dessiner un trait du centre vers la droite
g.drawLine(buttonCenterX, buttonCenterY, rightButtonX + buttonSize - 4, buttonCenterY);
}

const buttonSize = 20;
const buttonY = g.getHeight() - buttonSize - 2;
const leftButtonX = 2;

Bangle.on('touch', (button, xy) => {
  // Vérifiez si les coordonnées du toucher sont à l'intérieur du bouton
  if (
    xy.x >= leftButtonX &&
    xy.x <= leftButtonX + buttonSize &&
    xy.y >= buttonY &&
    xy.y <= buttonY + buttonSize
  ) {
    // Basculez la valeur de invertedColors
    autoInvertedColors = false;
    invertedColors = !invertedColors;

    // Sauvegardez la nouvelle valeur dans le stockage
    require("Storage").write("invertedColors.json", JSON.stringify(invertedColors));
  }
});







// Bouton au milieu
const middleButtonX = Math.floor((g.getWidth() - buttonSize) / 2);

let isPetMenuOpen = false;

// Ajoutez ces lignes pour dessiner les boutons
const buttonWidth = 50;
const buttonHeight = 20;
const buttonMargin = 5;

Bangle.on('touch', (button, xy) => {
  // Vérifiez si les coordonnées du toucher sont à l'intérieur du bouton
 if (
    xy.x >= middleButtonX &&
    xy.x <= middleButtonX + buttonSize &&
    xy.y >= buttonY &&
    xy.y <= buttonY + buttonSize
  ) {
    drawPetMenu(!isPetMenuOpen);
  }
});

  // Déterminez la position du menu
const menuWidth2 = 170;
const menuHeight2 = 120;
const menuX2 = g.getWidth() - menuWidth2 - 5;
const menuY2 = g.getHeight() - menuHeight2 - 35;

const buttonRectX = menuX2 + menuWidth2 - 40;
const buttonRectY = menuY2 + 10;
const buttonRectWidth = 30;
const buttonRectHeight = 20;

function drawPetMenu(isOpen) {
  // Enregistrez l'état du menu
  isPetMenuOpen = isOpen;

  // Dessinez le menu avec fond blanc, contour noir et ombre
  if (invertedColors) {
    g.setColor(1, 1, 1);
  } else {
    g.setColor(0, 0, 0);
  }
  g.fillRect(menuX2 + 5, menuY2 + 5, menuX2 + menuWidth2 + 5, menuY2 + menuHeight2 + 5);
  if (invertedColors) {
    g.setColor(1, 1, 1);
  } else {
    g.setColor(0, 0, 0);
  }
  g.drawRect(menuX2, menuY2, menuX2 + menuWidth2, menuY2 + menuHeight2);
  if (invertedColors) {
    g.setColor(0, 0, 0);
  } else {
    g.setColor(1, 1, 1);
  }
  g.fillRect(menuX2 + 1, menuY2 + 1, menuX2 + menuWidth2 - 1, menuY2 + menuHeight2 - 1);

  // Ajoutez du texte au menu
  if (invertedColors) {
    g.setColor(1, 1, 1);
  } else {
    g.setColor(0, 0, 0);
  }

  // Affichez le texte "Auto contraste"
  const buttonTextX = menuX2 + 10;
  const buttonTextY = menuY2 + 15;
  g.drawString("Auto contraste", buttonTextX, buttonTextY);

  // Dessinez le bouton On/Off
  if (autoInvertedColors) {
    g.setColor(0, 1, 0); // Vert pour activé
  } else {
    g.setColor(1, 0, 0); // Rouge pour désactivé
  }
  g.fillRect(buttonRectX, buttonRectY, buttonRectX + buttonRectWidth, buttonRectY + buttonRectHeight);
  g.setColor(0, 0, 0); // Contour noir
  g.drawRect(buttonRectX, buttonRectY, buttonRectX + buttonRectWidth, buttonRectY + buttonRectHeight);
}

// Événement de toucher
Bangle.on('touch', (button, xy) => {
  if (
    xy.x >= buttonRectX &&
    xy.x <= buttonRectX + buttonRectWidth &&
    xy.y >= buttonRectY &&
    xy.y <= buttonRectY + buttonRectHeight
  ) {

  if (isPetMenuOpen) {
    autoInvertedColors = !autoInvertedColors;
    require("Storage").write("autoInvertedColors.json", JSON.stringify(autoInvertedColors));
  }
  }
});



const leftButtonX3 = g.getWidth() - buttonSize - 2;
let isMenuOpen = false;

Bangle.on('touch', (button, xy) => {
  // Vérifiez si les coordonnées du toucher sont à l'intérieur du bouton
  if (
    xy.x >= leftButtonX3 &&
    xy.x <= leftButtonX3 + buttonSize &&
    xy.y >= buttonY &&
    xy.y <= buttonY + buttonSize
  ) {
    // Basculer l'état du menu
    isMenuOpen = !isMenuOpen;

    // Dessiner le menu
    drawMenu(isMenuOpen);
  }
});

// Variables pour le système d'alarme
const now = new Date();
let alarmHours = now.getHours();
let alarmMinutes = now.getMinutes() - 1;
let alarmEnabled = false;

// Dessinez le menu avec fond blanc, contour noir et ombre
const menuWidth = 160;
const menuHeight = 120;
const menuX = g.getWidth() - menuWidth - 5;
const menuY = g.getHeight() - menuHeight - 35;

// Fonction pour dessiner le menu
function drawMenu(isOpen) {
  // Enregistrez l'état du menu
  isMenuOpen = isOpen;

  // Ajoutez une ombre
  g.fillRect(menuX + 5, menuY + 5, menuX + menuWidth + 5, menuY + menuHeight + 5);

  // Ajoutez un contour noir
  if (invertedColors) {
  g.setColor(1, 1, 1); 
} else {
  g.setColor(0, 0, 0);
}
  g.drawRect(menuX, menuY, menuX + menuWidth, menuY + menuHeight);

  // Remplissez le fond en blanc
  if (invertedColors) {
  g.setColor(0, 0, 0); 
} else {
  g.setColor(1, 1, 1);
}
  g.fillRect(menuX + 1, menuY + 1, menuX + menuWidth - 1, menuY + menuHeight - 1);

  // Ajoutez du texte au menu
  if (invertedColors) {
  g.setColor(1, 1, 1); 
} else {
  g.setColor(0, 0, 0);
}

  // Ajoutez le système d'alarme au menu
  g.drawString("Alarme :", menuX + 10, menuY + 30);
  g.drawString(`${alarmHours}:${alarmMinutes}`, menuX + 80, menuY + 30);
  g.drawString(alarmEnabled ? "Activee" : "Desactivee", menuX + 10, menuY + 50);

  // Ajoutez les boutons pour ajuster l'alarme
  const buttonSize = 20;
  g.setColor(0, 0, 1); // Couleur bleue

  // Bouton "+ 1 heure"
  g.fillRect(menuX + 10, menuY + 70, menuX + 10 + buttonSize, menuY + 70 + buttonSize);
  g.setColor(1, 1, 1); // Couleur blanche pour le texte
  g.drawString("+1H", menuX + 15, menuY + 78);

  // Bouton "- 1 heure"
  g.setColor(0, 0, 1); // Couleur bleue
  g.fillRect(menuX + 40, menuY + 70, menuX + 40 + buttonSize, menuY + 70 + buttonSize);
  g.setColor(1, 1, 1); // Couleur blanche pour le texte
  g.drawString("-1H", menuX + 45, menuY + 78);

  // Bouton "+ 1 minute"
  g.setColor(0, 0, 1); // Couleur bleue
  g.fillRect(menuX + 10, menuY + 95, menuX + 10 + buttonSize, menuY + 95 + buttonSize);
  g.setColor(1, 1, 1); // Couleur blanche pour le texte
  g.drawString("+1M", menuX + 15, menuY + 103);

  // Bouton "- 1 minute"
  g.setColor(0, 0, 1); // Couleur bleue
  g.fillRect(menuX + 40, menuY + 95, menuX + 40 + buttonSize, menuY + 95 + buttonSize);
  g.setColor(1, 1, 1); // Couleur blanche pour le texte
  g.drawString("-1M", menuX + 45, menuY + 103);

  // Bouton pour activer/désactiver l'alarme
  g.setColor(0, 0, 1); // Couleur bleue
  g.fillRect(menuX + 90, menuY + 70, menuX + 90 + buttonSize, menuY + 70 + buttonSize);
  g.setColor(1, 1, 1); // Couleur blanche pour le texte
  g.drawString(alarmEnabled ? "Off" : "On", menuX + 98, menuY + 78);
  
  if (invertedColors) {
  g.setColor(1, 1, 1); 
} else {
  g.setColor(0, 0, 0);
}
}

// Événement de changement d'heure pour le système d'alarme
Bangle.on('HRM', function (event) {
  if (alarmEnabled && event) {
    const now = new Date();
    if (now.getHours() === alarmHours && now.getMinutes() === alarmMinutes) {
      // Déclencher une action lorsque l'alarme se déclenche
      console.log("Alarme !");

      // Réinitialiser l'alarme
      alarmEnabled = false;
    }
  }
});

Bangle.on('touch', function (button, xy) {
  // Vérifiez si les coordonnées du toucher sont à l'intérieur du menu
  if (
    isMenuOpen &&
    xy.x >= menuX &&
    xy.x <= menuX + menuWidth &&
    xy.y >= menuY &&
    xy.y <= menuY + menuHeight
  ) {
    // Boutons pour ajuster l'alarme
    if (xy.x >= menuX + 10 && xy.x <= menuX + 30 && xy.y >= menuY + 70 && xy.y <= menuY + 90) {
      // Bouton "+ 1 heure"
      alarmHours = (alarmHours + 1) % 24;
    } else if (xy.x >= menuX + 40 && xy.x <= menuX + 60 && xy.y >= menuY + 70 && xy.y <= menuY + 90) {
      // Bouton "- 1 heure"
      alarmHours = (alarmHours - 1 + 24) % 24;
    } else if (xy.x >= menuX + 10 && xy.x <= menuX + 30 && xy.y >= menuY + 95 && xy.y <= menuY + 115) {
      // Bouton "+ 1 minute"
      alarmMinutes = (alarmMinutes + 1) % 60;
    } else if (xy.x >= menuX + 40 && xy.x <= menuX + 60 && xy.y >= menuY + 95 && xy.y <= menuY + 115) {
      // Bouton "- 1 minute"
      alarmMinutes = (alarmMinutes - 1 + 60) % 60;
    } else if (xy.x >= menuX + 90 && xy.x <= menuX + 110 && xy.y >= menuY + 70 && xy.y <= menuY + 95) {
      // Bouton pour activer/désactiver l'alarme
      alarmEnabled = !alarmEnabled;
    }
  }
});












Bangle.on('sleep', function() {
  awake = false;
});

Bangle.on('wake', function() {
  awake = true;
});

// Événement de toucher
Bangle.on('touch', (button, xy) => {
  if (
    xy.x >= 0 &&
    xy.x <= 176 &&
    xy.y >= centerY - 37 &&
    xy.y <= centerY - 37 + clockHeight
  ) {

  if (!isPetMenuOpen && !isMenuOpen) {
   showClock = !showClock;
  }
  }
});

let widgets = false;
let updateOn = true;
function update() {
  if (updateOn) {
  if (awake) {
  xOffset += speed;
  yOffset += speed;

  // Réinitialisez les offsets si nécessaire pour éviter un débordement
  if (xOffset > tileImg.width) {
    xOffset = 0;
  }
  if (yOffset > tileImg.height) {
    yOffset = 0;
  }

  // Effacez l'écran avant de redessiner
  g.clear();

  // Inversez les couleurs si invertedColors est true
  if (invertedColors) {
    g.setColor(1, 1, 1); // Blanc
    g.setBgColor(0, 0, 0); // Noir
  }

  // Dessinez le fond d'écran
  drawBackground();

  // Dessinez l'horloge
  if (showClock) {
  drawClock();
  }

  // Dessinez le calendrier
  if (showClock) {
  drawCalendar();
  }

  // Dessinez la date
  if (showClock) {
  drawDate();
  }

  drawTopBar();

  drawBottomButtons();

  // Dessinez le menu si ouvert
  if (isMenuOpen) {
    drawMenu(true);
  }

  if (isPetMenuOpen) {
    drawPetMenu(true);
  }

  // Obtenez les informations sur la mémoire
  // const memoryInfo = process.memory();
  // const usedPercent = Math.round((memoryInfo.usage / memoryInfo.total) * 100);

  // Affichez les informations sur l'utilisation de la mémoire dans la console
  // console.log(`RAM USAGE: ${usedPercent}%`);

  }
  // Gérez l'alarme
  if (alarmEnabled && !isAlarmSounding) {
    const now = new Date();
    if (now.getHours() === alarmHours && now.getMinutes() === alarmMinutes) {
        // Activation de l'alarme
        isAlarmSounding = true;
        g.setColor(1, 1, 1); // Blanc
        g.fillRect(40, 80, 200, 120); // Fond blanc au milieu de l'écran
        g.setColor(0, 0, 0); // Noir
        g.drawString("Alarme !", 120, 100); // Texte "Alarme !" centré
        Bangle.buzz(1000); // Faire vibrer chaque seconde
    }
}

  if (isAlarmSounding) {
  // Continuer à faire vibrer chaque seconde
  Bangle.buzz(1000);

  // Dimensions de la boîte
  const boxWidth = 120;
  const boxHeight = 120;

  // Calcul des coordonnées pour centrer la boîte
  const boxX = (g.getWidth() - boxWidth) / 2;
  const boxY = (g.getHeight() - boxHeight) / 2;

  // Fond blanc au milieu de l'écran avec contour noir et ombre noire
  if (invertedColors) {
    g.setColor(1, 1, 1);
  } else {
    g.setColor(0, 0, 0);
  }
  g.drawRect(boxX - 1, boxY - 1, boxX + boxWidth + 1, boxY + boxHeight + 1); // Contour noir
  g.fillRect(boxX + 4, boxY + 4, boxX + boxWidth + 4, boxY + boxHeight + 4); // Ombre
  if (invertedColors) {
    g.setColor(0, 0, 0);
  } else {
    g.setColor(1, 1, 1);
  }
  g.fillRect(boxX, boxY, boxX + boxWidth, boxY + boxHeight); // Fond blanc

  // Dessiner le texte "Alarme !" centré
  if (flicker) {
    g.setColor(1, 0, 0);
    flicker = false;
  } else {
  if (invertedColors) {
    g.setColor(1, 1, 1);
  } else {
    g.setColor(0, 0, 0);
  }
    flicker = true;
  }
  const text = "Alarme !";
  const textX = boxX + (boxWidth - g.stringWidth(text)) / 2;
  const textY = boxY + (boxHeight - g.getFontHeight()) / 2;
  g.drawString(text, textX, textY);
  g.setColor(0, 0, 0);
}

if (autoInvertedColors) {
  const currentHour = new Date().getHours();
  if (currentHour >= 21 || (currentHour >= 0 && currentHour < 6) || (currentHour === 6 && new Date().getMinutes() < 30)) {
    invertedColors = true;
  } else {
    invertedColors = false;
  }
}

  // Restaurez les couleurs par défaut
  if (invertedColors) {
    g.setColor(0, 0, 0); // Noir
    g.setBgColor(1, 1, 1); // Blanc
  }

  // Mettez à jour l'affichage
  g.flip();

  if (widgets) {
      g.clear();
    Bangle.setUI({
  mode : "clock",
  remove : function() {
  }});
   Bangle.loadWidgets();
   updateOn = false;
  }

  }}

setWatch(function() {
    if (!isAlarmSounding) { // Vérifie si l'alarme ne sonne pas
      if (!widgets) {
        widgets = true;
      } else {
        widgets = false;
        updateOn = true;
      }
    } else { // Si l'alarme sonne, arrêtez-la
      alarmEnabled = false;
      Bangle.buzz(0);
      isAlarmSounding = false;
    }
}, BTN, { repeat: true, edge: "rising"});

setTimeout(function() {
    if (widgets) {
        Bangle.drawWidgets();
    }
}, 0);

// Mettez à jour continuellement l'affichage
setInterval(update, 100); // Appel toutes les 100 ms pour une mise à jour plus fréquente des offsets
