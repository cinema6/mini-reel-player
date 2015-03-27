import NavButtonView from '../../../../src/views/mobile/NavButtonView.js';
import ButtonView from '../../../../src/views/ButtonView.js';
import Hideable from '../../../../src/mixins/Hideable.js';
import NavButtonPreviewView from '../../../../src/views/mobile/NavButtonPreviewView.js';
import Runner from '../../../../lib/Runner.js';

describe('NavButtonView', function() {
    let navButtonView;

    beforeEach(function() {
        navButtonView = new NavButtonView();
    });

    it('should be a ButtonView', function() {
        expect(navButtonView).toEqual(jasmine.any(ButtonView));
    });

    it('should be hideable', function() {
        expect(NavButtonView.mixins).toContain(Hideable);
    });

    describe('properties:', function() {
        describe('preview', function() {
            it('should be null', function() {
                expect(navButtonView.preview).toBeNull();
            });
        });
    });

    describe('methods:', function() {
        describe('setThumb(url)', function() {
            beforeEach(function() {
                spyOn(NavButtonPreviewView.prototype, 'setThumb');
                Runner.run(() => navButtonView.setThumb('my-image.jpg'));
            });

            it('should set the preview\'s background image', function() {
                expect(navButtonView.preview.setThumb).toHaveBeenCalledWith('my-image.jpg');
            });
        });
    });

    describe('hooks:', function() {
        describe('didCreateElement()', function() {
            beforeEach(function() {
                spyOn(navButtonView, 'append');
                Runner.run(() => navButtonView.create());
            });

            it('should make preview an actual view', function() {
                expect(navButtonView.preview).toEqual(jasmine.any(NavButtonPreviewView));
            });

            it('should append the preview to itself', function() {
                expect(navButtonView.append).toHaveBeenCalledWith(navButtonView.preview);
            });
        });
    });
});
