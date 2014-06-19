# SuperGenPass

[![Build Status](https://travis-ci.org/chriszarate/supergenpass.svg?branch=master)](https://travis-ci.org/chriszarate/supergenpass)

This is the official repository of [SuperGenPass][sgp]. Please see the
[homepage][sgp] to obtain the bookmarklet and the mobile version. For
questions, please see the [FAQ][faq].

## About

SuperGenPass is a different kind of password solution. Instead of storing your
passwords on your hard disk or online—where they are vulnerable to theft and
data loss—SuperGenPass uses a hash algorithm to transform a master password
into unique, complex passwords for the Web sites you visit.

```
SuperGenPass("masterpassword:example1.com") // => zVNqyKdf7F
SuperGenPass("masterpassword:example2.com") // => eYPtU3mfVw
```

SuperGenPass is a bookmarklet and runs right in your Web browser. It *never
stores or transmits your passwords*, so it’s ideal for use on multiple and
public computers. It’s also completely free and open source.

## Should I use SuperGenPass?

Maybe! Do you like bookmarklets? Do you like *not knowing* what your passwords
are? Do you like the idea of using a slightly quirky password solution? You
*do*?

## Develop locally

SuperGenPass development requires [Grunt][grunt]:

```shell
git clone https://github.com/chriszarate/supergenpass.git && cd supergenpass
npm install
grunt
```

## Looking for GenPass?

GenPass is maintained in its own repository: [chriszarate/genpass][gp].


[sgp]: http://supergenpass.com
[faq]: https://github.com/chriszarate/supergenpass/wiki/FAQ
[grunt]: http://gruntjs.com
[gp]: https://github.com/chriszarate/genpass
