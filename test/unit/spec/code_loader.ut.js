import codeLoader from '../../../src/services/code_loader.js';
import RunnerPromise from '../../../lib/RunnerPromise.js';

describe('codeLoader', function() {
    class Script {
        constructor() {
            this.src = null;
            this.onload = null;
            this.onerror = null;

            this.async = false;
        }
    }

    class Link {
        constructor() {
            this.type = null;
            this.href = null;
            this.rel = null;
            this.sheet = null;
        }
    }

    class Img {
        constructor() {
            this.src = null;
            this.onload = null;
            this.onerror = null;
        }
    }

    class StyleSheet {
        constructor() {
            this.cssRules = [];
            this.type = 'css';
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
        describe('loadStyles(src)', function() {
            let success, failure;
            let result;
            let link, image;

            beforeEach(function() {
                success = jasmine.createSpy('success()');
                failure = jasmine.createSpy('failure()');

                spyOn(document, 'createElement').and.callFake(function() {
                    return (link = new Link());
                });
                spyOn(global, 'Image').and.callFake(function() {
                    return (image = new Img());
                });
                spyOn(document.head, 'appendChild');

                result = codeLoader.loadStyles('css/full--hover.css');
                result.then(success, failure);
            });

            it('should return a RunnerPromise', function() {
                expect(result).toEqual(jasmine.any(RunnerPromise));
            });

            it('should create a link for the stylesheet', function() {
                expect(document.createElement).toHaveBeenCalledWith('link');
                expect(link.type).toBe('text/css');
                expect(link.href).toBe('css/full--hover.css');
                expect(link.rel).toBe('stylesheet');
            });

            it('should add the link to the head', function() {
                expect(document.head.appendChild).toHaveBeenCalledWith(link);
            });

            it('should load the stylesheet with an image', function() {
                expect(image).toEqual(jasmine.any(Img));
                expect(image.src).toBe('css/full--hover.css');
            });

            describe('when the image emits "error" (which it will because it\'s trying to load CSS)', function() {
                describe('if the sheet property is set', function() {
                    beforeEach(function(done) {
                        link.sheet = new StyleSheet();
                        image.onerror();
                        result.then(done, done);
                    });

                    it('should fulfill the promise with the sheet', function() {
                        expect(success).toHaveBeenCalledWith(link.sheet);
                    });
                });

                describe('if the sheet property is not set', function() {
                    beforeEach(function(done) {
                        image.onerror();
                        result.then(done, done);
                    });

                    it('should reject the promise with an error', function() {
                        expect(failure).toHaveBeenCalledWith(new Error('Failed to load styles: [css/full--hover.css].'));
                    });
                });
            });

            describe('if called again', function() {
                describe('with the same src', function() {
                    it('should return the same promise', function() {
                        expect(codeLoader.loadStyles('css/full--hover.css')).toBe(result);
                    });
                });

                describe('with a different src', function() {
                    it('should return a different promise', function() {
                        expect(codeLoader.loadStyles('foo.css')).not.toBe(result);
                    });
                });
            });
        });

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
                expect(document.head.appendChild).toHaveBeenCalledWith(script,undefined);
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

            describe('if passed an Element',function(){
                let element;
                beforeEach(function(){
                    element = {
                        insertBefore : jasmine.createSpy('insertBefore'),
                        appendChild  : jasmine.createSpy('insertBefore')
                    };
                });
                it('should insertBefore with null existingNode by default',function(){
                    codeLoader.load('https://some.groovy.file/ha1',element,'insertBefore');
                    expect(element.insertBefore).toHaveBeenCalledWith(script,undefined);
                });

                it('should use domMethod if passed',function(){
                    codeLoader.load('https://some.groovy.file/ha2',element,'appendChild',null);
                    expect(element.appendChild).toHaveBeenCalledWith(script,null);
                });

                it('should use domArg if passed',function(){
                    var obj = {};
                    codeLoader.load('https://some.groovy.file/ha3',element,null,obj);
                    expect(element.appendChild).toHaveBeenCalledWith(script,obj);
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
