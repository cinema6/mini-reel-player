describe('codeLoader', function() {
    import codeLoader from '../../../src/services/code_loader.js';
    import RunnerPromise from '../../../lib/RunnerPromise.js';

    class Script {
        constructor() {
            this.src = null;
            this.onload = null;
            this.onerror = null;

            this.async = false;
        }
    }

    beforeEach(function() {
        codeLoader.constructor();
    });

    afterEach(function() {
        codeLoader.constructor();
    });

    it('should exist', function() {
        expect(codeLoader).toEqual(jasmine.any(Object));
    });

    describe('methods:', function() {
        describe('load(src)', function() {
            let success, failure;
            let result;
            let script;

            beforeEach(function() {
                success = jasmine.createSpy('success()');
                failure = jasmine.createSpy('failure()');

                spyOn(document, 'createElement').and.callFake(function() {
                    return (script = new Script());
                });
                spyOn(document.head, 'appendChild');

                result = codeLoader.load('https://www.youtube.com/iframe_api');
                result.then(success, failure);
            });

            it('should return a RunnerPromise', function() {
                expect(result).toEqual(jasmine.any(RunnerPromise));
            });

            it('should create a script tag for the script', function() {
                expect(script.src).toBe('https://www.youtube.com/iframe_api');
            });

            it('should make the script async', function() {
                expect(script.async).toBe(true);
            });

            it('should attach a "load" listener to the script', function() {
                expect(script.onload).toEqual(jasmine.any(Function));
            });

            it('should attach an "error" listener to the script', function() {
                expect(script.onerror).toEqual(jasmine.any(Function));
            });

            it('should plop the script into the <head>', function() {
                expect(document.head.appendChild).toHaveBeenCalledWith(script);
            });

            describe('if called again', function() {
                let nextResult;

                beforeEach(function() {
                    nextResult = codeLoader.load('https://www.youtube.com/iframe_api');
                });

                it('should return the same promise', function() {
                    expect(nextResult).toBe(result);
                    expect(codeLoader.load('some/other/thing.js')).not.toBe(result);
                });
            });

            describe('if there is an error', function() {
                beforeEach(function(done) {
                    result.then(done, done);
                    script.onerror();
                });

                it('should reject the promise', function() {
                    expect(failure).toHaveBeenCalledWith(new Error('Failed to load script: [https://www.youtube.com/iframe_api].'));
                });
            });

            describe('when the script is loaded', function() {
                beforeEach(function(done) {
                    result.then(done, done);
                    script.onload();
                });

                it('should resolve the promise', function() {
                    expect(success).toHaveBeenCalledWith(undefined);
                });
            });

            describe('if a configuration is set', function() {
                let before, after;
                let obj;
                let result;

                beforeEach(function() {
                    obj = { data: 'This is what you wanted to load!' };

                    before = jasmine.createSpy('before()');
                    after = jasmine.createSpy('after()').and.returnValue(Promise.resolve(obj));

                    codeLoader.constructor();

                    codeLoader.configure('youtube', {
                        src: 'https://www.youtube.com/iframe_api',
                        before: before,
                        after: after
                    });

                    success.calls.reset();
                    failure.calls.reset();

                    result = codeLoader.load('youtube').then(success, failure);
                });

                it('should create a script element with the full src', function() {
                    expect(script.src).toBe('https://www.youtube.com/iframe_api');
                });

                it('should call before()', function() {
                    expect(before).toHaveBeenCalled();
                });

                describe('when the script is loaded', function() {
                    beforeEach(function(done) {
                        result.then(done, done);
                        script.onload();
                    });

                    it('should resolve to the (unwrapped) value after() returns', function() {
                        expect(success).toHaveBeenCalledWith(obj);
                    });
                });
            });
        });
    });
});
