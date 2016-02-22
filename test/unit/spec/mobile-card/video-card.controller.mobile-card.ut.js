import MobileCardVideoCardController from '../../../../src/controllers/mobile-card/MobileCardVideoCardController.js';
import VideoCardController from '../../../../src/controllers/VideoCardController.js';
import View from '../../../../lib/core/View.js';
import Mixable from '../../../../lib/core/Mixable.js';
import SafelyGettable from '../../../../src/mixins/SafelyGettable.js';
import { EventEmitter } from 'events';
import ModalShareVideoCardController from '../../../../src/mixins/ModalShareVideoCardController.js';
import MobileCardVideoCardView from '../../../../src/views/mobile-card/MobileCardVideoCardView.js';

class MockCard extends Mixable {
    constructor() {
        super();

        this.data = {
            type: 'youtube'
        };
        this.thumbs = {};
        this.modules = {};
    }

    getSrc() {}
}
Mixable.mixin(EventEmitter, SafelyGettable);

describe('MobileCardVideoCardController', function() {
    let card, rootView;
    let MobileCardVideoCardCtrl;

    beforeEach(function() {
        card = new MockCard();
        rootView = new View();

        spyOn(MobileCardVideoCardController.prototype, 'addView').and.callThrough();
        spyOn(MobileCardVideoCardController.prototype, 'initShare').and.callThrough();

        MobileCardVideoCardCtrl = new MobileCardVideoCardController(card, rootView);
    });

    it('should exist', function() {
        expect(MobileCardVideoCardCtrl).toEqual(jasmine.any(VideoCardController));
    });

    it('should mixin ModalShareVideoCardController', function() {
        expect(MobileCardVideoCardController.mixins).toContain(ModalShareVideoCardController);
        expect(MobileCardVideoCardCtrl.initShare).toHaveBeenCalled();
    });

    describe('properties:', function() {
        describe('view', function() {
            it('should be a MobileCardVideoCardView', function() {
                expect(MobileCardVideoCardCtrl.view).toEqual(jasmine.any(MobileCardVideoCardView));
                expect(MobileCardVideoCardCtrl.addView).toHaveBeenCalledWith(MobileCardVideoCardCtrl.view);
            });
        });
    });
});
