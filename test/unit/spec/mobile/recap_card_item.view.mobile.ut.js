import MobileRecapCardItemView from '../../../../src/views/mobile/MobileRecapCardItemView.js';
import RecapCardItemView from '../../../../src/views/RecapCardItemView.js';
import {
    noop
} from '../../../../lib/utils.js';

describe('MobileRecapCardItemView', function() {
    let mobileRecapCardItemView;

    beforeEach(function() {
        mobileRecapCardItemView = new MobileRecapCardItemView();
    });

    it('should be a RecapCardItemView', function() {
        expect(mobileRecapCardItemView).toEqual(jasmine.any(RecapCardItemView));
    });

    describe('properties:', function() {
        describe('template', function() {
            it('should be the contents of MobileRecapCardItemView.html', function() {
                expect(mobileRecapCardItemView.template).toBe(require('../../../../src/views/mobile/MobileRecapCardItemView.html'));
            });
        });

        describe('classes', function() {
            it('should be the usual classes plus "recap__item card__group clearfix"', function() {
                expect(mobileRecapCardItemView.classes).toEqual((new RecapCardItemView()).classes.concat(['recap__item', 'card__group', 'clearfix']));
            });
        });
    });

    describe('hooks:', function() {
        describe('didCreateElement()', function() {
            beforeEach(function() {
                mobileRecapCardItemView.create();
            });

            it('should give the element a noop click handler', function() {
                expect(mobileRecapCardItemView.element.onclick).toBe(noop);
            });
        });
    });
});
