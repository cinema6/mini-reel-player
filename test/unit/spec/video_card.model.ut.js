describe('VideoCard', function() {
    import VideoCard from '../../../src/models/VideoCard.js';
    import Card from '../../../src/models/Card.js';
    let card;

    /* jshint quotmark:double */
    const data = {
        "data": {
          "controls": true,
          "skip": true,
          "modestbranding": 0,
          "rel": 0,
          "videoid": "B5FcZrg_Nuo",
          "href": "https://www.youtube.com/watch?v=B5FcZrg_Nuo"
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
    const sponsoredData = {
        "data": {
          "hideSource": true,
          "controls": true,
          "autoadvance": false,
          "skip": true,
          "modestbranding": 0,
          "rel": 0,
          "videoid": "q3tq4-IXA0M",
          "href": "https://www.youtube.com/watch?v=q3tq4-IXA0M"
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
          "YouTube": "https://www.youtube.com/user/NewOnNetflix"
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

    beforeEach(function() {
        card = new VideoCard(data);
    });

    it('should exist', function() {
        expect(card).toEqual(jasmine.any(Card));
    });

    describe('properties:', function() {
        describe('type', function() {
            it('should be "video"', function() {
                expect(card.type).toBe('video');
            });
        });

        describe('logo', function() {
            it('should be undefined', function() {
                expect(card.logo).toBeUndefined();
            });

            describe('on a sponsored card', function() {
                it('should be the logo', function() {
                    expect(new VideoCard(sponsoredData).logo).toBe(sponsoredData.collateral.logo);
                });
            });
        });

        describe('links', function() {
            it('should be an empty object', function() {
                expect(card.links).toEqual({});
            });

            describe('on a sponsored card', function() {
                it('should be the links', function() {
                    expect(new VideoCard(sponsoredData).links).toBe(sponsoredData.links);
                });
            });
        });

        describe('sponsor', function() {
            it('should be undefined', function() {
                expect(card.sponsor).toBeUndefined();
            });

            describe('on a sponsored card', function() {
                it('should be the sponsor', function() {
                    expect(new VideoCard(sponsoredData).sponsor).toBe(sponsoredData.params.sponsor);
                });
            });
        });

        describe('action', function() {
            it('should be an object', function() {
                expect(card.action).toEqual({});
            });

            describe('on a sponsored card', function() {
                it('should be the action', function() {
                    expect(new VideoCard(sponsoredData).action).toBe(sponsoredData.params.action);
                });
            });
        });

        describe('ad', function() {
            it('should be false', function() {
                expect(card.ad).toBe(false);
            });

            describe('on a sponsored card', function() {
                it('should be true', function() {
                    expect(new VideoCard(sponsoredData).ad).toBe(true);
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
                    hideSource: !!data.data.hideSource
                });
            });

            describe('.autoplay', function() {
                describe('if data.autoplay is true', function() {
                    beforeEach(function() {
                        data.data.autoplay = true;
                        card = new VideoCard(data, false);
                    });

                    it('should be true', function() {
                        expect(card.data.autoplay).toBe(true);
                    });
                });

                describe('if data.autoplay is false', function() {
                    beforeEach(function() {
                        data.data.autoplay = false;
                        card = new VideoCard(data, true);
                    });

                    it('should be false', function() {
                        expect(card.data.autoplay).toBe(false);
                    });
                });

                describe('if data.autoplay is not defined', function() {
                    beforeEach(function() {
                        delete data.data.autoplay;
                    });

                    describe('if true on the minireel', function() {
                        beforeEach(function() {
                            card = new VideoCard(data, true);
                        });

                        it('should be true', function() {
                            expect(card.data.autoplay).toBe(true);
                        });
                    });

                    describe('if false on the minireel', function() {
                        beforeEach(function() {
                            card = new VideoCard(data, false);
                        });

                        it('should be false', function() {
                            expect(card.data.autoplay).toBe(false);
                        });
                    });

                    describe('if undefined on the minireel', function() {
                        beforeEach(function() {
                            card = new VideoCard(data, undefined);
                        });

                        it('should be true', function() {
                            expect(card.data.autoplay).toBe(true);
                        });
                    });
                });
            });

            describe('.autoadvance', function() {
                describe('if data.autoadvance is true', function() {
                    beforeEach(function() {
                        data.data.autoadvance = true;
                        card = new VideoCard(data, undefined, false);
                    });

                    it('should be true', function() {
                        expect(card.data.autoadvance).toBe(true);
                    });
                });

                describe('if data.autoadvance is false', function() {
                    beforeEach(function() {
                        data.data.autoadvance = false;
                        card = new VideoCard(data, undefined, true);
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
                            card = new VideoCard(data, undefined, true);
                        });

                        it('should be true', function() {
                            expect(card.data.autoadvance).toBe(true);
                        });
                    });

                    describe('if false on the minireel', function() {
                        beforeEach(function() {
                            card = new VideoCard(data, undefined, false);
                        });

                        it('should be false', function() {
                            expect(card.data.autoadvance).toBe(false);
                        });
                    });

                    describe('if undefined on the minireel', function() {
                        beforeEach(function() {
                            card = new VideoCard(data, undefined, undefined);
                        });

                        it('should be true', function() {
                            expect(card.data.autoadvance).toBe(true);
                        });
                    });
                });
            });
        });
    });

    describe('methods:', function() {
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
    });
});
