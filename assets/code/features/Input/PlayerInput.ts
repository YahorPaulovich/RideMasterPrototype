import { _decorator, Component, Node } from 'cc';

const { ccclass } = _decorator;

@ccclass('PlayerInput')
export default class PlayerInput extends Component {
    public y: number = 0;
}