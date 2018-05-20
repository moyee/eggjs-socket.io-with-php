'use strict';

const Controller = require('egg').Controller;

/**
 * 需要前端展示的时候使用，
 * 不是必须的
 * 但测试很有用
 * 注意打开debug工具查看Console
 *
 */
class HomeController extends Controller {
    async index() {
        await this.ctx.render('home');
    }
    async ccbdemo() {
        await this.ctx.render('ccb');
    }
}

module.exports = HomeController;
