module('SuperGenPass core functions');

test('Password generation', function() {

/*
  == Password generator ==
  Loops ten times using Base-64 hash, then
  continually until password policy is satisfied.
*/

  expect(3);

  ok(gp2_generate_passwd('test:example.com', 10) === 'w9UbG0NEk7', 'Generated "w9UbG0NEk7".');
  ok(gp2_generate_passwd('test:example.com', 10, 'sha512') === 'sJfoZg3nU8', 'Generated "sJfoZg3nU8".');
  ok(gp2_generate_passwd('test:example.com', 4, 'sha512') === 'aC81', 'Generated "aC81".');

});

test('Password validation', function() {

/*
  == Password policy validator ==
  Input must:
  - Always start with a lowercase letter [a-z]
  - Always contain at least one uppercase letter [A-Z]
  - Always contain at least one numeral [0-9]
*/

  var passwords = {
    'qwertyuiop': false,
    'QWERTYUIOP': false,
    'QwErTyUiOp': false,
    '1234567890': false,
    'qwerty7890': false,
    'QWERTY7890': false,
    'qwerty&*()': false,
    '!@#$%^7890': false,
    'QwErTy1234': false,
    '!123QwErTy': false,
    'qWeRtY1234': true,
    'qWeRtY1@3$': true,
    'qW1%%%%%%%': true,
    'q____Q___0': true
  };

  expect(Object.keys(passwords).length);

  Object.keys(passwords).forEach(function(key) {
    var bool = passwords[key],
        keyword = (bool) ? 'Accept' : 'Reject';
    ok(gp2_check_passwd(key) === bool, keyword + ' "' + key + '".');
  });

});

test('Hash generation', function() {

/*
  == Hash generator ==
  Loops four times using hexidecimal hash.
*/

  expect(2);

  ok(gp2_generate_hash('test') === '739c5b1cd5681e668f689aa66bcc254c', 'MD5 hash.');
  ok(gp2_generate_hash('test', 'sha512') === '5ec5029c812bc9f95aaf1c232b976627c583b4e604e80652990078a7fbf840c250179dd7700d1d6608c321f3998891076ad788729de65770080d939452c7d41c', 'SHA-512 hash.');

});

test('Length validation', function() {

/*
  == Length validator ==
  Password length must be no less than 4 characters.
  Default is 10.
*/

  expect(9);

  ok(gp2_validate_length(-1) === 4, 'Reject -1 as too low.');
  ok(gp2_validate_length(3) === 4, 'Reject 3 as too low.');

  ok(gp2_validate_length(23) === 22, 'Reject 23 as too high (MD5).');
  ok(gp2_validate_length(25, 'sha512') === 24, 'Reject 25 as too high (SHA-512).');
  ok(gp2_validate_length(99999999) === 22, 'Reject 99999999 as too high.');

  ok(gp2_validate_length(0) === 10, 'Reject 0 and enforce default.');

  ok(gp2_validate_length(10) === 10, 'Accept 10.');
  ok(gp2_validate_length(10.5) === 10, 'Accept 10.5.');
  ok(gp2_validate_length('10') === 10, 'Accept "10".');

});

test('Domain name isolator', function() {

/*
  == Domain name isolator ==
  Isolates the domain name or IP address using regular
  expressions. Respects a number of (hard-coded)
  secondary ccTLDs (e.g., "co.uk").
*/

  var domains = {
    'http://www.google.com/search': [
      'google.com',     // Default behavior
      'www.google.com'  // With subdomain removal disabled
    ],
    'https://mail.google.com/mail/u/0/': [
      'google.com',
      'mail.google.com'
    ],
    'ftp://pandis.ucs.cam.ac.uk/media/': [
      'cam.ac.uk',
      'pandis.ucs.cam.ac.uk'
    ],
    'imap://mail.outlook.com:443': [
      'outlook.com',
      'mail.outlook.com'
    ],
    'sapporo.hokkaido.jp': [
      'sapporo.hokkaido.jp',
      'sapporo.hokkaido.jp'
    ],
    'api.example.com:80': [
      'example.com',
      'api.example.com'
    ],
    '192.168.0.1': [
      '192.168.0.1',
      '192.168.0.1'
    ],
    'http://8.8.8.8/': [
      '8.8.8.8',
      '8.8.8.8'
    ],
    'https://localhost:8000': [
      'localhost',
      'localhost'
    ]
  };

  expect(Object.keys(domains).length * 2);

  Object.keys(domains).forEach(function(key) {
    ok(gp2_process_uri(key) === domains[key][0], 'Isolated "' + key + '".');
    ok(gp2_process_uri(key, true) === domains[key][1], 'Isolated "' + key + '" with subdomain removal disabled.');
  });

});

test('Password generation', function() {

/*
  == Password generator helper ==
  Gather and validate input for password generator.
function gp2_genpass(Passwd,Domain,Len,Salt,DisableTLD,Method) {
*/

  expect(2);

  ok(gp2_genpass('test', 'https://www.google.com/', 12, 'test', false) === 'zPQSNhTzs9fS', 'Generated "zPQSNhTzs9fS".');
  ok(gp2_genpass('test', 'https://www.google.com/', 10, false, true, 'sha512') === 'q8ZWYccWDt', 'Generated "q8ZWYccWDt".');

});
