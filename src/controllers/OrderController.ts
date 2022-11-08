import {startOfDay, subDays} from 'date-fns';
import OrderRepository from '../repositories/OrderRepository';
import Order, {OrderStatus} from '../repositories/models/Order';
import {omit} from '../utils';
import WalletController from './WalletController';

type VolumeResult = {
    walletAddress: string;
    total: number; // precision issues may appear since we're storing as ether instead of as wei
    quantity: number;
}

type FulfillOrderParams = {
    cryptoUnitCount: number;
    cryptoCurrencyName: string;
    walletAddress: string;
}

export default class OrderController {
    private readonly orderRepo: OrderRepository;
    private readonly wallet: WalletController;

    constructor(orderRepo: OrderRepository, internalWallet: WalletController) {
        this.orderRepo = orderRepo;
        this.wallet = internalWallet;
    }

    async fulfillOrder(order: FulfillOrderParams): Promise<Order> {
        // TODO: in a real app we'd use a message queue or stash the fulfillment request somewhere safe to retry in case of failures
        const tx = await this.wallet.sendTransaction(order.walletAddress, order.cryptoUnitCount.toString(10));

        const orderModel: Order = {
            cryptoUnitCount: order.cryptoUnitCount, // should convert to/from wei but keeping this for simplicity
            cryptoCurrencyName: order.cryptoCurrencyName,
            walletAddress: order.walletAddress,
            status: OrderStatus.Success,
            txHash: tx.hash,
            createdAt: new Date(),
        };

        return this.orderRepo.insert(orderModel);
    }

    async highest30DayVolume(): Promise<VolumeResult[]> {
        const startDate = subDays(startOfDay(new Date()), 30);
        const results = await this.orderRepo.aggregate([
            { $match: { "createdAt": { "$gte": startDate } } },
            {
                $group: {
                    _id: "$walletAddress" ,
                    walletAddress: { $first: '$walletAddress' },
                    total: { $sum: "$cryptoUnitCount" },
                    quantity: { $count: { } },
                },
            },
            { $sort: { "quantity": -1 } },
            { $limit: 1 }
        ]);

        // there will be at most one result, but we'll still return an array
        // so the client and more easily handle cases where there are no results
        return results?.length ? [omit(results[0] as VolumeResult, '_id')] : [];
    }
}