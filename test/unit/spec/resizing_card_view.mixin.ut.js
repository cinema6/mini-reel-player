import CardView from '../../../src/views/CardView.js';
import ResizingCardView from '../../../src/mixins/ResizingCardView.js';
import Runner from '../../../lib/Runner.js';
import {
    map
} from '../../../lib/utils.js';

function makeString(length) {
    if (!length) { return null; }

    return map(new Array(length), () => 'c').join('');
}

describe('ResizingCardView mixin', function() {
    let view;
    let superUpdate;

    class MyCardView extends CardView {}
    MyCardView.prototype.update = superUpdate = jasmine.createSpy('MyCardView.prototype.update()');
    MyCardView.mixin(ResizingCardView);

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

            describe('if there is no title or note', function() {
                beforeEach(function() {
                    data = {};

                    Runner.run(() => view.update(data));
                });

                it('should call $super()', function() {
                    expect(superUpdate).toHaveBeenCalledWith(data);
                });

                it('should not add any classes', function() {
                    expect(view.addClass).not.toHaveBeenCalled();
                });
            });

            describe('if the title + note <= 100', function() {
                beforeEach(function() {
                    [[10, 40], [20, 50], [50, 50], [40, null]].forEach(([titleLength, noteLength]) => {
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
                    const calls = view.addClass.calls.all().filter(({ args }) => /^text/.test(args[0]));
                    expect(calls.length).toBe(4);
                    calls.forEach(call => expect(call.args).toEqual(['text--low']));
                });
            });

            describe('if the title + note is between 101 and 200', function() {
                beforeEach(function() {
                    [[1, 100], [20, 150], [100, 100], [null, 150]].forEach(([titleLength, noteLength]) => {
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
                    const calls = view.addClass.calls.all().filter(({ args }) => /^text/.test(args[0]));
                    expect(calls.length).toBe(4);
                    calls.forEach(call => expect(call.args).toEqual(['text--med']));
                });
            });

            describe('if the title + note is greater than 200', function() {
                beforeEach(function() {
                    [[1, 200], [200, 150], [100, 300], [null, 500]].forEach(([titleLength, noteLength]) => {
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
                    const calls = view.addClass.calls.all().filter(({ args }) => /^text/.test(args[0]));
                    expect(calls.length).toBe(4);
                    calls.forEach(call => expect(call.args).toEqual(['text--high']));
                });
            });

            describe('if the title + note is less than 195 characters', function() {
                beforeEach(function() {
                    [[1, 194], [50, 50], [30, 140], [60, null]].forEach(([titleLength, noteLength]) => {
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

                it('should add the "copy--base" class', function() {
                    const calls = view.addClass.calls.all().filter(({ args }) => /^copy/.test(args[0]));
                    expect(calls.length).toBe(4);
                    calls.forEach(call => expect(call.args).toEqual(['copy--base']));
                });
            });

            describe('if the title + note is between 196 and 295', function() {
                beforeEach(function() {
                    [[1, 195], [100, 195], [70, 205], [200, null]].forEach(([titleLength, noteLength]) => {
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

                it('should add the "copy--low" class', function() {
                    const calls = view.addClass.calls.all().filter(({ args }) => /^copy/.test(args[0]));
                    expect(calls.length).toBe(4);
                    calls.forEach(call => expect(call.args).toEqual(['copy--low']));
                });
            });

            describe('if the title + note is between 296 and 395', function() {
                beforeEach(function() {
                    [[1, 295], [150, 245], [70, 305], [300, null]].forEach(([titleLength, noteLength]) => {
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

                it('should add the "copy--med" class', function() {
                    const calls = view.addClass.calls.all().filter(({ args }) => /^copy/.test(args[0]));
                    expect(calls.length).toBe(4);
                    calls.forEach(call => expect(call.args).toEqual(['copy--med']));
                });
            });

            describe('if the title + note is over 395', function() {
                beforeEach(function() {
                    [[1, 395], [200, 295], [170, 405], [400, null]].forEach(([titleLength, noteLength]) => {
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

                it('should add the "copy--high" class', function() {
                    const calls = view.addClass.calls.all().filter(({ args }) => /^copy/.test(args[0]));
                    expect(calls.length).toBe(4);
                    calls.forEach(call => expect(call.args).toEqual(['copy--high']));
                });
            });
        });
    });
});
