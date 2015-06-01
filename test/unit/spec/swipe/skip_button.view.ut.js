import SkipButtonView from '../../../../src/views/swipe/SkipButtonView.js';
import ButtonView from '../../../../src/views/ButtonView.js';
import Runner from '../../../../lib/Runner.js';

fdescribe('SkipButtonView', function() {
    let view;

    beforeEach(function() {
        view = new SkipButtonView();
    });

    it('should exist', function() {
        expect(view).toEqual(jasmine.any(ButtonView));
    });

    describe('properties:', function() {
        describe('template', function() {
            it('should be "Skip"', function() {
                expect(view.template).toBe('Skip');
            });
        });
    });

    describe('methods:', function() {
        describe('disable()', function() {
            beforeEach(function() {
                spyOn(ButtonView.prototype, 'disable').and.callThrough();
                Runner.run(() => view.create());

                Runner.run(() => view.disable());
            });

            it('should call super()', function() {
                expect(ButtonView.prototype.disable).toHaveBeenCalled();
            });

            it('should make the button say "Skip in ..."', function() {
                expect(view.template).toBe('Skip in ...');
                expect(view.element.innerText).toBe('Skip in ...');
            });

            describe('if already disabled', function() {
                beforeEach(function() {
                    view.template = 'Skip in 10';
                    view.element.innerText = 'Skip in 10';

                    Runner.run(() => view.disable());
                });

                it('should do nothing', function() {
                    expect(view.template).toBe('Skip in 10');
                    expect(view.element.innerText).toBe('Skip in 10');
                });
            });

            describe('if the element has not been created', function() {
                beforeEach(function() {
                    view = new SkipButtonView();

                    Runner.run(() => view.disable());
                });

                it('should only set the template', function() {
                    expect(view.template).toBe('Skip in ...');
                });
            });
        });

        describe('enable()', function() {
            beforeEach(function() {
                spyOn(ButtonView.prototype, 'enable').and.callThrough();
                Runner.run(() => view.create());
                Runner.run(() => view.disable());

                Runner.run(() => view.enable());
            });

            it('should call super()', function() {
                expect(ButtonView.prototype.enable).toHaveBeenCalled();
            });

            it('should make the button say "Skip"', function() {
                expect(view.template).toBe('Skip');
                expect(view.element.innerText).toBe('Skip');
            });

            describe('if already enabled', function() {
                beforeEach(function() {
                    view.template = 'Hello!';
                    view.element.innerText = 'Hello!';

                    Runner.run(() => view.enable());
                });

                it('should do nothing', function() {
                    expect(view.template).toBe('Hello!');
                    expect(view.element.innerText).toBe('Hello!');
                });
            });

            describe('if the element has not been created', function() {
                beforeEach(function() {
                    view = new SkipButtonView();
                    Runner.run(() => view.disable());

                    Runner.run(() => view.enable());
                });

                it('should only set the template', function() {
                    expect(view.template).toBe('Skip');
                });
            });
        });

        describe('update(time)', function() {
            beforeEach(function() {
                spyOn(view, 'disable').and.callThrough();
                Runner.run(() => view.create());

                Runner.run(() => view.update(4));
            });

            it('should disable() the button', function() {
                expect(view.disable).toHaveBeenCalled();
            });

            it('should set the text of the button', function() {
                expect(view.template).toBe('Skip in 4');
                expect(view.element.innerText).toBe('Skip in 4');
            });
        });
    });
});
