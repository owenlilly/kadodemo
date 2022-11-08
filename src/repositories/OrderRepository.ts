import { model, Schema, PipelineStage } from 'mongoose';
import Order from './models/Order';
import { docToObject } from '../utils';

const orderSchema = new Schema<Order>({
    cryptoUnitCount: { type: Number, required: true }, // Storing as ether instead of wei for simplicity. Would store as wei in a real app to avoid calculation precision issues
    cryptoCurrencyName: { type: String, required: true },
    walletAddress: { type: String, required: true },
    txHash: { type: String, required: true },
    status: { type: String, required: true },
    createdAt: { type: Date, required: true },
});

export const OrderSchema = model<Order>('Order', orderSchema);

export default class OrderRepository {
    async insert(order: Order): Promise<Order> {
        const orderDoc = new OrderSchema(order);

        const doc = await orderDoc.save();

        return { ...order, orderId: doc._id.toHexString() };
    }

    async getById(orderId: string): Promise<Order> {
        const doc = await OrderSchema.findById(orderId);

        return docToObject<Order>(doc, 'orderId');
    }

    async aggregate(pipeline: PipelineStage[]): Promise<unknown[]> {
        return OrderSchema.aggregate(pipeline);
    }
}
