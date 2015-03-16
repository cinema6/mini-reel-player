import CorePlayer from '../../../src/players/CorePlayer.js';
import View from '../../../lib/core/View.js';
import PlayerPosterView from '../../../src/views/PlayerPosterView.js';
import Runner from '../../../lib/Runner.js';

describe('CorePlayer', function() {
    let player;

    beforeEach(function() {
        player = new CorePlayer();
    });

    it('should be a view', function() {
        expect(player).toEqual(jasmine.any(View));
    });

    describe('properties:', function() {
        describe('tag', function() {
            it('should be "div"', function() {
                expect(player.tag).toBe('div');
            });
        });

        describe('poster', function() {
            it('should be null', function() {
                expect(player.poster).toBeNull();
            });
        });

        describe('classes', function() {
            it('should include "playerBox"', function() {
                expect(player.classes).toEqual(new View().classes.concat(['playerBox']));
            });
        });
    });

    describe('event handlers:', function() {
        describe('timeupdate', function() {
            describe('firing quartile events', function() {
                let firstQuartile, midpoint, thirdQuartile;

                beforeEach(function() {
                    firstQuartile = jasmine.createSpy('firstQuartile()');
                    midpoint = jasmine.createSpy('midpoint()');
                    thirdQuartile = jasmine.createSpy('thirdQuartile()');

                    player.on('firstQuartile', firstQuartile);
                    player.on('midpoint', midpoint);
                    player.on('thirdQuartile', thirdQuartile);
                });

                it('should not occur if duration is 0', function() {
                    player.duration = 0;
                    player.currentTime = 0;
                    player.emit('timeupdate');

                    [firstQuartile, midpoint, thirdQuartile].forEach(spy => expect(spy).not.toHaveBeenCalled());
                });

                it('firstQuartile should be fired only once when 25% of the player has been watched', function() {
                    player.duration = 40;
                    player.currentTime = 10;
                    player.emit('timeupdate');

                    expect(firstQuartile).toHaveBeenCalled();
                    firstQuartile.calls.reset();

                    player.currentTime = 10.1013;
                    player.emit('timeupdate');
                    expect(firstQuartile).not.toHaveBeenCalled();

                    player.currentTime = 10.2113;
                    player.emit('timeupdate');
                    expect(firstQuartile).not.toHaveBeenCalled();
                });

                it('midpoint should be fired only once when 50% of the player has been watched', function() {
                    player.duration = 40;
                    player.currentTime = 20;
                    player.emit('timeupdate');

                    expect(midpoint).toHaveBeenCalled();
                    midpoint.calls.reset();

                    player.currentTime = 20.1013;
                    player.emit('timeupdate');
                    expect(midpoint).not.toHaveBeenCalled();

                    player.currentTime = 20.2113;
                    player.emit('timeupdate');
                    expect(midpoint).not.toHaveBeenCalled();
                });

                it('thirdQuartile should be fired only once when 75% of the player has been watched', function() {
                    player.duration = 40;
                    player.currentTime = 30;
                    player.emit('timeupdate');

                    expect(thirdQuartile).toHaveBeenCalled();
                    thirdQuartile.calls.reset();

                    player.currentTime = 30.1013;
                    player.emit('currentTime');
                    expect(thirdQuartile).not.toHaveBeenCalled();

                    player.currentTime = 30.2113;
                    player.emit('currentTime');
                    expect(thirdQuartile).not.toHaveBeenCalled();
                });

                it('should fire all quartiles that exist between start and current time', function() {
                    player.duration = 40;
                    player.currentTime = 39;
                    player.emit('timeupdate');

                    expect(firstQuartile).toHaveBeenCalled();
                    expect(midpoint).toHaveBeenCalled();
                    expect(thirdQuartile).toHaveBeenCalled();
                });
            });

            describe('complete event', function() {
                let complete;

                beforeEach(function() {
                    complete = jasmine.createSpy('complete()');
                    player.on('complete', complete);

                    player.duration = 60;
                });

                describe('when duration is 0', function() {
                    it('should not fire', function() {
                        player.duration = 0;
                        player.currentTime = 0;
                        player.emit('timeupdate');

                        expect(complete).not.toHaveBeenCalled();
                    });
                });

                describe('before one second before the end of the player', function() {
                    beforeEach(function() {
                        [1, 4, 7, 19, 34, 55, 58.99999].forEach(function(time) {
                            player.currentTime = time;
                            player.emit('timeupdate');
                        });
                    });

                    it('should not fire the complete event', function() {
                        expect(complete).not.toHaveBeenCalled();
                    });
                });

                describe('one second before the player ends', function() {
                    beforeEach(function() {
                        player.currentTime = 59;
                        player.emit('timeupdate');
                    });

                    it('should fire the complete event', function() {
                        expect(complete).toHaveBeenCalled();
                    });
                });

                describe('after one second before the player ends', function() {
                    beforeEach(function() {
                        player.currentTime = 59.2;
                        player.emit('timeupdate');
                    });

                    it('should fire the complete event', function() {
                        expect(complete).toHaveBeenCalled();
                    });

                    it('should fire the pixel once', function() {
                        complete.calls.reset();
                        player.currentTime = 59.5;
                        player.emit('timeupdate');

                        expect(complete).not.toHaveBeenCalled();
                    });
                });
            });
        });
    });

    describe('hooks:', function() {
        describe('didCreateElement()', function() {
            let posterView;

            beforeEach(function() {
                player.poster = 'https://i.ytimg.com/vi/B5FcZrg_Nuo/maxresdefault.jpg';

                spyOn(PlayerPosterView.prototype, 'setImage').and.callThrough();
                spyOn(player, 'append').and.callThrough();
                Runner.run(() => player.create());
                posterView = player.append.calls.mostRecent().args[0];
            });

            it('should append a view for its poster', function() {
                expect(player.append).toHaveBeenCalledWith(jasmine.any(PlayerPosterView));
            });

            it('should set the poster\'s image', function() {
                expect(posterView.setImage).toHaveBeenCalledWith(player.poster);
            });

            describe('when the poster is changed', function() {
                beforeEach(function() {
                    posterView.setImage.calls.reset();

                    Runner.run(() => player.poster = 'https://i.ytimg.com/vi/B5FcZrg_Nuo/low.jpg');
                });

                it('should set the poster\'s image again', function() {
                    expect(posterView.setImage).toHaveBeenCalledWith(player.poster);
                });
            });
        });
    });
});
