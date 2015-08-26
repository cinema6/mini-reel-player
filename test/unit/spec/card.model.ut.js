import DisplayAd from '../../../src/models/DisplayAd.js';
import Post from '../../../src/models/Post.js';
import Ballot from '../../../src/models/Ballot.js';
import election from '../../../src/services/election.js';
import Mixable from '../../../lib/core/Mixable.js';

describe('Card', function() {
    import Card from '../../../src/models/Card.js';
    import {EventEmitter} from 'events';
    let card;
    let data;
    let experience;

    beforeEach(function() {
        /* jshint quotmark:double */
        data = {
            "data": {
              "controls": true,
              "skip": true,
              "modestbranding": 0,
              "rel": 0,
              "videoid": "B5FcZrg_Nuo"
            },
            "id": "rc-68e8e50d9ffcfe",
            "type": "youtube",
            "title": "15. Tabloid",
            "note": "Errol Morris is the world’s greatest documentarian, and here he sinks his teeth into an irresistible tale of sex, kidnapping, and… Mormons. The story of the beautiful Joyce McKinney who kidnapped and allegedly raped a Mormon missionary is sensational enough. But the real scandal lies in the British tabloid wars between The Daily Mirror and The Daily Express which in a mad rush for readers stopped at nothing to unearth shady details about McKinney’s past and present. Anybody who believes journalism has fallen into the gutter thanks to the Internet should take note that this took place in 1977, when the Web was just a twinkle in Al Gore’s eye.",
            "source": "YouTube",
            "modules": [],
            "placementId": null,
            "templateUrl": null,
            "thumbs": {
                "small": "https://i.ytimg.com/vi/B5FcZrg_Nuo/default.jpg",
                "large": "https://i.ytimg.com/vi/B5FcZrg_Nuo/maxresdefault.jpg"
            },
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

        experience = {
            data: {}
        };

        card = new Card(data, experience);
    });

    it('should be mixable', function() {
        expect(card).toEqual(jasmine.any(Mixable));
    });

    it('should mixin the EventEmitter', function() {
        expect(Card.mixins).toContain(EventEmitter);
    });

    describe('properties:', function() {
        describe('id', function() {
            it('should be the id', function() {
                expect(card.id).toBe(data.id);
            });
        });

        describe('title', function() {
            it('should be the title', function() {
                expect(card.title).toBe(data.title);
            });
        });

        describe('note', function() {
            it('should be the note', function() {
                expect(card.note).toBe(data.note);
            });

            describe('if there is no note', function() {
                beforeEach(function() {
                    delete data.note;
                    card = new Card(data, experience);
                });

                it('should be null', function() {
                    expect(card.note).toBeNull();
                });
            });
        });

        describe('thumbs', function() {
            it('should be a copy of the thumbs', function() {
                expect(card.thumbs).toEqual(data.thumbs);
                expect(card.thumbs).not.toBe(data.thumbs);
            });

            describe('if there are no thumbs', function() {
                beforeEach(function() {
                    delete data.thumbs;
                    card = new Card(data, experience);
                });

                it('should be null', function() {
                    expect(card.thumbs).toBeNull();
                });
            });
        });

        describe('data', function() {
            it('should be an empty object', function() {
                expect(card.data).toEqual({});
            });
        });

        describe('active', function() {
            it('should be false', function() {
                expect(card.active).toBe(false);
            });
        });

        describe('modules', function() {
            it('should be an empty object', function() {
                expect(card.modules).toEqual({});
            });

            describe('if the displayAd module is present', function() {
                beforeEach(function() {
                    data.modules = ['displayAd', 'someFakeModule'];

                    card = new Card(data, experience);
                });

                it('should add the DisplayAd module', function() {
                    expect(card.modules).toEqual({
                        displayAd: jasmine.any(DisplayAd)
                    });
                });
            });

            describe('if the post module is present', function() {
                beforeEach(function() {
                    data.modules = ['anotherFakeThing', 'post'];

                    card = new Card(data, experience);
                });

                it('should add the Post module', function() {
                    expect(card.modules).toEqual({
                        post: jasmine.any(Post)
                    });
                });
            });

            describe('if the ballot module is present', function() {
                beforeEach(function() {
                    data.modules = ['whaddup', 'ballot'];
                    data.ballot = { choices: [] };
                    spyOn(election, 'getResults').and.returnValue(new Promise(() => {}));

                    card = new Card(data, experience);
                });

                it('should add the Ballot module', function() {
                    expect(card.modules).toEqual({
                        ballot: jasmine.any(Ballot)
                    });
                });
            });
        });
    });

    describe('methods', function() {
        describe('activate()', function() {
            let spy;

            beforeEach(function() {
                spy = jasmine.createSpy('spy()');
                card.on('activate', spy);
                card.active = false;

                card.activate();
            });

            it('should set active to true', function() {
                expect(card.active).toBe(true);
            });

            it('should emit the "activate" event', function() {
                expect(spy).toHaveBeenCalled();
            });

            describe('if called again', function() {
                beforeEach(function() {
                    card.activate();
                });

                it('should not emit the event again', function() {
                    expect(spy.calls.count()).toBe(1);
                });
            });
        });

        describe('deactivate()', function() {
            let spy;

            beforeEach(function() {
                spy = jasmine.createSpy('spy()');
                card.on('deactivate', spy);
                card.active = true;

                card.deactivate();
            });

            it('should set active to false', function() {
                expect(card.active).toBe(false);
            });

            it('should emit the "deactivate" event', function() {
                expect(spy).toHaveBeenCalled();
            });

            describe('if called again', function() {
                beforeEach(function() {
                    card.deactivate();
                });

                it('should not emit the event again', function() {
                    expect(spy.calls.count()).toBe(1);
                });
            });
        });

        describe('prepare()', function() {
            let spy;

            beforeEach(function() {
                spy = jasmine.createSpy('spy()');
                card.on('prepare', spy);

                card.prepare();
            });

            it('should emit the "prepare" event', function() {
                expect(spy).toHaveBeenCalled();
            });
        });

        describe('complete()', function() {
            let spy;

            beforeEach(function() {
                spy = jasmine.createSpy('spy()');
                card.on('complete', spy);

                card.complete();
            });

            it('should emit the "complete" event', function() {
                expect(spy).toHaveBeenCalled();
            });
        });

        describe('reset()', function() {
            beforeEach(function() {
                card.reset();
            });

            it('should do nothing', function() {});
        });

        describe('abort()', function() {
            beforeEach(function() {
                card.abort();
            });

            it('should do nothing', function() {});
        });

        describe('cleanup()', function() {
            let cleanup;

            beforeEach(function() {
                cleanup = jasmine.createSpy('cleanup()');
                card.on('cleanup', cleanup);
                spyOn(card, 'reset');

                card.cleanup();
            });

            it('should call reset()', function() {
                expect(card.reset).toHaveBeenCalled();
            });

            it('should emit "cleanup"', function() {
                expect(cleanup).toHaveBeenCalled();
            });
        });
    });
});
