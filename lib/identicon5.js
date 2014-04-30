/*

  Plugin: Identicon5 v1.0.0
  Author: http://FrancisShanahan.com
  Description: Draws identicons using HTML5 Canvas.

  Attribution: Based off the PHP implementation of Don Park's original identicon
  code for visual representation of MD5 hash values.

  Reference: http://sourceforge.net/projects/identicons/

*/

/*

  Modified for SuperGenPass:
  1. Do not fallback to Gravatar images (prevents password hashes from appearing in foreign server log).
  2. Require a canvas element to passed as a parameter.
  3. Require a hash to be passed as a parameter.
  4. Add support for high-dpi identicons.
  5. Remove dependency on jQuery.
  6. Remove test function.
  7. Export function for require.

*/

/* fills a polygon based on a path */
var fillPoly = function (ctx, path) {
  if (path.length >= 2) {
    ctx.beginPath();
    ctx.moveTo(path[0], path[1]);
    for (var i = 2; i < path.length; i++) {
      ctx.lineTo(path[i], path[i + 1]);
      i++;
    }
    ctx.fill();
  }
};

/* generate sprite for corners and sides */
var getsprite = function (shape, size) {

  switch (shape) {
  case 0: // triangle
    shape = [0.5, 1, 1, 0, 1, 1];
    break;
  case 1: // parallelogram
    shape = [0.5, 0, 1, 0, 0.5, 1, 0, 1];
    break;
  case 2: // mouse ears
    shape = [0.5, 0, 1, 0, 1, 1, 0.5, 1, 1, 0.5];
    break;
  case 3: // ribbon
    shape = [0, 0.5, 0.5, 0, 1, 0.5, 0.5, 1, 0.5, 0.5];
    break;
  case 4: // sails
    shape = [0, 0.5, 1, 0, 1, 1, 0, 1, 1, 0.5];
    break;
  case 5: // fins
    shape = [1, 0, 1, 1, 0.5, 1, 1, 0.5, 0.5, 0.5];
    break;
  case 6: // beak
    shape = [0, 0, 1, 0, 1, 0.5, 0, 0, 0.5, 1, 0, 1];
    break;
  case 7: // chevron
    shape = [0, 0, 0.5, 0, 1, 0.5, 0.5, 1, 0, 1, 0.5, 0.5];
    break;
  case 8: // fish
    shape = [0.5, 0, 0.5, 0.5, 1, 0.5, 1, 1, 0.5, 1, 0.5, 0.5, 0, 0.5];
    break;
  case 9: // kite
    shape = [0, 0, 1, 0, 0.5, 0.5, 1, 0.5, 0.5, 1, 0.5, 0.5, 0, 1];
    break;
  case 10: // trough
    shape = [0, 0.5, 0.5, 1, 1, 0.5, 0.5, 0, 1, 0, 1, 1, 0, 1];
    break;
  case 11: // rays
    shape = [0.5, 0, 1, 0, 1, 1, 0.5, 1, 1, 0.75, 0.5, 0.5, 1, 0.25];
    break;
  case 12: // double rhombus
    shape = [0, 0.5, 0.5, 0, 0.5, 0.5, 1, 0, 1, 0.5, 0.5, 1, 0.5, 0.5, 0, 1];
    break;
  case 13: // crown
    shape = [0, 0, 1, 0, 1, 1, 0, 1, 1, 0.5, 0.5, 0.25, 0.5, 0.75, 0, 0.5, 0.5, 0.25];
    break;
  case 14: // radioactive
    shape = [0, 0.5, 0.5, 0.5, 0.5, 0, 1, 0, 0.5, 0.5, 1, 0.5, 0.5, 1, 0.5, 0.5, 0, 1];
    break;
  default: // tiles
    shape = [0, 0, 1, 0, 0.5, 0.5, 0.5, 0, 0, 0.5, 1, 0.5, 0.5, 1, 0.5, 0.5, 0, 1];
    break;
  }

  /* scale up */
  for (var i = 0; i < shape.length; i++) {
    shape[i] = shape[i] * size;
  }

  return shape;

};

/* Draw a polygon at location x,y and rotated by angle */
/* assumes polys are square */
var drawRotatedPolygon = function (ctx, sprite, x, y, shapeangle, angle, size) {

  var halfSize = size / 2;
  ctx.save();

  ctx.translate(x, y);
  ctx.rotate(angle * Math.PI / 180);
  ctx.save();
  ctx.translate(halfSize, halfSize);
  var tmpSprite = [];
  for (var p = 0; p < sprite.length; p++) {
    tmpSprite[p] = sprite[p] - halfSize;
  }
  ctx.rotate(shapeangle);
  fillPoly(ctx, tmpSprite);

  ctx.restore();
  ctx.restore();

};

/* generate sprite for center block */
var getcenter = function (shape, size) {

  switch (shape) {
  case 0: // empty
    shape = [];
    break;
  case 1: // fill
    shape = [0, 0, 1, 0, 1, 1, 0, 1];
    break;
  case 2: // diamond
    shape = [0.5, 0, 1, 0.5, 0.5, 1, 0, 0.5];
    break;
  case 3: // reverse diamond
    shape = [0, 0, 1, 0, 1, 1, 0, 1, 0, 0.5, 0.5, 1, 1, 0.5, 0.5, 0, 0, 0.5];
    break;
  case 4: // cross
    shape = [0.25, 0, 0.75, 0, 0.5, 0.5, 1, 0.25, 1, 0.75, 0.5, 0.5, 0.75, 1, 0.25, 1, 0.5, 0.5, 0, 0.75, 0, 0.25, 0.5, 0.5];
    break;
  case 5: // morning star
    shape = [0, 0, 0.5, 0.25, 1, 0, 0.75, 0.5, 1, 1, 0.5, 0.75, 0, 1, 0.25, 0.5];
    break;
  case 6: // small square
    shape = [0.33, 0.33, 0.67, 0.33, 0.67, 0.67, 0.33, 0.67];
    break;
  case 7: // checkerboard
    shape = [0, 0, 0.33, 0, 0.33, 0.33, 0.66, 0.33, 0.67, 0, 1, 0, 1, 0.33, 0.67, 0.33, 0.67, 0.67, 1, 0.67, 1, 1, 0.67, 1, 0.67, 0.67, 0.33, 0.67, 0.33, 1, 0, 1, 0, 0.67, 0.33, 0.67, 0.33, 0.33, 0, 0.33];
    break;
  default: // tiles
    shape = [0, 0, 1, 0, 0.5, 0.5, 0.5, 0, 0, 0.5, 1, 0.5, 0.5, 1, 0.5, 0.5, 0, 1];
    break;
  }

  /* apply ratios */
  for (var i = 0; i < shape.length; i++) {
    shape[i] = shape[i] * size;
  }

  return shape;

};

// main drawing function.
// Draws a identicon, based off an MD5 hash value of size "width"
// (identicons are always square)
var draw = function (ctx, hash, width) {

  var csh = parseInt(hash.substr(0, 1), 16); // corner sprite shape
  var ssh = parseInt(hash.substr(1, 1), 16); // side sprite shape
  var xsh = parseInt(hash.substr(2, 1), 16) & 7; // center sprite shape

  var halfPi = Math.PI/2;
  var cro = halfPi * (parseInt(hash.substr(3, 1), 16) & 3); // corner sprite rotation
  var sro = halfPi * (parseInt(hash.substr(4, 1), 16) & 3); // side sprite rotation
  var xbg = parseInt(hash.substr(5, 1), 16) % 2; // center sprite background

  /* corner sprite foreground color */
  var cfr = parseInt(hash.substr(6, 2), 16);
  var cfg = parseInt(hash.substr(8, 2), 16);
  var cfb = parseInt(hash.substr(10, 2), 16);

  /* side sprite foreground color */
  var sfr = parseInt(hash.substr(12, 2), 16);
  var sfg = parseInt(hash.substr(14, 2), 16);
  var sfb = parseInt(hash.substr(16, 2), 16);

  /* size of each sprite */
  var size = width / 3;
  var totalsize = width;

  /* start with blank 3x3 identicon */

  /* generate corner sprites */
  var corner = getsprite(csh, size);
  ctx.fillStyle = "rgb(" + cfr + "," + cfg + "," + cfb + ")";
  drawRotatedPolygon(ctx, corner, 0, 0, cro, 0, size);
  drawRotatedPolygon(ctx, corner, totalsize, 0, cro, 90, size);
  drawRotatedPolygon(ctx, corner, totalsize, totalsize, cro, 180, size);
  drawRotatedPolygon(ctx, corner, 0, totalsize, cro, 270, size);

  /* draw sides */
  var side = getsprite(ssh, size);
  ctx.fillStyle = "rgb(" + sfr + "," + sfg + "," + sfb + ")";
  drawRotatedPolygon(ctx, side, 0, size, sro, 0, size);
  drawRotatedPolygon(ctx, side, 2 * size, 0, sro, 90, size);
  drawRotatedPolygon(ctx, side, 3 * size, 2 * size, sro, 180, size);
  drawRotatedPolygon(ctx, side, size, 3 * size, sro, 270, size);

  var center = getcenter(xsh, size);

  /* make sure there's enough contrast before we use background color of side sprite */
  if (xbg > 0 && (Math.abs(cfr - sfr) > 127 || Math.abs(cfg - sfg) > 127 || Math.abs(cfb - sfb) > 127)) {
    ctx.fillStyle = "rgb(" + sfr + "," + sfg + "," + sfb + ")";
  } else {
    ctx.fillStyle = "rgb(" + cfr + "," + cfg + "," + cfb + ")";
  }

  drawRotatedPolygon(ctx, center, size, size, 0, 0, size);

};

var identicon5 = function (canvas, hash, size) {

  if (hash && canvas && canvas.getContext) {

    // canvas is supported
    var ctx = canvas.getContext("2d");

    // support high-dpi
    if(window.devicePixelRatio && window.devicePixelRatio == 2) {
      canvas.width = canvas.height = size * 2;
      ctx.scale(2, 2);
    } else {
      canvas.width = canvas.height = size;
    }

    draw(ctx, hash, size);

  }

};

// Require shim
module.exports = identicon5;
