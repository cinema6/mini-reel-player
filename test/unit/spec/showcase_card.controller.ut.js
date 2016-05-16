import ShowcaseCardController from '../../../src/controllers/ShowcaseCardController.js';
import CardController from '../../../src/controllers/CardController.js';
import ShowcaseCard from '../../../src/models/ShowcaseCard.js';
import TemplateView from '../../../lib/core/TemplateView.js';
import SponsoredCardController from '../../../src/mixins/SponsoredCardController.js';
import dispatcher from '../../../src/services/dispatcher.js';

describe('ShowcaseCardController', function() {
    let card;
    let Ctrl;

    beforeEach(function() {
        card = new ShowcaseCard({
            id: 'rc-0GK91W05UgBDWMda',
            campaign: {
                minViewTime: 0
            },
            collateral: {
                logo: null
            },
            data: {
                duration: 30
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

        spyOn(dispatcher, 'addSource').and.callThrough();

        Ctrl = new ShowcaseCardController(card);
    });

    it('should exist', function() {
        expect(Ctrl).toEqual(jasmine.any(CardController));
    });

    it('should mixin SponsoredCardController', function() {
        expect(ShowcaseCardController.mixins).toContain(SponsoredCardController, 'ShowcaseCardController does not mixin SponsoredCardController!');
    });

    it('should add its model as an event source', function() {
        expect(dispatcher.addSource).toHaveBeenCalledWith('showcase-card', card, ['activate', 'deactivate']);
        expect(dispatcher.addSource).toHaveBeenCalledWith('card', card, ['activate', 'deactivate', 'becameUnskippable', 'becameSkippable', 'skippableProgress']);
    });

    describe('methods:', function() {
        describe('updateView()', function() {
            beforeEach(function() {
                Ctrl.view = new TemplateView();
                spyOn(Ctrl.view, 'update');

                Ctrl.updateView();
            });

            it('should update() the view with data', function() {
                expect(Ctrl.view.update).toHaveBeenCalledWith({
                    sponsor: card.get('sponsor'),
                    action: {
                        href: card.get('links.Action.uri'),
                        text: card.get('action.label'),
                        label: 'Action'
                    }
                });
            });
        });

        describe('render()', function() {
            beforeEach(function() {
                spyOn(CardController.prototype, 'render');
                spyOn(Ctrl, 'updateView');

                Ctrl.render();
            });

            it('should call updateView()', function() {
                expect(Ctrl.updateView).toHaveBeenCalledWith();
            });

            it('should call super()', function() {
                expect(CardController.prototype.render).toHaveBeenCalled();
            });
        });
    });
});
