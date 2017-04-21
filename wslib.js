/**
 * Created by Administrator on 2017/4/20.
 */

var WS = function(param){
    /**
     * param{
     *      url: 'ws://host:port/path',
     *      onopen: function(evt),
     *      onmessage: function(evt),
     *      onerror: function(evt),
     *      onclose: function(evt),
     *      reconnect: true|false,
     *      reconnectTime: xxxms,
     *      debug: true | false
     * }
     */

    /**
     * method{
     *      void disconnect(), close
     *      boolean sendMsg(string msg), send msg to server
     *      enum getStatus(): connected disconnected
     * }
     *
     */

    var defaultParams = {
        reconnect : true,
        reconnectTime : 3000,
        debug : false
    };

    var orginWs = null;

    //属性合并
    this.params = WS.util.mixObj(defaultParams, param);

    function init(){
        orginWs = new WebSocket(this.params.url);
        orginWs.onopen = function(evt){
            if(this.params.debug){
                console.log("onopen: " + this.params.url + "; " + new Date());
            }
            if(this.params.onopen){
                this.params.onopen(evt);
            }
        };
        orginWs.onmessage = function(evt){
            if(this.params.debug){
                console.log("onmessage: " + evt.data + "; " + new Date());
            }
            if(this.params.onmessage){
                this.params.onmessage(evt.data);
            }
        };
        orginWs.onerror = function(evt){
            if(this.params.debug){
                console.log("onerror: " + evt + "; " + new Date());
            }
            if(this.params.onerror){
                this.params.onerror(evt);
            }
        };
        orginWs.onclose = function(evt){
            if(this.params.debug){
                var reason;
                alert(event.code);
                // See http://tools.ietf.org/html/rfc6455#section-7.4.1
                if (event.code == 1000)
                    reason = "Normal closure, meaning that the purpose for which the connection was established has been fulfilled.";
                else if(event.code == 1001)
                    reason = "An endpoint is \"going away\", such as a server going down or a browser having navigated away from a page.";
                else if(event.code == 1002)
                    reason = "An endpoint is terminating the connection due to a protocol error";
                else if(event.code == 1003)
                    reason = "An endpoint is terminating the connection because it has received a type of data it cannot accept (e.g., an endpoint that understands only text data MAY send this if it receives a binary message).";
                else if(event.code == 1004)
                    reason = "Reserved. The specific meaning might be defined in the future.";
                else if(event.code == 1005)
                    reason = "No status code was actually present.";
                else if(event.code == 1006)
                    reason = "The connection was closed abnormally, e.g., without sending or receiving a Close control frame";
                else if(event.code == 1007)
                    reason = "An endpoint is terminating the connection because it has received data within a message that was not consistent with the type of the message (e.g., non-UTF-8 [http://tools.ietf.org/html/rfc3629] data within a text message).";
                else if(event.code == 1008)
                    reason = "An endpoint is terminating the connection because it has received a message that \"violates its policy\". This reason is given either if there is no other sutible reason, or if there is a need to hide specific details about the policy.";
                else if(event.code == 1009)
                    reason = "An endpoint is terminating the connection because it has received a message that is too big for it to process.";
                else if(event.code == 1010) // Note that this status code is not used by the server, because it can fail the WebSocket handshake instead.
                    reason = "An endpoint (client) is terminating the connection because it has expected the server to negotiate one or more extension, but the server didn't return them in the response message of the WebSocket handshake.Specifically, the extensions that are needed are: " + evt.reason;
                else if(event.code == 1011)
                    reason = "A server is terminating the connection because it encountered an unexpected condition that prevented it from fulfilling the request.";
                else if(event.code == 1015)
                    reason = "The connection was closed due to a failure to perform a TLS handshake (e.g., the server certificate can't be verified).";
                else
                    reason = "Unknown reason";
                console.log("onclose: code is " + evt.code + ", reason is " + reason + "; " + new Date());
            }
            if(this.params.onclose){
                this.params.onclose(evt);
            }

            //handle reconnect situation
            orginWs.close();

            if(this.params.reconnect){
                //递归调用初始化方法
                setTimeout(init, this.params.reconnectTime);
            }
        };
    }


}

WS.util = {
   mixObj : function(source,dist){
       for(var key in dist){
           source[key] = dist[key];
       }
   }
}

var ws = new WebSocket("")