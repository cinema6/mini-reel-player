import LightboxNavButtonView from '../../../src/views/LightboxNavButtonView.js';
import ButtonView from '../../../src/views/ButtonView.js';
import Hideable from '../../../src/mixins/Hideable.js';

describe('LightboxNavButtonView', function() {
    let view;

    beforeEach(function() {
        view = new LightboxNavButtonView();
    });

    it('should exist', function() {
        expect(view).toEqual(jasmine.any(ButtonView));
    });

    it('should be Hideable', function() {
        expect(LightboxNavButtonView.mixins).toContain(Hideable);
    });
});
