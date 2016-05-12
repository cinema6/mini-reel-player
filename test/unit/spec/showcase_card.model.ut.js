import ShowcaseCard from '../../../src/models/ShowcaseCard';
import Card from '../../../src/models/Card';
import SponsoredCard from '../../../src/mixins/SponsoredCard';

describe('ShowcaseCard', function() {
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
                skip: 0,
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

        card = new ShowcaseCard(data);
    });

    it('should exist', function() {
        expect(card).toEqual(jasmine.any(Card));
    });

    it('should be sponsored', function() {
        expect(ShowcaseCard.mixins).toContain(SponsoredCard, 'ShowcaseCard does not mixin SponsoredCard');
    });

    describe('properties:', function() {
        describe('type', function() {
            it('should be "showcase"', function() {
                expect(card.type).toBe('showcase');
            });
        });

        describe('skippable', function() {
            it('should be true', function() {
                expect(card.skippable).toBe(true);
            });
        });

        describe('data.', function() {
        });
    });

    describe('abort()', function() {
        let becameSkippable, skippableProgress;

        beforeEach(function() {
            skippableProgress = jasmine.createSpy('skippableProgress()');
            becameSkippable = jasmine.createSpy('becameSkippable');
            card.on('becameSkippable', becameSkippable);

            spyOn(Card.prototype, 'abort');

            card.abort();
        });

        it('should call super()', function() {
            expect(Card.prototype.abort).toHaveBeenCalled();
        });

        it('should not emit becameSkippable', function() {
            expect(becameSkippable).not.toHaveBeenCalled();
        });

        describe('if the skip timer is counting down', function() {
            beforeEach(function() {
                data.data.skip = 5;
                card = new ShowcaseCard(data);
                card.on('skippableProgress', skippableProgress);
                card.on('becameSkippable', becameSkippable);

                jasmine.clock().install();
                card.activate();
                skippableProgress.calls.reset();

                card.abort();
            });

            afterEach(function() {
                jasmine.clock().uninstall();
            });

            it('should emit becameSkippable()', function() {
                expect(becameSkippable).toHaveBeenCalled();
            });

            it('should set skippable to true', function() {
                expect(card.skippable).toBe(true);
            });

            describe('when a second passes', function() {
                beforeEach(function(done) {
                    jasmine.clock().tick(1000);
                    Promise.resolve().then(done);
                });

                it('should do nothing', function() {
                    expect(skippableProgress).not.toHaveBeenCalled();
                });
            });
        });
    });

    describe('hooks:', function() {
        describe('activate()', function() {
            let becameUnskippable, skippableProgress, becameSkippable;

            beforeEach(function() {
                spyOn(Card.prototype, 'activate');

                becameUnskippable = jasmine.createSpy('beacameUnskippable()');
                skippableProgress = jasmine.createSpy('skippableProgress()');
                becameSkippable = jasmine.createSpy('becameSkippable');
                card.on('becameUnskippable', becameUnskippable);
                card.on('skippableProgress', skippableProgress);
                card.on('becameSkippable', becameSkippable);

                card.activate();
            });

            it('should call super()', function() {
                expect(Card.prototype.activate).toHaveBeenCalled();
            });

            it('should not emit becameUnskippable() or skippableProgress()', function() {
                expect(becameUnskippable).not.toHaveBeenCalled();
                expect(skippableProgress).not.toHaveBeenCalled();
                expect(card.skippable).toBe(true);
            });

            describe('if the skip value is set', function() {
                beforeEach(function() {
                    data.data.skip = 5;
                    card = new ShowcaseCard(data);
                    card.on('becameUnskippable', becameUnskippable);
                    card.on('skippableProgress', skippableProgress);
                    card.on('becameSkippable', becameSkippable);

                    jasmine.clock().install();

                    card.activate();
                });

                afterEach(function() {
                    jasmine.clock().uninstall();
                });

                it('should emit becameUnskippable', function() {
                    expect(becameUnskippable).toHaveBeenCalledWith();
                });

                it('should emit skippableProgress', function() {
                    expect(skippableProgress).toHaveBeenCalledWith(5);
                });

                it('should set skippable to false', function() {
                    expect(card.skippable).toBe(false);
                });

                it('should emit skippableProgress every second', function(done) {
                    Promise.resolve().then(() => {
                        skippableProgress.calls.reset();
                        jasmine.clock().tick(1000);
                    }).then(() => {
                        expect(skippableProgress).toHaveBeenCalledWith(4);

                        skippableProgress.calls.reset();
                        jasmine.clock().tick(1000);
                    }).then(() => {
                        expect(skippableProgress).toHaveBeenCalledWith(3);

                        skippableProgress.calls.reset();
                        jasmine.clock().tick(1000);
                    }).then(() => {
                        expect(skippableProgress).toHaveBeenCalledWith(2);

                        skippableProgress.calls.reset();
                        jasmine.clock().tick(1000);
                    }).then(() => {
                        expect(skippableProgress).toHaveBeenCalledWith(1);
                        expect(becameSkippable).not.toHaveBeenCalled();
                    }).then(done, done.fail);
                });

                describe('when the timer reaches 0', function() {
                    beforeEach(function(done) {
                        Array.apply([], new Array(data.data.skip)).reduce(promise => {
                            return promise.then(() => {
                                jasmine.clock().tick(1000);
                            }).then(Promise.resolve());
                        }, Promise.resolve()).then(done, done.fail);
                    });

                    it('should call skippableProgress with 0', function() {
                        expect(skippableProgress).toHaveBeenCalledWith(0);
                    });

                    it('should set skippable to true', function() {
                        expect(card.skippable).toBe(true);
                    });

                    it('should emit becameSkippable()', function() {
                        expect(becameSkippable).toHaveBeenCalledWith();
                    });

                    describe('when a nother second passes', function() {
                        beforeEach(function(done) {
                            skippableProgress.calls.reset();
                            jasmine.clock().tick(1000);
                            Promise.resolve().then(done);
                        });

                        it('should do nothing', function() {
                            expect(skippableProgress).not.toHaveBeenCalled();
                        });
                    });
                });
            });
        });
    });
});
