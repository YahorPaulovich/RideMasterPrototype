import { _decorator, Component, Node, tween, Vec3, UIOpacity, CCBoolean, CCInteger } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('TutorView')
export class TutorView extends Component {
    @property(Node) private hand: Node;
    @property private handOffsetY: number = -650;
    @property(Node) private leverButton: Node;
    private leverInitialY: number = 0;

    @property(CCBoolean)
    private isTutorialActive: boolean = true;

    @property(CCInteger)
    private tutorialViewLimit: number = 2;
    private tutorialCount: number = 0;

    protected start() {
        this.leverInitialY = this.leverButton.position.y;
        this.startTutorial();
    }

    private startTutorial() {
        if (!this.isTutorialActive || this.tutorialCount >= this.tutorialViewLimit) return;

        this.tutorialCount++;
        this.hand.active = true;
        this.startCombinedAnimation();
    }

    private startCombinedAnimation() {
        let leverUpY = this.leverInitialY + 100;
        let leverDownY = this.leverInitialY;
        let duration = 0.5;

        let handOpacity = this.hand.getComponent(UIOpacity);
        if (!handOpacity) {
            console.error("UIOpacity component is missing on the hand node!");
            return;
        }

        handOpacity.opacity = 0;

        tween(this.leverButton)
            .to(duration, { position: new Vec3(this.leverButton.position.x, leverUpY, this.leverButton.position.z) }, { easing: 'sineOut' })
            .to(duration, { position: new Vec3(this.leverButton.position.x, leverDownY, this.leverButton.position.z) }, { easing: 'sineIn' })
            .start();

        tween(this.hand)
            .to(duration, { position: new Vec3(this.hand.position.x, leverUpY + this.handOffsetY, this.hand.position.z) }, { easing: 'sineOut' })
            .to(duration, { position: new Vec3(this.hand.position.x, leverDownY + this.handOffsetY, this.hand.position.z) }, { easing: 'sineIn' })
            .call(() => {
                this.fadeOutHand(() => {
                    setTimeout(() => {
                        this.startTutorial();
                    }, 1000);
                });
            })
            .start();

        tween(handOpacity)
            .delay(0.1)
            .to(0.4, { opacity: 255 }, { easing: 'sineOut' })
            .start();
    }

    private fadeOutHand(onComplete: () => void) {
        let handOpacity = this.hand.getComponent(UIOpacity);
        if (!handOpacity) {
            console.error("UIOpacity component is missing on the hand node!");
            return;
        }

        tween(handOpacity)
            .to(0.4, { opacity: 0 }, { easing: 'sineIn' })
            .call(() => {
                this.hand.active = false;
                onComplete();
            })
            .start();
    }

    public stopTutorial() {
        this.isTutorialActive = false;
        this.fadeOutHand(() => {
            this.hand.active = false;
        });
    }

    public resetTutorial() {
        this.tutorialCount = 0;
        this.isTutorialActive = true;
        this.startTutorial();
    }
}