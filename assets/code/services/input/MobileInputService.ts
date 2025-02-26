import { InputService } from './InputService';
import { Node, EventTouch, Vec2 } from 'cc';

export class MobileInputService extends InputService {
    private touchNode: Node;
    private startTouchPosition: Vec2 = new Vec2();
    private isTouching: boolean = false;

    public initialize(touchNode: Node): void {
        this.setTouchNode(touchNode);

        this.touchNode.on(Node.EventType.TOUCH_START, this.handleTouchStart, this);
        this.touchNode.on(Node.EventType.TOUCH_MOVE, this.handleTouchMove, this);
        this.touchNode.on(Node.EventType.TOUCH_END, this.handleTouchEnd, this);
        this.touchNode.on(Node.EventType.TOUCH_CANCEL, this.handleTouchEnd, this);
    }

    public destroy() {
    }

    private setTouchNode(touchNode: Node): void {
        this.touchNode = touchNode;
    }

    private handleTouchStart(event: EventTouch) {
        this.isTouching = true;
        this.startTouchPosition = event.getLocation();
    }

    private handleTouchMove(event: EventTouch) {
        if (!this.isTouching) return;

        const currentTouchPosition = event.getLocation();
        const deltaY = currentTouchPosition.y - this.startTouchPosition.y;

        if (deltaY > 10) {
            this.eventTarget.emit('lever-pulled-up');
        } else if (deltaY < -10) {
            this.eventTarget.emit('lever-pulled-down');
        }
    }

    private handleTouchEnd(event: EventTouch) {
        this.isTouching = false;
    }
}