import CheckboxView from '../../../src/views/CheckboxView.js';
import View from '../../../lib/core/View.js';
import Runner from '../../../lib/Runner.js';
import Touchable from '../../../src/mixins/Touchable.js';

describe('CheckboxView', function() {
    beforeEach(function() {
        this.view = new CheckboxView();
    });

    it('should exist', function() {
        expect(this.view).toEqual(jasmine.any(View));
    });

    it('should be Touchable', function() {
        expect(CheckboxView.mixins).toContain(Touchable, 'CheckboxView does not mixin Touchable');
    });

    describe('the element', function() {
        beforeEach(function() {
            this.element = Runner.run(() => this.view.create());
        });

        it('should be a checkbox', function() {
            expect(this.element.tagName).toBe('INPUT');
            expect(this.element.type).toBe('checkbox');
        });
    });

    describe('properties:', function() {
        describe('checked', function() {
            beforeEach(function() {
                spyOn(this.view, 'create').and.callThrough();
            });

            describe('before the element is created', function() {
                it('should be false', function() {
                    expect(this.view.checked).toBe(false);
                    expect(this.view.create).not.toHaveBeenCalled();
                });

                it('should create the element when setting', function() {
                    Runner.run(() => this.view.checked = true);
                    expect(this.view.create).toHaveBeenCalledWith();
                    expect(this.view.element.checked).toBe(true);
                });
            });

            describe('if the element has been created', function() {
                beforeEach(function() {
                    Runner.run(() => this.view.create());
                    this.view.create.calls.reset();
                    this.view.element.checked = true;
                });

                it('should return its element\'s checked property', function() {
                    expect(this.view.checked).toBe(this.view.element.checked);
                });

                it('should set its element\'s checked property', function() {
                    this.view.checked = false;
                    expect(this.view.create).not.toHaveBeenCalled();
                    expect(this.view.element.checked).toBe(false);
                });
            });
        });
    });

    describe('event handlers:', function() {
        beforeEach(function() {
            Runner.run(() => this.view.create());
        });

        describe('click()', function() {
            beforeEach(function() {
                this.event = {
                    preventDefault: jasmine.createSpy('event.preventDefault()')
                };
                spyOn(this.view, 'sendAction').and.callThrough();

                jasmine.clock().install();

                this.view.click(this.event);
            });

            afterEach(function() {
                jasmine.clock().uninstall();
            });

            it('should call event.preventDefault()', function() {
                expect(this.event.preventDefault());
            });

            it('should not send its action', function() {
                expect(this.view.sendAction).not.toHaveBeenCalled();
            });

            describe('in the next turn of the event loop', function() {
                beforeEach(function() {
                    this.view.sendAction.and.callFake(() => Runner.schedule('render', null, () => {}));
                    jasmine.clock().tick(0);
                });

                it('should send its action', function() {
                    expect(this.view.sendAction).toHaveBeenCalledWith(this.view, !this.view.element.checked);
                });
            });
        });
    });
});
