import { IPersistentProgressService } from './IPersistentProgressService';
import { PlayerProgress } from '../../data/PlayerProgress';

export class PersistentProgressService implements IPersistentProgressService {
    private _progress: PlayerProgress;

    public get progress(): PlayerProgress {
        return this._progress;
    }

    public set progress(value: PlayerProgress) {
        this._progress = value;
    }

    constructor(initialProgress: PlayerProgress) {
        this._progress = initialProgress;
    }
}
