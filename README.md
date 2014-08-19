node-files-PiTFT-touch
======================

Source files for a Raspberry Pi Adafruit PiTFT touch screen node for Node-RED


Install
-------

Run the following command in the root directory of your Node-RED install

    npm install node-red-contrib-PiTFT-touch
  
  
###Input

This reads */dev/input/event0*, which is the Adafruit PiTFT touch screen if you used their tutorial to install the shield. May be compatible with other touch screens. This node doesn't do any error handling yet (so if there's not PiTFT, tough luck) nor any fancy event handling ("gestures"), but just reports the last position where the user touched the screen before lifting the finger. 
This is useful for simple "touch a button on the screen" sort of operations.

Outputs an object called **msg** containing a **msg.payload**. msg.payload is a JSON String of the format {"x":10, "y":20}
