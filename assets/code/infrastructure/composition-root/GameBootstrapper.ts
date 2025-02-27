import { _decorator, Component } from 'cc';
import { EntryPoint } from './EntryPoint';

const {ccclass, property} = _decorator;

@ccclass
export default class GameBootstrapper extends Component {
    @property
    autorun: boolean = true;

    protected async start() {
        if (this.autorun == true) {
            EntryPoint.run();
        }
    }
}
