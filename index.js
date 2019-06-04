const Koa = require('koa');
const koaBody = require('koa-body');
const koaStatic = require('koa-static');
const Router = require('koa-router');
const fs = require('fs');
const multer = require('koa-multer');
const path = require('path');
const DB = require('./db');

var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './static/uploads/');
    },
    filename: function(req, file, cb) {
        cb(
            null,
            file.fieldname + '-' + Date.now() + path.extname(file.originalname)
        );
    }
});

var upload = multer({ storage: storage });

const app = new Koa();

// 托管静态文件
app.use(koaStatic('static'));
app.use(
    koaBody({
        multipart: true
    })
);

const router = new Router();

router
    .get('/login', ctx => {
        ctx.type = 'text/html';
        ctx.body = fs.readFileSync('./static/html/login.html');
    })
    .post('/login', async ctx => {
        var { username, password } = ctx.request.body;
        // if (username == 'guoguo' && password == '1234') {
        //   ctx.body = { code: 200, message: '登录成功' };
        // } else {
        //   ctx.body = { code: -1, message: '用户名或密码错误' };
        // }
        var ret = await DB('users')
            .where({
                username,
                password
            })
            .select('id');

        if (ret && ret.length > 0) {
            ctx.body = { code: 200, message: '登录成功', user: { name: username } };
        } else {
            ctx.body = { code: -1, message: '用户名或密码错误' };
        }
    })
    .get('/register', ctx => {
        ctx.type = 'text/html';
        ctx.body = fs.readFileSync('./static/html/register.html');
    })
    .post('/register', async ctx => {
        var { username, password, repasswd } = ctx.request.body;
        // console.log(username, password, repasswd);
        if (password !== repasswd) {
            ctx.body = { code: -2, message: '两次密码不一致' };
            return;
        }
        var ret = await DB('users')
            .where({ username })
            .select('id');

        if (ret && ret.length > 0) {
            ctx.body = { code: -3, message: '用户名已注册' };
            return;
        }

        ret = await DB('users').insert({ username, password });
        // console.log(ret);
        if (ret && ret.length > 0) {
            ctx.body = { code: 200, message: '注册成功' };
        } else {
            ctx.body = { code: 0, message: '网络异常' };
        }
    })
    .get('/', ctx => {
        ctx.type = 'text/html';
        ctx.body = fs.readFileSync('./static/html/index.html');
    })
    .get('/enterprise', ctx => {
        ctx.type = 'text/html';
        ctx.body = fs.readFileSync('./static/html/enterprise.html');
    })
    .get('/cart', ctx => {
        ctx.type = 'text/html';
        ctx.body = fs.readFileSync('./static/html/cart.html');
    })
    .post('/upload', upload.single('file'), ctx => {
        // 做响应
        let filePath = ctx.req.file.path;
        let fileName = path.basename(filePath);
        // console.log(ctx.req.file);
        // console.log(fileName);
        ctx.body = { src: `/uploads/${fileName}` };
    })
    .get('/upload', ctx => {
        ctx.type = 'text/html';
        ctx.body = fs.readFileSync('./static/html/upload.html');
    });

app.use(router.routes()).use(router.allowedMethods());

app.listen(8080, 'localhost', () => {
    console.log('Server Started.');
});