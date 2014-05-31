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


var testMobileVersion = function () {

  // Populate selector cache.
  $.each(selectors, function (i, val) {
    $el[val] = $('#' + val, $iframe[0].contentWindow.document);
  });

  // Create click event.
  var clickEvent = document.createEvent('Event');
  clickEvent.initEvent('click', true, true);

  test('Password generation', function () {

    expect(6);

    // Set initial form values.
    $el.Passwd.val('test');
    $el.Secret.val('secret');
    $el.Domain.val('https://login.example.com');
    $el.Len.val('10');
    $el.MethodMD5.prop('checked', true);
    $el.DisableTLD.prop('checked', false);

    // Send click event and test output.
    $el.Generate[0].dispatchEvent(clickEvent);
    ok($el.Output.text() === 'iTbF7RViG5', 'Generated "iTbF7RViG5".');

    // Clear secret password.
    $el.Secret.val('');

    // Send click event and test output.
    $el.Generate[0].dispatchEvent(clickEvent);
    ok($el.Output.text() === 'w9UbG0NEk7', 'Generated "w9UbG0NEk7".');

    // Change hash method to SHA-512.
    $el.MethodSHA512.prop('checked', true);

    // Send click event and test output.
    $el.Generate[0].dispatchEvent(clickEvent);
    ok($el.Output.text() === 'sJfoZg3nU8', 'Generated "sJfoZg3nU8".');

    // Change length to 2 (test input validation).
    $el.Len.val('2');

    // Send click event and test output.
    $el.Generate[0].dispatchEvent(clickEvent);
    ok($el.Output.text() === 'aC81', 'Generated "aC81".');

    // Change length to 100 (test input validation) and add secret password.
    $el.Len.val('100');
    $el.Secret.val('ssshh');

    // Send click event and test output.
    $el.Generate[0].dispatchEvent(clickEvent);
    ok($el.Output.text() === 'fd35Ng0Xwne2Pb8f3XFu8r8y', 'Generated "fd35Ng0Xwne2Pb8f3XFu8r8y".');

    // Disable subdomain removal.
    $el.Domain.val('https://login.example.com');
    $el.DisableTLD.prop('checked', true);

    // Send click event and test output.
    $el.Generate[0].dispatchEvent(clickEvent);
    ok($el.Output.text() === 'alrcP2cLv1lDddHXjExlS0H9', 'Generated "alrcP2cLv1lDddHXjExlS0H9".');

  });

  test('Local storage', function () {

    expect(4);
    ok(localStorage.getItem('Len') === '24', 'Password length value stored.');
    ok(localStorage.getItem('Salt') === 'ssshh', 'Secret password value stored.');
    ok(localStorage.getItem('Method') === 'sha512', 'Hash method setting stored.');
    ok(localStorage.getItem('DisableTLD') === 'true', 'Subdomain removal setting stored.');

  });

};

// Load tests.
testMobileVersion();
