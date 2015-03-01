# SuperGenPass

[![Build Status][build-status]][travis-ci]

[![Sauce Status][sauce-status]][saucelabs]

This is the official repository of [SuperGenPass][sgp]. It contains code for the
bookmarklet and the mobile version. The underlying algorithm that is used by
SuperGenPass to generate passwords has its own repository:
[chriszarate/supergenpass-lib][sgp-lib].

Please see the [homepage][sgp] to obtain the latest stable version of the
bookmarklet and the mobile version. For questions, please see the [FAQ][faq].

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


## License

SuperGenPass is released under the [GNU General Public License version 2][gplv2].


## Other implementations

Since SuperGenPass is open-source, others have made their own versions for
various platforms and with additional functionality. You can find a list on the
[implementations wiki page][implementations]. Please note that these projects
are not reviewed and compatibility is not guaranteed.


[sgp]: http://supergenpass.com
[sgp-lib]: https://github.com/chriszarate/supergenpass-lib
[build-status]: https://travis-ci.org/chriszarate/supergenpass.svg?branch=master
[sauce-status]: https://saucelabs.com/browser-matrix/zarate.svg
[travis-ci]: https://travis-ci.org/chriszarate/supergenpass
[saucelabs]: https://saucelabs.com/u/zarate
[faq]: https://github.com/chriszarate/supergenpass/wiki/FAQ
[grunt]: http://gruntjs.com
[gp]: https://github.com/chriszarate/genpass
[gplv2]: http://www.gnu.org/licenses/gpl-2.0.html
[implementations]: https://github.com/chriszarate/supergenpass/wiki/Implementations
