// 68k Mac Finder desktop themed clock
// by Giles Booth @blogmywiki
// improvements by Peer David

var img = require("heatshrink").decompress(atob("2GwgP4C6cf8AVTg/ACqcDwADBDCMBCoICCCqACEj8zAwXwmcYgEGswYHhxwBjEDGocwCoVgQxHwCoMzjwVBwPzngrCnlmDAsfNoIVBIQMBwZBEAAIVIjwVD8YVNIIc/FY9+CpcwCo9gCo0PQYUzmIVGo1is1ACokGNoaDC+PzhkAg+Gnl/aiIA/AD//AClVACmqACgr/Fd2vVqP+FYNUbKMNFYOsCqMOFa+t/f/35LC/AODK43uFYUCgGACAUB/IFDFZP6gArEsArTgFhz9w+ArRsOZzOYFaQVCFan4FaiFHFZuIFaeYQZbbVf5LbK1gVRhwrX15MGABX+K/4r/Ff4r/Ff4r/Ff4r/Ff4r/Ff4r/Ff4r/Ff4r/Ff4r/Ff4r/Ff4r/Ff4r/Ff4r/Ff4r/Ff4r/Ff4r/Ff4r/Ff4r/Ff4r/Fe+v/4AQ/wrBq4VR/orBAClVACgr/Ff4r/AAmr6or/q/6Fae/A="));

var font = atob("f3/gMB/7+AAAACA///AAAAAAQcHhsZ+LhAAAgUhsPh38eAAADAoJCI///BAA8XhkMhn8eAAAPz/0Mhn4eAAAgEAh8f+HgAAAb3/kMh/7eAAAeH5hML/z8AAAAAADYbAAAAAA");

var drawTimeout;

// schedule a draw for the next second
function queueDraw() {
  if (drawTimeout) clearTimeout(drawTimeout);
  drawTimeout = setTimeout(function() {
    drawTimeout = undefined;
    draw();
    queueDraw(); // Appel récursif pour planifier le prochain dessin
  }, 1000 - (Date.now() % 1000)); // Modifier le délai à 1000 pour une seconde
}

function draw() {
  queueDraw();

  // Fix theme to "light"
  g.setTheme({bg:"#fff", fg:"#000", dark:false}).clear();
  g.reset();
  g.drawImage(img,0,0);

  g.setFontCustom(font, 48, 8, 521);
  g.setFontAlign(0, -1, 0);
  g.setColor(0,0,0);
  
  var d = new Date();
  var hh = ("0" + d.getHours()).substr(-2);
  var mm = ("0" + d.getMinutes()).substr(-2);
  var ss = ("0" + d.getSeconds()).substr(-2); // Modification: récupération des secondes directement depuis l'objet Date

  g.drawString(hh, 39, 65, true);
  g.drawString(mm, 90, 65, true);
  g.drawString(ss, 136, 65, true); // Modification: affichage des secondes à une nouvelle position
  g.drawString(':', 65,65);
  g.drawString(':', 112,65);
  
  var dd = ("0" + d.getDate()).substr(-2);
  var mo = ("0" + (d.getMonth() + 1)).substr(-2);
  var yy = ("0" + d.getFullYear()).substr(-2);
  g.setFontCustom(font, 48, 8, 521);
  g.drawString(dd + ':' + mo + ':' + yy, 88, 120, true);
}


// handle switch display on by pressing BTN1
Bangle.on('lcdPower',on=>{
  if (on) {
    draw(); // draw immediately, queue redraw
  } else { // stop draw timer
    if (drawTimeout) clearTimeout(drawTimeout);
    drawTimeout = undefined;
  }
});

Bangle.setUI("clock");

// Load widgets but hide them
Bangle.loadWidgets();
require("widget_utils").swipeOn(); // hide widgets, make them visible with a swipe
draw();