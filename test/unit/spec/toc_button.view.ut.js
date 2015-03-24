import TOCButtonView from '../../../src/views/TOCButtonView.js';
import ButtonView from '../../../src/views/ButtonView.js';
import Hideable from '../../../src/mixins/Hideable.js';

describe('TOCButtonView', function() {
    let view;

    beforeEach(function() {
        view = new TOCButtonView();
    });

    it('should be a ButtonView', function() {
        expect(view).toEqual(jasmine.any(ButtonView));
    });

    it('should be Hideable', function() {
        expect(TOCButtonView.mixins).toContain(Hideable);
    });
});
