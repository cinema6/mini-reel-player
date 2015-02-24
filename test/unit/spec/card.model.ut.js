describe('Card', function() {
    import Card from '../../../src/models/Card.js';
    import {EventEmitter} from 'events';
    let card;

    /* jshint quotmark:double */
    const data = {
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

    beforeEach(function() {
        card = new Card(data);
    });

    it('should be an event emitter', function() {
        expect(card).toEqual(jasmine.any(EventEmitter));
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
        });

        describe('thumbs', function() {
            it('should be a copy of the thumbs', function() {
                expect(card.thumbs).toEqual(data.thumbs);
                expect(card.thumbs).not.toBe(data.thumbs);
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
    });
});
