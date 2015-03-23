import SkipTimerView from '../../../src/views/SkipTimerView.js';
import TemplateView from '../../../lib/core/TemplateView.js';
import Hideable from '../../../src/mixins/Hideable.js';

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

    describe('properties:', function() {
        describe('template', function() {
            it('should be the contents of SkipTimerView.html', function() {
                expect(view.template).toBe(require('../../../src/views/SkipTimerView.html'));
            });
        });
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
});
