import App from '../app';
import { initOrderApi } from './orderApi';
import { initAdminApi } from './adminApi';

export function initApis(app: App) {
    initOrderApi(app);
    initAdminApi(app);
}
