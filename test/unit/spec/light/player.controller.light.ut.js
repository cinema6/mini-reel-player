import Runner from '../../../../lib/Runner.js';
import LightPlayerController from '../../../../src/controllers/light/LightPlayerController.js';
import PlayerController from '../../../../src/controllers/PlayerController.js';
import LightPlayerView from '../../../../src/views/light/LightPlayerView.js';
import ThumbnailNavigatorPlayerController from '../../../../src/mixins/ThumbnailNavigatorPlayerController.js';
import LightImageCardController from '../../../../src/controllers/light/LightImageCardController.js';
import LightVideoCardController from '../../../../src/controllers/light/LightVideoCardController.js';
import LightboxRecapCardController from '../../../../src/controllers/lightbox/LightboxRecapCardController.js';
import LightInstagramImageCardController from '../../../../src/controllers/light/LightInstagramImageCardController.js';
import LightInstagramVideoCardController from '../../../../src/controllers/light/LightInstagramVideoCardController.js';
import dispatcher from '../../../../src/services/dispatcher.js';
import EmbedSession from '../../../../src/utils/EmbedSession.js';

describe('LightPlayerController', function() {
    let LightPlayerCtrl;

    beforeEach(function() {
        spyOn(dispatcher, 'addClient').and.callThrough();
        spyOn(EmbedSession.prototype, 'setStyles');

        spyOn(LightPlayerController.prototype, 'addView').and.callThrough();
        spyOn(LightPlayerController.prototype, 'initThumbnailNavigator').and.callThrough();

        Runner.run(() => LightPlayerCtrl = new LightPlayerController());
    });

    it('should exist', function() {
        expect(LightPlayerCtrl).toEqual(jasmine.any(PlayerController));
    });

    it('should mixin the ThumbnailNavigatorPlayerController', function() {
        expect(LightPlayerController.mixins).toContain(ThumbnailNavigatorPlayerController);
        expect(LightPlayerCtrl.initThumbnailNavigator).toHaveBeenCalled();
    });

    it('should set the styles on the embed', function() {
        expect(LightPlayerCtrl.minireel.embed.setStyles).toHaveBeenCalledWith({
            minWidth: '18.75em',
            padding: '0 0 85% 0',
            fontSize: '16px',
            height: '0px',
            overflow: 'hidden'
        });
    });

    describe('properties:', function() {
        describe('view', function() {
            it('should be a LightPlayerView', function() {
                expect(LightPlayerCtrl.view).toEqual(jasmine.any(LightPlayerView));
                expect(LightPlayerCtrl.addView).toHaveBeenCalledWith(LightPlayerCtrl.view);
            });
        });

        describe('CardControllers', function() {
            describe('.image', function() {
                it('should be LightImageCardController', function() {
                    expect(LightPlayerCtrl.CardControllers.image).toBe(LightImageCardController);
                });
            });

            describe('.video', function() {
                it('should be LightVideoCardController', function() {
                    expect(LightPlayerCtrl.CardControllers.video).toBe(LightVideoCardController);
                });
            });

            describe('.recap', function() {
                it('should be LightboxRecapCardController', function() {
                    expect(LightPlayerCtrl.CardControllers.recap).toBe(LightboxRecapCardController);
                });
            });

            describe('.instagramImage', function() {
                it('should be LightInstagramImageCardController', function() {
                    expect(LightPlayerCtrl.CardControllers.instagramImage).toBe(LightInstagramImageCardController);
                });
            });

            describe('.instagramVideo', function() {
                it('should be LightInstagramVideoCardController', function() {
                    expect(LightPlayerCtrl.CardControllers.instagramVideo).toBe(LightInstagramVideoCardController);
                });
            });
        });
    });
});
