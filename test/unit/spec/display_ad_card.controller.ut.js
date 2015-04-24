import DisplayAdCardController from '../../../src/controllers/DisplayAdCardController.js';
import CardController from '../../../src/controllers/CardController.js';
import DisplayAdController from '../../../src/controllers/DisplayAdController.js';
import DisplayAdCardView from '../../../src/views/DisplayAdCardView.js';
import View from '../../../lib/core/View.js';
import LinksListView from '../../../src/views/LinksListView.js';
import { EventEmitter } from 'events';
import Runner from '../../../lib/Runner.js';

describe('DisplayAdCardController', function() {
    let DisplayAdCardCtrl;
    let card;

    beforeEach(function() {
        card = new EventEmitter();
        card.displayAd = new EventEmitter();
        card.links = {
            Website: 'http://my-site.com'
        };
        card.socialLinks = [
            { type: 'facebook', label: 'Facebook', href: 'facebook.com' },
            { type: 'twitter', label: 'Twitter', href: 'twitter.com' }
        ];
        card.sponsor = 'Buy\'n Large';

        DisplayAdCardCtrl = new DisplayAdCardController(card);
    });

    it('should exist', function() {
        expect(DisplayAdCardCtrl).toEqual(jasmine.any(CardController));
    });

    describe('properties:', function() {
        describe('view', function() {
            it('should be a DisplayAdCardView', function() {
                expect(DisplayAdCardCtrl.view).toEqual(jasmine.any(DisplayAdCardView));
            });
        });

        describe('DisplayAdCtrl', function() {
            it('should be a DisplayAdController', function() {
                expect(DisplayAdCardCtrl.DisplayAdCtrl).toEqual(jasmine.any(DisplayAdController));
                expect(DisplayAdCardCtrl.DisplayAdCtrl.model).toBe(card.displayAd);
            });
        });
    });

    describe('events:', function() {
        describe('model:', function() {
            describe('prepare', function() {
                beforeEach(function() {
                    spyOn(DisplayAdCardCtrl.DisplayAdCtrl, 'activate');

                    Runner.run(() => card.emit('prepare'));
                });

                it('should activate its DisplayAdCtrl', function() {
                    expect(DisplayAdCardCtrl.DisplayAdCtrl.activate).toHaveBeenCalled();
                });
            });

            describe('activate', function() {
                beforeEach(function() {
                    spyOn(DisplayAdCardCtrl.DisplayAdCtrl, 'activate');

                    Runner.run(() => card.emit('activate'));
                });

                it('should activate its DisplayAdCtrl', function() {
                    expect(DisplayAdCardCtrl.DisplayAdCtrl.activate).toHaveBeenCalled();
                });
            });

            describe('deactivate', function() {
                beforeEach(function() {
                    spyOn(DisplayAdCardCtrl.DisplayAdCtrl, 'deactivate');

                    Runner.run(() => card.emit('deactivate'));
                });

                it('should deactivate its DisplayAdCtrl', function() {
                    expect(DisplayAdCardCtrl.DisplayAdCtrl.deactivate).toHaveBeenCalled();
                });
            });
        });
    });

    describe('methods:', function() {
        describe('render()', function() {
            beforeEach(function() {
                DisplayAdCardCtrl.view.links = new LinksListView();
                DisplayAdCardCtrl.view.displayAdOutlet = new View();

                spyOn(CardController.prototype, 'render');
                spyOn(DisplayAdCardCtrl.view.links, 'update');
                spyOn(DisplayAdCardCtrl.DisplayAdCtrl, 'renderInto');
                spyOn(DisplayAdCardCtrl.view, 'update');

                DisplayAdCardCtrl.render();
            });

            it('should call super()', function() {
                expect(CardController.prototype.render).toHaveBeenCalled();
            });

            it('should render its DisplayAdController', function() {
                expect(DisplayAdCardCtrl.DisplayAdCtrl.renderInto).toHaveBeenCalledWith(DisplayAdCardCtrl.view.displayAdOutlet);
            });

            it('should update its view', function() {
                expect(DisplayAdCardCtrl.view.update).toHaveBeenCalledWith({
                    sponsor: card.sponsor,
                    website: card.links.Website,
                    links: card.socialLinks,
                    hasLinks: jasmine.any(Boolean)
                });
            });

            describe('if the card has a website', function() {
                beforeEach(function() {
                    DisplayAdCardCtrl.view.update.calls.reset();

                    card.socialLinks.length = 0;
                    card.links.Website = 'mysite.com';

                    DisplayAdCardCtrl.render();
                });

                it('should set hasLinks to true', function() {
                    expect(DisplayAdCardCtrl.view.update).toHaveBeenCalledWith(jasmine.objectContaining({
                        hasLinks: true
                    }));
                });
            });

            describe('if the card has socialLinks', function() {
                beforeEach(function() {
                    DisplayAdCardCtrl.view.update.calls.reset();

                    card.socialLinks = [{}];
                    delete card.links.Website;

                    DisplayAdCardCtrl.render();
                });

                it('should set hasLinks to true', function() {
                    expect(DisplayAdCardCtrl.view.update).toHaveBeenCalledWith(jasmine.objectContaining({
                        hasLinks: true
                    }));
                });
            });

            describe('if the card has no socialLinks or Website', function() {
                beforeEach(function() {
                    DisplayAdCardCtrl.view.update.calls.reset();

                    card.socialLinks.length = 0;
                    delete card.links.Website;

                    DisplayAdCardCtrl.render();
                });

                it('should set hasLinks to false', function() {
                    expect(DisplayAdCardCtrl.view.update).toHaveBeenCalledWith(jasmine.objectContaining({
                        hasLinks: false
                    }));
                });
            });
        });
    });
});
