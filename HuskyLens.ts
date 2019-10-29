
enum Content1 {
    //% block="X coordinates"
    X_COORDINATES = 1,
    //% block="Y coordonates"
    Y_COORDINATES = 2,
    //% block="object lenght"
    LENGHT = 3,
    //% block="object width"
    WIDTH = 4,
    //% block="object sign"
    SIGN = 5,
    
}

//% weight=100  color=#00A654 block="Huskylens"
namespace HuskyLens {
    let FRAME_BUFFER_SIZE = 128
    let HEADER_0_INDEX = 0
    let HEADER_1_INDEX = 1
    let ADDRESS_INDEX = 2
    let CONTENT_SIZE_INDEX = 3
    let COMMAND_INDEX = 4
    let CONTENT_INDEX = 5
    let PROTOCOL_SIZE = 6
    let send_index = 0;
    let receive_index = 0;

    let receive_buffer: number[] = [];
    let send_fail = false;
    let receive_fail = false;
    let content_current = 0;
    let content_end = 0;
    let content_read_end = false;

    let x1 = 0;
    let y1 = 0;
    let x2 = 0;
    let y2 = 0;
    let x3 = 0;
    let y3 = 0;

    /**
     * Object Tracking
     */

    //% weight=200
    //% block="get object tracking |%content"
    //% color=#31C7D5
    export function ObjiectTracking(content: Content1): number {
        if(content == 1){
            return x1;
        }else if(content == 2){
            return y1;
        }else if(content == 3){
            return x2;
        }else if(content == 4){
            return x3;
        } 
            return y2;
       
    }
   

    /**
    * Face Recognition
    */

    //%block="get face recognition |%content"
    //%weight=160
    //% color=#00A654
    export function FaceRecognition(content: Content1): number {
        if (content == 1) {
            return x1;
        } else if (content == 2) {
            return y1;
        } else if (content == 3) {
            return x2;
        } else if (content == 4) {
            return x3;
        }
        return y2;
    }
   

    /**
     * Object Recognition
     */

    //%block="get object recognition |%content"
    //%weight=120
    //% color=#7f00ff
    export function ObjectRecognition(content: Content1): number {
        if (content == 1) {
            return x1;
        } else if (content == 2) {
            return y1;
        } else if (content == 3) {
            return x2;
        } else if (content == 4) {
            return x3;
        }
        return y2;
    }
   

    /**
     * Line Tracking
     */

    //% block="get line tracking |%content"
    //% weight=98
    //% color=#D063CF
    export function LineTracking(content: Content1): number {
        if (content == 1) {
            return x1;
        } else if (content == 2) {
            return y1;
        } else if (content == 3) {
            return x2;
        } else if (content == 4) {
            return x3;
        }
        return y2;
    }
   

    /**
     * Color Recognition
     */

    //%block="get color recognition |%content"
    //%weight=94
    //% color=#ff8000
    export function ColorRecognition(content: Content1): number {
        if (content == 1) {
            return x1;
        } else if (content == 2) {
            return y1;
        } else if (content == 3) {
            return x2;
        } else if (content == 4) {
            return x3;
        }
        return y2;
    }
   

    /**
     * Tag Recognition
     */

    //%block="get tag recognition |%content"
    //%weight=90
    //% color=#007fff
    export function TagRecognition(content: Content1): number {
        if (content == 1) {
            return x1;
        } else if (content == 2) {
            return y1;
        } else if (content == 3) {
            return x2;
        } else if (content == 4) {
            return x3;
        } 
        return y2
    }
    
    function read(): boolean {
        let i;
        //let x = pins.i2cReadNumber(0X32, NumberFormat.UInt16LE, false);
        let buf = pins.i2cReadBuffer(0x32, 16, true)
        for (i = 0; i < 16; i++) {
            if (husky_lens_protocol_receive(buf[i])) {

                if (buf[6] == 1) {
                    x1 = 255 + buf[5];
                } else { x1 = buf[5]; }
                if (buf[8] == 1) {
                    y1 = 255 + buf[7];
                } else { y1 = buf[7]; }
                if (buf[10] == 1) {
                    x2 = 255 + buf[9];
                } else { x2 = buf[9]; }
                if(buf[12] == 1){
                    x3 =buf[11]+255;
                }else{x3= buf[11];}
                y2 = buf[13]
                //y3 = buf[15]
                //serial.writeNumber(buf[14] )
                return true
            }
        }
        return false
    }

    function validateCheckSum() {
        //serial.writeNumber(1)
        //stackSumIndex=15
        let stackSumIndex = receive_buffer[3] + CONTENT_INDEX;
        let sum = 0;
        //serial.writeNumber(stackSumIndex)
        //calculate the checksum
        for (let i = 0; i < stackSumIndex; i++) {
            sum += receive_buffer[i];
        }
        sum = sum & 0xff;
        //let y=sum.toString()
        //let x =(y.length -4) 
        //serial.writeNumber(sum)
        //serial.writeLine("a")
        //serial.writeNumber(receive_buffer[15])
        return (sum == receive_buffer[stackSumIndex]);
    }

    function husky_lens_protocol_receive(data: number): boolean {
        switch (receive_index) {
            case 0:

                if (data != 0x55) { receive_index = 0; return false; }
                //serial.writeNumber(receive_buffer[0])
                receive_buffer[0] = 0x55;
                break;
            case 1:
                //serial.writeNumber(receive_buffer[1])
                if (data != 0xaa) { receive_index = 0; return false; }
                receive_buffer[1] = 0xaa;
                break;
            case 2:
                //serial.writeNumber(receive_buffer[2])
                receive_buffer[2] = data;
                break;
            case 3:

                if (data >= FRAME_BUFFER_SIZE - PROTOCOL_SIZE) { receive_index = 0; return false; }
                receive_buffer[3] = data;
                //serial.writeNumber(receive_buffer[3])
                break;
            default:
                receive_buffer[receive_index] = data;

                if (receive_index == receive_buffer[3] + CONTENT_INDEX) {
                    content_end = receive_index;
                    receive_index = 0;
                    //serial.writeNumber(receive_buffer[7])
                    return validateCheckSum();

                }
                break;
        }
        receive_index++;
        return false;
    }

    basic.forever(() => {
        read();
        basic.pause(20);
    })
}

