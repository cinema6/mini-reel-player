import Observable from '../../../src/utils/Observable.js';

describe('Observable', function() {
    let observable, config;

    beforeEach(function() {
        config = {
            prop1: 'foo',
            prop2: 'bar',
            count: 123
        };
        observable = new Observable(config);
        spyOn(observable, 'emit');
    });

    it('should exist', function() {
        expect(observable).toEqual(jasmine.any(Observable));
    });

    it('should set the state as a copy', function() {
        expect(observable.__private__.state).not.toBe(config);
        expect(observable.__private__.state).toEqual(config);
    });

    it('should set the default state as a copy', function() {
        expect(observable.__private__.defaultState).not.toBe(config);
        expect(observable.__private__.defaultState).toEqual(config);
    });

    it('should be able to get properties', function() {
        expect(observable.get('prop1')).toBe('foo');
        expect(observable.get('prop2')).toBe('bar');
        expect(observable.get('nonexistant')).not.toBeDefined();
    });

    describe('setting properties', function() {
        it('should be able to set configured proeprties', function() {
            observable.set('prop1', 'new value');
            expect(observable.get('prop1')).toBe('new value');
        });

        it('should not be able to set unconfigured properties', function() {
            try {
                observable.set('unknown', 'some value');
            } catch (error) {
                expect(observable.get('unknown')).not.toBeDefined();
                expect(error).toEqual(new Error('Observable has no unknown property'));
            }
        });

        it('should be able to emit changed events', function() {
            observable.set('prop1', 'new value');
            expect(observable.emit).toHaveBeenCalledWith('change:prop1', 'new value');
            expect(observable.emit.calls.count()).toBe(1);
        });
    });

    it('should be able to reset the state', function() {
        observable.set('prop1', 'new value');
        expect(observable.__private__.state).not.toEqual(config);
        observable.reset();
        expect(observable.__private__.state).toEqual(config);
    });

    describe('mutable()', function() {
        it('should be a getter/setter', function() {
            expect(observable.mutable()).toBe(true);

            observable.mutable(true);
            expect(observable.mutable()).toBe(true);

            observable.mutable(false);
            expect(observable.mutable()).toBe(false);
        });

        describe('if set to false', function() {
            beforeEach(function() {
                observable.mutable(false);

                expect(observable.set('prop1', 'some value')).toBeUndefined();
            });

            it('should not set the value', function() {
                expect(observable.get('prop1')).toBe(config.prop1);
            });

            it('should emit a "reject:prop1" event', function() {
                expect(observable.emit).toHaveBeenCalledWith('reject:prop1', 'some value');
                expect(observable.emit.calls.count()).toBe(1);
            });

            describe('if the value is not being changed', function() {
                beforeEach(function() {
                    observable.emit.calls.reset();

                    observable.set('prop1', config.prop1);
                });

                it('should not emit an event', function() {
                    expect(observable.emit).not.toHaveBeenCalled();
                });
            });
        });
    });
});
