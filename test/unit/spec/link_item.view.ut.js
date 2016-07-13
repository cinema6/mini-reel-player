import LinkItemView from '../../../src/views/LinkItemView.js';
import TemplateView from '../../../lib/core/TemplateView.js';
import ContextualView from '../../../src/mixins/ContextualView.js';
import Runner from '../../../lib/Runner.js';

describe('LinkItemView', function() {
    let root, element;
    let view;

    beforeEach(function() {
        root = document.createElement('div');
        root.innerHTML = `
            <a href="https://reelcontent.com/">
                <span></span>
            </a>
        `;

        element = document.createElement('span');
        element.innerHTML = `
            <div><img class="test1" src="https://reelcontent.com/images/logo-nav.png" /></div>
            <a href="https://www.google.com/"><img class="test2" src="https://reelcontent.com/images/logo-nav.png" /></a>
        `;

        root.querySelector('span').appendChild(element);
        document.body.appendChild(root);

        Runner.run(() => view = new LinkItemView(element));
    });

    afterEach(function() {
        document.body.removeChild(root);
    });

    it('should be a TemplateView', function() {
        expect(view).toEqual(jasmine.any(TemplateView));
    });

    it('should mixin the ContextualView', function() {
        expect(LinkItemView.mixins).toContain(ContextualView, 'ContextualView not mixed in.');
    });

    describe('handlers:', function() {
        describe('click()', function() {
            let event;

            beforeEach(function() {
                event = {
                    screenX: 100,
                    screenY: 2,
                    target: element.querySelector('.test2')
                };

                spyOn(view, 'sendAction');

                view.click(event);
            });

            it('should send an action', function() {
                expect(view.sendAction).toHaveBeenCalledWith(view, {
                    coordinates: {
                        x: event.screenX,
                        y: event.screenY
                    },
                    href: 'https://www.google.com/'
                });
            });

            describe('if no link was clicked', function() {
                beforeEach(function() {
                    view.sendAction.calls.reset();

                    event.target = element.querySelector('.test1');

                    view.click(event);
                });

                it('should not send an action', function() {
                    expect(view.sendAction).not.toHaveBeenCalled();
                });
            });

            describe('if the view is a link', function() {
                beforeEach(function() {
                    element = document.createElement('a');
                    element.href = 'https://www.reelcontent.com';
                    element.innerHTML = '<img class="test2" src="https://reelcontent.com/images/logo-nav.png" />';

                    event.target = element.querySelector('.test2');

                    Runner.run(() => view = new LinkItemView(element));

                    spyOn(view, 'sendAction');

                    view.click(event);
                });

                it('should send an action', function() {
                    expect(view.sendAction).toHaveBeenCalled();
                });
            });
        });
    });
});
