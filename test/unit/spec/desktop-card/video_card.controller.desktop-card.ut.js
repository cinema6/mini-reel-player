import DesktopCardVideoCardController from '../../../../src/controllers/desktop-card/DesktopCardVideoCardController.js';
import VideoCardController from '../../../../src/controllers/VideoCardController.js';
import View from '../../../../lib/core/View.js';
import Mixable from '../../../../lib/core/Mixable.js';
import SafelyGettable from '../../../../src/mixins/SafelyGettable.js';
import { EventEmitter } from 'events';
import DesktopCardVideoCardView from '../../../../src/views/desktop-card/DesktopCardVideoCardView.js';
import ModalBallotResultsVideoCardController from '../../../../src/mixins/ModalBallotResultsVideoCardController.js';
import ModalShareVideoCardController from '../../../../src/mixins/ModalShareVideoCardController.js';

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

describe('DesktopCardVideoCardController', function() {
    let card, rootView;
    let DesktopCardVideoCardCtrl;

    beforeEach(function() {
        card = new MockCard();
        rootView = new View();

        spyOn(DesktopCardVideoCardController.prototype, 'addView').and.callThrough();
        spyOn(DesktopCardVideoCardController.prototype, 'initBallotResults').and.callThrough();
        spyOn(DesktopCardVideoCardController.prototype, 'initShare').and.callThrough();

        DesktopCardVideoCardCtrl = new DesktopCardVideoCardController(card, rootView);
    });

    it('should exist', function() {
        expect(DesktopCardVideoCardCtrl).toEqual(jasmine.any(VideoCardController));
    });

    it('should mixin ModalBallotResultsVideoCardController', function() {
        expect(DesktopCardVideoCardController.mixins).toContain(ModalBallotResultsVideoCardController);
        expect(DesktopCardVideoCardCtrl.initBallotResults).toHaveBeenCalled();
    });

    it('should mixin ModalShareVideoCardController', function() {
        expect(DesktopCardVideoCardController.mixins).toContain(ModalShareVideoCardController);
        expect(DesktopCardVideoCardCtrl.initShare).toHaveBeenCalled();
    });

    describe('properties:', function() {
        describe('view', function() {
            it('should be a DesktopCardVideoCardView', function() {
                expect(DesktopCardVideoCardCtrl.view).toEqual(jasmine.any(DesktopCardVideoCardView));
                expect(DesktopCardVideoCardCtrl.addView).toHaveBeenCalledWith(DesktopCardVideoCardCtrl.view);
            });
        });
    });
});
