(function(){

/*
	Look for jQuery 1.4+ and load it if it can't be found.
	Adapted from Paul Irish's method: http://pastie.org/462639
*/

	var jQueryURL='http://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js';
	var jQueryMin=1.4;

	if(typeof jQuery==='undefined'||parseFloat(jQuery.fn.jquery)<jQueryMin) {
		var s=document.createElement('script');
		    s.src=jQueryURL;
		    s.onload=s.onreadystatechange=function() {
				if(!this.readyState||this.readyState=='loaded'||this.readyState=='complete') {
					s.onload=s.onreadystatechange=null;
					$.noConflict();
					LoadSGP();
				}
			};
		document.getElementsByTagName('head')[0].appendChild(s);
	} else {
		LoadSGP();
	}

//	SGP callback wrapper:

	function LoadSGP() {

	//	Generate a random ID for the SGP container <div>.

		var RandID='';
		for(var i=0;i<10;i++) {
			RandID+='abcdefghijklmnopqrstuvwxyz'.charAt(Math.floor(Math.random()*26));
		}

	//	Look for declared localization (default is English).
		try { Lang } catch(e) { Lang=''; }

	//	Default values:
		var FrameURL='http://mobile.supergenpass.com/index.html'+Lang;
		var Domain='http://mobile.supergenpass.com';
		var Dragging=null;
		var MaxArea=0;

	//	Find target document, looping through frames if applicable.

		var $Target=(document)?jQuery(document):false;

		jQuery(window.frames).each(function() {
			var Area=(jQuery(this).document)?jQuery(this).innerHeight()*jQuery(this).innerWidth():0;
			if(Area>MaxArea) {
				MaxArea=Area;
				$Target=jQuery(this).document;
			}
		});

	//	If no target document was found, redirect to mobile version.

		if(!$Target) {
			window.location=FrameURL;
		}

	//	Define styles:

		var Styles='\
			#'+RandID+' {\
				z-index:99999;\
				position:absolute;\
				top:'+$Target.scrollTop()+'px;\
				right:0;\
				width:235px;\
				margin:0;\
				padding:0;\
				background:#fff;\
				opacity:0.95;\
			}\
			#'+RandID+' div {\
				width:auto;\
				height:15px;\
				overflow:hidden;\
				margin:0;\
				padding:5px;\
				padding-top:3px;\
				background:#333;\
				color:#fff;\
				font-weight:bold;\
				text-align:right;\
				cursor:move;\
			}\
			#'+RandID+' a {\
				color:#ccc;\
				font-family:sans-serif;\
				font-size:15px;\
				font-weight:normal;\
				text-decoration:none;\
				border-width:0;\
				cursor:pointer;\
			}\
			#'+RandID+' iframe {\
				width:235px;\
				height:205px;\
				border:none;\
				pointer-events:auto;\
			}\
		';

	//	Append styles to target document.
		jQuery("<style/>",{type:'text/css'}).html(Styles).appendTo(jQuery('head',$Target));

	//	Create SGP elements.
		var $Box=jQuery("<div/>",{id:RandID});
		var $TitleBar=jQuery("<div/>");
		var $CloseLink=jQuery("<a/>",{href:'#',text:'x'});
		var $Frame=jQuery("<iframe/>",{src:FrameURL});

	//	Enable "close window" link.

		$CloseLink.bind('click',function(e) {
			$Box.remove();
			e.preventDefault();
		});

	//	Append SGP window to target document.
		$Box.append($TitleBar.append($CloseLink),$Frame).appendTo(jQuery('body',$Target));

	//	Attach postMessage listener to populate password fields

		jQuery(window).bind('message',function(e) {
			if(e.originalEvent.origin===Domain) {
				var Passwd=e.originalEvent.data.split(':',2);
				jQuery('input:password:visible',$Target).each(function(){
					jQuery(this).css('background','#9f9');
					jQuery(this).val(Passwd);
				}).bind('keydown change', function(e) {
					var key=e.keyCode;
					if(key==8||key==32||(key>45&&key<91)||(key>95&&key<112)||(key>185&&key<223)) {
						jQuery(this).unbind('keydown change');
						jQuery(this).css('background','#fff');
					}
				});
			}
		});

	//	Post message to SGP generator.

		$Frame.bind('load',function(e) {
			this.contentWindow.postMessage(true,Domain);
		});

	/*
		Start drag listener.
		Adapted from jQuery console bookmarklet: http://github.com/jaz303/jquery-console
	*/

		$TitleBar.bind({
			mousedown:function(e) {
				var Offset=$Box.offset();
				Dragging=[e.pageX-Offset.left,e.pageY-Offset.top];
				$Frame.css('pointer-events','none');
				e.preventDefault();
			},
			mouseup:function() {
				Dragging=null;
				$Frame.css('pointer-events','auto');
			}
		});

		$Target.bind('mousemove',function(e) {
			if(Dragging) {
				$Box.css({left:e.pageX-Dragging[0],top:e.pageY-Dragging[1]});
			}
		});

	}

})();
