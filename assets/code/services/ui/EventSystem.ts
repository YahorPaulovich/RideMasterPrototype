import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('EventSystem')
export class EventSystem extends Component {
    @property(Node) touchNode: Node = null;
}
