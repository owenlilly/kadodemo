export enum OrderStatus {
    Success = "SUCCESS",
}

export default interface Order {
    orderId?: string;
    cryptoUnitCount: number;
    cryptoCurrencyName: string;
    walletAddress: string;
    status: OrderStatus;
    txHash: string;
    createdAt: Date;
}
