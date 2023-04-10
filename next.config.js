const NextFederationPlugin = require('@module-federation/nextjs-mf');
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});
const deps = require('./package.json').dependencies;

module.exports = withBundleAnalyzer({
  images: {
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    formats: ['image/webp'],
    domains: ['services.electrolux-medialibrary.com'],
  },
  experimental: {
    images: {
      allowFutureImage: true,
      domains: ['https://services.electrolux-medialibrary.com'],
    },
  },
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
    dirs: ['pages', 'components', 'services'],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // optimization: {
  //   splitChunks: false,
  // },

  webpack(config, options) {
    const { isServer, dev } = options;
    const location = isServer ? 'ssr' : 'chunks';

    config.plugins.push(
      new NextFederationPlugin({
        name: 'BASKET',
        filename: 'static/chunks/remoteEntry.js',
        exposes: {
          './Basket': './components/Basket',
        },
        remotes: {
          SHELL: `SHELL@${process.env.APP_SHELL_URL}/_next/static/${location}/remoteEntry.js`,
        },
        extraOptions: {
          exposePages: true,
        },
        shared: {},
      })
    );
    config.devServer = {
      devMiddleware: {
        writeToDisk: true,
      },

    }

    return config;
  },
});
