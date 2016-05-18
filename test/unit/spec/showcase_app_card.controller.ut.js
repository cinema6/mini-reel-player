import ShowcaseAppCardController from '../../../src/controllers/ShowcaseAppCardController.js';
import ShowcaseCardController from '../../../src/controllers/ShowcaseCardController.js';
import ShowcaseAppCard from '../../../src/models/ShowcaseAppCard.js';
import TemplateView from '../../../lib/core/TemplateView.js';
import { extend } from '../../../lib/utils.js';

describe('ShowcaseAppCardController', function() {
    let card;
    let Ctrl;

    beforeEach(function() {
        card = new ShowcaseAppCard({
            id: 'rc-0GK91W05UgBDWMda',
            campaign: {
                minViewTime: 0
            },
            collateral: {
                logo: null
            },
            data: {
                duration: 30,
                price: 'Free',
                rating: 4.5,
                slides: [
                    {
                        type: 'image',
                        uri: 'http://a3.mzstatic.com/us/r30/Purple4/v4/b5/75/10/b57510e1-6904-7fe3-cd5f-9efbeba57207/screen1136x1136.jpeg'
                    },
                    {
                        type: 'image',
                        uri: 'http://a2.mzstatic.com/us/r30/Purple4/v4/3a/a1/0b/3aa10b37-e36c-24f5-cc2f-db026ed540a4/screen1136x1136.jpeg'
                    },
                    {
                        type: 'image',
                        uri: 'http://a3.mzstatic.com/us/r30/Purple1/v4/35/a4/67/35a46788-596d-6290-41ab-063af173bd2f/screen1136x1136.jpeg'
                    },
                    {
                        type: 'image',
                        uri: 'http://a2.mzstatic.com/us/r30/Purple1/v4/e1/96/a9/e196a9d4-8ea1-79f7-c376-96e145bbe536/screen1136x1136.jpeg'
                    },
                    {
                        type: 'image',
                        uri: 'http://a3.mzstatic.com/us/r30/Purple1/v4/ee/f2/32/eef2325a-88f4-dd44-5791-23a05ff179b6/screen1136x1136.jpeg'
                    }
                ]
            },
            links: {
                Action: {
                    uri: 'https://itunes.apple.com/us/app/coachguitar-guitar-lessons/id405338085?mt=8&uo=4',
                    tracking: []
                }
            },
            modules: [],
            note: 'We show you how to play popular songs without music theory.',
            params: {
                action: {
                    type: 'button',
                    label: 'Download for Free'
                },
                sponsor: 'Awesome Apps, Inc.'
            },
            shareLinks: {},
            sponsored: true,
            thumbs: {
                small: 'http://is5.mzstatic.com/image/thumb/Purple20/v4/0f/31/75/0f31756b-91c4-edfb-2d2f-359da1717fd3/source/512x512bb.jpg',
                large: 'http://is5.mzstatic.com/image/thumb/Purple20/v4/0f/31/75/0f31756b-91c4-edfb-2d2f-359da1717fd3/source/512x512bb.jpg'
            },
            title: 'CoachGuitar - Guitar Lessons for Beginners',
            type: 'showcase-app'
        });


        Ctrl = new ShowcaseAppCardController(card);
    });

    it('should exist', function() {
        expect(Ctrl).toEqual(jasmine.any(ShowcaseCardController));
    });

    describe('methods:', function() {
        describe('updateView()', function() {
            beforeEach(function() {
                Ctrl.view = new TemplateView();
                spyOn(Ctrl.view, 'update');

                spyOn(ShowcaseCardController.prototype, 'updateView');

                card.currentIndex = 2;

                Ctrl.updateView();
            });

            it('should update() the view with data', function() {
                expect(Ctrl.view.update).toHaveBeenCalledWith({
                    slides: card.get('slides').map((slide, index) => extend(slide, {
                        id: slide.uri,
                        previous: index === (card.currentIndex - 1),
                        active: index === card.currentIndex,
                        next: index === (card.currentIndex + 1),
                        clickthrough: card.links.Action.uri
                    })),
                    price: card.get('data.price'),
                    rating: card.get('data.rating')
                });
            });

            it('should call super()', function() {
                expect(ShowcaseCardController.prototype.updateView).toHaveBeenCalled();
            });
        });
    });

    describe('when the card emits "move"', function() {
        beforeEach(function() {
            spyOn(Ctrl, 'updateView');
            card.emit('move');
        });

        it('should call updateView()', function() {
            expect(Ctrl.updateView).toHaveBeenCalledWith();
        });
    });
});
