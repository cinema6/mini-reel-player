describe('ButtonView', function() {
    import ButtonView from '../../../src/views/ButtonView.js';
    import View from '../../../lib/core/View.js';
    let buttonView;

    beforeEach(function() {
        buttonView = new ButtonView();
    });

    it('should exist', function() {
        expect(buttonView).toEqual(jasmine.any(View));
    });

    describe('properties:', function() {
        describe('tag', function() {
            it('should be button', function() {
                expect(buttonView.tag).toBe('button');
            });
        });
    });

    describe('methods:', function() {
        describe('disable()', function() {
            beforeEach(function() {
                spyOn(buttonView, 'setAttribute').and.callThrough();
                buttonView.disable();
            });

            it('should set the "disabled" attribute to true', function() {
                expect(buttonView.setAttribute).toHaveBeenCalledWith('disabled', true);
            });
        });

        describe('enable()', function() {
            beforeEach(function() {
                spyOn(buttonView, 'setAttribute').and.callThrough();
                buttonView.enable();
            });

            it('should set the "disabled" attribute to false', function() {
                expect(buttonView.setAttribute).toHaveBeenCalledWith('disabled', false);
            });
        });
    });

    describe('event handlers:', function() {
        describe('click()', function() {
            let spy;

            beforeEach(function() {
                spy = jasmine.createSpy('spy()');
                buttonView.on('press', spy);

                buttonView.click();
            });

            it('should emit the "press" event', function() {
                expect(spy).toHaveBeenCalled();
            });

            describe('if the button is disabled', function() {
                beforeEach(function() {
                    buttonView.disable();
                    spy.calls.reset();

                    buttonView.click();
                });

                it('should not emit the "press" event', function() {
                    expect(spy).not.toHaveBeenCalled();
                });
            });
        });

        describe('touchStart()', function() {
            let evt;

            beforeEach(function() {
                evt = {
                    preventDefault: jasmine.createSpy('event.preventDefault()')
                };

                buttonView.touchStart(evt);
            });

            it('should prevent default on the event', function() {
                expect(evt.preventDefault).toHaveBeenCalled();
            });
        });

        describe('touchEnd()', function() {
            let evt;

            beforeEach(function() {
                evt = {
                    preventDefault: jasmine.createSpy('event.preventDefault()')
                };
                spyOn(buttonView, 'click');

                buttonView.touchEnd(evt);
            });

            it('should preventDefault()', function() {
                expect(evt.preventDefault).toHaveBeenCalled();
            });

            it('should call click()', function() {
                expect(buttonView.click).toHaveBeenCalled();
            });
        });
    });
});
