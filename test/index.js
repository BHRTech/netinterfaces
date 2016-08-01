'use strict';

var assert = require('assert');
var netinterfaces;

var mockfs = require('mock-fs');
var os = require('os');

var realNetworkIf = os.networkInterfaces;
function netifMock() {
  return {
    lo: [{
      address: '127.0.0.1',
      netmask: '255.0.0.0',
      family: 'IPv4',
      mac: '00:00:00:00:00:00',
      internal: true
    },
      {
        address: '::1',
        netmask: 'ffff:ffff:ffff:ffff:ffff:ffff:ffff:ffff',
        family: 'IPv6',
        mac: '00:00:00:00:00:00',
        scopeid: 0,
        internal: true
      }],
    eth0: [{
      address: '10.0.0.1',
      netmask: '255.255.255.0',
      family: 'IPv4',
      mac: 'ab:ab:ab:ab:01:02',
      internal: false
    },
      {
        address: 'fe80::b1c3:c1c3:a1a3:31b3',
        netmask: 'ffff:ffff:ffff:ffff::',
        family: 'IPv6',
        mac: 'ab:ab:ab:ab:01:02',
        scopeid: 3,
        internal: false
      }]
  };
}

describe('netinterfaces', function () {
  before(function () {
    mockfs({
      '/sys/class/net/lo': {
        'address': '00:00:00:00:00:00\n'
      },
      '/sys/class/net/eth0': {
        'address': '00:11:22:33:44:55\n'
      },
      '/sys/class/net/eth1': {
        'address': '00:11:22:33:44:66\n'
      }
    });

    os.networkInterfaces = netifMock;

    // require the module here so that the mock is already active
    netinterfaces = require('../lib');
  });

  it('should list inactive interfaces', function () {
    var tst = netinterfaces.list();
    assert((tst.eth1 !== undefined), 'inactive network interface was not listed.');
  });

  it('should patch the os.networkInterfaces function', function () {
    netinterfaces.patch();
    var tst = os.networkInterfaces();
    assert((tst.eth1 !== undefined), 'inactive network interface was not listed in os.networkInterfaces.');
  });

  it('should not change output of active interfaces', function () {
    var mockIf = netifMock();
    var realIf = os.networkInterfaces();
    assert.deepEqual(realIf.eth0, mockIf.eth0, 'output of active interface was changed.');
  });

  it('should not hide active interfaces', function () {
    var mockIf = netifMock();
    var realIf = os.networkInterfaces();

    var hidden = false;

    var keys = Object.keys(mockIf);
    var rkeys = Object.keys(realIf);

    for (var i = 0, len = keys.length; i < len; i++) {
      var key = keys[i];

      var found = false;

      for (var ii = 0, ilen = rkeys.length; ii < ilen; ii++) {
        var rkey = rkeys[ii];

        if (rkey === key) {
          found = true;
          break;
        }
      }

      if (!found) {
        hidden = true;
        break;
      }
    }

    assert(!hidden, 'active network interface was hidden.');
  });

  it('should remove the newline character from the mac address', function () {
    var realIf = os.networkInterfaces();
    var mac = realIf.eth0[0].address;

    var nmac = mac.replace('\n', '');

    assert(mac.length === nmac.length, 'newline character was not removed from mac address.');
  });

  after(function () {
    mockfs.restore();
    os.networkInterfaces = realNetworkIf;
  });
});
