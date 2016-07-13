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

    it('should add itself as a source', function() {
        expect(dispatcher.addSource).toHaveBeenCalledWith('ui', controller, ['interaction']);
    });

    describe('events:', function() {
        describe('card', function() {
            describe('share', function() {
                let link;

                beforeEach(function() {
                    spyOn(controller.__private__, 'openWindow');
                    link = {
                        href: 'www.site.com'
                    };
                });

                describe('for facebook', function() {
                    it('should open a window with the correct link and size', function() {
                        link.type = 'facebook';
                        card.emit('share', link);
                        const args = controller.__private__.openWindow.calls.mostRecent().args;
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
                        const args = controller.__private__.openWindow.calls.mostRecent().args;
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
                        const args = controller.__private__.openWindow.calls.mostRecent().args;
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
        describe('share(itemView, event)', function() {
            let itemView, event;

            beforeEach(function() {
                itemView = new ModalShareItemView();
                itemView.tag = 'li';
                Runner.run(() => itemView.update({ type: 'youtube' }));
                itemView.context = 'context-a';
                spyOn(card, 'share').and.callThrough();

                event = { coordinates: { x: 300, y: 200 } };

                controller.share(itemView, event);
            });

            it('should call share() on the card', function() {
                expect(card.share).toHaveBeenCalledWith('youtube', itemView.context, event.coordinates);
            });
        });

        describe('clickthrough(linkItem, event)', function() {
            let linkItem, event;

            beforeEach(function() {
                linkItem = new LinkItemView();
                linkItem.tag = 'span';
                Runner.run(() => linkItem.update({ type: 'youtube', label: 'YouTube' }));
                linkItem.context = 'context-b';
                spyOn(card, 'clickthrough').and.callThrough();

                event = { coordinates: { x: 200, y: 10 } };

                controller.clickthrough(linkItem, event);
            });

            it('should call clickthrough() on the card', function() {
                expect(card.clickthrough).toHaveBeenCalledWith(linkItem.data.label, linkItem.context, event.coordinates);
            });
        });

        describe('interaction(linkItem)', function() {
            let linkItem;
            let interaction;

            beforeEach(function() {
                linkItem = new LinkItemView();
                linkItem.context = 'the-context';

                interaction = jasmine.createSpy('interaction()');
                controller.on('interaction', interaction);

                controller.interaction(linkItem);
            });

            it('should emit the "interaction" event', function() {
                expect(interaction).toHaveBeenCalledWith(linkItem.context);
            });
        });
    });
});
