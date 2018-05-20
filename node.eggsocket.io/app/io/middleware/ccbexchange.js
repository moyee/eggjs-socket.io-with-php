'use strict';

const PREFIX = 'channel';

module.exports = () => {
    return async (ctx, next) => {
        const { app, socket, logger, helper } = ctx;
        const id = socket.id;
        const nsp = app.io.of('/ccbcallback');
        const query = socket.handshake.query;

        // 订单信息
        const { channel, orderid } = query;
        const channels = [ channel ];

        logger.debug('#order_info', id, channel, orderid);

        const tick = (id, msg) => {
            logger.debug('#tick', id, msg);

            // 踢出用户前发送消息
            socket.emit(id, helper.parseMsg('deny', msg));

            // 调用 adapter 断开客户端连接，客户端触发 disconnect 事件
            nsp.adapter.remoteDisconnect(id, true, err => {
                logger.error(err);
            });
        };

        // 检查chanel否存在，不存在则断开
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

        // 新客户端连接
        logger.debug('#join', channel);
        socket.join(channel);

        // 在线列表
        nsp.adapter.clients(channels, (err, clients) => {
            logger.debug('#online_join', clients);
            // 更新在线客户端列表
            nsp.to(channel).emit('online', {
                clients,
                // action: 'connect',
                // target: 'participator',
                message: `Client (${id}) connent.`,
            });
        });

        await next();

        // 客户端断开
        logger.debug('#leave', channel);

        // 更新客户端列表
        nsp.adapter.clients(channels, (err, clients) => {
            logger.debug('#online_leave', clients);
            nsp.to(channel).emit('online', {
                clients,
                action: 'leave',
                target: 'participator',
                message: `Client (${id}) leaved.`,
            });
        });

    };
};
