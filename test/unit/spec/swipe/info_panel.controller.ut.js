import InfoPanelController from '../../../../src/controllers/swipe/InfoPanelController.js';
import ViewController from '../../../../src/controllers/ViewController.js';
import InfoPanelView from '../../../../src/views/swipe/InfoPanelView.js';
import View from '../../../../lib/core/View.js';
import SafelyGettable from '../../../../src/mixins/SafelyGettable.js';

describe('InfoPanelController', function() {
    let InfoPanelCtrl;
    let minireel;

    beforeEach(function() {
        spyOn(InfoPanelController.prototype, 'addView').and.callThrough();

        minireel = new SafelyGettable();

        InfoPanelCtrl = new InfoPanelController(minireel);
    });

    it('should exist', function() {
        expect(InfoPanelCtrl).toEqual(jasmine.any(ViewController));
    });

    describe('properties:', function() {
        describe('model', function() {
            it('should be the provided MiniReel', function() {
                expect(InfoPanelCtrl.model).toBe(minireel);
            });
        });

        describe('view', function() {
            it('should be a InfoPanelView', function() {
                expect(InfoPanelCtrl.view).toEqual(jasmine.any(InfoPanelView));
                expect(InfoPanelCtrl.addView).toHaveBeenCalledWith(InfoPanelCtrl.view);
            });
        });
    });

    describe('methods:', function() {
        describe('renderInto(view)', function() {
            let view;

            beforeEach(function() {
                view = new View();
                spyOn(ViewController.prototype, 'renderInto');
                spyOn(InfoPanelCtrl, 'updateView');
                spyOn(InfoPanelCtrl, 'activate');

                InfoPanelCtrl.renderInto(view);
            });

            it('should call super()', function() {
                expect(ViewController.prototype.renderInto).toHaveBeenCalledWith(view);
            });

            it('should call updateView()', function() {
                expect(InfoPanelCtrl.updateView).toHaveBeenCalled();
            });

            it('should deactivate itself', function() {
                expect(InfoPanelCtrl.activate).toHaveBeenCalledWith(false);
            });
        });

        describe('updateView()', function() {
            let view;

            beforeEach(function() {
                view = InfoPanelCtrl.view;

                minireel.title = 'My Awesome MiniReel';
                minireel.sponsor = 'Buy n Large';
                minireel.logo = 'my-logo.png';
                minireel.splash = 'my-splash.png';
                minireel.links = {
                    Website: { uri: 'http://www.mysite.com', tracking: [] }
                };
                minireel.socialLinks = [
                    { type: 'youtube', label: 'YouTube', href: 'youtube.com' },
                    { type: 'twitter', label: 'Twitter', href: 'twitter.com' }
                ];

                spyOn(view, 'update');

                InfoPanelCtrl.updateView();
            });

            it('should update() the view', function() {
                expect(view.update).toHaveBeenCalledWith({
                    title: minireel.get('title'),
                    sponsor: minireel.get('sponsor'),
                    logo: minireel.get('logo'),
                    splash: minireel.get('splash'),
                    website: minireel.get('links.Website.uri'),
                    links: minireel.get('socialLinks')
                });
            });
        });

        describe('activate(yes)', function() {
            let view;
            let activate, deactivate;

            beforeEach(function() {
                view = InfoPanelCtrl.view;

                activate = jasmine.createSpy('activate()');
                InfoPanelCtrl.on('activate', activate);

                deactivate = jasmine.createSpy('deactivate()');
                InfoPanelCtrl.on('deactivate', deactivate);

                spyOn(view, 'show');
            });

            describe('if called with true', function() {
                beforeEach(function() {
                    InfoPanelCtrl.activate(true);
                });

                it('should show its view', function() {
                    expect(view.show).toHaveBeenCalledWith(true);
                });

                it('should emit "activate"', function() {
                    expect(activate).toHaveBeenCalled();
                    expect(deactivate).not.toHaveBeenCalled();
                });
            });

            describe('if called with false', function() {
                beforeEach(function() {
                    InfoPanelCtrl.activate(false);
                });

                it('should hide its view', function() {
                    expect(view.show).toHaveBeenCalledWith(false);
                });

                it('should emit "deactivate"', function() {
                    expect(deactivate).toHaveBeenCalled();
                    expect(activate).not.toHaveBeenCalled();
                });
            });
        });

        describe('close()', function() {
            beforeEach(function() {
                spyOn(InfoPanelCtrl, 'activate');

                InfoPanelCtrl.close();
            });

            it('should deactivate itself', function() {
                expect(InfoPanelCtrl.activate).toHaveBeenCalledWith(false);
            });
        });
    });
});
