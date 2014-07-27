/*!
  SWFObject v2.3.20130521 <http://github.com/swfobject/swfobject> is released
  under the MIT License <http://www.opensource.org/licenses/mit-license.php>
*/

/* global ActiveXObject: false */


'use strict';

var UNDEF = "undefined";
var OBJECT = "object";
var SHOCKWAVE_FLASH = "Shockwave Flash";
var SHOCKWAVE_FLASH_AX = "ShockwaveFlash.ShockwaveFlash";
var FLASH_MIME_TYPE = "application/x-shockwave-flash";

var win = window;
var nav = navigator;

var toInt = function (str) {
  return parseInt(str, 10);
};

var playerMajorVersion = 0;
if (typeof nav.plugins !== UNDEF && typeof nav.plugins[SHOCKWAVE_FLASH] === OBJECT) {
  var d = nav.plugins[SHOCKWAVE_FLASH].description;
  // nav.mimeTypes["application/x-shockwave-flash"].enabledPlugin indicates whether plug-ins are enabled or disabled in Safari 3+
  if (d && (typeof nav.mimeTypes !== UNDEF && nav.mimeTypes[FLASH_MIME_TYPE] && nav.mimeTypes[FLASH_MIME_TYPE].enabledPlugin)) {
    d = d.replace(/^.*\s+(\S+\s+\S+$)/, "$1");
    playerMajorVersion = toInt(d.replace(/^(.*)\..*$/, "$1"));
  }
}
else if (typeof win.ActiveXObject !== UNDEF) {
  try {
    var a = new ActiveXObject(SHOCKWAVE_FLASH_AX);
    if (a) { // a will return null when ActiveX is disabled
      var d = a.GetVariable("$version");
      if (d) {
        d = d.split(" ")[1].split(",");
        playerMajorVersion = toInt(d[0]);
      }
    }
  }
  catch (e) {}
}


// Require shim
module.exports = playerMajorVersion;
