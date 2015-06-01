import SkipProgressTimerView from '../../../../src/views/swipe/SkipProgressTimerView.js';
import SkipTimerView from '../../../../src/views/SkipTimerView.js';
import TemplateView from '../../../../lib/core/TemplateView.js';

describe('SkipProgressTimerView', function() {
    let view;

    beforeEach(function() {
        view = new SkipProgressTimerView();
    });

    it('should exist', function() {
        expect(view).toEqual(jasmine.any(SkipTimerView));
    });

    describe('update(time)', function() {
        beforeEach(function() {
            spyOn(SkipTimerView.prototype, 'update');
            spyOn(TemplateView.prototype, 'update');
        });

        describe('if called with a string', function() {
            beforeEach(function() {
                view.update('...');
            });

            it('should call super()', function() {
                expect(SkipTimerView.prototype.update).toHaveBeenCalledWith('...');
            });

            it('should invoke the TemplateView update() method with the width as 100%', function() {
                expect(TemplateView.prototype.update).toHaveBeenCalledWith({
                    width: '100%'
                });
                expect(TemplateView.prototype.update.calls.mostRecent().object).toBe(view);
            });
        });

        describe('if called with a Number', function() {
            it('should use that number to determine the width', function() {
                view.update(6);
                expect(TemplateView.prototype.update).toHaveBeenCalledWith({
                    width: `${((5 / 6) * 100).toString()}%`
                });
                expect(TemplateView.prototype.update.calls.mostRecent().object).toBe(view);
                expect(SkipTimerView.prototype.update).toHaveBeenCalledWith(6);

                TemplateView.prototype.update.calls.reset();
                SkipTimerView.prototype.update.calls.reset();
                view.update(5);
                expect(TemplateView.prototype.update).toHaveBeenCalledWith({
                    width: `${((4 / 6) * 100).toString()}%`
                });
                expect(TemplateView.prototype.update.calls.mostRecent().object).toBe(view);
                expect(SkipTimerView.prototype.update).toHaveBeenCalledWith(5);

                TemplateView.prototype.update.calls.reset();
                SkipTimerView.prototype.update.calls.reset();
                view.update(4);
                expect(TemplateView.prototype.update).toHaveBeenCalledWith({
                    width: `${((3 / 6) * 100).toString()}%`
                });
                expect(TemplateView.prototype.update.calls.mostRecent().object).toBe(view);
                expect(SkipTimerView.prototype.update).toHaveBeenCalledWith(4);

                TemplateView.prototype.update.calls.reset();
                SkipTimerView.prototype.update.calls.reset();
                view.update(0);
                expect(TemplateView.prototype.update).toHaveBeenCalledWith({
                    width: `0%`
                });
                expect(TemplateView.prototype.update.calls.mostRecent().object).toBe(view);
                expect(SkipTimerView.prototype.update).toHaveBeenCalledWith(0);
            });

            describe('and then a string', function() {
                beforeEach(function() {
                    view.update(10);
                    view.update(9);
                    view.update(8);
                    TemplateView.prototype.update.calls.reset();
                    SkipTimerView.prototype.update.calls.reset();

                    view.update('...');
                });

                it('should set the width to 100% again', function() {
                    expect(TemplateView.prototype.update).toHaveBeenCalledWith({
                        width: '100%'
                    });
                });

                describe('and then a number again', function() {
                    beforeEach(function() {
                        TemplateView.prototype.update.calls.reset();
                        SkipTimerView.prototype.update.calls.reset();
                    });

                    it('should use that number to determine the width', function() {
                        view.update(5);
                        expect(TemplateView.prototype.update).toHaveBeenCalledWith({
                            width: `${((4 / 5) * 100).toString()}%`
                        });
                        expect(TemplateView.prototype.update.calls.mostRecent().object).toBe(view);
                        expect(SkipTimerView.prototype.update).toHaveBeenCalledWith(5);

                        TemplateView.prototype.update.calls.reset();
                        SkipTimerView.prototype.update.calls.reset();
                        view.update(4);
                        expect(TemplateView.prototype.update).toHaveBeenCalledWith({
                            width: `${((3 / 5) * 100).toString()}%`
                        });
                        expect(TemplateView.prototype.update.calls.mostRecent().object).toBe(view);
                        expect(SkipTimerView.prototype.update).toHaveBeenCalledWith(4);
                    });
                });
            });
        });
    });

    describe('reset()', function() {
        beforeEach(function() {
            spyOn(view, 'update');

            view.reset();
        });

        it('should call update() with "..."', function() {
            expect(view.update).toHaveBeenCalledWith('...');
        });
    });
});
