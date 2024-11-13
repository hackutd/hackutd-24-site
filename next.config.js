const runtimeCaching = require('next-pwa/cache');
const withFonts = require('next-fonts');

const withPWA = require('next-pwa')({
  dest: 'public',
  runtimeCaching,
  disable: !process.env.ENABLE_PWA && process.env.NODE_ENV === 'development',
});

(module.exports = withPWA({
  reactStrictMode: true,

  async redirects() {
    return [
      {
        source: '/travel-reimbursement',
        destination:
          'https://hackutd.notion.site/HackUTD-Ripple-Effect-fab1d9efcfd0468fbaee0ba4010caec7?pvs=4',
        permanent: true,
      },
      {
        source: '/devday-rsvp',
        destination: 'https://acmutd.typeform.com/to/q1FIwqqq',
        permanent: true,
      },
      {
        source: '/devday-schedule',
        destination:
          'https://docs.google.com/document/d/1bBuz6PGMjwtoCdb8miUZB0n3xR6Bi1teRjGOaHuFuIY/edit',
        permanent: true,
      },
      {
        source: '/discord',
        destination: 'https://discord.gg/5gYNSwEKc2',
        permanent: true,
      },
      {
        source: '/parking',
        destination: '/parking.pdf',
        permanent: true,
      },
    ];
  },

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
      },
    ],
  },

  // https://sebhastian.com/javascript-unexpected-token-export/
  // https://nextjs.org/docs/app/api-reference/next-config-js/transpilePackages
  transpilePackages: ['@ant-design/icons-svg', 'rc-util'],

  webpack(config, options) {
    config.module.rules.push({
      test: /\.md$/,
      use: 'raw-loader',
    });

    // For loading svg as React component
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });

    return config;
  },
})),
  withFonts({
    enableSvg: true,
    webpack(config, options) {
      return config;
    },
  });
