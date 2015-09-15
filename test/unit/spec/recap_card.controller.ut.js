describe('RecapCardController', function() {
    import RecapCardController from '../../../src/controllers/RecapCardController.js';
    import CardController from '../../../src/controllers/CardController.js';
    import RecapCard from '../../../src/models/RecapCard.js';
    import VideoCard from '../../../src/models/VideoCard.js';
    import View from '../../../lib/core/View.js';
    import CardView from '../../../src/views/CardView.js';
    import Runner from '../../../lib/Runner.js';
    import MiniReel from '../../../src/models/MiniReel.js';
    let RecapCardCtrl;

    let card, minireel;

    const experience = {
        data: {}
    };

    const profile = { flash: false };

    beforeEach(function() {
        minireel = new MiniReel();
        minireel.deck = [
            new VideoCard({
                id: 'rc-720427f954b8a6',
                title: 'Card 1',
                note: 'How are you?',
                source: 'YouTube',
                thumbs: {
                    small: 'yt-thumb.jpg'
                },
                sponsored: true,
                params: {
                    sponsor: 'Netflix',
                    ad: true
                },
                links: {
                    Website: 'http://www.netflix.com',
                    Facebook: 'fb.me/jdshf',
                    Twitter: 'twitter.me/euwhfe'
                },
                collateral: {
                    logo: 'my-logo.jpg'
                },
                data: {
                    hideSource: true,
                    href: 'https://www.youtube.com/watch?v=3XxB6ma7qu8'
                }
            }, experience),
            new VideoCard({
                id: 'rc-241b9cc66bcf19',
                title: 'Card 2',
                note: 'I\'m well, thanks.',
                source: 'Vimeo',
                thumbs: {
                    small: 'vimeo-thumb.jpg'
                },
                params: {},
                collateral: {},
                data: {
                    href: 'https://www.youtube.com/watch?v=mmEJQfm8H0k'
                }
            }, experience),
            new VideoCard({
                id: 'rc-ce2efbc9230739',
                title: 'Card 3',
                source: 'Dailymotion',
                thumbs: {
                    small: 'dailymotion-thumb.jpg'
                },
                params: {},
                collateral: {},
                data: {
                    href: 'https://www.youtube.com/watch?v=LZL9JfoqaHQ'
                }
            }, experience),
            new VideoCard({
                id: 'rc-9adf2905169f34',
                title: 'Card 4',
                thumbs: {
                    small: 'dailymotion-thumb.jpg'
                },
                params: {},
                collateral: {},
                data: {
                    href: 'https://www.youtube.com/watch?v=LZL9JfoqaHQ'
                }
            }, experience)
        ];
        card = new RecapCard({}, experience, profile, minireel);
        minireel.deck.push(card);

        RecapCardCtrl = new RecapCardController(card, new View(document.createElement('ul')));
        RecapCardCtrl.view = new CardView();
    });

    it('should be a CardController', function() {
        expect(RecapCardCtrl).toEqual(jasmine.any(CardController));
    });

    describe('methods:', function() {
        describe('private', function() {
            describe('formatTitle', function() {
                it('should truncate strings longer than 100 characters', function() {
                    const input = 'Once upon a time, there was a unit test which contained this sentence, which was 101 characters long.';
                    expect(input.length).toBe(101);
                    expect(RecapCardCtrl.__private__.formatTitle(input)).toBe('Once upon a time, there was a unit test which contained this sentence, which was 101 characters long...');
                });

                it('should not truncate string shorter than 100 characters', function() {
                    const input = 'However the unit test also needed an 100 character long sentence, and so this one was made. The End.';
                    expect(input.length).toBe(100);
                    expect(RecapCardCtrl.__private__.formatTitle(input)).toBe('However the unit test also needed an 100 character long sentence, and so this one was made. The End.');
                });
            });
        });

        describe('render()', function() {
            beforeEach(function() {
                spyOn(CardController.prototype, 'render').and.callThrough();
                spyOn(RecapCardCtrl.view, 'update');

                Runner.run(() => RecapCardCtrl.render());
            });

            it('should call super', function() {
                expect(CardController.prototype.render).toHaveBeenCalled();
            });

            it('should call update with data about the entire minireel', function() {
                expect(RecapCardCtrl.view.update).toHaveBeenCalledWith({
                    cards: card.data.deck.map(card => ({
                        id: card.get('id'),
                        title: card.get('title'),
                        note: card.get('note'),
                        source: card.get('data.source'),
                        href: card.get('data.href'),
                        thumb: card.get('thumbs.small'),
                        showSource: !!card.get('data.source') && !card.get('data.hideSource'),
                        website: card.get('links.Website.uri'),
                        sponsor: card.get('sponsor'),
                        type: card.get('ad') ? 'ad' : 'content',
                        links: card.get('socialLinks') || [],
                        logo: card.get('logo'),
                        isSponsored: jasmine.any(Boolean)
                    }))
                });
            });

            describe('isSponsored', function() {
                let card;

                beforeEach(function() {
                    RecapCardCtrl.view.update.calls.reset();
                    CardController.prototype.render.and.returnValue(undefined);

                    card = minireel.deck[0];
                });

                describe('if the card has a sponsor', function() {
                    beforeEach(function() {
                        card.sponsor = 'Netflix';
                        card.socialLinks.length = 0;
                        card.logo = undefined;

                        Runner.run(() => RecapCardCtrl.render());
                    });

                    it('should set isSponsored to true', function() {
                        expect(RecapCardCtrl.view.update.calls.mostRecent().args[0].cards[0]).toEqual(jasmine.objectContaining({
                            isSponsored: true
                        }));
                    });
                });

                describe('if the card has links', function() {
                    beforeEach(function() {
                        card.sponsor = undefined;
                        card.socialLinks.length = 1;
                        card.logo = undefined;

                        Runner.run(() => RecapCardCtrl.render());
                    });

                    it('should set isSponsored to true', function() {
                        expect(RecapCardCtrl.view.update.calls.mostRecent().args[0].cards[0]).toEqual(jasmine.objectContaining({
                            isSponsored: true
                        }));
                    });
                });

                describe('if the card has a logo', function() {
                    beforeEach(function() {
                        card.sponsor = undefined;
                        card.socialLinks.length = 0;
                        card.logo = 'my-logo.jpg';

                        Runner.run(() => RecapCardCtrl.render());
                    });

                    it('should set isSponsored to true', function() {
                        expect(RecapCardCtrl.view.update.calls.mostRecent().args[0].cards[0]).toEqual(jasmine.objectContaining({
                            isSponsored: true
                        }));
                    });
                });

                describe('if the card has no sponsored data', function() {
                    beforeEach(function() {
                        card.sponsor = undefined;
                        card.socialLinks.length = 0;
                        card.logo = undefined;

                        Runner.run(() => RecapCardCtrl.render());
                    });

                    it('should set isSponsored to false', function() {
                        expect(RecapCardCtrl.view.update.calls.mostRecent().args[0].cards[0]).toEqual(jasmine.objectContaining({
                            isSponsored: false
                        }));
                    });
                });
            });
        });
    });

    describe('events:', function() {
        beforeEach(function() {
            RecapCardCtrl.addListeners();
        });

        describe('selectCard', function() {
            beforeEach(function() {
                spyOn(minireel, 'moveTo');

                RecapCardCtrl.view.emit('selectCard', minireel.deck[1].id);
            });

            it('should move the minireel to the selected card', function() {
                expect(minireel.moveTo).toHaveBeenCalledWith(minireel.deck[1]);
            });
        });
    });
});
