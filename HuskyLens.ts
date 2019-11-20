/** 
 * @file pxt-huskyl_beta/Huskylens.ts

 * @copyright    [DFRobot](http://www.dfrobot.com), 2016
 * @copyright    MIT Lesser General Public License
 * 
 * @author [email](jie.tang@dfrobot.com)
 * @version  V0.0.2 beta
 * @date  2019-11-20
*/
let IDnumber1: number[] = [0];

let x1 = 0;
let y1 = 0;
let x2 = 0;
let y2 = 0;
let x3 = 0;
let y3 = 0;

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
    let i = 0;
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

    //% weight=200
    //% block="set ID get number|%n"
    //% n.min=1 n.max=1000 n.defl=1
    export function IDNumber(n: number): void {
        i = n - 1;
    }

    /**
     * Object Tracking
     */

    //% weight=200
    //% block="get object tracking |%content"
    //% color=#31C7D5
    export function ObjiectTracking(content: Content1): number {
        if (content == 1) {
            return IDnumber1[i * 5 + 0];
        } else if (content == 2) {
            return IDnumber1[i * 5 + 1];
        } else if (content == 3) {
            return IDnumber1[i * 5 + 2];
        } else if (content == 4) {
            return IDnumber1[i * 5 + 3];
        }
        return IDnumber1[i * 5 + 4];

    }


    /**
    * Face Recognition
    */

    //%block="get face recognition |%content"
    //%weight=160
    //% color=#00A654
    export function FaceRecognition(content: Content1): number {
        if (content == 1) {
            return IDnumber1[i * 5 + 0];
        } else if (content == 2) {
            return IDnumber1[i * 5 + 1];
        } else if (content == 3) {
            return IDnumber1[i * 5 + 2];
        } else if (content == 4) {
            return IDnumber1[i * 5 + 3];
        }
        return IDnumber1[i * 5 + 4];
    }


    /**
     * Object Recognition
     */

    //%block="get object recognition |%content"
    //%weight=120
    //% color=#7f00ff
    export function ObjectRecognition(content: Content1): number {
        if (content == 1) {
            return IDnumber1[i * 5 + 0];
        } else if (content == 2) {
            return IDnumber1[i * 5 + 1];
        } else if (content == 3) {
            return IDnumber1[i * 5 + 2];
        } else if (content == 4) {
            return IDnumber1[i * 5 + 3];
        }
        return IDnumber1[i * 5 + 4];
    }


    /**
     * Line Tracking
     */

    //% block="get line tracking |%content"
    //% weight=98
    //% color=#D063CF
    export function LineTracking(content: Content1): number {
        if (content == 1) {
            return IDnumber1[i * 5 + 0];
        } else if (content == 2) {
            return IDnumber1[i * 5 + 1];
        } else if (content == 3) {
            return IDnumber1[i * 5 + 2];
        } else if (content == 4) {
            return IDnumber1[i * 5 + 3];
        }
        return IDnumber1[i * 5 + 4];
    }


    /**
     * Color Recognition
     */

    //%block="get color recognition |%content"
    //%weight=94
    //% color=#ff8000
    export function ColorRecognition(content: Content1): number {
        if (content == 1) {
            return IDnumber1[i * 5 + 0];
        } else if (content == 2) {
            return IDnumber1[i * 5 + 1];
        } else if (content == 3) {
            return IDnumber1[i * 5 + 2];
        } else if (content == 4) {
            return IDnumber1[i * 5 + 3];
        }
        return IDnumber1[i * 5 + 4];
    }


    /**
     * Tag Recognition
     */

    //%block="get tag recognition |%content"
    //%weight=90
    //% color=#007fff
    export function TagRecognition(content: Content1): number {
        if (content == 1) {
            return IDnumber1[i * 5 + 0];
        } else if (content == 2) {
            return IDnumber1[i * 5 + 1];
        } else if (content == 3) {
            return IDnumber1[i * 5 + 2];
        } else if (content == 4) {
            return IDnumber1[i * 5 + 3];
        }
        return IDnumber1[i * 5 + 4];
    }

    function read(): boolean {

        //let x = pins.i2cReadNumber(0X32, NumberFormat.UInt16LE, false);
        let buf = pins.i2cReadBuffer(0x32, 16, true)
        for (let i = 0; i < 16; i++) {
            if (husky_lens_protocol_receive(buf[i])) {

                x1 = buf[6] << 8 | buf[5];
                y1 = buf[8] << 8 | buf[7];
                x2 = buf[10] << 8 | buf[9];
                x3 = buf[12] << 8 | buf[11];
                y2 = buf[14] << 8 | buf[13];

                if (y2 > 1000) {
                    y2 = y2 - 65536;
                } else {
                    y2 = y2;
                }
                //serial.writeNumber(x1);

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
        if (y2 > 0) {
            IDnumber1[(y2 - 1) * 5 + 0] = x1;
            IDnumber1[(y2 - 1) * 5 + 1] = y1;
            IDnumber1[(y2 - 1) * 5 + 2] = x2;
            IDnumber1[(y2 - 1) * 5 + 3] = x3;
            IDnumber1[(y2 - 1) * 5 + 4] = y2;
        } else {
            IDnumber1[(Math.abs(y2) - 1) * 5 + 4] = y2;
        }
        basic.pause(20);
    })
}

