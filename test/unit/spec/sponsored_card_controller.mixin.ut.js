import SponsoredCardController from '../../../src/mixins/SponsoredCardController.js';
import CardController from '../../../src/controllers/CardController.js';
import Card from '../../../src/models/Card.js';
import SponsoredCard from '../../../src/mixins/SponsoredCard.js';
import LinkItemView from '../../../src/views/LinkItemView.js';
import ModalShareItemView from '../../../src/views/ModalShareItemView.js';
import Runner from '../../../lib/Runner.js';
import dispatcher from '../../../src/services/dispatcher.js';

class MyCardController extends CardController {}
MyCardController.mixin(SponsoredCardController);

class MyCard extends Card {
    constructor() {
        super(...arguments);
        this.shareLinks = [];
    }
}
MyCard.mixin(SponsoredCard);

describe('SponsoredCardController mixin', function() {
    let controller;
    let card;

    beforeEach(function() {
        dispatcher.constructor();
        spyOn(dispatcher, 'addSource').and.callThrough();

        card = new MyCard({});
        controller = new MyCardController(card);
    });

    afterAll(function() {
        dispatcher.constructor();
    });

    it('should exist', function() {
        expect(controller).toEqual(jasmine.any(MyCardController));
    });

    it('should add its model as a source', function() {
        expect(dispatcher.addSource).toHaveBeenCalledWith('card', card, ['clickthrough', 'share']);
    });

    describe('events:', function() {
        describe('card', function() {
            describe('share', function() {
                let link;

                beforeEach(function() {
                    spyOn(window, 'open');
                    link = {
                        href: 'www.site.com'
                    };
                });

                describe('for facebook', function() {
                    it('should open a window with the correct link and size', function() {
                        link.type = 'facebook';
                        card.emit('share', link);
                        const args = window.open.calls.mostRecent().args;
                        expect(args[0]).toBe('www.site.com');
                        expect(args[1]).toBe('Share to Facebook');
                        expect(args[2]).toContain('width=570');
                        expect(args[2]).toContain('height=550');
                    });
                });

                describe('for twitter', function() {
                    it('should open a window with the correct link and size', function() {
                        link.type = 'twitter';
                        card.emit('share', link);
                        const args = window.open.calls.mostRecent().args;
                        expect(args[0]).toBe('www.site.com');
                        expect(args[1]).toBe('Share to Twitter');
                        expect(args[2]).toContain('width=580');
                        expect(args[2]).toContain('height=250');
                    });
                });

                describe('for pinterest', function() {
                    it('should open a window with the correct link and size', function() {
                        link.type = 'pinterest';
                        card.emit('share', link);
                        const args = window.open.calls.mostRecent().args;
                        expect(args[0]).toBe('www.site.com');
                        expect(args[1]).toBe('Share to Pinterest');
                        expect(args[2]).toContain('width=750');
                        expect(args[2]).toContain('height=550');
                    });
                });
            });
        });
    });

    describe('methods:', function() {
        describe('share(itemView)', function() {
            let itemView;

            beforeEach(function() {
                itemView = new ModalShareItemView();
                itemView.tag = 'li';
                Runner.run(() => itemView.update({ type: 'youtube' }));
                spyOn(card, 'share').and.callThrough();

                controller.share(itemView);
            });

            it('should call share() on the card', function() {
                expect(card.share).toHaveBeenCalledWith('youtube');
            });
        });

        describe('clickthrough(linkItem)', function() {
            let linkItem;

            beforeEach(function() {
                linkItem = new LinkItemView();
                linkItem.tag = 'span';
                Runner.run(() => linkItem.update({ type: 'youtube', label: 'YouTube' }));
                spyOn(card, 'clickthrough').and.callThrough();

                controller.clickthrough(linkItem);
            });

            it('should call clickthrough() on the card', function() {
                expect(card.clickthrough).toHaveBeenCalledWith(linkItem.type);
            });
        });
    });
});
