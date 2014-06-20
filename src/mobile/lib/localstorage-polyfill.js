/*
 * LocalStorage polyfill
 * Based on https://gist.github.com/remy/350433 by Remy Sharp
 * Improved by Chris Zarate
 */


'use strict';

/* Wrap storage API tests in try/catch to avoid browser errors. */

var LocalStorage, SessionStorage;

try {
  LocalStorage = window.localStorage;
  LocalStorage.setItem('TEST', '1');
  LocalStorage.removeItem('TEST');
} catch(e) {
  LocalStorage = false;
}

try {
  SessionStorage = window.sessionStorage;
  SessionStorage.setItem('TEST', '1');
  SessionStorage.removeItem('TEST');
} catch(e) {
  SessionStorage = false;
}

/* Provide polyfill if native support is not available. */

if(!LocalStorage || !SessionStorage) {

  var Storage = function (type) {
    function createCookie(name, value, days) {
      var date, expires;

      if (days) {
        date = new Date();
        date.setTime(date.getTime()+(days*24*60*60*1000));
        expires = "; expires="+date.toGMTString();
      } else {
        expires = "";
      }
      document.cookie = name+"="+value+expires+"; path=/";
    }

    function readCookie(name) {
      var nameEQ = name + "=",
          ca = document.cookie.split(';'),
          i, c;

      for (i=0; i < ca.length; i++) {
        c = ca[i];
        while (c.charAt(0) === ' ') {
          c = c.substring(1,c.length);
        }

        if (c.indexOf(nameEQ) === 0) {
          return c.substring(nameEQ.length,c.length);
        }
      }
      return null;
    }

    function setData(data) {
      data = JSON.stringify(data);
      if (type === 'session') {
        window.name = data;
      } else {
        createCookie('localStorage', data, 365);
      }
    }

    function clearData() {
      if (type === 'session') {
        window.name = '';
      } else {
        createCookie('localStorage', '', 365);
      }
    }

    function getData() {
      var data = type === 'session' ? window.name : readCookie('localStorage');
      return data ? JSON.parse(data) : {};
    }


    // initialise if there's already data
    var data = getData();

    return {
      length: 0,
      clear: function () {
        data = {};
        this.length = 0;
        clearData();
      },
      getItem: function (key) {
        return data[key] === undefined ? null : data[key];
      },
      key: function (i) {
        // not perfect, but works
        var ctr = 0;
        for (var k in data) {
          if (ctr === i) return k;
          else ctr++;
        }
        return null;
      },
      removeItem: function (key) {
        delete data[key];
        this.length--;
        setData(data);
      },
      setItem: function (key, value) {
        data[key] = value+''; // forces the value to a string
        this.length++;
        setData(data);
      }
    };
  };

  /*
    First try to provide polyfill on the window object. But remember that
    the browser's security policy may be standing in the way even when
    native support is available. So fall back to an imposter object.
  */

  try {
    if(!LocalStorage) {
      LocalStorage = window.localStorage = new Storage('local');
    }
  } catch(e) {
    LocalStorage = new Storage('local');
  }

  try {
    if(!SessionStorage) {
      SessionStorage = window.sessionStorage = new Storage('session');
    }
  } catch(e) {
    SessionStorage = new Storage('session');
  }

}

/* Exports */

module.exports = {
  local: LocalStorage,
  session: SessionStorage
};
