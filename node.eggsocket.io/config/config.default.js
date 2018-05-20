'use strict';

module.exports = appInfo => {
    const config  = exports = {};
    exports.cluster = {
        listen: {
            port: 7001,
            hostname: 'localhost',
            // path: '/var/run/egg.sock',
        }
    }

    // use for cookie sign key, should change to your own and keep security
    config.keys = appInfo.name + '_1523266936854_6353';

    // add your config here
    config.middleware = [];

    config.view = {
        defaultViewEngine: 'nunjucks',
        mapping: {
            '.html': 'nunjucks',
        },
    };

    config.redis = {
        client: {
            port: 6379,
            host: '192.168.1.102', // your redis server host
            password: '',
            db: 0,
        },
    };

    // 一个业务使用一个命名空间
    config.io = {
        init: {
            wsEngine: 'uws',//ws 不建议使用，已知在某些chrom版本下不稳定
        }, // passed to engine.io
        namespace: {
            '/': {
                connectionMiddleware: ['auth',],
                packetMiddleware: [],
            },
            '/ccbcallback': {
                connectionMiddleware: ['ccbexchange',],
                packetMiddleware: [],
            },
        },

        redis: {
            host: '192.168.1.102',
            port: 6379,
            auth_pass: '',
            db: 0
        },
    };

    return config;
};
