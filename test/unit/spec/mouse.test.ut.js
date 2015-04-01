import '../../../src/tests.js';
import browser from '../../../src/services/browser.js';

describe('mouse test', function() {
    let result;

    beforeEach(function() {
        result = jasmine.createSpy('result()');

        browser.test('mouse', true).then(result, error => console.error(error));
    });

    describe('if there is a mousemove triggered on the body', function() {
        beforeEach(function(done) {
            const event = document.createEvent('MouseEvent');
            event.initMouseEvent('mousemove');
            document.body.dispatchEvent(event);
            browser.test('mouse').then(done, done);
        });

        it('should fulfill with true', function() {
            expect(result).toHaveBeenCalledWith(true);
        });
    });

    describe('if there is a touchstart triggered on the body', function() {
        beforeEach(function(done) {
            const event = document.createEvent('Event');
            event.initEvent('touchstart', true, true);
            document.body.dispatchEvent(event);
            browser.test('mouse').then(done, done);
        });

        it('should fulfill with false', function() {
            expect(result).toHaveBeenCalledWith(false);
        });
    });
});
