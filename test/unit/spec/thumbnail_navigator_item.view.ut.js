import ThumbnailNavigatorItemView from '../../../src/views/ThumbnailNavigatorItemView.js';
import TemplateView from '../../../lib/core/TemplateView.js';
import Runner from '../../../lib/Runner.js';
import ThumbnailNavigatorButtonView from '../../../src/views/ThumbnailNavigatorButtonView.js';

describe('ThumbnailNavigatorItemView', function() {
    let view;

    beforeEach(function() {
        view = new ThumbnailNavigatorItemView();
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

        describe('classes', function() {
            it('should be the usual TemplateView classes + "pages__item"', function() {
                expect(view.classes).toEqual(new TemplateView().classes.concat(['pages__item']));
            });
        });

        describe('template', function() {
            it('should be the contents of ThumbnailNavigatorItemView.html', function() {
                expect(view.template).toBe(require('../../../src/views/ThumbnailNavigatorItemView.html'));
            });
        });

        describe('child views:', function() {
            beforeEach(function() {
                Runner.run(() => view.create());
            });

            describe('button', function() {
                it('should be a ThumbnailNavigatorButtonView', function() {
                    expect(view.button).toEqual(jasmine.any(ThumbnailNavigatorButtonView));
                });
            });
        });
    });

    describe('methods:', function() {
        describe('update(data)', function() {
            let data;

            beforeEach(function() {
                data = { id: 'rc-82386r845', title: 'Hello!' };
                Runner.run(() => view.create());
                spyOn(view.button, 'update');

                Runner.run(() => view.update(data));
            });

            it('should update its button', function() {
                expect(view.button.update).toHaveBeenCalledWith(data);
            });

            describe('if the button does not exist', function() {
                beforeEach(function() {
                    view = new ThumbnailNavigatorItemView();
                    spyOn(view, 'create').and.callThrough();

                    Runner.run(() => view.update(data));
                });

                it('should create itself', function() {
                    expect(view.create).toHaveBeenCalled();
                });
            });

            describe('if the button does exist', function() {
                beforeEach(function() {
                    view = new ThumbnailNavigatorItemView();
                    Runner.run(() => view.create());
                    spyOn(view, 'create').and.callThrough();

                    Runner.run(() => view.update(data));
                });

                it('should not create itself', function() {
                    expect(view.create).not.toHaveBeenCalled();
                });
            });
        });
    });
});
