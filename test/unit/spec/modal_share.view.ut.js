import ModalShareView from '../../../src/views/ModalShareView.js';
import TemplateView from '../../../lib/core/TemplateView.js';

describe('ModalShareView', function() {
    let view;

    beforeEach(function() {
        view = new ModalShareView();
        view.create();
    });

    describe('properties', function() {
        describe('tag', function() {
            it('should be div', function() {
                expect(view.tag).toBe('div');
            });
        });

        describe('template', function() {
            it('should be the contents of ModalShareView.html', function() {
                expect(view.template).toBe(require('../../../src/views/ModalShareView.html'));
            });
        });
    });

    describe('methods', function() {
        describe('update', function() {
            beforeEach(function() {
                spyOn(TemplateView.prototype, 'update');
                spyOn(view.shareLinks, 'update');
            });

            it('should call super', function() {
                view.update({});
                expect(TemplateView.prototype.update).toHaveBeenCalled();
            });

            it('should update the share links if they exist', function() {
                view.update({
                    shareLinks: [{
                        type: 'facebook'
                    }]
                });
                expect(view.shareLinks.update).toHaveBeenCalledWith([{
                    type: 'facebook'
                }]);
            });

            it('should not update the share link sif they do not exist', function() {
                view.update({shareLinks: null});
                expect(view.shareLinks.update).not.toHaveBeenCalled();
                view.update({shareLinks: []});
                expect(view.shareLinks.update).not.toHaveBeenCalled();
            });
        });
    });
});
