import { CustomPIXIComponent } from "react-pixi-fiber";
import * as PIXI from "pixi.js";

const TYPE = "Rect";
export class Behavior extends PIXI.Graphics {
    customDisplayObject(props: any) {
        return new PIXI.Graphics();
    }

    customApplyProps(instance: any, oldProps: any, newProps: any) {
        const { bg, x, y, width, height } = newProps;

        // if (typeof oldProps !== "undefined") {
        //     instance.clear();
        // }
        console.log(`X: ${x} Y: ${y}`);
        console.log(instance);
        console.log(instance.getGlobalPosition(), 'GLOBAL__HELLO');


        instance.beginFill(bg);
        instance.drawRoundedRect(x, y, width, height, 20);
        // instance.drawRect(x, y, width, height);
        instance.endFill();
    }
};

export default CustomPIXIComponent(new Behavior(), TYPE);
