import * as Joi from 'joi';
import App from '../app';
import OrderController from '../controllers/OrderController';
import OrderRepository from '../repositories/OrderRepository';
import WalletController from '../controllers/WalletController';

export function initOrderApi(app: App) {
    const orderCtrl = new OrderController(new OrderRepository(), new WalletController(process.env.PRIVATE_KEY, process.env.NODE_URL));

    app.post('/api/fulfill-order', async (req, h) => {
        return await orderCtrl.fulfillOrder(req.payload);
    },{
        validate: {
            payload: Joi.object({
                walletAddress: Joi.string().required(),
                cryptoUnitCount: Joi.number().required(),
                cryptoCurrencyName: Joi.string().required(),
            })
        }
    });
}
