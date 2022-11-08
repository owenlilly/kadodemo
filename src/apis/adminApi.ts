import App from '../app';
import OrderController from '../controllers/OrderController';
import OrderRepository from '../repositories/OrderRepository';
import WalletController from '../controllers/WalletController';

export function initAdminApi(app: App) {
    const orderCtrl = new OrderController(new OrderRepository(), new WalletController(process.env.PRIVATE_KEY, process.env.NODE_URL));

    app.get('/api/admin/highest-volume', async (req, h) => {
        return await orderCtrl.highest30DayVolume();
    });
}