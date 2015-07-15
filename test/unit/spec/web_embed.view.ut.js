import WebEmbedView from '../../../src/views/image_embeds/WebEmbedView.js';
import TemplateView from '../../../lib/core/TemplateView.js';

describe('WebEmbedView', function() {
    let view;

    beforeEach(function() {
        view = new WebEmbedView();
    });

    it('should be a TemplateView', function() {
        expect(view).toEqual(jasmine.any(TemplateView));
    });

    describe('properties:', function() {
        describe('template', function() {
            it('should be the contents of WebEmbedView.html', function() {
                expect(view.template).toBe(require('../../../src/views/image_embeds/WebEmbedView.html'));
            });
        });
    });

});
