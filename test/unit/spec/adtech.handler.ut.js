import ADTECHHandler from '../../../src/handlers/ADTECHHandler.js';
import BillingHandler from '../../../src/handlers/BillingHandler.js';
import dispatcher from '../../../src/services/dispatcher.js';
import CorePlayer from '../../../src/players/CorePlayer.js';
import VideoCard from '../../../src/models/VideoCard.js';
import imageLoader from '../../../src/services/image_loader.js';

describe('ADTECHHandler', function() {
    let card;
    let experience;
    let player;
    let handler;

    class MockHandler extends ADTECHHandler {
        constructor() {
            super(...arguments);

            handler = this;
        }
    }

    beforeEach(function() {
        dispatcher.constructor();
        dispatcher.addClient(MockHandler);

        experience = {
            data: {}
        };

        player = new CorePlayer();
        card = new VideoCard({
            id: 'rc-6d51e674680717',
            type: 'youtube',
            data: {},
            params: {},
            links: {},
            collateral: {},
            campaign: {
                minViewTime: 7,
                clickUrls: ['img1.jpg', 'img2.jpg'],
                countUrls: ['img3.jpg', 'img4.jpg']
            }
        }, experience);

        dispatcher.addSource('video', player, ['timeupdate', 'play', 'complete'], card);
    });

    afterAll(function() {
        dispatcher.constructor();
    });

    it('should be a BillingHandler', function() {
        expect(handler).toEqual(jasmine.any(BillingHandler));
    });

    describe('when the AdClick event is fired', function() {
        beforeEach(function() {
            spyOn(imageLoader, 'load');
            handler.emit('AdClick', card);
        });

        it('should load the clickUrls', function() {
            expect(imageLoader.load).toHaveBeenCalledWith(...card.campaign.clickUrls);
        });

        describe('if there are no click urls', function() {
            beforeEach(function() {
                delete card.campaign.clickUrls;
                imageLoader.load.calls.reset();

                handler.emit('AdClick', card);
            });

            it('should not load any urls', function() {
                expect(imageLoader.load).not.toHaveBeenCalled();
            });
        });
    });

    describe('when the AdCount event is fired', function() {
        beforeEach(function() {
            spyOn(imageLoader, 'load');
            handler.emit('AdCount', card);
        });

        it('should fire the pixels', function() {
            expect(imageLoader.load).toHaveBeenCalledWith(...card.campaign.countUrls);
        });

        describe('if there are no countUrls', function() {
            beforeEach(function() {
                imageLoader.load.calls.reset();
                delete card.campaign.countUrls;

                handler.emit('AdCount', card);
            });

            it('should not fire any pixels', function() {
                expect(imageLoader.load).not.toHaveBeenCalled();
            });
        });
    });
});
