import VPAIDHandler from '../../../src/handlers/VPAIDHandler.js';
import BillingHandler from '../../../src/handlers/BillingHandler.js';
import dispatcher from '../../../src/services/dispatcher.js';
import { EventEmitter } from 'events';
import CorePlayer from '../../../src/players/CorePlayer.js';

class MockPlayer extends CorePlayer {
    constructor() {
        super(...arguments);

        this.duration = 0;
        this.currentTime = 0;
    }

    play() {}
    pause() {}
}

class MockCard extends EventEmitter {
    constructor() {
        super();

        this.campaign = {
            minViewTime: 3
        };
    }
}

class MockSession extends EventEmitter {
    ping() {}
}

class MockMiniReel extends EventEmitter {
    constructor() {
        super();

        this.embed = new MockSession();
    }
}

describe('VPAIDHandler', function() {
    let handler;
    let minireel, video, card, session;

    class MyHandler extends VPAIDHandler {
        constructor() {
            super(...arguments);
            handler = this;
        }
    }

    beforeEach(function() {
        minireel = new MockMiniReel();
        video = new MockPlayer();
        card = new MockCard();
        session = minireel.embed;

        dispatcher.addClient(MyHandler, minireel.embed);

        dispatcher.addSource('navigation', minireel, ['init', 'error', 'close']);
        dispatcher.addSource('session', session, ['ready', 'vpaid:pauseAd', 'vpaid:resumeAd']);
        dispatcher.addSource('card', card, ['complete', 'becameUnskippable', 'becameSkippable', 'skippableProgress'], video);
        dispatcher.addSource('card', card, ['clickthrough']);
        dispatcher.addSource('video', video, ['play', 'pause', 'loadedmetadata', 'timeupdate', 'firstQuartile', 'midpoint', 'thirdQuartile', 'complete'], card);
    });

    afterEach(function() {
        dispatcher.removeClient(MyHandler);
    });

    it('should be a BillingHandler', function() {
        expect(handler).toEqual(jasmine.any(BillingHandler));
    });

    describe('events:', function() {
        describe('navigation:', function() {
            describe('close', function() {
                beforeEach(function(done) {
                    spyOn(session, 'ping');

                    minireel.emit('close');
                    setTimeout(done, 0);
                });

                it('should ping the session', function() {
                    expect(session.ping).toHaveBeenCalledWith('vpaid:stateUpdated', {
                        event: 'AdUserClose'
                    });
                });
            });
        });

        describe('session:', function() {
            describe('vpaid:pauseAd', function() {
                beforeEach(function() {
                    spyOn(video, 'pause');

                    session.emit('vpaid:pauseAd');
                });

                it('should call pause() on the video', function() {
                    expect(video.pause).toHaveBeenCalled();
                });

                describe('if emitted before a video has been added', function() {
                    beforeEach(function() {
                        dispatcher.removeClient(MyHandler);
                        dispatcher.addClient(MyHandler);
                        video.pause.calls.reset();

                        session.emit('vpaid:pauseAd');
                        dispatcher.addSource('video', video, ['play', 'pause', 'loadedmetadata', 'firstQuartile', 'midpoint', 'thirdQuartile', 'complete'], card);
                    });

                    it('should call the method once it has been', function() {
                        expect(video.pause).toHaveBeenCalled();
                    });
                });
            });

            describe('vpaid:resumeAd', function() {
                beforeEach(function() {
                    spyOn(video, 'play');

                    session.emit('vpaid:resumeAd');
                });

                it('should call play() on the video', function() {
                    expect(video.play).toHaveBeenCalled();
                });

                describe('if emitted before a video has been added', function() {
                    beforeEach(function() {
                        dispatcher.removeClient(MyHandler);
                        dispatcher.addClient(MyHandler);

                        session.emit('vpaid:resumeAd');
                        dispatcher.addSource('video', video, ['play', 'pause', 'loadedmetadata', 'firstQuartile', 'midpoint', 'thirdQuartile', 'complete'], card);
                    });

                    it('should call the method once it has been', function() {
                        expect(video.play).toHaveBeenCalled();
                    });
                });
            });
        });

        describe('card:', function() {
            describe('becameUnskippable', function() {
                beforeEach(function(done) {
                    spyOn(session, 'ping');

                    card.emit('becameUnskippable');
                    setTimeout(done, 0);
                });

                it('should ping the session', function() {
                    expect(session.ping).toHaveBeenCalledWith('vpaid:stateUpdated', {
                        prop: 'adSkippableState',
                        value: false,
                        event: 'AdSkippableStateChange'
                    });
                });
            });

            describe('becameSkippable', function() {
                beforeEach(function(done) {
                    spyOn(session, 'ping');

                    card.emit('becameSkippable');
                    setTimeout(done, 0);
                });

                it('should ping the session', function() {
                    expect(session.ping).toHaveBeenCalledWith('vpaid:stateUpdated', {
                        prop: 'adSkippableState',
                        value: true,
                        event: 'AdSkippableStateChange'
                    });
                });
            });

            describe('clickthrough', function() {
                let event;

                beforeEach(function(done) {
                    event = {
                        link: { uri: 'https://www.facebook.com/Hyundai', tracking: [] },
                        type: 'Facebook',
                        context: 'some-context',
                        coordinates: { x: 200, y: 300 }
                    };
                    spyOn(session, 'ping');

                    card.emit('clickthrough', event);
                    setTimeout(done, 0);
                });

                it('should ping the session', function() {
                    expect(session.ping).toHaveBeenCalledWith('vpaid:stateUpdated', {
                        event: 'AdClickThru',
                        params: [event.link.uri, event.type, false]
                    });
                });

                describe('if a different link type is clicked', function() {
                    beforeEach(function(done) {
                        session.ping.calls.reset();
                        event.type = 'Twitter';

                        card.emit('clickthrough', event);
                        setTimeout(done, 0);
                    });

                    it('should ping the session', function() {
                        expect(session.ping).toHaveBeenCalledWith('vpaid:stateUpdated', {
                            event: 'AdClickThru',
                            params: [event.link.uri, event.type, false]
                        });
                    });
                });

                describe('if the same link type is clicked again', function() {
                    beforeEach(function(done) {
                        session.ping.calls.reset();

                        card.emit('clickthrough', event);
                        setTimeout(done, 0);
                    });

                    it('should ping the session', function() {
                        expect(session.ping).toHaveBeenCalledWith('vpaid:stateUpdated', {
                            event: 'AdClickThru',
                            params: [event.link.uri, event.type, false]
                        });
                    });
                });
            });
        });

        describe('video:', function() {
            describe('loadedmetadata', function() {
                beforeEach(function(done) {
                    spyOn(session, 'ping');

                    video.duration = 35;
                    video.emit('loadedmetadata');
                    setTimeout(done, 0);
                });

                it('should ping the session twice', function() {
                    expect(session.ping).toHaveBeenCalledWith('vpaid:stateUpdated', {
                        prop: 'adDuration',
                        value: 35,
                        event: 'AdDurationChange'
                    });
                    expect(session.ping).toHaveBeenCalledWith('vpaid:stateUpdated', {
                        prop: 'adRemainingTime',
                        value: 35,
                        event: 'AdRemainingTimeChange'
                    });
                });
            });

            describe('play', function() {
                beforeEach(function() {
                    spyOn(session, 'ping');
                });

                describe('if the video has not been paused', function() {
                    beforeEach(function(done) {
                        session.ping.calls.reset();
                        video.emit('play');

                        setTimeout(done, 0);
                    });

                    it('should not ping the "AdPlaying" event', function() {
                        expect(session.ping).not.toHaveBeenCalledWith('vpaid:stateUpdated', jasmine.objectContaining({
                            event: 'AdPlaying'
                        }));
                    });
                });

                describe('if the video has been paused', function() {
                    beforeEach(function(done) {
                        video.emit('pause');
                        session.ping.calls.reset();
                        video.emit('play');

                        setTimeout(done, 0);
                    });

                    it('should ping the "AdPlaying" event', function() {
                        expect(session.ping).toHaveBeenCalledWith('vpaid:stateUpdated', {
                            event: 'AdPlaying'
                        });
                    });
                });
            });

            describe('pause', function() {
                beforeEach(function() {
                    spyOn(session, 'ping');
                });

                describe('if pauseAd() has not been called', function() {
                    beforeEach(function(done) {
                        video.emit('pause');
                        setTimeout(done, 0);
                    });

                    it('should ping the "AdPaused" event', function() {
                        expect(session.ping).toHaveBeenCalledWith('vpaid:stateUpdated', {
                            event: 'AdPaused'
                        });
                    });
                });

                describe('if pauseAd() has been called', function() {
                    beforeEach(function(done) {
                        session.emit('vpaid:pauseAd');
                        video.emit('pause');
                        setTimeout(done, 0);
                    });

                    it('should ping the "AdPaused" event', function() {
                        expect(session.ping).toHaveBeenCalledWith('vpaid:stateUpdated', {
                            event: 'AdPaused'
                        });
                    });
                });
            });

            describe('timeupdate', function() {
                beforeEach(function() {
                    spyOn(session, 'ping');

                    video.duration = 30;
                    video.currentTime = 7;
                    video.emit('timeupdate');
                });

                it('should ping the session', function() {
                    expect(session.ping).toHaveBeenCalledWith('vpaid:stateUpdated', {
                        prop: 'adRemainingTime',
                        value: video.duration - video.currentTime,
                        event: 'AdRemainingTimeChange'
                    });
                });

                describe('if the currentTime exceeds the duration', function() {
                    beforeEach(function() {
                        session.ping.calls.reset();
                        video.currentTime = 31;

                        video.emit('timeupdate');
                    });

                    it('should ping the session with adRemainingTime: 0', function() {
                        expect(session.ping).toHaveBeenCalledWith('vpaid:stateUpdated', {
                            prop: 'adRemainingTime',
                            value: 0,
                            event: 'AdRemainingTimeChange'
                        });
                    });
                });

                describe('if the duration is unknown', function() {
                    beforeEach(function() {
                        session.ping.calls.reset();
                        video.duration = 0;

                        video.emit('timeupdate');
                    });

                    it('should not ping the session', function() {
                        expect(session.ping).not.toHaveBeenCalled();
                    });
                });
            });

            describe('firstQuartile', function() {
                beforeEach(function(done) {
                    spyOn(session, 'ping');

                    video.emit('firstQuartile');
                    setTimeout(done, 0);
                });

                it('should ping the session', function() {
                    expect(session.ping).toHaveBeenCalledWith('vpaid:stateUpdated', {
                        event: 'AdVideoFirstQuartile'
                    });
                });
            });

            describe('midpoint', function() {
                beforeEach(function(done) {
                    spyOn(session, 'ping');

                    video.emit('midpoint');
                    setTimeout(done, 0);
                });

                it('should ping the session', function() {
                    expect(session.ping).toHaveBeenCalledWith('vpaid:stateUpdated', {
                        event: 'AdVideoMidpoint'
                    });
                });
            });

            describe('thirdQuartile', function() {
                beforeEach(function(done) {
                    spyOn(session, 'ping');

                    video.emit('thirdQuartile');
                    setTimeout(done, 0);
                });

                it('should ping the session', function() {
                    expect(session.ping).toHaveBeenCalledWith('vpaid:stateUpdated', {
                        event: 'AdVideoThirdQuartile'
                    });
                });
            });

            describe('complete', function() {
                beforeEach(function(done) {
                    spyOn(session, 'ping');

                    video.emit('complete');
                    setTimeout(done, 0);
                });

                it('should ping the session', function() {
                    expect(session.ping).toHaveBeenCalledWith('vpaid:stateUpdated', {
                        event: 'AdVideoComplete'
                    });
                });
            });
        });

        describe('self:', function() {
            describe('AdStart', function() {
                beforeEach(function(done) {
                    spyOn(session, 'ping');
                    video.duration = 60;

                    handler.emit('AdStart', card, video);
                    setTimeout(done, 0);
                });

                it('should ping the session', function() {
                    expect(session.ping).toHaveBeenCalledWith('vpaid:stateUpdated', {
                        event: 'AdVideoStart'
                    });
                });

                describe('if there is no player', function() {
                    beforeEach(function() {
                        session.ping.calls.reset();

                        handler.emit('AdStart', card, null);
                    });

                    it('should do nothing', function() {});
                });

                describe('if the duration is unknown', function() {
                    beforeEach(function() {
                        session.ping.calls.reset();
                        video.duration = NaN;

                        handler.emit('AdStart', card, video);
                    });

                    it('should not ping the session', function() {
                        expect(session.ping).not.toHaveBeenCalled();
                    });

                    describe('when the metadata is loaded', function() {
                        beforeEach(function() {
                            video.duration = 60;
                            video.emit('loadedmetadata');
                        });

                        it('should ping the session', function() {
                            expect(session.ping).toHaveBeenCalledWith('vpaid:stateUpdated', {
                                event: 'AdVideoStart'
                            });
                        });
                    });
                });
            });
        });
    });
});
