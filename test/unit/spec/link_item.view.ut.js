import LinkItemView from '../../../src/views/LinkItemView.js';
import TemplateView from '../../../lib/core/TemplateView.js';
import ContextualView from '../../../src/mixins/ContextualView.js';

describe('LinkItemView', function() {
    let view;

    beforeEach(function() {
        view = new LinkItemView();
    });

    it('should be a TemplateView', function() {
        expect(view).toEqual(jasmine.any(TemplateView));
    });

    it('should mixin the ContextualView', function() {
        expect(LinkItemView.mixins).toContain(ContextualView, 'ContextualView not mixed in.');
    });

    describe('handlers:', function() {
        describe('click()', function() {
            beforeEach(function() {
                spyOn(view, 'sendAction');

                view.click();
            });

            it('should send an action', function() {
                expect(view.sendAction).toHaveBeenCalledWith(view);
            });
        });
    });
});
