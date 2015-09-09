import AnchorView from '../../../src/views/AnchorView.js';
import ButtonView from '../../../src/views/ButtonView.js';

describe('ButtonView', function() {
    let anchorView;

    beforeEach(function() {
        anchorView = new AnchorView();
    });

    it('should exist', function() {
        expect(anchorView).toEqual(jasmine.any(ButtonView));
    });

    describe('properties', function() {
        describe('tag', function() {
            it('should be an anchor tag', function() {
                expect(anchorView.tag).toBe('a');
            });
        });
    });
});
