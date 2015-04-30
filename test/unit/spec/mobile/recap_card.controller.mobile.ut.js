import MobileRecapCardController from '../../../../src/controllers/mobile/MobileRecapCardController.js';
import MiniReel from '../../../../src/models/MiniReel.js';
import VideoCard from '../../../../src/models/VideoCard.js';
import RecapCard from '../../../../src/models/RecapCard.js';
import View from '../../../../lib/core/View.js';
import RecapCardController from '../../../../src/controllers/RecapCardController.js';
import MobileRecapCardView from '../../../../src/views/mobile/MobileRecapCardView.js';

describe('MobileRecapCardController', function() {
   let MobileRecapCardCtrl;

    let card, minireel;

    const experience = {
        data: {}
    };

    const profile = { flash: false };

    beforeEach(function() {
        minireel = new MiniReel();
        minireel.deck = [
            new VideoCard({
                id: 'rc-720427f954b8a6',
                title: 'Card 1',
                source: 'YouTube',
                thumbs: {
                    small: 'yt-thumb.jpg'
                },
                params: {
                    sponsor: 'Netflix',
                    ad: true
                },
                links: {
                    Website: 'http://www.netflix.com'
                },
                collateral: {},
                data: {
                    hideSource: true,
                    href: 'https://www.youtube.com/watch?v=3XxB6ma7qu8'
                }
            }, experience),
            new VideoCard({
                id: 'rc-241b9cc66bcf19',
                title: 'Card 2',
                source: 'Vimeo',
                thumbs: {
                    small: 'vimeo-thumb.jpg'
                },
                params: {},
                collateral: {},
                data: {
                    href: 'https://www.youtube.com/watch?v=mmEJQfm8H0k'
                }
            }, experience),
            new VideoCard({
                id: 'rc-ce2efbc9230739',
                title: 'Card 3',
                source: 'Dailymotion',
                thumbs: {
                    small: 'dailymotion-thumb.jpg'
                },
                params: {},
                collateral: {},
                data: {
                    href: 'https://www.youtube.com/watch?v=LZL9JfoqaHQ'
                }
            }, experience),
            new VideoCard({
                id: 'rc-9adf2905169f34',
                title: 'Card 4',
                thumbs: {
                    small: 'dailymotion-thumb.jpg'
                },
                params: {},
                collateral: {},
                data: {
                    href: 'https://www.youtube.com/watch?v=LZL9JfoqaHQ'
                }
            }, experience)
        ];
        card = new RecapCard({}, experience, profile, minireel);
        minireel.deck.push(card);

        spyOn(MobileRecapCardController.prototype, 'addListeners');

        MobileRecapCardCtrl = new MobileRecapCardController(card, new View(document.createElement('ul')));
    });

    it('should be a RecapCardController', function() {
        expect(MobileRecapCardCtrl).toEqual(jasmine.any(RecapCardController));
    });

    it('should add its listeners', function() {
        expect(MobileRecapCardController.prototype.addListeners).toHaveBeenCalled();
    });

    describe('properties:', function() {
        describe('view', function() {
            it('should be a RecapCardView', function() {
                expect(MobileRecapCardCtrl.view).toEqual(jasmine.any(MobileRecapCardView));
            });
        });
    });
});
