import TextCardController from '../../../src/controllers/TextCardController.js';
import CardController from '../../../src/controllers/CardController.js';
import TextCard from '../../../src/models/TextCard.js';
import TextCardView from '../../../src/views/TextCardView.js';

describe('TextCardController', function() {
    let TextCardCtrl;

    beforeEach(function() {
        TextCardCtrl = new TextCardController(new TextCard({ data: {} }));
    });

    it('should be a CardController', function() {
        expect(TextCardCtrl).toEqual(jasmine.any(CardController));
    });

    describe('properties:', function() {
        describe('view', function() {
            it('should be a TextCardView', function() {
                expect(TextCardCtrl.view).toEqual(jasmine.any(TextCardView));
            });
        });
    });
});
