import SafelyGettable from '../../../src/mixins/SafelyGettable.js';
import Mixable from '../../../lib/core/Mixable.js';

class TestClass extends Mixable {
    constructor() {
        super(...arguments);

        this.foo = {
            bar: 'hello',
            nums: [1, 2, 3, 5, 8, 13]
        };
        this.props = { hello: { world: 42 } };
    }
}
TestClass.mixin(SafelyGettable);

describe('SafelyGettable mixin', function() {
    let object;

    beforeEach(function() {
        object = new TestClass();
    });

    describe('methods:', function() {
        describe('get(prop)', function() {
            it('should get the property by name', function() {
                expect(object.get('props')).toBe(object.props);
            });

            it('should get properties serperated by dot notation', function() {
                expect(object.get('props.hello.world')).toBe(object.props.hello.world);
            });

            it('should get properties in array notation', function() {
                expect(object.get('foo.nums[3]')).toBe(object.foo.nums[3]);
            });

            it('should return undefined instead of throwing TypeErrors', function() {
                expect(object.get('foo.nums[4].foo.bar.name')).toBeUndefined();
            });

            it('should return itself if no prop is provided', function() {
                expect(object.get(null)).toBe(object);
                expect(object.get()).toBe(object);
                expect(object.get('')).toBe(object);
            });
        });
    });
});
