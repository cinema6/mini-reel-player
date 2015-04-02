import FullTextCardController from '../../../../src/controllers/full/FullTextCardController.js';
import TextCardController from '../../../../src/controllers/TextCardController.js';
import View from '../../../../lib/core/View.js';
import FullTextCardView from '../../../../src/views/full/FullTextCardView.js';
import {EventEmitter} from 'events';

describe('FullTextCardController', function() {
    let FullTextCardCtrl;
    let card;
    let parentView;

    beforeEach(function() {
        card = new EventEmitter();
        parentView = new View();
        spyOn(FullTextCardController.prototype, 'addListeners').and.callThrough();

        FullTextCardCtrl = new FullTextCardController(card, parentView);
    });

    it('should exist', function() {
        expect(FullTextCardCtrl).toEqual(jasmine.any(TextCardController));
    });

    it('should add its listeners', function() {
        expect(FullTextCardCtrl.addListeners).toHaveBeenCalled();
    });

    describe('properties:', function() {
        describe('view', function() {
            it('should be a FullTextCardView', function() {
                expect(FullTextCardCtrl.view).toEqual(jasmine.any(FullTextCardView));
            });
        });
    });

    describe('events:', function() {
        describe('view', function() {
            describe('advance', function() {
                beforeEach(function() {
                    card.complete = jasmine.createSpy('card.complete()');

                    FullTextCardCtrl.view.emit('advance');
                });

                it('should call complete() on the card', function() {
                    expect(card.complete).toHaveBeenCalled();
                });
            });
        });
    });
});
