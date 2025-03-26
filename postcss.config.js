module.exports = {
    plugins: {
      'postcss-flexbugs-fixes': {},
      'postcss-preset-env': {
        autoprefixer: {
          flexbox: 'no-2009',
        },
        stage: 3,
      },
      // Ajoutez d'autres plugins si nécessaire
    },
  };