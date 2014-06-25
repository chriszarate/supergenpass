'use strict';

// Load requirements.
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
var latestVersion = 20140624;
var alternateDomain = '';

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
    'DisableTLD',
    'Len',
    'Generate',
    'Mask',
    'Output',
    'Canvas',
    'Options',
    'Update',
    'Bookmarklet'
  ];

// Retrieve user's configuration from local storage, if available.
var config = {
  passwordLength: storage.local.getItem('Len') || 10,
  masterSecret:   storage.local.getItem('Salt') || '',
  hashMethod:     storage.local.getItem('Method') || 'md5',
  disableTLD:     storage.local.getItem('DisableTLD') || ''
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
      $el.Domain.val(sgp.hostname(referrer, {removeSubdomains: !config.disableTLD}));
    }
  }
};

// Listen for postMessage from bookmarklet.
var listenForBookmarklet = function (event) {

  // Gather information.
  var post = event.originalEvent;
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
  $el.Domain.val(sgp.hostname(messageOrigin, {removeSubdomains: !config.disableTLD})).trigger('change');
  sendDocumentHeight();

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

// Save configuration to local storage.
var saveConfiguration = function (masterSecret, passwordLength, hashMethod, disableTLD) {
  storage.local.setItem('Salt', masterSecret);
  storage.local.setItem('Len', passwordLength);
  storage.local.setItem('Method', hashMethod);
  storage.local.setItem('DisableTLD', disableTLD || '');
};

// Get selected hash method.
var getHashMethod = function () {
  return $('input:radio[name=Method]:checked').val() || 'md5';
};

// Validate password length.
var validatePasswordLength = function (passwordLength) {

  // Password length must be an integer.
  passwordLength = parseInt(passwordLength, 10) || 10;

  // Return a password length in the valid range.
	return Math.max(4, Math.min(passwordLength, 24));

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
  var masterPassword = $el.Passwd.val();
  var masterSecret = $el.Secret.val();
  var hashMethod = getHashMethod();

  if(masterPassword || masterSecret) {

    // Compute identicon hash.
    var identiconHash = generateIdenticonHash(masterPassword + masterSecret, hashMethod);

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
  var masterPassword = $el.Passwd.val();
  var masterSecret = $el.Secret.val();
  var hashMethod = getHashMethod();
  var domain = $el.Domain.val().replace(/ /g, '');
  var passwordLength = validatePasswordLength($el.Len.val());
  var disableTLD = $el.DisableTLD.is(':checked');

  // Process domain value.
  domain = (domain) ? sgp.hostname(domain, {removeSubdomains: !disableTLD}) : '';
  alternateDomain = (domain) ? sgp.hostname(domain, {removeSubdomains: disableTLD}) : '';

  // Update form with validated input.
  $el.Domain.val(domain).trigger('change');
  $el.Len.val(passwordLength).trigger('change');

  // Show user feedback for missing master password.
  if(!masterPassword) {
     $el.PasswdField.addClass('Missing');
  }

  // Show user feedback for missing domain.
  if(!domain) {
     $el.DomainField.addClass('Missing');
  }

  // Generate password.
  if(masterPassword && domain) {

    // Compile SGP options hash.
    var options = {
      secret: masterSecret,
      length: passwordLength,
      method: hashMethod,
      removeSubdomains: !disableTLD
    };

    // Generate password.
    var generatedPassword = sgp(masterPassword, domain, options);

    // Send generated password to bookmarklet.
    sendGeneratedPassword(generatedPassword);

    // Save form input to local storage.
    saveConfiguration(masterSecret, passwordLength, hashMethod, disableTLD);

    // Blur input fields.
    $el.Inputs.trigger('blur');

    // Show masked generated password.
    $el.Generate.hide();
    $el.Output.text(generatedPassword);
    $el.Mask.show();

    // Bind hotkey for revealing generated password.
    shortcut.add('Ctrl+H', toggleGeneratedPassword);

  }

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

// Toggle alternate domain when TLD option is toggled.
var toggleAlternateDomain = function () {

  // Store current domain value.
  var currentDomain = $el.Domain.val();

  // If we have stored an alternate value for the domain, load it.
  if (alternateDomain) {
    $el.Domain.val(alternateDomain);
  }

  // Store the current value as an alternate value in case the user toggles back.
  alternateDomain = currentDomain;

};

// Toggle indicator for TLD option.
var toggleTLDIndicator = function () {
  $el.DomainField.toggleClass('Advanced', $(this).is(':checked'));
};

// Populate selector cache.
$el.Inputs = $('input');
$.each(selectors, function (i, val) {
  $el[val] = $('#' + val);
});

// Load user's configuration (or defaults) into form.
$('input:radio[value=' + config.hashMethod + ']').prop('checked', true);
$el.Len.val(validatePasswordLength(config.passwordLength));
$el.Secret.val(config.masterSecret).trigger('change');
$el.DisableTLD.prop('checked', config.disableTLD).trigger('change');

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

// Bind to interaction events.
$el.Generate.on('click', generatePassword);
$el.Mask.on('click', toggleGeneratedPassword);
$el.Options.on('click', toggleAdvancedOptions);
$('#Up, #Down').on('click', adjustPasswordLength);

// Bind to form events.
$el.DisableTLD.on('change', toggleAlternateDomain);
$el.DisableTLD.on('change', toggleTLDIndicator);
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
