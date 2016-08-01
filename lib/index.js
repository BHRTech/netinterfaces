'use strict';

var fs = require('fs');
var os = require('os');

module.exports = {};

var netdir = '/sys/class/net/';
var osInterfaces = os.networkInterfaces;

/**
 * Read a file and return its contents.
 * @param path
 */
function readInfo(path) {
  return fs.readFileSync(path);
}

/**
 * Find the interface by interface name in the data returned by os.networkInterfaces.
 * @param intf
 * @param osIntfs
 */
function findIntf(intf, osIntfs) {
  var keys = Object.keys(osIntfs);
  for (var i = 0, len = keys.length; i < len; i++) {
    var key = keys[i];

    if (intf === key) {
      return osIntfs[key];
    }
  }

  return null;
}

/**
 * List all installed network interfaces on the system, not only the active ones.
 */
module.exports.list = function () {
  var osIntfs = osInterfaces();
  var intfs = fs.readdirSync(netdir);
  var res = {};

  for (var i = 0, len = intfs.length; i < len; i++) {
    var intf = intfs[i];
    var mac = readInfo(netdir + intf + '/address').toString();

    // remove the newline
    mac = mac.slice(0, mac.length - 1);

    var addrs = findIntf(intf, osIntfs);

    if (addrs === null) {
      addrs = [{
        address: undefined,
        netmask: undefined,
        family: undefined,
        mac: mac
      }];
    }

    res[intf] = addrs;
  }

  return res;
};

/**
 * Globally patch the os.networkInterfaces function to list all interfaces, not only the active ones.
 */
module.exports.patch = function () {
  os.networkInterfaces = module.exports.list;
};
