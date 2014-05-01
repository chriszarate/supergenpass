// Load requirements.
var $ = require('jquery');
var sgp = require('supergenpass-lib');
var md5 = require('crypto-js/md5');
var sha512 = require('crypto-js/sha512');
var identicon = require('./lib/identicon5');
var storage = require('./lib/localstorage-polyfill');

// Set default values.
var messageOrigin = false;
var messageSource = false;
var language = location.search.substring(1);
var latestVersion = 20140420;
var alterateDomain = '';

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
    'Salt',
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
    'Update'
  ];

// Retrieve user's configuration from local storage, if available.
var config = {
  passwordLength: storage.local.getItem('Len') || 10,
  masterSecret:   storage.local.getItem('Salt') || '',
  hashMethod:     storage.local.getItem('Method') || 'md5',
  disableTLD:     storage.local.getItem('DisableTLD') || ''
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
        $el.Update.show();
      }
      break;
    }

  });

  // Populate domain field and call back with the browser height.
  $el.Domain.val(sgp.isolateHostname(messageOrigin)).trigger('change');
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
var validatePasswordLength = function (passwordLength, hashMethod) {

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
var generateIdenticon = function (event) {

  // Get form input.
  var masterPassword = $el.Passwd.val();
  var masterSecret = $el.Salt.val();
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

var generatePassword = function (event) {

  // Get form input.
  var masterPassword = $el.Passwd.val();
  var masterSecret = $el.Salt.val();
  var hashMethod = getHashMethod();
  var domain = $el.Domain.val().replace(/ /g, '');
  var passwordLength = validatePasswordLength($el.Len.val(), hashMethod);
  var disableTLD = $el.DisableTLD.is(':checked');

  // Process domain value.
  domain = (domain) ? sgp.isolateHostname(domain, disableTLD) : '';
  alternateDomain = (domain) ? sgp.isolateHostname(domain, !disableTLD) : '';

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
      salt: masterSecret,
      length: passwordLength,
      method: hashMethod,
      disableTld: disableTLD
    };

    // Generate password.
    generatedPassword = sgp(masterPassword, domain, options);

    // Send generated password to bookmarklet.
    sendGeneratedPassword(generatedPassword);

    // Save form input to local storage.
    saveConfiguration(masterSecret, passwordLength, hashMethod, disableTLD);

    // Show generated password.
    $el.Generate.hide();
    $el.Output.val(generatedPassword);
    $el.Mask.show();

  }

};

// Show generated password on click/touch.
var showGeneratedPassword = function () {
  $el.Mask.hide();
  $el.Output.show().trigger('focus')[0].select();
};

// Hide generated password on click/touch elsewhere.
var hideGeneratedPassword = function () {
  $el.Output.hide();
  $el.Mask.show();
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
    $el.Output.val('').hide();

    // Show generate button.
    $el.Generate.show();

    // Clear feedback for missing form input.
    $el.PasswdField.removeClass('Missing');
    $el.DomainField.removeClass('Missing');

  }

  // Submit form on enter key.
  if (enterKey) {
    $(this).trigger('blur');
    $el.Generate.trigger('click');
    event.preventDefault();
  }

};

// Adjust password length.
var adjustPasswordLength = function (event) {

  // Get hash method.
  var hashMethod = getHashMethod();

  // Get length increment.
  var increment = ( $(this).attr('id') == 'Up' ) ? 1 : -1;

  // Calculate new password length.
  var passwordLength = validatePasswordLength($el.Len.val(), hashMethod);
  var newPasswordLength = validatePasswordLength(passwordLength + increment, hashMethod);

  // Update form with new password length.
  $el.Len.val(newPasswordLength).trigger('change');

  // Prevent event default action.
  event.preventDefault();

};

// Show advanced options.
var showAdvancedOptions = function () {
  $('body').toggleClass('Advanced');
  sendDocumentHeight();
};

// Show alternate domain when TLD option is toggled.
var showAlternateDomain = function (event) {

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
var toggleTLDIndicator = function (event) {
  $el.DomainField.toggleClass('Advanced', $(this).is(':checked'));
};

// Populate selector cache.
$.each(selectors, function (i, val) {
  $el[val] = $('#' + val);
});

// Load user's configuration (or defaults) into form.
$('input:radio[value=' + config.hashMethod + ']').prop('checked', true);
$el.Len.val(validatePasswordLength(config.passwordLength, config.hashMethod));
$el.Salt.val(config.masterSecret).trigger('change');
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
  $('#Passwd, #Salt, #Domain').on('keyup change', function (event) {
    $('label[for=' + $(this).attr('id') + ']').toggle($(this).val() === '');
  }).trigger('change');
}

// Bind to interaction events.
$el.Generate.on('click', generatePassword);
$el.Mask.on('click', showGeneratedPassword);
$el.Options.on('click', showAdvancedOptions);
$('#Up, #Down').on('click', adjustPasswordLength);

// Bind to form events.
$el.DisableTLD.on('change', showAlternateDomain);
$el.DisableTLD.on('change', toggleTLDIndicator);
$el.Output.on('blur', hideGeneratedPassword);
$('#Passwd, #Salt, #MethodField').on('keyup change', generateIdenticon);
$('fieldset > input').on('keydown change', clearGeneratedPassword);

// Set focus on password field.
$el.Passwd.trigger('focus');

// Attach postMessage listener for bookmarklet.
$(window).on('message', listenForBookmarklet);
