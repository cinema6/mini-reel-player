const realAddEventListener = global.addEventListener;
const listeners = [];

// jshint freeze:false
Function.prototype.bind = require('function-bind');
// jshint freeze:true

global.addEventListener = function() {
    listeners.push(arguments);
    return realAddEventListener.apply(global, arguments);
};

global.c6 = {};

beforeEach(function() {
    jasmine.addMatchers({
        toImplement() {
            return {
                compare(object, Interface) {
                    const result = {};
                    const iface = new Interface();

                    try {
                        result.pass = Object.getOwnPropertyNames(iface).every(prop => {
                            return object[prop] === iface[prop] ||
                                object[prop] instanceof iface[prop] ||
                                object[prop].constructor === iface[prop];
                        }) && Object.getOwnPropertyNames(Interface.prototype).every(method => {
                            return typeof object[method] === typeof iface[method];
                        });
                    } catch (e) {
                        result.pass = false;
                    }

                    result.message = result.pass ?
                        `Expected ${jasmine.pp(object)} not to implement ${jasmine.pp(iface)}, but it does.` :
                        `Expected ${jasmine.pp(object)} to implement ${jasmine.pp(iface)}, but it does not.`;

                    return result;
                }
            };
        }
    });
});

afterEach(function() {
    let args;

    while (args = listeners.shift()) {
        global.removeEventListener.apply(global, args);
    }
});
