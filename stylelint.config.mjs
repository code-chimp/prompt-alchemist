/** @type {import("stylelint").Config} */
export default {
  extends: ['stylelint-config-standard', 'stylelint-config-tailwindcss'],
  rules: {
    'at-rule-no-unknown': [
      true,
      {
        ignoreAtRules: [
          'apply',
          'custom-variant',
          'layer',
          'plugin',
          'reference',
          'responsive',
          'screen',
          'tailwind',
          'theme',
          'variants',
        ],
      },
    ],
    'at-rule-no-deprecated': [true, { ignoreAtRules: ['apply'] }],
    'block-no-empty': null,
    'selector-pseudo-class-no-unknown': [true, { ignorePseudoClasses: ['global'] }],
    'declaration-no-important': null,
    'selector-class-pattern': null,
    'property-no-vendor-prefix': null,
    'hue-degree-notation': null,
    'lightness-notation': null,
    // Tailwind CSS v4 allows @import after other at-rules like @plugin
    'no-invalid-position-at-import-rule': null,
  },
};
