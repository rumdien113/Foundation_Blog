const { environment } = require('@rails/webpacker');
const tailwindcss = require('tailwindcss');
const autoprefixer = require('autoprefixer');

// Thêm plugin Tailwind CSS vào environment
environment.loaders.append('style', {
  test: /\.css$/,
  use: [
    { loader: 'style-loader' },
    { loader: 'css-loader' },
    {
      loader: 'postcss-loader',
      options: {
        postcssOptions: {
          plugins: [tailwindcss, autoprefixer],
        },
      },
    },
  ],
});

// Thêm Babel Loader để xử lý tệp JavaScript và JSX
const babelLoader = environment.loaders.get('babel');
if (!babelLoader) {
  throw new Error('Babel loader not found');
}

babelLoader.exclude = [/node_modules[\\/]webpacker/];

environment.loaders.prepend('jsx', {
  test: /\.(js|jsx)$/,
  use: [
    { loader: 'babel-loader' }
  ],
  include: [/app/],
});

module.exports = environment;
