module('SuperGenPass mobile version');

// Enumerate jQuery selectors for caching.
var $iframe = $('#SGP');
var $el = {};
var selectors =
  [
    'Passwd',
    'Salt',
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

    expect(3);

    $el.Passwd.val('test');
    $el.Domain.val('example.com');
    $el.Len.val('10');
    $el.MethodMD5.prop('checked',true);
    $el.Generate[0].dispatchEvent(clickEvent);

    ok($el.Output.text() === 'w9UbG0NEk7', 'Generated "w9UbG0NEk7".');

    $el.MethodSHA512.prop('checked',true);
    $el.Generate[0].dispatchEvent(clickEvent);

    ok($el.Output.text() === 'sJfoZg3nU8', 'Generated "sJfoZg3nU8".');

    $el.Len.val('4');
    $el.Generate[0].dispatchEvent(clickEvent);

    ok($el.Output.text() === 'aC81', 'Generated "aC81".');

  });

});
