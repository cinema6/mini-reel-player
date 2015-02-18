describe('NavbarView', function() {
    import View from '../../../lib/core/View.js';
    import Hideable from '../../../src/mixins/Hideable.js';
    import NavbarView from '../../../src/views/NavbarView.js';
    let navbarView;

    beforeEach(function() {
        navbarView = new NavbarView();
    });

    it('should be a view', function() {
        expect(navbarView).toEqual(jasmine.any(View));
    });

    it('should be hideable', function() {
        expect(NavbarView.mixins).toContain(Hideable);
    });
});
