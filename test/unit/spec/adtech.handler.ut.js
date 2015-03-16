import ADTECHHandler from '../../../src/handlers/ADTECHHandler.js';
import dispatcher from '../../../src/services/dispatcher.js';
import CorePlayer from '../../../src/players/CorePlayer.js';
import VideoCard from '../../../src/models/VideoCard.js';
import imageLoader from '../../../src/services/image_loader.js';

describe('ADTECHHandler', function() {
    let card;
    let player;

    beforeEach(function() {
        dispatcher.constructor();
        dispatcher.addClient(ADTECHHandler);

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
        beforeEach(function() {
            spyOn(imageLoader, 'load');
            player.emit('play');
        });

        describe('if the video plays again', function() {
            beforeEach(function() {
                imageLoader.load.calls.reset();
                player.emit('play');
            });

            it('should not fire the pixel again', function() {
                expect(imageLoader.load).not.toHaveBeenCalled();
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

                it('should fire the clickUrls', function() {
                    expect(imageLoader.load).toHaveBeenCalledWith(...card.campaign.clickUrls);
                });
            });
        });

        it('should load the clickUrls', function() {
            expect(imageLoader.load).toHaveBeenCalledWith(...card.campaign.clickUrls);
        });

        describe('if there are no click urls', function() {
            beforeEach(function() {
                dispatcher.removeClient(ADTECHHandler);
                dispatcher.addClient(ADTECHHandler);
                delete card.campaign.clickUrls;
                imageLoader.load.calls.reset();

                player.emit('play');
            });

            it('should not load any urls', function() {
                expect(imageLoader.load).not.toHaveBeenCalled();
            });
        });
    });

    describe('as the video plays back', function() {
        beforeEach(function() {
            spyOn(imageLoader, 'load');
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
                expect(imageLoader.load).not.toHaveBeenCalled();
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
                    expect(imageLoader.load).not.toHaveBeenCalled();
                });
            });

            describe('after the minViewTime is reached', function() {
                beforeEach(function() {
                    [8, 9, 10, 11].forEach(time => {
                        player.currentTime = time;
                        player.emit('timeupdate');
                    });
                });

                it('should fire the pixels once', function() {
                    expect(imageLoader.load).toHaveBeenCalledWith(...card.campaign.countUrls);
                    expect(imageLoader.load.calls.count()).toBe(1);
                });

                describe('if there are no countUrls', function() {
                    beforeEach(function() {
                        imageLoader.load.calls.reset();
                        dispatcher.removeClient(ADTECHHandler);
                        dispatcher.addClient(ADTECHHandler);
                        delete card.campaign.countUrls;

                        player.currentTime = 9;
                        player.emit('timeupdate');
                    });

                    it('should not fire any pixels', function() {
                        expect(imageLoader.load).not.toHaveBeenCalled();
                    });
                });
            });
        });
    });

    describe('when the video is complete', function() {
        beforeEach(function() {
            spyOn(imageLoader, 'load');
        });

        describe('if the minViewTime is less than 0', function() {
            beforeEach(function() {
                card.campaign.minViewTime = -1;
                player.emit('complete');
            });

            it('should fire the countUrls', function() {
                expect(imageLoader.load).toHaveBeenCalledWith(...card.campaign.countUrls);
            });

            describe('if called again', function() {
                beforeEach(function() {
                    imageLoader.load.calls.reset();
                    player.emit('complete');
                });

                it('should not fire any pixels', function() {
                    expect(imageLoader.load).not.toHaveBeenCalled();
                });

                describe('if called with another card', function() {
                    beforeEach(function() {
                        card.id = 'rc-74472cdbed2e93';
                        player.emit('complete');
                    });

                    it('should fire the pixels', function() {
                        expect(imageLoader.load).toHaveBeenCalledWith(...card.campaign.countUrls);
                    });
                });
            });

            describe('if there are no countUrls', function() {
                beforeEach(function() {
                    dispatcher.removeClient(ADTECHHandler);
                    dispatcher.addClient(ADTECHHandler);
                    imageLoader.load.calls.reset();
                    delete card.campaign.countUrls;

                    player.emit('complete');
                });

                it('should not fire any pixels', function() {
                    expect(imageLoader.load).not.toHaveBeenCalled();
                });
            });
        });

        describe('if the minViewTime is greater than -1', function() {
            beforeEach(function() {
                card.campaign.minViewTime = 0;
                player.emit('complete');
            });

            it('should not fire the countUrls', function() {
                expect(imageLoader.load).not.toHaveBeenCalled();
            });
        });
    });
});
