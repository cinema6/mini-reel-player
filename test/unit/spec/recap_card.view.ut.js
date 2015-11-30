import CardView from '../../../src/views/CardView.js';
import ListView from '../../../src/views/ListView.js';
import RecapCardView from '../../../src/views/RecapCardView.js';
import RecapCardItemView from '../../../src/views/RecapCardItemView.js';
import Runner from '../../../lib/Runner.js';

describe('RecapCardView', function() {
    let recapCardView;

    beforeEach(function() {
        recapCardView = new RecapCardView();
    });

    it('should be a CardView', function() {
        expect(recapCardView).toEqual(jasmine.any(CardView));
    });

    describe('methods:', function() {
        describe('update(data)', function() {
            let data;
            let cardViews;

            beforeEach(function() {
                data = {
                    cards: [
                        {
                            id: 'rc-720427f954b8a6'
                        },
                        {
                            id: 'rc-241b9cc66bcf19'
                        },
                        {
                            id: 'rc-ce2efbc9230739'
                        }
                    ]
                };
                cardViews = [];

                spyOn(recapCardView, 'create').and.callFake(() => {
                    recapCardView.cards = new ListView();
                    recapCardView.cards.template = '<div>Hello</div>';
                });

                Runner.run(() => recapCardView.update({}));

                spyOn(RecapCardItemView.prototype, 'update');
                spyOn(recapCardView.cards, 'update').and.callThrough();
                recapCardView.cards.on('addChild', (child, index) => cardViews[index] = child);

                Runner.run(() => recapCardView.update(data));
            });

            it('should only create the element once', function() {
                expect(recapCardView.create.calls.count()).toBe(1);
            });

            it('should update the cards with card data', function() {
                expect(recapCardView.cards.update).toHaveBeenCalledWith(data.cards);
            });

            describe('when a child is selected', function() {
                let spy;

                beforeEach(function() {
                    spy = jasmine.createSpy('spy()');
                    recapCardView.on('selectCard', spy);

                    cardViews[1].emit('select');
                });

                it('should emit selectCard with the id of the selected card', function() {
                    expect(spy).toHaveBeenCalledWith(data.cards[1].id);
                });
            });
        });
    });
});
