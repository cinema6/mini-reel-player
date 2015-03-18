import HideableView from '../../../src/views/HideableView.js';
import View from '../../../lib/core/View.js';
import Hidable from '../../../src/mixins/Hideable.js';

describe('HideableView', function() {
    let view;

    beforeEach(function() {
        view = new HideableView();
    });

    it('should be a view', function() {
        expect(view).toEqual(jasmine.any(View));
    });

    it('should mixin Hidable', function() {
        expect(HideableView.mixins).toContain(Hidable);
    });
});
