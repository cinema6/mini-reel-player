import TextCardController from '../../../src/controllers/TextCardController.js';
import CardController from '../../../src/controllers/CardController.js';
import TextCard from '../../../src/models/TextCard.js';

describe('TextCardController', function() {
    let TextCardCtrl;
    let card;

    beforeEach(function() {
        card = new TextCard({ data: {} }, {
            data: {
                collateral: {}
            }
        });

        TextCardCtrl = new TextCardController(card);
    });

    it('should exist', function() {
        expect(TextCardCtrl).toEqual(jasmine.any(CardController));
    });
});
