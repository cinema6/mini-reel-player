import ModalShareItemView from '../../../src/views/ModalShareItemView.js';
import LinkItemView from '../../../src/views/LinkItemView.js';
import Runner from '../../../lib/Runner.js';

describe('ModalShareItemView', function() {
    let view;

    beforeEach(function() {
        view = new ModalShareItemView();
    });

    it('should exist', function() {
        expect(view).toEqual(jasmine.any(ModalShareItemView));
    });

    it('should be a LinkItemView', function() {
        expect(view).toEqual(jasmine.any(LinkItemView));
    });

    describe('methods', function() {
        describe('update', function() {
            beforeEach(function() {
                spyOn(LinkItemView.prototype, 'update');
            });

            it('should call super', function() {
                Runner.run(() => {
                    view.update({
                        type: 'facebook'
                    });
                });
                expect(LinkItemView.prototype.update).toHaveBeenCalled();
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
