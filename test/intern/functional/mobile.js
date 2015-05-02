'use strict';

/*global define*/

define([
  'intern!object',
  'intern/chai!assert',
  'require'
], function (registerSuite, assert, require) {

  var url = '../../../mobile/index.html';

  registerSuite({

    name: 'SuperGenPass mobile version',

    'load the mobile version': function () {
      return this.remote
        .get(require.toUrl(url))
        .findById('Generate').isDisplayed()
        .then(function (isDisplayed) {
          assert.ok(isDisplayed, 'Mobile version should display a generate button.');
        });
    },

    'click advanced options': function () {
      return this.remote
        .findById('Options').click().end()
        .findById('Secret').isDisplayed()
        .then(function (isDisplayed) {
          assert.ok(isDisplayed, 'Advanced options should be visible.');
        });
    },

    'enter master password': function () {
      var input = 'test';
      return this.remote
        .findById('Passwd').clearValue().click().pressKeys(input)
        .getProperty('value')
        .then(function (value) {
          assert.ok(value === input, 'User should be able to type a master password.');
        });
    },

    'enter secret password': function () {
      var input = 'secret';
      return this.remote
        .findById('Secret').clearValue().click().pressKeys(input)
        .getProperty('value')
        .then(function (value) {
          assert.ok(value === input, 'User should be able to type a secret password.');
        });
    },

    'enter domain': function () {
      var input = 'login.example.com';
      return this.remote
        .findById('Domain').clearValue().click().pressKeys(input)
        .getProperty('value')
        .then(function (value) {
          assert.ok(value === input, 'User should be able to type a domain.');
        });
    },

    'enter length': function () {
      var input = '12';
      return this.remote
        .findById('Len').clearValue().click().pressKeys(input)
        .getProperty('value')
        .then(function (value) {
          assert.ok(value === input, 'User should be able to type a length.');
        });
    },

    'set the hash method': function () {
      return this.remote
        .findByCssSelector('label[for="MethodSHA512"]').click().end()
        .findById('MethodSHA512').getProperty('checked')
        .then(function (isChecked) {
          assert.ok(isChecked, 'User should be able to set the hash method.');
        });
    },

    'submit the form': function () {
      return this.remote
        .findById('Generate').click().end()
        .findById('MaskText').setFindTimeout(100).getVisibleText()
        .then(function (value) {
          assert.ok(value === '**************', 'User should be able to generate a password.');
        });
    },

    'show the password': function () {
      return this.remote
        .findById('MaskText').click().end()
        .findById('Output').getVisibleText()
        .then(function (value) {
          assert.ok(value === 'cLZ1vg6U98L3', 'User should be able to retrieve the generated password.');
        });
    },

    'remove the secret password': function () {
      return this.remote
        .findById('Secret').clearValue().end()
        .findById('Generate').isDisplayed()
        .then(function (isDisplayed) {
          assert.ok(isDisplayed, 'Changing a value should reset the form.');
        });
    },

    'resubmit the form': function () {
      return this.remote
        .findById('Generate').click().end()
        .findById('MaskText').setFindTimeout(100).click().end()
        .findById('Output').getVisibleText()
        .then(function (value) {
          assert.ok(value === 'sJfoZg3nU8y3', 'Removing the secret password should change the generated password.');
        });
    },

    'change the hash method': function () {
      return this.remote
        .findByCssSelector('label[for="MethodMD5"]').click().end()
        .findById('Generate').click().end()
        .findById('MaskText').setFindTimeout(100).click().end()
        .findById('Output').getVisibleText()
        .then(function (value) {
          assert.ok(value === 'vBKDNdjhhL6d', 'Changing the hash method should change the generated password.');
        });
    },

    'change the length': function () {
      return this.remote
        .findById('Down').click().click().end()
        .findById('Generate').click().end()
        .findById('MaskText').setFindTimeout(100).click().end()
        .findById('Output').getVisibleText()
        .then(function (value) {
          assert.ok(value === 'w9UbG0NEk7', 'Changing the password length with the mouse should change the generated password.');
        });
    },

    'change the length again': function () {
      return this.remote
        .findById('Len').clearValue().click().pressKeys('24').end()
        .findById('Generate').click().end()
        .findById('MaskText').setFindTimeout(100).click().end()
        .findById('Output').getVisibleText()
        .then(function (value) {
          assert.ok(value === 'vBKDNdjhhL6dBfgDSRxZxAAA', 'Changing the password length again should change the generated password.');
        });
    },

    'change the subdomain option': function () {
      return this.remote
        .findByCssSelector('label[for="RemoveSubdomains"]').click().end()
        .findById('Domain').clearValue().click().pressKeys('login.example.com').end()
        .findById('Generate').click().end()
        .findById('MaskText').setFindTimeout(100).click().end()
        .findById('Output').getVisibleText()
        .then(function (value) {
          assert.ok(value === 'iNerPM9Zu79a8gUIcLzC1QAA', 'Changing the subdomain option should change the generated password.');
        });
    },

    'click advanced options again': function () {
      return this.remote
        .findById('Options').click().end()
        .findById('Secret').isDisplayed()
        .then(function (isDisplayed) {
          assert.ok(!isDisplayed, 'Advanced options should be hidden.');
        });
    }

  });

});
