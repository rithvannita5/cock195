const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname)));

// ចំណាំ៖ ត្រូវប្តូរ target នេះទៅជា Link ពិតរបស់គេហទំព័រដែលអ្នកចង់ទាញ Stream
app.use('/proxy-stream', createProxyMiddleware({
  target: 'https://ដាក់_Link_Stream_ពិតប្រាកដរបស់អ្នកនៅទីនេះ', 
  changeOrigin: true,
  pathRewrite: {
    '^/proxy-stream': '', 
  },
  onProxyRes: function (proxyRes, req, res) {
    proxyRes.headers['Access-Control-Allow-Origin'] = '*';
  }
}));

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
