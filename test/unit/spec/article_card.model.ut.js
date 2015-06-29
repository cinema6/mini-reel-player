import ArticleCard from '../../../src/models/ArticleCard.js';
import Card from '../../../src/models/Card.js';

describe('ImageCard', function() {
    let articleCard;
    let experience, data;

    beforeEach(function() {
        experience = {
            data: {
                collateral: {
                    splash: '/collateral/experiences/e-42108b552a05ea/splash'
                }
            }
        };

        data = {
            /* jshint quotmark:double */
              "data": {
                  "src": "http://www.cinema6.com",
                  "thumbs": {
                      "small": "https://farm8.staticflickr.com/7646/16767833635_9459b8ee35_t.jpg",
                      "large": "https://farm8.staticflickr.com/7646/16767833635_9459b8ee35_m.jpg"
                  }
              },
              "id": "rc-cac446a3593e92",
              "type": "article",
              "title": "Article Card",
              "note": "This is an article card!",
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
            /* jshint quotmark:single */
        };

        articleCard = new ArticleCard(data, experience);
    });

    it('should be a Card', function() {
        expect(articleCard).toEqual(jasmine.any(Card));
    });

    describe('properties:', function() {
        describe('type', function() {
            it('should be "article"', function() {
                expect(articleCard.type).toBe('article');
            });
        });

        describe('thumbs', function() {
            it('should be copied from the passed-in value', function() {
                expect(articleCard.thumbs).toEqual({
                    small: data.data.thumbs.small,
                    large: data.data.thumbs.large
                });
            });
        });

        describe('data', function() {
            it('should be copied from the passed-in value', function() {
                expect(articleCard.data).toEqual({
                    'src': 'http://www.cinema6.com'
                });
            });
        });

    });

    describe('methods:', function() {
        describe('complete()', function() {
            let canAdvance;

            beforeEach(function() {
                canAdvance = jasmine.createSpy('canAdvance()');
                articleCard.on('canAdvance', canAdvance);
                spyOn(Card.prototype, 'complete');

                articleCard.complete();
            });

            it('should call super()', function() {
                expect(Card.prototype.complete).toHaveBeenCalled();
            });

            it('should emit "canAdvance"', function() {
                expect(canAdvance).toHaveBeenCalled();
            });
        });
    });
});
