import MobileCardShowcaseAppCardController from '../../../../src/controllers/mobile-card/MobileCardShowcaseAppCardController.js';
import ShowcaseAppCardController from '../../../../src/controllers/ShowcaseAppCardController.js';
import ShowcaseAppCard from '../../../../src/models/ShowcaseAppCard.js';
import MobileCardShowcaseAppCardView from '../../../../src/views/mobile-card/MobileCardShowcaseAppCardView.js';
import Runner from '../../../../lib/Runner.js';

describe('MobileCardShowcaseAppCardController', function() {
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

        spyOn(MobileCardShowcaseAppCardController.prototype, 'addView').and.callThrough();

        Ctrl = new MobileCardShowcaseAppCardController(card);
    });

    it('should exist', function() {
        expect(Ctrl).toEqual(jasmine.any(ShowcaseAppCardController));
    });

    describe('properties:', function() {
        describe('view', function() {
            let view;

            beforeEach(function() {
                view = Ctrl.view;
            });

            it('should be a MobileCardShowcaseAppCardView', function() {
                expect(Ctrl.view).toEqual(jasmine.any(MobileCardShowcaseAppCardView));
                expect(Ctrl.addView).toHaveBeenCalledWith(Ctrl.view);
            });

            describe('children', function() {
                beforeEach(function() {
                    Runner.run(() => view.create());
                });

                describe('slides', function() {
                    describe('when swiped', function() {
                        beforeEach(function() {
                            spyOn(card, 'goToIndex');
                            spyOn(card, 'stopAdvancing');

                            view.slides.currentIndex = 3;
                            view.slides.emit('swipe');
                        });

                        it('should call goToIndex() on the card with the slides currentIndex', function() {
                            expect(card.goToIndex).toHaveBeenCalledWith(view.slides.currentIndex);
                        });

                        it('should stopAdvancing() the card', function() {
                            expect(card.stopAdvancing).toHaveBeenCalledWith();
                        });
                    });

                    describe('when clicked', function() {
                        beforeEach(function() {
                            spyOn(card, 'clickthrough');

                            view.slides.emit('click');
                        });

                        it('should call clickthrough()', function() {
                            expect(card.clickthrough).toHaveBeenCalledWith('Action', 'carousel');
                        });
                    });
                });
            });
        });
    });

    describe('methods:', function() {
        describe('updateView()', function() {
            beforeEach(function() {
                spyOn(ShowcaseAppCardController.prototype, 'updateView').and.callThrough();

                Runner.run(() => Ctrl.updateView());
                spyOn(Ctrl.view.slides, 'scrollTo');
            });

            it('should call super()', function() {
                expect(ShowcaseAppCardController.prototype.updateView).toHaveBeenCalledWith();
            });

            describe('if the card currentIndex matches the slides currentIndex', function() {
                beforeEach(function() {
                    card.currentIndex = 2;
                    Ctrl.view.slides.currentIndex = 2;

                    Runner.run(() => Ctrl.updateView());
                });

                it('should not scroll the slides', function() {
                    expect(Ctrl.view.slides.scrollTo).not.toHaveBeenCalled();
                });
            });

            describe('if the card currentIndex does not match the slides currentIndex', function() {
                beforeEach(function() {
                    card.currentIndex = 3;
                    Ctrl.view.slides.currentIndex = 2;

                    Runner.run(() => Ctrl.updateView());
                });

                it('should scroll the slides', function() {
                    expect(Ctrl.view.slides.scrollTo).toHaveBeenCalledWith(card.currentIndex);
                });
            });
        });
    });
});
