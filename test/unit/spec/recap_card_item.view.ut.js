describe('RecapCardItemView', function() {
    import TemplateView from '../../../lib/core/TemplateView.js';
    import RecapCardItemView from '../../../src/views/RecapCardItemView.js';
    import {
        noop
    } from '../../../lib/utils.js';
    let recapCardItemView;

    beforeEach(function() {
        recapCardItemView = new RecapCardItemView();
    });

    it('should be a TemplateView', function() {
        expect(recapCardItemView).toEqual(jasmine.any(TemplateView));
    });

    describe('properties:', function() {
        describe('tag', function() {
            it('should be "li"', function() {
                expect(recapCardItemView.tag).toBe('li');
            });
        });

        describe('template', function() {
            it('should be the contents of RecapCardItemView.html', function() {
                expect(recapCardItemView.template).toBe(require('../../../src/views/RecapCardItemView.html'));
            });
        });

        describe('classes', function() {
            it('should be the usual classes plus "recap__item card__group clearfix"', function() {
                expect(recapCardItemView.classes).toEqual((new TemplateView()).classes.concat(['recap__item', 'card__group', 'clearfix']));
            });
        });
    });

    describe('hooks:', function() {
        describe('didCreateElement()', function() {
            beforeEach(function() {
                recapCardItemView.create();
            });

            it('should give the element a noop click handler', function() {
                expect(recapCardItemView.element.onclick).toBe(noop);
            });
        });
    });

    describe('events:', function() {
        describe('click()', function() {
            let spy;

            beforeEach(function() {
                spy = jasmine.createSpy('spy()');
                recapCardItemView.on('select', spy);

                recapCardItemView.click();
            });

            it('should emit the "select" event', function() {
                expect(spy).toHaveBeenCalled();
            });
        });
    });
});
