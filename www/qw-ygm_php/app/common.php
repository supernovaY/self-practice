<?php
// 应用公共文件
/**
 * PHP发送Json对象数据
 *
 * @param $url 请求url
 * @param $jsonStr 发送的json字符串
 * @return array
 */
function http_post_json($url, $jsonStr)
{
    $ch = curl_init();

    curl_setopt($ch, CURLOPT_POST, 1);//启用时会发送一个常规的POST请求
    curl_setopt($ch, CURLOPT_URL, $url);//需要获取的URL地址
    curl_setopt($ch, CURLOPT_POSTFIELDS, $jsonStr);//传递一个作为HTTP “POST”操作的所有数据的字符串。
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);////设定是否显示头信息
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, 0);//https请求
    curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 0);

    curl_setopt($ch, CURLOPT_HTTPHEADER, array(
            'Content-Type: application/json; charset=utf-8',
            'Content-Length: ' . strlen($jsonStr)
        )
    );
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);//最后一个收到的HTTP代码

    curl_close($ch);

    return array($httpCode, $response);
}
