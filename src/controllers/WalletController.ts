import { ethers } from 'ethers';

export default class WalletController {
    private readonly provider;
    private readonly wallet;

    constructor(privateKey: string, url: string) {
        this.provider = new ethers.providers.JsonRpcProvider(url);
        this.wallet = new ethers.Wallet(ethers.utils.arrayify(privateKey), this.provider);
    }

    get address(): string {
        return this.wallet.address;
    }

    get privateKey(): string {
        return this.wallet.privateKey;
    }

    get publicKey(): string {
        return this.wallet.publicKey;
    }

    async sendTransaction(to: string, value: string) {
        return this.wallet.sendTransaction({ to, value: ethers.utils.parseEther(value) })
    }
}
