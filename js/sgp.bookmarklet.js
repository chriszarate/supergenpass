/*
	SuperGenPass bookmarklet
	Convert to bookmarklet using:
	http://chris.zarate.org/bookmarkleter
*/

(function(){

/*
	Declare localization via query variable, e.g.:	
		Lang='?en';
	Available locales: de en es fr hu pt-br zh-hk
	Default (empty string) provides English (en).
*/

	Lang='';

	var SGP=document.createElement('script');
	    SGP.type='text/javascript';
	    SGP.src='https://supergenpass.s3.amazonaws.com/js/sgp.js?20130125';

	document.getElementsByTagName('head')[0].appendChild(SGP);

})();