$(document).ready(function() {

   // Default values:
   var Origin=false;
   var Source=false;

   // Selector cache:
   var $el={},Sel=['Title','Passwd','PasswdLabel','Domain','DomainLabel','Len','Generate','Output','Canvas','Options','Salt','SaltField','SaltCanvas','MethodField','MethodMD5','MethodSHA512'];
   $.each(Sel, function(i, val) { $el[val]=$('#'+val); });

   // Perform localization if requested.

   var Lang=location.search.substring(1);

   if(Lang) {

      var Localizations=
         [
            ['en',   ['Master password','Domain / URL','Generate']],
            ['es',   ['Contraseña maestra','Dominio / URL','Enviar']],
            ['fr',   ['Mot de passe principal','Domaine / URL','Soumettre']],
            ['de',   ['Master Passwort','Domain / URL','Abschicken']],
            ['pt-br',['Senha-mestra','Domínio / URL','Gerar']],
            ['zh-hk',['主密碼','域名 / URL','提交']],
            ['hu',   ['Mesterjelszó','Tartomány / Internetcím','OK']],
            ['ru',   ['Мастер-пароль','Домена / URL','Подтвердить']]
         ];

      for(var i=0;i<Localizations.length;i++) {
         if(Lang==Localizations[i][0]) {
            $el.Passwd.attr('placeholder',Localizations[i][1][0]);
            $el.Domain.attr('placeholder',Localizations[i][1][1]);
            $el.PasswdLabel.text(Localizations[i][1][0]);
            $el.DomainLabel.text(Localizations[i][1][1]);
            $el.Generate.text(Localizations[i][1][2]);
            break;
         }
      }

   }

   // Show title for mobile version.
   if(self==top) $el.Title.slideDown();

   // Show all advanced options if requested.
   $el.Options.on('click', function (event) {
      var toggle = $el.SaltField.is(':visible') && $el.MethodField.is(':visible');
      $('#SaltField, #MethodField').slideToggle(!toggle);
      event.preventDefault();
   });

   // Show salt field if requested.
   $el.SaltCanvas.on('click', function (event) {
      $el.SaltField.slideToggle(400, SendHeight);
      event.preventDefault();
   });

   // Show salt identicon if salt is present.
   $('#Salt, #MethodMD5, #MethodSHA512').on('keyup change', function (event) {
      Method=$('input:radio[name=Method]:checked').val();
      if($el.Salt.val()!=='') {
         $el.SaltCanvas.identicon5({hash:gp2_generate_hash($el.Salt.val()),size:16}).show();
      } else {
         $el.SaltCanvas.hide();
      }
   });

   // Retrieve configuration from local storage (jStorage) if available.
   $('input:radio[value='+$.jStorage.get('Method','md5')+']').prop('checked',true);
   $el.Len.val(gp2_validate_length($.jStorage.get('Len',10)));
   $el.Salt.val($.jStorage.get('Salt','')).trigger('change');

   // Show method field if value is SHA-512.
   $el.MethodField.toggle($el.MethodSHA512.prop('checked'));

   // Generate password.

   $el.Generate.on('click', function (event) {

      // Get input.
      var Passwd=$el.Passwd.val();
      var Salt=$el.Salt.val();
      var Domain=($el.Domain.val())?gp2_process_uri($el.Domain.val(),false):'localhost';
      var Len=gp2_validate_length($el.Len.val());

      // Update form with validated input.
      $el.Domain.val(Domain).trigger('change');
      $el.Len.val(Len).trigger('change');

      if(Passwd) {

         $el.Canvas.identicon5({hash:gp2_generate_hash(Passwd+Salt),size:16}).show();
         Passwd=gp2_generate_passwd(Passwd+Salt+':'+Domain,Len);
         $el.Output.text(Passwd);

         if(Source&&Origin) {
            // Send generated password to bookmarklet.
            Source.postMessage('{"result":"'+Passwd+'"}',Origin);
         } else {
            // Save configuration to local storage (jStorage) when not a bookmarklet.
            $.jStorage.set('Salt',Salt);
            $.jStorage.set('Len',Len);
            $.jStorage.set('Method',Method);
         }

      } else {
         $el.Passwd.addClass('Missing');
         $el.PasswdLabel.addClass('Missing');
      }

      event.preventDefault();

   });

   // Adjust password length.

   $('#Up, #Down').on('click', function (event) {
      Len=gp2_validate_length(gp2_validate_length($el.Len.val())+(($(this).attr('id')=='Up')?1:-1));
      $el.Len.val(Len).trigger('change');
      event.preventDefault();
   });

   // Clear generated password when input changes.

   $('input').on('keydown change', function (event) {
      var key=event.which;
      if(event.type=='change'||key==8||key==32||(key>45&&key<91)||(key>95&&key<112)||(key>185&&key<223)) {
         $el.Output.text(String.fromCharCode(160));
         $el.Passwd.removeClass('Missing');
         $el.PasswdLabel.removeClass('Missing');
         $el.Canvas.hide();
      } else if(key==13) {
         $(this).blur();
         $el.Generate.trigger('click');
         event.preventDefault();
      }
   });

   // Provide fake input placeholders if browser does not support them.

   if(!('placeholder' in document.createElement('input'))) {
      $('#Passwd, #Domain, #Salt').on('keyup change', function (event) { 
         $('label[for='+$(this).attr('id')+']').toggle($(this).val()==='');
      }).trigger('change');
   }

   // Attach postMessage listener for bookmarklet.

   $(window).on('message', function(event) {
      Source=event.originalEvent.source;
      Origin=event.originalEvent.origin;
      $el.Domain.val(gp2_process_uri(Origin)).trigger('change');
      $el.Passwd.focus();
      SendHeight();
   });

   // Send document height to bookmarklet.
   var SendHeight=function() { if(Source&&Origin) Source.postMessage('{"height":"'+$(document.body).height()+'"}',Origin); };

});
