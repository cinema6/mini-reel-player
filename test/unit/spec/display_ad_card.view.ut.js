import DisplayAdCardView from '../../../src/views/DisplayAdCardView.js';
import CardView from '../../../src/views/CardView.js';
import Runner from '../../../lib/Runner.js';
import LinksListView from '../../../src/views/LinksListView.js';
import View from '../../../lib/core/View.js';

describe('DisplayAdCardView', function() {
    let view;

    beforeEach(function() {
        view = new DisplayAdCardView();
    });

    it('should exist', function() {
        expect(view).toEqual(jasmine.any(CardView));
    });

    describe('properties:', function() {
        describe('template', function() {
            it('should be the contents of DisplayAdCardView.html', function() {
                expect(view.template).toBe(require('../../../src/views/DisplayAdCardView.html'));
            });
        });

        describe('child views:', function() {
            beforeEach(function() {
                Runner.run(() => view.create());
            });

            describe('displayAdOutlet', function() {
                it('should be a View', function() {
                    expect(view.displayAdOutlet).toEqual(jasmine.any(View));
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
        describe('update(data)', function() {
            beforeEach(function() {
                Runner.run(() => view.create());
                spyOn(view.links, 'update');
                spyOn(CardView.prototype, 'update').and.callThrough();
            });

            describe('when called with the first set of data', function() {
                let data;

                beforeEach(function() {
                    data = { title: 'My card', note: 'Hello world!' };

                    Runner.run(() => view.update(data));
                });

                it('should call super()', function() {
                    expect(CardView.prototype.update).toHaveBeenCalledWith(data);
                });

                it('should not update the links', function() {
                    expect(view.links.update).not.toHaveBeenCalled();
                });
            });

            describe('when links are provided', function() {
                let data;

                beforeEach(function() {
                    data = { sponsor: 'Netflix', links: [{}, {}, {}] };

                    Runner.run(() => view.update(data));
                });

                it('should call super()', function() {
                    expect(CardView.prototype.update).toHaveBeenCalledWith(data);
                });

                it('should update the links', function() {
                    expect(view.links.update).toHaveBeenCalledWith(data.links);
                });
            });
        });
    });
});
