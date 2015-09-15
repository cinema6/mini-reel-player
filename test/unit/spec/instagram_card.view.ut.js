import InstagramCardView from '../../../src/views/InstagramCardView.js';
import CardView from '../../../src/views/CardView.js';
import InstagramCaptionView from '../../../src/views/InstagramCaptionView.js';
import LinksListView from '../../../src/views/LinksListView.js';
import LinkItemView from '../../../src/views/LinkItemView.js';

describe('InstagramCardView', function() {
    let cardView;

    beforeEach(function() {
        cardView = new InstagramCardView();
        let element = document.createElement('div');
        element.innerHTML = '<div></div>';
        cardView.element = element;
    });

    it('should be a CardView', function() {
        expect(cardView).toEqual(jasmine.any(CardView));
    });

    describe('properties:', function() {
        describe('instantiates', function() {
            it('should be caption and list view', function() {
                expect(cardView.instantiates).toEqual({
                    InstagramCaptionView,
                    LinksListView,
                    LinkItemView
                });
            });
        });
    });
});
