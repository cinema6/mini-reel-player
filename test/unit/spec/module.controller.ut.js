import ModuleController from '../../../src/controllers/ModuleController.js';
import ViewController from '../../../src/controllers/ViewController.js';
import View from '../../../lib/core/View.js';
import Hidable from '../../../src/mixins/Hideable.js';

class MockView extends View {}
MockView.mixin(Hidable);

describe('ModuleController', function() {
    let ModuleCtrl;
    let view;

    beforeEach(function() {
        view = new MockView();
        ModuleCtrl = new ModuleController();
        ModuleCtrl.view = view;
    });

    it('should be a ViewController', function() {
        expect(ModuleCtrl).toEqual(jasmine.any(ViewController));
    });

    describe('properties:', function() {
        describe('active', function() {
            it('should be false', function() {
                expect(ModuleCtrl.active).toBe(false);
            });
        });

        describe('model', function() {
            it('should be null', function() {
                expect(ModuleCtrl.model).toBeNull();
            });

            describe('if a model is passed in', function() {
                let model;

                beforeEach(function() {
                    model = {};
                    ModuleCtrl = new ModuleController(model);
                });

                it('should be the model', function() {
                    expect(ModuleCtrl.model).toBe(model);
                });
            });
        });
    });

    describe('methods:', function() {
        describe('activate()', function() {
            let spy;

            beforeEach(function() {
                spy = jasmine.createSpy('spy()');
                ModuleCtrl.on('activate', spy);
                spyOn(view, 'show');

                ModuleCtrl.activate();
            });

            it('should set active to true', function() {
                expect(ModuleCtrl.active).toBe(true);
            });

            it('should show its view', function() {
                expect(view.show).toHaveBeenCalled();
            });

            it('should emit the activate event', function() {
                expect(spy).toHaveBeenCalled();
            });

            describe('if called again', function() {
                beforeEach(function() {
                    spy.calls.reset();
                    view.show.calls.reset();

                    ModuleCtrl.activate();
                });

                it('should do nothing', function() {
                    expect(spy).not.toHaveBeenCalled();
                    expect(view.show).not.toHaveBeenCalled();
                });
            });
        });

        describe('deactivate()', function() {
            let spy;

            beforeEach(function() {
                spy = jasmine.createSpy('spy()');
                ModuleCtrl.on('deactivate', spy);
                spyOn(view, 'hide');
                ModuleCtrl.active = true;

                ModuleCtrl.deactivate();
            });

            it('should set active to false', function() {
                expect(ModuleCtrl.active).toBe(false);
            });

            it('should hide its view', function() {
                expect(view.hide).toHaveBeenCalled();
            });

            it('should emit the deactivate event', function() {
                expect(spy).toHaveBeenCalled();
            });

            describe('if called again', function() {
                beforeEach(function() {
                    spy.calls.reset();
                    view.hide.calls.reset();

                    ModuleCtrl.deactivate();
                });

                it('should do nothing', function() {
                    expect(spy).not.toHaveBeenCalled();
                    expect(view.hide).not.toHaveBeenCalled();
                });
            });
        });

        describe('renderInto()', function() {
            let parentView;

            beforeEach(function() {
                parentView = new View();
                spyOn(ViewController.prototype, 'renderInto');
                spyOn(view, 'hide');

                ModuleCtrl.renderInto(parentView);
            });

            it('should call super()', function() {
                expect(ViewController.prototype.renderInto).toHaveBeenCalledWith(parentView);
            });

            it('should hide the view', function() {
                expect(view.hide).toHaveBeenCalled();
            });
        });
    });
});
