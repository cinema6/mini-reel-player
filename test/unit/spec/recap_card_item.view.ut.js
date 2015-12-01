import TemplateView from '../../../lib/core/TemplateView.js';
import RecapCardItemView from '../../../src/views/RecapCardItemView.js';

describe('RecapCardItemView', function() {
    let recapCardItemView;

    beforeEach(function() {
        recapCardItemView = new RecapCardItemView();
    });

    it('should be a TemplateView', function() {
        expect(recapCardItemView).toEqual(jasmine.any(TemplateView));
    });

    describe('properties:', function() {
        describe('tag', function() {
            it('should be "li"', function() {
                expect(recapCardItemView.tag).toBe('li');
            });
        });
    });

    describe('events:', function() {
        describe('click()', function() {
            let spy;

            beforeEach(function() {
                spy = jasmine.createSpy('spy()');
                recapCardItemView.on('select', spy);

                recapCardItemView.click();
            });

            it('should emit the "select" event', function() {
                expect(spy).toHaveBeenCalled();
            });
        });
    });
});
