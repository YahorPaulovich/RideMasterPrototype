import { IService } from '../IService';

export interface ISceneManagementService extends IService {
    loadAsync(sceneName: string, onLoaded?: () => Promise<void>): Promise<void>;
}
