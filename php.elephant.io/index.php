<?php
/**
 * Created by PhpStorm.
 * User: Chlu
 * Date: 2018/5/14
 * Time: 14:36
 */

error_reporting(E_ERROR);


use ElephantIO\Client;
use ElephantIO\Engine\SocketIO\Version2X;

require __DIR__ . '/vendor/autoload.php';

$client = new Client(new Version2X('https://wss.vsochina.com', [
    'headers' => [
        'X-My-Header: websocket rocks',
        'Authorization: Bearer 12b3c4d5e6f7g8h9i'
    ],
    'channel' => 'payment_callback'
]));
$client->initialize();
$client->of('/ccbcallback');

$i=0;
while (true && $client) {
//    $result = $client->emit('exchange', ['target' => 'demo', 'msg' => 'from PHP Client At ' . date("Y-m-d H:i:s")]);
    //指定空间
    $result = $client->emit('ccbcallback', ['orderid' => 'ccb', 'msg' => 'from PHP Client At ' . date("Y-m-d H:i:s")]);
    print_r($i);
    echo "\r\n";
    if($i % 100 == 0) {
        sleep(3);
    }
    $i++;
}
$client->close();