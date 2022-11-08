import WalletController from '../../src/controllers/WalletController';

describe('WalletController', () => {
    const nodeUrl = 'http://127.0.0.1:8545/';
    const privateKey = '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80';
    const address = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266';
    const publicKey = '0x048318535b54105d4a7aae60c08fc45f9687181b4fdfc625bd1a753fa7397fed753547f11ca8696646f2f3acb08e31016afac23e630c5d11f59f61fef57b0d2aa5'

    it('should create wallet from private key', async () => {
        const wallet = new WalletController(privateKey, nodeUrl);

        expect(wallet.address).toEqual(address);
        expect(wallet.privateKey).toEqual(privateKey);
        expect(wallet.publicKey).toEqual(publicKey);
    });

    it('should send funds from wallet', async () => {
        const wallet = new WalletController(privateKey, nodeUrl);

        const tx = await wallet.sendTransaction('0x70997970C51812dc3A010C7d01b50e0d17dc79C8', '1.0');

        expect(tx).toBeDefined();
        expect(tx.hash).toBeDefined();
    });
});