module('SuperGenPass mobile version');

// Enumerate jQuery selectors for caching.
var $iframe = $('#SGP');
var $el = {};
var selectors =
  [
    'Passwd',
    'Secret',
    'Domain',
    'DisableTLD',
    'Len',
    'MethodMD5',
    'MethodSHA512',
    'DisableTLD',
    'Generate',
    'Output'
  ];

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


/* Test setup */

var setupTest1 = function () {
  $el.Passwd.val('test');
  $el.Secret.val('secret');
  $el.Domain.val('https://login.example.com');
  $el.Len.val('10');
  $el.MethodMD5.prop('checked', true);
  $el.DisableTLD.prop('checked', false);
};

var setupTest2 = function () {
  $el.Secret.val('');
};

var setupTest3 = function () {
  $el.MethodSHA512.prop('checked', true);
};

var setupTest4 = function () {
  $el.Len.val('2');
};

var setupTest5 = function () {
  $el.Len.val('100');
  $el.Secret.val('ssshh');
};

var setupTest6 = function () {
  $el.Domain.val('https://login.example.com');
  $el.DisableTLD.prop('checked', true);
};


/* Test data */

var testData = [
  [setupTest1, 'iTbF7RViG5'],
  [setupTest2, 'w9UbG0NEk7'],
  [setupTest3, 'sJfoZg3nU8'],
  [setupTest4, 'aC81'],
  [setupTest5, 'fd35Ng0Xwne2Pb8f3XFu8r8y'],
  [setupTest6, 'alrcP2cLv1lDddHXjExlS0H9']
];

var testLength = testData.length;
var testIndex = 0;


/* Chain tests */

var nextTest = function () {
  if (testIndex < testLength) {
    testData[testIndex][0].call();
    runTest();
  } else if (testIndex === testLength) {
    testLocalStorage();
    start();
  }
};

var runTest = function () {
  sendClick();
  setTimeout(function () {
    ok($el.Output.text() === testData[testIndex][1], 'Generated "' + testData[testIndex][1] + '".');
    testIndex++;
    nextTest();
  }, 100);
};

var testLocalStorage = function () {
  ok(localStorage.getItem('Len') === '24', 'Password length value stored.');
  ok(localStorage.getItem('Salt') === 'ssshh', 'Secret password value stored.');
  ok(localStorage.getItem('Method') === 'sha512', 'Hash method setting stored.');
  ok(localStorage.getItem('DisableTLD') === 'true', 'Subdomain removal setting stored.');
};

asyncTest('Password generation', function () {
  expect(10);
  nextTest();
});
