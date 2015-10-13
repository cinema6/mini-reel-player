import environment from '../../../src/environment.js';
import typeify from '../../../src/fns/typeify.js';
import {
    parse as parseURL
} from 'url';
import {
    basename
} from 'path';

describe('environment', function() {
    let c6;

    beforeEach(function() {
        c6 = global.c6;

        try {
            window.location.ancestorOrigins = {
                0: 'http://localhost:8000',
                1: 'http://cinema6.com',
                length: 2
            };
        } catch(e) {}

        environment.constructor();
    });

    afterEach(function() {
        try {
            delete window.location.ancestorOrigins;
        } catch(e) {}
    });

    afterAll(function() {
        environment.constructor();
    });

    it('should exist', function() {
        expect(environment).toEqual(jasmine.any(Object));
    });

    describe('properties:', function() {
        describe('debug', function() {
            describe('if c6.kDebug is true', function() {
                beforeEach(function() {
                    c6.kDebug = true;
                    environment.constructor();
                });

                it('should be true', function() {
                    expect(environment.debug).toBe(true);
                });
            });

            [undefined, false].forEach(value => {
                describe(`if c6.kDebug is ${value}`, function() {
                    beforeEach(function() {
                        c6.kDebug = value;
                        environment.constructor();
                    });

                    it('should be false', function() {
                        expect(environment.debug).toBe(false);
                    });
                });
            });
        });

        describe('apiRoot', function() {
            describe('if c6.kEnvUrlRoot is set', function() {
                beforeEach(function() {
                    c6.kEnvUrlRoot = '//staging.cinema6.com';
                    environment.constructor();
                });

                it('should be that value', function() {
                    expect(environment.apiRoot).toBe(c6.kEnvUrlRoot);
                });
            });

            describe('if c6.kEnvUrlRoot is not set', function() {
                beforeEach(function() {
                    delete c6.kEnvUrlRoot;
                    environment.constructor();
                });

                it('should be "//portal.cinema6.com"', function() {
                    expect(environment.apiRoot).toBe('//portal.cinema6.com');
                });
            });
        });

        describe('params', function() {
            it('should be the parsed query params of the page', function() {
                expect(environment.params).toEqual(typeify(parseURL(window.location.href, true).query));
            });

            describe('if there is a c6.kParams object', function() {
                beforeEach(function() {
                    c6.kParams = { foo: 'bar' };
                    environment.constructor();
                });

                afterEach(function() {
                    delete c6.kParams;
                });

                it('should be that object', function() {
                    expect(environment.params).toBe(c6.kParams);
                });
            });
        });

        describe('mode', function() {
            beforeEach(function() {
                c6.kMode = 'mobile';
                environment.constructor();
            });

            it('should be the value of c6.kMode', function() {
                expect(environment.mode).toBe(c6.kMode);
            });

            describe('if there is no kMode', function() {
                beforeEach(function() {
                    delete c6.kMode;
                    environment.constructor();
                });

                it('should be the basename() of the page', function() {
                    expect(environment.mode).toBe(basename(parseURL(window.location.href).pathname));
                });
            });
        });

        describe('hostname', function() {
            it('should be the parent\'s location.hostname', function() {
                expect(environment.hostname).toBe(window.parent.location.hostname);
            });
        });

        describe('href', function() {
            it('should be the parent\'s location.href', function() {
                expect(environment.href).toBe(window.parent.location.href);
            });
        });

        describe('protocol', function() {
            it('should be the parent\'s location.protocol', function() {
                expect(environment.protocol).toBe(window.parent.location.protocol);
            });
        });

        describe('origin', function() {
            it('should be the parent\'s location.origin', function() {
                expect(environment.origin).toBe(window.parent.location.origin);
            });
        });

        describe('ancestorOrigins', function() {
            it('should be the page\'s ancestorOrigins as an Array', function() {
                expect(environment.ancestorOrigins).toEqual(Array.prototype.slice.call(window.location.ancestorOrigins));
            });

            describe('if the ancestorOrigins property does not exist', function() {
                beforeEach(function() {
                    delete window.location.ancestorOrigins;
                    environment.constructor();
                });

                it('should be the origin in an array', function() {
                    expect(environment.ancestorOrigins).toEqual([environment.origin]);
                });
            });
        });

        describe('initTime', function() {
            beforeEach(function() {
                c6.kStartTime = Date.now();
                environment.constructor();
            });

            it('should be c6.kStartTime', function() {
                expect(environment.initTime).toBe(c6.kStartTime);
            });
        });

        describe('loadStartTime', function() {
            it('should be the requestStart from the navigation performance API', function() {
                expect(environment.loadStartTime).toBe(window.performance.timing.requestStart);
            });

            describe('if there is no requestStart timing', function() {
                let orig;

                beforeEach(function() {
                    orig = window.performance.timing.requestStart;

                    try {
                        delete window.performance.timing.requestStart;
                    } catch(e) {}

                    environment.constructor();
                });

                afterEach(function() {
                    try {
                        window.performance.timing.requestStart = orig;
                    } catch(e) {}
                });

                it('should be null', function() {
                    if (!window.performance.timing.requestStart) {
                        expect(environment.loadStartTime).toBeNull();
                    }
                });
            });

            describe('if there is a c6.kLoadStart', function() {
                beforeEach(function() {
                    c6.kLoadStart = Date.now();
                    environment.constructor();
                });

                afterEach(function() {
                    delete c6.kLoadStart;
                });

                it('should be that', function() {
                    expect(environment.loadStartTime).toBe(c6.kLoadStart);
                });
            });
        });

        describe('guid', function() {
            describe('if there is no __c6_guid__ in localStorage', function() {
                beforeEach(function() {
                    spyOn(localStorage, 'getItem').and.returnValue(undefined);
                    spyOn(localStorage, 'setItem');
                    environment.constructor();
                    expect(localStorage.getItem).toHaveBeenCalledWith('__c6_guid__');
                });

                it('should be a random alpha-numeric string', function() {
                    expect(environment.guid).toMatch(/^(\d|\w){32}$/);
                });

                it('should save the guid in localStorage', function() {
                    expect(localStorage.setItem).toHaveBeenCalledWith('__c6_guid__', environment.guid);
                });
            });

            describe('if there is a __c6_guid__ in localStorage', function() {
                let guid;

                beforeEach(function() {
                    guid = 'y6a7i2k9pzwh0qulcpglyur6of660k4x';

                    spyOn(localStorage, 'getItem').and.returnValue(guid);
                    environment.constructor();
                    expect(localStorage.getItem).toHaveBeenCalledWith('__c6_guid__');
                });

                it('should be the value fetched from localStorage', function() {
                    expect(environment.guid).toBe(guid);
                });
            });

            describe('if calling localStorage methods throw', function() {
                beforeEach(function() {
                    spyOn(localStorage, 'getItem').and.throwError(new Error('I am broken!'));
                    spyOn(localStorage, 'setItem').and.throwError(new Error('I am broken!'));
                    environment.constructor();
                });

                it('should still set the guid', function() {
                    expect(environment.guid).toMatch(/^(\d|\w){32}$/);
                });
            });
        });
    });
});
