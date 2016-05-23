'use strict';

/*jshint browser: true, jquery: true, latedef: false, qunit: true*/

QUnit.module('SuperGenPass mobile version');

// Enumerate jQuery selectors for caching.
var $iframe = $('#SGP');
var $el = {};
var selectors =
  [
    'Passwd',
    'Secret',
    'Domain',
    'RemoveSubdomains',
    'Len',
    'MethodMD5',
    'MethodSHA512',
    'SaveDefaults',
    'Generate',
    'Output'
  ];

// Clear local storage.
localStorage.clear();

// Create click event.
var clickEvent = document.createEvent('Event');
clickEvent.initEvent('click', true, true);

// Populate selector cache.
$.each(selectors, function (i, val) {
  $el[val] = $('#' + val, $iframe[0].contentWindow.document);
});

// Send click event.
var sendClick = function () {
  $el.Generate[0].dispatchEvent(clickEvent);
};


/* Tests */

var suite = [
  {
    name: 'initial input',
    setup: function () {
      $el.Passwd.val('test');
      $el.Secret.val('secret');
      $el.Domain.val('https://login.example.com');
      $el.Len.val('10');
      $el.MethodMD5.prop('checked', true);
      $el.RemoveSubdomains.prop('checked', true);
    },
    expect: 'iTbF7RViG5'
  },
  {
    name: 'remove secret',
    setup: function () {
      $el.Secret.val('');
    },
    expect: 'w9UbG0NEk7'
  },
  {
    name: 'using SHA512',
    setup: function () {
      $el.MethodSHA512.prop('checked', true);
    },
    expect: 'sJfoZg3nU8'
  },
  {
    name: 'change length to 2',
    setup: function () {
      $el.Len.val('2');
    },
    expect: 'aC81'
  },
  {
    name: 'change secret and length to 100',
    setup: function () {
      $el.Len.val('100');
      $el.Secret.val('ssshh');
    },
    expect: 'fd35Ng0Xwne2Pb8f3XFu8r8y'
  },
  {
    name: 'change domain and subdomain removal',
    setup: function () {
      $el.Domain.val('https://login.example.com');
      $el.RemoveSubdomains.prop('checked', false);
    },
    expect: 'alrcP2cLv1lDddHXjExlS0H9'
  },
  {
    name: 'check local storage',
    setup: function () {
      $el.SaveDefaults[0].dispatchEvent(clickEvent);
    },
    expect: function (assert, done) {
      assert.ok(localStorage.getItem('Len') === '24', 'Password length value stored.');
      assert.ok(localStorage.getItem('Salt') === 'ssshh', 'Secret password value stored.');
      assert.ok(localStorage.getItem('Method') === 'sha512', 'Hash method setting stored.');
      assert.ok(localStorage.getItem('DisableTLD') === 'true', 'Subdomain removal setting stored.');
      done();
    }
  }
];

suite.forEach(function (test) {
  QUnit.test(test.name, function (assert) {
    var done = assert.async();
    test.setup();

    sendClick();

    if (typeof test.expect === 'function') {
      test.expect(assert, done);
      return;
    }

    setTimeout(function () {
      assert.equal($el.Output.text(), test.expect);
      done();
    }, 100);
  });
});
