import SponsoredCardController from '../../../src/mixins/SponsoredCardController.js';
import CardController from '../../../src/controllers/CardController.js';
import Card from '../../../src/models/Card.js';
import SponsoredCard from '../../../src/mixins/SponsoredCard.js';
import LinkItemView from '../../../src/views/LinkItemView.js';
import Runner from '../../../lib/Runner.js';
import dispatcher from '../../../src/services/dispatcher.js';

class MyCardController extends CardController {}
MyCardController.mixin(SponsoredCardController);

class MyCard extends Card {}
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
        expect(dispatcher.addSource).toHaveBeenCalledWith('card', card, ['clickthrough']);
    });

    describe('methods:', function() {
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
