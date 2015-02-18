describe('mock animator', function() {
    import mockAnimator from '../../../../../lib/mocks/animator.js';
    import animator from '../../../../../.tmp/lib-real/animator.js';

    beforeEach(function() {
        mockAnimator.constructor();
    });

    it('should inherit from the real animator', function() {
        expect(mockAnimator).toEqual(jasmine.any(animator.constructor));
    });

    describe('flush()', function() {
        let success1, success2, success3;

        beforeEach(function(done) {
            success1 = jasmine.createSpy('success1()');
            success2 = jasmine.createSpy('success2()');
            success3 = jasmine.createSpy('success3()');

            mockAnimator.trigger('event1').then(success1);
            mockAnimator.trigger('event1').then(success2);

            mockAnimator.trigger('event2').then(success3);

            mockAnimator.flush('event1').then(done);
        });

        it('should resolve once the promises for an event have been resolved', function() {
            expect(success1).toHaveBeenCalledWith(undefined);
            expect(success2).toHaveBeenCalledWith(undefined);
        });

        describe('when called with multiple events', function() {
            beforeEach(function(done) {
                expect(success3).not.toHaveBeenCalled();

                mockAnimator.flush('event2').then(done);
            });

            it('should resolve them separately', function() {
                expect(success3).toHaveBeenCalledWith(undefined);
            });
        });
    });
});
