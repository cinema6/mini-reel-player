import ShowcaseAppCard from '../../../src/models/ShowcaseAppCard.js';
import ShowcaseCard from '../../../src/models/ShowcaseCard.js';

describe('ShowcaseAppCard', function() {
    let data;
    let card;

    beforeEach(function() {
        data = {
            id: 'rc-0GK91W05UgBDWMda',
            campaign: {
                minViewTime: 0
            },
            collateral: {
                logo: null
            },
            data: {
                duration: 30,
                advanceInterval: 5,
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
                }
            },
            shareLinks: {},
            sponsored: true,
            thumbs: {
                small: 'http://is5.mzstatic.com/image/thumb/Purple20/v4/0f/31/75/0f31756b-91c4-edfb-2d2f-359da1717fd3/source/512x512bb.jpg',
                large: 'http://is5.mzstatic.com/image/thumb/Purple20/v4/0f/31/75/0f31756b-91c4-edfb-2d2f-359da1717fd3/source/512x512bb.jpg'
            },
            title: 'CoachGuitar - Guitar Lessons for Beginners',
            type: 'showcase-app'
        };

        card = new ShowcaseAppCard(data);
    });

    it('should exist', function() {
        expect(card).toEqual(jasmine.any(ShowcaseCard));
    });

    describe('properties:', function() {
        describe('type', function() {
            it('should be "showcase-app"', function() {
                expect(card.type).toBe('showcase-app');
            });
        });

        describe('currentIndex', function() {
            it('should be 0', function() {
                expect(card.currentIndex).toBe(0);
            });
        });

        describe('currentSlide', function() {
            it('should be a computation of the currentIndex', function() {
                card.currentIndex = 1;
                expect(card.currentSlide).toBe(card.slides[1]);

                card.currentIndex = 3;
                expect(card.currentSlide).toBe(card.slides[3]);
            });
        });

        describe('slides', function() {
            it('should be a copy of the slides', function() {
                expect(card.slides).toEqual(data.data.slides);
            });
        });

        describe('data.', function() {
            describe('price', function() {
                it('should be copied from the data', function() {
                    expect(card.data.price).toBe(data.data.price);
                });
            });

            describe('rating', function() {
                it('should be copied from the data', function() {
                    expect(card.data.rating).toBe(data.data.rating);
                });
            });
        });
    });

    describe('methods', function() {
        describe('goToIndex(index)', function() {
            let index;
            let move;

            beforeEach(function() {
                index = 2;

                move = jasmine.createSpy('move()');
                card.on('move', move);

                card.goToIndex(index);
            });

            it('should update the currentIndex', function() {
                expect(card.currentIndex).toBe(index);
            });

            it('should emit "move"', function() {
                expect(move).toHaveBeenCalledWith();
            });

            describe('if the index is not moving', function() {
                beforeEach(function() {
                    move.calls.reset();
                    card.goToIndex(index);
                });

                it('should not emit move', function() {
                    expect(move).not.toHaveBeenCalled();
                });
            });
        });

        describe('nextSlide()', function() {
            beforeEach(function() {
                card.currentIndex = 3;
                spyOn(card, 'goToIndex');

                card.nextSlide();
            });

            it('should call goToIndex() with the next index', function() {
                expect(card.goToIndex).toHaveBeenCalledWith(4);
            });

            describe('on the last slide', function() {
                beforeEach(function() {
                    card.currentIndex = card.slides.length - 1;
                    card.goToIndex.calls.reset();

                    card.nextSlide();
                });

                it('should go to the first slide', function() {
                    expect(card.goToIndex).toHaveBeenCalledWith(0);
                });
            });
        });

        describe('activate()', function() {
            beforeEach(function() {
                spyOn(ShowcaseCard.prototype, 'activate');
                spyOn(card, 'nextSlide');

                jasmine.clock().install();

                card.activate();
            });

            afterEach(function() {
                jasmine.clock().uninstall();
            });

            it('should call super()', function() {
                expect(ShowcaseCard.prototype.activate).toHaveBeenCalledWith();
            });

            describe('before the advanceInterval is reached', function() {
                beforeEach(function(done) {
                    jasmine.clock().tick((data.data.advanceInterval * 1000) - 1);
                    Promise.resolve().then(done);
                });

                it('should not go to the next slide', function() {
                    expect(card.nextSlide).not.toHaveBeenCalled();
                });
            });

            describe('when the advanceInterval is reached', function() {
                beforeEach(function(done) {
                    jasmine.clock().tick(data.data.advanceInterval * 1000);
                    Promise.resolve().then(done);
                });

                it('should go to the next slide', function() {
                    expect(card.nextSlide).toHaveBeenCalled();
                });

                describe('again', function() {
                    beforeEach(function(done) {
                        card.nextSlide.calls.reset();
                        jasmine.clock().tick(data.data.advanceInterval * 1000);
                        Promise.resolve().then(done);
                    });

                    it('should go to the next slide', function() {
                        expect(card.nextSlide).toHaveBeenCalled();
                    });
                });
            });

            describe('when the card is deactivated', function() {
                beforeEach(function(done) {
                    card.deactivate();
                    card.nextSlide.calls.reset();

                    jasmine.clock().tick(data.data.advanceInterval * 1000);
                    Promise.resolve().then(done);
                });

                it('should stop advancing', function() {
                    expect(card.nextSlide).not.toHaveBeenCalled();
                });
            });

            describe('when stopAdvancing() is called', function() {
                beforeEach(function(done) {
                    card.stopAdvancing();
                    card.nextSlide.calls.reset();

                    jasmine.clock().tick(data.data.advanceInterval * 1000);
                    Promise.resolve().then(done);
                });

                it('should stop advancing', function() {
                    expect(card.nextSlide).not.toHaveBeenCalled();
                });
            });

            describe('if there is no advanceInterval', function() {
                beforeEach(function(done) {
                    card.deactivate();
                    data.data.advanceInterval = null;
                    card = new ShowcaseAppCard(data);
                    spyOn(card, 'nextSlide');

                    card.activate();
                    jasmine.clock().tick(2);
                    Promise.resolve().then(done);
                });

                it('should do nothing', function() {
                    expect(card.nextSlide).not.toHaveBeenCalled();
                });
            });
        });

        describe('deactivate()', function() {
            beforeEach(function() {
                spyOn(ShowcaseCard.prototype, 'deactivate');

                card.deactivate();
            });

            it('should call super()', function() {
                expect(ShowcaseCard.prototype.deactivate).toHaveBeenCalled();
            });
        });
    });
});
