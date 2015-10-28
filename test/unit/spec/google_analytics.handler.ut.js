import GoogleAnalyticsHandler from '../../../src/handlers/GoogleAnalyticsHandler.js';
import BillingHandler from '../../../src/handlers/BillingHandler.js';
import dispatcher from '../../../src/services/dispatcher.js';
import tracker from '../../../src/services/tracker.js';
import {EventEmitter} from 'events';
import CorePlayer from '../../../src/players/CorePlayer.js';
import VideoCard from '../../../src/models/VideoCard.js';
import RunnerPromise from '../../../lib/RunnerPromise.js';
import timer from '../../../lib/timer.js';
import Runner from '../../../lib/Runner.js';
import environment from '../../../src/environment.js';

import {
    noop,
    defer,
    extend
} from '../../../lib/utils.js';

describe('GoogleAnalyticsHandler', function() {
    let handler;
    let trckr;
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
        environment.constructor();

        experience = { data: {} };

        trckr = tracker.get('c6mr');
        minireel = new MiniReel();

        spyOn(trckr, 'create');
        spyOn(trckr, 'set');
        spyOn(trckr, 'alias');

        spyOn(Date, 'now').and.returnValue(new Date().getTime());
        spyOn(trckr, 'trackTiming');
        global.performance = {
            timing: {
                domLoading: Date.now() - 2005
            }
        };
        environment.initTime = Date.now() - 450;
        environment.params = {
            context: 'some-context',
            container: 'pocketmath',
            group: 'my-group',
            ex: 'some-experiment',
            vr: 'some-variant',
            campaign: 'cam-fu439ryh483r',
            experience: 'e-jdn8239yr84'
        };

        environment.ancestorOrigins = ['http://localhost:8000', 'http://cinema6.com', 'http://minireel.tv'];
        environment.hostname = 'cinema6.com';

        spyOn(GoogleAnalyticsHandler.prototype, 'getAccountID').and.returnValue('UA-44457821-10');

        Runner.run(() => dispatcher.addClient(MockHandler, minireel));
    });

    afterAll(function() {
        dispatcher.constructor();
        tracker.constructor();
        environment.constructor();
    });

    it('should be a BillingHandler', function() {
        expect(handler).toEqual(jasmine.any(BillingHandler));
    });

    it('should create the tracker', function() {
        expect(trckr.create).toHaveBeenCalledWith(handler.getAccountID(), {
            name: 'c6mr',
            storage: 'none',
            cookieDomain: 'none'
        });
    });

    it('should set up aliases', function() {
        expect(trckr.alias).toHaveBeenCalledWith({
            category: 'eventCategory',
            action: 'eventAction',
            label: 'eventLabel',
            origins: 'dimension11',
            value: 'eventValue'
        });
    });

    it('should set some initial props', function() {
        expect(trckr.set).toHaveBeenCalledWith({
            checkProtocolTask: noop,
            hostname: environment.hostname,
            origins: environment.ancestorOrigins.join('|')
        });
    });

    describe('properties:', function() {
        describe('config', function() {
            it('should be formulated from the environment', function() {
                expect(handler.config).toEqual({
                    context: environment.params.context,
                    container: environment.params.container,
                    group: environment.params.group,
                    experiment: environment.params.ex,
                    variant: environment.params.vr
                });
            });
        });

        describe('tracker', function() {
            it('should be the c6mr tracker', function() {
                expect(handler.tracker).toBe(trckr);
            });
        });

        describe('account', function() {
            it('should be an object with configuration', function() {
                expect(handler.account).toEqual({
                    id: 'UA-44457821',
                    min: 31,
                    max: 35
                });
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
                    id: 'rc-fd1d2c315e50af',
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
                    'attemptPlay', 'play', 'pause', 'ended', 'error',
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
                    player.currentTime = 45.234;
                    player.emit('complete');
                });

                it('should emit an event', function() {
                    expect(trckr.trackEvent).toHaveBeenCalledWith(handler.getVideoTrackingData(player, 'Quartile 4'));
                });

                it('should track the "Played" event', function() {
                    expect(trckr.trackEvent).toHaveBeenCalledWith(extend(handler.getVideoTrackingData(player, 'Played'), {
                        value: Math.round(player.currentTime)
                    }));
                });

                describe('if it was already emitted', function() {
                    beforeEach(function() {
                        trckr.trackEvent.calls.reset();
                        player.emit('complete');
                    });

                    it('should not emit the event again', function() {
                        expect(trckr.trackEvent).not.toHaveBeenCalledWith(jasmine.objectContaining({
                            category: 'Video',
                            action: 'Played'
                        }));
                    });
                });
            });
        });

        describe('card :', function() {
            let player;
            let card;

            beforeEach(function() {
                card = new VideoCard({
                    id: 'rc-fd1d2c315e50af',
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

                dispatcher.addSource('card', card, ['activate', 'deactivate'], player);
                spyOn(trckr, 'trackEvent');
            });

            describe('activate', function() {
                beforeEach(function() {
                    spyOn(player, 'once').and.callThrough();

                    card.emit('activate');
                });

                it('should listen for "attemptPlay" on the player', function() {
                    expect(player.once).toHaveBeenCalledWith('attemptPlay', jasmine.any(Function));
                });

                describe('if the card is not set to autoplay', function() {
                    beforeEach(function() {
                        player.once.calls.reset();
                        card.data.autoplay = false;

                        card.emit('activate');
                    });

                    it('should not listen for the "attemptPlay" event', function() {
                        expect(player.once).not.toHaveBeenCalledWith('attemptPlay', jasmine.any(Function));
                    });
                });

                describe('if another card is activated before the previous player emitted "attemptPlay"', function() {
                    let newCard;
                    let newPlayer;

                    beforeEach(function() {
                        newCard = new VideoCard({
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
                        newPlayer = new CorePlayer();
                        newPlayer.duration = 45;

                        dispatcher.addSource('card', newCard, ['activate', 'deactivate'], newPlayer);

                        minireel.currentCard = newCard;
                        minireel.currentIndex = 3;

                        newCard.emit('activate');

                        player.emit('attemptPlay');
                    });

                    it('should not track an event if the previous player emits "attemptPlay"', function() {
                        expect(trckr.trackEvent).not.toHaveBeenCalled();
                    });
                });

                describe('if the player emits "attemptPlay"', function() {
                    let waitDeferred;

                    beforeEach(function() {
                        waitDeferred = defer(RunnerPromise);
                        spyOn(timer, 'wait').and.returnValue(waitDeferred.promise);

                        player.emit('attemptPlay');
                    });

                    it('should track an event', function() {
                        expect(trckr.trackEvent).toHaveBeenCalledWith(handler.getVideoTrackingData(player, 'AutoPlayAttempt', true));
                    });

                    describe('if the video plays before 5 seconds', function() {
                        beforeEach(function(done) {
                            player.emit('play');
                            waitDeferred.fulfill(player);
                            Promise.resolve(waitDeferred.promise).then(done, done);
                        });

                        it('should not fire an error event', function() {
                            expect(trckr.trackEvent).not.toHaveBeenCalledWith(handler.getVideoTrackingData(player, 'Error', true, 'Video play timed out.'));
                        });
                    });

                    describe('if the video does not play before 5 seconds', function() {
                        beforeEach(function(done) {
                            trckr.trackEvent.calls.reset();
                            waitDeferred.fulfill();
                            Promise.resolve(waitDeferred.promise).then(() => {}).then(done, done);
                        });

                        it('should fire an error event', function() {
                            expect(trckr.trackEvent).toHaveBeenCalledWith(handler.getVideoTrackingData(player, 'Error', true, 'Video play timed out.'));
                        });
                    });
                });
            });

            describe('deactivate', function() {
                describe('if the player\'s currentTime is less than 1', function() {
                    beforeEach(function() {
                        player.currentTime = 0.99999;

                        card.emit('deactivate');
                    });

                    it('should not track an event', function() {
                        expect(trckr.trackEvent).not.toHaveBeenCalledWith(jasmine.objectContaining({
                            category: 'Video',
                            action: 'Played'
                        }));
                    });
                });

                describe('if the player\'s currentTime is greater than or equal to 1', function() {
                    beforeEach(function() {
                        player.currentTime = 1;

                        card.emit('deactivate');
                    });

                    it('should track the Played event', function() {
                        expect(trckr.trackEvent).toHaveBeenCalledWith(extend(handler.getVideoTrackingData(player, 'Played'), { value: player.currentTime }));
                    });

                    describe('and it is a float', function() {
                        beforeEach(function() {
                            trckr.trackEvent.calls.reset();
                            card.id = 'rc-0d9e3681de5bcf';
                            player.currentTime = 3.675;

                            card.emit('deactivate');
                        });

                        it('should convert the currentTime into an int', function() {
                            expect(trckr.trackEvent).toHaveBeenCalledWith(jasmine.objectContaining({
                                value: Math.round(player.currentTime)
                            }));
                        });
                    });
                });

                describe('if the Played event has already been fired', function() {
                    beforeEach(function() {
                        player.currentTime = 10;
                        card.emit('deactivate');
                        expect(trckr.trackEvent).toHaveBeenCalledWith(jasmine.objectContaining({
                            action: 'Played'
                        }));

                        trckr.trackEvent.calls.reset();
                        player.currentTime = 15;
                        card.emit('deactivate');
                    });

                    it('should not fire the event again', function() {
                        expect(trckr.trackEvent).not.toHaveBeenCalledWith(jasmine.objectContaining({
                            category: 'Video',
                            action: 'Played'
                        }));
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
                expect(trckr.trackEvent).toHaveBeenCalledWith(handler.getVideoTrackingData(player, 'AdCount'));
            });
        });
    });

    describe('methods:', function() {
        describe('getAccountID()', function() {
            let result;

            beforeEach(function() {
                handler.getAccountID.and.callThrough();

                result = handler.getAccountID();
            });

            it('should return a GA account ID', function() {
                expect(result).toMatch(/^UA-44457821-3[1-5]$/);
            });
        });

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

                handler.config = {};

                result = handler.getTrackingData(params);
            });

            it('should return something containing the params', function() {
                expect(result).toEqual(jasmine.objectContaining(params));
            });

            it('should return something containing additional data', function() {
                expect(result).toEqual(jasmine.objectContaining({
                    page: '/mr/' + minireel.id + '/' + card.id + '/?ix=3&bd=urbantimes',
                    title: minireel.title + ' - ' + card.title
                }));
            });

            describe('if no params are provided', function() {
                beforeEach(function() {
                    result = handler.getTrackingData();
                });

                it('should still work', function() {
                    expect(result).toEqual({
                        page: '/mr/' + minireel.id + '/'+card.id+'/?ix=3&bd=urbantimes',
                        title: minireel.title + ' - ' + card.title
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
                        title: minireel.title
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
                        title: minireel.title
                    });
                });
            });

            describe('if analyticsConfig has been set',function() {
                beforeEach(function() {
                    handler.config.experiment = null;
                    handler.config.variant = null;
                    handler.config.context = 'howard1';
                    handler.config.container = 'cont1';
                    handler.config.group = 'grp1';
                });
                it('should use all if set',function() {
                    expect(handler.getTrackingData())
                        .toEqual(jasmine.objectContaining({
                            page: `/mr/${minireel.id}/${card.id}/?cx=howard1&ct=cont1&gp=grp1&ix=3&bd=urbantimes`,
                        }));
                });
                it('should use container if set',function() {
                    handler.config.group = undefined;
                    expect(handler.getTrackingData())
                        .toEqual(jasmine.objectContaining({
                            page: `/mr/${minireel.id}/${card.id}/?cx=howard1&ct=cont1&ix=3&bd=urbantimes`,
                        }));
                });
                it('should use context if set',function() {
                    handler.config.group = undefined;
                    handler.config.container = undefined;
                    expect(handler.getTrackingData())
                        .toEqual(jasmine.objectContaining({
                            page: `/mr/${minireel.id}/${card.id}/?cx=howard1&ix=3&bd=urbantimes`,
                        }));
                });

                it('should use experiment and variant if set', function() {
                    handler.config.group = undefined;
                    handler.config.container = undefined;
                    handler.config.experiment = 'my-experiment';
                    handler.config.variant = 'my-variant';

                    expect(handler.getTrackingData())
                        .toEqual(jasmine.objectContaining({
                            page: `/mr/${minireel.id}/${card.id}/?cx=howard1&ex=my-experiment&vr=my-variant&ix=3&bd=urbantimes`,
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
