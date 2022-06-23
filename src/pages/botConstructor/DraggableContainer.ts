import { CustomPIXIComponent } from "react-pixi-fiber";
import * as PIXI from "pixi.js";

const TYPE = "DraggableContainer";

//
// instance.children[0].getGlobalPosition() - для нативных Text, Sprite Pixi-сущностей
// instance.children[0].getBounds() - для Grapics
//

let externalLastX: number = 0;
let externalLastY: number = 0;
let isMoved: boolean = false;
export class Behavior {
  dragStart: any;
  dragEnd: any;
  dragMove: any;
  pointerOver: any;
  pointerOut: any;
  lastPivotX: any;
  lastPivotY: any;
  lastX: any;
  lastY: any;
  isInited: boolean = false;
  pointerovercapture: any;

  customDisplayObject() {
    console.log('NOW__');
    return new PIXI.Container();
  }

  customDidAttach(instance: any) {
    const renderRect = (graphic: any, options: any) => {
      const {borderWidth = 3, borderColor} = options;

      graphic.clear();
      graphic.lineStyle(borderWidth, borderColor);
      graphic.beginFill('0xffffff');
      graphic.drawRoundedRect(lastX, lastY, width, height, 20);
      graphic.endFill();
    };

    instance.interactive = true;
    const {lastX, lastY, width, height} = instance;
    instance.cursor = "pointer";

    const graphic = instance.children[0];
    console.log(graphic, '__INSTANNNNNN');

    renderRect(graphic, {
      borderWidth: 0,
      borderColor: null,
    });
    // console.log(graphic, 'graphic');
    console.log('externalLastX: ', externalLastX);
    console.log('externalLastY: ', externalLastY);
    graphic.position.x = externalLastX;
    graphic.position.y = externalLastY;

    let draggedObject: any = null;

    this.pointerOver = (e: any) => {
      console.log('Over');
      renderRect(graphic, {borderColor: '0x4d4dff'});
    };

    this.pointerOut = (e: any) => {
      renderRect(graphic, {borderWidth: 0, borderColor: null});
    };

    this.dragStart = (e: any) => {
      const data = e.data;
      const newPosition = data.getLocalPosition(instance.parent);

      draggedObject = instance;
      draggedObject.pivot.set(newPosition.x, newPosition.y);

      console.log(newPosition, '__newPosition__');
      graphic.position.x = externalLastX;
      graphic.position.y = externalLastY;

      draggedObject.position.x = newPosition.x;
      draggedObject.position.y = newPosition.y;
      
      const globalTextObj = instance.children[0].children[0].getBounds();
      
      console.log('globalTextObj.x: ', globalTextObj.x);
      this.lastPivotX = newPosition.x - globalTextObj.x;
      this.lastPivotY = newPosition.y - globalTextObj.y;

      if (typeof draggedObject.onDragStart === "function") draggedObject.onDragStart(instance);
    };

    this.dragMove = (e: any) => {
      if (draggedObject === null) return;
      isMoved = true;

      const data = e.data;
      const newPosition = data.getLocalPosition(instance.parent);

      draggedObject.position.x = newPosition.x;
      draggedObject.position.y = newPosition.y;

      const globalTextObj = instance.getBounds();

      this.lastPivotX = newPosition.x - globalTextObj.x - 15;
      this.lastPivotY = newPosition.y - globalTextObj.y - 15;
      console.log('x:', this.lastPivotX, 'y:', this.lastPivotY);

      if (typeof instance.onDragMove === "function") instance.parent.onDragMove(instance);
    };

    this.dragEnd = (e: any) => {
      const newPosition = e.data.getLocalPosition(instance.parent);
      console.log('newPosition.x: ', newPosition.x);
      console.log('this.lastPivotX: ', this.lastPivotX);
      externalLastX = newPosition.x - this.lastPivotX - 15 - this.lastX + (isMoved ? 1.5 : 0); // padding в контейнере для текста (серый прямоугольник) (rectPadding) + начальное значение lastX + 1/2 border белого прямоугольника
      externalLastY = newPosition.y - this.lastPivotY - 15 - this.lastY + (isMoved ? 1.5 : 0); // padding только внутри серого прямоугольника (rectPadding) + начальное значение lastY + 1/2 border белого прямоугольника
      draggedObject = null;
      isMoved = false;
      if (typeof instance.onDragEnd === "function") instance.onDragEnd(instance);
    };

    this.pointerovercapture = () => {
      console.log('QQQQQQQQQ__');
    };

    instance.on("mousedown", this.dragStart);
    instance.on("mouseup", this.dragEnd);
    instance.on("mousemove", this.dragMove);
    instance.on('pointerover', this.pointerOver);
    instance.on('pointerout', this.pointerOut);
    instance.on('pointerleave', this.pointerovercapture);
  }

  customWillDetach(instance: any) {
    console.log('UNMOUNT');
    // const graphic = instance.children[0];
    // graphic.destroy();
    instance.off("mousedown", this.dragStart as any);
    instance.off("mouseup", this.dragEnd);
    instance.off("mousemove", this.dragMove);
    instance.off('pointerover', this.pointerOver);
    instance.off('pointerout', this.pointerOut);
  }
}

export default CustomPIXIComponent(new Behavior(), TYPE);
