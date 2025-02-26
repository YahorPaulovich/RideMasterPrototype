import { IInputService } from "./IInputService";
import { Node, EventTarget } from 'cc';

export abstract class InputService implements IInputService {
    public initialize(touchNode: Node): void {
    }
    
    public destroy(): void {
    }

    public eventTarget: EventTarget = new EventTarget();
}
