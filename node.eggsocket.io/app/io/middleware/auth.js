'use strict';

const PREFIX = 'channel';

module.exports = () => {
  return async (ctx, next) => {
    const { app, socket, logger, helper } = ctx;
    const id = socket.id;
    const nsp = app.io.of('/');
    const query = socket.handshake.query;

    // 用户信息
    const { channel, orderid } = query;
    const channels = [ channel ];

    logger.debug('#order_info', id, channel, orderid);

    const tick = (id, msg) => {
      logger.debug('#tick', id, msg);

      // 踢出用户前发送消息
      socket.emit(id, helper.parseMsg('deny', msg));

      // 调用 adapter 方法踢出用户，客户端触发 disconnect 事件
      nsp.adapter.remoteDisconnect(id, true, err => {
        logger.error(err);
      });
    };

    // 检查房间是否存在，不存在则踢出用户
    // 备注：此处 app.redis 与插件无关，可用其他存储代替
    const hasChannel = await app.redis.get(`${PREFIX}:${channel}`);

    logger.debug('#has_exist', hasChannel);

    if (!hasChannel) {
      tick(id, {
        type: 'deleted',
        message: 'deleted, channel has been deleted.',
      });
      return;
    }

    // 用户加入
    logger.debug('#join', channel);
    socket.join(channel);

    // 在线列表
    nsp.adapter.clients(channels, (err, clients) => {
      logger.debug('#online_join', clients);

      // 更新在线用户列表
      nsp.to(channel).emit('online', {
        clients,
        // action: 'connect',
        // target: 'participator',
        message: `Client (${id}) connent.`,
      });
    });

    await next();

    // 用户离开
    logger.debug('#leave', channel);

    // 在线列表
    nsp.adapter.clients(channels, (err, clients) => {
      logger.debug('#online_leave', clients);

      // 获取 client 信息
      // const clientsDetail = {};
      // clients.forEach(client => {
      //   const _client = app.io.sockets.sockets[client];
      //   const _query = _client.handshake.query;
      //   clientsDetail[client] = _query;
      // });

      // 更新在线用户列表
      nsp.to(channel).emit('online', {
        clients,
        action: 'leave',
        target: 'participator',
        message: `User(${id}) leaved.`,
      });
    });

  };
};
