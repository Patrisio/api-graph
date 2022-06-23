import {memo} from 'react';
import { CustomPIXIComponent } from "react-pixi-fiber";
import * as PIXI from "pixi.js";

const areEquals = () => {
    console.log('PIDR');
    return true;
};

const TYPE = "Rect";

export class Behavior extends PIXI.Graphics {
    customDisplayObject(props: any) {
        return new PIXI.Graphics();
    }

    customApplyProps(instance: any, oldProps: any, newProps: any) {
        instance.clear();
        const { bg, x, y, width, height, borderRadius = 20, borderColor, draw } = newProps;

        // if (typeof oldProps !== "undefined") {
        //     instance.clear();
        // }
        // console.log(height, '__RRRRRRR____');
        // console.log(`X: ${x} Y: ${y}`);
        // instance.children[0].height(500);
        // console.log(instance?.height(500), 'PROTO');
        // console.log(instance, 'RECTTTTTTTTTTT_INSTANCE');
        // console.log(instance.getGlobalPosition(), 'GLOBAL__HELLO');
        draw && draw(instance, borderColor);
        borderColor && instance.lineStyle(3, borderColor);
        instance.beginFill(bg);
        instance.drawRoundedRect(x, y, width, height, borderRadius);
        // instance.drawRect(x, y, width, height);
        instance.endFill();
    }
};

export default CustomPIXIComponent(new Behavior(), TYPE);
