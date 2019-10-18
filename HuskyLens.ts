//% weight=100 color="#AA278D"  block="Huskylens"
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

    /**
     * Object Tracking
     */

    //% weight=200
    //% block="get object tracking X"
    export function ObjiectTrackingX(): number {
        //let x = 0;
        //let i = 0;
        //x = x1
        //serial.writeNumber(x)
        return x1;
    }
    //% weight=190
    //% block="get object tracking Y"
    export function ObjectTrackingY(): number {
        //let y = 0;
        //y = y1
        //serial.writeNumber(y)
        return y1;
    }
    //% weight=180
    //% block="get object tracking distance"
    export function ObjectTrackingDistance(): number {
        //let l = 0;
        //l = x2;
        //serial.writeNumber(l)
        return x2;
    }
/*
    //% weight=170
    //% block="get object tracking sign"
    export function ObjecttrackingSign(): number {
        //let n = 0;
        //n = y2;
        //serial.writeNumber(n)
        return y2;
    }*/

    /**
    * Face Recognition
    */

    //%block="get face recognition X"
    //%weight=160
    export function FaceRecognitionX(): number {
        return x1;
    }

    //%block="get face recognition y"
    //%weight=150
    export function FaceRecognitionY(): number {
        return y1;
    }

    //%block="get face recognition distance"
    //%weight=140
    export function FaceRecogitionDistance(): number {
        return x2;
    }
    /*
    //%block="get face recognition sign"
    //%weight=130
    export function FaceRecogitionSign(): number {
        return y2;
    }*/

    /**
     * Object Recognition
     */

    //%block="get object recognition X"
    //%weight=120
    export function ObjectRecognitionX(): number {
        return x1;
    }

    //%block="get object recognition Y"
    //%weight=110
    export function ObjectRecognitionY(): number {
        return y1;
    }
    /*
    //%block="get object recognition distance"
    //%weight=100
    export function ObjectRecognitionDistance(): number {
        return x2;
    }
    
    //%block="get object recognition sign"
    //%weight=99
    export function ObjectRecognitionSign(): number {
        return y2;
    }*/

    /**
     * Line Tracking
     */

    //%block="get line tracking X"
    //%weight=98
    export function LineTrackingX(): number {
        return x1;
    }

    //%block="get line tracking Y"
    //%weight=97
    export function LineTrackingY(): number {
        return y1;
    }
    /*
    //%block="get line tracking diatance"
    //%weight=96
    export function LineTrackingDiatance(): number {
        return x2;
    }

    //%block="get line tracking sign"
    //%weight=95
    export function LineTrackingSing(): number {
        return y2;
    }*/

    /**
     * Color Recognition
     */

    //%block="get color recognition X"
    //%weight=94
    export function ColorRecognitionX(): number {
        return x1;
    }

    //%block="get color recognition Y"
    //%weight=93
    export function ColorRecognitionY(): number {
        return y1;
    }
    /*
    //%block="get color recognition diatance"
    //%weight=92
    export function ColorRecognitionDiatance(): number {
        return x2;
    }
    
    //%block="get color recognition sign"
    //%weight=91
    export function ColorRecognitionSign(): number {
        return y2;
    }*/

    /**
     * Tag Recognition
     */

    //%block="get tag recognition X"
    //%weight=90
    export function TagRecognitionX(): number {
        return x1;
    }

    //%block="get tag recognition Y"
    //%weight=89
    export function TagrecognitionY(): number {
        return y1;
    }

    //%block="get tag recgnition diatance"
    //%weight=88
    export function TagRecgnitionDiatance(): number {
        return x2;
    }

    //%block="get tag recgnition sign"
    //%weight=87
    export function TagRecgnitionSign(): number {
        return y2;
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
                y2 = buf[13]
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

