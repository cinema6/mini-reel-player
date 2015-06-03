import CardView from '../../../src/views/CardView.js';
import ImageCardView from '../../../src/views/ImageCardView.js';
import Runner from '../../../lib/Runner.js';
import injectHtml from '../../../src/fns/inject_html.js';
import View from '../../../lib/core/View.js';

describe('ImageCardView', function() {
    let imageCardView;

    beforeEach(function() {
        imageCardView = new ImageCardView();
    });

    it('should be a CardView', function() {
        expect(imageCardView).toEqual(jasmine.any(CardView));
    });

    describe('properties:', function() {
        describe('embedCode', function() {
            it('should initially be null', function() {
                expect(imageCardView.__private__.embedCode).toBeNull();
            });

            it('should be set by loadEmbed()', function() {
                spyOn(imageCardView, 'create');
                spyOn(Runner, 'scheduleOnce');
                imageCardView.embed = new View();
                imageCardView.embed.element = '<div></div>';
                imageCardView.loadEmbed('<div>embed code</div>');
                expect(imageCardView.__private__.embedCode).toBe('<div>embed code</div>');
            });
        });
    });

    describe('methods:', function() {
        describe('loadEmbed(embedCode)', function() {
            it('should create the embed element if it is undefined', function() {
                spyOn(imageCardView, 'create').and.callFake(function() {
                    this.embed = new View();
                    this.embed.element = '<div></div>';
                });
                spyOn(Runner, 'scheduleOnce');
                imageCardView.loadEmbed('<div>embed code</div>');
                expect(imageCardView.create).toHaveBeenCalled();
            });

            it('should not create the embed element if it is defined', function() {
                spyOn(imageCardView, 'create');
                spyOn(Runner, 'scheduleOnce');
                imageCardView.embed = new View();
                imageCardView.embed.element = '<div></div>';
                imageCardView.loadEmbed('<div>embed code</div>');
                expect(imageCardView.create).not.toHaveBeenCalled();
            });

            it('should schedule the injection of the embed code', function() {
                spyOn(Runner, 'scheduleOnce');
                imageCardView.embed = new View();
                imageCardView.embed.element = '<div></div>';
                imageCardView.loadEmbed('<div>embed code</div>');
                expect(Runner.scheduleOnce).toHaveBeenCalledWith('render', imageCardView, injectHtml, ['<div>embed code</div>', imageCardView.embed.element]);
            });

            it('should not inject the embed code if the same embed code has already been injected', function() {
                spyOn(Runner, 'scheduleOnce');
                imageCardView.embed = new View();
                imageCardView.embed.element = '<div></div>';
                imageCardView.__private__.embedCode = '<div>embed code</div>';
                imageCardView.loadEmbed('<div>embed code</div>');
                expect(Runner.scheduleOnce).not.toHaveBeenCalled();
            });
        });
    });
});
