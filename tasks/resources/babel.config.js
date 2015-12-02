module.exports = {
    plugins: [
        // ES 2015
        'check-es2015-constants',
        'transform-es2015-arrow-functions',
        'transform-es2015-block-scoped-functions',
        'transform-es2015-block-scoping',
        ['transform-es2015-classes', { loose: true }],
        ['transform-es2015-computed-properties', { loose: true }],
        ['transform-es2015-destructuring', { loose: true }],
        ['transform-es2015-for-of', { loose: true }],
        'transform-es2015-function-name',
        'transform-es2015-literals',
        ['transform-es2015-modules-commonjs', { loose: true }],
        'transform-es2015-object-super',
        'transform-es2015-parameters',
        'transform-es2015-shorthand-properties',
        'transform-es2015-spread',
        'transform-es2015-sticky-regex',
        ['transform-es2015-template-literals', { loose: true }],
        'transform-es2015-unicode-regex',

        // External helpers to remove duplicate code
        'external-helpers-2',
        // IE compatibility
        'transform-proto-to-assign'
    ],
    sourceMaps: true
};
