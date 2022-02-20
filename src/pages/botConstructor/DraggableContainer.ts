import { CustomPIXIComponent } from "react-pixi-fiber";
import * as PIXI from "pixi.js";

const TYPE = "DraggableContainer";

//
// instance.children[0].getGlobalPosition() - для нативных Text, Sprite Pixi-сущностей
// instance.children[0].getBounds() - для Grapics
//

export class Behavior {
  dragStart: any;
  dragEnd: any;
  dragMove: any;
  lastPivotX: any;
  lastPivotY: any;

  customDisplayObject() {
    return new PIXI.Container();
  }

  customDidAttach(instance: any) {
    instance.interactive = true;
    instance.cursor = "pointer";
    console.log(instance);

    let draggedObject: any = null;

    this.dragStart = (e: any) => {
      const data = e.data;
      const newPosition = data.getLocalPosition(instance.parent);

      draggedObject = instance;
      draggedObject.pivot.set(newPosition.x, newPosition.y);
      draggedObject.position.x = newPosition.x;
      draggedObject.position.y = newPosition.y;
      console.log(instance.children[0].getBounds(), 'instance.children[0]77777777777777');
      const globalTextObj = instance.children[0].getBounds();
      console.log(newPosition.x, 'newPosition.x_START');
      console.log(globalTextObj.x, 'globalTextObj.x_START');
      this.lastPivotX = newPosition.x - globalTextObj.x;
      this.lastPivotY = newPosition.y - globalTextObj.y;
      console.log(this.lastPivotX, 'this.lastPivotX_START');

      if (typeof draggedObject.onDragStart === "function") draggedObject.onDragStart(instance);
    };

    this.dragEnd = (e: any) => {
      const newPosition = e.data.getLocalPosition(instance.parent);
      console.log(newPosition.x - this.lastPivotX, 'newPosition.x - this.lastPivotX');
      instance.setLastX(newPosition.x - this.lastPivotX);
      instance.setLastY(newPosition.y - this.lastPivotY);
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
      console.log(globalTextObj, 'globalTextObj');
      console.log(newPosition.x, 'newPosition.x');
      this.lastPivotX = newPosition.x - globalTextObj.x;
      this.lastPivotY = newPosition.y - globalTextObj.y;

      if (typeof instance.onDragMove === "function") instance.parent.onDragMove(instance);
    };

    instance.on("mousedown", this.dragStart);
    instance.on("mouseup", this.dragEnd);
    instance.on("mousemove", this.dragMove);
  }

  customWillDetach(instance: any) {
    instance.off("mousedown", this.dragStart as any);
    instance.off("mouseup", this.dragEnd);
    instance.off("mousemove", this.dragMove);
  }
}

export default CustomPIXIComponent(new Behavior(), TYPE);
