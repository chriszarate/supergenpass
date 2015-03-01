'use strict';

// Load requirements.
var $ = require('jquery');
var sgp = require('supergenpass-lib');
var md5 = require('crypto-js/md5');
var sha512 = require('crypto-js/sha512');
var zeroclipboard = require('zeroclipboard');
var flashversion = require('./lib/flashversion');
var identicon = require('./lib/identicon5');
var shortcut = require('./lib/shortcut');
var storage = require('./lib/localstorage-polyfill');

// Set default values.
var messageOrigin = false;
var messageSource = false;
var language = location.search.substring(1);
var latestBookmarklet = '../bookmarklet/bookmarklet.min.js';
var latestVersion = 20150216;

// ZeroClipboard configuration.
var zeroClipboardConfig = {
  bubbleEvents: false,
  hoverClass: 'Hover',
  activeClass: 'Active'
};

// Major search engine referral hostnames.
var searchEngines = [
  'www.google.com',
  'www.bing.com',
  'duckduckgo.com',
  'r.search.yahoo.com'
];

// Localizations.
var localizations = {
  'en':    ['Master password', 'Domain / URL', 'Generate'],
  'es':    ['Contraseña maestra', 'Dominio / URL', 'Enviar'],
  'fr':    ['Mot de passe principal', 'Domaine / URL', 'Soumettre'],
  'de':    ['Master Passwort', 'Domain / URL', 'Abschicken'],
  'pt-br': ['Senha-mestra', 'Domínio / URL', 'Gerar'],
  'zh-hk': ['主密碼', '域名 / URL', '提交'],
  'hu':    ['Mesterjelszó', 'Tartomány / Internetcím', 'OK'],
  'ru':    ['Мастер-пароль', 'Домена / URL', 'Подтвердить']
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
    'Generate',
    'Mask',
    'MaskText',
    'CopyButton',
    'Output',
    'Canvas',
    'Options',
    'Update',
    'Bookmarklet'
  ];

// Retrieve user's configuration from local storage, if available.
var config = {
  length: storage.local.getItem('Len') || 10,
  secret: storage.local.getItem('Salt') || '',
  method: storage.local.getItem('Method') || 'md5',
  removeSubdomains: storage.local.getItem('DisableTLD') || ''
};

// Save configuration to local storage.
var saveCurrentOptions = function () {
  var input = getCurrentFormInput();
  storage.local.setItem('Len', input.options.length);
  storage.local.setItem('Salt', input.options.secret);
  storage.local.setItem('Method', input.options.method);
  storage.local.setItem('DisableTLD', !input.options.removeSubdomains || '');
};

var showUpdateNotification = function (data) {
  $el.Bookmarklet.attr('href', data);
  $el.Update.show();
  sendDocumentHeight();
};

// Populate domain with referrer, if available and not from a search engine.
var populateReferrer = function (referrer) {
  if (referrer) {
    referrer = sgp.hostname(referrer, {removeSubdomains: false});
    if (searchEngines.indexOf(referrer) === -1) {
      $el.Domain.val(sgp.hostname(referrer, {removeSubdomains: !config.removeSubdomains}));
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
        if(value < latestVersion) {
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
    $el.Domain.val(sgp.hostname(messageOrigin, {removeSubdomains: !config.removeSubdomains})).trigger('change');
    sendDocumentHeight();

  }

};

// Send document height to bookmarklet.
var sendDocumentHeight = function () {
  postMessageToBookmarklet({
    height: $(document.body).height()
  });
};

// Send generated password to bookmarklet.
var sendGeneratedPassword = function (generatedPassword) {
  postMessageToBookmarklet({
    result: generatedPassword
  });
};

// Send message using HTML5 postMessage API. Only post a message if we are in
// communication with the bookmarklet.
var postMessageToBookmarklet = function (message) {
  if(messageSource && messageOrigin) {
    messageSource.postMessage(JSON.stringify(message), messageOrigin);
  }
};

// Get current SGP input.
var getCurrentFormInput = function () {
  var removeSubdomains = $el.RemoveSubdomains.is(':checked');
  return {
    password: $el.Passwd.val(),
    domain: getDomain(removeSubdomains),
    options: {
      secret: $el.Secret.val(),
      length: getPasswordLength(),
      method: getHashMethod(),
      removeSubdomains: !removeSubdomains
    }
  };
};

// Get valid domain value and update form.
var getDomain = function (removeSubdomains) {
  var domain = $el.Domain.val().replace(/ /g, '');
  if (domain) {
    domain = sgp.hostname(domain, {removeSubdomains: !removeSubdomains});
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

// Validate password length.
var validatePasswordLength = function (passwordLength) {
  passwordLength = parseInt(passwordLength, 10) || 10;
  return Math.max(4, Math.min(passwordLength, 24));
};

// Get valid hash method.
var getHashMethod = function () {
  return $('input:radio[name=Method]:checked').val() || 'md5';
};

// Generate hexadecimal hash for identicons.
var generateIdenticonHash = function (seed, hashMethod) {

  // Store reference to the hash function.
  var hashFunction = ( hashMethod == 'sha512' ) ? sha512 : md5;

  // Loop four times over the seed.
  for (var i = 0; i <= 4; i++) {
    seed = hashFunction(seed).toString();
  }

  return seed;

};

// Generate and show identicon if master password or secret is present.
var generateIdenticon = function () {

  // Get form input.
  var input = getCurrentFormInput();
  var options = input.options;

  if (input.password || options.secret) {

    // Compute identicon hash.
    var identiconHash = generateIdenticonHash(input.password + options.secret, options.method);

    // Generate identicon.
    identicon($el.Canvas[0], identiconHash, 16);

    // Show identicon.
    $el.Canvas.show();

  } else {

    // Hide identicon if there is no form input.
    $el.Canvas.hide();

  }

};

var generatePassword = function () {

  // Get form input.
  var input = getCurrentFormInput();
  var options = input.options;

  // Show user feedback for missing master password.
  if(!input.password) {
     $el.PasswdField.addClass('Missing');
  }

  // Show user feedback for missing domain.
  if(!input.domain) {
     $el.DomainField.addClass('Missing');
  }

  // Generate password.
  if(input.password && input.domain) {
    sgp(input.password, input.domain, options, populateGeneratedPassword);
    saveCurrentOptions();
  }

};

// Populate generated password into password field.
var populateGeneratedPassword = function (generatedPassword) {

  // Send generated password to bookmarklet.
  sendGeneratedPassword(generatedPassword);

  // Blur input fields.
  $el.Inputs.trigger('blur');

  // Show masked generated password.
  $el.Generate.hide();
  $el.Output.text(generatedPassword);
  $el.Mask.show();

  // Bind hotkey for revealing generated password.
  shortcut.add('Ctrl+H', toggleGeneratedPassword);

};

// Toggle generated password on click/touch.
var toggleGeneratedPassword = function () {
  $el.Mask.toggle();
  $el.Output.toggle();
};

// Clear generated password when input changes.
var clearGeneratedPassword = function (event) {

  // Store reference to key press.
  var key = event.which;

  // Test for input key codes.
  var group1 = ([8, 32].indexOf(key) !== -1);
  var group2 = (key > 45 && key < 91);
  var group3 = (key > 95 && key < 112);
  var group4 = (key > 185 && key < 223);
  var enterKey = (key == 13);

  // When user enters form input, reset form status.
  if ( event.type == 'change' || group1 || group2 || group3 || group4 ) {

    // Clear generated password.
    $el.Mask.hide();
    $el.Output.text('').hide();

    // Show generate button.
    $el.Generate.show();

    // Clear feedback for missing form input.
    $el.PasswdField.removeClass('Missing');
    $el.DomainField.removeClass('Missing');

    // Unbind hotkey for revealing generated password.
    shortcut.remove('Ctrl+H');

  }

  // Submit form on enter key.
  if (enterKey) {
    $el.Generate.trigger('click');
    event.preventDefault();
  }

};

// Adjust password length.
var adjustPasswordLength = function (event) {

  // Get length increment.
  var increment = ( $(this).attr('id') == 'Up' ) ? 1 : -1;

  // Calculate new password length.
  var passwordLength = validatePasswordLength($el.Len.val());
  var newPasswordLength = validatePasswordLength(passwordLength + increment);

  // Update form with new password length.
  $el.Len.val(newPasswordLength).trigger('change');

  // Prevent event default action.
  event.preventDefault();

};

// Toggle advanced options.
var toggleAdvancedOptions = function () {
  $('body').toggleClass('Advanced');
  sendDocumentHeight();
};

// Toggle indicator for removeSubdomains option.
var toggleSubdomainIndicator = function () {
  var input = getCurrentFormInput();
  $el.DomainField.toggleClass('Advanced', !input.options.removeSubdomains);
};

// Update copy button to show successful clipboard copy. Remove success
// indicator after a few seconds.
var updateCopyButton = function () {
  $el.CopyButton.addClass('Success');
  setTimeout(function () {
    $el.CopyButton.removeClass('Success');
  }, 5000);
};

// Populate selector cache.
$el.Inputs = $('input');
$.each(selectors, function (i, val) {
  $el[val] = $('#' + val);
});

// Load user's configuration (or defaults) into form.
$('input:radio[value=' + config.method + ']').prop('checked', true);
$el.Len.val(validatePasswordLength(config.length));
$el.Secret.val(config.secret).trigger('change');
$el.RemoveSubdomains.prop('checked', config.removeSubdomains).trigger('change');

// Perform localization, if requested.
if (language && localizations.hasOwnProperty(language)) {
  $el.Passwd.attr('placeholder', localizations[language][0]);
  $el.Domain.attr('placeholder', localizations[language][1]);
  $el.PasswdLabel.text(localizations[language][0]);
  $el.DomainLabel.text(localizations[language][1]);
  $el.Generate.text(localizations[language][2]);
}

// Provide fake input placeholders if browser does not support them.
if ( !('placeholder' in document.createElement('input')) ) {
  $('#Passwd, #Secret, #Domain').on('keyup change', function () {
    $('label[for=' + $(this).attr('id') + ']').toggle($(this).val() === '');
  }).trigger('change');
}

// Activate copy-to-clipboard button if browser has Flash.
if (flashversion >= 11) {
  zeroclipboard.config(zeroClipboardConfig);
  new zeroclipboard($el.CopyButton.show()).on('aftercopy', updateCopyButton);
}

// Bind to interaction events.
$el.Generate.on('click', generatePassword);
$el.MaskText.on('click', toggleGeneratedPassword);
$el.Options.on('click', toggleAdvancedOptions);
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
