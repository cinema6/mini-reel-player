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

    beforeEach(function() {
        minireel = new MiniReel();
        minireel.deck = [
            new VideoCard({
                id: 'rc-720427f954b8a6',
                title: 'Card 1',
                source: 'YouTube',
                thumbs: {
                    small: 'yt-thumb.jpg'
                },
                params: {
                    sponsor: 'Netflix',
                    ad: true
                },
                links: {
                    Website: 'http://www.netflix.com'
                },
                collateral: {},
                data: {
                    hideSource: true,
                    href: 'https://www.youtube.com/watch?v=3XxB6ma7qu8'
                }
            }, experience),
            new VideoCard({
                id: 'rc-241b9cc66bcf19',
                title: 'Card 2',
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
        card = new RecapCard({}, experience, minireel);
        minireel.deck.push(card);

        RecapCardCtrl = new RecapCardController(card, new View(document.createElement('ul')));
        RecapCardCtrl.view = new CardView();
    });

    it('should be a CardController', function() {
        expect(RecapCardCtrl).toEqual(jasmine.any(CardController));
    });

    describe('methods:', function() {
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
                        id: card.id,
                        title: card.title,
                        source: card.data.source,
                        href: card.data.href,
                        thumb: card.thumbs.small,
                        showSource: !!card.data.source && !card.data.hideSource,
                        website: (card.links || {}).Website,
                        sponsor: card.sponsor,
                        type: card.ad ? 'ad' : 'content'
                    }))
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
