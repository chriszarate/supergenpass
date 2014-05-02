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
    'Generate',
    'Output'
  ];

// Load tests only after iframe has loaded.
$iframe.on('load', function () {

  // Populate selector cache.
  $.each(selectors, function (i, val) {
    $el[val] = $('#' + val, $iframe[0].contentWindow.document);
  });

  // Create click event.
  var clickEvent = document.createEvent('Event');
  clickEvent.initEvent('click', true, true);

  test('Password generation', function () {

    expect(5);

    // Set initial form values.
    $el.Passwd.val('test');
    $el.Secret.val('secret');
    $el.Domain.val('example.com');
    $el.Len.val('10');
    $el.MethodMD5.prop('checked', true);

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

  });


  test('Local storage', function () {

    expect(3);
    ok(localStorage.getItem('Len') === '24', 'Password length value stored.');
    ok(localStorage.getItem('Salt') === 'ssshh', 'Secret password value stored.');
    ok(localStorage.getItem('Method') === 'sha512', 'Hash method value stored.');

  });

});
