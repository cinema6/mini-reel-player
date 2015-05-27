import JumpRampHandler from '../../../src/handlers/JumpRampHandler.js';
import BillingHandler from '../../../src/handlers/BillingHandler.js';
import CorePlayer from '../../../src/players/CorePlayer.js';
import VideoCard from '../../../src/models/VideoCard.js';
import dispatcher from '../../../src/services/dispatcher.js';
import fetcher from '../../../lib/fetcher.js';
import {EventEmitter} from 'events';

describe('JumpRampHandler', function() {
    let card;
    let experience;
    let player;
    let handler;
    let minireel;

    class MockHandler extends JumpRampHandler {
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
        minireel = new MiniReel();
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
        dispatcher.addSource('navigation', minireel, ['move','close']);
    });

    afterAll(function() {
        dispatcher.constructor();
    });

    it('should be a BillingHandler', function() {
        expect(handler).toEqual(jasmine.any(BillingHandler));
    });

    describe('when the AdCount event is fired', function() {
        beforeEach(function() {
            spyOn(fetcher,'get');
            handler.emit('AdCount', card);
        });

        it('should fire the pixels', function() {
            expect(fetcher.get).toHaveBeenCalledWith('http://webview_message/complete');
        });
    });

    describe('when the MiniReel close is fired',function(){
        beforeEach(function() {
            spyOn(fetcher,'get');
            minireel.emit('close', minireel);
        });

        it('should fire the pixels', function() {
            expect(fetcher.get).toHaveBeenCalledWith('http://webview_message/close');
        });
    });

    describe('when the video completes', function() {
        beforeEach(function() {
            spyOn(fetcher, 'get');
        });

        describe('if the card is sposnored', function() {
            beforeEach(function() {
                card.sponsor = 'Buy n Large';

                player.emit('complete');
            });

            it('should fire the sponsor complete URL', function() {
                expect(fetcher.get).toHaveBeenCalledWith('http://webview_message/complete/sponsor');
            });
        });

        describe('if the card is not sposnored', function() {
            beforeEach(function() {
                card.sponsor = null;

                player.emit('complete');
            });

            it('should fire the content complete URL', function() {
                expect(fetcher.get).toHaveBeenCalledWith('http://webview_message/complete/content');
            });
        });
    });
});
