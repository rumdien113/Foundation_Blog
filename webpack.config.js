const path = require('path');

module.exports = {
  entry: './app/javascript/packs/application.js', // Điểm bắt đầu của ứng dụng React
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'public/packs'), // Đường dẫn đến thư mục tạo file đầu ra
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader', // Sử dụng Babel Loader để xử lý JavaScript và JSX
        },
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx'], // Cho phép import các file với phần mở rộng .js và .jsx mà không cần định rõ phần mở rộng
  },
};
