'use strict';

module.exports = app => {
    app.beforeStart(async () => {

        //做一些初始化的事情

        const channel = 'channel:payment_callback';
        const hasChannel = await app.redis.get(channel);
        if (!hasChannel) {
            const channelFlag = 'ccb';
            await app.redis.set(channel, channelFlag);
        }
    });
};
