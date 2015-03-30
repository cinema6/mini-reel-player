import MobileRecapCardView from '../../../../src/views/mobile/MobileRecapCardView.js';
import RecapCardView from '../../../../src/views/RecapCardView.js';
import Runner from '../../../../lib/Runner.js';
import MobileRecapCardListView from '../../../../src/views/mobile/MobileRecapCardListView.js';

describe('MobileRecapCardView', function() {
    let mobileRecapCardView;

    beforeEach(function() {
        mobileRecapCardView = new MobileRecapCardView();
    });

    it('should be a RecapCardView', function() {
        expect(mobileRecapCardView).toEqual(jasmine.any(RecapCardView));
    });

    describe('properties:', function() {
        describe('template', function() {
            it('should be the contents of MobileRecapCardView.html', function() {
                expect(mobileRecapCardView.template).toBe(require('../../../../src/views/mobile/MobileRecapCardView.html'));
            });
        });

        describe('cards', function() {
            beforeEach(function() {
                Runner.run(() => mobileRecapCardView.create());
            });

            it('should be a RecapCardListView', function() {
                expect(mobileRecapCardView.cards).toEqual(jasmine.any(MobileRecapCardListView));
            });
        });
    });
});
