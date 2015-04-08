import ResizingPlayerView from '../../../src/mixins/ResizingPlayerView.js';
import PlayerView from '../../../src/views/PlayerView.js';
import Runner from '../../../lib/Runner.js';
import ResizableNavButtonView from '../../../src/views/ResizableNavButtonView.js';

describe('ResizingPlayerView mixin', function() {
    let view;

    class MyPlayerView extends PlayerView {}
    let update = MyPlayerView.prototype.update = jasmine.createSpy('update()');
    MyPlayerView.mixin(ResizingPlayerView);


    beforeEach(function() {
        view = new MyPlayerView();
    });

    it('should exist', function() {
        expect(view).toEqual(jasmine.any(PlayerView));
    });

    describe('methods:', function() {
        describe('setButtonSize(size)', function() {
            beforeEach(function() {
                Runner.run(() => view.create());
                view.navItems = [new ResizableNavButtonView(), new ResizableNavButtonView()];
                view.navItems.forEach(button => spyOn(button, 'setSize'));

                view.setButtonSize('small');
            });

            it('should set each nav button\'s size', function() {
                view.navItems.forEach(button => expect(button.setSize).toHaveBeenCalledWith('small'));
            });
        });

        describe('disableNavigation()', function() {
            beforeEach(function() {
                Runner.run(() => view.create());
                view.navItems = [new ResizableNavButtonView(), new ResizableNavButtonView()];
                view.navItems.forEach(button => spyOn(button, 'disable'));
                view.navEnabled = true;

                view.disableNavigation();
            });

            it('should disable the nav buttons', function() {
                view.navItems.forEach(button => expect(button.disable).toHaveBeenCalled());
            });

            it('should set navEnabled to false', function() {
                expect(view.navEnabled).toBe(false);
            });
        });

        describe('enableNavigation()', function() {
            beforeEach(function() {
                Runner.run(() => view.create());
                view.navItems = [new ResizableNavButtonView(), new ResizableNavButtonView()];
                view.navItems.forEach(button => spyOn(button, 'enable'));
                Runner.run(() => view.disableNavigation());
                Runner.run(() => view.update({ title: 'hello', canGoBack: false, canGoForward: true }));
                spyOn(view, 'update');

                view.enableNavigation();
            });

            it('should enable the nav buttons', function() {
                view.navItems.forEach(button => expect(button.enable).toHaveBeenCalled());
            });

            it('should call update() with the last value passed to update() for canGoBack and canGoForward', function() {
                expect(view.update).toHaveBeenCalledWith({ canGoBack: false, canGoForward: true });
            });

            it('should set navEnabled to true', function() {
                expect(view.navEnabled).toBe(true);
            });
        });

        describe('update(data)', function() {
            let data;

            beforeEach(function() {
                data = { title: 'Hello', totalCards: '5', canGoForward: true, canGoBack: false };
            });

            describe('if the navigation is enabled', function() {
                beforeEach(function() {
                    view.navEnabled = true;
                    view.update(data);
                });

                it('should call super() with the data', function() {
                    expect(update).toHaveBeenCalledWith(data);
                });
            });

            describe('if the navigation is disabled', function() {
                beforeEach(function() {
                    view.navEnabled = false;
                    view.update(data);
                });

                it('should call super() with the data but canGoBack and canGoForward set to false', function() {
                    expect(update).toHaveBeenCalledWith({
                        title: data.title,
                        totalCards: data.totalCards,
                        canGoForward: false,
                        canGoBack: false
                    });
                });
            });
        });
    });
});
