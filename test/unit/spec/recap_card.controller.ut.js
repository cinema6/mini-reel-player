describe('RecapCardController', function() {
    import RecapCardController from '../../../src/controllers/RecapCardController.js';
    import CardController from '../../../src/controllers/CardController.js';
    import RecapCard from '../../../src/models/RecapCard.js';
    import VideoCard from '../../../src/models/VideoCard.js';
    import RecapCardView from '../../../src/views/RecapCardView.js';
    import View from '../../../lib/core/View.js';
    import Runner from '../../../lib/Runner.js';
    import MiniReel from '../../../src/models/MiniReel.js';
    let RecapCardCtrl;

    let card, minireel;

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
                data: {
                    href: 'https://www.youtube.com/watch?v=3XxB6ma7qu8'
                }
            }),
            new VideoCard({
                id: 'rc-241b9cc66bcf19',
                title: 'Card 2',
                source: 'Vimeo',
                thumbs: {
                    small: 'vimeo-thumb.jpg'
                },
                data: {
                    href: 'https://www.youtube.com/watch?v=mmEJQfm8H0k'
                }
            }),
            new VideoCard({
                id: 'rc-ce2efbc9230739',
                title: 'Card 3',
                source: 'Dailymotion',
                thumbs: {
                    small: 'dailymotion-thumb.jpg'
                },
                data: {
                    href: 'https://www.youtube.com/watch?v=LZL9JfoqaHQ'
                }
            })
        ];
        card = new RecapCard({}, minireel);
        minireel.deck.push(card);

        RecapCardCtrl = new RecapCardController(card, new View(document.createElement('ul')));
    });

    it('should be a CardController', function() {
        expect(RecapCardCtrl).toEqual(jasmine.any(CardController));
    });

    describe('properties:', function() {
        describe('view', function() {
            it('should be a RecapCardView', function() {
                expect(RecapCardCtrl.view).toEqual(jasmine.any(RecapCardView));
            });

            describe('events:', function() {
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
                        thumb: card.thumbs.small
                    }))
                });
            });
        });
    });
});
