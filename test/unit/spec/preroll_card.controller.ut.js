import PrerollCardController from '../../../src/controllers/PrerollCardController.js';
import ViewController from '../../../src/controllers/ViewController.js';
import VASTPlayer from '../../../src/players/VASTPlayer.js';
import { EventEmitter } from 'events';
import CardView from '../../../src/views/CardView.js';
import View from '../../../lib/core/View.js';
import environment from '../../../src/environment.js';
import Runner from '../../../lib/Runner.js';

describe('PrerollCardController', function() {
    let PrerollCardCtrl;
    let card;

    beforeAll(function() {
        jasmine.clock().install();
    });

    beforeEach(function() {
        environment.constructor();
        jasmine.clock().mockDate();

        card = new EventEmitter();
        card.data = {
            videoid: 'http://ads.adaptv.advertising.com//a/h/DCQzzI0K2rv1k0TZythPvTfWmlP8j6NQnxBMIgFJa80=?cb={cachebreaker}&pageUrl={pageUrl}&eov=eov'
        };
        card.setPlaybackState = jasmine.createSpy('card.setPlaybackState()');
        card.complete = jasmine.createSpy('card.complete()');

        environment.debug = false;

        PrerollCardCtrl = new PrerollCardController(card);
        PrerollCardCtrl.view = new CardView();
    });

    afterAll(function() {
        environment.constructor();
        jasmine.clock().uninstall();
    });

    it('should exist', function() {
        expect(PrerollCardCtrl).toEqual(jasmine.any(ViewController));
    });

    describe('properties:', function() {
        describe('model', function() {
            it('should be the provided model', function() {
                expect(PrerollCardCtrl.model).toBe(card);
            });
        });

        describe('player', function() {
            it('should be a VASTPlayer', function() {
                expect(PrerollCardCtrl.player).toEqual(jasmine.any(VASTPlayer));
            });

            describe('.src', function() {
                it('should be the card\'s videoid with the dynamic segments replaced', function() {
                    expect(PrerollCardCtrl.player.src).toBe(`http://ads.adaptv.advertising.com//a/h/DCQzzI0K2rv1k0TZythPvTfWmlP8j6NQnxBMIgFJa80=?cb=${Date.now()}&pageUrl=${encodeURIComponent(environment.href)}&eov=eov`);
                });

                describe('in debug mode', function() {
                    beforeEach(function() {
                        environment.debug = true;

                        PrerollCardCtrl = new PrerollCardController(card);
                    });

                    it('should make the {pageUrl} "mutantplayground.com"', function() {
                        expect(PrerollCardCtrl.player.src).toBe(`http://ads.adaptv.advertising.com//a/h/DCQzzI0K2rv1k0TZythPvTfWmlP8j6NQnxBMIgFJa80=?cb=${Date.now()}&pageUrl=${encodeURIComponent('mutantplayground.com')}&eov=eov`);
                    });
                });
            });

            describe('.controls', function() {
                it('should be false', function() {
                    expect(PrerollCardCtrl.player.controls).toBe(false);
                });
            });
        });
    });

    describe('events:', function() {
        describe('model:', function() {
            describe('activate', function() {
                beforeEach(function() {
                    spyOn(PrerollCardCtrl.view, 'show');
                    spyOn(PrerollCardCtrl.player, 'play');

                    card.emit('activate');
                });

                it('should show the view', function() {
                    expect(PrerollCardCtrl.view.show).toHaveBeenCalled();
                });

                it('should play() the player', function() {
                    expect(PrerollCardCtrl.player.play).toHaveBeenCalled();
                });

                it('should not complete() the card', function() {
                    expect(card.complete).not.toHaveBeenCalled();
                });

                describe('if there was an error', function() {
                    beforeEach(function() {
                        PrerollCardCtrl.player.emit('error');
                        card.complete.calls.reset();
                        PrerollCardCtrl.view.show.calls.reset();
                        PrerollCardCtrl.player.play.calls.reset();

                        card.emit('activate');
                    });

                    it('should complete() the card', function() {
                        expect(card.complete).toHaveBeenCalled();
                    });

                    it('should not show() the view', function() {
                        expect(PrerollCardCtrl.view.show).not.toHaveBeenCalled();
                    });

                    it('should not play() the player', function() {
                        expect(PrerollCardCtrl.player.play).not.toHaveBeenCalled();
                    });

                    describe('the next time the video is loaded', function() {
                        beforeEach(function() {
                            Runner.run(() => card.emit('deactivate'));
                            card.complete.calls.reset();

                            card.emit('activate');
                        });

                        it('should not complete() the card', function() {
                            expect(card.complete).not.toHaveBeenCalled();
                        });
                    });
                });
            });

            describe('deactivate', function() {
                beforeEach(function() {
                    spyOn(PrerollCardCtrl.view, 'hide');
                    spyOn(PrerollCardCtrl.player, 'unload');

                    card.emit('deactivate');
                });

                it('should hide the view', function() {
                    expect(PrerollCardCtrl.view.hide).toHaveBeenCalled();
                });

                it('should unload the player', function() {
                    expect(PrerollCardCtrl.player.unload).toHaveBeenCalled();
                });
            });

            describe('prepare', function() {
                beforeEach(function() {
                    spyOn(PrerollCardCtrl.player, 'load');

                    card.emit('prepare');
                });

                it('should load() the player', function() {
                    expect(PrerollCardCtrl.player.load).toHaveBeenCalled();
                });
            });
        });

        describe('player:', function() {
            describe('timeupdate', function() {
                beforeEach(function() {
                    Object.defineProperty(PrerollCardCtrl.player, 'currentTime', { value: 5 });
                });

                describe('if the duration is 0', function() {
                    beforeEach(function() {
                        Object.defineProperty(PrerollCardCtrl.player, 'duration', { value: 0 });

                        PrerollCardCtrl.player.emit('timeupdate');
                    });

                    it('should not setPlaybackState()', function() {
                        expect(card.setPlaybackState).not.toHaveBeenCalled();
                    });
                });

                describe('if the duration is not 0', function() {
                    beforeEach(function() {
                        Object.defineProperty(PrerollCardCtrl.player, 'duration', { value: 900 });
                        PrerollCardCtrl.player.emit('timeupdate');
                    });

                    it('should setPlaybackState()', function() {
                        expect(card.setPlaybackState).toHaveBeenCalledWith({
                            currentTime: PrerollCardCtrl.player.currentTime,
                            duration: PrerollCardCtrl.player.duration
                        });
                    });
                });
            });

            describe('ended', function() {
                beforeEach(function() {
                    PrerollCardCtrl.player.emit('ended');
                });

                it('should complete() the card', function() {
                    expect(card.complete).toHaveBeenCalled();
                });
            });

            describe('error', function() {
                beforeEach(function() {
                    PrerollCardCtrl.player.emit('error');
                });

                it('should complete() the card', function() {
                    expect(card.complete).toHaveBeenCalled();
                });
            });
        });
    });

    describe('methods:', function() {
        describe('renderInto(view)', function() {
            let view;

            beforeEach(function() {
                view = new View();
                spyOn(ViewController.prototype, 'renderInto');
                spyOn(PrerollCardCtrl.view, 'hide');
                PrerollCardCtrl.view.playerOutlet = new View();
                spyOn(PrerollCardCtrl.view.playerOutlet, 'append');

                PrerollCardCtrl.renderInto(view);
            });

            it('should call super()', function() {
                expect(ViewController.prototype.renderInto).toHaveBeenCalledWith(view);
            });

            it('should hide its view', function() {
                expect(PrerollCardCtrl.view.hide).toHaveBeenCalled();
            });

            it('should append the player to the playerOutlet', function() {
                expect(PrerollCardCtrl.view.playerOutlet.append).toHaveBeenCalledWith(PrerollCardCtrl.player);
            });
        });
    });
});
