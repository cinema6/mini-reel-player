describe('Mixable', function() {
    import Mixable from '../../../../lib/core/Mixable.js';
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
                let Mixin1, Mixin2, Mixin3;
                let orig;

                beforeEach(function() {
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

                    orig = Mixable.mixins = [Mixin1];

                    Mixable.mixin(Mixin2, Mixin3);
                });

                afterEach(function() {
                    Mixable.mixins = [];
                });

                it('should set mixins to a new array with the existing + new contents', function() {
                    expect(Mixable.mixins).toEqual([Mixin1, Mixin2, Mixin3]);
                    expect(Mixable.mixins).not.toBe(orig);
                });

                it('should extend the prototype of the class', function() {
                    expect(Mixable.prototype).toEqual(jasmine.objectContaining(Mixin2.prototype));
                    expect(Mixable.prototype).toEqual(jasmine.objectContaining(Mixin3.prototype));
                });

                describe('when instantiated', function() {
                    beforeEach(function() {
                        mixable = new Mixable();
                    });

                    it('should call the Mixin\'s constructors', function() {
                        [Mixin1, Mixin2, Mixin3].forEach(Mixin => {
                            expect(Mixin).toHaveBeenCalledWith();
                            expect(Mixin.calls.mostRecent().object).toBe(mixable);
                        });
                    });
                });
            });
        });
    });
});
