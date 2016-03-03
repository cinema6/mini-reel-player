import PlayButtonView from '../../../src/views/PlayButtonView.js';
import ButtonView from '../../../src/views/ButtonView.js';
import Hideable from '../../../src/mixins/Hideable.js';

describe('PlayButtonView', function() {
    let view;

    beforeEach(function() {
        view = new PlayButtonView();
    });

    it('should be a ButtonView', function() {
        expect(view).toEqual(jasmine.any(ButtonView));
    });

    it('should be Hideable', function() {
        expect(PlayButtonView.mixins).toContain(Hideable, 'PlayButtonView is not Hideable');
    });

    describe('properties:', function() {
        describe('classes', function() {
            it('should contain "player__playBtn"', function() {
                expect(view.classes).toEqual(new ButtonView().classes.concat(['player__playBtn']));
            });
        });

        describe('template', function() {
            it('should be the contents of PlayButtonView.html', function() {
                expect(view.template).toBe(require('../../../src/views/PlayButtonView.html'));
            });
        });
    });
});
