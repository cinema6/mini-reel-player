import CardPlayerController from '../../../src/controllers/CardPlayerController.js';
import Controller from '../../../lib/core/Controller.js';
import View from '../../../lib/core/View.js';
import TemplateView from '../../../lib/core/TemplateView.js';
import MiniReel from '../../../src/models/MiniReel.js';
import Runner from '../../../lib/Runner.js';
import CardController from '../../../src/controllers/CardController.js';
import Card from '../../../src/models/Card.js';

class MockCardController extends CardController {
    constructor(...args) {
        super(...args);

        this.$arguments = args;
        spyOn(this, 'render');
    }
}

describe('CardPlayerController', function() {
    let parentView;
    let CardPlayerCtrl;

    beforeEach(function() {
        parentView = new View(document.createElement('body'));

        Runner.run(() => CardPlayerCtrl = new CardPlayerController(parentView));
    });

    it('should exist', function() {
        expect(CardPlayerCtrl).toEqual(jasmine.any(Controller));
    });

    describe('properties:', function() {
        describe('CardControllers', function() {
            it('should be {}', function() {
                expect(CardPlayerCtrl.CardControllers).toEqual({});
            });
        });

        describe('skipTime', function() {
            it('should be 0', function() {
                expect(CardPlayerCtrl.skipTime).toBe(0);
            });
        });

        describe('minireel', function() {
            it('should be a MiniReel', function() {
                expect(CardPlayerCtrl.minireel).toEqual(jasmine.any(MiniReel));
            });

            describe('events:', function() {
                let minireel;

                beforeEach(function() {
                    minireel = CardPlayerCtrl.minireel;

                    CardPlayerCtrl.CardControllers.video = MockCardController;
                });

                describe('init', function() {
                    let card;

                    beforeEach(function() {
                        card = new Card({});
                        card.type = 'video';

                        minireel.deck = [card];
                        CardPlayerCtrl.view = new View();

                        spyOn(parentView, 'append').and.callFake(view => view.cardOutlet = new View());

                        minireel.emit('init');
                    });

                    it('should create a card using the constructor from the CardControllers', function() {
                        expect(CardPlayerCtrl.CardCtrl).toEqual(jasmine.any(MockCardController));
                        expect(CardPlayerCtrl.CardCtrl.$arguments).toEqual([card, CardPlayerCtrl.view.cardOutlet]);
                    });

                    it('should render the CardCtrl it created', function() {
                        expect(CardPlayerCtrl.CardCtrl.render).toHaveBeenCalled();
                    });

                    it('should append its view to the parent', function() {
                        expect(parentView.append).toHaveBeenCalledWith(CardPlayerCtrl.view);
                    });
                });

                ['becameSkippable', 'becameUnskippable', 'becameCloseable', 'becameUncloseable'].forEach(eventName => {
                    describe(eventName, function() {
                        beforeEach(function() {
                            spyOn(CardPlayerCtrl, 'updateView');

                            minireel.emit(eventName);
                        });

                        it('should call updateView()', function() {
                            expect(CardPlayerCtrl.updateView).toHaveBeenCalled();
                        });
                    });
                });

                describe('skippableProgress', function() {
                    beforeEach(function() {
                        spyOn(CardPlayerCtrl, 'updateView').and.callFake(() => expect(CardPlayerCtrl.skipTime).toBe(4));

                        minireel.emit('skippableProgress', 4);
                    });

                    it('should set skipTime to the provided value', function() {
                        expect(CardPlayerCtrl.skipTime).toBe(4);
                    });

                    it('should call updateView()', function() {
                        expect(CardPlayerCtrl.updateView).toHaveBeenCalled();
                    });
                });
            });
        });

        describe('CardCtrl', function() {
            it('should be null', function() {
                expect(CardPlayerCtrl.CardCtrl).toBeNull();
            });
        });
    });

    describe('methods:', function() {
        let minireel, view;

        beforeEach(function() {
            minireel = CardPlayerCtrl.minireel;
        });

        describe('updateView()', function() {
            beforeEach(function() {
                minireel.skippable = true;
                minireel.closeable = true;
                CardPlayerCtrl.skipTime = 0;
                minireel.standalone = false;

                view = CardPlayerCtrl.view = new TemplateView();
                spyOn(view, 'update');

                CardPlayerCtrl.updateView();
            });

            it('should update its view with MiniReel data', function() {
                expect(view.update).toHaveBeenCalledWith({
                    skippable: minireel.skippable,
                    closeable: minireel.closeable,
                    skipTime: CardPlayerCtrl.skipTime
                });
            });

            describe('closeable', function() {
                describe('if standalone is true', function() {
                    beforeEach(function() {
                        view.update.calls.reset();
                        minireel.standalone = true;

                        CardPlayerCtrl.updateView();
                    });

                    it('should be false', function() {
                        expect(view.update).toHaveBeenCalledWith(jasmine.objectContaining({ closeable: false }));
                    });
                });
            });
        });

        describe('close()', function() {
            beforeEach(function() {
                spyOn(minireel, 'close');

                CardPlayerCtrl.close();
            });

            it('should call minireel.close()', function() {
                expect(minireel.close).toHaveBeenCalled();
            });
        });
    });
});
