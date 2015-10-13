import MoatHandler from '../../../src/handlers/MoatHandler.js';
import moatApi from '../../../src/services/moat.js';
import dispatcher from '../../../src/services/dispatcher.js';
import CorePlayer from '../../../src/players/CorePlayer.js';
import VideoCard from '../../../src/models/VideoCard.js';
import environment from '../../../src/environment.js';

describe('MoatHandler', function() {
    let handler;

    class MockHandler extends MoatHandler {
        constructor() {
            super(...arguments);
            handler = this;
        }
    }

    beforeEach(function() {
        spyOn(moatApi,'initTracker');
        spyOn(moatApi,'dispatchEvent');

        environment.params = {
            container: 'jun'
        };

        moatApi.constructor();
        dispatcher.constructor();
        dispatcher.addClient(MockHandler);
    });

    afterAll(function() {
        dispatcher.constructor();
        moatApi.constructor();
    });

    describe('handlers:', function() {
        describe('video :', function() {
            let experience;
            let card;
            let player;

            beforeEach(function() {
                experience = {
                    data: {}
                };

                card = new VideoCard({
                    id: 'rc-abc123',
                    type: 'vimeo',
                    data: {
                        autoplay: true,
                        href: 'http://www.vimeo.com/384895',
                        moat: {
                            campaign  : 'Guinness Hooley',
                            creative  : 'The Black & Blonde'
                        }
                    },
                    sponsored: true,
                    params: {
                        sponsor: 'Guinness'
                    },
                    collateral: {},
                    links: {},
                    campaign: { }
                }, experience);
                player = new CorePlayer();
                player.duration = 45;
                player.volume = 0.5;
                player.muted = false;
                player.element = {
                    childNodes : [ {} ]
                };

                dispatcher.addSource('video', player, [
                    'loadedmetadata', 'play', 'pause', 'ended', 'error',
                    'firstQuartile', 'midpoint', 'thirdQuartile', 'complete'
                ], card);

                dispatcher.addSource('card', card, [ 'deactivate' ], player);
            });

            describe('loadedmetadata', function() {
                it('should initialize a tracker, if card is sponsored', function() {
                    player.emit('loadedmetadata');
                    expect(moatApi.initTracker).toHaveBeenCalledWith(
                        'rc-abc123',player.element,{
                            'level1' : 'Guinness',
                            'level2' : 'Guinness Hooley',
                            'level3' : 'The Black & Blonde',
                            'slicer1' : 'localhost',
                            'slicer2' : 'jun'
                        },45
                    );
                });

                it('should not initialize a tracker, if card is NOT sponsored',function(){
                    card.data.moat = null;
                    player.emit('loadedmetadata');
                    expect(moatApi.initTracker).not.toHaveBeenCalled();
                });
            });

            describe('videoEvent',function(){
                beforeEach(function(){
                    player.emit('loadedmetadata');
                });

                it('sends AdVideoStart for play',function(){
                    player.emit('play');
                    expect(moatApi.dispatchEvent).toHaveBeenCalledWith(
                        'rc-abc123',{ type : 'AdVideoStart', adVolume: 0.5 } );
                });

                it('sends AdVideoFirstQuartile for play',function(){
                    player.emit('firstQuartile');
                    expect(moatApi.dispatchEvent).toHaveBeenCalledWith(
                        'rc-abc123',{ type : 'AdVideoFirstQuartile', adVolume: 0.5 } );
                });

                it('sends AdVideoMidpoint for play',function(){
                    player.emit('midpoint');
                    expect(moatApi.dispatchEvent).toHaveBeenCalledWith(
                        'rc-abc123',{ type : 'AdVideoMidpoint', adVolume: 0.5 } );
                });

                it('sends AdVideoThirdQuartile for play',function(){
                    player.emit('thirdQuartile');
                    expect(moatApi.dispatchEvent).toHaveBeenCalledWith(
                        'rc-abc123',{ type : 'AdVideoThirdQuartile', adVolume: 0.5 } );
                });

                it('sends AdVideoComplete for play',function(){
                    player.emit('complete');
                    expect(moatApi.dispatchEvent).toHaveBeenCalledWith(
                        'rc-abc123',{ type : 'AdVideoComplete', adVolume: 0.5 } );
                });

                it('sends AdVideoComplete for play with volume 0 if player is muted',function(){
                    player.muted = true;
                    player.emit('complete');
                    expect(moatApi.dispatchEvent).toHaveBeenCalledWith(
                        'rc-abc123',{ type : 'AdVideoComplete', adVolume: 0 } );
                });

                it('sends AdVideoComplete for play with volume 0.5 if player.muted is undefined',function(){
                    delete player.muted;
                    player.emit('complete');
                    expect(moatApi.dispatchEvent).toHaveBeenCalledWith(
                        'rc-abc123',{ type : 'AdVideoComplete', adVolume: 0.5 } );
                });

                it('sends AdStopped for card deactivate',function(){
                    card.emit('deactivate');
                    expect(moatApi.dispatchEvent).toHaveBeenCalledWith(
                        'rc-abc123',{ type : 'AdStopped', adVolume: 0.5 } );
                });
            });
        });
    });
});
