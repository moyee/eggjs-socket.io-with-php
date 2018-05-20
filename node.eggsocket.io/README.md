# payment-callback-socket.io server

用于支付回调作前端通知用

## 场景说明 
- pc端支付系统 + 手机端（微信、支付宝扫码支付）
- 第三方支付异步通知商户，但客户端是无法知道此通知的，因此需要进行服务端推送
- 服务端进行回调信息验证，验证通过后，由 socket.io 推送至前端支付结果响应

## socket.io 场景示例
- app view/home.html

## docker 启动说明
```
docker-compose -f docker-compose.local.yml up -d
docker-compose -f docker-compose.local.yml down 
```
## 文档

<!-- add docs here for user -->

see [egg docs][egg] for more detail.

### Development

```bash
$ npm i
$ npm run dev
$ open http://localhost:7001/
```

**Start/Stop Database**
```bash
docker-compose -f docker-compose.dev.yml up -d
docker-compose -f docker-compose.dev.yml down
```

### Deploy

```bash
$ npm start
$ npm stop
```

### npm scripts

- Use `npm run lint` to check code style.
- Use `npm test` to run unit test.
- Use `npm run autod` to auto detect dependencies upgrade, see [autod](https://www.npmjs.com/package/autod) for more detail.



