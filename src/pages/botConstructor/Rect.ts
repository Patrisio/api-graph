import {memo} from 'react';
import { CustomPIXIComponent } from "react-pixi-fiber";
import * as PIXI from "pixi.js";

const areEquals = () => {
    return true;
};

const TYPE = "Rect";
export class Behavior extends PIXI.Graphics {
    customDisplayObject(props: any) {
        return new PIXI.Graphics();
    }

    customApplyProps(instance: any, oldProps: any, newProps: any) {
        const { bg, x, y, width, height, borderRadius = 20 } = newProps;

        // if (typeof oldProps !== "undefined") {
        //     instance.clear();
        // }
        console.log(`X: ${x} Y: ${y}`);
        // instance.children[0].height(500);
        // console.log(instance?.height(500), 'PROTO');
        console.log(instance, 'RECTTTTTTTTTTT_INSTANCE');
        console.log(instance.getGlobalPosition(), 'GLOBAL__HELLO');


        instance.beginFill(bg);
        instance.drawRoundedRect(x, y, width, height, borderRadius);
        // instance.drawRect(x, y, width, height);
        instance.endFill();
    }
};

export default memo(CustomPIXIComponent(new Behavior(), TYPE), areEquals);
