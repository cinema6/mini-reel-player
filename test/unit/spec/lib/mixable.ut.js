import Mixable from '../../../../lib/core/Mixable.js';

describe('Mixable', function() {
    let mixable;

    beforeEach(function() {
        mixable = new Mixable();
    });

    it('should exist', function() {
        expect(mixable).toEqual(jasmine.any(Object));
    });

    describe('static', function() {
        describe('properties:', function() {
            describe('mixins', function() {
                it('should be an array', function() {
                    expect(Mixable.mixins).toEqual([]);
                });
            });
        });

        describe('methods:', function() {
            describe('mixin(...mixins)', function() {
                let MyClass;
                let Mixin1, Mixin2, Mixin3;
                let orig;

                beforeEach(function() {
                    MyClass = class MyClass extends Mixable {};

                    Mixin1 = jasmine.createSpy('Mixin1()');
                    Mixin2 = jasmine.createSpy('Mixin2()');
                    Mixin2.prototype = {
                        foo: jasmine.createSpy('foo()'),
                        bar: jasmine.createSpy('bar()')
                    };
                    Mixin3 = jasmine.createSpy('Mixin3()');
                    Mixin3.prototype = {
                        one: jasmine.createSpy('one()'),
                        two: jasmine.createSpy('two()')
                    };

                    orig = MyClass.mixins = [Mixin1];

                    MyClass.mixin(Mixin2, Mixin3);
                });

                afterEach(function() {
                    Mixable.mixins = [];
                });

                it('should set mixins to a new array with the existing + new contents', function() {
                    expect(MyClass.mixins).toEqual([Mixin1, Mixin2, Mixin3]);
                    expect(MyClass.mixins).not.toBe(orig);
                });

                it('should extend the prototype of the class', function() {
                    expect(MyClass.prototype).toEqual(jasmine.objectContaining(Mixin2.prototype));
                    expect(MyClass.prototype).toEqual(jasmine.objectContaining(Mixin3.prototype));
                });

                describe('when instantiated', function() {
                    beforeEach(function() {
                        const args = ['arg1', 'arg2', 'arg3'];
                        mixable = new MyClass(...args);
                    });

                    it('should call the Mixin\'s constructors passing in any arguments', function() {
                        [Mixin1, Mixin2, Mixin3].forEach(Mixin => {
                            expect(Mixin).toHaveBeenCalledWith('arg1', 'arg2', 'arg3');
                            expect(Mixin.calls.mostRecent().object).toBe(mixable);
                        });
                    });

                    describe('when a method is called', function() {
                        let result;
                        let mixinResult;

                        beforeEach(function() {
                            mixinResult = {};
                            Mixin2.prototype.bar.and.returnValue(mixinResult);

                            result = mixable.bar('hello', 'world');
                        });

                        it('should call the mixin\'s method with the provided params', function() {
                            expect(Mixin2.prototype.bar).toHaveBeenCalledWith('hello', 'world');
                            expect(Mixin2.prototype.bar.calls.mostRecent().object).toBe(mixable);
                        });

                        it('should return the result of calling the mixin\'s method', function() {
                            expect(result).toBe(mixinResult);
                        });
                    });
                });

                describe('if a method is already defined', function() {
                    let mixinMethod, classMethod;
                    let mixinMethodResult, classMethodResult;
                    let $super;

                    function MyMixin() {}
                    MyMixin.prototype.someMethod = mixinMethod = jasmine.createSpy('Mixin.prototype.someMethod()');
                    class MyClass extends Mixable {}
                    MyClass.prototype.someMethod = classMethod = jasmine.createSpy('Class.prototype.someMethod()');
                    MyClass.mixin(MyMixin);

                    beforeEach(function() {
                        mixinMethodResult = {};
                        classMethodResult = {};
                        mixinMethod.and.callFake(function() {
                            $super = this.super;
                            return mixinMethodResult;
                        });
                        classMethod.and.returnValue(classMethodResult);

                        mixable = new MyClass();
                    });

                    it('should not overwrite the existing class\'s method', function() {
                        expect(MyClass.prototype.someMethod).not.toBe(mixinMethod);
                    });

                    describe('when called', function() {
                        let result;

                        beforeEach(function() {
                            result = mixable.someMethod('what', 'is', 'up?');
                        });

                        it('should call the Mixin\'s method', function() {
                            expect(mixinMethod).toHaveBeenCalledWith('what', 'is', 'up?');
                            expect(mixinMethod.calls.mostRecent().object).toBe(mixable);
                        });

                        it('should not call the class method', function() {
                            expect(classMethod).not.toHaveBeenCalled();
                        });

                        it('should return the result of invoking the mixin\'s method', function() {
                            expect(result).toBe(mixinMethodResult);
                        });

                        describe('calling this.super()', function() {
                            let $superResult;

                            beforeEach(function() {
                                $superResult = $super.call(mixable, 'how', 'are', 'you?');
                            });

                            it('should make super the class method', function() {
                                expect($super).toBe(classMethod);
                            });

                            it('should call the class method', function() {
                                expect(classMethod).toHaveBeenCalledWith('how', 'are', 'you?');
                                expect(classMethod.calls.mostRecent().object).toBe(mixable);
                            });

                            it('should return the result of calling the class method', function() {
                                expect($superResult).toBe(classMethodResult);
                            });

                            it('should clean up after itself', function() {
                                expect('super' in mixable).toBe(false);
                            });

                            describe('if super() already existed', function() {
                                let origSuper;

                                beforeEach(function() {
                                    origSuper = mixable.super = function() {};

                                    mixable.someMethod();
                                });

                                it('should return super to its original value', function() {
                                    expect(mixable.super).toBe(origSuper);
                                });
                            });
                        });
                    });
                });
            });
        });
    });
});
