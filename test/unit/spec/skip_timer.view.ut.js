import SkipTimerView from '../../../src/views/SkipTimerView.js';
import TemplateView from '../../../lib/core/TemplateView.js';
import Hideable from '../../../src/mixins/Hideable.js';
import Runner from '../../../lib/Runner.js';

describe('SkipTimerView', function() {
    let view;

    beforeEach(function() {
        view = new SkipTimerView();
    });

    it('should be a TemplateView', function() {
        expect(view).toEqual(jasmine.any(TemplateView));
    });

    it('should be hideable', function() {
        expect(SkipTimerView.mixins).toContain(Hideable);
    });

    describe('methods:', function() {
        describe('update(time)', function() {
            beforeEach(function() {
                spyOn(TemplateView.prototype, 'update');

                view.update(5);
            });

            it('should call super() with the time in an object', function() {
                expect(TemplateView.prototype.update).toHaveBeenCalledWith({
                    remaining: (5).toString()
                });
            });
        });
    });

    describe('didCreateElement()', function() {
        beforeEach(function() {
            spyOn(TemplateView.prototype, 'didCreateElement').and.callThrough();
            view.tag = 'span';
            spyOn(view, 'update').and.callThrough();

            Runner.run(() => view.create());
        });

        it('should call super()', function() {
            expect(TemplateView.prototype.didCreateElement).toHaveBeenCalled();
        });

        it('should update itself with elipses', function() {
            expect(view.update).toHaveBeenCalledWith('...');
        });
    });
});
