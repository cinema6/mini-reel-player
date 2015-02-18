describe('TableOfContentsView', function() {
    import TemplateView from '../../../lib/core/TemplateView.js';
    import Hideable from '../../../src/mixins/Hideable.js';
    import TableOfContentsView from '../../../src/views/TableOfContentsView.js';
    import TableOfContentsCardView from '../../../src/views/TableOfContentsCardView.js';
    import View from '../../../lib/core/View.js';
    import Runner from '../../../lib/Runner.js';
    let tableOfContentsView;

    beforeEach(function() {
        tableOfContentsView = new TableOfContentsView();
    });

    it('should be a TemplateView', function() {
        expect(tableOfContentsView).toEqual(jasmine.any(TemplateView));
    });

    it('should be Hideable', function() {
        expect(TableOfContentsView.mixins).toContain(Hideable);
    });

    describe('properties:', function() {
        describe('tag', function() {
            it('should be "section"', function() {
                expect(tableOfContentsView.tag).toBe('section');
            });
        });

        describe('classes', function() {
            it('should be the default classes plus "css-promote toc__group"', function() {
                expect(tableOfContentsView.classes).toEqual((new TemplateView()).classes.concat(['css-promote', 'toc__group']));
            });
        });

        describe('template', function() {
            it('should be the TableOfContentsView.html template', function() {
                expect(tableOfContentsView.template).toBe(require('../../../src/views/TableOfContentsView.html'));
            });
        });

        describe('cards', function() {
            it('should be an empty array', function() {
                expect(tableOfContentsView.cards).toEqual([]);
            });
        });

        describe('list', function() {
            beforeEach(function() {
                Runner.run(() => tableOfContentsView.create());
            });

            it('should be a view', function() {
                expect(tableOfContentsView.list).toEqual(jasmine.any(View));
            });
        });
    });

    describe('methods:', function() {
        describe('update(data)', function() {
            let data;

            beforeEach(function() {
                data = {
                    title: 'This is my MiniReel',
                    cards: [
                        {
                            id: 'rc-6c67e88678be73',
                            title: 'card1'
                        },
                        {
                            id: 'rc-6846fbdbeff775',
                            title: 'card2'
                        },
                        {
                            id: 'rc-ba397fc384b275',
                            title: 'card3'
                        }
                    ]
                };

                Runner.run(() => tableOfContentsView.create());

                spyOn(TemplateView.prototype, 'update').and.callThrough();
                spyOn(tableOfContentsView.list, 'append').and.callThrough();
                Runner.run(() => tableOfContentsView.update(data));
            });

            it('should call super() with just the title', function() {
                expect(TemplateView.prototype.update).toHaveBeenCalledWith({ title: data.title });
            });

            it('should populate the cards array with a TableOfContentsCardView for each card', function() {
                expect(tableOfContentsView.cards).toEqual([
                    jasmine.any(TableOfContentsCardView),
                    jasmine.any(TableOfContentsCardView),
                    jasmine.any(TableOfContentsCardView)
                ]);
            });

            it('should update each card with data', function() {
                tableOfContentsView.cards.forEach((card, index) => expect(card.update).toHaveBeenCalledWith(data.cards[index]));
            });

            it('should append each card to itself', function() {
                tableOfContentsView.cards.forEach(card => expect(tableOfContentsView.list.append).toHaveBeenCalledWith(card));
            });

            describe('when a card is selected', function() {
                let spy;

                beforeEach(function() {
                    spy = jasmine.createSpy('spy()');
                    tableOfContentsView.on('selectCard', spy);

                    tableOfContentsView.cards[1].emit('select');
                });

                it('should call the spy with the id of the selected card', function() {
                    expect(spy).toHaveBeenCalledWith(data.cards[1].id);
                });
            });
        });
    });
});
