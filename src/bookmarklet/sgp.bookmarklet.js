(function ($) {

  // Configuration
  var version = 20140621;
  var domain = 'https://chriszarate.github.io';
  var mobile = 'https://chriszarate.github.io/supergenpass/mobile/';
  var minFrameArea = 100000;
  var loadedSGP = false;

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

    var closeWindow = function() {
      $box.remove();
    };

    // Define CSS properties.
    var boxStyle = 'z-index:99999;position:absolute;top:0;right:5px;width:258px;margin:0;padding:0;box-sizing:content-box;';
    var titleBarStyle = 'overflow:hidden;width:258px;height:20px;margin:0;padding:0;text-align:right;background-color:#356;cursor:move;box-sizing:content-box;';
    var closeLinkStyle = 'padding:0 5px;color:#fff;font-size:18px;line-height:20px;cursor:pointer;';
    var frameStyle = 'position:static;width:258px;height:190px;border:none;overflow:hidden;pointer-events:auto;';

    // Create SGP elements.
    var $box = $('<div/>', {style: boxStyle});
    var $titleBar = $('<div/>', {style: titleBarStyle});
    var $closeLink = $('<span/>', {style: closeLinkStyle}).append('×');
    var $frame = $('<iframe/>', {src: mobile, scrolling: 'no', style: frameStyle});

    // Find largest viewport, looping through frames if applicable.
    $('frame').filter(isLocalFrame).each(findBiggestFrame);
    $('iframe', $target).filter(isLocalFrame).each(findBiggestFrame);

    // If no target document is found, redirect to mobile version.
    if(!$target) {
      window.location = mobile;
    }

    // Provide "close window" feature.
    $closeLink.on('click', closeWindow);
    $titleBar.on('dblclick', closeWindow);

    // Apply scroll offset.
    $box.css('top', $target.scrollTop() + 'px');

    // Blur any active form fields.
    $(document.activeElement).blur();

    // Append SGP window to target document.
    $titleBar.append($closeLink);
    $box.append($titleBar, $frame).appendTo($('body', $target));

    // Attach postMessage listener for responses from SGP generator.
    $(window).on('message', function (e) {
      var post = e.originalEvent;
      if(post.origin === domain && typeof post.data !== 'undefined') {
        $.each(JSON.parse(post.data), function (key, value) {
          switch(key) {
            // Populate generated password into password fields.
            case 'result':
              $('input:password:visible', $localFrames)
                .css('background', '#9f9')
                .val(value)
                .trigger('change click')
                .on('input', function () {
                  $(this).css('background', '#fff');
                })
                .focus();
              break;
            // Change iframe height to match SGP generator document height.
            case 'height':
              $frame.css('height', Math.max(parseInt(value, 10), 167) + 2);
              break;
          }
        });
      }
    });

    // Send current bookmarklet version to SGP generator. (Also communicates
    // current URL and opens channel for response.)
    $frame.on('load', function () {
      this.contentWindow.postMessage('{"version":' + version + '}', domain);
      loadedSGP = true;
    });

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

    return true;

  };

  /*
    Look for jQuery 1.7+ (for ".on") and load it if it can't be found.
    Adapted from Paul Irish's method:
    http://pastie.org/462639
  */

  var hasJQuery = $ && $.fn && parseFloat($.fn.jquery) >= 1.7 && loadSGP($);

  if(!hasJQuery) {

    var s = document.createElement('script');
    s.src = '//ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js';
    s.onload = s.onreadystatechange = function() {
      var state = this.readyState;
      if(!state || state === 'loaded' || state === 'complete') {
        loadSGP(jQuery.noConflict());
      }
    };

    document.getElementsByTagName('head')[0].appendChild(s);

  }

  // Set timeout to see if SGP has loaded; otherwise assume that loading was
  // blocked by an origin policy or other content security setting.
  setTimeout(function() {
    if(!loadedSGP) {
      window.location = mobile;
    }
  }, 2000);

})(window.jQuery);
