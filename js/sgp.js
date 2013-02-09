(function(){

/*
	Look for jQuery 1.4+ and load it if it can't be found.
	Adapted from Paul Irish's method: http://pastie.org/462639
*/

	var jQueryURL='https://supergenpass.s3.amazonaws.com/js/jquery.min.js';
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

	//	Look for declared localization.
		var Query=(typeof Lang==='undefined')?'':'?'+Lang;

	//	SGP location:
		var FrameURL='https://supergenpass.s3.amazonaws.com/index.html'+Query;
		var Domain='https://supergenpass.s3.amazonaws.com';

	//	Find largest viewport, looping through frames if applicable.

		var $Target=(document)?jQuery(document):false;
		var MaxArea=0;

		jQuery('frame').each(function() {
			try {
				var Area=jQuery(this).height()*jQuery(this).width();
				if(Area>MaxArea) {
					$Target=jQuery(this.contentWindow.document);
					MaxArea=Area;
				}
			}
			catch(e) {
				console.log('SGP: Skipping external frame.');
			}
		});

	//	If no target document is found, redirect to mobile version.

		if(!$Target) {
			window.location=FrameURL;
		}

	//	Define styles:

		var Styles=
			'#'+RandID+' {'+
				'z-index:99999;'+
				'position:absolute;'+
				'top:'+$Target.scrollTop()+'px;'+
				'right:0;'+
				'width:240px;'+
				'margin:0;'+
				'padding:5px;'+
				'background-color:#fff;'+
				'border:solid 1px #ddd;'+
				'box-sizing:content-box;'+
			'}'+
			'#'+RandID+' div {'+
				'overflow:hidden;'+
				'width:225px;'+
				'margin:0;'+
				'padding:5px;'+
				'color:#fff;'+
				'background-color:#3a4663 !important;'+
				'font-size: 1em;'+
				'text-align:right;'+
				'text-shadow:1px 1px #0a1633;'+
				'line-height:10px;'+
				'cursor:move;'+
				'box-shadow:1px 0px 1px #1a2643,0px 1px 1px #2a3653,2px 1px 1px #1a2643,1px 2px 1px #2a3653,3px 2px 1px #1a2643,2px 3px 1px #2a3653,4px 3px 1px #1a2643,3px 4px 1px #2a3653,5px 4px 1px #1a2643,4px 5px 1px #2a3653,6px 5px 1px #1a2643;'+
				'box-sizing:content-box;'+
			'}'+
			'#'+RandID+' a {'+
				'color:#fff !important;'+
				'background:transparent !important;'+
				'font-family:sans-serif !important;'+
				'font-size:13px !important;'+
				'font-weight:bold !important;'+
				'text-decoration:none;'+
				'border-width:0;'+
				'cursor:pointer;'+
			'}'+
			'#'+RandID+' iframe {'+
				'position:static;'+
				'width:240px;'+
				'height:275px;'+
				'border:none;'+
				'overflow:hidden;'+
				'pointer-events:auto;'+
			'}';

	//	Append styles to target document.
		jQuery("<style type='text/css'>" + Styles + "</style>").appendTo(jQuery('head',$Target));

	//	Create SGP elements.
		var $Box=jQuery("<div/>",{id:RandID});
		var $TitleBar=jQuery("<div/>");
		var $CloseLink=jQuery("<a/>",{href:'#',text:'x'});
		var $Frame=jQuery("<iframe/>",{src:FrameURL,scrolling:'no'});
		var Dragging=null;

	//	Enable "close window" link.

		$CloseLink.bind('click',function(e) {
			$Box.remove();
			e.preventDefault();
		});

	//	Append SGP window to target document.
		$Box.append($TitleBar.append($CloseLink),$Frame).appendTo(jQuery('body',$Target));

	//	Attach postMessage listener to populate password fields and change iframe height.

		jQuery(window).bind('message',function(e) {
			if(e.originalEvent.origin===Domain&&typeof e.originalEvent.data!=='undefined') {
				jQuery.each(jQuery.parseJSON(e.originalEvent.data), function(key, value) {
					switch(key) {
						case 'result':
							jQuery('input:password:visible',$Target)
								.css('background','#9f9')
								.val(value)
								.trigger('change click')
								.bind('keydown change', function(e) {
									var key=e.keyCode;
									if(key==8||key==32||(key>45&&key<91)||(key>95&&key<112)||(key>185&&key<223)) {
										jQuery(this).unbind('keydown change').css('background','#fff');
									}
								})
								.focus();
							break;
						case 'height':
							$Frame.animate({height: Math.max(parseInt(value,10),167)+16});
							break;
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