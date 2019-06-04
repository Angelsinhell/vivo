const Koa = require('koa');
const KoaBody = require('koa-body');
const KoaStatic = require('koa-static');
const Router = require('koa-router');
const fs = require('fs');
const multer = require('koa-multer');

// const upload = multer({
//     dest: './static/html/cart'
// });
const app = new Koa();

//托管静态文件
app.use(KoaStatic('static'))
app.use(KoaBody());

const router = new Router();

router
    .get('/login', ctx => {
        ctx.type = 'text/html';
        ctx.body = fs.readFileSync('./static/html/login.html');
    })
    .post('/login', ctx => {
        var { username, password } = ctx.request.body;
        if (username == 'guoguo' && password == '1234') {
            ctx.body = { code: 200, message: '登录成功' };
        } else {
            ctx.body = { code: -1, message: '用户名或密码错误' };
        }
    })
router
    .get('/login', ctx => {
        ctx.type = 'text/html';
        ctx.body = fs.readFileSync('./static/html/login.html');
    })
    .post('/login', ctx => {
        var { username, password } = ctx.request.body;
        if (username == 'guoguo' && password == '1234') {
            ctx.body = { code: 200, message: '登录成功' };
        } else {
            ctx.body = { code: -1, message: '用户名或密码错误' };
        }
    })
    .get('/cart', ctx => {
        ctx.type = 'text/html';
        ctx.body = fs.readFileSync('./static/html/cart.html');
    })
    .get('/enterprise', ctx => {
        ctx.type = 'text/html';
        ctx.body = fs.readFileSync('./static/html/enterprise.html');
    })
    .get('/eroll', ctx => {
        ctx.type = 'text/html';
        ctx.body = fs.readFileSync('./static/html/ecroll.html');
    })
    .post('/eroll', ctx => {})
    .get('/', ctx => {
        ctx.type = 'text/html';
        ctx.body = fs.readFileSync('./static/html/index.html');
    })
    .post('/upload', upload.single('file'));
app.use(router.routes()).use(router.allowedMethods());

app.listen(8080, 'localhost', () => {
    console.log('Server Started');
});