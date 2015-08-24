import InstagramEmbedView from '../../../src/views/image_embeds/InstagramEmbedView.js';
import TemplateView from '../../../lib/core/TemplateView.js';
import codeLoader from '../../../src/services/code_loader.js';
import RunnerPromise from '../../../lib/RunnerPromise.js';
import Runner from '../../../lib/Runner.js';

describe('InstagramEmbedView', function() {
    let view;

    beforeEach(function() {
        view = new InstagramEmbedView();
    });

    it('should be a TemplateView', function() {
        expect(view).toEqual(jasmine.any(TemplateView));
    });

    describe('properties:', function() {
        describe('template', function() {
            it('should be the contents of InstagramEmbedView.html', function() {
                expect(view.template).toBe(require('../../../src/views/image_embeds/InstagramEmbedView.html'));
            });
        });

        describe('tag', function() {
            it('should be a div', function() {
                expect(view.tag).toBe('div');
            });
        });
    });

    describe('methods', function() {
        describe('private', function() {
            describe('process', function() {
                beforeEach(function() {
                    spyOn(codeLoader, 'load').and.returnValue(new RunnerPromise((fulfill) => {
                        fulfill();
                    }));
                });

                it('should use the code loader', function() {
                    view.__private__.process();
                    expect(codeLoader.load).toHaveBeenCalledWith('instagram');
                });
            });
        });

        describe('public', function() {
            describe('didInsertElement', function() {
                beforeEach(function() {
                    spyOn(TemplateView.prototype, 'didInsertElement');
                    spyOn(view.__private__, 'process');
                    Runner.run(() => view.didInsertElement());
                });

                it('should call super', function() {
                    expect(TemplateView.prototype.didInsertElement).toHaveBeenCalled();
                });

                it('should process the instagram embeds', function() {
                    expect(view.__private__.process).toHaveBeenCalled();
                });
            });

            describe('update', function() {
                beforeEach(function() {
                    spyOn(TemplateView.prototype, 'update');
                    spyOn(view.__private__, 'process');
                });

                it('should call super', function() {
                    Runner.run(() => view.update());
                    expect(TemplateView.prototype.update).toHaveBeenCalled();
                });

                it('should process the instagram embeds if inserted', function() {
                    view.inserted = true;
                    Runner.run(() => view.update());
                    expect(view.__private__.process).toHaveBeenCalled();
                });

                it('should not process the instagram embeds if not inserted', function() {
                    view.inserted = false;
                    Runner.run(() => view.update());
                    expect(view.__private__.process).not.toHaveBeenCalled();
                });
            });
        });
    });
});
