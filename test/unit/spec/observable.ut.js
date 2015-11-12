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
            observable.set('unknown', 'some value');
            expect(observable.get('unknown')).not.toBeDefined();
        });

        it('should be able to emit changed events', function() {
            observable.set('prop1', 'new value');
            expect(observable.emit).toHaveBeenCalledWith('change:prop1', 'new value');
        });
    });

    it('should be able to reset the state', function() {
        observable.set('prop1', 'new value');
        expect(observable.__private__.state).not.toEqual(config);
        observable.reset();
        expect(observable.__private__.state).toEqual(config);
    });
});
