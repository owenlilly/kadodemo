import * as mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import App from './app';
import { initApis } from './apis';

dotenv.config();

const main = async () => {
    await mongoose.connect(process.env.MONGO_URL);
    const app = new App({ port: parseInt(process.env.PORT || '3000', 10) });

    initApis(app);

    await app.start(console.log);
};

main();
