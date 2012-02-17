(function() {

	function b64_md5(p) {
		p=utf8_en(p);
		return binl2b64(core_md5(str2binl(p),p.length*8));
	}

	function hex_md5(p) {
		p=utf8_en(p);
		return binl2hex(core_md5(str2binl(p),p.length*8));
	}

	function binl2b64(binarray) {
		var tab='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz012345678998';
		var str='';
		for(var i=0; i<binarray.length*4; i+=3) {
			var triplet=(((binarray[i>>2]>>8*(i%4))&0xFF)<<16)|(((binarray[i+1>>2]>>8*((i+1)%4))&0xFF)<<8)|((binarray[i+2>>2]>>8*((i+2)%4))&0xFF);
			for(var j=0; j<4; j++) {
				str+=tab.charAt((triplet>>6*(3-j))&0x3F);
			}
		}
		return str;
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
		return [a,b,c,d];
	}

	function md5_cmn(q,a,b,x,s,t){return safe_add(bit_rol(safe_add(safe_add(a,q),safe_add(x,t)),s),b);}
	function md5_ff(a,b,c,d,x,s,t){return md5_cmn((b&c)|((~b)&d),a,b,x,s,t);}
	function md5_gg(a,b,c,d,x,s,t){return md5_cmn((b&d)|(c&(~d)),a,b,x,s,t);}
	function md5_hh(a,b,c,d,x,s,t){return md5_cmn(b^c^d,a,b,x,s,t);}
	function md5_ii(a,b,c,d,x,s,t){return md5_cmn(c^(b|(~d)),a,b,x,s,t);}
	function bit_rol(num,cnt){return (num<<cnt)|(num>>>(32-cnt));}
	function utf8_en(str){return unescape(encodeURIComponent(str));}

	function safe_add(x,y) {
		var lsw=(x&0xFFFF)+(y&0xFFFF);
		var msw=(x>>16)+(y>>16)+(lsw>>16);
		return (msw<<16)|(lsw&0xFFFF);
	}

	function str2binl(str) {
		var bin=[];
		var mask=(1<<8)-1;
		for(var i=0;i<str.length*8;i+=8) {
			bin[i>>5]|=(str.charCodeAt(i/8)&mask)<<(i%32);
		}
		return bin;
	}

	function gp2_generate_passwd(Passwd,Len) {
		var i=0;
		while(i<10||!(gp2_check_passwd(Passwd.substring(0,Len)))) {
			Passwd=b64_md5(Passwd);
			i++;
		}
		return Passwd.substring(0,Len);
	}

	function gp2_check_passwd(Passwd) {
		return (Passwd.search(/[a-z]/)===0&&Passwd.search(/[0-9]/)>0&&Passwd.search(/[A-Z]/)>0)?true:false;
	}

	function gp2_generate_hash(HashSeed) {
		for(var i=0;i<=4;i++) {
			HashSeed=hex_md5(HashSeed);
		}
		return HashSeed;
	}

	function gp2_validate_length(Len) {
		Len=(parseInt(Len))?parseInt(Len):10;
		if(Len<4) {
			Len=4;
		} else if(Len>24) {
			Len=24;
		}
		return Len;
	}

	function gp2_process_uri(URI,DisableTLD) {

		URI=URI.toLowerCase();
		var HostNameIsolator=new RegExp('^(http|https|ftp|ftps|webdav|gopher|rtsp|irc|nntp|pop|imap|smtp)://([^/:]+)');
		var HostName=URI.match(HostNameIsolator);

		if(HostName&&HostName[2]!=null) {
			HostName=HostName[2];
		} else {
			HostNameIsolator=new RegExp('^([^/:]+)');
			HostName=URI.match(HostNameIsolator);
			HostName=(HostName[1]!=null)?HostName[1]:URI;
		}

		HostNameIsolator=new RegExp('^([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3})$');
		HostName=(HostName.match(HostNameIsolator))?[HostName]:HostName.split('.');

		if(HostName[2]==null||DisableTLD) {
			URI=HostName.join('.');
		} else {
			URI=HostName[HostName.length-2]+'.'+HostName[HostName.length-1];
			var TLDList=['ac.ac','com.ac','edu.ac','gov.ac','net.ac','mil.ac','org.ac','com.ae','net.ae','org.ae','gov.ae','ac.ae','co.ae','sch.ae','pro.ae','com.ai','org.ai','edu.ai','gov.ai','com.ar','net.ar','org.ar','gov.ar','mil.ar','edu.ar','int.ar','co.at','ac.at','or.at','gv.at','priv.at','com.au','gov.au','org.au','edu.au','id.au','oz.au','info.au','net.au','asn.au','csiro.au','telememo.au','conf.au','otc.au','id.au','com.az','net.az','org.az','com.bb','net.bb','org.bb','ac.be','belgie.be','dns.be','fgov.be','com.bh','gov.bh','net.bh','edu.bh','org.bh','com.bm','edu.bm','gov.bm','org.bm','net.bm','adm.br','adv.br','agr.br','am.br','arq.br','art.br','ato.br','bio.br','bmd.br','cim.br','cng.br','cnt.br','com.br','coop.br','ecn.br','edu.br','eng.br','esp.br','etc.br','eti.br','far.br','fm.br','fnd.br','fot.br','fst.br','g12.br','ggf.br','gov.br','imb.br','ind.br','inf.br','jor.br','lel.br','mat.br','med.br','mil.br','mus.br','net.br','nom.br','not.br','ntr.br','odo.br','org.br','ppg.br','pro.br','psc.br','psi.br','qsl.br','rec.br','slg.br','srv.br','tmp.br','trd.br','tur.br','tv.br','vet.br','zlg.br','com.bs','net.bs','org.bs','ab.ca','bc.ca','mb.ca','nb.ca','nf.ca','nl.ca','ns.ca','nt.ca','nu.ca','on.ca','pe.ca','qc.ca','sk.ca','yk.ca','gc.ca','co.ck','net.ck','org.ck','edu.ck','gov.ck','com.cn','edu.cn','gov.cn','net.cn','org.cn','ac.cn','ah.cn','bj.cn','cq.cn','gd.cn','gs.cn','gx.cn','gz.cn','hb.cn','he.cn','hi.cn','hk.cn','hl.cn','hn.cn','jl.cn','js.cn','ln.cn','mo.cn','nm.cn','nx.cn','qh.cn','sc.cn','sn.cn','sh.cn','sx.cn','tj.cn','tw.cn','xj.cn','xz.cn','yn.cn','zj.cn','arts.co','com.co','edu.co','firm.co','gov.co','info.co','int.co','nom.co','mil.co','org.co','rec.co','store.co','web.co','ac.cr','co.cr','ed.cr','fi.cr','go.cr','or.cr','sa.cr','com.cu','net.cu','org.cu','ac.cy','com.cy','gov.cy','net.cy','org.cy','co.dk','art.do','com.do','edu.do','gov.do','gob.do','org.do','mil.do','net.do','sld.do','web.do','com.dz','org.dz','net.dz','gov.dz','edu.dz','ass.dz','pol.dz','art.dz','com.ec','k12.ec','edu.ec','fin.ec','med.ec','gov.ec','mil.ec','org.ec','net.ec','com.ee','pri.ee','fie.ee','org.ee','med.ee','com.eg','edu.eg','eun.eg','gov.eg','net.eg','org.eg','sci.eg','com.er','net.er','org.er','edu.er','mil.er','gov.er','ind.er','com.es','org.es','gob.es','edu.es','nom.es','com.et','gov.et','org.et','edu.et','net.et','biz.et','name.et','info.et','ac.fj','com.fj','gov.fj','id.fj','org.fj','school.fj','com.fk','ac.fk','gov.fk','net.fk','nom.fk','org.fk','asso.fr','nom.fr','barreau.fr','com.fr','prd.fr','presse.fr','tm.fr','aeroport.fr','assedic.fr','avocat.fr','avoues.fr','cci.fr','chambagri.fr','chirurgiens-dentistes.fr','experts-comptables.fr','geometre-expert.fr','gouv.fr','greta.fr','huissier-justice.fr','medecin.fr','notaires.fr','pharmacien.fr','port.fr','veterinaire.fr','com.ge','edu.ge','gov.ge','mil.ge','net.ge','org.ge','pvt.ge','co.gg','org.gg','sch.gg','ac.gg','gov.gg','ltd.gg','ind.gg','net.gg','alderney.gg','guernsey.gg','sark.gg','com.gr','edu.gr','gov.gr','net.gr','org.gr','com.gt','edu.gt','net.gt','gob.gt','org.gt','mil.gt','ind.gt','com.gu','edu.gu','net.gu','org.gu','gov.gu','mil.gu','com.hk','net.hk','org.hk','idv.hk','gov.hk','edu.hk','co.hu','2000.hu','erotika.hu','jogasz.hu','sex.hu','video.hu','info.hu','agrar.hu','film.hu','konyvelo.hu','shop.hu','org.hu','bolt.hu','forum.hu','lakas.hu','suli.hu','priv.hu','casino.hu','games.hu','media.hu','szex.hu','sport.hu','city.hu','hotel.hu','news.hu','tozsde.hu','tm.hu','erotica.hu','ingatlan.hu','reklam.hu','utazas.hu','ac.id','co.id','go.id','mil.id','net.id','or.id','co.il','net.il','org.il','ac.il','gov.il','k12.il','muni.il','idf.il','co.im','net.im','org.im','ac.im','lkd.co.im','gov.im','nic.im','plc.co.im','co.in','net.in','ac.in','ernet.in','gov.in','nic.in','res.in','gen.in','firm.in','mil.in','org.in','ind.in','ac.ir','co.ir','gov.ir','id.ir','net.ir','org.ir','sch.ir','ac.je','co.je','net.je','org.je','gov.je','ind.je','jersey.je','ltd.je','sch.je','com.jo','org.jo','net.jo','gov.jo','edu.jo','mil.jo','ad.jp','ac.jp','co.jp','go.jp','or.jp','ne.jp','gr.jp','ed.jp','lg.jp','net.jp','org.jp','gov.jp','hokkaido.jp','aomori.jp','iwate.jp','miyagi.jp','akita.jp','yamagata.jp','fukushima.jp','ibaraki.jp','tochigi.jp','gunma.jp','saitama.jp','chiba.jp','tokyo.jp','kanagawa.jp','niigata.jp','toyama.jp','ishikawa.jp','fukui.jp','yamanashi.jp','nagano.jp','gifu.jp','shizuoka.jp','aichi.jp','mie.jp','shiga.jp','kyoto.jp','osaka.jp','hyogo.jp','nara.jp','wakayama.jp','tottori.jp','shimane.jp','okayama.jp','hiroshima.jp','yamaguchi.jp','tokushima.jp','kagawa.jp','ehime.jp','kochi.jp','fukuoka.jp','saga.jp','nagasaki.jp','kumamoto.jp','oita.jp','miyazaki.jp','kagoshima.jp','okinawa.jp','sapporo.jp','sendai.jp','yokohama.jp','kawasaki.jp','nagoya.jp','kobe.jp','kitakyushu.jp','utsunomiya.jp','kanazawa.jp','takamatsu.jp','matsuyama.jp','com.kh','net.kh','org.kh','per.kh','edu.kh','gov.kh','mil.kh','ac.kr','co.kr','go.kr','ne.kr','or.kr','pe.kr','re.kr','seoul.kr','kyonggi.kr','com.kw','net.kw','org.kw','edu.kw','gov.kw','com.la','net.la','org.la','com.lb','org.lb','net.lb','edu.lb','gov.lb','mil.lb','com.lc','edu.lc','gov.lc','net.lc','org.lc','com.lv','net.lv','org.lv','edu.lv','gov.lv','mil.lv','id.lv','asn.lv','conf.lv','com.ly','net.ly','org.ly','co.ma','net.ma','org.ma','press.ma','ac.ma','com.mk','com.mm','net.mm','org.mm','edu.mm','gov.mm','com.mn','org.mn','edu.mn','gov.mn','museum.mn','com.mo','net.mo','org.mo','edu.mo','gov.mo','com.mt','net.mt','org.mt','edu.mt','tm.mt','uu.mt','com.mx','net.mx','org.mx','gob.mx','edu.mx','com.my','org.my','gov.my','edu.my','net.my','com.na','org.na','net.na','alt.na','edu.na','cul.na','unam.na','telecom.na','com.nc','net.nc','org.nc','ac.ng','edu.ng','sch.ng','com.ng','gov.ng','org.ng','net.ng','gob.ni','com.ni','net.ni','edu.ni','nom.ni','org.ni','com.np','net.np','org.np','gov.np','edu.np','ac.nz','co.nz','cri.nz','gen.nz','geek.nz','govt.nz','iwi.nz','maori.nz','mil.nz','net.nz','org.nz','school.nz','com.om','co.om','edu.om','ac.om','gov.om','net.om','org.om','mod.om','museum.om','biz.om','pro.om','med.om','com.pa','net.pa','org.pa','edu.pa','ac.pa','gob.pa','sld.pa','edu.pe','gob.pe','nom.pe','mil.pe','org.pe','com.pe','net.pe','com.pg','net.pg','ac.pg','com.ph','net.ph','org.ph','mil.ph','ngo.ph','aid.pl','agro.pl','atm.pl','auto.pl','biz.pl','com.pl','edu.pl','gmina.pl','gsm.pl','info.pl','mail.pl','miasta.pl','media.pl','mil.pl','net.pl','nieruchomosci.pl','nom.pl','org.pl','pc.pl','powiat.pl','priv.pl','realestate.pl','rel.pl','sex.pl','shop.pl','sklep.pl','sos.pl','szkola.pl','targi.pl','tm.pl','tourism.pl','travel.pl','turystyka.pl','com.pk','net.pk','edu.pk','org.pk','fam.pk','biz.pk','web.pk','gov.pk','gob.pk','gok.pk','gon.pk','gop.pk','gos.pk','edu.ps','gov.ps','plo.ps','sec.ps','com.pt','edu.pt','gov.pt','int.pt','net.pt','nome.pt','org.pt','publ.pt','com.py','net.py','org.py','edu.py','com.qa','net.qa','org.qa','edu.qa','gov.qa','asso.re','com.re','nom.re','com.ro','org.ro','tm.ro','nt.ro','nom.ro','info.ro','rec.ro','arts.ro','firm.ro','store.ro','www.ro','com.ru','net.ru','org.ru','gov.ru','pp.ru','com.sa','edu.sa','sch.sa','med.sa','gov.sa','net.sa','org.sa','pub.sa','com.sb','net.sb','org.sb','edu.sb','gov.sb','com.sd','net.sd','org.sd','edu.sd','sch.sd','med.sd','gov.sd','tm.se','press.se','parti.se','brand.se','fh.se','fhsk.se','fhv.se','komforb.se','kommunalforbund.se','komvux.se','lanarb.se','lanbib.se','naturbruksgymn.se','sshn.se','org.se','pp.se','com.sg','net.sg','org.sg','edu.sg','gov.sg','per.sg','com.sh','net.sh','org.sh','edu.sh','gov.sh','mil.sh','gov.st','saotome.st','principe.st','consulado.st','embaixada.st','org.st','edu.st','net.st','com.st','store.st','mil.st','co.st','com.sv','org.sv','edu.sv','gob.sv','red.sv','com.sy','net.sy','org.sy','gov.sy','ac.th','co.th','go.th','net.th','or.th','com.tn','net.tn','org.tn','edunet.tn','gov.tn','ens.tn','fin.tn','nat.tn','ind.tn','info.tn','intl.tn','rnrt.tn','rnu.tn','rns.tn','tourism.tn','com.tr','net.tr','org.tr','edu.tr','gov.tr','mil.tr','bbs.tr','k12.tr','gen.tr','co.tt','com.tt','org.tt','net.tt','biz.tt','info.tt','pro.tt','int.tt','coop.tt','jobs.tt','mobi.tt','travel.tt','museum.tt','aero.tt','name.tt','gov.tt','edu.tt','nic.tt','us.tt','uk.tt','ca.tt','eu.tt','es.tt','fr.tt','it.tt','se.tt','dk.tt','be.tt','de.tt','at.tt','au.tt','co.tv','com.tw','net.tw','org.tw','edu.tw','idv.tw','gov.tw','com.ua','net.ua','org.ua','edu.ua','gov.ua','ac.ug','co.ug','or.ug','go.ug','co.uk','me.uk','org.uk','edu.uk','ltd.uk','plc.uk','net.uk','sch.uk','nic.uk','ac.uk','gov.uk','nhs.uk','police.uk','mod.uk','dni.us','fed.us','com.uy','edu.uy','net.uy','org.uy','gub.uy','mil.uy','com.ve','net.ve','org.ve','co.ve','edu.ve','gov.ve','mil.ve','arts.ve','bib.ve','firm.ve','info.ve','int.ve','nom.ve','rec.ve','store.ve','tec.ve','web.ve','co.vi','net.vi','org.vi','com.vn','biz.vn','edu.vn','gov.vn','net.vn','org.vn','int.vn','ac.vn','pro.vn','info.vn','health.vn','name.vn','com.vu','edu.vu','net.vu','org.vu','de.vu','ch.vu','fr.vu','com.ws','net.ws','org.ws','gov.ws','edu.ws','ac.yu','co.yu','edu.yu','org.yu','com.ye','net.ye','org.ye','gov.ye','edu.ye','mil.ye','ac.za','alt.za','bourse.za','city.za','co.za','edu.za','gov.za','law.za','mil.za','net.za','ngo.za','nom.za','org.za','school.za','tm.za','web.za','co.zw','ac.zw','org.zw','gov.zw','eu.org','au.com','br.com','cn.com','de.com','de.net','eu.com','gb.com','gb.net','hu.com','no.com','qc.com','ru.com','sa.com','se.com','uk.com','uk.net','us.com','uy.com','za.com','dk.org','tel.no','fax.nr','mob.nr','mobil.nr','mobile.nr','tel.nr','tlf.nr','e164.arpa'];
			for(var i=0; i<TLDList.length; i++) {
				if(URI==TLDList[i]) {
					URI=HostName[HostName.length-3]+'.'+URI;
					break;
				}
			}
		}

		return URI;

	}

	function gp2_genpass(Passwd,Domain,LenL,HashL,SaltL,DisableTLDL) {

		Passwd=(Passwd)?unescape(Passwd):0;
		Salt=(SaltL)?unescape(SaltL):'';
		Len=LenL;
		Hash=HashL;
		DisableTLD=DisableTLDL;

		var CurrentPosition=gp2_get_scroll_position();

		if(Target.getElementById('gp2_pass_box')) {
			Target.getElementById('gp2_pass_box').style.right=(0-CurrentPosition[0])+'px';
			Target.getElementById('gp2_pass_box').style.top=CurrentPosition[1]+'px';
			alert(Snippets[0]);
			return false;
		}

		var ScrollX=(ScrollPosition)?CurrentPosition[0]-ScrollPosition[0]:CurrentPosition[0];
		var ScrollY=(ScrollPosition)?CurrentPosition[1]-ScrollPosition[1]:CurrentPosition[1];
		var ScreenSize=gp2_get_window_size();
		var PasswdFieldRelocate=(ScrollPosition)?false:true;
		var PasswdFieldBlocked=false,RunAgain=false;HashVerified=false;
		PasswdFields=[];

		for(var i=0; i<Frames.length; i++) {

			for(var j=0; j<Frames[i].forms.length; j++) {

				for(var k=0; k<Frames[i].forms[j].elements.length; k++) {

					if(Frames[i].forms[j].elements[k].type=='password') {

						var PasswdField=Frames[i].forms[j].elements[k];
						var Visible=(PasswdField.style.display.toLowerCase()=='none'||PasswdField.style.visibility.toLowerCase()=='hidden')?false:true;

						if(Visible) {
							var PasswdFieldParent=PasswdField.parentNode;
							while(Visible&&PasswdFieldParent&&PasswdFieldParent.nodeName.toLowerCase()!='html'&&PasswdFieldParent.nodeName.toLowerCase()!='#document') {
								if(gp2_get_computed_style(PasswdFieldParent,'display').toLowerCase()=='none'||gp2_get_computed_style(PasswdFieldParent,'visibility').toLowerCase()=='hidden') {
									Visible=false;
								} else {
									PasswdFieldParent=PasswdFieldParent.parentNode;
								}
							}
						}

						if(Visible) {

							var PasswdFieldType=0;
							var PasswdFieldPosition=(PasswdFieldBlocked)?false:gp2_get_object_position(PasswdField);

							if(PasswdField.value!='') {
								if(!(PrevPasswd)&&gp2_get_computed_style(PasswdField,'background-image').replace(/\\/,'')=='url('+FieldPopData+')') {
									if(RunAgain||confirm(Snippets[1])) {
										RunAgain=true;
									} else {
										return false;
									}
									PasswdFieldType=2;
								} else if(PrevPasswdPop&&PrevPasswdPop==PasswdField.value) {
									PasswdFieldType=1;
								} else if(Passwd&&Passwd===PasswdField.value) {
									PasswdFieldType=1;
								} else if(Passwd) {
									PasswdFieldType=2;
								} else if(Hash&&Hash==gp2_generate_hash(PasswdField.value)) {
									HashVerified=true;
									Passwd=PasswdField.value;
									PasswdFieldType=1;
								} else if(Hash) {
									PasswdFieldType=2;
								} else {
									Passwd=PasswdField.value;
									PasswdFieldType=1;
								}
							}

							PasswdFields.push([PasswdField,PasswdFieldType]);
							PasswdField.style.background=FieldFoundStyle;
							PasswdFieldBlocked=(PasswdFieldRelocate&&(PasswdFieldBlocked||(ScreenSize[0]-PasswdFieldPosition[0]+ScrollX-150<225&&ScrollY<PasswdFieldPosition[1]+50)))?true:false;

							gp2_detach_method(PasswdField,'keydown',gp2_react);
							gp2_detach_method(PasswdField,'change',gp2_react);
							gp2_detach_method(PasswdField,'dblclick',gp2_populate);
							gp2_detach_method(PasswdField,'dblclick',gp2_use_as_master);

						}
					}
				}
			}
		}

		var TitleBar=
			gp2_make(
				'div',
				[],
				[['margin','0'],['padding','7px 5px 5px 7px'],['width','auto'],['background','#333'],['color','#fff'],FontStyle,['fontWeight','bold'],['cursor','move']],
				[['mousedown',gp2_drag_start]],
				[
					Target.createTextNode('SuperGenPass 2.01'+String.fromCharCode(160)+' '+String.fromCharCode(160)+' '),
					gp2_make(
						'a',
						[['href','http://www.supergenpass.com/']],
						FontStyleToolbarLink,
						[],
						[Target.createTextNode(Snippets[14])]
					),
					Target.createTextNode(String.fromCharCode(160)+' '),
					gp2_make(
						'a',
						[['href','#']],
						FontStyleToolbarLink,
						[['click',gp2_close]],
						[Target.createTextNode(Snippets[15])]
					)
				]
			);

		if(Passwd) {

			Domain=(Domain)?gp2_process_uri(Domain,DisableTLD):gp2_process_uri(Target.location.href,DisableTLD);
			Len=gp2_validate_length(Len);
			GenPasswd=gp2_generate_passwd(Passwd+Salt+':'+Domain,Len);

			if(Hash) {
				HashVerified=(HashVerified||Hash==gp2_generate_hash(Passwd))?1:0;
				HashMessage=(HashVerified)?Snippets[5]:Snippets[6];
				HashMessage=gp2_make('span',[],[['color',HashStyle[HashVerified][0]],['background',HashStyle[HashVerified][1]],FontStyleSmall,['fontWeight','bold']],[],[Target.createTextNode(String.fromCharCode(160)+HashMessage+String.fromCharCode(160))]);
			} else {
				HashVerified=true;
				HashMessage=Target.createTextNode('');
			}

			Populated=0;
			Unpopulated=0;

			for(var i=0;i<PasswdFields.length;i++) {

				var PasswdTarget=PasswdFields[i][0];

				if(PasswdFields[i][1]==2||(PasswdFields[i][1]==0&&PrevPasswd)||!(HashVerified)) {
					gp2_attach_method(PasswdTarget,'dblclick',gp2_populate);
					Unpopulated++;
				} else {
					PasswdTarget.style.background=FieldPopStyle;
					PasswdTarget.value=GenPasswd;
					PasswdTarget.focus();
					gp2_attach_method(PasswdTarget,'keydown',gp2_react);
					gp2_attach_method(PasswdTarget,'change',gp2_react);
					Populated++;
				}

			}
			var GeneratedStyle=(Populated)?FieldPopStyle:'#fff';
			var PopulateTextStyle=(Unpopulated)?'block':'none';
			var ChangeAlert=(PrevPasswd&&PrevPasswd!=GenPasswd)?true:false;

			var PassMask = '************************';
			DisableTLD=(DisableTLD)?'checked':'value';
			PrevPasswdPop=(Populated)?GenPasswd:PrevPasswd;
			PrevPasswd=GenPasswd;

			var Content =
				[
					TitleBar,
					gp2_make(
						'div',
						[],
						[['margin','0'],['padding','8px 5px 14px 8px'],['width','auto'],['color','#000'],FontStyle],
						[],
						[
							gp2_make(
								'div',
								[],
								[FontStyle,['fontWeight','bold']],
								[],
								[Target.createTextNode(Snippets[3])]
							),
							gp2_make(
								'div',
								[['id','gp2_populate_text']],
								[['display',PopulateTextStyle],['margin','3px 0 0 0'],['color','#666'],FontStyleSmall],
								[],
								[Target.createTextNode(Snippets[13])]
							),
							gp2_make(
								'div',
								[['id','gp2_offer_pass']],
								RevealStyle.concat([['background',GeneratedStyle],['borderColor','#666']]),
								[],
								[Target.createTextNode(PassMask.substring(0,Len))]
							),
							gp2_make(
								'div',
								[['id','gp2_show_pass']],
								RevealStyle.concat([['display','none'],['background',GeneratedStyle],['borderColor','#666']]),
								[],
								[Target.createTextNode(GenPasswd)]
							),
							gp2_make(
								'a',
								[['href','#']],
								FontStyleLink,
								[['click',gp2_reveal_pass]],
								[Target.createTextNode(Snippets[16])]
							)
						]
					),
					gp2_make(
						'div',
						[],
						[['margin','0'],['padding','0 5px 10px 8px'],['width','auto'],['color','#000'],FontStyle],
						[],
						[
							gp2_make(
								'div',
								[],
								[FontStyle,['fontWeight','bold']],
								[],
								[Target.createTextNode(Snippets[4])]
							),
							gp2_make(
								'div',
								[['id','gp2_offer_master_pass']],
								RevealStyle.concat([['background','#fff'],['borderColor','#666']]),
								[],
								[Target.createTextNode(PassMask.substring(0,Passwd.length))]
							),
							gp2_make(
								'div',
								[['id','gp2_show_master_pass']],
								RevealStyle.concat([['display','none'],['background','#fff'],['borderColor','#666']]),
								[],
								[Target.createTextNode(Passwd)]
							),
							gp2_make(
								'a',
								[['href','#']],
								FontStyleLink,
								[['click',gp2_reveal_master_pass]],
								[Target.createTextNode(Snippets[16])]
							),
							Target.createTextNode(String.fromCharCode(160)+' '),
							HashMessage
						]
					),
					gp2_make(
						'div',
						[],
						[['margin','0'],['padding','8px'],['width','auto'],['color','#333'],['background','#eee'],FontStyle,['fontWeight','bold']],
						[],
						[
							Target.createTextNode(Snippets[7]+' '+String.fromCharCode(160)),
							gp2_make(
								'a',
								[['href','#'],['id','gp2_expand_link']],
								FontStyleLink,
								[['click',gp2_expand]],
								[Target.createTextNode(Snippets[16])]
							),
							gp2_make(
								'a',
								[['href','#'],['id','gp2_contract_link']],
								FontStyleLink.concat([['display','none']]),
								[['click',gp2_contract]],
								[Target.createTextNode(Snippets[16])]
							)
						]
					),
					gp2_make(
						'div',
						[['id','gp2_advanced_box']],
						[['margin','0'],['padding','0 5px 5px 8px'],['width','auto'],['color','#000'],FontStyle,['display','none'],['background','#eee']],
						[],
						[
							gp2_make(
								'form',
								[['name','gp2_advanced'],['method','post'],['action','http://localhost:9/'],['autocomplete','off']],
								[['margin','0'],['padding','0']],
								[['submit',gp2_retry_advanced]],
								[
									Target.createTextNode(Snippets[8]),
									Target.createElement('br'),
									gp2_make(
										'input',
										[['type','password'],['id','gp2_advanced_master_passwd'],['value',Passwd]],
										[['margin','3px 0 10px 0'],['width','150px'],FontStyleInput],
										[['keypress',gp2_retry_advanced_listen]],
										[]
									),
									Target.createElement('br'),
									Target.createTextNode(Snippets[9]),
									Target.createElement('br'),
									gp2_make(
										'input',
										[['type','text'],['id','gp2_advanced_domain'],['size','15'],['value',Domain]],
										[['margin','3px 0 2px 0'],['width','150px'],FontStyleInput],
										[['keypress',gp2_retry_advanced_listen]],
										[]
									),
									Target.createElement('br'),
									gp2_make(
										'input',
										[['type','checkbox'],['id','gp2_advanced_domain_isolator'],[DisableTLD,'checked']],
										[['margin','5px 0 10px 0'],['padding','0']],
										[['keypress',gp2_retry_advanced_listen]],
										[]
									),
									gp2_make(
										'label',
										[['for','gp2_advanced_domain_isolation']],
										[['margin','0'],['padding','0'],FontStyleSmall],
										[],
										[Target.createTextNode(' '+Snippets[10])]
									),
									Target.createElement('br'),
									Target.createTextNode(Snippets[11]),
									Target.createElement('br'),
									gp2_make(
										'input',
										[['type','text'],['id','gp2_advanced_len'],['size','4'],['value',Len]],
										[['margin','3px 0 10px 0'],['width','40px'],FontStyleInput],
										[['keypress',gp2_retry_advanced_listen]],
										[]
									),
									Target.createElement('br'),
									gp2_make(
										'input',
										[['type','button'],['value',Snippets[12]]],
										[['margin','0 0 5px 0']],
										[['click',gp2_retry_advanced]],
										[]
									)
								]
							)
						]
					)
				];

		} else {

			for(var i=0; i<PasswdFields.length; i++) {
				if(PasswdFields[i][1]==2) {
					gp2_attach_method(PasswdFields[i][0],'dblclick',gp2_use_as_master);
				}
			}

			var Content = 
				[
					TitleBar,
					gp2_make(
						'div',
						[],
						[['margin','0'],['padding','8px'],['width','auto'],['color','#000'],FontStyle],
						[],
						[
							gp2_make(
								'form',
								[['name','gp2_retry'],['method','post'],['action','http://localhost:9/'],['autocomplete','off']],
								[['margin','0'],['padding','0']],
								[['submit',gp2_retry_passwd]],
								[
									Target.createTextNode(Snippets[2]),
									Target.createElement('br'),
									gp2_make(
										'input',
										[['type','password'],['id','gp2_master'],['size','15'],['value','']],
										[['margin','8px 5px 0 0'],['width','125px'],FontStyleInput],
										[['keypress',gp2_retry_passwd_listen]],
										[]
									),
									gp2_make(
										'input',
										[['type','button'],['value',Snippets[12]]],
										[],
										[['click',gp2_retry_passwd]],
										[]
									)
								]
							)
						]
					)
				];

			gp2_attach_method(TargetWindow,'unload',gp2_close);

		}

		BoxPositionX=(PasswdFieldBlocked||BoxPosition[0]=='left')?['left','0px']:['right',(BoxPosition[0]-ScrollX)+'px'];

		var ParentDiv =
			gp2_make(
				'div',
				[['id','gp2_pass_box']],
				[['zIndex','99999'],['position','absolute'],['top',(BoxPosition[1]+ScrollY)+'px'],BoxPositionX,['width',Snippets[17]],['margin','0'],['padding','0'],['background','#fff'],['borderStyle','solid'],['borderColor','#fff'],['borderWidth','8px'],['opacity','0.95'],['filter','alpha(opacity=95)']],
				[],
				[
					gp2_make(
						'div',
						[],
						[['margin','0'],['padding','0'],['borderStyle','solid'],['borderColor','#ccc'],['borderWidth','1px'],['textAlign','left']],
						[],
						Content
					)
				]
			);

		Target.body.appendChild(ParentDiv);

		if(Target.getElementById('gp2_master')) {
			Target.getElementById('gp2_master').focus()
		};

		if(Target.getElementById('gp2_offer_pass')&&ChangeAlert) {
			FlashTarget=Target.getElementById('gp2_offer_pass');
			FlashTarget.style.color='#fff';
			setTimeout("FlashTarget.style.color='#000'",100);
			setTimeout("FlashTarget.style.color='#fff'",150);
			setTimeout("FlashTarget.style.color='#000'",200);
		}

	}

	function gp2_close(e) {
		if(Target.getElementById('gp2_pass_box')) {
			ScrollPosition=gp2_get_scroll_position();
			BoxPosition=[0,parseInt(Target.getElementById('gp2_pass_box').style.top)];
			BoxPosition[0]=(Target.getElementById('gp2_pass_box').style.right)?parseInt(Target.getElementById('gp2_pass_box').style.right):'left';
			Target.body.removeChild(Target.getElementById('gp2_pass_box'));
		}
		if(typeof(PasswdFields)!='undefined'){
			for(var i=0;i<(PasswdFields.length);i++) {
				gp2_detach_method(PasswdFields[i][0],'dblclick',gp2_populate);
				gp2_detach_method(PasswdFields[i][0],'dblclick',gp2_use_as_master);
				if(gp2_get_computed_style(PasswdFields[i][0],'background-image').replace(/\\/,'')=='url('+FieldFoundData+')') {
					PasswdFields[i][0].style.background='#fff';
				}
					
			}
		}
		delete PasswdFields;
		delete GenPasswd;
		delete PrevPasswd;
		delete PrevPasswdPop;
		e.preventDefault();
		return false;
	}

	function gp2_expand(e) {
		Target.getElementById('gp2_expand_link').style.display='none';
		Target.getElementById('gp2_contract_link').style.display='inline';
		Target.getElementById('gp2_advanced_box').style.display='block';
		e.preventDefault();
		return false;
	}

	function gp2_contract(e) {
		Target.getElementById('gp2_expand_link').style.display='inline';
		Target.getElementById('gp2_contract_link').style.display='none';
		Target.getElementById('gp2_advanced_box').style.display='none';
		e.preventDefault();
		return false;
	}

	function gp2_retry_passwd(e) {
		var Passwd=Target.getElementById('gp2_master').value;
		gp2_close(e);
		gp2_genpass(escape(Passwd),0,Len,Hash,Salt,DisableTLD);
		return false;
	}

	function gp2_retry_passwd_listen(e) {
		if(e.keyCode==13||e.keyCode==3) {
			gp2_retry_passwd(e);
		}
		e.stopPropagation();
	}

	function gp2_retry_advanced(e) {
		var Passwd=Target.getElementById('gp2_advanced_master_passwd').value;
		var Domain=Target.getElementById('gp2_advanced_domain').value;
		var DisableTLD=(Target.getElementById('gp2_advanced_domain_isolator').checked)?true:false;
		var Len=Target.getElementById('gp2_advanced_len').value;
		gp2_close(e);
		gp2_genpass(escape(Passwd),Domain,Len,Hash,Salt,DisableTLD);
		return false;
	}

	function gp2_retry_advanced_listen(e) {
		if(e.keyCode==13||e.keyCode==3) {
			gp2_retry_advanced(e);
		}
		e.stopPropagation();
	}

	function gp2_reveal_pass(e) {
		if(Target.getElementById('gp2_offer_pass').style.display=='none') {
			Target.getElementById('gp2_show_pass').style.display='none';
			Target.getElementById('gp2_offer_pass').style.display='block';
		} else {
			Target.getElementById('gp2_offer_pass').style.display='none';
			Target.getElementById('gp2_show_pass').style.display='block';
		}
		e.preventDefault();
		return false;
	}

	function gp2_reveal_master_pass(e) {
		if(Target.getElementById('gp2_offer_master_pass').style.display=='none') {
			Target.getElementById('gp2_show_master_pass').style.display='none';
			Target.getElementById('gp2_offer_master_pass').style.display='block';
		} else {
			Target.getElementById('gp2_offer_master_pass').style.display='none';
			Target.getElementById('gp2_show_master_pass').style.display='block';
		}
		e.preventDefault();
		return false;
	}

	function gp2_populate(e) {
		if(GenPasswd&&Target.getElementById('gp2_pass_box')) {
			Populated++;
			Unpopulated--;
			this.value=GenPasswd;
			this.style.background=FieldPopStyle;
			gp2_attach_method(this,'keydown',gp2_react);
			gp2_attach_method(this,'change',gp2_react);
			gp2_detach_method(this,'dblclick',gp2_populate);
			Target.getElementById('gp2_show_pass').style.background=FieldPopStyle;
			Target.getElementById('gp2_offer_pass').style.background=FieldPopStyle;
			if(Unpopulated===0&&Target.getElementById('gp2_populate_text')) {
				Target.getElementById('gp2_populate_text').style.display='none';
			}
		}
		e.preventDefault();
		return false;
	}

	function gp2_use_as_master(e) {
		if(Target.getElementById('gp2_pass_box')) {
			gp2_detach_method(this,'dblclick',gp2_use_as_master);
			gp2_close(e);
			gp2_genpass(this.value,0,Len,Hash,Salt,DisableTLD);
		}
		e.preventDefault();
		return false;
	}

	function gp2_react(e) {
		if(e.keyCode==8||e.keyCode==32||(e.keyCode>45&&e.keyCode<91)||(e.keyCode>95&&e.keyCode<112)||(e.keyCode>185&&e.keyCode<223)) {
			gp2_detach_method(this,'keydown',gp2_react);
			gp2_detach_method(this,'change',gp2_react);
			Populated--;
			Unpopulated++;
			if(GenPasswd&&Target.getElementById('gp2_pass_box')) {
				if(Populated<1) {
					Target.getElementById('gp2_show_pass').style.background='#fff';
					Target.getElementById('gp2_offer_pass').style.background='#fff';
				}
				if(Unpopulated&&Target.getElementById('gp2_populate_text')) {
					Target.getElementById('gp2_populate_text').style.display='block';
				}
				gp2_attach_method(this,'dblclick',gp2_populate);
				this.style.background=FieldFoundStyle;
			} else {
				this.style.background='#fff';
			}
		}
		return true;
	}

	function gp2_make(Name,Attributes,Styles,Methods,Children) {
		var Element=Target.createElement(Name);
		for(var i=0;i<Attributes.length;i++) {Element.setAttribute(Attributes[i][0],Attributes[i][1]);}
		for(var i=0;i<Styles.length;i++) {eval('Element.style.'+Styles[i][0]+"='"+Styles[i][1]+"'");}
		for(var i=0;i<Methods.length;i++) {gp2_attach_method(Element,Methods[i][0],Methods[i][1]);}
		for(var i=0;i<Children.length;i++) {Element.appendChild(Children[i]);}
		return Element;
	}

	function gp2_attach_method(obj,type,fn) {
		var handler=
			function(e) {
				e=e||window.event;
				if(!e.stopPropagation) {
					e.stopPropagation=function(){this.cancelBubble=true;}
				}
				if(!e.preventDefault) {
					e.preventDefault=function(){this.returnValue=false;}
				}
				if(!e.stopEvent) {
					e.stopEvent=function(){this.stopPropagation();this.preventDefault();}
				}
				return fn.apply(obj,[e]);
		    };
		handler.obj=obj;
		handler.type=type;
		handler.fn=fn;
		gp2_detach_method.handlers.push(handler);
		if(window.addEventListener) {
			obj.addEventListener(type,handler,false);
		} else if(window.attachEvent) {
			obj.attachEvent('on'+type,handler);
		}
		return handler;
	}

	function gp2_detach_method(obj,type,fn) {
		for(var i=0;i<gp2_detach_method.handlers.length;i++) {
			var h=gp2_detach_method.handlers[i];
			if(h.obj==obj&&h.type==type&&h.fn==fn) {
				if(obj.removeEventListener) {
					obj.removeEventListener(h.type,h,false);
				}
				if(obj.detachEvent) {
					obj.detachEvent('on'+h.type,h);
				}
				gp2_detach_method.handlers.splice(i,1);
				return h;
			}
		}
	}

	gp2_detach_method.handlers=[];

	function gp2_drag_start(e) {
		DragBox=new Object();
		var Cursor=gp2_get_cursor(e);
		DragBox.Node=Target.getElementById('gp2_pass_box');
		if(!(DragBox.Node.style.right)) {
			DragBox.Node.style.left='auto';
			DragBox.Node.style.right=gp2_get_computed_style(DragBox.Node,'right');
		}
		DragBox.StartX=parseInt(DragBox.Node.style.right,10);
		DragBox.StartY=parseInt(DragBox.Node.style.top,10);
		DragBox.CursorX=Cursor[0];DragBox.CursorY=Cursor[1];
		gp2_attach_method(Target,'mousemove',gp2_drag_go);
		gp2_attach_method(Target,'mouseup',gp2_drag_stop);
		e.preventDefault();
		e.stopPropagation();
		return false;
	}

	function gp2_drag_go(e) {
		var CursorMove=gp2_get_cursor(e);
		DragBox.Node.style.right=(DragBox.StartX+(DragBox.CursorX-CursorMove[0]))+'px';
		DragBox.Node.style.top=(DragBox.StartY+(CursorMove[1]-DragBox.CursorY))+'px';
		e.preventDefault();
		return false;
	}

	function gp2_drag_stop(e) {
		gp2_detach_method(Target,'mousemove',gp2_drag_go);
		gp2_detach_method(Target,'mouseup',gp2_drag_stop);
		e.preventDefault();
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
		return [x,y];
	}

	function gp2_get_window_size() {
		var x=0;
		var y=0;
		if(typeof(TargetWindow.innerWidth!='undefined')) {
			x=TargetWindow.innerWidth;
			y=TargetWindow.innerHeight;
		} else if(typeof(Target.documentElement!='undefined')&&typeof(Target.documentElement.clientWidth!='undefined')&&Target.documentElement.clientWidth!=0) {
			x=Target.documentElement.clientWidth;
			y=Target.documentElement.clientHeight;
		} else {
			x=Target.getElementsByTagName('body')[0].clientWidth;
			y=Target.getElementsByTagName('body')[0].clientHeight;
		}
		return [x,y];
	}

	function gp2_get_scroll_position() {
		var x=0;
		var y=0;
		if(typeof(TargetWindow.pageXOffset)=='number'||typeof(TargetWindow.pageYOffset)=='number') {
			x=TargetWindow.pageXOffset;
			y=TargetWindow.pageYOffset;
		} else if(Target.body&&(Target.body.scrollLeft||Target.body.scrollTop)) {
			x=Target.body.scrollLeft;
			y=Target.body.scrollTop;
		} else if(Target.documentElement&&(Target.documentElement.scrollLeft||Target.documentElement.scrollTop)) {
			x=Target.documentElement.scrollLeft;
			y=Target.documentElement.scrollTop;
		}
		return [x,y];
	}

	function gp2_get_object_position(obj) {
		var x=0;
		var y=0;
		if(obj.offsetParent) {
			while(1) {
				x+=obj.offsetLeft;
				y+=obj.offsetTop;
				if(!obj.offsetParent) {
					break;
				}
				obj=obj.offsetParent;
			}
		} else if(obj.x&&obj.y) {
			x+=obj.x;
			y+=obj.y;
		}
		return [x,y];
	}

	function gp2_get_computed_style(obj,style) {
		var styleVal='';
		if(document.defaultView&&document.defaultView.getComputedStyle) {
			styleVal=document.defaultView.getComputedStyle(obj,'').getPropertyValue(style);
		} else if(obj.currentStyle) {
			style=style.replace(/\-(\w)/g,function(strMatch,p1){return p1.toUpperCase();});
			styleVal=obj.currentStyle[style];
		}
		return styleVal;
	}

	var DragBox;
	var Target=(document)?document:false;
	var TargetWindow=(window)?window:false;
	var FrameCount=window.frames.length-document.getElementsByTagName('iframe').length;
	var Frames=(FrameCount)?[]:[Target];
	var Debug=[];

	var MaxArea=0;
	for(var i=0; i<window.frames.length; i++) {
		try {
			var FrameTest=window.frames[i].src;
			if(FrameCount) {
				var Area=(window.frames[i].innerHeight)?window.frames[i].innerHeight*window.frames[i].innerWidth:window.frames[i].document.body.clientHeight*window.frames[i].document.body.clientWidth;
				if(Area>MaxArea) {
					Target=window.frames[i].document;
					TargetWindow=window.frames[i];
					MaxArea=Area;
				}
			}
			Frames.push(window.frames[i].document);
		} catch(err) {
			Debug.push('EXT_FRAME');
		}
	}

	var FontStyle=['font','13px Trebuchet MS, Helvetica,sans-serif'];
	var FontStyleSmall=['font','11px Trebuchet MS, Helvetica,sans-serif'];
	var FontStyleInput=['font','14px monospace'];
	var HashStyle=[['#f00','#fcc'],['#060','#cfc']];

	var FontStyleLink=[FontStyleSmall,['color','#666'],['fontWeight','normal'],['textDecoration','underline'],['borderWidth','0'],['cursor','pointer']];
	var FontStyleToolbarLink=[FontStyleSmall,['color','#ccc'],['fontWeight','normal'],['textDecoration','underline'],['borderWidth','0'],['cursor','pointer']];
	var RevealStyle=[['margin','8px 5px 2px 0'],['padding','5px 5px 3px 5px'],['width','auto'],['borderStyle','solid'],['borderWidth','1px'],FontStyleInput];
	var MessageStyle=[['margin','0 0 8px 0'],['padding','0'],FontStyle];

	var FieldPopData='data:image/gif;base64,R0lGODlhDQAOAJEAAAjOCPn%2B%2Bd343f%2F%2F%2FyH5BAEAAAMALAAAAAANAA4AAAIlhI83CRKhFoKAjouE0eBi81CdJ3ERWSWkx6ws4r5GLNOvzeJeAQA7';
	var FieldFoundData='data:image/gif;base64,R0lGODlhDQAOAIABAMzMzAAAACH5BAEAAAEALAAAAAANAA4AAAIchI8XyRDb1IvmzWgvyxrxXn2QJHqidlphurBWAQA7';

	var TestImage=new Image;
	TestImage.src=FieldPopData;
	var FieldFoundStyle=(TestImage.complete)?'#fff url('+FieldFoundData+') no-repeat top right':'#fff url(http://files.supergenpass.com/img/sgp0.gif) no-repeat top right';
	var FieldPopStyle=(TestImage.complete)?'#fff url('+FieldPopData+') no-repeat top right':'#fff url(http://files.supergenpass.com/img/sgp1.gif) no-repeat top right';
	delete TestImage;

	var Len=false,Hash=false,Salt=false,DisableTLD=false,GenPasswd=false,PrevPasswd=false,PrevPasswdPop=false,Populated=false,Unpopulated=false,ScrollPosition=false;
	var BoxPosition=[0,0];

	var Snippets=false;
	var SnippetsDB=
		[
			[
				'en',
				[
					'You already have a SuperGenPass window open.',
					'Are you sure you want to run SuperGenPass again?',
					'Enter your master password.',
					'Your generated password',
					'Your master password',
					'VERIFIED',
					'INVALID',
					'Regenerate password',
					'Master password',
					'Domain / URL',
					'Disable subdomain removal',
					'Password length',
					'Submit',
					'Double-click to populate',
					'help',
					'close',
					'show/hide',
					'220px'
				]
			],
			[
				'es',
				[
					'Ya tiene abierta una ventana de SuperGenPass.',
					'¿Está seguro de querer ejecutar SuperGenPass de nuevo?',
					'Introduzca su contraseña maestra.',
					'Su contraseña generada',
					'Su contraseña maestra',
					'VERIFICADA',
					'INVÁLIDA',
					'Regenerar contraseña',
					'Contraseña maestra',
					'Dominio / URL',
					'Deshabilitar eliminación de subdominio',
					'Longitud de contraseña',
					'Enviar',
					'Doble click para rellenar',
					'ayuda',
					'cerrar',
					'mostrar/ocultar',
					'240px'
				]
			],
			[
				'fr',
				[
					'Vous avez déjà une fenêtre SuperGenPass ouverte',
					'Êtes-vous certain de vouloir exécuter SuperGenPass encore une fois?',
					'Tapez votre mot de passé principal',
					'Votre mot de passe généré',
					'Votre mot de passe principal',
					'VÉRIFIÉ',
					'INVALIDE',
					'Régénéré le mot de passe',
					'Mot de passe principal',
					'Domaine (en anglais : URL)',
					'Désactivé le retrait du sous-domaine',
					'Longueur de mot de passe',
					'Soumettre',
					'Cliquez deux fois pour remplir',
					'Aide',
					'Fermez',
					'Montrez/Cachez',
					'240px'
				]
			],
			[
				'de',
				[
					'Sie haben schon ein SuperGenPass Fenster offen.',
					'Wollen Sie SuperGenPass wirklich nochmal ausführen?',
					'Geben Sie ihr Master Passwort ein.',
					'Ihr generiertes Passwort',
					'Ihr Master Passwort',
					'BESTÄTIGT',
					'FALSCH',
					'Passwort nochmal erzeugen',
					'Master Passwort',
					'Domain / URL',
					'Deaktiviere Subdomain Entfernung',
					'Passwort Länge',
					'Abschicken',
					'Doppelklick zum übernehmen',
					'Hilfe',
					'Schliessen',
					'Zeigen/Verstecken',
					'240px'
				]
			],
			[
				'pt-BR',
				[
					'Você já tem uma janela aberta do SuperGenPass.',
					'Tem certeza que quer executar o SuperGenPass novamente?',
					'Digite sua senha-mestra.',
					'Senha gerada',
					'Sua senha-mestra',
					'CONFIRMADA',
					'INCORRETA',
					'Gerar novamente',
					'Senha-mestra',
					'Domínio / URL',
					'Desabilitar a retirada do subdomínio',
					'Tamanho da senha',
					'Gerar',
					'Faça duplo-clique para preencher o campo',
					'Ajuda',
					'Fechar',
					'Mostrar/Esconder',
					'240px'
				]
			],
			[
				'zh-HK',
				[
					'你已經開啟 SuperGenPass 視窗。',
					'確定想重新執行 SuperGenPass 嗎？',
					'輸入你的主密碼',
					'你的已產生密碼',
					'你的主密碼',
					'驗證成功',
					'驗證無效',
					'重新產生密碼',
					'主密碼',
					'域名 / URL',
					'禁止移除子域名',
					'密碼長度',
					'提交',
					'用滑鼠雙擊替換',
					'說明',
					'關閉',
					'顯示/隱藏',
					'220px'
				]
			],
			[
				'hu',
				[
					'Már nyitva van egy SuperGenPass ablak.',
					'Biztosan újra el akarja indítani a SuperGenPass-t?',
					'Adja meg a mesterjelszót!',
					'Az elkészített jelszó',
					'Mesterjelszó',
					'ELLENŐRIZVE',
					'ÉRVÉNYTELEN',
					'A jelszó újragenerálása',
					'Mesterjelszó',
					'Tartomány / Internetcím',
					'Altartomány eltávolítás tiltása',
					'Jelszó hossza',
					'OK',
					'Kattintson duplán a beíráshoz',
					'súgó',
					'bezárás',
					'mutatás/elrejtés',
					'220px'
				]
			]
		];

	if(Target&&TargetWindow) {

		var Request=document.getElementById('fs_gp2').src.split('#');
		var Params=Request[1].split(',');
		var Lang=(Request[0].indexOf('?'))?Request[0].split('?')[1]:'en';

		for(var i=0;i<7;i++) {
			if(Params[i]==null||Params[i]==='0') {
				Params[i]=false;
			}
		}

		for(var i=0;i<SnippetsDB.length;i++) {
			if(Lang==SnippetsDB[i][0]) {
				Snippets=SnippetsDB[i][1];
				break;
			}
		}

		if(!(Snippets)) {
			Snippets=SnippetsDB[0][1];
		}

		gp2_genpass(Params[0],Params[1],Params[2],Params[3],Params[4],Params[5]);
		delete Request;
		delete Params;

	} else {
		window.location='http://www.supergenpass.com/mobile/';
	}

})();