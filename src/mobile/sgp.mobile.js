'use strict';

/*jshint browser: true, latedef: false*/

var $ = require('jquery');
var sgp = require('supergenpass-lib');
var md5 = require('crypto-js/md5');
var sha512 = require('crypto-js/sha512');
var identicon = require('./lib/identicon5');
var shortcut = require('./lib/shortcut');
var storage = require('./lib/localstorage-polyfill');

// Set default values.
var messageOrigin = false;
var messageSource = false;
var language = location.search.substring(1);
var latestBookmarklet = '../bookmarklet/bookmarklet.min.js';
var latestVersion = 20150216;

// Hostnames that should not be populated into the domain field on referral.
var noReferral = [
  'chriszarate.github.io',
  'www.google.com',
  'www.bing.com',
  'duckduckgo.com',
  'r.search.yahoo.com'
];

var localizations = {
  'en':    ['Master password', 'Domain / URL', 'Generate'],
  'es':    ['Contraseña maestra', 'Dominio / URL', 'Enviar'],
  'fr':    ['Mot de passe principal', 'Domaine / URL', 'Soumettre'],
  'de':    ['Master Passwort', 'Domain / URL', 'Abschicken'],
  'pt-br': ['Senha-mestra', 'Domínio / URL', 'Gerar'],
  'zh-hk': ['主密碼', '域名 / URL', '提交'],
  'hu':    ['Mesterjelszó', 'Tartomány / Internetcím', 'OK'],
  'ru':    ['Мастер-пароль', 'Домена / URL', 'Подтвердить'],
  'nl':    ['Hoofd wachtwoord', 'Domein / URL', 'Genereer'],
  'fy':    ['Haad wachtwurd', 'Domein / URL', 'Ferwurkje']
};

// Enumerate jQuery selectors for caching.
var $el = {};
var selectors =
  [
    'PasswdField',
    'Passwd',
    'PasswdLabel',
    'Secret',
    'DomainField',
    'Domain',
    'DomainLabel',
    'RemoveSubdomains',
    'Len',
    'Result',
    'Generate',
    'MaskText',
    'CopyButton',
    'Output',
    'Canvas',
    'Options',
    'SaveDefaults',
    'Update',
    'Bookmarklet'
  ];

// Retrieve defaults from local storage.
var defaults = {
  length: storage.local.getItem('Len') || 10,
  secret: storage.local.getItem('Salt') || '',
  method: storage.local.getItem('Method') || 'md5',
  removeSubdomains: !storage.local.getItem('DisableTLD') || false,
  advanced: storage.local.getItem('Advanced') || false
};

// Save current options to local storage as defaults.
var saveCurrentOptionsAsDefaults = function (e) {
  var input = getCurrentFormInput();
  storage.local.setItem('Len', input.options.length);
  storage.local.setItem('Salt', input.options.secret);
  storage.local.setItem('Method', input.options.method);
  storage.local.setItem('DisableTLD', !input.options.removeSubdomains || '');
  showButtonSuccess(e);
};

var showUpdateNotification = function (data) {
  $el.Bookmarklet.attr('href', data);
  $el.Update.show();
  sendDocumentHeight();
};

// Populate domain with referrer, if available and not from the blacklist.
var populateReferrer = function (referrer) {
  if (referrer) {
    referrer = sgp.hostname(referrer, {removeSubdomains: false});
    if (noReferral.indexOf(referrer) === -1) {
      $el.Domain.val(sgp.hostname(referrer, {removeSubdomains: defaults.removeSubdomains}));
    }
  }
};

// Listen for postMessage from bookmarklet.
var listenForBookmarklet = function (event) {

  var post = event.originalEvent;

  if (post.origin !== window.location.origin) {

    // Save message source.
    messageSource = post.source;
    messageOrigin = post.origin;

    // Parse message.
    $.each(JSON.parse(post.data), function (key, value) {
      switch (key) {
      case 'version':
        if (value < latestVersion) {
          // Fetch latest bookmarklet.
          $.ajax({
            url: latestBookmarklet,
            success: showUpdateNotification,
            dataType: 'html'
          });
        }
        break;
      }
    });

    // Populate domain field and call back with the browser height.
    $el.Domain.val(sgp.hostname(messageOrigin, {removeSubdomains: defaults.removeSubdomains})).trigger('change');
    sendDocumentHeight();

  }

};

var sendDocumentHeight = function () {
  postMessageToBookmarklet({
    height: $el.Body.height()
  });
};

var sendGeneratedPassword = function (generatedPassword) {
  postMessageToBookmarklet({
    result: generatedPassword
  });
};

// Send message using HTML5 postMessage API. Only post a message if we are in
// communication with the bookmarklet.
var postMessageToBookmarklet = function (message) {
  if (messageSource && messageOrigin) {
    messageSource.postMessage(JSON.stringify(message), messageOrigin);
  }
};

var getCurrentFormInput = function () {
  var removeSubdomains = $el.RemoveSubdomains.is(':checked');
  return {
    password: $el.Passwd.val(),
    domain: getDomain(removeSubdomains),
    options: {
      secret: $el.Secret.val(),
      length: getPasswordLength(),
      method: getHashMethod(),
      removeSubdomains: removeSubdomains
    }
  };
};

// Get valid domain value and update form.
var getDomain = function (removeSubdomains) {
  var domain = $el.Domain.val().replace(/ /g, '');
  if (domain) {
    domain = sgp.hostname(domain, {removeSubdomains: removeSubdomains});
    $el.Domain.val(domain);
  }
  return domain;
};

// Get valid password length and update form.
var getPasswordLength = function () {
  var passwordLength = validatePasswordLength($el.Len.val());
  $el.Len.val(passwordLength);
  return passwordLength;
};

var validatePasswordLength = function (passwordLength) {
  passwordLength = parseInt(passwordLength, 10) || 10;
  return Math.max(4, Math.min(passwordLength, 24));
};

var getHashMethod = function () {
  return $('input:radio[name=Method]:checked').val() || 'md5';
};

// Generate hexadecimal hash for identicons.
var generateIdenticonHash = function (seed, hashMethod) {
  var hashFunction = (hashMethod === 'sha512') ? sha512 : md5;
  for (var i = 0; i <= 4; i = i + 1) {
    seed = hashFunction(seed).toString();
  }
  return seed;
};

var generateIdenticon = function () {

  var input = getCurrentFormInput();
  var options = input.options;

  if (input.password || options.secret) {
    var identiconHash = generateIdenticonHash(input.password + options.secret, options.method);
    identicon($el.Canvas[0], identiconHash, 16);
    $el.Canvas.show();
  } else {
    $el.Canvas.hide();
  }

};

var generatePassword = function () {

  var input = getCurrentFormInput();
  var options = input.options;

  if (!input.password) {
    $el.PasswdField.addClass('Missing');
  }

  if (!input.domain) {
    $el.DomainField.addClass('Missing');
  }

  if (input.password && input.domain) {
    sgp.generate(input.password, input.domain, options, populateGeneratedPassword);
  }

};

var populateGeneratedPassword = function (generatedPassword) {
  sendGeneratedPassword(generatedPassword);
  $el.Inputs.trigger('blur');
  $el.Output.text(generatedPassword);
  $el.Result.addClass('Offer').removeClass('Reveal');
  shortcut.add('Ctrl+H', toggleGeneratedPassword);
};

var toggleGeneratedPassword = function () {
  $el.Result.toggleClass('Reveal');
};

var clearGeneratedPassword = function (event) {

  var key = event.which;

  // Test for input key codes.
  var group1 = ([8, 32].indexOf(key) !== -1);
  var group2 = (key > 45 && key < 91);
  var group3 = (key > 95 && key < 112);
  var group4 = (key > 185 && key < 223);
  var enterKey = (key === 13);

  // When user enters form input, reset form status.
  if (event.type === 'change' || group1 || group2 || group3 || group4) {
    $el.Output.text('');
    $el.Result.removeClass('Offer');
    $el.PasswdField.removeClass('Missing');
    $el.DomainField.removeClass('Missing');
    shortcut.remove('Ctrl+H');
  }

  // Submit form on enter key.
  if (enterKey) {
    $el.Generate.trigger('click');
    event.preventDefault();
  }

};

var adjustPasswordLength = function (event) {
  var increment = ($(this).attr('id') === 'Up') ? 1 : -1;
  var passwordLength = validatePasswordLength($el.Len.val());
  var newPasswordLength = validatePasswordLength(passwordLength + increment);
  $el.Len.val(newPasswordLength).trigger('change');
  event.preventDefault();
};

var toggleAdvancedOptions = function () {
  var advanced = !$el.Body.hasClass('Advanced');
  $el.Body.toggleClass('Advanced', advanced);
  storage.local.setItem('Advanced', advanced || '');
  sendDocumentHeight();
};

var toggleSubdomainIndicator = function () {
  var input = getCurrentFormInput();
  $el.DomainField.toggleClass('Advanced', !input.options.removeSubdomains);
};

// Update button to show a success indicator. Remove indicator after 5 seconds.
var showButtonSuccess = function (e) {
  $(e.target).addClass('Success');
  setTimeout(function () {
    $(e.target).removeClass('Success');
  }, 5000);
};

// Populate selector cache.
$el.Inputs = $('input');
$el.Body = $(document.body);
$.each(selectors, function (i, val) {
  $el[val] = $('#' + val);
});

// Load defaults into form.
$('input:radio[value=' + defaults.method + ']').prop('checked', true);
$el.Len.val(validatePasswordLength(defaults.length));
$el.Secret.val(defaults.secret).trigger('change');
$el.RemoveSubdomains.prop('checked', defaults.removeSubdomains).trigger('change');
$el.Body.toggleClass('Advanced', defaults.advanced);

// Perform localization, if requested.
if (language && localizations.hasOwnProperty(language)) {
  $el.Passwd.attr('placeholder', localizations[language][0]);
  $el.Domain.attr('placeholder', localizations[language][1]);
  $el.PasswdLabel.text(localizations[language][0]);
  $el.DomainLabel.text(localizations[language][1]);
  $el.Generate.text(localizations[language][2]);
}

// Provide fake input placeholders if browser does not support them.
if (!('placeholder' in document.createElement('input'))) {
  $('#Passwd, #Secret, #Domain').on('keyup change', function () {
    $('label[for=' + $(this).attr('id') + ']').toggle($(this).val() === '');
  }).trigger('change');
}

// Copy to clipboard if possible.
// https://developers.google.com/web/updates/2015/04/cut-and-copy-commands?hl=en
$el.CopyButton.on('click', function (e) {
  var range = document.createRange();
  var selection = window.getSelection();
  var success = false;

  range.selectNodeContents($el.Output.get(0));
  selection.removeAllRanges();
  selection.addRange(range);

  try {
    success = document.execCommand('copy');
  } catch (err) {}

  selection.removeAllRanges();

  if (success) {
    showButtonSuccess(e);
    $el.Result.removeClass('Reveal');
    return;
  }

  $el.CopyButton.hide();
});

// Bind to interaction events.
$el.Generate.on('click', generatePassword);
$el.MaskText.on('click', toggleGeneratedPassword);
$el.Options.on('click', toggleAdvancedOptions);
$el.SaveDefaults.on('click', saveCurrentOptionsAsDefaults);
$('#Up, #Down').on('click', adjustPasswordLength);

// Bind to form events.
$el.RemoveSubdomains.on('change', toggleSubdomainIndicator);
$el.Inputs.on('keydown change', clearGeneratedPassword);
$('#Passwd, #Secret, #MethodField').on('keyup change', generateIdenticon);

// Bind to hotkeys.
shortcut.add('Ctrl+O', toggleAdvancedOptions);
shortcut.add('Ctrl+G', generatePassword);

// Populate domain with referrer, if available.
populateReferrer(document.referrer);

// Set focus on password field.
$el.Passwd.trigger('focus').trigger('change');

// Attach postMessage listener for bookmarklet.
$(window).on('message', listenForBookmarklet);
