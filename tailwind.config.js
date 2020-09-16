module.exports = {
  future: {
    removeDeprecatedGapUtilities: true,
    purgeLayersByDefault: true,
  },
  purge: {
    mode: 'layers',
    layers: ['utilities'],
    content: ['./src/index.html', './src/**/*.tsx'],
  },
  theme: {
    extend: {},
  },
  variants: {},
  plugins: [],
};
