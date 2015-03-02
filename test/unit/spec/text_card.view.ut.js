import TextCardView from '../../../src/views/TextCardView.js';
import CardView from '../../../src/views/CardView.js';

describe('TextCardView', function() {
    let textCardView;

    beforeEach(function() {
        textCardView = new TextCardView();
    });

    it('should be a CardView', function() {
        expect(textCardView).toEqual(jasmine.any(CardView));
    });

    describe('properties:', function() {
        describe('template', function() {
            it('should be the contents of TextCardView.html', function() {
                expect(textCardView.template).toBe(require('../../../src/views/TextCardView.html'));
            });
        });
    });
});
