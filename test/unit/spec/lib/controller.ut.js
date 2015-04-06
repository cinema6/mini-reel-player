import Controller from '../../../../lib/core/Controller.js';
import Mixable from '../../../../lib/core/Mixable.js';
import View from '../../../../lib/core/View.js';

describe('Controller', function() {
    let controller;

    beforeEach(function() {
        controller = new Controller();
    });

    it('should exist', function() {
        expect(controller).toEqual(jasmine.any(Mixable));
    });

    describe('addView(view)', function() {
        let view;

        beforeEach(function() {
            view = new View();

            controller.addView(view);
            controller.doStuff = jasmine.createSpy('controller.doStuff()');
        });

        describe('when the "action" event is emitted', function() {
            let target, action;

            describe('if the target === "controller"', function() {
                beforeEach(function() {
                    target = 'controller';
                });

                describe('if there is a method that corresponds to the action', function() {
                    beforeEach(function() {
                        action = 'doStuff';

                        view.emit('action', target, action, ['hello', 'world']);
                    });

                    it('should call the method with the name of the action', function() {
                        expect(controller.doStuff).toHaveBeenCalledWith('hello', 'world');
                    });
                });

                describe('if there is no method that corresponds to the action', function() {
                    beforeEach(function() {
                        controller.absentMethod = 'Actually, I am a string.';
                        action = 'absentMethod';
                    });

                    it('should throw an error', function() {
                        expect(function() {
                            view.emit('action', target, action, ['hello', 'world']);
                        }).toThrow(new TypeError(`Controller tried to respond to action [${action}] from View [${view.id}] but it does not implement ${action}().`));
                    });
                });
            });

            describe('if the target !== "controller"', function() {
                beforeEach(function() {
                    target = 'view';
                });

                describe('if there is a method that corresponds to the action', function() {
                    beforeEach(function() {
                        action = 'doStuff';

                        view.emit('action', target, action, ['hello', 'world']);
                    });

                    it('should do nothing', function() {
                        expect(controller.doStuff).not.toHaveBeenCalled();
                    });
                });

                describe('if there is no method that corresponds to the action', function() {
                    beforeEach(function() {
                        action = 'absentMethod';
                    });

                    it('should do nothing', function() {
                        expect(function() {
                            view.emit('action', target, action, ['hello', 'world']);
                        }).not.toThrow();
                    });
                });
            });
        });
    });
});
