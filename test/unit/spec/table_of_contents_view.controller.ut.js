describe('TableOfContentsViewController', function() {
    import ViewController from '../../../src/controllers/ViewController.js';
    import TableOfContentsViewController from '../../../src/controllers/TableOfContentsViewController.js';
    import TableOfContentsView from '../../../src/views/TableOfContentsView.js';
    import MiniReel from '../../../src/models/MiniReel.js';
    import cinema6 from '../../../src/services/cinema6.js';
    let TableOfContentsViewCtrl;
    let minireel;

    /* jshint quotmark:double */
    const experience = {
      "access": "public",
      "appUri": "rumble",
      "created": "2015-02-05T15:52:29.275Z",
      "data": {
        "title": "The 15 best movies of the decade (so far) that you can watch on Netflix right now",
        "mode": "lightbox",
        "autoplay": false,
        "autoadvance": true,
        "sponsored": true,
        "links": {
          "Website": "http://pando.com/2015/02/03/the-15-best-movies-of-the-decade-so-far-that-you-can-watch-on-netflix-right-now/",
          "Facebook": "https://www.facebook.com/pandodaily",
          "Twitter": "https://twitter.com/pandodaily"
        },
        "params": {
          "sponsor": "PandoDaily (by David Holmes)"
        },
        "campaign": {},
        "collateral": {
          "splash": "/collateral/experiences/e-42108b552a05ea/splash",
          "logo": "https://pbs.twimg.com/profile_images/1764819620/Pando_Twitter_Logo_400x400.jpg"
        },
        "splash": {
          "source": "specified",
          "ratio": "6-5",
          "theme": "img-only"
        },
        "adServer": {},
        "deck": [
          {
            "data": {
              "controls": true,
              "skip": true,
              "modestbranding": 0,
              "rel": 0,
              "videoid": "B5FcZrg_Nuo",
              "href": "https://www.youtube.com/watch?v=B5FcZrg_Nuo"
            },
            "thumbs": {
                "small": "https://i.ytimg.com/vi/B5FcZrg_Nuo/default.jpg",
                "large": "https://i.ytimg.com/vi/B5FcZrg_Nuo/maxresdefault.jpg"
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
          },
          {
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
          },
          {
            "data": {
              "controls": true,
              "skip": true,
              "modestbranding": 0,
              "rel": 0,
              "videoid": "xy2JQ0HqCuk",
              "href": "https://www.youtube.com/watch?v=xy2JQ0HqCuk"
            },
            "thumbs": {
                "small": "https://i.ytimg.com/vi/xy2JQ0HqCuk/default.jpg",
                "large": "https://i.ytimg.com/vi/xy2JQ0HqCuk/maxresdefault.jpg"
            },
            "id": "rc-991add397b93ca",
            "type": "youtube",
            "title": "14. Killing Them Softly",
            "note": "Killing Them Softly has the dishonor of being one of only eight films to have received an “F” from Cinemascore audiences; these are the early viewers who watch movies before the rest of the world as part of market research. Maybe when audiences saw Brad Pitt on the movie poster pointing a shotgun they expected a sexy, sassy action romp like Pitt’s Ocean’s Eleven. Instead, they were subjected to a brutally violent and calculatedly abrasive mob drama that doubles as an allegory for the hopelessness of American politics and capitalism. But what Killing Them Softly lacks in cheap thrills, it makes up for with a sense of realism that telegraphs just how lonely and deflating it can be to “make it” in America — whether you’re a member of the corporate straight world or a hitman like Pitt’s character. The best you can hope for is the fleeting thrill of a score, the initial rush of a heroin injection, and the false promise that a man like Barack Obama can actually change the world for the better before the hangover kicks in.",
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
          },
          {
            "data": {
              "controls": true,
              "skip": true,
              "modestbranding": 0,
              "rel": 0,
              "videoid": "79aNkyz7bO8",
              "href": "https://www.youtube.com/watch?v=79aNkyz7bO8"
            },
            "thumbs": {
                "small": "https://i.ytimg.com/vi/79aNkyz7bO8/default.jpg",
                "large": "https://i.ytimg.com/vi/79aNkyz7bO8/maxresdefault.jpg"
            },
            "id": "rc-1fd0876d8d482f",
            "type": "youtube",
            "title": "13. Prince Avalanche",
            "note": "There was a healthy amount of shock among seasoned filmgoers when it was revealed that David Gordon Green, who made his name directing quietly devastating independent dramas, was slated to direct the Seth Rogen buddy comedy Pineapple Express. That film happened to be the most accomplished and enjoyable Seth Rogen movie to date, but it bore little resemblance to Green’s earlier work. Prince Avalanche, however, which lacked the studio demands of a Rogen mega-comedy, is precisely what viewers would expect from a David Gordon Green buddy flick. Starring Paul Rudd, who never ages, and Emile Hirsch, who looks older and more like Jack Black every day, Prince Avalanche is a slow and somber meditation on growing up that’s also full of hysterical bad behavior and puerile jokes. It’s a rare and beautiful piece of filmmaking that isn’t afraid to mix high art with low brow humor.",
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
          },
          {
            "data": {},
            "id": "rc-60b247489263c5",
            "type": "recap",
            "title": "Recap of The 15 best movies of the decade (so far) that you can watch on Netflix right now",
            "note": null,
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
          }
        ]
      },
      "versionId": "ec7d727d",
      "title": "The 15 best movies of the decade (so far) that you can watch on Netflix right now",
      "id": "e-42108b552a05ea",
      "lastUpdated": "2015-02-05T16:23:03.604Z",
      "org": "o-a61cbc73256d22",
      "status": "active",
      "lastPublished": "2015-02-05T16:04:34.754Z",
      "type": "minireel",
      "user": "u-fde2d9fadd3ce0"
    };
    /* jshint quotmark:single */

    beforeEach(function(done) {
        spyOn(cinema6, 'getAppData').and.returnValue(Promise.resolve({
            experience: experience
        }));
        minireel = new MiniReel();
        spyOn(TableOfContentsView.prototype, 'update');
        spyOn(TableOfContentsView.prototype, 'hide');
        spyOn(TableOfContentsView.prototype, 'show');

        minireel.on('init', () => process.nextTick(done));

        TableOfContentsViewCtrl = new TableOfContentsViewController(minireel);
    });

    it('should be a ViewController', function() {
        expect(TableOfContentsViewCtrl).toEqual(jasmine.any(ViewController));
    });

    it('should not update its view', function() {
        expect(TableOfContentsViewCtrl.view.update).not.toHaveBeenCalled();
    });

    describe('when the minireel is launched', function() {
        beforeEach(function() {
            minireel.moveToIndex(0);
        });

        it('should update its view', function() {
            expect(TableOfContentsViewCtrl.view.update).toHaveBeenCalledWith({
                title: minireel.title,
                cards: minireel.deck.map(card => ({
                    id: card.id,
                    title: card.title,
                    source: card.data.source,
                    href: card.data.href,
                    thumb: card.thumbs.small,
                    showSource: !card.data.hideSource && !!card.data.source,
                    sponsor: card.sponsor,
                    website: (card.links || {}).Website,
                    type: card.ad ? 'ad' : 'content'
                }))
            });
        });
    });

    it('should hide its view', function() {
        expect(TableOfContentsViewCtrl.view.hide).toHaveBeenCalled();
    });

    describe('properties:', function() {
        describe('view', function() {
            it('should be a TableOfContentsView', function() {
                expect(TableOfContentsViewCtrl.view).toEqual(jasmine.any(TableOfContentsView));
            });

            describe('events:', function() {
                describe('selectCard', function() {
                    beforeEach(function() {
                        spyOn(minireel, 'moveTo');
                        spyOn(TableOfContentsViewCtrl, 'hide');

                        TableOfContentsViewCtrl.view.emit('selectCard', minireel.deck[2].id);
                    });

                    it('should moveTo the selected card', function() {
                        expect(minireel.moveTo).toHaveBeenCalledWith(minireel.deck[2]);
                    });

                    it('should hide itself', function() {
                        expect(TableOfContentsViewCtrl.hide).toHaveBeenCalled();
                    });
                });
            });
        });
    });

    describe('methods:', function() {
        describe('show()', function() {
            let spy;

            beforeEach(function() {
                spy = jasmine.createSpy('spy()');
                TableOfContentsViewCtrl.on('show', spy);

                TableOfContentsViewCtrl.show();
            });

            it('should show its view', function() {
                expect(TableOfContentsViewCtrl.view.show).toHaveBeenCalled();
            });

            it('should emit the "show" event', function() {
                expect(spy).toHaveBeenCalled();
            });
        });

        describe('hide()', function() {
            let spy;

            beforeEach(function() {
                spy = jasmine.createSpy('spy()');
                TableOfContentsViewCtrl.on('hide', spy);

                TableOfContentsViewCtrl.hide();
            });

            it('should hide its view', function() {
                expect(TableOfContentsViewCtrl.view.hide).toHaveBeenCalled();
            });

            it('should emit the "hide" event', function() {
                expect(spy).toHaveBeenCalled();
            });
        });

        describe('toggle()', function() {
            beforeEach(function() {
                spyOn(TableOfContentsViewCtrl, 'show').and.callThrough();
                spyOn(TableOfContentsViewCtrl, 'hide').and.callThrough();
            });

            describe('if called when the view is hidden', function() {
                beforeEach(function() {
                    TableOfContentsViewCtrl.toggle();
                });

                it('should show the view', function() {
                    expect(TableOfContentsViewCtrl.show).toHaveBeenCalled();
                });
            });

            describe('if called when the view is shown', function() {
                beforeEach(function() {
                    TableOfContentsViewCtrl.show();
                    TableOfContentsViewCtrl.toggle();
                });

                it('should hide the view', function() {
                    expect(TableOfContentsViewCtrl.hide).toHaveBeenCalled();
                });
            });
        });
    });
});
