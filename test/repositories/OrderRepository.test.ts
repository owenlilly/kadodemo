import mongoose from 'mongoose';
import {startOfDay, subDays} from 'date-fns';
import OrderRepository, {OrderSchema} from '../../src/repositories/OrderRepository';
import Order, {OrderStatus} from '../../src/repositories/models/Order';

describe('OrderRepository', () => {
    let repo: OrderRepository;

    beforeAll(async () => {
        await mongoose.connect('mongodb://127.0.0.1:27017/kadodemo_test');
        repo = new OrderRepository();
    }, 10000);

    afterEach(async () => {
        // ensure a clean collection for each test
        await mongoose.connection.db.dropCollection(OrderSchema.collection.collectionName);
    });

    it('should insert order', async () => {
        const order = givenOrder();

        const insertedOrder = await repo.insert(order);

        expect(insertedOrder).toBeDefined();
        expect(insertedOrder.cryptoCurrencyName).toEqual(order.cryptoCurrencyName);
        expect(insertedOrder.cryptoUnitCount).toEqual(order.cryptoUnitCount);
        expect(insertedOrder.walletAddress).toEqual(order.walletAddress);
        expect(insertedOrder.orderId).not.toBeFalsy();
        expect(insertedOrder.createdAt).not.toBeFalsy();
        expect(insertedOrder.txHash).toBeDefined();
        expect(insertedOrder).not.toEqual(order);
    });

    it('should getOrderById if exists', async () => {
        const order = await givenOrderExists(repo);
        expect(order).toBeDefined();

        const foundOrder = await repo.getById(order.orderId);

        expect(foundOrder).toBeDefined();
        expect(foundOrder.orderId).toEqual(order.orderId);
        expect(foundOrder.walletAddress).toEqual(order.walletAddress);
        expect(foundOrder.cryptoUnitCount).toEqual(order.cryptoUnitCount);
        expect(foundOrder.cryptoCurrencyName).toEqual(order.cryptoCurrencyName);
    });

    it('should aggregate results', async () => {
        await givenOrderExists(repo, 'wallet1');
        await givenOrderExists(repo, 'wallet1');
        await givenOrderExists(repo, 'wallet2');

        const startDate = startOfDay(subDays(new Date(), 30));

        const result = await repo.aggregate([
            {
              $match: { "createdAt": { "$gte": startDate } }
            },
            {
                $group: {
                    _id: "$walletAddress" ,
                    walletAddress: { $last: "$walletAddress" },
                    total: { $sum: "$cryptoUnitCount" },
                    quantity: { $count: { } },
                },
            },
            { $sort: { "quantity": -1 } },
            { $limit: 1 }
        ]);

        expect(result).toBeDefined();
        expect(result.length).toBeDefined();
        // @ts-ignore
        expect(result[0].walletAddress).toEqual('wallet1');
        // @ts-ignore
        expect(result[0].total).toEqual(2.24);
        // @ts-ignore
        expect(result[0].quantity).toEqual(2);
    });
});

function givenOrder(): Order {
    return {
        walletAddress: 'test_wallet_id',
        cryptoUnitCount: 1.12,
        cryptoCurrencyName: 'ETH',
        createdAt: new Date(),
        status: OrderStatus.Success,
        txHash: 'tx_hash',
    };
}

function givenOrderExists(repo: OrderRepository, walletAddress: string = '0xb64a30399f7f6b0c154c2e7af0a3ec7b0a5b131a'): Promise<Order> {
    const order = givenOrder();
    order.walletAddress = walletAddress;
    return repo.insert(order);
}
