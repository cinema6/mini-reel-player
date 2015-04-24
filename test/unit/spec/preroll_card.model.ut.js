import PrerollCard from '../../../src/models/PrerollCard.js';
import VideoCard from '../../../src/models/VideoCard.js';

describe('PrerollCard', function() {
    let card;
    let data;
    let experience;
    let minireel;

    beforeEach(function() {
        data = {
            collateral: {},
            params: {},
            data: {}
        };
        experience = {
            data: {
                params: {}
            },
            collateral: {}
        };
        minireel = {
            adConfig: {
                video: {
                    firstPlacement: 1,
                    frequency: 3,
                    waterfall: 'cinema6',
                    skip: 6
                },
                display: {
                    waterfall: 'cinema6'
                }
            }
        };

        card = new PrerollCard(data, experience, minireel);
    });

    it('should exist', function() {
        expect(card).toEqual(jasmine.any(VideoCard));
    });

    describe('properties:', function() {
        describe('data', function() {
            describe('.autoplay', function() {
                it('should be true', function() {
                    expect(card.data.autoplay).toBe(true);
                });
            });

            describe('.autoadvance', function() {
                it('should be true', function() {
                    expect(card.data.autoadvance).toBe(true);
                });
            });

            describe('.videoid', function() {
                describe('if the waterfall is "cinema6"', function() {
                    beforeEach(function() {
                        minireel.adConfig.video.waterfall = 'cinema6';

                        card = new PrerollCard(data, experience, minireel);
                    });

                    it('should be the cinema6 VAST tag', function() {
                        expect(card.data.videoid).toBe('http://ads.adaptv.advertising.com//a/h/DCQzzI0K2rv1k0TZythPvTfWmlP8j6NQnxBMIgFJa80=?cb={cachebreaker}&pageUrl={pageUrl}&eov=eov');
                    });
                });

                describe('if the waterfall is "publisher"', function() {
                    beforeEach(function() {
                        minireel.adConfig.video.waterfall = 'publisher';

                        card = new PrerollCard(data, experience, minireel);
                    });

                    it('should be the publisher VAST tag', function() {
                        expect(card.data.videoid).toBe('http://ads.adaptv.advertising.com/a/h/DCQzzI0K2runZ1YEc6FP2ey+WPdagwFmdz7a2uK_A_c=?cb={cachebreaker}&pageUrl={pageUrl}&eov=eov');
                    });
                });

                describe('if the waterfall is "cinema6-publisher"', function() {
                    beforeEach(function() {
                        minireel.adConfig.video.waterfall = 'cinema6-publisher';

                        card = new PrerollCard(data, experience, minireel);
                    });

                    it('should be the cinema6-publisher VAST tag', function() {
                        expect(card.data.videoid).toBe('http://ads.adaptv.advertising.com/a/h/DCQzzI0K2rv1k0TZythPvadnVgRzoU_Z7L5Y91qDAWYoGast41+eSw==?cb={cachebreaker}&pageUrl={pageUrl}&eov=eov');
                    });
                });

                describe('if the waterfall is "publisher-cinema6"', function() {
                    beforeEach(function() {
                        minireel.adConfig.video.waterfall = 'publisher-cinema6';

                        card = new PrerollCard(data, experience, minireel);
                    });

                    it('should be the publisher-cinema6 VAST tag', function() {
                        expect(card.data.videoid).toBe('http://ads.adaptv.advertising.com/a/h/DCQzzI0K2runZ1YEc6FP2fCQPSbU6FwIZz5J5C0Fsw29iCueyXx8iw==?cb={cachebreaker}&pageUrl={pageUrl}&eov=eov');
                    });
                });
            });
        });
    });

    describe('methods:', function() {
        describe('activate()', function() {
            let becameUnskippable;

            beforeEach(function() {
                jasmine.clock().install();

                becameUnskippable = jasmine.createSpy('becameUnskippable()');
                card.on('becameUnskippable', becameUnskippable);

                card.activate();
            });

            afterEach(function() {
                jasmine.clock().uninstall();
            });

            it('should respect the skip setting of the adConfig', function() {
                expect(becameUnskippable).toHaveBeenCalled();
            });
        });
    });
});
