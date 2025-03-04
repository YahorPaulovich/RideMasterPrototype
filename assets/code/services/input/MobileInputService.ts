import { InputService } from './InputService';
import { Node, EventTouch, Vec2, Vec3 } from 'cc';

export class MobileInputService extends InputService {
    private touchNode: Node;
    private startTouchPosition: Vec2 = new Vec2();
    private isTouching: boolean = false;
    private initialNodeY: number = 0;
    private sensitivity: number = 1.5;

    public initialize(touchNode: Node): void {
        this.setTouchNode(touchNode);

        this.touchNode.on(Node.EventType.TOUCH_START, this.handleTouchStart, this);
        this.touchNode.on(Node.EventType.TOUCH_MOVE, this.handleTouchMove, this);
        this.touchNode.on(Node.EventType.TOUCH_END, this.handleTouchEnd, this);
        this.touchNode.on(Node.EventType.TOUCH_CANCEL, this.handleTouchEnd, this);
    }

    public destroy() {
        // this.touchNode.off(Node.EventType.TOUCH_START, this.handleTouchStart, this);
        // this.touchNode.off(Node.EventType.TOUCH_MOVE, this.handleTouchMove, this);
        // this.touchNode.off(Node.EventType.TOUCH_END, this.handleTouchEnd, this);
        // this.touchNode.off(Node.EventType.TOUCH_CANCEL, this.handleTouchEnd, this);
    }

    private setTouchNode(touchNode: Node): void {
        this.touchNode = touchNode;
        this.touchNode.position = new Vec3(0, 0, 0);
        this.initialNodeY = touchNode.position.y;
    }

    private handleTouchStart(event: EventTouch) {
        this.isTouching = true;
        this.startTouchPosition = event.getLocation();
    }

    private handleTouchMove(event: EventTouch) {
        if (!this.isTouching || !this.touchNode) return;

        let currentTouchPosition = event.getLocation();
        let deltaY = currentTouchPosition.y - this.startTouchPosition.y;

        let minY = this.initialNodeY - 150;
        let maxY = this.initialNodeY + 150;

        let newY = this.initialNodeY + deltaY * this.sensitivity;
        newY = Math.max(minY, Math.min(maxY, newY));

        this.touchNode.setPosition(new Vec3(this.touchNode.position.x, newY, this.touchNode.position.z));
        
        let normalizedDeltaY = (deltaY) * 20;
        normalizedDeltaY = Math.max(-20, Math.min(20, normalizedDeltaY));

        if (deltaY > 10) {
            this.eventTarget.emit('lever-pulled-up', normalizedDeltaY);
        } else if (deltaY < -10) {
            this.eventTarget.emit('lever-pulled-down', normalizedDeltaY);
        }
    }

    private handleTouchEnd(event: EventTouch) {
        this.isTouching = false;
    }
}