describe('VideoCardView', function() {
    import CardView from '../../../src/views/CardView.js';
    import VideoCardView from '../../../src/views/VideoCardView.js';
    import View from '../../../lib/core/View.js';
    let videoCardView;

    beforeEach(function() {
        videoCardView = new VideoCardView();
    });

    it('should be a CardView', function() {
        expect(videoCardView).toEqual(jasmine.any(CardView));
    });

    describe('properties:', function() {
        describe('template', function() {
            it('should be a VideoCardView.html', function() {
                expect(videoCardView.template).toBe(require('../../../src/views/VideoCardView.html'));
            });
        });

        describe('playerOutlet', function() {
            beforeEach(function() {
                videoCardView.create();
            });

            it('should be a View', function() {
                expect(videoCardView.playerOutlet).toEqual(jasmine.any(View));
            });
        });
    });
});
