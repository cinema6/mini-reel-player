import typeify from '../../../src/fns/typeify.js';

describe('typeify(value)', function() {
    it('should return the passed value if given a non-string primitive', function() {
        expect(typeify(true)).toBe(true);
        expect(typeify(false)).toBe(false);
        expect(typeify(33)).toBe(33);
        expect(typeify(null)).toBe(null);
        expect(typeify(undefined)).toBe(undefined);
    });

    it('should return Strings that do not represent another data type', function() {
        expect(typeify('hey')).toBe('hey');
        expect(typeify('trues')).toBe('trues');
        expect(typeify('falsed')).toBe('falsed');
        expect(typeify('.33')).toBe('.33');
        expect(typeify('2.')).toBe('2.');
        expect(typeify('Cool Beans!')).toBe('Cool Beans!');
    });

    it('should convert to Booleans', function() {
        expect(typeify('true')).toBe(true);
        expect(typeify('TRUE')).toBe(true);
        expect(typeify('false')).toBe(false);
        expect(typeify('FALSE')).toBe(false);
    });

    it('should convert to null', function() {
        expect(typeify('null')).toBe(null);
        expect(typeify('NULL')).toBe(null);
    });

    it('should convert to undefined', function() {
        expect(typeify('undefined')).toBe(undefined);
        expect(typeify('UNDEFINED')).toBe(undefined);
    });

    it('should convert to Numbers', function() {
        expect(typeify('0')).toBe(0);
        expect(typeify('9')).toBe(9);
        expect(typeify('6433')).toBe(6433);
        expect(typeify('0.2')).toBe(0.2);
        expect(typeify('12.96')).toBe(12.96);
    });

    it('should recursively convert the values of Arrays', function() {
        expect(typeify(['foo', 1, '12.3', 'false', 'undefined'])).toEqual(['foo', 1, 12.3, false, undefined]);
    });

    it('should recursively convert the values of Objects', function() {
        expect(typeify({
            foo: 'hey',
            num: '44',
            bool: 'false',
            arr: ['null']
        })).toEqual({
            foo: 'hey',
            num: 44,
            bool: false,
            arr: [null]
        });
    });
});
