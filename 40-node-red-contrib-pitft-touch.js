/**
 * Copyright 2014 Boris Adryan
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 **/

module.exports = function(RED) {
  "use strict";
   
    function parse(buffer) {
      if (
( (buffer.readUInt16LE(10) == 0 || buffer.readUInt16LE(10) == 1) && buffer.readUInt16LE(8) == 3) ||
  (buffer.readUInt16LE(10) == 330 && buffer.readUInt16LE(8) == 1 && buffer.readUInt32LE(12) == 0) ){
       return {
         //sec : buffer.readUInt32LE(0),
         //usec: buffer.readUInt32LE(4),
         type: buffer.readUInt16LE(8),
         code: buffer.readUInt16LE(10),
         val:  buffer.readUInt32LE(12)
       }
      }
    }
    
    // The main node definition - most things happen in here
    function TouchNode(n) {
        // Create a RED node
        RED.nodes.createNode(this,n);

        // Store local copies of the node configuration (as defined in the .html)
        var msg = { topic: "touch" };
        this.device = n.device;
        this.scalex = n.scalex;
        this.scaley = n.scaley;
        var node = this;
        
        var strX = "";
        var strY = "";
       
	var FS = require("fs");
	var closeFS = 0;
 
        if (!FS.existsSync(node.device)) {
          throw "Info : PiTFT node can't find device.";
        }

        // This is the stuff that's actually happening in the node
        FS.open(node.device, "r", function (err, fd) {
        if (err) throw err;
        var buffer = new Buffer(16);
            
          function startRead() {
              FS.read(fd, buffer, 0, 16, null, function (err, bytesRead) {
              //msg.payload = parse(buffer);
              var readElement = parse(buffer);
                if (readElement != undefined && readElement.type == 3 && readElement.code == 1 && readElement.val > 0) {
                  strX = '{ "x": '.concat(Math.round(readElement.val/node.scalex),", ");
                }
                if (readElement != undefined && readElement.type == 3 && readElement.code == 0 && readElement.val > 0) {
                  strY = '"y": '.concat(Math.round(readElement.val/node.scaley)," }");
                }
                if (readElement != undefined && readElement.code == 330 && readElement.val == 0 && strX != "") {
                  msg.payload = strX.concat(strY);
                  strX = "";
                  strY = "";
                  node.send(msg);
                }
		if (closeFS == 1) {
                    FS.close(fd)
                } else {              
		   startRead();
                } 
             });
          }
          
          startRead();

        });

       this.on('close', function() {
           closeFS = 1;
       });

    }

    // Register the node by name. This must be called before overriding any of the
    // Node functions.
    RED.nodes.registerType("touch",TouchNode);
}
