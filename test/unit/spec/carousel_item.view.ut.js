import CarouselItemView from '../../../src/views/CarouselItemView.js';
import TemplateView from '../../../lib/core/TemplateView.js';
import Runner from '../../../lib/Runner.js';

describe('CarouselItemView', function() {
    beforeEach(function() {
        this.root = document.createElement('div');
        this.root.innerHTML = `
            <a href="https://reelcontent.com/">
                <span></span>
            </a>
        `;

        this.element = document.createElement('li');
        this.element.innerHTML = `
            <div><img class="test1" src="https://reelcontent.com/images/logo-nav.png" /></div>
            <a href="https://www.google.com/"><img class="test2" src="https://reelcontent.com/images/logo-nav.png" /></a>
        `;

        this.root.querySelector('span').appendChild(this.element);
        document.body.appendChild(this.root);

        Runner.run(() => this.view = new CarouselItemView(this.element));
    });

    afterEach(function() {
        document.body.removeChild(this.root);
    });

    it('should exist', function() {
        expect(this.view).toEqual(jasmine.any(TemplateView));
    });

    describe('event handlers', function() {
        describe('click()', function() {
            beforeEach(function() {
                this.event = {
                    preventDefault: jasmine.createSpy('event.preventDefault()'),
                    target: null
                };

                this.clickthrough = jasmine.createSpy('clickthrough()');
                this.view.on('clickthrough', this.clickthrough);
            });

            describe('if the target is not in a link', function() {
                beforeEach(function() {
                    this.event.target = this.element.querySelector('.test1');

                    this.view.click(this.event);
                });

                it('should preventDefault()', function() {
                    expect(this.event.preventDefault).toHaveBeenCalledWith();
                });

                it('should not emit clickthrough', function() {
                    expect(this.clickthrough).not.toHaveBeenCalled();
                });
            });

            describe('if the target is in a link', function() {
                beforeEach(function() {
                    this.event.target = this.element.querySelector('.test2');

                    this.view.click(this.event);
                });

                it('should preventDefault()', function() {
                    expect(this.event.preventDefault).toHaveBeenCalledWith();
                });

                it('should emit clickthrough', function() {
                    expect(this.clickthrough).toHaveBeenCalledWith('https://www.google.com/');
                });
            });
        });
    });
});
