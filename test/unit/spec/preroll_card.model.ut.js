import PrerollCard from '../../../src/models/PrerollCard.js';
import AdUnitCard from '../../../src/models/AdUnitCard.js';

describe('PrerollCard', function() {
    let card;
    let data;
    let experience;
    let profile;
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
        profile = { flash: false };
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

        card = new PrerollCard(data, experience, profile, minireel);
    });

    it('should exist', function() {
        expect(card).toEqual(jasmine.any(AdUnitCard));
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
                describe('if the device does not support flash', function() {
                    beforeEach(function() {
                        profile.flash = false;
                    });

                    describe('if the waterfall is "cinema6"', function() {
                        beforeEach(function() {
                            minireel.adConfig.video.waterfall = 'cinema6';

                            card = new PrerollCard(data, experience, profile, minireel);
                        });

                        it('should be the cinema6 VAST tag', function() {
                            expect(card.data.videoid).toBe('http://ads.adaptv.advertising.com//a/h/DCQzzI0K2rv1k0TZythPvTfWmlP8j6NQnxBMIgFJa80=?cb={cachebreaker}&pageUrl={pageUrl}&eov=eov');
                        });
                    });

                    describe('if the waterfall is "publisher"', function() {
                        beforeEach(function() {
                            minireel.adConfig.video.waterfall = 'publisher';

                            card = new PrerollCard(data, experience, profile, minireel);
                        });

                        it('should be the publisher VAST tag', function() {
                            expect(card.data.videoid).toBe('http://ads.adaptv.advertising.com/a/h/DCQzzI0K2runZ1YEc6FP2ey+WPdagwFmdz7a2uK_A_c=?cb={cachebreaker}&pageUrl={pageUrl}&eov=eov');
                        });
                    });

                    describe('if the waterfall is "cinema6-publisher"', function() {
                        beforeEach(function() {
                            minireel.adConfig.video.waterfall = 'cinema6-publisher';

                            card = new PrerollCard(data, experience, profile, minireel);
                        });

                        it('should be the cinema6-publisher VAST tag', function() {
                            expect(card.data.videoid).toBe('http://ads.adaptv.advertising.com/a/h/DCQzzI0K2rv1k0TZythPvadnVgRzoU_Z7L5Y91qDAWYoGast41+eSw==?cb={cachebreaker}&pageUrl={pageUrl}&eov=eov');
                        });
                    });

                    describe('if the waterfall is "publisher-cinema6"', function() {
                        beforeEach(function() {
                            minireel.adConfig.video.waterfall = 'publisher-cinema6';

                            card = new PrerollCard(data, experience, profile, minireel);
                        });

                        it('should be the publisher-cinema6 VAST tag', function() {
                            expect(card.data.videoid).toBe('http://ads.adaptv.advertising.com/a/h/DCQzzI0K2runZ1YEc6FP2fCQPSbU6FwIZz5J5C0Fsw29iCueyXx8iw==?cb={cachebreaker}&pageUrl={pageUrl}&eov=eov');
                        });
                    });
                });

                describe('if the device does support flash', function() {
                    beforeEach(function() {
                        profile.flash = true;
                    });

                    describe('if the waterfall is "cinema6"', function() {
                        beforeEach(function() {
                            minireel.adConfig.video.waterfall = 'cinema6';

                            card = new PrerollCard(data, experience, profile, minireel);
                        });

                        it('should be the cinema6 VPAID tag', function() {
                            expect(card.data.videoid).toBe('http://u-ads.adap.tv/a/h/DCQzzI0K2rv1k0TZythPvYyD60pQS_90o8grI6Qm2PI=?cb={cachebreaker}&pageUrl={pageUrl}&eov=eov');
                        });
                    });

                    describe('if the waterfall is "publisher"', function() {
                        beforeEach(function() {
                            minireel.adConfig.video.waterfall = 'publisher';

                            card = new PrerollCard(data, experience, profile, minireel);
                        });

                        it('should be the publisher VPAID tag', function() {
                            expect(card.data.videoid).toBe('http://u-ads.adap.tv/a/h/DCQzzI0K2runZ1YEc6FP2T65tHqs_Nwo9+XmsX4pnb4=?cb={cachebreaker}&pageUrl={pageUrl}&eov=eov');
                        });
                    });

                    describe('if the waterfall is "cinema6-publisher"', function() {
                        beforeEach(function() {
                            minireel.adConfig.video.waterfall = 'cinema6-publisher';

                            card = new PrerollCard(data, experience, profile, minireel);
                        });

                        it('should be the cinema6-publisher VPAID tag', function() {
                            expect(card.data.videoid).toBe('http://u-ads.adap.tv/a/h/DCQzzI0K2rv1k0TZythPvadnVgRzoU_ZPrm0eqz83CjfbcCg1uJO3w==?cb={cachebreaker}&pageUrl={pageUrl}&eov=eov');
                        });
                    });

                    describe('if the waterfall is "publisher-cinema6"', function() {
                        beforeEach(function() {
                            minireel.adConfig.video.waterfall = 'publisher-cinema6';

                            card = new PrerollCard(data, experience, profile, minireel);
                        });

                        it('should be the publisher-cinema6 VPAID tag', function() {
                            expect(card.data.videoid).toBe('http://u-ads.adap.tv/a/h/DCQzzI0K2runZ1YEc6FP2fCQPSbU6FwIdK4EW3jlLzbnPQftO7fDdA==?cb={cachebreaker}&pageUrl={pageUrl}&eov=eov');
                        });
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

        describe('deactivate()', function() {
            beforeEach(function() {
                spyOn(AdUnitCard.prototype, 'deactivate').and.callThrough();
                spyOn(card, 'reset').and.callThrough();

                card.deactivate();
            });

            it('should call super()', function() {
                expect(AdUnitCard.prototype.deactivate).toHaveBeenCalled();
            });

            it('should call reset()', function() {
                expect(card.reset).toHaveBeenCalled();
            });
        });

        describe('abort()', function() {
            let canAdvance;

            beforeEach(function() {
                canAdvance = jasmine.createSpy('canAdvance()');
                card.on('canAdvance', canAdvance);

                spyOn(AdUnitCard.prototype, 'abort').and.callThrough();

                card.abort();
            });

            it('should call super()', function() {
                expect(AdUnitCard.prototype.abort).toHaveBeenCalled();
            });

            it('should emit canAdvance', function() {
                expect(canAdvance).toHaveBeenCalled();
            });
        });
    });
});
