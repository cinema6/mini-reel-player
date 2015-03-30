import NavbarView from '../../../../src/views/mobile/NavbarView.js';
import View from '../../../../lib/core/View.js';
import Hideable from '../../../../src/mixins/Hideable.js';

describe('NavbarView', function() {
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

    describe('properties:', function() {
        describe('id', function() {
            it('should be navbar', function() {
                expect(navbarView.id).toBe('navbar');
            });
        });
    });
});
