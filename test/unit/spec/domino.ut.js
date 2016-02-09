import domino from '../../../src/services/domino.js';
import dominoCSS from 'domino.css/runtime';

describe('domino service', function() {
    beforeEach(function() {
        domino.constructor();
    });

    afterAll(function() {
        domino.constructor();
    });

    it('should exist', function() {
        expect(domino).toEqual(jasmine.any(Object));
    });

    describe('methods:', function() {
        describe('apply()', function() {
            beforeEach(function() {
                const bootstrap = dominoCSS.bootstrap;
                spyOn(dominoCSS, 'bootstrap').and.callFake(function() {
                    return jasmine.createSpy('reapply()').and.callFake(bootstrap(...arguments));
                });

                domino.apply();
            });

            it('should bootstrap() the document', function() {
                expect(dominoCSS.bootstrap).toHaveBeenCalledWith(document.documentElement);
            });

            it('should not reapply the styles', function() {
                expect(dominoCSS.bootstrap.calls.mostRecent().returnValue).not.toHaveBeenCalled();
            });

            describe('when called again', function() {
                let reapply;

                beforeEach(function() {
                    reapply = dominoCSS.bootstrap.calls.mostRecent().returnValue;
                    dominoCSS.bootstrap.calls.reset();

                    domino.apply();
                });

                it('should not bootstrap again', function() {
                    expect(dominoCSS.bootstrap).not.toHaveBeenCalled();
                });

                it('should reapply the styles', function() {
                    expect(reapply).toHaveBeenCalled();
                });
            });
        });
    });
});
