import InfoPanelView from '../../../../src/views/swipe/InfoPanelView.js';
import TemplateView from '../../../../lib/core/TemplateView.js';
import LinksListView from '../../../../src/views/LinksListView.js';
import ButtonView from '../../../../src/views/ButtonView.js';
import Runner from '../../../../lib/Runner.js';

describe('InfoPanelView', function() {
    let view;

    beforeEach(function() {
        view = new InfoPanelView();
    });

    it('should exist', function() {
        expect(view).toEqual(jasmine.any(TemplateView));
    });

    describe('properties:', function() {
        describe('tag', function() {
            it('should be "div"', function() {
                expect(view.tag).toBe('div');
            });
        });

        describe('classes', function() {
            it('should be the usual TemplateView classes + "infoPanel__group"', function() {
                expect(view.classes).toEqual(new TemplateView().classes.concat(['infoPanel__group']));
            });
        });

        describe('template', function() {
            it('should be the contents of InfoPanelView.html', function() {
                expect(view.template).toBe(require('../../../../src/views/swipe/InfoPanelView.html'));
            });
        });

        describe('child views:', function() {
            beforeEach(function() {
                Runner.run(() => view.create());
            });

            describe('closeButton', function() {
                it('should be a ButtonView', function() {
                    expect(view.closeButton).toEqual(jasmine.any(ButtonView));
                });
            });

            describe('backButton', function() {
                it('should be a ButtonView', function() {
                    expect(view.backButton).toEqual(jasmine.any(ButtonView));
                });
            });

            describe('links', function() {
                it('should be a LinksListView', function() {
                    expect(view.links).toEqual(jasmine.any(LinksListView));
                });
            });
        });
    });

    describe('methods:', function() {
        describe('show(yes)', function() {
            beforeEach(function() {
                spyOn(view, 'addClass');
                spyOn(view, 'removeClass');
            });

            describe('if called with true', function() {
                beforeEach(function() {
                    view.show(true);
                });

                it('should add the "infoPanel__group--show" class', function() {
                    expect(view.addClass).toHaveBeenCalledWith('infoPanel__group--show');
                    expect(view.removeClass).not.toHaveBeenCalled();
                });
            });

            describe('if called with false', function() {
                beforeEach(function() {
                    view.show(false);
                });

                it('should remove the "infoPanel__group--show" class', function() {
                    expect(view.removeClass).toHaveBeenCalledWith('infoPanel__group--show');
                    expect(view.addClass).not.toHaveBeenCalled();
                });
            });
        });
    });
});
