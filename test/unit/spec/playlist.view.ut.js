import PlaylistView from '../../../src/views/PlaylistView.js';
import TemplateView from '../../../lib/core/TemplateView.js';
import Hideable from '../../../src/mixins/Hideable.js';
import PlaylistCardListView from '../../../src/views/PlaylistCardListView.js';
import Runner from '../../../lib/Runner.js';

describe('PlaylistView', function() {
    let view;

    beforeEach(function() {
        view = new PlaylistView();
    });

    it('should exist', function() {
        expect(view).toEqual(jasmine.any(TemplateView));
    });

    it('should be Hideable', function() {
        expect(PlaylistView.mixins).toContain(Hideable);
    });

    describe('properties:', function() {
        describe('tag', function() {
            it('should be "div"', function() {
                expect(view.tag).toBe('div');
            });
        });

        describe('classes', function() {
            it('should be the usual TemplateView classes + "playlist__group"', function() {
                expect(view.classes).toEqual(new TemplateView().classes.concat(['playlist__group']));
            });
        });

        describe('template', function() {
            it('should be the contents of PlaylistView.html', function() {
                expect(view.template).toBe(require('../../../src/views/PlaylistView.html'));
            });
        });

        describe('child views:', function() {
            beforeEach(function() {
                Runner.run(() => view.create());
            });

            describe('cards', function() {
                it('should be a PlaylistCardListView', function() {
                    expect(view.cards).toEqual(jasmine.any(PlaylistCardListView));
                });
            });
        });
    });

    describe('events:', function() {
        describe('cards:child', function() {
            let cards;
            let selectCard;
            let cardViews;

            beforeEach(function() {
                Runner.run(() => view.create());

                selectCard = jasmine.createSpy('selectCard()');
                view.on('selectCard', selectCard);

                cardViews = [];
                view.cards.on('addChild', (cardView, index) => cardViews[index] = cardView);

                cards = [{ id: 'rc-f1c802c30365ae' }, { id: 'rc-d7c122d05ce1e8' }, { id: 'rc-17c1c7892d4687' }];

                Runner.run(() => view.update({ cards }));
                Runner.run(() => view.update({ cards }));

                cardViews[1].emit('select');
            });

            it('should emit selectCard with the card id', function() {
                expect(selectCard).toHaveBeenCalledWith(cards[1].id);
                expect(selectCard.calls.count()).toBe(1);
            });
        });
    });

    describe('methods:', function() {
        describe('update(data)', function() {
            let data;

            beforeEach(function() {
                data = {
                    cardNumber: 3,
                    total: 10,
                    enabled: true,
                    expanded: true,
                    cards: [
                        { title: 'hello' },
                        { title: 'world' }
                    ]
                };
                Runner.run(() => view.create());
                spyOn(view.cards, 'update');
                spyOn(view, 'addClass');
                spyOn(view, 'removeClass');
                spyOn(TemplateView.prototype, 'update');

                Runner.run(() => view.update(data));
            });

            it('should call super()', function() {
                expect(TemplateView.prototype.update).toHaveBeenCalledWith(data);
            });

            it('should update the cards list', function() {
                expect(view.cards.update).toHaveBeenCalledWith(data.cards);
            });

            describe('if expanded is true', function() {
                beforeEach(function() {
                    view.addClass.calls.reset();
                    view.removeClass.calls.reset();

                    data.expanded = true;
                    Runner.run(() => view.update(data));
                });

                it('should add the "playlist__group--noAds" class', function() {
                    expect(view.addClass).toHaveBeenCalledWith('playlist__group--noAds');
                    expect(view.removeClass).not.toHaveBeenCalled();
                });
            });

            describe('if expanded is false', function() {
                beforeEach(function() {
                    view.addClass.calls.reset();
                    view.removeClass.calls.reset();

                    data.expanded = false;
                    Runner.run(() => view.update(data));
                });

                it('should remove the "playlist__group--noAds" class', function() {
                    expect(view.removeClass).toHaveBeenCalledWith('playlist__group--noAds');
                    expect(view.addClass).not.toHaveBeenCalled();
                });
            });
        });
    });
});
