import GettyEmbedView from '../../../src/views/image_embeds/GettyEmbedView.js';
import TemplateView from '../../../lib/core/TemplateView.js';

describe('GettyEmbedView', function() {
    let view;

    beforeEach(function() {
        view = new GettyEmbedView();
    });

    it('should be a TemplateView', function() {
        expect(view).toEqual(jasmine.any(TemplateView));
    });

    describe('properties:', function() {
        describe('template', function() {
            it('should be the contents of GettyEmbedView.html', function() {
                expect(view.template).toBe(require('../../../src/views/image_embeds/GettyEmbedView.html'));
            });
        });
    });

});
