describe('CardController', function() {
    import Controller from '../../../lib/core/Controller.js';
    import CardController from '../../../src/controllers/CardController.js';
    import Card from '../../../src/models/Card.js';
    import CardView from '../../../src/views/CardView.js';
    import View from '../../../lib/core/View.js';
    let CardCtrl;

    let card;
    let deckView;

    beforeEach(function() {
        card = new Card({
            title: 'My Card',
            note: 'This is a great card.',
            thumbs: {
                small: 'https://i.ytimg.com/vi/B5FcZrg_Nuo/default.jpg',
                large: 'https://i.ytimg.com/vi/B5FcZrg_Nuo/maxresdefault.jpg'
            }
        });
        deckView = new View();

        CardCtrl = new CardController(card, deckView);
    });

    it('should exist', function() {
        expect(CardCtrl).toEqual(jasmine.any(Controller));
    });

    describe('properties:', function() {
        describe('model', function() {
            it('should be the provided model', function() {
                expect(CardCtrl.model).toBe(card);
            });
        });

        describe('view', function() {
            it('should be null', function() {
                expect(CardCtrl.view).toBeNull();
            });
        });
    });

    describe('methods', function() {
        describe('render()', function() {
            let result;

            beforeEach(function() {
                CardCtrl.view = new CardView();

                spyOn(CardCtrl.view, 'appendTo');
                spyOn(CardCtrl.view, 'update');
                spyOn(CardCtrl.view, 'hide');

                result = CardCtrl.render();
            });

            it('should update the card with some data', function() {
                expect(CardCtrl.view.update).toHaveBeenCalledWith({
                    title: card.title,
                    note: card.note,
                    thumbs: card.thumbs
                });
            });

            it('should hide the card', function() {
                expect(CardCtrl.view.hide).toHaveBeenCalled();
            });

            it('should place its CardView in the deck', function() {
                expect(CardCtrl.view.appendTo).toHaveBeenCalledWith(deckView);
            });
        });
    });

    describe('when the card activates', function() {
        beforeEach(function() {
            CardCtrl.view = new CardView();
            spyOn(CardCtrl.view, 'show');
            card.emit('activate');
        });

        it('should show the CardView', function() {
            expect(CardCtrl.view.show).toHaveBeenCalled();
        });
    });

    describe('when the card deactivates', function() {
        beforeEach(function() {
            CardCtrl.view = new CardView();
            spyOn(CardCtrl.view, 'hide');
            card.emit('deactivate');
        });

        it('should show the CardView', function() {
            expect(CardCtrl.view.hide).toHaveBeenCalled();
        });
    });
});
