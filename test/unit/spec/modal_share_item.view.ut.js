import ModalShareItemView from '../../../src/views/ModalShareItemView.js';
import ActionableItemView from '../../../src/views/ActionableItemView.js';
import Runner from '../../../lib/Runner.js';

describe('ModalShareItemView', function() {
    let view;

    beforeEach(function() {
        view = new ModalShareItemView();
    });

    it('should exist', function() {
        expect(view).toEqual(jasmine.any(ModalShareItemView));
    });

    it('should be an ActionableItemView', function() {
        expect(view).toEqual(jasmine.any(ActionableItemView));
    });

    describe('methods', function() {
        describe('update', function() {
            beforeEach(function() {
                spyOn(ActionableItemView.prototype, 'update');
            });

            it('should call super', function() {
                Runner.run(() => {
                    view.update({
                        type: 'facebook'
                    });
                });
                expect(ActionableItemView.prototype.update).toHaveBeenCalled();
            });

            it('should add the required classes', function() {
                const types = ['facebook', 'twitter', 'pinterest'];
                types.forEach(type1 => {
                    Runner.run(() => {
                        view.update({
                            type: type1
                        });
                    });
                    types.forEach(type2 => {
                        if(type1 === type2) {
                            expect(view.classes).toContain('socialBtn__bg--' + type2);
                            expect(view.classes).toContain('socialIconsBe__light--' + type2);
                        } else {
                            expect(view.classes).not.toContain('socialBtn__bg--' + type2);
                            expect(view.classes).not.toContain('socialIconsBe__light--' + type2);
                        }
                    });
                });
            });
        });
    });
});
