describe('RecapCardView', function() {
    import CardView from '../../../src/views/CardView.js';
    import RecapCardView from '../../../src/views/RecapCardView.js';
    import View from '../../../lib/core/View.js';
    import RecapCardItemView from '../../../src/views/RecapCardItemView.js';
    import Runner from '../../../lib/Runner.js';
    let recapCardView;

    beforeEach(function() {
        recapCardView = new RecapCardView();
    });

    it('should be a CardView', function() {
        expect(recapCardView).toEqual(jasmine.any(CardView));
    });

    describe('properties:', function() {
        describe('template', function() {
            it('should be the contents of RecapCardView.html', function() {
                expect(recapCardView.template).toBe(require('../../../src/views/RecapCardView.html'));
            });
        });

        describe('cards', function() {
            beforeEach(function() {
                Runner.run(() => recapCardView.create());
            });

            it('should be a view', function() {
                expect(recapCardView.cards).toEqual(jasmine.any(View));
            });
        });
    });

    describe('methods:', function() {
        describe('update(data)', function() {
            let data;

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

                spyOn(recapCardView, 'create').and.callThrough();

                Runner.run(() => recapCardView.update({}));

                spyOn(recapCardView.cards, 'append');
                spyOn(RecapCardItemView.prototype, 'update');


                Runner.run(() => recapCardView.update(data));
            });

            it('should only create the element once', function() {
                expect(recapCardView.create.calls.count()).toBe(1);
            });

            it('should append a RecapCardItemView to the cards view for every card in the data', function() {
                expect(recapCardView.cards.append.calls.count()).toBe(3);
                recapCardView.cards.append.calls.all().forEach(call => {
                    expect(call.args[0]).toEqual(jasmine.any(RecapCardItemView));
                });
            });

            it('should update each RecapCardItemView with the data for the card', function() {
                data.cards.forEach((card, index) => {
                    const view = recapCardView.cards.append.calls.argsFor(index)[0];

                    expect(view.update).toHaveBeenCalledWith(card);
                });
            });

            describe('when a child is selected', function() {
                let view, spy;

                beforeEach(function() {
                    view = recapCardView.cards.append.calls.argsFor(1)[0];
                    spy = jasmine.createSpy('spy()');
                    recapCardView.on('selectCard', spy);

                    view.emit('select');
                });

                it('should emit selectCard with the id of the selected card', function() {
                    expect(spy).toHaveBeenCalledWith(data.cards[1].id);
                });
            });
        });
    });
});
