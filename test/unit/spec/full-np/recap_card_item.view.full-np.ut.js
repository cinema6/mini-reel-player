import FullNPRecapCardItemView from '../../../../src/views/full-np/FullNPRecapCardItemView.js';
import RecapCardItemView from '../../../../src/views/RecapCardItemView.js';
import LinksListView from '../../../../src/views/LinksListView.js';
import Runner from '../../../../lib/Runner.js';

describe('FullNPRecapCardItemView', function() {
    let view;

    beforeEach(function() {
        view = new FullNPRecapCardItemView();
    });

    it('should exist', function() {
        expect(view).toEqual(jasmine.any(RecapCardItemView));
    });

    describe('properties:', function() {
        describe('template', function() {
            it('should be the contents of FullNPRecapCardItemView.html', function() {
                expect(view.template).toEqual(require('../../../../src/views/full-np/FullNPRecapCardItemView.html'));
            });
        });

        describe('classes', function() {
            it('should be the usual RecapCardItemView classes + [recap__item, clearfix]', function() {
                expect(view.classes).toEqual(new RecapCardItemView().classes.concat(['recap__item', 'clearfix']));
            });
        });

        describe('child views:', function() {
            beforeEach(function() {
                Runner.run(() => view.create());
            });

            describe('links', function() {
                it('should be a LinksListView', function() {
                    expect(view.links).toEqual(jasmine.any(LinksListView));
                });
            });
        });
    });

    describe('methods:', function() {
        describe('update(data)', function() {
            let data;

            beforeEach(function() {
                Runner.run(() => view.create());
                data = {
                    title: 'hello',
                    note: 'sup?',
                    type: 'my-type',
                    links: [{ type: 'youtube' }, { type: 'facebook' }]
                };
                spyOn(RecapCardItemView.prototype, 'update');
                spyOn(view, 'addClass');
                spyOn(view.links, 'update');

                view.update(data);
            });

            it('should call super()', function() {
                expect(RecapCardItemView.prototype.update).toHaveBeenCalledWith(data);
            });

            it('should add the class "recap__item--${type}"', function() {
                expect(view.addClass).toHaveBeenCalledWith(`recap__item--${data.type}`);
            });
        });
    });
});
