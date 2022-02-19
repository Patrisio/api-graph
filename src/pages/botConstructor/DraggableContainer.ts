import { CustomPIXIComponent } from "react-pixi-fiber";
import * as PIXI from "pixi.js";

const TYPE = "DraggableContainer";

export class Behavior {
  dragStart: any;
  dragEnd: any;
  dragMove: any;
  prevDraggedObj: any;
  lastPivotX: any;
  lastPivotY: any;

  customDisplayObject() {
    return new PIXI.Container();
  }

  customDidAttach(instance: any) {
    instance.interactive = true;
    instance.cursor = "pointer";

    let draggedObject: any = null;
    this.prevDraggedObj = null;

    this.dragStart = (e: any) => {
      const data = e.data;
      const newPosition = data.getLocalPosition(this.prevDraggedObj ? this.prevDraggedObj.parent : instance.parent);

      draggedObject = this.prevDraggedObj ?? instance;
      draggedObject.pivot.set(newPosition.x, newPosition.y);
      draggedObject.position.x = newPosition.x;
      draggedObject.position.y = newPosition.y;

      if (typeof draggedObject.onDragStart === "function") draggedObject.onDragStart(instance);
    };

    this.dragEnd = (e: any) => {
      const newPosition = e.data.getLocalPosition(instance.parent);

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

      const globalTextObj = instance.children[0].getGlobalPosition();
      this.lastPivotX = newPosition.x - globalTextObj.x;
      this.lastPivotY = newPosition.y - globalTextObj.y;

      if (typeof instance.onDragMove === "function") instance.parent.onDragMove(instance.children[0]);
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
