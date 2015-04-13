import GoogleAnalyticsHandler from '../../../src/handlers/GoogleAnalyticsHandler.js';
import BillingHandler from '../../../src/handlers/BillingHandler.js';
import dispatcher from '../../../src/services/dispatcher.js';
import tracker from '../../../src/services/tracker.js';
import {EventEmitter} from 'events';
import CorePlayer from '../../../src/players/CorePlayer.js';
import VideoCard from '../../../src/models/VideoCard.js';
import browser from '../../../src/services/browser.js';
import RunnerPromise from '../../../lib/RunnerPromise.js';
import timer from '../../../lib/timer.js';

import {
    noop,
    defer
} from '../../../lib/utils.js';

describe('GoogleAnalyticsHandler', function() {
    let handler;
    let trckr;
    let config;
    let minireel;
    let experience;

    class MockHandler extends GoogleAnalyticsHandler {
        constructor() {
            super(...arguments);

            handler = this;
        }
    }

    class MiniReel extends EventEmitter {
        constructor() {
            super(...arguments);

            this.id = 'e-e505430acd9009';
            this.branding = 'urbantimes';
            this.title = 'My MiniReel';
            this.length = 10;
            this.currentCard = null;
            this.currentIndex = -1;
        }
    }

    beforeEach(function() {
        dispatcher.constructor();
        tracker.constructor();

        experience = { data: {} };

        trckr = tracker.get('c6mr');
        config = { accountId: '12345', clientId: 'abcde' };
        minireel = new MiniReel();

        spyOn(trckr, 'create');
        spyOn(trckr, 'set');
        spyOn(trckr, 'alias');

        dispatcher.addClient(MockHandler, minireel, config);
    });

    afterAll(function() {
        dispatcher.constructor();
        tracker.constructor();
    });

    it('should be a BillingHandler', function() {
        expect(handler).toEqual(jasmine.any(BillingHandler));
    });

    it('should create the tracker', function() {
        expect(trckr.create).toHaveBeenCalledWith(config.accountId, {
            name: 'c6mr',
            clientId: config.clientId,
            storage: 'none',
            cookieDomain: 'none'
        });
    });

    it('should set up aliases', function() {
        expect(trckr.alias).toHaveBeenCalledWith({
            category: 'eventCategory',
            action: 'eventAction',
            label: 'eventLabel',
            href: 'dimension11',
            slideCount: 'dimension4',
            slideIndex: 'dimension7',
            videoDuration: 'dimension8',
            videoSource: 'dimension9'
        });
    });

    it('should set some initial props', function() {
        expect(trckr.set).toHaveBeenCalledWith({
            checkProtocolTask: noop,
            hostname: global.parent.location.hostname,
            href: global.parent.location.href,
            slideCount: minireel.length
        });
    });

    describe('properties:', function() {
        describe('tracker', function() {
            it('should be the c6mr tracker', function() {
                expect(handler.tracker).toBe(trckr);
            });
        });
    });

    describe('handlers:', function() {
        describe('navigation :', function() {
            beforeEach(function() {
                dispatcher.addSource('navigation', minireel, ['move', 'error']);
                spyOn(trckr, 'trackPage');
            });

            describe('move', function() {
                describe('on the first slide', function() {
                    beforeEach(function() {
                        minireel.currentIndex = 0;
                        minireel.currentCard = { id: 'rc-894yrt94f34', title: 'My Card' };
                        minireel.emit('move');
                    });

                    it('should reset the sessionControl', function() {
                        expect(trckr.trackPage).toHaveBeenCalledWith(handler.getTrackingData({
                            sessionControl: 'start'
                        }));
                    });

                    describe('on subsequent visits to the first slide', function() {
                        beforeEach(function() {
                            trckr.trackPage.calls.reset();
                            minireel.emit('move');
                        });

                        it('should not set sessionControl', function() {
                            expect(trckr.trackPage).toHaveBeenCalledWith(handler.getTrackingData());
                        });
                    });
                });

                describe('on other slides', function() {
                    beforeEach(function() {
                        minireel.currentCard = { id: 'rc-8934ry8324', title: 'Hello!' };
                        minireel.currentIndex = 1;
                    });

                    it('should not set the sessionControl', function() {
                        minireel.emit('move');
                        expect(trckr.trackPage).toHaveBeenCalledWith(handler.getTrackingData());
                        trckr.trackPage.calls.reset();

                        minireel.currentIndex = 2;
                        minireel.emit('move');
                        expect(trckr.trackPage).toHaveBeenCalledWith(handler.getTrackingData());
                    });
                });

                describe('before the first slide', function() {
                    beforeEach(function() {
                        minireel.currentCard = null;
                        minireel.currentIndex = -1;
                        minireel.emit('move');
                    });

                    it('should not track anything', function() {
                        expect(trckr.trackPage).not.toHaveBeenCalled();
                    });
                });
            });

            describe('error', function() {
                let error;

                beforeEach(function() {
                    let foo;
                    try { foo.bar = 'hey'; } catch (e) { error = e; }

                    spyOn(trckr, 'trackEvent');
                    minireel.emit('error', error);
                });

                it('should send an error event', function() {
                    expect(trckr.trackEvent).toHaveBeenCalledWith(handler.getTrackingData({
                        category: 'Error',
                        label: error.message
                    }));
                });
            });
        });

        describe('video :', function() {
            let player;
            let card;

            beforeEach(function() {
                card = new VideoCard({
                    type: 'vimeo',
                    data: {
                        autoplay: true,
                        href: 'http://www.vimeo.com/384895'
                    },
                    params: {},
                    collateral: {},
                    links: {},
                    campaign: {}
                }, experience);
                player = new CorePlayer();
                player.duration = 45;

                minireel.currentCard = card;
                minireel.currentIndex = 2;

                dispatcher.addSource('video', player, [
                    'play', 'pause', 'ended', 'error',
                    'firstQuartile', 'midpoint', 'thirdQuartile', 'complete'
                ], card);
                spyOn(trckr, 'trackEvent');
            });

            describe('play', function() {
                describe('if the card is set to autoplay', function() {
                    beforeEach(function() {
                        card.data.autoplay = true;

                        player.emit('play');
                    });

                    it('should fire a nonInteraction event', function() {
                        expect(trckr.trackEvent).toHaveBeenCalledWith(handler.getVideoTrackingData(player, 'Play', true));
                    });
                });

                describe('if the card is not set to autoplay', function() {
                    beforeEach(function() {
                        card.data.autoplay = false;

                        player.emit('play');
                    });

                    it('should fire an event', function() {
                        expect(trckr.trackEvent).toHaveBeenCalledWith(handler.getVideoTrackingData(player, 'Play', false));
                    });
                });
            });

            describe('pause', function() {
                beforeEach(function() {
                    player.emit('pause');
                });

                it('should fire an event', function() {
                    expect(trckr.trackEvent).toHaveBeenCalledWith(handler.getVideoTrackingData(player, 'Pause'));
                });
            });

            describe('ended', function() {
                beforeEach(function() {
                    player.emit('ended');
                });

                it('should fire an event', function() {
                    expect(trckr.trackEvent).toHaveBeenCalledWith(handler.getVideoTrackingData(player, 'End'));
                });
            });

            describe('error', function() {
                describe('if the player has no error object', function() {
                    beforeEach(function() {
                        delete player.error;
                        player.emit('error');
                    });

                    it('should send an event with a generic error message', function() {
                        expect(trckr.trackEvent).toHaveBeenCalledWith(handler.getVideoTrackingData(player, 'Error', true, 'An unknown error occurred.'));
                    });
                });

                describe('if the error has no message', function() {
                    beforeEach(function() {
                        player.error = {};
                        player.emit('error');
                    });

                    it('should send an event with a generic error message', function() {
                        expect(trckr.trackEvent).toHaveBeenCalledWith(handler.getVideoTrackingData(player, 'Error', true, 'An unknown error occurred.'));
                    });
                });

                describe('if the error has a message', function() {
                    beforeEach(function() {
                        player.error = { message: 'Buffer failed!' };
                        player.emit('error');
                    });

                    it('should send an event with the error message', function() {
                        expect(trckr.trackEvent).toHaveBeenCalledWith(handler.getVideoTrackingData(player, 'Error', true, player.error.message));
                    });
                });
            });

            describe('firstQuartile', function() {
                beforeEach(function() {
                    player.emit('firstQuartile');
                });

                it('should send an event', function() {
                    expect(trckr.trackEvent).toHaveBeenCalledWith(handler.getVideoTrackingData(player, 'Quartile 1'));
                });
            });

            describe('midpoint', function() {
                beforeEach(function() {
                    player.emit('midpoint');
                });

                it('should send an event', function() {
                    expect(trckr.trackEvent).toHaveBeenCalledWith(handler.getVideoTrackingData(player, 'Quartile 2'));
                });
            });

            describe('thirdQuartile', function() {
                beforeEach(function() {
                    player.emit('thirdQuartile');
                });

                it('should send an event', function() {
                    expect(trckr.trackEvent).toHaveBeenCalledWith(handler.getVideoTrackingData(player, 'Quartile 3'));
                });
            });

            describe('complete', function() {
                beforeEach(function() {
                    player.emit('complete');
                });

                it('should emit an event', function() {
                    expect(trckr.trackEvent).toHaveBeenCalledWith(handler.getVideoTrackingData(player, 'Quartile 4'));
                });
            });
        });

        describe('card :', function() {
            let card;
            let player;

            beforeEach(function() {
                card = new VideoCard({
                    data: { href: 'http://www.dailymotion.com/video/38ry3d', source: 'Dailymotion', autoplay: false },
                    params: {},
                    logos: {},
                    collateral: {},
                    type: 'dailymotion',
                    id: 'rc-9823rd8932'
                }, experience);
                player = new CorePlayer();
                player.duration = 22;

                minireel.currentCard = card;
                minireel.currentIndex = 3;

                dispatcher.addSource('card', card, ['activate'], player);
                spyOn(trckr, 'trackEvent');
            });

            describe('activate', function() {
                let autoplayDeferred;

                beforeEach(function() {
                    autoplayDeferred = defer(RunnerPromise);
                    spyOn(browser, 'test').and.returnValue(autoplayDeferred.promise);
                });

                describe('if the card is set to autoplay', function() {
                    beforeEach(function() {
                        card.data.autoplay = true;
                        card.emit('activate');
                    });

                    it('should test to see if the device can autoplay', function() {
                        expect(browser.test).toHaveBeenCalledWith('autoplay');
                    });

                    describe('if the browser can autoplay', function() {
                        let waitDeferred;

                        beforeEach(function(done) {
                            waitDeferred = defer(RunnerPromise);

                            autoplayDeferred.promise.then(done, done);
                            autoplayDeferred.fulfill(true);
                            spyOn(timer, 'wait').and.returnValue(waitDeferred.promise);
                        });

                        it('should track an event', function() {
                            expect(trckr.trackEvent).toHaveBeenCalledWith(handler.getVideoTrackingData(player, 'AutoPlayAttempt', true));
                        });

                        describe('if the video plays before 5 seconds', function() {
                            beforeEach(function(done) {
                                trckr.trackEvent.calls.reset();
                                player.emit('play');
                                waitDeferred.fulfill(player);
                                waitDeferred.promise.then(done, done);
                            });

                            it('should not fire any events', function() {
                                expect(trckr.trackEvent).not.toHaveBeenCalled();
                            });
                        });

                        describe('if the video does not play before 5 seconds', function() {
                            beforeEach(function(done) {
                                trckr.trackEvent.calls.reset();
                                waitDeferred.fulfill();
                                waitDeferred.promise.then(() => {}).then(done, done);
                            });

                            it('should fire an error event', function() {
                                expect(trckr.trackEvent).toHaveBeenCalledWith(handler.getVideoTrackingData(player, 'Error', true, 'Video play timed out.'));
                            });
                        });
                    });

                    describe('if the browser can\'t autoplay', function() {
                        beforeEach(function(done) {
                            autoplayDeferred.promise.then(done, done);
                            autoplayDeferred.fulfill(false);
                        });

                        it('should not track an event', function() {
                            expect(trckr.trackEvent).not.toHaveBeenCalled();
                        });
                    });
                });

                describe('if the card is not set to autoplay', function() {
                    beforeEach(function() {
                        card.data.autoplay = false;
                        card.emit('activate');
                    });

                    it('should not bother testing for autoplay', function() {
                        expect(browser.test).not.toHaveBeenCalled();
                    });

                    it('should not track an event', function() {
                        expect(trckr.trackEvent).not.toHaveBeenCalled();
                    });
                });
            });
        });

        describe('AdCount', function() {
            let card;
            let player;

            beforeEach(function() {
                card = new VideoCard({
                    data: {
                        href: 'https://www.youtube.com/watch?v=839rr4f4'
                    },
                    collateral: {},
                    params: {},
                    logos: {},
                    type: 'youtube',
                    id: 'rc-q9438htrf9'
                }, experience);
                player = new CorePlayer();
                player.duration = 33;

                minireel.currentCard = card;
                minireel.currentIndex = 6;
                spyOn(trckr, 'trackEvent');

                handler.emit('AdCount', card, player);
            });

            it('should send an event', function() {
                expect(trckr.trackEvent).toHaveBeenCalledWith(handler.getVideoTrackingData(player, 'AdCount', true));
            });
        });
    });

    describe('methods:', function() {
        describe('getTrackingData(data)', function() {
            let result;
            let card, params;

            beforeEach(function() {
                card = {
                    id: 'rc-dec185bad0c8ee',
                    title: 'The Very Best Video'
                };

                params = {
                    action: 'foo',
                    label: 'bar'
                };

                minireel.currentCard = card;
                minireel.currentIndex = 3;

                spyOn(trckr, 'trackEvent');

                result = handler.getTrackingData(params);
            });

            it('should return something containing the params', function() {
                expect(result).toEqual(jasmine.objectContaining(params));
            });

            it('should return something containing additional data', function() {
                expect(result).toEqual(jasmine.objectContaining({
                    page: '/mr/' + minireel.id + '/' + card.id + '/?ix=3&bd=urbantimes',
                    title: minireel.title + ' - ' + card.title,
                    slideIndex: 3
                }));
            });

            describe('if no params are provided', function() {
                beforeEach(function() {
                    result = handler.getTrackingData();
                });

                it('should still work', function() {
                    expect(result).toEqual({
                        page: '/mr/' + minireel.id + '/'+card.id+'/?ix=3&bd=urbantimes',
                        title: minireel.title + ' - ' + card.title,
                        slideIndex: 3
                    });
                });
            });

            describe('if there is no currentCard', function() {
                beforeEach(function() {
                    minireel.currentCard = null;
                    minireel.currentIndex = -1;
                    result = handler.getTrackingData();
                });

                it('should return data for the MiniReel', function() {
                    expect(result).toEqual({
                        page: '/mr/' + minireel.id + '/?bd=urbantimes',
                        title: minireel.title,
                        slideIndex: -1
                    });
                });
            });

            describe('if the card has no id', function() {
                beforeEach(function() {
                    delete card.id;
                    result = handler.getTrackingData();
                });

                it('should return data for the MiniReel', function() {
                    expect(result).toEqual({
                        page: '/mr/' + minireel.id + '/?bd=urbantimes',
                        title: minireel.title,
                        slideIndex: 3
                    });
                });
            });

            describe('if analyticsConfig has been set',function() {
                beforeEach(function() {
                    config.context = 'howard1';
                    config.container = 'cont1';
                    config.group = 'grp1';
                });
                it('should use all if set',function() {
                    expect(handler.getTrackingData())
                        .toEqual(jasmine.objectContaining({
                            page: `/mr/${minireel.id}/${card.id}/?cx=howard1&ct=cont1&gp=grp1&ix=3&bd=urbantimes`,
                        }));
                });
                it('should use container if set',function() {
                    delete config.group;
                    expect(handler.getTrackingData())
                        .toEqual(jasmine.objectContaining({
                            page: `/mr/${minireel.id}/${card.id}/?cx=howard1&ct=cont1&ix=3&bd=urbantimes`,
                        }));
                });
                it('should use context if set',function() {
                    delete config.group;
                    delete config.container;
                    expect(handler.getTrackingData())
                        .toEqual(jasmine.objectContaining({
                            page: `/mr/${minireel.id}/${card.id}/?cx=howard1&ix=3&bd=urbantimes`,
                        }));
                });

                it('should set context without card',function() {
                    minireel.currentCard = null;
                    minireel.currentIndex = -1;

                    expect(handler.getTrackingData())
                        .toEqual(jasmine.objectContaining({
                            page: `/mr/${minireel.id}/?cx=howard1&ct=cont1&gp=grp1&bd=urbantimes`,
                        }));
                });
            });
        });

        describe('getVideoTrackingData(player, event, nonInteractive, label)', function() {
            let result;
            let player;
            let card;

            beforeEach(function() {
                player = { duration: 30 };
                card = minireel.currentCard = { data: { href: 'http://www.youtube.com/watch?v=39ru43r', source: 'YouTube', type: 'youtube' } };
                minireel.currentIndex = 2;
            });

            describe('if only the player and event are specified', function() {
                beforeEach(function() {
                    result = handler.getVideoTrackingData(player, 'Play');
                });

                it('should be the tracking data with defaults', function() {
                    expect(result).toEqual(handler.getTrackingData({
                        category: 'Video',
                        action: 'Play',
                        label: card.data.href,
                        videoSource: card.data.source,
                        videoDuration: player.duration,
                        nonInteraction: 0
                    }));
                });

                describe('if the card has no href', function() {
                    beforeEach(function() {
                        delete card.data.href;
                        result = handler.getVideoTrackingData(player, 'Pause');
                    });

                    it('should set the label to null', function() {
                        expect(result.label).toBe('null');
                    });
                });

                describe('if the card has no source', function() {
                    beforeEach(function() {
                        delete card.data.source;
                        result = handler.getVideoTrackingData(player, 'Play');
                    });

                    it('should set the videoSource to the type', function() {
                        expect(result.videoSource).toBe(card.data.type);
                    });
                });
            });

            describe('if nonInteractive is specified', function() {
                describe('if true', function() {
                    beforeEach(function() {
                        result = handler.getVideoTrackingData(player, 'Ended', true);
                    });

                    it('should set nonInteraction to 1', function() {
                        expect(result.nonInteraction).toBe(1);
                    });
                });

                describe('if false', function() {
                    beforeEach(function() {
                        result = handler.getVideoTrackingData(player, 'Ended', false);
                    });

                    it('should set nonInteraction to 0', function() {
                        expect(result.nonInteraction).toBe(0);
                    });
                });
            });

            describe('if the label is specified', function() {
                beforeEach(function() {
                    result = handler.getVideoTrackingData(player, 'Play', false, 'My Label');
                });

                it('should set the label', function() {
                    expect(result.label).toBe('My Label');
                });
            });
        });
    });
});
