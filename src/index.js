const express = require('express'),
  {createProxyMiddleware, Filter, Options, RequestHandler} = require('http-proxy-middleware'),
  compression = require('compression'),
  app = express(),
  bodyParser = require('body-parser'),
  fs = require('fs'),
  path = require('path'),
  morgan = require('morgan'),
  FileStreamRotator = require('file-stream-rotator')

app.all('*', function (req, res, next) {
  // res.header('Access-Control-Allow-Origin', req.headers.origin)
  // res.header('Access-Control-Allow-Origin', "*")
  //Access-Control-Allow-Headers ,可根据浏览器的F12查看,把对应的粘贴在这里就行
  // res.header('Access-Control-Allow-Headers', 'tk,Content-Type,ost,apv,apt,authorization,x-requested-with,Content-Type')
  // res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTION')
  // res.header('Access-Control-Allow-Credentials', 'true')
  // res.header('Content-Type', 'application/json;charset=utf-8')
  next()
})
// 缓存一个月
app.use(express.static('../static', {maxAge: 259200}))
app.use(compression())

//设置日志文件目录
const logDirectory = path.resolve(__dirname, '../logs')
//确保日志文件目录存在 没有则创建
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory)
//创建一个写路由
const accessLogStream = FileStreamRotator.getStream({
  filename: logDirectory + '/accss-%DATE%.log',
  frequency: 'daily',
  verbose: false
})

const logFormat = `:method :url :req[tk] :http-version :referrer :remote-addr :remote-user :user-agent :status :response-time ms - :res[content-length] :date[iso] \n\r\n\r`

morgan.format('dev_log', logFormat)
app.use(morgan('dev_log'))
app.use(morgan('dev_log', {stream: accessLogStream}))//写入日志文件

app.get('/', (req, res) => {
  res.json({text: 'Hello ,I am node proxy',time:new Date(), ...req.query})
})


app.use('/product_api', createProxyMiddleware({
  'target': 'https://apis.myvsoncloud.com',
  changeOrigin: true, // needed for virtual hosted sites
  ws: true, // proxy websockets
  pathRewrite: {
    '^/product_api': ''
  },
  router: {},
}))
app.use('/develop_api', createProxyMiddleware({
  'target': 'https://ts.vson.com.cn:26082', // target host
  changeOrigin: true, // needed for virtual hosted sites
  ws: true, // proxy websockets
  pathRewrite: {
    '^/develop_api': ''
  },
  router: {},
}))

app.use('/node_api', createProxyMiddleware({
  'target': 'http://0.0.0.0:9088',
  'pathRewrite': {
    '^/node_api': ''
  },
  changeOrigin: true, // needed for virtual hosted sites
  ws: true, // proxy websockets
  router: {},
}))

app.use('/cc_passport', createProxyMiddleware({
  'target': 'https://beta.passport.coocaa.com',
  'pathRewrite': {
    '^/cc_passport': ''
  },
  changeOrigin: true, // needed for virtual hosted sites
  ws: true, // proxy websockets
  router: {},
}))

app.use('/cc_wx', createProxyMiddleware({
  'target': 'https://beta-wx.coocaa.com',
  'pathRewrite': {
    '^/cc_wx': ''
  },
  changeOrigin: true, // needed for virtual hosted sites
  ws: true, // proxy websockets
  router: {},
}))

//设置允许跨域访问该服务.
const server = app.listen(9080, '0.0.0.0', () => {
  const host = server.address().address
  const port = server.address().port
  console.log('express实例，访问地址为 http://%s:%s', host, port)
})



