(function() {

	function b64_md5(p) {
		return binl2b64(core_md5(str2binl(p),p.length*8));
	}

	function binl2b64(binarray) {
		var tab='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz012345678998';
		var str='';
		for(var i=0; i<binarray.length*4; i+=3) {
			var triplet=(((binarray[i>>2]>>8*(i%4))&0xFF)<<16)|(((binarray[i+1>>2]>>8*((i+1)%4))&0xFF)<<8)|((binarray[i+2>>2]>>8*((i+2)%4))&0xFF);
			for(var j=0; j<4; j++) str+=tab.charAt((triplet>>6*(3-j))&0x3F);
		}
		return str;
	}

	function hex_md5(p) {
		return binl2hex(core_md5(str2binl(p),p.length*8));
	}

	function binl2hex(binarray) {
		var hex_tab='0123456789abcdef';
		var str='';
		for(var i=0; i<binarray.length*4; i++) {
			str+=hex_tab.charAt((binarray[i>>2]>>((i%4)*8+4))&0xF)+hex_tab.charAt((binarray[i>>2]>>((i%4)*8))&0xF);
		}
		return str;
	}

	function core_md5(x,len) {
		x[len>>5]|=0x80<<((len)%32);
		x[(((len+64)>>>9)<<4)+14]=len;
		var a=1732584193;
		var b=-271733879;
		var c=-1732584194;
		var d=271733878;
		for(var i=0; i<x.length; i+=16) {
			var olda=a;
			var oldb=b;
			var oldc=c;
			var oldd=d;
			a=md5_ff(a,b,c,d,x[i+0],7,-680876936);
			d=md5_ff(d,a,b,c,x[i+1],12,-389564586);
			c=md5_ff(c,d,a,b,x[i+2],17,606105819);
			b=md5_ff(b,c,d,a,x[i+3],22,-1044525330);
			a=md5_ff(a,b,c,d,x[i+4],7,-176418897);
			d=md5_ff(d,a,b,c,x[i+5],12,1200080426);
			c=md5_ff(c,d,a,b,x[i+6],17,-1473231341);
			b=md5_ff(b,c,d,a,x[i+7],22,-45705983);
			a=md5_ff(a,b,c,d,x[i+8],7,1770035416);
			d=md5_ff(d,a,b,c,x[i+9],12,-1958414417);
			c=md5_ff(c,d,a,b,x[i+10],17,-42063);
			b=md5_ff(b,c,d,a,x[i+11],22,-1990404162);
			a=md5_ff(a,b,c,d,x[i+12],7,1804603682);
			d=md5_ff(d,a,b,c,x[i+13],12,-40341101);
			c=md5_ff(c,d,a,b,x[i+14],17,-1502002290);
			b=md5_ff(b,c,d,a,x[i+15],22,1236535329);
			a=md5_gg(a,b,c,d,x[i+1],5,-165796510);
			d=md5_gg(d,a,b,c,x[i+6],9,-1069501632);
			c=md5_gg(c,d,a,b,x[i+11],14,643717713);
			b=md5_gg(b,c,d,a,x[i+0],20,-373897302);
			a=md5_gg(a,b,c,d,x[i+5],5,-701558691);
			d=md5_gg(d,a,b,c,x[i+10],9,38016083);
			c=md5_gg(c,d,a,b,x[i+15],14,-660478335);
			b=md5_gg(b,c,d,a,x[i+4],20,-405537848);
			a=md5_gg(a,b,c,d,x[i+9],5,568446438);
			d=md5_gg(d,a,b,c,x[i+14],9,-1019803690);
			c=md5_gg(c,d,a,b,x[i+3],14,-187363961);
			b=md5_gg(b,c,d,a,x[i+8],20,1163531501);
			a=md5_gg(a,b,c,d,x[i+13],5,-1444681467);
			d=md5_gg(d,a,b,c,x[i+2],9,-51403784);
			c=md5_gg(c,d,a,b,x[i+7],14,1735328473);
			b=md5_gg(b,c,d,a,x[i+12],20,-1926607734);
			a=md5_hh(a,b,c,d,x[i+5],4,-378558);
			d=md5_hh(d,a,b,c,x[i+8],11,-2022574463);
			c=md5_hh(c,d,a,b,x[i+11],16,1839030562);
			b=md5_hh(b,c,d,a,x[i+14],23,-35309556);
			a=md5_hh(a,b,c,d,x[i+1],4,-1530992060);
			d=md5_hh(d,a,b,c,x[i+4],11,1272893353);
			c=md5_hh(c,d,a,b,x[i+7],16,-155497632);
			b=md5_hh(b,c,d,a,x[i+10],23,-1094730640);
			a=md5_hh(a,b,c,d,x[i+13],4,681279174);
			d=md5_hh(d,a,b,c,x[i+0],11,-358537222);
			c=md5_hh(c,d,a,b,x[i+3],16,-722521979);
			b=md5_hh(b,c,d,a,x[i+6],23,76029189);
			a=md5_hh(a,b,c,d,x[i+9],4,-640364487);
			d=md5_hh(d,a,b,c,x[i+12],11,-421815835);
			c=md5_hh(c,d,a,b,x[i+15],16,530742520);
			b=md5_hh(b,c,d,a,x[i+2],23,-995338651);
			a=md5_ii(a,b,c,d,x[i+0],6,-198630844);
			d=md5_ii(d,a,b,c,x[i+7],10,1126891415);
			c=md5_ii(c,d,a,b,x[i+14],15,-1416354905);
			b=md5_ii(b,c,d,a,x[i+5],21,-57434055);
			a=md5_ii(a,b,c,d,x[i+12],6,1700485571);
			d=md5_ii(d,a,b,c,x[i+3],10,-1894986606);
			c=md5_ii(c,d,a,b,x[i+10],15,-1051523);
			b=md5_ii(b,c,d,a,x[i+1],21,-2054922799);
			a=md5_ii(a,b,c,d,x[i+8],6,1873313359);
			d=md5_ii(d,a,b,c,x[i+15],10,-30611744);
			c=md5_ii(c,d,a,b,x[i+6],15,-1560198380);
			b=md5_ii(b,c,d,a,x[i+13],21,1309151649);
			a=md5_ii(a,b,c,d,x[i+4],6,-145523070);
			d=md5_ii(d,a,b,c,x[i+11],10,-1120210379);
			c=md5_ii(c,d,a,b,x[i+2],15,718787259);
			b=md5_ii(b,c,d,a,x[i+9],21,-343485551);
			a=safe_add(a,olda);
			b=safe_add(b,oldb);
			c=safe_add(c,oldc);
			d=safe_add(d,oldd);
		}
		return Array(a,b,c,d);
	}

	function md5_cmn(q,a,b,x,s,t) {
		return safe_add(bit_rol(safe_add(safe_add(a,q),safe_add(x,t)),s),b);
	}

	function md5_ff(a,b,c,d,x,s,t) {
		return md5_cmn((b&c)|((~b)&d),a,b,x,s,t);
	}

	function md5_gg(a,b,c,d,x,s,t) {
		return md5_cmn((b&d)|(c&(~d)),a,b,x,s,t);
	}

	function md5_hh(a,b,c,d,x,s,t) {
		return md5_cmn(b^c^d,a,b,x,s,t);
	}

	function md5_ii(a,b,c,d,x,s,t) {
		return md5_cmn(c^(b|(~d)),a,b,x,s,t);
	}

	function safe_add(x,y) {
		var lsw=(x&0xFFFF)+(y&0xFFFF);
		var msw=(x>>16)+(y>>16)+(lsw>>16);
		return (msw<<16)|(lsw&0xFFFF);
	}

	function bit_rol(num,cnt) {
		return (num<<cnt)|(num>>>(32-cnt));
	}

	function str2binl(str) {
		var bin=Array();
		var mask=(1<<8)-1;
		for(var i=0; i<str.length*8; i+=8) bin[i>>5]|=(str.charCodeAt(i/8)&mask)<<(i%32);
		return bin;
	}

	function gp2_genpass(Passwd,Domain,Len,Hash,AllowAutoPop) {

		if(target.getElementById('gp2_pass_box')) {
			alert('You already have a SuperGenPass window open.');
			return false;
		}

		if(target.getElementById('gp2_protect')&&!(Passwd)) {
			if(!(confirm('It appears that SuperGenPass has already been \nrun on this page. Are you sure you want to \nrun it again?'))) return false;
			if(target.getElementById('gp2_protect')) target.body.removeChild(target.getElementById('gp2_protect'));
			AllowAutoPop=false;
		}


		var ScrollPosition=gp2_get_scroll_position();

		if(target.getElementById('gp2_position')) {

			var Position=target.getElementById('gp2_position').firstChild.nodeValue.split('#');
			var ScrollWidth=(ScrollPosition[0]==Position[2])?Position[0]:(parseInt(Position[0])-(ScrollPosition[0]-Position[2]))+'px';
			var ScrollHeight=(ScrollPosition[1]==Position[3])?Position[1]:(parseInt(Position[1])+(ScrollPosition[1]-Position[3]))+'px';

		} else {

			ScrollWidth=ScrollPosition[0]+'px';
			ScrollHeight=ScrollPosition[1]+'px';

		}

		var PasswdFields=Array();
		var PasswdField=false;
		var PasswdTarget=false;
		var HarvestPasswd=(Passwd)?false:true;
		var Visible=true;

		var FontStyle=Array('font','11px sans-serif');
		var InputFontStyle=Array('font','13px monospace');
		var BoxStyle=Array(Array('margin','0'),Array('padding','8px'),Array('width','auto'),FontStyle);
		var RevealStyle=Array(Array('margin','5px 5px 2px 0'),Array('padding','5px'),Array('width','auto'),Array('background','#fff'),InputFontStyle);
		var HiddenRevealStyle=RevealStyle.concat(Array(Array('display','none')));
		var MessageStyle=Array(Array('margin','0 0 3px 0'),Array('padding','0'),FontStyle);

		var TitleBar=
			gp2_make(
				'div',
				Array(),
				Array(Array('margin','0'),Array('padding','6px 0 6px 8px'),Array('width','auto'),Array('background','#456'),Array('color','#fff'),FontStyle,Array('fontWeight','bold'),Array('cursor','move')),
				Array(),
				Array(
					target.createTextNode('SuperGenPass 1.1'+String.fromCharCode(160)+' '+String.fromCharCode(160)+' '),
					gp2_make(
						'a',
						Array(Array('href','#')),
						Array(Array('color','#abc'),Array('font','10px sans-serif'),Array('fontWeight','bold'),Array('textDecoration','none'),Array('cursor','pointer')),
						Array(Array('onclick','gp2_close')),
						Array(target.createTextNode('[close]'))
					)
				)
			);

		if(TitleBar.addEventListener) { 
			TitleBar.addEventListener('mousedown',gp2_drag_start,false);
		} else if(TitleBar.attachEvent) {
			TitleBar.attachEvent('onmousedown',gp2_drag_start);
		}

		var ParentDiv=
			gp2_make(
				'div',
				Array(Array('id','gp2_pass_box')),
				Array(Array('zIndex','99999'),Array('position','absolute'),Array('top',ScrollHeight),Array('right',ScrollWidth),Array('width','200px'),Array('padding','0'),Array('background','#ddd'),Array('color','#000'),Array('borderStyle','solid'),Array('borderColor','#fff'),Array('borderWidth','5px'),Array('textAlign','left')),
				Array(),
				Array(TitleBar)
			);


		Passwd=(HarvestPasswd)?false:unescape(Passwd);

		for(var i=0; i<target.forms.length; i++) {

			for(var j=0; j<target.forms[i].elements.length; j++) {

				if(target.forms[i].elements[j].type=='password') {

					PasswdField=target.forms[i].elements[j];
					Visible=(PasswdField.style.display.toLowerCase()=='none'||PasswdField.style.visibility.toLowerCase()=='hidden')?false:true;
					PasswdFieldParent=PasswdField.parentNode;

					while(Visible&&PasswdFieldParent&&PasswdFieldParent.nodeName.toLowerCase()!='html'&&PasswdFieldParent.nodeName.toLowerCase()!='#document') {

						if(PasswdFieldParent.style) {
							if(PasswdFieldParent.style.display.toLowerCase()=='none'||PasswdFieldParent.style.visibility.toLowerCase()=='hidden') Visible=false;
						}

						if(Visible&&PasswdFieldParent.currentStyle) {
							if(PasswdFieldParent.currentStyle['display'].toLowerCase()=='none') Visible=false;
							if(Visible&&PasswdFieldParent.currentStyle['visibility'].toLowerCase()=='hidden') Visible=false;
						} else if (Visible&&window.getComputedStyle) {
							if(document.defaultView.getComputedStyle(PasswdFieldParent,null).getPropertyValue('display').toLowerCase()=='none') Visible=false;
							if(Visible&&document.defaultView.getComputedStyle(PasswdFieldParent,null).getPropertyValue('visibility').toLowerCase()=='hidden') Visible=false;
						}

						if(Visible) PasswdFieldParent=PasswdFieldParent.parentNode;

					}

					if(Visible) {

						if(PasswdField.value.replace('/\s/','')) {

							if(HarvestPasswd) {

								if(Passwd&&PasswdField.value!=Passwd) {
									HarvestPasswd=false;
									Passwd=false;
								} else {
									Passwd=PasswdField.value;
									PasswdTarget=true;
								}

							}

							PasswdFields.push(Array(i,j,true));

						} else {
							PasswdFields.push(Array(i,j,false));
						}

						PasswdField.style.background='#fff';
						PasswdField.onchange=null;
						PasswdField.click=null;
						PasswdField.ondblclick=null;

					}
				}
			}
		}


		if(Passwd) {

			if(!Domain) {
				var DomainIsolator=new RegExp('^(http|ftp)s?://([^/:]+)');
				var HostName=target.location.href.match(DomainIsolator)[2];
				HostName=HostName.split('.');
				if(HostName[2]!=null) {
					Domain=HostName[HostName.length-2]+'.'+HostName[HostName.length-1];
					var DomainList=Array('ac.ac','com.ac','edu.ac','gov.ac','net.ac','mil.ac','org.ac','com.ae','net.ae','org.ae','gov.ae','ac.ae','co.ae','sch.ae','pro.ae','com.ai','org.ai','edu.ai','gov.ai','com.ar','net.ar','org.ar','gov.ar','mil.ar','edu.ar','int.ar','co.at','ac.at','or.at','gv.at','priv.at','com.au','gov.au','org.au','edu.au','id.au','oz.au','info.au','net.au','asn.au','csiro.au','telememo.au','conf.au','otc.au','id.au','com.az','net.az','org.az','com.bb','net.bb','org.bb','ac.be','belgie.be','dns.be','fgov.be','com.bh','gov.bh','net.bh','edu.bh','org.bh','com.bm','edu.bm','gov.bm','org.bm','net.bm','adm.br','adv.br','agr.br','am.br','arq.br','art.br','ato.br','bio.br','bmd.br','cim.br','cng.br','cnt.br','com.br','coop.br','ecn.br','edu.br','eng.br','esp.br','etc.br','eti.br','far.br','fm.br','fnd.br','fot.br','fst.br','g12.br','ggf.br','gov.br','imb.br','ind.br','inf.br','jor.br','lel.br','mat.br','med.br','mil.br','mus.br','net.br','nom.br','not.br','ntr.br','odo.br','org.br','ppg.br','pro.br','psc.br','psi.br','qsl.br','rec.br','slg.br','srv.br','tmp.br','trd.br','tur.br','tv.br','vet.br','zlg.br','com.bs','net.bs','org.bs','ab.ca','bc.ca','mb.ca','nb.ca','nf.ca','nl.ca','ns.ca','nt.ca','nu.ca','on.ca','pe.ca','qc.ca','sk.ca','yk.ca','gc.ca','co.ck','net.ck','org.ck','edu.ck','gov.ck','com.cn','edu.cn','gov.cn','net.cn','org.cn','ac.cn','ah.cn','bj.cn','cq.cn','gd.cn','gs.cn','gx.cn','gz.cn','hb.cn','he.cn','hi.cn','hk.cn','hl.cn','hn.cn','jl.cn','js.cn','ln.cn','mo.cn','nm.cn','nx.cn','qh.cn','sc.cn','sn.cn','sh.cn','sx.cn','tj.cn','tw.cn','xj.cn','xz.cn','yn.cn','zj.cn','arts.co','com.co','edu.co','firm.co','gov.co','info.co','int.co','nom.co','mil.co','org.co','rec.co','store.co','web.co','ac.cr','co.cr','ed.cr','fi.cr','go.cr','or.cr','sa.cr','com.cu','net.cu','org.cu','ac.cy','com.cy','gov.cy','net.cy','org.cy','co.dk','art.do','com.do','edu.do','gov.do','gob.do','org.do','mil.do','net.do','sld.do','web.do','com.dz','org.dz','net.dz','gov.dz','edu.dz','ass.dz','pol.dz','art.dz','com.ec','k12.ec','edu.ec','fin.ec','med.ec','gov.ec','mil.ec','org.ec','net.ec','com.ee','pri.ee','fie.ee','org.ee','med.ee','com.eg','edu.eg','eun.eg','gov.eg','net.eg','org.eg','sci.eg','com.er','net.er','org.er','edu.er','mil.er','gov.er','ind.er','com.es','org.es','gob.es','edu.es','nom.es','com.et','gov.et','org.et','edu.et','net.et','biz.et','name.et','info.et','ac.fj','com.fj','gov.fj','id.fj','org.fj','school.fj','com.fk','ac.fk','gov.fk','net.fk','nom.fk','org.fk','asso.fr','nom.fr','barreau.fr','com.fr','prd.fr','presse.fr','tm.fr','aeroport.fr','assedic.fr','avocat.fr','avoues.fr','cci.fr','chambagri.fr','chirurgiens-dentistes.fr','experts-comptables.fr','geometre-expert.fr','gouv.fr','greta.fr','huissier-justice.fr','medecin.fr','notaires.fr','pharmacien.fr','port.fr','veterinaire.fr','com.ge','edu.ge','gov.ge','mil.ge','net.ge','org.ge','pvt.ge','co.gg','org.gg','sch.gg','ac.gg','gov.gg','ltd.gg','ind.gg','net.gg','alderney.gg','guernsey.gg','sark.gg','com.gr','edu.gr','gov.gr','net.gr','org.gr','com.gt','edu.gt','net.gt','gob.gt','org.gt','mil.gt','ind.gt','com.gu','edu.gu','net.gu','org.gu','gov.gu','mil.gu','com.hk','net.hk','org.hk','idv.hk','gov.hk','edu.hk','co.hu','2000.hu','erotika.hu','jogasz.hu','sex.hu','video.hu','info.hu','agrar.hu','film.hu','konyvelo.hu','shop.hu','org.hu','bolt.hu','forum.hu','lakas.hu','suli.hu','priv.hu','casino.hu','games.hu','media.hu','szex.hu','sport.hu','city.hu','hotel.hu','news.hu','tozsde.hu','tm.hu','erotica.hu','ingatlan.hu','reklam.hu','utazas.hu','ac.id','co.id','go.id','mil.id','net.id','or.id','co.il','net.il','org.il','ac.il','gov.il','k12.il','muni.il','idf.il','co.im','net.im','org.im','ac.im','lkd.co.im','gov.im','nic.im','plc.co.im','co.in','net.in','ac.in','ernet.in','gov.in','nic.in','res.in','gen.in','firm.in','mil.in','org.in','ind.in','ac.ir','co.ir','gov.ir','id.ir','net.ir','org.ir','sch.ir','ac.je','co.je','net.je','org.je','gov.je','ind.je','jersey.je','ltd.je','sch.je','com.jo','org.jo','net.jo','gov.jo','edu.jo','mil.jo','ad.jp','ac.jp','co.jp','go.jp','or.jp','ne.jp','gr.jp','ed.jp','lg.jp','net.jp','org.jp','gov.jp','hokkaido.jp','aomori.jp','iwate.jp','miyagi.jp','akita.jp','yamagata.jp','fukushima.jp','ibaraki.jp','tochigi.jp','gunma.jp','saitama.jp','chiba.jp','tokyo.jp','kanagawa.jp','niigata.jp','toyama.jp','ishikawa.jp','fukui.jp','yamanashi.jp','nagano.jp','gifu.jp','shizuoka.jp','aichi.jp','mie.jp','shiga.jp','kyoto.jp','osaka.jp','hyogo.jp','nara.jp','wakayama.jp','tottori.jp','shimane.jp','okayama.jp','hiroshima.jp','yamaguchi.jp','tokushima.jp','kagawa.jp','ehime.jp','kochi.jp','fukuoka.jp','saga.jp','nagasaki.jp','kumamoto.jp','oita.jp','miyazaki.jp','kagoshima.jp','okinawa.jp','sapporo.jp','sendai.jp','yokohama.jp','kawasaki.jp','nagoya.jp','kobe.jp','kitakyushu.jp','utsunomiya.jp','kanazawa.jp','takamatsu.jp','matsuyama.jp','com.kh','net.kh','org.kh','per.kh','edu.kh','gov.kh','mil.kh','ac.kr','co.kr','go.kr','ne.kr','or.kr','pe.kr','re.kr','seoul.kr','kyonggi.kr','com.kw','net.kw','org.kw','edu.kw','gov.kw','com.la','net.la','org.la','com.lb','org.lb','net.lb','edu.lb','gov.lb','mil.lb','com.lc','edu.lc','gov.lc','net.lc','org.lc','com.lv','net.lv','org.lv','edu.lv','gov.lv','mil.lv','id.lv','asn.lv','conf.lv','com.ly','net.ly','org.ly','co.ma','net.ma','org.ma','press.ma','ac.ma','com.mk','com.mm','net.mm','org.mm','edu.mm','gov.mm','com.mn','org.mn','edu.mn','gov.mn','museum.mn','com.mo','net.mo','org.mo','edu.mo','gov.mo','com.mt','net.mt','org.mt','edu.mt','tm.mt','uu.mt','com.mx','net.mx','org.mx','gob.mx','edu.mx','com.my','org.my','gov.my','edu.my','net.my','com.na','org.na','net.na','alt.na','edu.na','cul.na','unam.na','telecom.na','com.nc','net.nc','org.nc','ac.ng','edu.ng','sch.ng','com.ng','gov.ng','org.ng','net.ng','gob.ni','com.ni','net.ni','edu.ni','nom.ni','org.ni','com.np','net.np','org.np','gov.np','edu.np','ac.nz','co.nz','cri.nz','gen.nz','geek.nz','govt.nz','iwi.nz','maori.nz','mil.nz','net.nz','org.nz','school.nz','com.om','co.om','edu.om','ac.om','gov.om','net.om','org.om','mod.om','museum.om','biz.om','pro.om','med.om','com.pa','net.pa','org.pa','edu.pa','ac.pa','gob.pa','sld.pa','edu.pe','gob.pe','nom.pe','mil.pe','org.pe','com.pe','net.pe','com.pg','net.pg','ac.pg','com.ph','net.ph','org.ph','mil.ph','ngo.ph','aid.pl','agro.pl','atm.pl','auto.pl','biz.pl','com.pl','edu.pl','gmina.pl','gsm.pl','info.pl','mail.pl','miasta.pl','media.pl','mil.pl','net.pl','nieruchomosci.pl','nom.pl','org.pl','pc.pl','powiat.pl','priv.pl','realestate.pl','rel.pl','sex.pl','shop.pl','sklep.pl','sos.pl','szkola.pl','targi.pl','tm.pl','tourism.pl','travel.pl','turystyka.pl','com.pk','net.pk','edu.pk','org.pk','fam.pk','biz.pk','web.pk','gov.pk','gob.pk','gok.pk','gon.pk','gop.pk','gos.pk','edu.ps','gov.ps','plo.ps','sec.ps','com.pt','edu.pt','gov.pt','int.pt','net.pt','nome.pt','org.pt','publ.pt','com.py','net.py','org.py','edu.py','com.qa','net.qa','org.qa','edu.qa','gov.qa','asso.re','com.re','nom.re','com.ro','org.ro','tm.ro','nt.ro','nom.ro','info.ro','rec.ro','arts.ro','firm.ro','store.ro','www.ro','com.ru','net.ru','org.ru','gov.ru','pp.ru','com.sa','edu.sa','sch.sa','med.sa','gov.sa','net.sa','org.sa','pub.sa','com.sb','net.sb','org.sb','edu.sb','gov.sb','com.sd','net.sd','org.sd','edu.sd','sch.sd','med.sd','gov.sd','tm.se','press.se','parti.se','brand.se','fh.se','fhsk.se','fhv.se','komforb.se','kommunalforbund.se','komvux.se','lanarb.se','lanbib.se','naturbruksgymn.se','sshn.se','org.se','pp.se','com.sg','net.sg','org.sg','edu.sg','gov.sg','per.sg','com.sh','net.sh','org.sh','edu.sh','gov.sh','mil.sh','gov.st','saotome.st','principe.st','consulado.st','embaixada.st','org.st','edu.st','net.st','com.st','store.st','mil.st','co.st','com.sv','org.sv','edu.sv','gob.sv','red.sv','com.sy','net.sy','org.sy','gov.sy','ac.th','co.th','go.th','net.th','or.th','com.tn','net.tn','org.tn','edunet.tn','gov.tn','ens.tn','fin.tn','nat.tn','ind.tn','info.tn','intl.tn','rnrt.tn','rnu.tn','rns.tn','tourism.tn','com.tr','net.tr','org.tr','edu.tr','gov.tr','mil.tr','bbs.tr','k12.tr','gen.tr','co.tt','com.tt','org.tt','net.tt','biz.tt','info.tt','pro.tt','int.tt','coop.tt','jobs.tt','mobi.tt','travel.tt','museum.tt','aero.tt','name.tt','gov.tt','edu.tt','nic.tt','us.tt','uk.tt','ca.tt','eu.tt','es.tt','fr.tt','it.tt','se.tt','dk.tt','be.tt','de.tt','at.tt','au.tt','co.tv','com.tw','net.tw','org.tw','edu.tw','idv.tw','gov.tw','com.ua','net.ua','org.ua','edu.ua','gov.ua','ac.ug','co.ug','or.ug','go.ug','co.uk','me.uk','org.uk','edu.uk','ltd.uk','plc.uk','net.uk','sch.uk','nic.uk','ac.uk','gov.uk','nhs.uk','police.uk','mod.uk','dni.us','fed.us','com.uy','edu.uy','net.uy','org.uy','gub.uy','mil.uy','com.ve','net.ve','org.ve','co.ve','edu.ve','gov.ve','mil.ve','arts.ve','bib.ve','firm.ve','info.ve','int.ve','nom.ve','rec.ve','store.ve','tec.ve','web.ve','co.vi','net.vi','org.vi','com.vn','biz.vn','edu.vn','gov.vn','net.vn','org.vn','int.vn','ac.vn','pro.vn','info.vn','health.vn','name.vn','com.vu','edu.vu','net.vu','org.vu','de.vu','ch.vu','fr.vu','com.ws','net.ws','org.ws','gov.ws','edu.ws','ac.yu','co.yu','edu.yu','org.yu','com.ye','net.ye','org.ye','gov.ye','edu.ye','mil.ye','ac.za','alt.za','bourse.za','city.za','co.za','edu.za','gov.za','law.za','mil.za','net.za','ngo.za','nom.za','org.za','school.za','tm.za','web.za','co.zw','ac.zw','org.zw','gov.zw','eu.org','au.com','br.com','cn.com','de.com','de.net','eu.com','gb.com','gb.net','hu.com','no.com','qc.com','ru.com','sa.com','se.com','uk.com','uk.net','us.com','uy.com','za.com','dk.org','tel.no','fax.nr','mob.nr','mobil.nr','mobile.nr','tel.nr','tlf.nr','e164.arpa');
					for(var i=0; i<DomainList.length; i++) {
						if(Domain==DomainList[i]) {
							Domain=HostName[HostName.length-3]+'.'+Domain;
							break;
						}
					}
				} else {
					Domain=HostName.join('.');
				}
			}

			var HashMessage=target.createTextNode('');

			if(Hash) {

				HashCand=hex_md5(Passwd);
				for(var i=1;i<5;i++) HashCand=hex_md5(HashCand);

				if(HashCand==Hash) {
					var HashColor='#030';
					var HashBGColor='#ada';
					HashMessage='Master password verified.';
				} else {
					AllowAutoPop=false;
					var HashColor='#f00';
					var HashBGColor='#fcc';
					HashMessage='Incorrect master password!';
				}

				HashMessage=gp2_make('div',Array(),Array(Array('margin','0'),Array('padding','5px 0 5px 8px'),Array('width','auto'),Array('color',HashColor),Array('background',HashBGColor),FontStyle,Array('fontWeight','bold')),Array(),Array(target.createTextNode(HashMessage)));

			}

			Len=(parseInt(Len))?parseInt(Len):10;
			if(Len==0) Len=10;
			if(Len<4) Len=4;
			if(Len>24) Len=24;
			var PassCand=Passwd+':'+Domain;
			for(var i=0; i<10; i++) PassCand=b64_md5(PassCand);
			while(PassCand.substr(0,Len).search(/[a-z]/)!=0||PassCand.substr(0,Len).search(/[A-Z]/)==-1||PassCand.substr(0,Len).search(/[0-9]/)==-1) PassCand=b64_md5(PassCand);
			PassCand=PassCand.substr(0,Len);


			var Populated=0;
			var Unpopulated=0;

			for(i=0; i<(PasswdFields.length); i++) {

				PasswdTarget = target.forms[PasswdFields[i][0]].elements[PasswdFields[i][1]];

				if(AllowAutoPop&&((HarvestPasswd&&PasswdFields[i][2])||(!HarvestPasswd&&!PasswdFields[i][2]))) {
					PasswdTarget.style.background='#9fc';
					PasswdTarget.value=PassCand;
					PasswdTarget.focus();
					PasswdTarget.onchange=gp2_unprotect;
					Populated++;
				} else if(HarvestPasswd&&PasswdTarget.value==Passwd&&Populated==0) {
					PasswdTarget.style.background='#9cf';
					PasswdTarget.onchange=gp2_remove_color;
					PasswdTarget.ondblclick=gp2_populate;
					Unpopulated++;
				} else {
					PasswdTarget.ondblclick=gp2_populate;
					Unpopulated++;
				}

			}

			if(AllowAutoPop) {
				MasterMessage=(HarvestPasswd)?'Using the '+Passwd.length+' characters found in the green password field as your master password.':'Using hardcoded master password.';
				GeneratedMessage=(Populated)?'Your password has been generated and populated in the green password field(s).':'Your password was generated but cannot be populated (no password fields found).';
			} else {
				MasterMessage=(HarvestPasswd)?'Using the '+Passwd.length+' characters found in the blue password field as your master password.':'Using supplied master password.';
				GeneratedMessage='Your password has been generated.';
			}

			if(Populated) target.body.appendChild(gp2_make('div',Array(Array('id','gp2_protect')),Array(Array('display','none')),Array(),Array(target.createTextNode('SuperGenPass'))));

			if(Unpopulated) {
				target.body.appendChild(gp2_make('div',Array(Array('id','gp2_content')),Array(Array('display','none')),Array(),Array(target.createTextNode(PassCand))));
				GeneratedMessage=GeneratedMessage+' Double-click on a password field to populate it with your generated password.';
			}


			var PassMask = '************************';

			ParentDiv=
				gp2_append(
					ParentDiv,
					Array(
						HashMessage,
						gp2_make(
							'div',
							Array(),
							BoxStyle.concat(Array(Array('border','solid'),Array('borderColor','#999'),Array('borderWidth','0 0 1px 0'))),
							Array(),
							Array(
								target.createTextNode(GeneratedMessage),
								gp2_make(
									'div',
									Array(Array('id','gp2_offer_pass')),
									RevealStyle,
									Array(),
									Array(target.createTextNode(PassMask.substr(0,Len)))
								),
								gp2_make(
									'div',
									Array(Array('id','gp2_show_pass')),
									HiddenRevealStyle,
									Array(),
									Array(target.createTextNode(PassCand))
								),
								gp2_make(
									'a',
									Array(Array('href','#')),
									Array(Array('color','#456'),FontStyle),
									Array(Array('onclick','gp2_reveal_pass')),
									Array(target.createTextNode('Show/hide'))
								)
							)
						),
						gp2_make(
							'div',
							Array(),
							BoxStyle,
							Array(),
							Array(
								target.createTextNode(MasterMessage),
								gp2_make(
									'div',
									Array(Array('id','gp2_offer_master_pass')),
									RevealStyle,
									Array(),
									Array(target.createTextNode(PassMask.substr(0,Passwd.length)))
								),
								gp2_make(
									'div',
									Array(Array('id','gp2_show_master_pass')),
									HiddenRevealStyle,
									Array(),
									Array(target.createTextNode(Passwd))
								),
								gp2_make(
									'a',
									Array(Array('href','#')),
									Array(Array('color','#456'),FontStyle),
									Array(Array('onclick','gp2_reveal_master_pass')),
									Array(target.createTextNode('Show/hide'))
								)
							)
						),
						gp2_make(
							'div',
							Array(Array('id','gp2_advanced_box')),
							BoxStyle.concat(Array(Array('display','none'),Array('background','#cde'),Array('border','solid'),Array('borderColor','#999'),Array('borderWidth','1px 0 0 0'))),
							Array(),
							Array(
								gp2_make(
									'div',
									Array(),
									Array(Array('margin','0 0 5px 0'),Array('padding','0'),FontStyle,Array('fontWeight','bold')),
									Array(),
									Array(target.createTextNode('Regenerate password '))
								),
								gp2_make(
									'form',
									Array(Array('name','gp2_advanced')),
									Array(Array('margin','0'),Array('padding','0')),
									Array(Array('onsubmit','gp2_retry_advanced')),
									Array(
										gp2_make(
											'input',
											Array(Array('type','hidden'),Array('id','gp2_advanced_old_passwd'),Array('value',Passwd)),
											Array(),
											Array(),
											Array()
										),
										gp2_make(
											'input',
											Array(Array('type','hidden'),Array('id','gp2_advanced_old_domain'),Array('value',Domain)),
											Array(),
											Array(),
											Array()
										),
										gp2_make(
											'input',
											Array(Array('type','hidden'),Array('id','gp2_advanced_old_len'),Array('value',Len)),
											Array(),
											Array(),
											Array()
										),
										gp2_make(
											'input',
											Array(Array('type','hidden'),Array('id','gp2_advanced_hash'),Array('value',Hash)),
											Array(),
											Array(),
											Array()
										),
										target.createTextNode('Master password'),
										target.createElement('br'),
										gp2_make(
											'input',
											Array(Array('type','password'),Array('id','gp2_advanced_master_passwd'),Array('value',Passwd)),
											Array(Array('margin','3px 0 10px 0'),Array('width','150px'),InputFontStyle),
											Array(),
											Array()
										),
										target.createElement('br'),
										target.createTextNode('Domain'),
										target.createElement('br'),
										gp2_make(
											'input',
											Array(Array('type','text'),Array('id','gp2_advanced_domain'),Array('size','15'),Array('value',Domain)),
											Array(Array('margin','3px 0 10px 0'),Array('width','150px'),InputFontStyle),
											Array(),
											Array()
										),
										target.createElement('br'),
										target.createTextNode('Password length'),
										target.createElement('br'),
										gp2_make(
											'input',
											Array(Array('type','text'),Array('id','gp2_advanced_len'),Array('size','4'),Array('value',Len)),
											Array(Array('margin','3px 0 10px 0'),Array('width','40px'),InputFontStyle),
											Array(),
											Array()
										),
										target.createElement('br'),
										gp2_make(
											'input',
											Array(Array('type','submit'),Array('value','Regenerate')),
											Array(Array('margin','0 0 5px 0'),Array('height','20px'),FontStyle),
											Array(Array('onclick','gp2_retry_advanced')),
											Array()
										)
									)
								)
							)
						),
						gp2_make(
							'div',
							Array(),
							Array(Array('margin','0'),Array('padding','5px 8px 5px 8px'),Array('width','auto'),Array('background','#abc'),FontStyle,Array('border','solid'),Array('borderColor','#789'),Array('borderWidth','1px 0 0 0')),
							Array(),
							Array(
								gp2_make(
									'a',
									Array(Array('href','#'),Array('id','gp2_contract_link')),
									Array(Array('display','none'),Array('color','#000'),FontStyle),
									Array(Array('onclick','gp2_contract')),
									Array(target.createTextNode('<< Hide regenerate form'))
								),
								gp2_make(
									'a',
									Array(Array('href','#'),Array('id','gp2_expand_link')),
									Array(Array('color','#000'),FontStyle),
									Array(Array('onclick','gp2_expand')),
									Array(target.createTextNode('Regenerate password >>'))
								)
							)
						)
					)
				);
			
			target.body.appendChild(ParentDiv);

		} else {

			var MasterMessage=(PasswdTarget)?'Multiple passwords found on page. Double-click the password field you would like to use as your master password, or enter it below.':'Password not found on page. Please enter your master password below.';

			for(i=0; i<(PasswdFields.length); i++) {

				if(PasswdFields[i][2]) {
					PasswdTarget = target.forms[PasswdFields[i][0]].elements[PasswdFields[i][1]];
					PasswdTarget.click=null;
					PasswdTarget.ondblclick=gp2_use_as_master;
				}

			}

			ParentDiv.appendChild(
				gp2_make(
					'div',
					Array(),
					BoxStyle,
					Array(),
					Array(
						gp2_make(
							'form',
							Array(Array('name','gp2_retry')),
							Array(Array('margin','0'),Array('padding','0')),
							Array(Array('onsubmit','gp2_retry_passwd')),
							Array(
								gp2_make(
									'input',
									Array(Array('type','hidden'),Array('id','gp2_len'),Array('value',Len)),
									Array(),
									Array(),
									Array()
								),
								gp2_make(
									'input',
									Array(Array('type','hidden'),Array('id','gp2_hash'),Array('value',Hash)),
									Array(),
									Array(),
									Array()
								),
								target.createTextNode(MasterMessage),
								target.createElement('br'),
								gp2_make(
									'input',
									Array(Array('type','password'),Array('name','gp2_master'),Array('id','gp2_master'),Array('size','15'),Array('value','')),
									Array(Array('margin','5px 5px 0 0'),Array('width','125px'),InputFontStyle),
									Array(),
									Array()
								),
								gp2_make(
									'input',
									Array(Array('type','submit'),Array('value','Submit')),
									Array(Array('width','50px'),Array('height','20px'),FontStyle),
									Array(Array('onclick','gp2_retry_passwd')),
									Array()
								)
							)
						)
					)
				)
			);

			target.body.appendChild(ParentDiv);
			target.getElementById('gp2_master').focus();

		}

	}

	function gp2_save_position() {

		var ScrollPosition=gp2_get_scroll_position();
		if(target.getElementById('gp2_position')) target.body.removeChild(target.getElementById('gp2_position'));
		target.body.appendChild(gp2_make('div',Array(Array('id','gp2_position')),Array(Array('display','none')),Array(),Array(target.createTextNode(target.getElementById('gp2_pass_box').style.right+'#'+target.getElementById('gp2_pass_box').style.top+'#'+ScrollPosition[0]+'#'+ScrollPosition[1]))));

		return false;

	}

	function gp2_close() {

		gp2_save_position();
		target.body.removeChild(target.getElementById('gp2_pass_box'));
		if(target.getElementById('gp2_content')) target.body.removeChild(target.getElementById('gp2_content'));

		return false;

	}

	function gp2_expand() {

		target.getElementById('gp2_expand_link').style.display='none';
		target.getElementById('gp2_contract_link').style.display='inline';
		target.getElementById('gp2_advanced_box').style.display='block';

		return false;

	}

	function gp2_contract() {

		target.getElementById('gp2_expand_link').style.display='inline';
		target.getElementById('gp2_contract_link').style.display='none';
		target.getElementById('gp2_advanced_box').style.display='none';

		return false;

	}

	function gp2_retry_passwd() {

		Passwd=target.getElementById('gp2_master').value;
		Hash=target.getElementById('gp2_hash').value;
		Len=target.getElementById('gp2_len').value;
		if(Hash=='0') Hash=0;

		gp2_save_position();
		target.body.removeChild(target.getElementById('gp2_pass_box'));
		gp2_genpass(Passwd,0,Len,Hash,false);

		return false;

	}

	function gp2_retry_advanced() {

		OldPasswd=target.getElementById('gp2_advanced_old_passwd').value;
		OldDomain=target.getElementById('gp2_advanced_old_domain').value;
		OldLen=target.getElementById('gp2_advanced_old_len').value;

		Passwd=target.getElementById('gp2_advanced_master_passwd').value;
		if(Passwd=='') Passwd=0;
		Domain=target.getElementById('gp2_advanced_domain').value;
		if(Domain=='') Domain=0;
		Len=target.getElementById('gp2_advanced_len').value;
		if(Len=='') Len=0;
		Hash=target.getElementById('gp2_advanced_hash').value;
		if(Hash=='0') Hash=0;
		Clear=(Passwd!=OldPasswd||Domain!=OldDomain||Len!=OldLen)?true:false;

		gp2_save_position();

		target.body.removeChild(target.getElementById('gp2_pass_box'));
		gp2_genpass(Passwd,Domain,Len,Hash,false);

		return false;

	}

	function gp2_reveal_pass() {

		target.getElementById('gp2_offer_pass').style.display='none';
		target.getElementById('gp2_show_pass').style.display='block';
		this.onclick=gp2_hide_pass;

		return false;

	}

	function gp2_hide_pass() {

		target.getElementById('gp2_show_pass').style.display='none';
		target.getElementById('gp2_offer_pass').style.display='block';
		this.onclick=gp2_reveal_pass;

		return false;

	}

	function gp2_reveal_master_pass() {

		target.getElementById('gp2_offer_master_pass').style.display='none';
		target.getElementById('gp2_show_master_pass').style.display='block';
		this.onclick=gp2_hide_master_pass;

		return false;

	}

	function gp2_hide_master_pass() {

		target.getElementById('gp2_show_master_pass').style.display='none';
		target.getElementById('gp2_offer_master_pass').style.display='block';
		this.onclick=gp2_reveal_master_pass;

		return false;

	}

	function gp2_populate() {

		if(target.getElementById('gp2_content')) {
			this.value=target.getElementById('gp2_content').firstChild.nodeValue;
			this.style.background='#9fc';
			this.onchange=gp2_unprotect;
			this.ondblclick=null;
			if(!(target.getElementById('gp2_protect'))) target.body.appendChild(gp2_make('div',Array(Array('id','gp2_protect')),Array(Array('display','none')),Array(),Array(target.createTextNode('SuperGenPass'))));
		}

		return false;

	}

	function gp2_use_as_master() {

		if(target.getElementById('gp2_pass_box')) {
			Passwd=this.value;
			Hash=target.getElementById('gp2_hash').value;
			Len=target.getElementById('gp2_len').value;
			if(Hash=='0') Hash=0;
			target.body.removeChild(target.getElementById('gp2_pass_box'));
			gp2_genpass(Passwd,0,Len,Hash,true);
		}

		return false;

	}

	function gp2_remove_color() {

		this.style.background='#fff';
		this.onchange=null;
		if(target.getElementById('gp2_pass_box')) target.body.removeChild(target.getElementById('gp2_pass_box'));

		return false;

	}

	function gp2_unprotect() {

		this.style.background='#fff';
		this.onchange=null;
		if(target.getElementById('gp2_protect')) target.body.removeChild(target.getElementById('gp2_protect'));

		return false;

	}

	function gp2_submit() {
		return false;
	}

	function gp2_make(Name,Attributes,Styles,Methods,Children) {

		var Element=target.createElement(Name);

		for(var i=0; i<Attributes.length; i++) Element.setAttribute(Attributes[i][0],Attributes[i][1]);
		for(var i=0; i<Styles.length; i++) eval('Element.style.'+Styles[i][0]+"='"+Styles[i][1]+"'");
		for(var i=0; i<Methods.length; i++) eval('Element.'+Methods[i][0]+'='+Methods[i][1]);
		for(var i=0; i<Children.length; i++) Element.appendChild(Children[i]);

		return Element;

	}

	function gp2_append(Parent,Children) {

		for(var i=0; i<Children.length; i++) Parent.appendChild(Children[i]);

		return Parent;

	}

	function gp2_drag_start(e) {

		DragBox=new Object();
		var Cursor=gp2_get_cursor(e);

		DragBox.Node=document.getElementById('gp2_pass_box');
		DragBox.StartX=parseInt(DragBox.Node.style.right,10);
		DragBox.StartY=parseInt(DragBox.Node.style.top,10);
		DragBox.CursorX=Cursor[0];DragBox.CursorY=Cursor[1];

		if(target.addEventListener) {
			target.addEventListener('mousemove',gp2_drag_go,false);
			target.addEventListener('mouseup',gp2_drag_stop,false);
			e.preventDefault();
		} else if(target.attachEvent) {
			target.attachEvent('onmousemove',gp2_drag_go);
			target.attachEvent('onmouseup',gp2_drag_stop);
			window.event.cancelBubble=true;
			window.event.returnValue=false;
		}

	}

	function gp2_drag_go(e) {

		var CursorMove=gp2_get_cursor(e);

		DragBox.Node.style.right=(DragBox.StartX+(DragBox.CursorX-CursorMove[0]))+'px';
		DragBox.Node.style.top=(DragBox.StartY+(CursorMove[1]-DragBox.CursorY))+'px';

		return false;

	}

	function gp2_drag_stop(e) {

		if(target.removeEventListener) {
			target.removeEventListener('mousemove',gp2_drag_go,false);
			target.removeEventListener('mouseup',gp2_drag_stop,false);
		} else if(target.detachEvent) {
			target.detachEvent('onmousemove',gp2_drag_go);
			target.detachEvent('onmouseup',gp2_drag_stop);
		}

		return false;

	}

	function gp2_get_cursor(e) {

		var x=0;
		var y=0;

		if(e.pageX||e.pageY) {
			x=e.pageX;
			y=e.pageY;
		} else if(e.clientX||e.clientY) {
			x=e.clientX+document.body.scrollLeft;
			y=e.clientY+document.body.scrollTop;
		}

		return Array(x,y);

	}

	function gp2_get_scroll_position() {

		var x=0;
		var y=0;

		if(typeof(window.pageXOffset)=='number'||typeof(window.pageYOffset)=='number') {
			x=window.pageXOffset;
			y=window.pageYOffset;
		} else if(target.body&&(target.body.scrollLeft||target.body.scrollTop)) {
			x=target.body.scrollLeft;
			y=target.body.scrollTop;
		} else if(target.documentElement&&(target.documentElement.scrollLeft||target.documentElement.scrollTop)) {
			x=target.documentElement.scrollLeft;
			y=target.documentElement.scrollTop;
		}

		return Array(x,y);

	}

	var DragBox;
	var Frames=window.frames.length-document.getElementsByTagName('iframe').length;
	var target=false;

	if(Frames) {

		Frames=window.frames;
		var max=0;
		var area;

		for(var i=0; i<Frames.length; i++) {

			area=(Frames[i].innerHeight)?Frames[i].innerHeight*Frames[i].innerWidth:Frames[i].document.body.clientHeight*Frames[i].document.body.clientWidth;

			if(area>max) {
				max=area;
				target=window.frames[i].document;
			}

		}

	} else if(document) {

		target=document;

	}
	
	var GetProtocol=new RegExp('^(http|ftp)s?://');

	if(target&&target.location.href.match(GetProtocol)) {
		var Params=document.getElementById('fs_gp2').src.split('#')[1].split(',');
		for(i=0;i<Params.length;i++) if(Params[i]=='0') Params[i]=0;
		gp2_genpass(Params[0],Params[1],Params[2],Params[3],true);
	} else {
		if(confirm('SuperGenPass only works on Web sites. \nDo you want to go to the mobile version?')) window.location='http://www.supergenpass.com/mobile/';
	}

})();