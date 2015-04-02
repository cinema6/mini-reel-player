import CardView from '../../../src/views/CardView.js';
import ResizingCard from '../../../src/mixins/ResizingCard.js';
import Runner from '../../../lib/Runner.js';
import {
    map
} from '../../../lib/utils.js';

function makeString(length) {
    return map(new Array(length), () => 'c').join('');
}

describe('ResizingCard mixin', function() {
    let view;
    let superUpdate;

    class MyCardView extends CardView {}
    MyCardView.prototype.update = superUpdate = jasmine.createSpy('MyCardView.prototype.update()');
    MyCardView.mixin(ResizingCard);

    beforeEach(function() {
        view = new MyCardView();
    });

    describe('methods:', function() {
        describe('update(data)', function() {
            let data;

            beforeEach(function() {
                superUpdate.calls.reset();
                spyOn(view, 'addClass');
            });

            describe('if the title + note <= 100', function() {
                beforeEach(function() {
                    [[10, 40], [20, 50], [50, 50]].forEach(([titleLength, noteLength]) => {
                        data = {
                            title: makeString(titleLength),
                            note: makeString(noteLength)
                        };

                        Runner.run(() => view.update(data));
                    });
                });

                it('should call $super()', function() {
                    expect(superUpdate).toHaveBeenCalledWith(data);
                });

                it('should add the "text--low" class', function() {
                    expect(view.addClass.calls.count()).toBe(3);
                    view.addClass.calls.all().forEach(call => expect(call.args).toEqual(['text--low']));
                });
            });

            describe('if the title + note is between 101 and 200', function() {
                beforeEach(function() {
                    [[1, 100], [20, 150], [100, 100]].forEach(([titleLength, noteLength]) => {
                        data = {
                            title: makeString(titleLength),
                            note: makeString(noteLength)
                        };

                        Runner.run(() => view.update(data));
                    });
                });

                it('should call $super()', function() {
                    expect(superUpdate).toHaveBeenCalledWith(data);
                });

                it('should add the "text--med" class', function() {
                    expect(view.addClass.calls.count()).toBe(3);
                    view.addClass.calls.all().forEach(call => expect(call.args).toEqual(['text--med']));
                });
            });

            describe('if the title + note is greater than 200', function() {
                beforeEach(function() {
                    [[1, 200], [200, 150], [100, 300]].forEach(([titleLength, noteLength]) => {
                        data = {
                            title: makeString(titleLength),
                            note: makeString(noteLength)
                        };

                        Runner.run(() => view.update(data));
                    });
                });

                it('should call $super()', function() {
                    expect(superUpdate).toHaveBeenCalledWith(data);
                });

                it('should add the "text--high" class', function() {
                    expect(view.addClass.calls.count()).toBe(3);
                    view.addClass.calls.all().forEach(call => expect(call.args).toEqual(['text--high']));
                });
            });

            describe('if called without a title or note', function() {
                beforeEach(function() {
                    Runner.run(() => view.update({}));
                });

                it('should call $super()', function() {
                    expect(superUpdate).toHaveBeenCalledWith({});
                });

                it('should not add any classes', function() {
                    expect(view.addClass).not.toHaveBeenCalled();
                });
            });
        });
    });
});
