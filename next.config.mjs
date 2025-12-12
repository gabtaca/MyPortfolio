/** @type {import('next').NextConfig} */
const nextConfig = {
  sassOptions: {
    includePaths: ['./src/styles', './src/styles/partials'],
    webpack: (config, { dev, isServer }) => {
      // Iterate through all module rules
      config.module.rules.forEach((rule) => {
        // Check if the rule has 'oneOf'
        if (rule.oneOf) {
          rule.oneOf.forEach((oneOf) => {
            // Check if the rule uses 'sass-loader'
            if (
              oneOf.use &&
              Array.isArray(oneOf.use) &&
              oneOf.use.some((useItem) => useItem.loader && useItem.loader.includes('sass-loader'))
            ) {
              // Modify the sass-loader options
              oneOf.use.forEach((useItem) => {
                if (useItem.loader && useItem.loader.includes('sass-loader')) {
                  // Ensure options exist
                  useItem.options = useItem.options || {};
                  useItem.options.sassOptions = useItem.options.sassOptions || {};
                  // Add the silenceDeprecations option
                  useItem.options.sassOptions.silenceDeprecations = ['legacy-js-api'];
                }
              });
            }
          });
        }
      });
  
      return config;
    }
  },
};

export default nextConfig;