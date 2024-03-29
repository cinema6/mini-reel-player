import timer from '../../../lib/timer.js';
import SponsoredCard from '../../../src/mixins/SponsoredCard.js';
import VideoCard from '../../../src/models/VideoCard.js';
import Card from '../../../src/models/Card.js';
import makeSocialLinks from '../../../src/fns/make_social_links.js';
import normalizeLinks from '../../../src/fns/normalize_links.js';
import environment from '../../../src/environment.js';

describe('VideoCard', function() {
    let card;
    let experience;
    let data;
    let sponsoredData;

    beforeEach(function() {
        jasmine.clock().install();

        experience = {
            data: {}
        };

        /* jshint quotmark:double */
        data = {
            "data": {
              "controls": true,
              "skip": true,
              "modestbranding": 0,
              "rel": 0,
              "videoid": "B5FcZrg_Nuo",
              "href": "https://www.youtube.com/watch?v=B5FcZrg_Nuo",
              "thumbs": {
                "small": "https://i.ytimg.com/vi/B5FcZrg_Nuo/default.jpg",
                "large": "https://i.ytimg.com/vi/B5FcZrg_Nuo/maxresdefault.jpg"
              },
              "start": 10,
              "end": 20
            },
            "id": "rc-68e8e50d9ffcfe",
            "type": "youtube",
            "title": "15. Tabloid",
            "note": "Errol Morris is the world’s greatest documentarian, and here he sinks his teeth into an irresistible tale of sex, kidnapping, and… Mormons. The story of the beautiful Joyce McKinney who kidnapped and allegedly raped a Mormon missionary is sensational enough. But the real scandal lies in the British tabloid wars between The Daily Mirror and The Daily Express which in a mad rush for readers stopped at nothing to unearth shady details about McKinney’s past and present. Anybody who believes journalism has fallen into the gutter thanks to the Internet should take note that this took place in 1977, when the Web was just a twinkle in Al Gore’s eye.",
            "source": "YouTube",
            "modules": [],
            "placementId": null,
            "templateUrl": null,
            "sponsored": false,
            "campaign": {
              "campaignId": null,
              "advertiserId": null,
              "minViewTime": null
            },
            "collateral": {},
            "links": {},
            "params": {}
        };
        /* jshint quotmark:single */

        /* jshint quotmark:double */
        sponsoredData = {
            "data": {
              "hideSource": true,
              "controls": true,
              "autoadvance": false,
              "skip": true,
              "modestbranding": 0,
              "rel": 0,
              "videoid": "q3tq4-IXA0M",
              "href": "https://www.youtube.com/watch?v=q3tq4-IXA0M",
              "moat" : {
                  "advertiser" : "Advertiser 1",
                  "campaign" : "Campaign 1",
                  "creative" : "Creative 1"
                }
            },
            "type": "youtube",
            "title": "Aziz Ansari Live at Madison Square Garden",
            "note": "Stand-up comedian and TV star (\"Parks and Recreation\") Aziz Ansari delivers his sharp-witted take on immigration, relationships and the food industry in his newest Netflix original comedy special, Aziz Ansari: Live At Madison Square Garden.",
            "source": "YouTube",
            "modules": [],
            "thumbs": {
              "small": "http://colorlines.com/assets_c/2011/08/Aziz-Ansari-racism-hollywood-thumb-640xauto-3843.jpg",
              "large": "http://colorlines.com/assets_c/2011/08/Aziz-Ansari-racism-hollywood-thumb-640xauto-3843.jpg"
            },
            "placementId": null,
            "templateUrl": null,
            "sponsored": true,
            "campaign": {
              "campaignId": null,
              "advertiserId": null,
              "minViewTime": -1
            },
            "collateral": {
              "logo": "https://pbs.twimg.com/profile_images/554776783967363072/2lxo5V22_400x400.png"
            },
            "links": {
              "Action": "http://www.netflix.com/WiMovie/80038296?locale=en-US",
              "Website": "http://www.netflix.com",
              "Facebook": "https://www.facebook.com/netflixus",
              "Twitter": "https://twitter.com/netflix",
              "Pinterest": "https://www.pinterest.com/netflix/",
              "YouTube": "https://www.youtube.com/user/NewOnNetflix",
              "Vimeo": "http://www.vimeo.com/video/37843"
            },
            "params": {
              "sponsor": "Netflix",
              "action": {
                "type": "button",
                "label": "Watch on Netflix"
              },
              "ad": true
            },
            "id": "rc-fc7d04deda983b"
        };
        /* jshint quotmark:single */

        environment.constructor();

        card = new VideoCard(data, experience);
    });

    afterEach(function() {
        jasmine.clock().uninstall();
    });

    afterAll(function() {
        environment.constructor();
    });

    it('should exist', function() {
        expect(card).toEqual(jasmine.any(Card));
    });

    it('should mix in SponsoredCard', function() {
        expect(VideoCard.mixins).toContain(SponsoredCard);
    });

    describe('properties:', function() {
        describe('type', function() {
            it('should be "video"', function() {
                expect(card.type).toBe('video');
            });
        });

        describe('thumbs', function() {
            it('should be a copy of data.thumbs', function() {
                expect(card.thumbs).toEqual(data.data.thumbs);
                expect(card.thumbs).not.toBe(data.data.thumbs);
            });

            describe('if the card has custom thumbs', function() {
                beforeEach(function() {
                    data.thumbs = {
                        small: 'my-custom-small.jpg',
                        large: 'my-custom-large.jpg'
                    };
                    card = new VideoCard(data, experience);
                });

                it('should be the custom thumbs', function() {
                    expect(card.thumbs).toEqual(data.thumbs);
                });
            });
        });

        describe('logo', function() {
            it('should be undefined', function() {
                expect(card.logo).toBeUndefined();
            });

            describe('on a sponsored card', function() {
                it('should be the logo', function() {
                    expect(new VideoCard(sponsoredData, experience).logo).toBe(sponsoredData.collateral.logo);
                });
            });
        });

        describe('links', function() {
            it('should be an empty object', function() {
                expect(card.links).toEqual({});
            });

            describe('on a sponsored card', function() {
                it('should be the normalizedLinks links', function() {
                    expect(new VideoCard(sponsoredData, experience).links).toEqual(normalizeLinks(sponsoredData.links));
                });
            });
        });

        describe('campaign', function() {
            it('should be the card\'s campaign', function() {
                expect(card.campaign).toBe(data.campaign);
            });
        });

        describe('socialLinks', function() {
            it('should be an array', function() {
                expect(card.socialLinks).toEqual([]);
            });

            describe('on a sponsored card', function() {
                it('should be an array of the supported social media links', function() {
                    const card = new VideoCard(sponsoredData, experience);

                    expect(card.socialLinks).toEqual(makeSocialLinks(card.links));
                });
            });
        });

        describe('sponsor', function() {
            it('should be undefined', function() {
                expect(card.sponsor).toBeUndefined();
            });

            describe('on a sponsored card', function() {
                it('should be the sponsor', function() {
                    expect(new VideoCard(sponsoredData, experience).sponsor).toBe(sponsoredData.params.sponsor);
                });
            });
        });

        describe('action', function() {
            it('should be an object', function() {
                expect(card.action).toEqual({});
            });

            describe('on a sponsored card', function() {
                it('should be the action', function() {
                    expect(new VideoCard(sponsoredData, experience).action).toBe(sponsoredData.params.action);
                });
            });
        });

        describe('ad', function() {
            it('should be false', function() {
                expect(card.ad).toBe(false);
            });

            describe('on a sponsored card', function() {
                it('should be true', function() {
                    expect(new VideoCard(sponsoredData, experience).ad).toBe(true);
                });
            });
        });

        describe('skippable', function() {
            it('should be true', function() {
                expect(card.skippable).toBe(true);
            });
        });

        describe('hasPlayed', function() {
            it('should be false', function() {
                expect(card.hasPlayed).toBe(false);
            });
        });

        describe('hasSkipControl', function() {
            describe('if data.skip is false', function() {
                beforeEach(function() {
                    data.data.skip = false;

                    card = new VideoCard(data, experience);
                });

                it('should be true', function() {
                    expect(card.hasSkipControl).toBe(true);
                });
            });

            describe('if data.skip is a Number', function() {
                beforeEach(function() {
                    data.data.skip = 6;

                    card = new VideoCard(data, experience);
                });

                it('should be true', function() {
                    expect(card.hasSkipControl).toBe(true);
                });
            });

            describe('if data.skip is true', function() {
                beforeEach(function() {
                    data.data.skip = true;

                    card = new VideoCard(data, experience);
                });

                it('should be false', function() {
                    expect(card.hasSkipControl).toBe(false);
                });
            });
        });

        describe('data', function() {
            it('should be an object with the video data', function() {
                expect(card.data).toEqual({
                    type: data.type,
                    source: data.source,
                    href: data.data.href,
                    videoid: data.data.videoid,
                    autoplay: true,
                    autoadvance: true,
                    preload: true,
                    hideSource: !!data.data.hideSource,
                    controls: data.data.controls,
                    start: data.data.start,
                    end: data.data.end
                });
            });

            describe('.autoplay', function() {
                beforeEach(function() {
                    delete environment.params.autoplay;
                });
                describe('if data.autoplay is true', function() {
                    beforeEach(function() {
                        experience.data.autoplay = false;
                        data.data.autoplay = true;
                        card = new VideoCard(data, experience);
                    });

                    it('should be true', function() {
                        expect(card.data.autoplay).toBe(true);
                    });

                    describe('if autoplay is configured globally', function() {
                        beforeEach(function() {
                            environment.params.autoplay = false;
                            card = new VideoCard(data, experience);
                        });

                        it('should use that value', function() {
                            expect(card.data.autoplay).toBe(false, 'autoplay does not match the environment param');
                        });
                    });
                });

                describe('if data.autoplay is false', function() {
                    beforeEach(function() {
                        experience.data.autoplay = true;
                        data.data.autoplay = false;
                        card = new VideoCard(data, experience);
                    });

                    it('should be false', function() {
                        expect(card.data.autoplay).toBe(false);
                    });

                    describe('if autoplay is configured globally', function() {
                        beforeEach(function() {
                            environment.params.autoplay = true;
                            card = new VideoCard(data, experience);
                        });

                        it('should use that value', function() {
                            expect(card.data.autoplay).toBe(true, 'autoplay does not match the environment param');
                        });
                    });
                });

                describe('if data.autoplay is not defined', function() {
                    beforeEach(function() {
                        delete data.data.autoplay;
                    });

                    describe('if true on the minireel', function() {
                        beforeEach(function() {
                            experience.data.autoplay = true;
                            card = new VideoCard(data, experience);
                        });

                        it('should be true', function() {
                            expect(card.data.autoplay).toBe(true);
                        });

                        describe('if autoplay is configured globally', function() {
                            beforeEach(function() {
                                environment.params.autoplay = false;
                                card = new VideoCard(data, experience);
                            });

                            it('should use that value', function() {
                                expect(card.data.autoplay).toBe(false, 'autoplay does not match the environment param');
                            });
                        });
                    });

                    describe('if false on the minireel', function() {
                        beforeEach(function() {
                            experience.data.autoplay = false;
                            card = new VideoCard(data, experience);
                        });

                        it('should be false', function() {
                            expect(card.data.autoplay).toBe(false);
                        });

                        describe('if autoplay is configured globally', function() {
                            beforeEach(function() {
                                environment.params.autoplay = true;
                                card = new VideoCard(data, experience);
                            });

                            it('should use that value', function() {
                                expect(card.data.autoplay).toBe(true, 'autoplay does not match the environment param');
                            });
                        });
                    });

                    describe('if undefined on the minireel', function() {
                        beforeEach(function() {
                            delete experience.data.autoplay;
                            card = new VideoCard(data, experience);
                        });

                        it('should be true', function() {
                            expect(card.data.autoplay).toBe(true);
                        });

                        describe('if autoplay is configured globally', function() {
                            beforeEach(function() {
                                environment.params.autoplay = false;
                                card = new VideoCard(data, experience);
                            });

                            it('should use that value', function() {
                                expect(card.data.autoplay).toBe(false, 'autoplay does not match the environment param');
                            });
                        });
                    });
                });
            });

            describe('.autoadvance', function() {
                describe('if data.autoadvance is true', function() {
                    beforeEach(function() {
                        experience.data.autoadvance = false;
                        data.data.autoadvance = true;
                        card = new VideoCard(data, experience);
                    });

                    it('should be true', function() {
                        expect(card.data.autoadvance).toBe(true);
                    });
                });

                describe('if data.autoadvance is false', function() {
                    beforeEach(function() {
                        experience.data.autoadvance = true;
                        data.data.autoadvance = false;
                        card = new VideoCard(data, experience);
                    });

                    it('should be false', function() {
                        expect(card.data.autoadvance).toBe(false);
                    });
                });

                describe('if data.autoadvance is not defined', function() {
                    beforeEach(function() {
                        delete data.data.autoadvance;
                    });

                    describe('if true on the minireel', function() {
                        beforeEach(function() {
                            experience.data.autoadvance = true;
                            card = new VideoCard(data, experience);
                        });

                        it('should be true', function() {
                            expect(card.data.autoadvance).toBe(true);
                        });
                    });

                    describe('if false on the minireel', function() {
                        beforeEach(function() {
                            experience.data.autoadvance = false;
                            card = new VideoCard(data, experience);
                        });

                        it('should be false', function() {
                            expect(card.data.autoadvance).toBe(false);
                        });
                    });

                    describe('if undefined on the minireel', function() {
                        beforeEach(function() {
                            delete experience.data.autoadvance;
                            card = new VideoCard(data, experience);
                        });

                        it('should be true', function() {
                            expect(card.data.autoadvance).toBe(true);
                        });
                    });
                });
            });

            describe('.preload', function() {
                describe('if data.preload is true', function() {
                    beforeEach(function() {
                        experience.data.preloadVideos = false;
                        data.data.preload = true;
                        card = new VideoCard(data, experience);
                    });

                    it('should be true', function() {
                        expect(card.data.preload).toBe(true);
                    });
                });

                describe('if data.preload is false', function() {
                    beforeEach(function() {
                        experience.data.preloadVideos = true;
                        data.data.preload = false;
                        card = new VideoCard(data, experience);
                    });

                    it('should be false', function() {
                        expect(card.data.preload).toBe(false);
                    });
                });

                describe('if data.preload is not defined', function() {
                    beforeEach(function() {
                        delete data.data.preload;
                    });

                    describe('if data.preloadVideos is true on the minireel', function() {
                        beforeEach(function() {
                            experience.data.preloadVideos = true;
                            card = new VideoCard(data, experience);
                        });

                        it('should be true', function() {
                            expect(card.data.preload).toBe(true);
                        });
                    });

                    describe('if data.preloadVideos is false on the minireel', function() {
                        beforeEach(function() {
                            experience.data.preloadVideos = false;
                            card = new VideoCard(data, experience);
                        });

                        it('should be false', function() {
                            expect(card.data.preload).toBe(false);
                        });
                    });

                    describe('if data.preloadVideos is not defined on the minireel', function() {
                        beforeEach(function() {
                            delete experience.data.preloadVideos;
                            card = new VideoCard(data, experience);
                        });

                        it('should be true', function() {
                            expect(card.data.preload).toBe(true);
                        });
                    });
                });
            });
        });
    });

    describe('methods:', function() {
        describe('getSrc()', function() {
            it('should return the videoid', function() {
                expect(card.getSrc()).toBe(card.data.videoid);
            });
        });

        describe('activate()', function() {
            let becameUnskippable;
            let skippableProgress;

            beforeEach(function() {
                becameUnskippable = jasmine.createSpy('becameUnskippable()');
                skippableProgress = jasmine.createSpy('skippableProgress()');
                spyOn(Card.prototype, 'activate');
                spyOn(timer, 'wait').and.callThrough();

                card.activate();
            });

            it('should call super()', function() {
                expect(Card.prototype.activate).toHaveBeenCalled();
            });

            [undefined, true, 0].forEach(function(value) {
                describe('if the card can be skipped at anytime', function() {
                    beforeEach(function() {
                        data.data.skip = value;
                        card = new VideoCard(data, experience);
                        card.on('becameUnskippable', becameUnskippable);
                        card.on('skippableProgress', skippableProgress);

                        card.activate();
                    });

                    it('should not emit becameUnskippable', function() {
                        expect(becameUnskippable).not.toHaveBeenCalled();
                    });

                    it('should not emit skippableProgress', function() {
                        expect(skippableProgress).not.toHaveBeenCalled();
                    });

                    it('should not set skippable to false', function() {
                        expect(card.skippable).not.toBe(false);
                    });

                    it('should not set a timer', function() {
                        expect(timer.wait).not.toHaveBeenCalled();
                    });
                });
            });

            describe('if the skip value is greater than 10 and 10 seconds elapses', function() {
                beforeEach(function(done) {
                    data.data.skip = 30;
                    card = new VideoCard(data, experience);
                    spyOn(card, 'abort').and.callThrough();

                    card.activate();
                    jasmine.clock().tick(5000);
                    card.hasPlayed = false;
                    jasmine.clock().tick(5000);
                    Promise.resolve().then(done);
                });

                it('should only wait 10 seconds to abort the card', function() {
                    expect(card.abort).toHaveBeenCalled();
                });
            });

            describe('if the skip value time elapses', function() {
                beforeEach(function() {
                    data.data.skip = 5;
                    card = new VideoCard(data, experience);
                    spyOn(card, 'abort').and.callThrough();

                    card.activate();
                });

                describe('and the video has never played', function() {
                    beforeEach(function(done) {
                        card.hasPlayed = false;
                        jasmine.clock().tick(5000);
                        Promise.resolve().then(done);
                    });

                    it('should abort() the card', function() {
                        expect(card.abort).toHaveBeenCalled();
                    });
                });

                describe('and the video has played', function() {
                    beforeEach(function(done) {
                        jasmine.clock().tick(1000);
                        card.emit('hasPlayed');
                        card.hasPlayed = true;
                        jasmine.clock().tick(4000);
                        Promise.resolve().then(done);
                    });

                    it('should not abort() the card', function() {
                        expect(card.abort).not.toHaveBeenCalled();
                    });
                });
            });

            describe('if the card can be skipped after a specified period of time', function() {
                beforeEach(function() {
                    data.data.skip = 10;
                    card = new VideoCard(data, experience);
                    card.on('becameUnskippable', becameUnskippable);
                    card.on('skippableProgress', skippableProgress);

                    card.activate();
                });

                it('should emit the becameUnskippable event', function() {
                    expect(becameUnskippable).toHaveBeenCalled();
                });

                it('should set skippable to false', function() {
                    expect(card.skippable).toBe(false);
                });

                it('should not emit skippableProgress', function() {
                    expect(skippableProgress).not.toHaveBeenCalled();
                });

                describe('when setPlaybackState() is called', function() {
                    let becameSkippable;

                    beforeEach(function() {
                        becameSkippable = jasmine.createSpy('becameSkippable()');
                        card.on('becameSkippable', becameSkippable);
                    });

                    it('should emit skippableProgress', function() {
                        card.setPlaybackState({ currentTime: 0.6, duration: 30, paused: false });
                        expect(skippableProgress).toHaveBeenCalledWith(Math.round(9.4));
                        skippableProgress.calls.reset();

                        card.setPlaybackState({ currentTime: 2.5, duration: 30, paused: false });
                        expect(skippableProgress).toHaveBeenCalledWith(Math.round(7.5));

                        card.setPlaybackState({ currentTime: 5, duration: 30, paused: false });
                        expect(skippableProgress).toHaveBeenCalledWith(5);

                        expect(becameSkippable).not.toHaveBeenCalled();
                    });

                    describe('if the video is shorter than the skip value', function() {
                        it('should shorten the skip time to the duration of the video', function() {
                            card.setPlaybackState({ currentTime: 0.6, duration: 8, paused: false });
                            expect(skippableProgress).toHaveBeenCalledWith(Math.round(7.4));
                            skippableProgress.calls.reset();

                            card.setPlaybackState({ currentTime: 2.5, duration: 8, paused: false });
                            expect(skippableProgress).toHaveBeenCalledWith(Math.round(5.5));

                            card.setPlaybackState({ currentTime: 5, duration: 8, paused: false });
                            expect(skippableProgress).toHaveBeenCalledWith(3);

                            expect(becameSkippable).not.toHaveBeenCalled();
                        });
                    });

                    describe('when the amount of time has been reached', function() {
                        beforeEach(function() {
                            card.setPlaybackState({ currentTime: 9.55, duration: 40, paused: false });
                            card.setPlaybackState({ currentTime: 10, duration: 40, paused: false });
                        });

                        it('should set skippable to true', function() {
                            expect(card.skippable).toBe(true);
                        });

                        it('should set hasSkipControl to false', function() {
                            expect(card.hasSkipControl).toBe(false);
                        });

                        it('should emit becameSkippable', function() {
                            expect(becameSkippable).toHaveBeenCalled();
                            expect(becameSkippable.calls.count()).toBe(1);
                        });
                    });
                });
            });

            [false, -1].forEach(function(value) {
                describe('if the card cannot be skipped until after the entire video is watched', function() {
                    beforeEach(function() {
                        data.data.skip = value;
                        card = new VideoCard(data, experience);
                        card.on('becameUnskippable', becameUnskippable);
                        card.on('skippableProgress', skippableProgress);
                        spyOn(timer, 'interval').and.returnValue(new Promise(() => {}));

                        card.activate();
                    });

                    it('should set skippable to false', function() {
                        expect(card.skippable).toBe(false);
                    });

                    it('should emit becameUnskippable', function() {
                        expect(becameUnskippable).toHaveBeenCalled();
                    });

                    it('should not set an interval', function() {
                        expect(timer.interval).not.toHaveBeenCalled();
                    });

                    it('should not emit skippableProgress', function() {
                        expect(skippableProgress).not.toHaveBeenCalled();
                    });

                    describe('when setPlaybackState() is called', function() {
                        let becameSkippable;

                        beforeEach(function() {
                            becameSkippable = jasmine.createSpy('becameSkippable()');
                            card.on('becameSkippable', becameSkippable);
                        });

                        it('should emit skippableProgress', function() {
                            card.setPlaybackState({ currentTime: 0.6, duration: 30, paused: false });
                            expect(skippableProgress).toHaveBeenCalledWith(Math.round(29.4));
                            skippableProgress.calls.reset();

                            card.setPlaybackState({ currentTime: 2.5, duration: 30, paused: false });
                            expect(skippableProgress).toHaveBeenCalledWith(Math.round(27.5));

                            card.setPlaybackState({ currentTime: 5, duration: 30, paused: false });
                            expect(skippableProgress).toHaveBeenCalledWith(25);

                            expect(becameSkippable).not.toHaveBeenCalled();
                        });

                        describe('when the video is effectively over', function() {
                            beforeEach(function() {
                                card.setPlaybackState({ currentTime: 39.55, duration: 40, paused: false });
                                card.setPlaybackState({ currentTime: 40, duration: 40, paused: false });
                            });

                            it('should set skippable to true', function() {
                                expect(card.skippable).toBe(true);
                            });

                            it('should set hasSkipControl to false', function() {
                                expect(card.hasSkipControl).toBe(false);
                            });

                            it('should emit becameSkippable', function() {
                                expect(becameSkippable).toHaveBeenCalled();
                                expect(becameSkippable.calls.count()).toBe(1);
                            });
                        });
                    });
                });
            });
        });

        describe('setPlaybackState()', function() {
            let skippableProgress;
            let hasPlayed;

            beforeEach(function() {
                skippableProgress = jasmine.createSpy('skippableProgress()');
                hasPlayed = jasmine.createSpy('hasPlayed()');
            });

            describe('if the card is skippable', function() {
                beforeEach(function() {
                    data.data.skip = true;
                    card = new VideoCard(data, experience);
                    card.on('skippableProgress', skippableProgress);
                    card.activate();

                    card.setPlaybackState({ currentTime: 4, duration: 6, paused: false });
                });

                it('should not emit skippableProgress', function() {
                    expect(skippableProgress).not.toHaveBeenCalled();
                });
            });

            describe('if the video never becomes unpaused', function() {
                beforeEach(function() {
                    card = new VideoCard(data, experience);
                    card.on('hasPlayed', hasPlayed);

                    card.setPlaybackState({ currentTime: 4, duration: 6, paused: true });
                    card.setPlaybackState({ currentTime: 2, duration: 6, paused: true });
                    card.setPlaybackState({ currentTime: 1, duration: 6, paused: true });
                });

                it('should keep hasPlayed as false', function() {
                    expect(card.hasPlayed).toBe(false);
                });

                it('should not emit hasPlayed', function() {
                    expect(hasPlayed).not.toHaveBeenCalled();
                });
            });

            describe('if the video unpauses once', function() {
                beforeEach(function() {
                    card = new VideoCard(data, experience);
                    card.on('hasPlayed', hasPlayed);

                    card.setPlaybackState({ currentTime: 4, duration: 6, paused: true });
                    card.setPlaybackState({ currentTime: 2, duration: 6, paused: false });
                    card.setPlaybackState({ currentTime: 2.2, duration: 6, paused: false });
                    card.setPlaybackState({ currentTime: 1, duration: 6, paused: true });
                });

                it('should make hasPlayed true', function() {
                    expect(card.hasPlayed).toBe(true);
                });

                it('should emit hasPlayed', function() {
                    expect(hasPlayed).toHaveBeenCalled();
                    expect(hasPlayed.calls.count()).toBe(1);
                });
            });
        });

        describe('complete()', function() {
            let spy;

            beforeEach(function() {
                spy = jasmine.createSpy('spy()');
                card.on('canAdvance', spy);
            });

            describe('if autoadvance is true', function() {
                beforeEach(function() {
                    card.data.autoadvance = true;

                    card.complete();
                });

                it('should emit "canAdvance"', function() {
                    expect(spy).toHaveBeenCalled();
                });

                describe('if the card is not skippable', function() {
                    beforeEach(function() {
                        card.skippable = false;
                        spy.calls.reset();

                        card.complete();
                    });

                    it('should not emit "canAdvance"', function() {
                        expect(spy).not.toHaveBeenCalled();
                    });

                    describe('when the card becomes skippable', function() {
                        beforeEach(function() {
                            card.emit('becameSkippable');
                        });

                        it('should emit "canAdvance"', function() {
                            expect(spy).toHaveBeenCalled();
                        });
                    });
                });
            });

            describe('if autoadvance is true', function() {
                beforeEach(function() {
                    card.data.autoadvance = false;

                    card.complete();
                });

                it('should not emit "canAdvance"', function() {
                    expect(spy).not.toHaveBeenCalled();
                });
            });
        });

        describe('abort()', function() {
            let becameSkippable;

            beforeEach(function() {
                becameSkippable = jasmine.createSpy('becameSkippable()');
                card.on('becameSkippable', becameSkippable);

                spyOn(Card.prototype, 'abort').and.callThrough();
            });

            describe('if the card is skippable', function() {
                beforeEach(function() {
                    card.skippable = true;

                    card.abort();
                });

                it('should call super()', function() {
                    expect(Card.prototype.abort).toHaveBeenCalled();
                });

                it('should not emit becameSkippable', function() {
                    expect(becameSkippable).not.toHaveBeenCalled();
                });
            });

            describe('if the card is not skippable', function() {
                beforeEach(function() {
                    card.skippable = false;

                    card.abort();
                });

                it('should call super()', function() {
                    expect(Card.prototype.abort).toHaveBeenCalled();
                });

                it('should set skippable to true', function() {
                    expect(card.skippable).toBe(true);
                });

                it('should emit becameSkippable', function() {
                    expect(becameSkippable).toHaveBeenCalled();
                });
            });
        });

        describe('reset()', function() {
            beforeEach(function() {
                spyOn(Card.prototype, 'reset').and.callThrough();
            });

            describe('if the card had skip controls', function() {
                beforeEach(function() {
                    data.data.skip = false;
                    card = new VideoCard(data, experience);
                    card.hasSkipControl = false;
                    card.hasPlayed = true;

                    card.reset();
                });

                it('should call super()', function() {
                    expect(Card.prototype.reset).toHaveBeenCalled();
                });

                it('should set hasSkipControl to true', function() {
                    expect(card.hasSkipControl).toBe(true);
                });

                it('should set hasPlayed to false', function() {
                    expect(card.hasPlayed).toBe(false);
                });
            });

            describe('if the card had no skip controls', function() {
                beforeEach(function() {
                    data.data.skip = true;
                    card = new VideoCard(data, experience);
                    card.hasPlayed = true;

                    card.reset();
                });

                it('should call super()', function() {
                    expect(Card.prototype.reset).toHaveBeenCalled();
                });

                it('should set hasSkipControl to false', function() {
                    expect(card.hasSkipControl).toBe(false);
                });

                it('should set hasPlayed to false', function() {
                    expect(card.hasPlayed).toBe(false);
                });
            });
        });
    });
});
