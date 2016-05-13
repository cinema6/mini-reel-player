import BillingHandler from '../../../src/handlers/BillingHandler.js';
import dispatcher from '../../../src/services/dispatcher.js';
import CorePlayer from '../../../src/players/CorePlayer.js';
import VideoCard from '../../../src/models/VideoCard.js';
import ShowcaseCard from '../../../src/models/ShowcaseCard.js';

describe('BillingHandler', function() {
    let card, showcase;
    let experience;
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

        experience = { data: {} };

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
        showcase = new ShowcaseCard({
            id: 'rc-6d51e674680718',
            data: {},
            params: {},
            links: {},
            collateral: {},
            campaign: {
                minViewTime: 0
            }
        });

        dispatcher.addSource('video', player, ['timeupdate', 'play', 'complete'], card);
        dispatcher.addSource('showcase-card', showcase, ['activate', 'deactivate']);
    });

    afterAll(function() {
        dispatcher.constructor();
    });

    describe('when the showcase card is deactivated', function() {
        beforeEach(function() {
            showcase.emit('deactivate');
        });

        it('should do nothing', function() {});
    });

    describe('when the showcase card is activated', function() {
        let AdCount, AdStart;

        beforeEach(function() {
            AdCount = jasmine.createSpy('AdCount()');
            AdStart = jasmine.createSpy('AdStart()');
            handler.on('AdCount', AdCount);
            handler.on('AdStart', AdStart);

            showcase.emit('activate');
        });

        it('should emit AdCount', function() {
            expect(AdCount).toHaveBeenCalledWith(showcase, null);
        });

        it('should emit AdStart', function() {
            expect(AdStart).toHaveBeenCalledWith(showcase, null);
        });

        describe('again', function() {
            beforeEach(function() {
                AdCount.calls.reset();
                AdStart.calls.reset();

                showcase.emit('activate');
            });

            it('should not emit AdCount', function() {
                expect(AdCount).not.toHaveBeenCalled();
                expect(AdStart).not.toHaveBeenCalled();
            });
        });

        describe('if the minViewTime is greater than 0', function() {
            beforeEach(function(done) {
                AdCount.calls.reset();
                showcase.id = 'rc-jfw9hru4r';
                showcase.campaign.minViewTime = 3;

                jasmine.clock().install();

                showcase.emit('activate');
                Promise.resolve().then(done);
            });

            afterEach(function() {
                jasmine.clock().uninstall();
            });

            it('should not emit AdCount', function() {
                expect(AdCount).not.toHaveBeenCalled();
            });

            describe('before the minViewTime is reached', function() {
                beforeEach(function(done) {
                    jasmine.clock().tick(2999);
                    Promise.resolve().then(done);
                });

                it('should not emit AdCount', function() {
                    expect(AdCount).not.toHaveBeenCalled();
                });

                describe('if the card is deactivated', function() {
                    beforeEach(function(done) {
                        showcase.emit('deactivate');

                        jasmine.clock().tick(1);
                        Promise.resolve().then(done);
                    });

                    it('should not emit AdCount', function() {
                        expect(AdCount).not.toHaveBeenCalled();
                    });
                });
            });

            describe('when the minViewTime is reached', function() {
                beforeEach(function(done) {
                    jasmine.clock().tick(3000);
                    Promise.resolve().then(done);
                });

                it('should emit AdCount', function() {
                    expect(AdCount).toHaveBeenCalledWith(showcase, null);
                });
            });
        });
    });

    describe('when the video plays', function() {
        let spy;

        beforeEach(function() {
            spy = jasmine.createSpy('spy()');
            handler.on('AdStart', spy);

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
                    }, experience);
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
