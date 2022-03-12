import { CustomPIXIComponent } from "react-pixi-fiber";
import * as PIXI from "pixi.js";

const TYPE = "DraggableContainer";

//
// instance.children[0].getGlobalPosition() - для нативных Text, Sprite Pixi-сущностей
// instance.children[0].getBounds() - для Grapics
//

let externalLastX: number = 0;
let externalLastY: number = 0;

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

  customDisplayObject() {
    return new PIXI.Container();
  }

  customDidAttach(instance: any) {
    instance.interactive = true;
    const {lastX, lastY, width, height} = instance;
    instance.cursor = "pointer";

    const graphic = instance.children[0];
    // console.log(graphic, 'graphic');
    console.log('externalLastX: ', externalLastX);
    console.log('externalLastY: ', externalLastY);
    graphic.position.x = externalLastX;
    graphic.position.y = externalLastY;

    let draggedObject: any = null;

    this.pointerOver = (e: any) => {
      instance.children[0].clear();
      instance.children[0].lineStyle(3, '0x4d4dff');
      instance.children[0].beginFill('0xffffff');
      instance.children[0].drawRoundedRect(lastX, lastY, width, height, 20);
      instance.children[0].endFill();
    };

    this.pointerOut = (e: any) => {
      instance.children[0].clear();
      instance.children[0].lineStyle(0, null);
      instance.children[0].beginFill('0xffffff');
      instance.children[0].drawRoundedRect(lastX, lastY, width, height, 20);
      instance.children[0].endFill();
    };

    this.dragStart = (e: any) => {
      const data = e.data;
      const newPosition = data.getLocalPosition(instance.parent);

      draggedObject = instance;
      draggedObject.pivot.set(newPosition.x, newPosition.y); // Добавил хардкод начальных значений координат

      console.log(newPosition, '__newPosition__');
      if (this.isInited) {
        console.log('NOT_INITED');
        graphic.position.x = externalLastX - 30;
        graphic.position.y = externalLastY - 20;
      } else {
        console.log('INITED');
        this.isInited = true;
      }

      draggedObject.position.x = newPosition.x;
      draggedObject.position.y = newPosition.y;
      
      const globalTextObj = instance.children[0].children[0].getBounds();

      this.lastPivotX = newPosition.x - globalTextObj.x;
      this.lastPivotY = newPosition.y - globalTextObj.y;

      if (typeof draggedObject.onDragStart === "function") draggedObject.onDragStart(instance);
    };

    this.dragEnd = (e: any) => {
      const newPosition = e.data.getLocalPosition(instance.parent);

      externalLastX = newPosition.x - this.lastPivotX;
      externalLastY = newPosition.y - this.lastPivotY;

      draggedObject = null;

      if (typeof instance.onDragEnd === "function") instance.onDragEnd(instance);
    };

    this.dragMove = (e: any) => {
      if (draggedObject === null) return;

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

    instance.on("mousedown", this.dragStart);
    instance.on("mouseup", this.dragEnd);
    instance.on("mousemove", this.dragMove);
    instance.on('pointerover', this.pointerOver);
    instance.on('pointerout', this.pointerOut);
  }

  customWillDetach(instance: any) {
    instance.off("mousedown", this.dragStart as any);
    instance.off("mouseup", this.dragEnd);
    instance.off("mousemove", this.dragMove);
    instance.off('pointerover', this.pointerOver);
    instance.off('pointerout', this.pointerOut);
  }
}

export default CustomPIXIComponent(new Behavior(), TYPE);
