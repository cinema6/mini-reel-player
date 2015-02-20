describe('VideoCardController', function() {
    import VideoCardController from '../../../src/controllers/VideoCardController.js';
    import CardController from '../../../src/controllers/CardController.js';
    import VideoCard from '../../../src/models/VideoCard.js';
    import VideoCardView from '../../../src/views/VideoCardView.js';
    import Runner from '../../../lib/Runner.js';
    import View from '../../../lib/core/View.js';
    let VideoCardCtrl;
    let card;
    let parentView;

    beforeEach(function() {
        parentView = new View();
        parentView.tag = 'div';

        card = new VideoCard({
            title: 'Hello',
            note: 'Sup?',
            type: 'youtube',
            source: 'YouTube',
            data: {
                href: 'https://www.youtube.com/watch?v=B5FcZrg_Nuo'
            }
        });

        VideoCardCtrl = new VideoCardController(card, parentView);
    });

    it('should be a CardController', function() {
        expect(VideoCardCtrl).toEqual(jasmine.any(CardController));
    });

    describe('properties:', function() {
        describe('view', function() {
            it('should be a VideoCardView', function() {
                expect(VideoCardCtrl.view).toEqual(jasmine.any(VideoCardView));
            });
        });
    });

    describe('methods:', function() {
        describe('render()', function() {
            let result;

            beforeEach(function() {
                spyOn(CardController.prototype, 'render').and.callThrough();
                spyOn(VideoCardCtrl.view, 'update');
                Runner.run(() => result = VideoCardCtrl.render());
            });

            it('should call super()', function() {
                expect(CardController.prototype.render).toHaveBeenCalled();
            });

            it('should update the view with video data', function() {
                expect(VideoCardCtrl.view.update).toHaveBeenCalledWith({
                    source: card.data.source,
                    href: card.data.href
                });
            });
        });
    });
});
