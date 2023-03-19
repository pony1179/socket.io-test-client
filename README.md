## socket.io-test-client 模拟浏览器客户端运行
### 此项目与 socket.io-test-server 配套运行
### 1. 项目启动
#### node start.js 会在三个端口 4001， 4002，4003 分别启动三个服务

### 2. 通过 postman 访问本服务，模拟浏览器页面中的点按行为，触发 socket 通信，浏览器向服务器发送消息
### 3. 访问方式： 
###             POST http://127.0.0.1:4001/message 
###             POST http://127.0.0.1:4002/message 
###             POST http://127.0.0.1:4003/message 

