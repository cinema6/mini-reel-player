import MobileTextCardController from '../../../../src/controllers/mobile/MobileTextCardController.js';
import TextCard from '../../../../src/models/TextCard.js';
import TextCardController from '../../../../src/controllers/TextCardController.js';
import MobileTextCardView from '../../../../src/views/mobile/MobileTextCardView.js';

describe('MobileTextCardController', function() {
    let MobileTextCardCtrl;

    beforeEach(function() {
        MobileTextCardCtrl = new MobileTextCardController(new TextCard({ data: {} }, {
            data: {
                collateral: {}
            }
        }));
    });

    it('should be a CardController', function() {
        expect(MobileTextCardCtrl).toEqual(jasmine.any(TextCardController));
    });

    describe('properties:', function() {
        describe('view', function() {
            it('should be a TextCardView', function() {
                expect(MobileTextCardCtrl.view).toEqual(jasmine.any(MobileTextCardView));
            });
        });
    });
});
