import PlaylistCardView from '../../../src/views/PlaylistCardView.js';
import TemplateView from '../../../lib/core/TemplateView.js';

describe('PlaylistCardView', function() {
    let view;

    beforeEach(function() {
        view = new PlaylistCardView();
    });

    it('should exist', function() {
        expect(view).toEqual(jasmine.any(TemplateView));
    });

    describe('properties:', function() {
        describe('tag', function() {
            it('should be "li"', function() {
                expect(view.tag).toBe('li');
            });
        });

        describe('template', function() {
            it('should be the contents of PlaylistCardView.html', function() {
                expect(view.template).toBe(require('../../../src/views/PlaylistCardView.html'));
            });
        });

        describe('classes', function() {
            it('should be the normal TemplateView classes plus [playlist__item, clearfix]', function() {
                expect(view.classes).toEqual(new TemplateView().classes.concat(['playlist__item', 'clearfix']));
            });
        });
    });

    describe('methods:', function() {
        describe('update(data)', function() {
            let data;

            beforeEach(function() {
                data = { title: 'Hey!', active: false };
                spyOn(TemplateView.prototype, 'update');
                spyOn(view, 'addClass');
                spyOn(view, 'removeClass');

                view.update(data);
            });

            it('should call super()', function() {
                expect(TemplateView.prototype.update).toHaveBeenCalledWith(data);
            });

            describe('if active is true', function() {
                beforeEach(function() {
                    view.addClass.calls.reset();
                    view.removeClass.calls.reset();

                    data.active = true;
                    view.update(data);
                });

                it('should add the "playlist__item--current" class', function() {
                    expect(view.addClass).toHaveBeenCalledWith('playlist__item--current');
                    expect(view.removeClass).not.toHaveBeenCalled();
                });
            });

            describe('if active is false', function() {
                beforeEach(function() {
                    view.addClass.calls.reset();
                    view.removeClass.calls.reset();

                    data.active = false;
                    view.update(data);
                });

                it('should remove the "playlist__item--current" class', function() {
                    expect(view.removeClass).toHaveBeenCalledWith('playlist__item--current');
                    expect(view.addClass).not.toHaveBeenCalled();
                });
            });
        });
    });

    describe('event handlers:', function() {
        describe('click()', function() {
            let select;

            beforeEach(function() {
                select = jasmine.createSpy('select()');
                view.on('select', select);

                view.click();
            });

            it('should emit the "select" event', function() {
                expect(select).toHaveBeenCalled();
            });
        });
    });
});
