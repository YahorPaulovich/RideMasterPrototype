import { _decorator, CCFloat, Component } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('RoadBlockWeight')
export class RoadBlockWeight extends Component {
    @property(CCFloat) private value_: number = 0.2;

    public get value(): number {
        return this.value_;
    }

    private set value(newValue: number) {
        this.value_ = newValue;
    }
    
    public setValue(newValue: number): void {
        this.value = newValue;
    }
}