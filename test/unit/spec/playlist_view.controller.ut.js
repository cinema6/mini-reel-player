import PlaylistViewController from '../../../src/controllers/PlaylistViewController.js';
import ViewController from '../../../src/controllers/ViewController.js';
import MiniReel from '../../../src/models/MiniReel.js';
import PlaylistView from '../../../src/views/PlaylistView.js';
import VideoCard from '../../../src/models/VideoCard.js';

describe('PlaylistViewController', function() {
    let PlaylistViewCtrl;
    let minireel;

    beforeEach(function() {
        minireel = new MiniReel();
        spyOn(PlaylistViewController.prototype, 'addListeners').and.callThrough();

        PlaylistViewCtrl = new PlaylistViewController(minireel);
    });

    it('should exist', function() {
        expect(PlaylistViewCtrl).toEqual(jasmine.any(ViewController));
    });

    it('should add listeners', function() {
        expect(PlaylistViewCtrl.addListeners).toHaveBeenCalled();
    });

    describe('properties:', function() {
        describe('minireel', function() {
            it('should be the minireel', function() {
                expect(PlaylistViewCtrl.minireel).toBe(minireel);
            });
        });

        describe('view', function() {
            it('should be a PlaylistView', function() {
                expect(PlaylistViewCtrl.view).toEqual(jasmine.any(PlaylistView));
            });
        });

        describe('enabled', function() {
            it('should be true', function() {
                expect(PlaylistViewCtrl.enabled).toBe(true);
            });
        });

        describe('expanded', function() {
            it('should be true', function() {
                expect(PlaylistViewCtrl.expanded).toBe(true);
            });
        });
    });

    describe('events:', function() {
        describe('minireel', function() {
            describe('init', function() {
                beforeEach(function() {
                    spyOn(PlaylistViewCtrl, 'updateView');

                    minireel.campaign = {};
                    minireel.emit('init');
                });

                it('should update its view', function() {
                    expect(PlaylistViewCtrl.updateView).toHaveBeenCalled();
                });
            });

            describe('move', function() {
                beforeEach(function() {
                    spyOn(PlaylistViewCtrl, 'updateView');

                    minireel.emit('move');
                });

                it('should update its view', function() {
                    expect(PlaylistViewCtrl.updateView).toHaveBeenCalled();
                });
            });
        });

        describe('view', function() {
            describe('selectCard', function() {
                beforeEach(function() {
                    minireel.deck = [
                        { id: 'rc-d7c122d05ce1e8' },
                        { id: 'rc-17c1c7892d4687' },
                        { id: 'rc-f1c802c30365ae' }
                    ];
                    spyOn(minireel, 'moveTo');

                    PlaylistViewCtrl.view.emit('selectCard', minireel.deck[1].id);
                });

                it('should move to the card with the given id', function() {
                    expect(minireel.moveTo).toHaveBeenCalledWith(minireel.deck[1]);
                });
            });
        });
    });

    describe('methods:', function() {
        describe('private', function() {
            describe('formatTitle', function() {
                function format(input) {
                    return PlaylistViewCtrl.__private__.formatTitle(input);
                }

                it('should truncate strings longer than 100 characters', function() {
                    const input = 'Once upon a time, there was a unit test which contained this sentence, which was 101 characters long.';
                    expect(input.length).toBe(101);
                    expect(format(input)).toBe('Once upon a time, there was a unit test which contained this sentence, which was 101 characters long...');
                });

                it('should not truncate string shorter than 100 characters', function() {
                    const input = 'However the unit test also needed an 100 character long sentence, and so this one was made. The End.';
                    expect(input.length).toBe(100);
                    expect(format(input)).toBe('However the unit test also needed an 100 character long sentence, and so this one was made. The End.');
                });

                it('should not format falsy titles', function() {
                    expect(format(null)).toBe(null);
                    expect(format(undefined)).toBe(undefined);
                });
            });
        });

        describe('hide()', function() {
            beforeEach(function() {
                spyOn(PlaylistViewCtrl.view, 'hide');

                PlaylistViewCtrl.hide();
            });

            it('should hide its view', function() {
                expect(PlaylistViewCtrl.view.hide).toHaveBeenCalled();
            });
        });

        describe('show()', function() {
            beforeEach(function() {
                spyOn(PlaylistViewCtrl.view, 'show');

                PlaylistViewCtrl.show();
            });

            it('should hide its view', function() {
                expect(PlaylistViewCtrl.view.show).toHaveBeenCalled();
            });
        });

        describe('disable()', function() {
            beforeEach(function() {
                PlaylistViewCtrl.enabled = true;
                spyOn(PlaylistViewCtrl, 'updateView');

                PlaylistViewCtrl.disable();
            });

            it('should set enabled to false', function() {
                expect(PlaylistViewCtrl.enabled).toBe(false);
            });

            it('should call updateView()', function() {
                expect(PlaylistViewCtrl.updateView).toHaveBeenCalled();
            });
        });

        describe('enable()', function() {
            beforeEach(function() {
                PlaylistViewCtrl.enabled = false;
                spyOn(PlaylistViewCtrl, 'updateView');

                PlaylistViewCtrl.enable();
            });

            it('should set enabled to true', function() {
                expect(PlaylistViewCtrl.enabled).toBe(true);
            });

            it('should call updateView()', function() {
                expect(PlaylistViewCtrl.updateView).toHaveBeenCalled();
            });
        });

        describe('contract()', function() {
            beforeEach(function() {
                PlaylistViewCtrl.expanded = true;
                spyOn(PlaylistViewCtrl, 'updateView');

                PlaylistViewCtrl.contract();
            });

            it('should set expanded to false', function() {
                expect(PlaylistViewCtrl.expanded).toBe(false);
            });

            it('should call updateView()', function() {
                expect(PlaylistViewCtrl.updateView).toHaveBeenCalled();
            });
        });

        describe('expand()', function() {
            beforeEach(function() {
                PlaylistViewCtrl.expanded = false;
                spyOn(PlaylistViewCtrl, 'updateView');

                PlaylistViewCtrl.expand();
            });

            it('should set expanded to true', function() {
                expect(PlaylistViewCtrl.expanded).toBe(true);
            });

            it('should call updateView()', function() {
                expect(PlaylistViewCtrl.updateView).toHaveBeenCalled();
            });
        });

        describe('updateView()', function() {
            beforeEach(function() {
                const experience = { data: {} };

                minireel.deck = [
                    new VideoCard({
                        id: 'rc-f1c802c30365ae',
                        title: 'Card1',
                        note: null,
                        thumbs: { small: 'a-small-thumb.jpg' },
                        data: {
                            href: 'http://www.videos.com/j8d33',
                            source: 'YouTube',
                            hideSource: false
                        },
                        links: {},
                        ad: false
                    }, experience),
                    new VideoCard({
                        id: 'rc-d7c122d05ce1e8',
                        title: 'Card2',
                        note: 'Hey!',
                        thumbs: { small: 'foo/thumb.jpg' },
                        data: {
                            href: 'http://www.videos.com/84rh39f4',
                            source: 'Vimeo',
                            hideSource: true
                        },
                        sponsored: true,
                        params: {},
                        collateral: {},
                        links: {
                            Website: { uri: 'http://my-sponsor.com', tracking: [] }
                        },
                        sponsor: 'Buy n Large',
                        ad: true
                    }, experience),
                    new VideoCard({
                        id: 'rc-17c1c7892d4687',
                        title: 'Card3',
                        note: null,
                        thumbs: { small: 'bar.png' },
                        data: {
                            href: 'http://www.videos.com/893hf4',
                            source: 'Dailymotion',
                            hideSource: false
                        },
                        ad: false
                    }, experience),
                    new VideoCard({
                        id: 'rc-697981c41ad8f5',
                        title: 'Last Card!',
                        note: null,
                        thumbs: { small: 'cinema6.com/image' },
                        data: {
                            href: 'http://www.videos.com/903hf439',
                            hideSource: false
                        },
                        sponsored: true,
                        params: {},
                        collateral: {},
                        links: {
                            Website: { uri: 'http://my-sponsor.org', tracking: [] }
                        },
                        sponsor: 'Nintendo',
                        ad: true
                    }, experience)
                ];
                minireel.currentCard = minireel.deck[1];
                minireel.currentIndex = 1;
                minireel.length = 15;

                spyOn(PlaylistViewCtrl.view, 'update');

                PlaylistViewCtrl.updateView();
            });

            it('should update its view', function() {
                expect(PlaylistViewCtrl.view.update).toHaveBeenCalledWith({
                    cardNumber: 2,
                    total: 15,
                    enabled: jasmine.any(Boolean),
                    expanded: jasmine.any(Boolean),
                    cards: minireel.deck.map(card => ({
                        id: card.get('id'),
                        title: card.get('title'),
                        thumb: card.get('thumbs.small'),
                        showSource: !!card.get('data.source') && !card.get('data.hideSource'),
                        href: card.get('data.href'),
                        source: card.get('data.source'),
                        website: card.get('links.Website.uri'),
                        sponsor: card.get('sponsor'),
                        ad: card.get('ad'),
                        active: card === minireel.currentCard
                    }))
                });
            });

            describe('if enabled is true', function() {
                beforeEach(function() {
                    PlaylistViewCtrl.view.update.calls.reset();
                    PlaylistViewCtrl.enabled = true;

                    PlaylistViewCtrl.updateView();
                });

                it('should send the data with enabled: true', function() {
                    expect(PlaylistViewCtrl.view.update).toHaveBeenCalledWith(jasmine.objectContaining({
                        enabled: true
                    }));
                });
            });

            describe('if enabled is false', function() {
                beforeEach(function() {
                    PlaylistViewCtrl.view.update.calls.reset();
                    PlaylistViewCtrl.enabled = false;

                    PlaylistViewCtrl.updateView();
                });

                it('should send the data with enabled: false', function() {
                    expect(PlaylistViewCtrl.view.update).toHaveBeenCalledWith(jasmine.objectContaining({
                        enabled: false
                    }));
                });
            });

            describe('if expanded is true', function() {
                beforeEach(function() {
                    PlaylistViewCtrl.view.update.calls.reset();
                    PlaylistViewCtrl.expanded = true;

                    PlaylistViewCtrl.updateView();
                });

                it('should send the data with expanded: true', function() {
                    expect(PlaylistViewCtrl.view.update).toHaveBeenCalledWith(jasmine.objectContaining({
                        expanded: true
                    }));
                });
            });

            describe('if expanded is false', function() {
                beforeEach(function() {
                    PlaylistViewCtrl.view.update.calls.reset();
                    PlaylistViewCtrl.expanded = false;

                    PlaylistViewCtrl.updateView();
                });

                it('should send the data with expanded: false', function() {
                    expect(PlaylistViewCtrl.view.update).toHaveBeenCalledWith(jasmine.objectContaining({
                        expanded: false
                    }));
                });
            });
        });
    });
});
