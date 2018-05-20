'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller, io } = app;
  router.get('/', controller.home.index);
  router.get('/ccbcallback', controller.home.ccbdemo);

  // socket.io
  io.of('/').route('exchange', io.controller.nsp.exchange);
  io.of('/ccbcallback').route('ccbcallback', io.controller.nsp.ccbcallback);
};
