describe('TableOfContentsCardView', function() {
    import TableOfContentsCardView from '../../../src/views/TableOfContentsCardView.js';
    import TemplateView from '../../../lib/core/TemplateView.js';
    let tableOfContentsCardView;

    beforeEach(function() {
        tableOfContentsCardView = new TableOfContentsCardView();
    });

    it('should be a TemplateView', function() {
        expect(tableOfContentsCardView).toEqual(jasmine.any(TemplateView));
    });

    describe('properties:', function() {
        describe('tag', function() {
            it('should be "li"', function() {
                expect(tableOfContentsCardView.tag).toBe('li');
            });
        });

        describe('classes', function() {
            it('should be the default classes plus toc__item, c6-show and clearfix', function() {
                expect(tableOfContentsCardView.classes).toEqual((new TemplateView()).classes.concat(['toc__item', 'c6-show', 'clearfix']));
            });
        });

        describe('template', function() {
            it('should be the TableOfContentsCardView.html template', function() {
                expect(tableOfContentsCardView.template).toBe(require('../../../src/views/TableOfContentsCardView.html'));
            });
        });
    });

    describe('events:', function() {
        describe('click()', function() {
            let spy;

            beforeEach(function() {
                spy = jasmine.createSpy('spy()');
                tableOfContentsCardView.on('select', spy);

                tableOfContentsCardView.click();
            });

            it('should emit the "select" event', function() {
                expect(spy).toHaveBeenCalled();
            });
        });
    });
});
