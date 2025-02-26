import { _decorator, Component } from 'cc';
import PlayerInput from '../Input/PlayerInput';

const { ccclass } = _decorator;

@ccclass('PlayerMovement')
export default class PlayerMovement extends Component {

    private input: PlayerInput;

    protected onLoad(): void {
        this.input = this.node.getComponent(PlayerInput);
    }

    protected update(dt: number): void {
        console.log('input: ' + this.input);
    }
}