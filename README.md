# netinterfaces [![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-image]][daviddm-url]
> List all network interfaces, not only the active ones

**Currently this only works on UNIX platforms** (only tested on Linux).

## Installation

```sh
$ npm install --save netinterfaces
```

## Usage

You can either use the functionality directly by calling the *list()* function of the package
or patch the *os.networkInterfaces* function so that other packages can also list inactive interfaces.

To use it directly:
```js
var netif = require('netinterfaces');

// list all network interfaces, also the inactive ones
console.log(netif.list());
```

The output format is the same as the default *os.networkInterfaces* function and should look like this:
```
{ eth0: 
   [ { address: undefined,
       netmask: undefined,
       family: undefined,
       mac: '4f:2a:11:09:12:d1' } ],
  lo: 
   [ { address: '127.0.0.1',
       netmask: '255.0.0.0',
       family: 'IPv4',
       mac: '00:00:00:00:00:00',
       internal: true },
     { address: '::1',
       netmask: 'ffff:ffff:ffff:ffff:ffff:ffff:ffff:ffff',
       family: 'IPv6',
       mac: '00:00:00:00:00:00',
       scopeid: 0,
       internal: true } ] }
```

Note the entry of *eth0* in the list.

If you want to patch the *os.networkInterfaces* function you can use the following:
```js
require('netinterfaces').patch();
```

Pay attention to place this line **at the top** of you file.
Some packages may be unable to operate with inactive network interfaces present in the list. 
## License

MIT © [donothingloop](blog.wq.lc)



[npm-image]: https://badge.fury.io/js/netinterfaces.svg
[npm-url]: https://npmjs.org/package/netinterfaces
[travis-image]: https://travis-ci.org/donothingloop/netinterfaces.svg?branch=master
[travis-url]: https://travis-ci.org/donothingloop/netinterfaces
[daviddm-image]: https://david-dm.org/donothingloop/netinterfaces.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/donothingloop/netinterfaces
