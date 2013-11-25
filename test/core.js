module('SuperGenPass core functions');

test('Password validation', function() {

/*
  == Password policy validator ==
  Input must:
  - Always start with a lowercase letter [a-z]
  - Always contain at least one uppercase letter [A-Z]
  - Always contain at least one numeral [0-9]
*/

  var invalidPasswords = [
    'qwertyuiop',
    'QWERTYUIOP',
    'QwErTyUiOp',
    '1234567890',
    'qwerty7890',
    'QWERTY7890',
    'qwerty&*()',
    '!@#$%^7890',
    'QwErTy1234',
    '!123QwErTy'
  ];

  var validPasswords = [
    'qWeRtY1234',
    'qWeRtY1@3$',
    'qW1%%%%%%%',
    'q____Q___0'
  ];

  expect(invalidPasswords.length + validPasswords.length);

  invalidPasswords.forEach(function(password) {
    ok(!gp2_check_passwd(password), 'Reject  "' + password + '".');
  });

  validPasswords.forEach(function(password) {
    ok(gp2_check_passwd(password), 'Accept  "' + password + '".');
  });

});

test('Length validation', function() {

/*
  == Length validator ==
  Password length must be no less than 4 characters.
  Default is 10.
*/

  expect(9);

  ok(gp2_validate_length(-1) === 4, 'Reject -1.');
  ok(gp2_validate_length(0) === 10, 'Reject 0.');
  ok(gp2_validate_length(3) === 4, 'Reject 3.');

  ok(gp2_validate_length(23) === 22, 'Reject 23.');
  ok(gp2_validate_length(25, 'sha512') === 24, 'Reject 25 (SHA-512).');
  ok(gp2_validate_length(999999) === 22, 'Reject 999999.');

  ok(gp2_validate_length(10) === 10, 'Accept 10.');
  ok(gp2_validate_length(10.5) === 10, 'Accept 10.5.');
  ok(gp2_validate_length('10') === 10, 'Accept "10".');

});
