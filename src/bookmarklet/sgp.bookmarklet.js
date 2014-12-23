void function ($) {

  // Configuration
  var version = 20141223;
  var domain = 'https://chriszarate.github.io';
  var mobile = 'https://chriszarate.github.io/supergenpass/mobile/';
  var minFrameArea = 100000;
  var loadTimeout = 2; // seconds

  // Messages
  var securityMessage = 'SGP may be blocked on this site by a security setting.';
  var offerQuestion = 'Would you like to open the mobile version?';
  var offerLink = 'You may wish to <a href="' + mobile + '" target="_blank">open the mobile version</a>.';

  var offerMobileVersion = function () {
    var redirect = confirm(securityMessage + ' ' + offerQuestion);
    if (redirect) {
      window.open(mobile);
    }
  };

  // Main
  var loadSGP = function($) {

    // Defaults
    var $target = $(document);
    var $localFrames = $target;
    var dragging = false;
    var maxArea = 0;

    // Functions

    /*
      Determine if frame is local (not cross-origin).
      Adapted from answer by Esailija:
      http://stackoverflow.com/questions/11872917/
    */

    var isLocalFrame = function() {
      // Expects frame element as context.
      // Try/catch helps avoid XSS freakouts.
      try {
        var key = '_' + new Date().getTime(),
            win = this.contentWindow;
        win[key] = key;
        if(win[key] === key) {
          $localFrames.add(win.document);
          return true;
        }
      }
      catch(e) {
        return false;
      }
    };

    var findBiggestFrame = function() {
      // Expects frame element as context.
      // Try/catch helps avoid XSS freakouts.
      try {
        var area = $(this).height() * $(this).width();
        if(area > maxArea && area > minFrameArea) {
          $target = $(this.contentWindow.document);
          maxArea = area;
        }
      }
      catch(e) {}
    };

    var removeLoadingIndicator = function () {
      $loadingIndicator.remove();
    };

    var linkMobileVersion = function () {
      $loadingIndicator.html(securityMessage + ' ' + offerLink);
    };

    var postMessage = function () {
      // Send current bookmarklet version to SGP generator. (Also communicates
      // current URL and opens channel for response.)
      try {
        this.contentWindow.postMessage('{"version":' + version + '}', domain);
      } catch(e) {
        linkMobileVersion();
      }
    };

    var receiveMessage = function (e) {
      var post = e.originalEvent;
      if(post.origin === domain && typeof post.data !== 'undefined') {
        removeLoadingIndicator();
        clearTimeout(loadTimeoutID);
        processMessage(JSON.parse(post.data));
      }
    };

    var processMessage = function (data) {
      $.each(data, function (key, value) {
        switch(key) {
          case 'result':
            populatePassword(value);
            break;
          case 'height':
            changeFrameHeight(Math.max(parseInt(value, 10), 167) + 2);
            break;
        }
      });
    };

    var populatePassword = function (password) {
      // Populate generated password into password fields.
      $('input:password:visible', $localFrames)
        .css('background', '#9f9')
        .val(password)
        .trigger('change click')
        .on('input', resetPasswordField)
        .focus();
    };

    var changeFrameHeight = function (height) {
      // Change iframe height to match SGP generator document height.
      $frame.css('height', height);
    };

    var resetPasswordField = function () {
      $(this).css('background', '#fff');
    };

    var closeWindow = function () {
      $box.remove();
    };

    // Define CSS properties.
    var boxStyle = 'z-index:99999;position:absolute;top:0;right:5px;width:258px;margin:0;padding:0;box-sizing:content-box;';
    var titleBarStyle = 'overflow:hidden;width:258px;height:20px;margin:0;padding:0;text-align:right;background-color:#356;cursor:move;box-sizing:content-box;';
    var closeLinkStyle = 'padding:0 5px;color:#fff;font-size:18px;line-height:20px;cursor:pointer;';
    var loadingIndicatorStyle = 'position:absolute;width:258px;height:190px;padding:15px;color:#333;background-color:#fff;font-family:monospace;font-size:15px;text-align:center;';
    var frameStyle = 'position:static;width:258px;height:190px;border:none;overflow:hidden;pointer-events:auto;';

    // Create SGP elements.
    var $box = $('<div/>', {style: boxStyle});
    var $titleBar = $('<div/>', {style: titleBarStyle});
    var $closeLink = $('<span/>', {style: closeLinkStyle}).append('×');
    var $loadingIndicator = $('<div/>', {style: loadingIndicatorStyle}).append('Loading SGP ...');
    var $frame = $('<iframe/>', {src: mobile, scrolling: 'no', style: frameStyle});

    // Find largest viewport, looping through frames if applicable.
    $('frame').filter(isLocalFrame).each(findBiggestFrame);
    $('iframe', $target).filter(isLocalFrame).each(findBiggestFrame);

    // If no target document is found, offer mobile version.
    if(!$target) {
      offerMobileVersion();
    }

    // If SGP doesn't load after a timeout, offer mobile version.
    var loadTimeoutID = setTimeout(linkMobileVersion, loadTimeout * 1000);

    // Provide "close window" feature.
    $closeLink.on('click', closeWindow);
    $titleBar.on('dblclick', closeWindow);

    // Apply scroll offset.
    $box.css('top', $target.scrollTop() + 'px');

    // Blur any active form fields.
    $(document.activeElement).blur();

    // Attach postMessage listener and responder.
    $frame.on('load', postMessage);
    $(window).on('message', receiveMessage);

    // Append SGP window to target document.
    $titleBar.append($closeLink);
    $box.append($titleBar, $loadingIndicator, $frame).appendTo($('body', $target));

    /*
      Start drag listener.
      Adapted from jQuery console bookmarklet:
      http://github.com/jaz303/jquery-console
    */

    $titleBar.on({
      mousedown: function (e) {
        var offset = $box.offset();
        dragging = [e.pageX - offset.left, e.pageY - offset.top];
        $frame.css('pointer-events', 'none');
        e.preventDefault();
      },
      mouseup: function () {
        dragging = false;
        $frame.css('pointer-events', 'auto');
      }
    });

    $target.on('mousemove', function (e) {
      if(dragging) {
        $box.css({
          left: e.pageX - dragging[0],
          top: e.pageY - dragging[1]
        });
      }
    });

  };

  /*
    Look for jQuery 1.7+ (for ".on") and load it if it can't be found.
    Adapted from Paul Irish's method:
    http://pastie.org/462639
  */

  if($ && $.fn && parseFloat($.fn.jquery) >= 1.7) {

    loadSGP($);

  } else {

    var s = document.createElement('script');
    s.src = '//ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js';
    s.onload = s.onreadystatechange = function() {
      var state = this.readyState;
      if(!state || state === 'loaded' || state === 'complete') {
        loadSGP(jQuery.noConflict());
      }
    };
    s.addEventListener('error', offerMobileVersion);
    s.addEventListener('abort', offerMobileVersion);

    document.getElementsByTagName('head')[0].appendChild(s);

  }

}(window.jQuery);
