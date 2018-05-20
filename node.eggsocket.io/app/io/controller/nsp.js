'use strict';

const Controller = require('egg').Controller;


class NspController extends Controller {
    /**
     * 手动发送消息的方式
     *
     * socket.emit('exchange', {  target: 'TZi0F49j1QxjfNewAAAA',  msg: '00000'});
     * @returns {Promise<void>}
     */
    async exchange() {
        const {ctx, app} = this;
        // socket 切入点 识别
        const nsp = app.io.of('/');
        const message = ctx.args[0] || {};
        const socket = ctx.socket;
        const client = socket.id;

        try {
            const {target, msg} = message;
            if (!target) return;
            app.logger.info(message);
            // const msg = ctx.helper.parseMsg('exchange', payload, {client, target});
            nsp.emit(target, msg);
        } catch (error) {
            app.logger.debug(error);
        }
    }

    /**
     * 建行支付成功通知
     * socket.emit('ccbcallback', {  orderid: 'TZi0F49j1QxjfNewAAAA',  msg: '00000'});
     * @returns {Promise<void>}
     */
    async ccbcallback() {
        const {ctx, app} = this;
        const nsp = app.io.of('/ccbcallback');

        try {
            // 通过socket emit 传递的参数 （可以是客户端也可以是服务端）
            const message = ctx.args[0] || {};
            const {orderid, msg} = message;
            if (!orderid) return;
            app.logger.info(message);
            nsp.emit(orderid, msg);
        } catch (error) {
            app.logger.debug(error);
        }
    }
}

module.exports = NspController;
