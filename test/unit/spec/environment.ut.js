import environment from '../../../src/environment.js';

describe('environment', function() {
    let c6;

    beforeEach(function() {
        c6 = global.c6;

        environment.constructor();
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

        describe('mode', function() {
            beforeEach(function() {
                c6.kMode = 'mobile';
                environment.constructor();
            });

            it('should be the value of c6.kMode', function() {
                expect(environment.mode).toBe(c6.kMode);
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

        describe('initTime', function() {
            beforeEach(function() {
                c6.kStartTime = Date.now();
                environment.constructor();
            });

            it('should be c6.kStartTime', function() {
                expect(environment.initTime).toBe(c6.kStartTime);
            });
        });
    });
});
