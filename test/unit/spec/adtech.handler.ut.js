import ADTECHHandler from '../../../src/handlers/ADTECHHandler.js';
import BillingHandler from '../../../src/handlers/BillingHandler.js';
import dispatcher from '../../../src/services/dispatcher.js';
import CorePlayer from '../../../src/players/CorePlayer.js';
import VideoCard from '../../../src/models/VideoCard.js';
import imageLoader from '../../../src/services/image_loader.js';
import completeUrl from '../../../src/fns/complete_url.js';
import Card from '../../../src/models/Card.js';
import SponsoredCard from '../../../src/mixins/SponsoredCard.js';
import { EventEmitter } from 'events';

function completeUrlWithDefaults(url) { return completeUrl(url); }

class MockCard extends Card {
    constructor() {
        super({
            campaign: {},
            data: {},
            collateral: {},
            params: {}
        });
    }
}
MockCard.mixin(SponsoredCard);

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
                loadUrls: ['img3.jpg?cb={cachebreaker}&url={pageUrl}', 'img4.jpg?cb={cachebreaker}'],
                playUrls: ['img1.jpg?cb={cachebreaker}&url={pageUrl}', 'img2.jpg?cb={cachebreaker}'],
                countUrls: ['img3.jpg', 'img4.jpg?page={pageUrl}'],
                q1Urls: ['img5.jpg', 'img6.jpg?page={pageUrl}'],
                q2Urls: ['img7.jpg', 'img8.jpg?page={pageUrl}'],
                q3Urls: ['img9.jpg', 'img10.jpg?page={pageUrl}'],
                q4Urls: ['img11.jpg', 'img12.jpg?page={pageUrl}']
            }
        }, experience);
        minireel = new EventEmitter();
        minireel.campaign = {
            launchUrls: ['img1.jpg?cb={cachebreaker}&url={pageUrl}', 'img2.jpg?cb={cachebreaker}']
        };

        dispatcher.addSource('navigation', minireel, ['launch', 'move', 'close', 'error', 'init']);
        dispatcher.addSource('video', player, ['timeupdate', 'play', 'firstQuartile', 'midpoint', 'thirdQuartile', 'complete'], card);
        dispatcher.addSource('card', card, ['clickthrough']);
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
                expect(imageLoader.load).toHaveBeenCalledWith(...minireel.campaign.launchUrls.map(completeUrlWithDefaults));
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

        describe('init', function() {
            beforeEach(function() {
                spyOn(imageLoader, 'load');
                minireel.deck = [
                    new MockCard(),
                    card,
                    new MockCard(),
                    new MockCard(),
                    new VideoCard({
                        id: 'rc-6d51e674680718',
                        type: 'youtube',
                        data: {},
                        params: {},
                        links: {},
                        collateral: {},
                        campaign: {
                            minViewTime: -1,
                            loadUrls: ['img5.jpg?cb={cachebreaker}&url={pageUrl}', 'img6.jpg?cb={cachebreaker}'],
                        }
                    }, experience),
                    new MockCard()
                ];

                minireel.emit('init');
            });

            it('should fire the loadPixels of all the cards', function() {
                expect(imageLoader.load).toHaveBeenCalledWith(...minireel.deck[1].campaign.loadUrls.concat(minireel.deck[4].campaign.loadUrls).map(completeUrlWithDefaults));
            });
        });
    });

    describe('player events:', function() {
        describe('firstQuartile', function() {
            beforeEach(function() {
                spyOn(imageLoader, 'load');

                player.emit('firstQuartile');
            });

            it('should fire the minireel\'s launch pixels', function() {
                expect(imageLoader.load).toHaveBeenCalledWith(...card.campaign.q1Urls.map(completeUrlWithDefaults));
            });

            describe('if the minireel has no loadUrls', function() {
                beforeEach(function() {
                    delete card.campaign.q1Urls;
                    imageLoader.load.calls.reset();

                    minireel.emit('firstQuartile');
                });

                it('should do nothing', function() {
                    expect(imageLoader.load).not.toHaveBeenCalled();
                });
            });
        });

        describe('midpoint', function() {
            beforeEach(function() {
                spyOn(imageLoader, 'load');

                player.emit('midpoint');
            });

            it('should fire the minireel\'s launch pixels', function() {
                expect(imageLoader.load).toHaveBeenCalledWith(...card.campaign.q2Urls.map(completeUrlWithDefaults));
            });

            describe('if the minireel has no loadUrls', function() {
                beforeEach(function() {
                    delete card.campaign.q2Urls;
                    imageLoader.load.calls.reset();

                    minireel.emit('midpoint');
                });

                it('should do nothing', function() {
                    expect(imageLoader.load).not.toHaveBeenCalled();
                });
            });
        });

        describe('thirdQuartile', function() {
            beforeEach(function() {
                spyOn(imageLoader, 'load');

                player.emit('thirdQuartile');
            });

            it('should fire the minireel\'s launch pixels', function() {
                expect(imageLoader.load).toHaveBeenCalledWith(...card.campaign.q3Urls.map(completeUrlWithDefaults));
            });

            describe('if the minireel has no loadUrls', function() {
                beforeEach(function() {
                    delete card.campaign.q3Urls;
                    imageLoader.load.calls.reset();

                    minireel.emit('thirdQuartile');
                });

                it('should do nothing', function() {
                    expect(imageLoader.load).not.toHaveBeenCalled();
                });
            });
        });

        describe('complete', function() {
            beforeEach(function() {
                spyOn(imageLoader, 'load');

                player.emit('complete');
            });

            it('should fire the minireel\'s launch pixels', function() {
                expect(imageLoader.load).toHaveBeenCalledWith(...card.campaign.q4Urls.map(completeUrlWithDefaults));
            });

            describe('if the minireel has no loadUrls', function() {
                beforeEach(function() {
                    delete card.campaign.q4Urls;
                    imageLoader.load.calls.reset();

                    minireel.emit('complete');
                });

                it('should do nothing', function() {
                    expect(imageLoader.load).not.toHaveBeenCalled();
                });
            });
        });
    });

    describe('card events:', function() {
        describe('clickthrough', function() {
            let data;

            beforeEach(function() {
                data = {
                    uri: 'https://twitter.com/netflix',
                    tracking: ['img13.jpg', 'img14.jpg?page={pageUrl}']
                };
                spyOn(imageLoader, 'load');

                card.emit('clickthrough', data);
            });

            it('should fire the tracking pixels', function() {
                expect(imageLoader.load).toHaveBeenCalledWith(...data.tracking.map(completeUrlWithDefaults));
            });
        });
    });

    describe('when the AdClick event is fired', function() {
        beforeEach(function() {
            spyOn(imageLoader, 'load');
            handler.emit('AdClick', card);
        });

        it('should load the playUrls', function() {
            const urls = card.campaign.playUrls.map(completeUrlWithDefaults);
            expect(imageLoader.load).toHaveBeenCalledWith(...urls);
        });

        describe('if there are no playUrls', function() {
            beforeEach(function() {
                delete card.campaign.playUrls;
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
            const urls = card.campaign.countUrls.map(completeUrlWithDefaults);
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
