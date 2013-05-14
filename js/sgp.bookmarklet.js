var a=document.createElement('script');
a.setAttribute('src','<%= meta.hostedURL %>?<%= grunt.template.today(\'yyyymmdd\') %>');
document.getElementsByTagName('head')[0].appendChild(a);
