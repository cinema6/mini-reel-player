import ADTECHHandler from '../../../src/handlers/ADTECHHandler.js';
import BillingHandler from '../../../src/handlers/BillingHandler.js';
import dispatcher from '../../../src/services/dispatcher.js';
import CorePlayer from '../../../src/players/CorePlayer.js';
import VideoCard from '../../../src/models/VideoCard.js';
import imageLoader from '../../../src/services/image_loader.js';
import completeUrl from '../../../src/fns/complete_url.js';
import { EventEmitter } from 'events';

describe('ADTECHHandler', function() {
    let card;
    let minireel;
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

        jasmine.clock().install();
        jasmine.clock().mockDate();

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
                clickUrls: ['img1.jpg?cb={cachebreaker}&url={pageUrl}', 'img2.jpg?cb={cachebreaker}'],
                countUrls: ['img3.jpg', 'img4.jpg?page={pageUrl}']
            }
        }, experience);
        minireel = new EventEmitter();
        minireel.campaign = {
            launchUrls: ['img1.jpg?cb={cachebreaker}&url={pageUrl}', 'img2.jpg?cb={cachebreaker}']
        };

        dispatcher.addSource('navigation', minireel, ['launch', 'move', 'close', 'error']);
        dispatcher.addSource('video', player, ['timeupdate', 'play', 'complete'], card);
    });

    afterEach(function() {
        jasmine.clock().uninstall();
    });

    afterAll(function() {
        dispatcher.constructor();
    });

    it('should be a BillingHandler', function() {
        expect(handler).toEqual(jasmine.any(BillingHandler));
    });

    describe('minireel events:', function() {
        describe('launch', function() {
            beforeEach(function() {
                spyOn(imageLoader, 'load');

                minireel.emit('launch');
            });

            it('should fire the minireel\'s launch pixels', function() {
                expect(imageLoader.load).toHaveBeenCalledWith(...minireel.campaign.launchUrls.map(completeUrl));
            });

            describe('if the minireel has no launchUrls', function() {
                beforeEach(function() {
                    delete minireel.campaign.launchUrls;
                    imageLoader.load.calls.reset();

                    minireel.emit('launch');
                });

                it('should do nothing', function() {
                    expect(imageLoader.load).not.toHaveBeenCalled();
                });
            });
        });
    });

    describe('when the AdClick event is fired', function() {
        beforeEach(function() {
            spyOn(imageLoader, 'load');
            handler.emit('AdClick', card);
        });

        it('should load the clickUrls', function() {
            const urls = card.campaign.clickUrls.map(completeUrl);
            expect(imageLoader.load).toHaveBeenCalledWith(...urls);
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
            const urls = card.campaign.countUrls.map(completeUrl);
            expect(imageLoader.load).toHaveBeenCalledWith(...urls);
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
