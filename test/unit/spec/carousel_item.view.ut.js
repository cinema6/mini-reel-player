import CarouselItemView from '../../../src/views/CarouselItemView.js';
import LinkItemView from '../../../src/views/LinkItemView.js';
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
        expect(this.view).toEqual(jasmine.any(LinkItemView));
    });

    describe('event handlers', function() {
        describe('click()', function() {
            beforeEach(function() {
                this.event = {
                    preventDefault: jasmine.createSpy('event.preventDefault()'),
                    target: null
                };

                spyOn(LinkItemView.prototype, 'click');

                this.view.click(this.event);
            });

            it('should preventDefault()', function() {
                expect(this.event.preventDefault).toHaveBeenCalledWith();
            });

            it('should call super()', function() {
                expect(LinkItemView.prototype.click).toHaveBeenCalledWith(this.event);
            });
        });
    });
});
