import PixelHandler from '../../../src/handlers/PixelHandler.js';
import BillingHandler from '../../../src/handlers/BillingHandler.js';
import dispatcher from '../../../src/services/dispatcher.js';
import CorePlayer from '../../../src/players/CorePlayer.js';
import VideoCard from '../../../src/models/VideoCard.js';
import imageLoader from '../../../src/services/image_loader.js';
import completeUrl from '../../../src/fns/complete_url.js';
import Card from '../../../src/models/Card.js';
import SponsoredCard from '../../../src/mixins/SponsoredCard.js';
import SponsoredCardController from '../../../src/mixins/SponsoredCardController.js';
import CardController from '../../../src/controllers/CardController.js';
import { EventEmitter } from 'events';
import environment from '../../../src/environment.js';
import CardView from '../../../src/views/CardView.js';

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

class MockCardController extends CardController {
    constructor() {
        super(...arguments);

        this.view = new CardView();
    }
}
MockCardController.mixin(SponsoredCardController);

describe('PixelHandler', function() {
    let card;
    let minireel;
    let experience;
    let player;
    let controller;
    let handler;

    class MockHandler extends PixelHandler {
        constructor() {
            super(...arguments);

            handler = this;
        }
    }

    function completeUrlWithDelay(url) {
        return completeUrl(url, { '{delay}': Date.now() - card.lastViewedTime });
    }

    function completeUrlWithContext({
        context,
        coordinates = {}
    } = {}) {
        return function complete(url) {
            return completeUrl(completeUrlWithDelay(url), {
                '{context}': context || '',
                '{screenWidth}': window.screen.width,
                '{screenHeight}': window.screen.height,
                '{playerWidth}': window.innerWidth,
                '{playerHeight}': window.innerHeight,
                '{screenX}': coordinates.x || '',
                '{screenY}': coordinates.y || ''
            });
        };
    }

    beforeEach(function() {
        dispatcher.constructor();
        dispatcher.addClient(MockHandler);

        jasmine.clock().install();
        jasmine.clock().mockDate();

        environment.loadStartTime = Date.now();

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
                loadUrls: ['img3.jpg?cb={cachebreaker}&url={pageUrl}&delay={delay}&sw={screenWidth}&sh={screenHeight}&pw={playerWidth}&ph={playerHeight}', 'img4.jpg?cb={cachebreaker}&delay={loadDelay}'],
                playUrls: ['img1.jpg?cb={cachebreaker}&url={pageUrl}&delay={delay}&sw={screenWidth}&sh={screenHeight}&pw={playerWidth}&ph={playerHeight}', 'img2.jpg?cb={cachebreaker}&delay={playDelay}'],
                countUrls: ['img3.jpg?delay={delay}&sw={screenWidth}&sh={screenHeight}&pw={playerWidth}&ph={playerHeight}', 'img4.jpg?page={pageUrl}&c={context}'],
                q1Urls: ['img5.jpg?delay={delay}&sw={screenWidth}&sh={screenHeight}&pw={playerWidth}&ph={playerHeight}&hit={screenX},{screenY}', 'img6.jpg?page={pageUrl}&c={context}'],
                q2Urls: ['img7.jpg?delay={delay}&sw={screenWidth}&sh={screenHeight}&pw={playerWidth}&ph={playerHeight}', 'img8.jpg?page={pageUrl}&c={context}'],
                q3Urls: ['img9.jpg?delay={delay}&sw={screenWidth}&sh={screenHeight}&pw={playerWidth}&ph={playerHeight}', 'img10.jpg?page={pageUrl}&c={context}'],
                q4Urls: ['img11.jpg?delay={delay}&sw={screenWidth}&sh={screenHeight}&pw={playerWidth}&ph={playerHeight}&hit={screenX},{screenY}', 'img12.jpg?page={pageUrl}&c={context}'],
                viewUrls: ['img13.jpg?delay={delay}&sw={screenWidth}&sh={screenHeight}&pw={playerWidth}&ph={playerHeight}', 'img14.jpg?page={pageUrl}&c={context}'],
                bufferUrls: ['img15.jpg?delay={delay}&sw={screenWidth}&sh={screenHeight}&pw={playerWidth}&ph={playerHeight}', 'img16.jpg?page={pageUrl}&c={context}'],
                launchUrls: ['img17.jpg?delay={delay}&sw={screenWidth}&sh={screenHeight}&pw={playerWidth}&ph={playerHeight}&hit={screenX},{screenY}', 'img18.jpg?page={pageUrl}&c={context}'],
                interactionUrls: ['img19.jpg?delay={delay}&sw={screenWidth}&sh={screenHeight}&pw={playerWidth}&ph={playerHeight}', 'img20.jpg?page={pageUrl}&c={context}'],
            }
        }, experience);
        minireel = new EventEmitter();
        minireel.campaign = {};
        minireel.deck = [card];

        controller = new MockCardController(card);

        dispatcher.addSource('ui', controller, ['interaction']);
        dispatcher.addSource('navigation', minireel, ['launch', 'move', 'close', 'error', 'init']);
        dispatcher.addSource('video', player, ['timeupdate', 'play', 'firstQuartile', 'midpoint', 'thirdQuartile', 'complete', 'buffering'], card);
        dispatcher.addSource('card', card, ['activate', 'deactivate'], player);
        dispatcher.addSource('card', card, ['share', 'clickthrough']);

        spyOn(imageLoader, 'load').and.callFake((...urls) => expect(urls.length).toBeGreaterThan(0));
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
                            launchUrls: ['img19.jpg?cb={cachebreaker}&url={pageUrl}&delay={launchDelay}', 'img20.jpg?cb={cachebreaker}&delay={delay}&sw={screenWidth}&sh={screenHeight}&pw={playerWidth}&ph={playerHeight}'],
                        }
                    }, experience),
                    new MockCard()
                ];

                jasmine.clock().tick(150);

                minireel.emit('launch');
            });

            it('should fire the launchUrls of all the cards', function() {
                expect(imageLoader.load).toHaveBeenCalledWith(...minireel.deck[1].campaign.launchUrls.concat(minireel.deck[4].campaign.launchUrls).map(url => completeUrl(url, {
                    '{delay}': 150,
                    '{context}': '',
                    '{screenWidth}': window.screen.width,
                    '{screenHeight}': window.screen.height,
                    '{playerWidth}': window.innerWidth,
                    '{playerHeight}': window.innerHeight,
                    '{screenX}': '',
                    '{screenY}': ''
                })));
            });

            describe('if fired again', function() {
                beforeEach(function() {
                    imageLoader.load.calls.reset();

                    minireel.emit('launch');
                });

                it('should not fire any pixels', function() {
                    expect(imageLoader.load).not.toHaveBeenCalled();
                });
            });

            describe('if the loadStartTime is unknown', function() {
                beforeEach(function() {
                    environment.loadStartTime = null;
                    imageLoader.load.calls.reset();
                    minireel.deck.forEach(card => {
                        if (card.campaign.launchUrls) { delete card.campaign.launchUrls.fired; }
                    });

                    minireel.emit('launch');
                });

                it('should replace the {launchDelay} macro with null', function() {
                    expect(imageLoader.load).toHaveBeenCalledWith(...minireel.deck[1].campaign.launchUrls.concat(minireel.deck[4].campaign.launchUrls).map(url => completeUrl(url, {
                        '{delay}': null,
                        '{context}': '',
                        '{screenWidth}': window.screen.width,
                        '{screenHeight}': window.screen.height,
                        '{playerWidth}': window.innerWidth,
                        '{playerHeight}': window.innerHeight,
                        '{screenX}': '',
                        '{screenY}': ''
                    })));
                });
            });
        });

        describe('init', function() {
            beforeEach(function() {
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
                            loadUrls: ['img5.jpg?cb={cachebreaker}&url={pageUrl}&delay={loadDelay}', 'img6.jpg?cb={cachebreaker}&delay={delay}&sw={screenWidth}&sh={screenHeight}&pw={playerWidth}&ph={playerHeight}'],
                        }
                    }, experience),
                    new MockCard()
                ];

                jasmine.clock().tick(33);

                minireel.emit('init');
            });

            it('should fire the loadPixels of all the cards', function() {
                expect(imageLoader.load).toHaveBeenCalledWith(...minireel.deck[1].campaign.loadUrls.concat(minireel.deck[4].campaign.loadUrls).map(url => completeUrl(url, {
                    '{delay}': 33,
                    '{screenWidth}': window.screen.width,
                    '{screenHeight}': window.screen.height,
                    '{playerWidth}': window.innerWidth,
                    '{playerHeight}': window.innerHeight
                })));
            });

            describe('if the loadStartTime is unknown', function() {
                beforeEach(function() {
                    environment.loadStartTime = null;
                    imageLoader.load.calls.reset();
                    minireel.deck.forEach(card => {
                        if (card.campaign.loadUrls) { delete card.campaign.loadUrls.fired; }
                    });

                    minireel.emit('init');
                });

                it('should replace the {launchDelay} macro with null', function() {
                    expect(imageLoader.load).toHaveBeenCalledWith(...minireel.deck[1].campaign.loadUrls.concat(minireel.deck[4].campaign.loadUrls).map(url => completeUrl(url, {
                        '{delay}': null,
                        '{screenWidth}': window.screen.width,
                        '{screenHeight}': window.screen.height,
                        '{playerWidth}': window.innerWidth,
                        '{playerHeight}': window.innerHeight
                    })));
                });
            });
        });
    });

    describe('player events:', function() {
        beforeEach(function() {
            card.activate();
        });

        describe('buffering', function() {
            beforeEach(function() {
                jasmine.clock().tick(300);

                player.emit('buffering');
            });

            it('should fire the bufferUrls', function() {
                expect(imageLoader.load).toHaveBeenCalledWith(...card.campaign.bufferUrls.map(url => completeUrl(url, {
                    '{delay}': 300,
                    '{context}': '',
                    '{screenWidth}': window.screen.width,
                    '{screenHeight}': window.screen.height,
                    '{playerWidth}': window.innerWidth,
                    '{playerHeight}': window.innerHeight
                })));
            });

            describe('if emitted again', function() {
                beforeEach(function() {
                    imageLoader.load.calls.reset();

                    player.emit('buffering');
                });

                it('should not fire any pixels', function() {
                    expect(imageLoader.load).not.toHaveBeenCalled();
                });
            });

            describe('if the loadStartTime is unknown', function() {
                beforeEach(function() {
                    environment.loadStartTime = null;
                    imageLoader.load.calls.reset();
                    delete card.campaign.bufferUrls.fired;

                    player.emit('buffering');
                });

                it('should replace the {delay} macro with null', function() {
                    expect(imageLoader.load).toHaveBeenCalledWith(...card.campaign.bufferUrls.map(url => completeUrl(url, {
                        '{delay}': null,
                        '{context}': '',
                        '{screenWidth}': window.screen.width,
                        '{screenHeight}': window.screen.height,
                        '{playerWidth}': window.innerWidth,
                        '{playerHeight}': window.innerHeight
                    })));
                });
            });

            describe('if the card has no bufferUrls', function() {
                beforeEach(function() {
                    delete card.campaign.bufferUrls;
                    imageLoader.load.calls.reset();

                    player.emit('buffering');
                });

                it('should do nothing', function() {
                    expect(imageLoader.load).not.toHaveBeenCalled();
                });
            });
        });

        describe('firstQuartile', function() {
            beforeEach(function() {
                jasmine.clock().tick(15);

                player.emit('firstQuartile');
            });

            it('should fire the q1Urls', function() {
                expect(imageLoader.load).toHaveBeenCalledWith(...card.campaign.q1Urls.map(completeUrlWithContext()));
            });

            describe('if emitted again', function() {
                beforeEach(function() {
                    imageLoader.load.calls.reset();

                    player.emit('firstQuartile');
                });

                it('should not fire any pixels', function() {
                    expect(imageLoader.load).not.toHaveBeenCalled();
                });
            });

            describe('if the card has no q1Urls', function() {
                beforeEach(function() {
                    delete card.campaign.q1Urls;
                    imageLoader.load.calls.reset();

                    player.emit('firstQuartile');
                });

                it('should do nothing', function() {
                    expect(imageLoader.load).not.toHaveBeenCalled();
                });
            });
        });

        describe('midpoint', function() {
            beforeEach(function() {
                jasmine.clock().tick(30);

                player.emit('midpoint');
            });

            it('should fire the q2Urls', function() {
                expect(imageLoader.load).toHaveBeenCalledWith(...card.campaign.q2Urls.map(completeUrlWithContext()));
            });

            describe('if emitted again', function() {
                beforeEach(function() {
                    imageLoader.load.calls.reset();

                    player.emit('midpoint');
                });

                it('should not fire any pixels', function() {
                    expect(imageLoader.load).not.toHaveBeenCalled();
                });
            });

            describe('if the card has no q2Urls', function() {
                beforeEach(function() {
                    delete card.campaign.q2Urls;
                    imageLoader.load.calls.reset();

                    player.emit('midpoint');
                });

                it('should do nothing', function() {
                    expect(imageLoader.load).not.toHaveBeenCalled();
                });
            });
        });

        describe('thirdQuartile', function() {
            beforeEach(function() {
                jasmine.clock().tick(45);

                player.emit('thirdQuartile');
            });

            it('should fire the q3Urls', function() {
                expect(imageLoader.load).toHaveBeenCalledWith(...card.campaign.q3Urls.map(completeUrlWithContext()));
            });

            describe('if emitted again', function() {
                beforeEach(function() {
                    imageLoader.load.calls.reset();

                    player.emit('thirdQuartile');
                });

                it('should not fire any pixels', function() {
                    expect(imageLoader.load).not.toHaveBeenCalled();
                });
            });

            describe('if the card has no q3Urls', function() {
                beforeEach(function() {
                    delete card.campaign.q3Urls;
                    imageLoader.load.calls.reset();

                    player.emit('thirdQuartile');
                });

                it('should do nothing', function() {
                    expect(imageLoader.load).not.toHaveBeenCalled();
                });
            });
        });

        describe('complete', function() {
            beforeEach(function() {
                jasmine.clock().tick(59);

                player.emit('complete');
            });

            it('should fire the q4Urls', function() {
                expect(imageLoader.load).toHaveBeenCalledWith(...card.campaign.q4Urls.map(completeUrlWithContext()));
            });

            describe('if emitted again', function() {
                beforeEach(function() {
                    imageLoader.load.calls.reset();

                    player.emit('complete');
                });

                it('should not fire any pixels', function() {
                    expect(imageLoader.load).not.toHaveBeenCalled();
                });
            });

            describe('if the card has no q4Urls', function() {
                beforeEach(function() {
                    delete card.campaign.q4Urls;
                    imageLoader.load.calls.reset();

                    player.emit('complete');
                });

                it('should do nothing', function() {
                    expect(imageLoader.load).not.toHaveBeenCalled();
                });
            });
        });
    });

    describe('card events:', function() {
        beforeEach(function() {
            card.activate();
        });

        describe('clickthrough', function() {
            let event;

            beforeEach(function() {
                event = {
                    link: {
                        uri: 'https://twitter.com/netflix',
                        tracking: ['img13.jpg?delay={delay}&c={context}&hit={screenX},{screenY}', 'img14.jpg?page={pageUrl}&c={context}&hit={screenX},{screenY}']
                    },
                    type: 'Twitter',
                    context: 'clickthrough context',
                    coordinates: { x: 300, y: 200 }
                };

                jasmine.clock().tick(10);

                card.emit('clickthrough', event);
            });

            it('should fire the tracking pixels', function() {
                expect(imageLoader.load).toHaveBeenCalledWith(...event.link.tracking.map(completeUrlWithContext({ context: event.context, coordinates: event.coordinates })));
            });

            describe('if the context is different', function() {
                beforeEach(function() {
                    imageLoader.load.calls.reset();
                    event.context = 'other clickthrough context';

                    card.emit('clickthrough', event);
                });

                it('should fire the pixels again', function() {
                    expect(imageLoader.load).toHaveBeenCalledWith(...event.link.tracking.map(completeUrlWithContext({ context: event.context, coordinates: event.coordinates })));
                });
            });

            describe('if emitted again', function() {
                beforeEach(function() {
                    imageLoader.load.calls.reset();

                    card.emit('clickthrough', event);
                });

                it('should not fire any pixels', function() {
                    expect(imageLoader.load).not.toHaveBeenCalled();
                });
            });
        });

        describe('share', function() {
            let event;

            beforeEach(function() {
                event = {
                    link: {
                        type: 'facebook',
                        label: 'Facebook',
                        href: 'http://imgur.com/S3GiV63',
                        tracking: ['img15.jpg?delay={delay}&c={context}&hit={screenX},{screenY}', 'img16.jpg?page={pageUrl}&c={context}&hit={screenX},{screenY}']
                    },
                    type: 'facebook',
                    context: 'share context',
                    coordinates: { x: 1, y: 300 }
                };

                jasmine.clock().tick(15);

                card.emit('share', event);
            });

            it('should fire the tracking pixels', function() {
                expect(imageLoader.load).toHaveBeenCalledWith(...event.link.tracking.map(completeUrlWithContext({ context: event.context, coordinates: event.coordinates })));
            });

            describe('if the context is different', function() {
                beforeEach(function() {
                    imageLoader.load.calls.reset();
                    event.context = 'other share context';

                    card.emit('clickthrough', event);
                });

                it('should fire the pixels again', function() {
                    expect(imageLoader.load).toHaveBeenCalledWith(...event.link.tracking.map(completeUrlWithContext({ context: event.context, coordinates: event.coordinates })));
                });
            });

            describe('if emitted again', function() {
                beforeEach(function() {
                    imageLoader.load.calls.reset();

                    card.emit('share', event);
                });

                it('should not fire any pixels', function() {
                    expect(imageLoader.load).not.toHaveBeenCalled();
                });
            });
        });

        describe('activate', function() {
            beforeEach(function() {
                jasmine.clock().tick(250);
                delete card.campaign.viewUrls.fired;

                card.emit('activate');
            });

            it('should fire the tracking pixels', function() {
                expect(imageLoader.load).toHaveBeenCalledWith(...card.campaign.viewUrls.map(url => completeUrl(url, {
                    '{delay}': Date.now() - environment.loadStartTime,
                    '{context}': '',
                    '{screenWidth}': window.screen.width,
                    '{screenHeight}': window.screen.height,
                    '{playerWidth}': window.innerWidth,
                    '{playerHeight}': window.innerHeight
                })));
            });

            describe('if emitted again', function() {
                beforeEach(function() {
                    imageLoader.load.calls.reset();

                    card.emit('activate');
                });

                it('should not fire any pixels', function() {
                    expect(imageLoader.load).not.toHaveBeenCalled();
                });
            });

            describe('if the loadStartTime is unknown', function() {
                beforeEach(function() {
                    environment.loadStartTime = null;
                    imageLoader.load.calls.reset();
                    delete card.campaign.viewUrls.fired;

                    card.emit('activate');
                });

                it('should replace the {launchDelay} macro with null', function() {
                    expect(imageLoader.load).toHaveBeenCalledWith(...card.campaign.viewUrls.map(url => completeUrl(url, {
                        '{delay}': null,
                        '{context}': '',
                        '{screenWidth}': window.screen.width,
                        '{screenHeight}': window.screen.height,
                        '{playerWidth}': window.innerWidth,
                        '{playerHeight}': window.innerHeight
                    })));
                });
            });

            describe('if the minireel has no viewUrls', function() {
                beforeEach(function() {
                    delete card.campaign.viewUrls;
                    imageLoader.load.calls.reset();

                    minireel.emit('activate');
                });

                it('should do nothing', function() {
                    expect(imageLoader.load).not.toHaveBeenCalled();
                });
            });
        });
    });

    describe('ui events', function() {
        describe('interaction', function() {
            beforeEach(function() {
                controller.emit('interaction', 'the-context');
            });

            it('should fire the tracking pixels', function() {
                expect(imageLoader.load).toHaveBeenCalledWith(...card.campaign.interactionUrls.map(completeUrlWithContext({ context: 'the-context' })));
            });

            describe('if the context is different', function() {
                beforeEach(function() {
                    imageLoader.load.calls.reset();

                    controller.emit('interaction', 'the-other-context');
                });

                it('should fire the pixels again', function() {
                    expect(imageLoader.load).toHaveBeenCalledWith(...card.campaign.interactionUrls.map(completeUrlWithContext({ context: 'the-other-context' })));
                });
            });

            describe('if emitted again', function() {
                beforeEach(function() {
                    imageLoader.load.calls.reset();

                    controller.emit('interaction', 'the-context');
                });

                it('should not fire any pixels', function() {
                    expect(imageLoader.load).not.toHaveBeenCalled();
                });
            });

            describe('if the card has no q1Urls', function() {
                beforeEach(function() {
                    delete card.campaign.interactionUrls;
                    imageLoader.load.calls.reset();

                    controller.emit('interaction', 'the-context');
                });

                it('should do nothing', function() {
                    expect(imageLoader.load).not.toHaveBeenCalled();
                });
            });
        });
    });

    describe('when the AdStart event is fired', function() {
        beforeEach(function() {
            jasmine.clock().install();
            jasmine.clock().mockDate();
            card.activate();

            jasmine.clock().tick(500);

            handler.emit('AdStart', card);
        });

        afterEach(function() {
            jasmine.clock().uninstall();
        });

        it('should load the playUrls', function() {
            const urls = card.campaign.playUrls.map(url => completeUrl(url, {
                '{delay}': 500,
                '{screenWidth}': window.screen.width,
                '{screenHeight}': window.screen.height,
                '{playerWidth}': window.innerWidth,
                '{playerHeight}': window.innerHeight
            }));
            expect(imageLoader.load).toHaveBeenCalledWith(...urls);
        });

        describe('if there are no playUrls', function() {
            beforeEach(function() {
                delete card.campaign.playUrls;
                imageLoader.load.calls.reset();

                handler.emit('AdStart', card);
            });

            it('should not load any urls', function() {
                expect(imageLoader.load).not.toHaveBeenCalled();
            });
        });
    });

    describe('when the AdCount event is fired', function() {
        beforeEach(function() {
            card.activate();
            jasmine.clock().tick(3);

            handler.emit('AdCount', card);
        });

        it('should fire the pixels', function() {
            const urls = card.campaign.countUrls.map(completeUrlWithContext());
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
