import { IService } from "../IService";
import { Node, EventTarget } from 'cc';

export interface IInputService extends IService {
    initialize(touchNode: Node): void;
    destroy(): void;
    
    eventTarget: EventTarget;
}
