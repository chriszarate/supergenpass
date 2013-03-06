//Lang='en'; // Available locales: de en es fr hu pt-br ru zh-hk
var a=document.createElement('script');
a.setAttribute('src','<%= meta.hostedURL %>?<%= grunt.template.today(\'yyyymmdd\') %>');
document.getElementsByTagName('head')[0].appendChild(a);
