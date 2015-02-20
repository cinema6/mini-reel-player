describe('CloseButtonView', function() {
    import ButtonView from '../../../src/views/ButtonView.js';
    import CloseButtonView from '../../../src/views/CloseButtonView.js';
    import Hideable from '../../../src/mixins/Hideable.js';
    let closeButtonView;

    beforeEach(function() {
        closeButtonView = new CloseButtonView();
    });

    it('should be a ButtonView', function() {
        expect(closeButtonView).toEqual(jasmine.any(ButtonView));
    });

    it('should be hideable', function() {
        expect(CloseButtonView.mixins).toContain(Hideable);
    });
});
