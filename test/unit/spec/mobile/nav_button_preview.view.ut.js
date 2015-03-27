import NavButtonPreviewView from '../../../../src/views/mobile/NavButtonPreviewView.js';
import View from '../../../../lib/core/View.js';
import Runner from '../../../../lib/Runner.js';

describe('NavButtonPreviewView', function() {
    let navButtonPreviewView;

    beforeEach(function() {
        navButtonPreviewView = new NavButtonPreviewView();
    });

    it('should be a view', function() {
        expect(navButtonPreviewView).toEqual(jasmine.any(View));
    });

    describe('properties:', function() {
        describe('tag', function() {
            it('should be span', function() {
                expect(navButtonPreviewView.tag).toBe('span');
            });
        });

        describe('classes', function() {
            it('should be the default view classes plus "pager__previewImg"', function() {
                expect(navButtonPreviewView.classes).toEqual((new View()).classes.concat(['pager__previewImg']));
            });
        });
    });

    describe('methods:', function() {
        describe('setThumb(url)', function() {
            beforeEach(function() {
                Runner.run(() => navButtonPreviewView.setThumb('foo.jpg'));
            });

            it('should set the element\'s background image', function() {
                expect(navButtonPreviewView.element.style.backgroundImage).toBe(`url(${window.location.origin}/foo.jpg)`);
            });

            describe('if set to something falsy', function() {
                beforeEach(function() {
                    Runner.run(() => navButtonPreviewView.setThumb(null));
                });

                it('should set the backgroundImage to ""', function() {
                    expect(navButtonPreviewView.element.style.backgroundImage).toBe('');
                });
            });
        });
    });
});
