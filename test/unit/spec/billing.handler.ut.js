import BillingHandler from '../../../src/handlers/BillingHandler.js';
import dispatcher from '../../../src/services/dispatcher.js';
import CorePlayer from '../../../src/players/CorePlayer.js';
import VideoCard from '../../../src/models/VideoCard.js';

describe('ADTECHHandler', function() {
    let card;
    let player;
    let handler;

    class MockHandler extends BillingHandler {
        constructor() {
            super(...arguments);

            handler = this;
        }
    }

    beforeEach(function() {
        dispatcher.constructor();
        dispatcher.addClient(MockHandler);

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
        });

        dispatcher.addSource('video', player, ['timeupdate', 'play', 'complete'], card);
    });

    afterAll(function() {
        dispatcher.constructor();
    });

    describe('when the video plays', function() {
        let spy;

        beforeEach(function() {
            spy = jasmine.createSpy('spy()');
            handler.on('AdClick', spy);

            player.emit('play');
        });

        describe('if the video plays again', function() {
            beforeEach(function() {
                spy.calls.reset();
                player.emit('play');
            });

            it('should not fire the event again', function() {
                expect(spy).not.toHaveBeenCalled();
            });

            describe('if another video plays again', function() {
                beforeEach(function() {
                    card = new VideoCard({
                        id: 'rc-9eb79b81bfd932',
                        type: 'youtube',
                        data: {},
                        params: {},
                        links: {},
                        collateral: {},
                        campaign: {
                            minViewTime: 7,
                            clickUrls: ['img1.jpg', 'img2.jpg']
                        }
                    });
                    player = new CorePlayer();

                    dispatcher.addSource('video', player, ['play'], card);

                    player.emit('play');
                });

                it('should fire the event', function() {
                    expect(spy).toHaveBeenCalledWith(card, player);
                });
            });
        });

        it('should fire the event', function() {
            expect(spy).toHaveBeenCalledWith(card, player);
        });
    });

    describe('as the video plays back', function() {
        let spy;

        beforeEach(function() {
            spy = jasmine.createSpy('spy()');
            handler.on('AdCount', spy);
        });

        describe('if the minViewTime is less than 1', function() {
            beforeEach(function() {
                card.campaign.minViewTime = 0;

                [0, 1.2, 3, 4, 6, 7, 9, 11, 13].forEach(time => {
                    player.currentTime = time;
                    player.emit('timeupdate');
                });
            });

            it('should not fire any pixels', function() {
                expect(spy).not.toHaveBeenCalled();
            });
        });

        describe('if the minViewTime is greater than 0', function() {
            beforeEach(function() {
                card.campaign.minViewTime = 9;
            });

            describe('before the minViewTime is reached', function() {
                beforeEach(function() {
                    [0, 1, 2, 3, 4, 5, 6, 7, 8, 8.99].forEach(time => {
                        player.currentTime = time;
                        player.emit('timeupdate');
                    });
                });

                it('should not fire any pixels', function() {
                    expect(spy).not.toHaveBeenCalled();
                });
            });

            describe('after the minViewTime is reached', function() {
                beforeEach(function() {
                    [8, 9, 10, 11].forEach(time => {
                        player.currentTime = time;
                        player.emit('timeupdate');
                    });
                });

                it('should fire the event once', function() {
                    expect(spy).toHaveBeenCalledWith(card, player);
                    expect(spy.calls.count()).toBe(1);
                });
            });
        });
    });

    describe('when the video is complete', function() {
        let spy;

        beforeEach(function() {
            spy = jasmine.createSpy('spy()');
            handler.on('AdCount', spy);
        });

        describe('if the minViewTime is less than 0', function() {
            beforeEach(function() {
                card.campaign.minViewTime = -1;
                player.emit('complete');
            });

            it('should fire the event', function() {
                expect(spy).toHaveBeenCalledWith(card, player);
            });

            describe('if called again', function() {
                beforeEach(function() {
                    spy.calls.reset();
                    player.emit('complete');
                });

                it('should not fire the event', function() {
                    expect(spy).not.toHaveBeenCalled();
                });

                describe('if called with another card', function() {
                    beforeEach(function() {
                        card.id = 'rc-74472cdbed2e93';
                        player.emit('complete');
                    });

                    it('should fire the pixels', function() {
                        expect(spy).toHaveBeenCalledWith(card, player);
                    });
                });
            });
        });

        describe('if the minViewTime is greater than -1', function() {
            beforeEach(function() {
                card.campaign.minViewTime = 0;
                player.emit('complete');
            });

            it('should not fire the countUrls', function() {
                expect(spy).not.toHaveBeenCalled();
            });
        });
    });
});
