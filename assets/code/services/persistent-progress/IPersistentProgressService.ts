import { IService } from '../IService';
import { PlayerProgress } from '../../data/PlayerProgress';

export interface IPersistentProgressService extends IService {
    progress: PlayerProgress;
}
