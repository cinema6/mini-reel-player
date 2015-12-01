import ViewController from '../../../src/controllers/ViewController.js';
import Controller from '../../../lib/core/Controller.js';
import View from '../../../lib/core/View.js';
import {EventEmitter} from 'events';

describe('ViewController', function() {
    let ViewCtrl;

    beforeEach(function() {
        ViewCtrl = new ViewController();
    });

    it('should be a Controller', function() {
        expect(ViewCtrl).toEqual(jasmine.any(Controller));
    });

    it('should mixin the EventEmitter', function() {
        expect(ViewController.mixins).toContain(EventEmitter);
    });

    describe('properties:', function() {
        describe('view', function() {
            it('should be null', function() {
                expect(ViewCtrl.view).toBeNull();
            });
        });
    });

    describe('methods:', function() {
        describe('renderInto(view)', function() {
            let view;

            beforeEach(function() {
                view = new View();
                ViewCtrl.view = new View();
                spyOn(ViewCtrl.view, 'appendTo');

                ViewCtrl.renderInto(view);
            });

            it('should put its view in the provided view', function() {
                expect(ViewCtrl.view.appendTo).toHaveBeenCalledWith(view);
            });
        });
    });
});
