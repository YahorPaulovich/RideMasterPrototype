import { _decorator, Component, Node } from 'cc';
import { IInputService } from '../../services/input/IInputService';
import PlayerInput from './PlayerInput';

const { ccclass } = _decorator;

@ccclass('PlayerInputActions')
export default class PlayerInputActions extends Component {
    private inputService: IInputService;
    private input: PlayerInput;

    protected onLoad(): void {
        this.input = this.node.getComponent(PlayerInput);
    }

    public inject(inputService: IInputService, touchNode: Node): void {
        this.inputService = inputService;
        this.inputService.initialize(touchNode);

        this.inputService.eventTarget.on('lever-pulled-up', this.handleLeverPulledUp, this);
        this.inputService.eventTarget.on('lever-pulled-down', this.handleLeverPulledDown, this);
    }

    protected onDestroy() {
        this.inputService.eventTarget.off('lever-pulled-up', this.handleLeverPulledUp, this);
        this.inputService.eventTarget.off('lever-pulled-down', this.handleLeverPulledDown, this);
        this.inputService.destroy();
    }

    private handleLeverPulledUp(deltaY: number): void {
        this.input.y = deltaY;
    }
    
    private handleLeverPulledDown(deltaY: number): void {
        this.input.y = deltaY;
    }
}