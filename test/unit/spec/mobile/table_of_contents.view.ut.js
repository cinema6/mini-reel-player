import TableOfContentsView from '../../../../src/views/mobile/TableOfContentsView.js';
import TemplateView from '../../../../lib/core/TemplateView.js';
import Hideable from '../../../../src/mixins/Hideable.js';
import Runner from '../../../../lib/Runner.js';
import TableOfContentsListView from '../../../../src/views/mobile/TableOfContentsListView.js';

describe('TableOfContentsView', function() {
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

        describe('id', function() {
            it('should be "toc"', function() {
                expect(tableOfContentsView.id).toBe('toc');
            });
        });

        describe('classes', function() {
            it('should be the default classes plus "css-promote toc__group"', function() {
                expect(tableOfContentsView.classes).toEqual((new TemplateView()).classes.concat(['css-promote', 'toc__group']));
            });
        });

        describe('template', function() {
            it('should be the TableOfContentsView.html template', function() {
                expect(tableOfContentsView.template).toBe(require('../../../../src/views/mobile/TableOfContentsView.html'));
            });
        });

        describe('list', function() {
            beforeEach(function() {
                Runner.run(() => tableOfContentsView.create());
            });

            it('should be a TableOfContentsListView', function() {
                expect(tableOfContentsView.list).toEqual(jasmine.any(TableOfContentsListView));
            });
        });
    });

    describe('methods:', function() {
        describe('update(data)', function() {
            let data;
            let cardViews;

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
                cardViews = [];

                Runner.run(() => tableOfContentsView.create());

                spyOn(TemplateView.prototype, 'update').and.callThrough();
                spyOn(tableOfContentsView.list, 'update').and.callThrough();
                tableOfContentsView.list.on('addChild', (card, index) => cardViews[index] = card);

                Runner.run(() => tableOfContentsView.update(data));
            });

            it('should call super() with just the title', function() {
                expect(TemplateView.prototype.update).toHaveBeenCalledWith({ title: data.title });
            });

            it('should update the list with the cards', function() {
                expect(tableOfContentsView.list.update).toHaveBeenCalledWith(data.cards);
            });

            describe('when a card is selected', function() {
                let spy;

                beforeEach(function() {
                    spy = jasmine.createSpy('spy()');
                    tableOfContentsView.on('selectCard', spy);

                    cardViews[1].emit('select');
                });

                it('should call the spy with the id of the selected card', function() {
                    expect(spy).toHaveBeenCalledWith(data.cards[1].id);
                });
            });
        });
    });
});
