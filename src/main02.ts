import { logger, Logger } from './modules/common/Logger';
import { Config } from './modules/common/Config';


import * as sdk from 'boa-sdk-ts';
import { WK } from './modules/utils/WK';

// Create with the arguments and read from file
let config = Config.createWithArgument();

// Now configure the logger with the expected transports
switch (process.env.NODE_ENV) {
    case "test":
        // Logger is silent, do nothingg
        break;

    case "development":
        // Only use the console log
        logger.add(Logger.defaultConsoleTransport());
        break;

    case "production":
    default:
        // Read the config file and potentially use both
        logger.add(Logger.defaultFileTransport(config.logging.folder));
        if (config.logging.console)
            logger.add(Logger.defaultConsoleTransport());
}
logger.transports.forEach((tp:any) => { tp.level = config.logging.level });

logger.info(`Stoa endpoint: ${config.server.stoa_endpoint.toString()}`);
logger.info(`Agora endpoint: ${config.server.agora_endpoint.toString()}`);

// Create BOA Client
let boa_client = new sdk.BOAClient(config.server.stoa_endpoint.toString(), config.server.agora_endpoint.toString());

let already_use_genesis_tx: boolean = false;

function prepare (): Promise<void>
{
    return new Promise<void>((resolve) => {
        sdk.SodiumHelper.init()
            .then(() =>
            {
                resolve();
            })
            .catch((err: any) =>
            {
                resolve();
            });
    });
}

function createTransaction (): Promise<sdk.Transaction[]>
{
    return new Promise<sdk.Transaction[]>(async (resolve) => {

        let block_height: sdk.JSBI;

        try
        {
            block_height = await boa_client.getBlockHeight();
        }
        catch (ex)
        {
            block_height = sdk.JSBI.BigInt(0);
        }

        // 제네시스 블럭 키의 UTXO를 가져온다.
        if (sdk.JSBI.equal(block_height, sdk.JSBI.BigInt(0)))
        {
            if (already_use_genesis_tx)
            {

                resolve([]);
                return;
            }
            already_use_genesis_tx = true;
            /*
            let count = 10;
            let utxos = await  boa_client.getUTXOs(WK.GenesisKey.address);
            let manager = new sdk.UTXOManager(utxos);
            let builder = new sdk.TxBuilder(WK.GenesisKey);
            let sum: bigint = manager.getSum()[0];
            logger.info(`sum: ${sum}`);
            let amount = sum / BigInt(count);
            logger.info(`amount: ${amount}`);
            let remain = sum - amount * BigInt(count);
            logger.info(`remain: ${remain}`);
            for (let u of utxos)
                builder.addInput(u.utxo, u.amount);

            for (let idx = 0; idx < count; idx++) {
                if (idx < count-1)
                    builder.addOutput(WK.keys(idx).address, amount);
                else
                    builder.addOutput(WK.keys(idx).address, amount + remain);
            }

            resolve(builder.sign(sdk.TxType.Payment));
            */
            let count = 10;
            let utxos = await  boa_client.getUTXOs(WK.GenesisKey.address);

            let res: sdk.Transaction[] = [];
            let key_count = 0;
            for (let u of utxos)
            {
                let builder = new sdk.TxBuilder(WK.GenesisKey);
                builder.addInput(u.utxo, u.amount);

                //logger.info(`utxo amount: ${u.amount}`);
                let amount = sdk.JSBI.divide(u.amount, sdk.JSBI.BigInt(count));
                //logger.info(`amount: ${amount}`);
                let remain = sdk.JSBI.subtract(u.amount, sdk.JSBI.multiply(amount, sdk.JSBI.BigInt(count)));
                for (let idx = 0; idx < count; idx++)
                {
                    //logger.info(`${WK.GenesisKey.address.toString()} -> ${WK.keys(key_count).address.toString()}`)
                    if (idx < count - 1)
                        builder.addOutput(WK.keys(key_count).address, amount);
                    else
                        builder.addOutput(WK.keys(key_count).address, sdk.JSBI.add(amount, remain));
                    key_count++;
                }
                let payload = Buffer.alloc(600);
                for (let i = 0; i < payload.length; i++)
                    payload[i] = i % 256;
                //let vote_data = new sdk.DataPayload("0x617461642065746f76");
                //builder.assignPayload(vote_data)
                res.push(builder.sign(sdk.TxType.Payment));
            }
            resolve(res);
        }
        else {
            let key_count = 80;
            let tx: sdk.Transaction;

            let res: sdk.Transaction[] = [];
            let idx: number = 0;
            let sources: Array<number> = [];
            while (idx < 8)
            {
                let source = Math.floor(Math.random() * key_count);
                while (sources.find(value => value == source) !== undefined)
                    source = Math.floor(Math.random() * key_count);
                sources.push(source);

                let destination = Math.floor(Math.random() * key_count);
                while (source === destination)
                    destination = Math.floor(Math.random() * key_count);
                let source_key_pair = WK.keys(source);
                let destination_key_pair = WK.keys(destination);

                //logger.info(`${source_key_pair.address.toString()} -> ${destination_key_pair.address.toString()}`)

                let utxos = await boa_client.getUTXOs(source_key_pair.address);
                let builder = new sdk.TxBuilder(source_key_pair);
                let utxo_manager = new sdk.UTXOManager(utxos);

                let send_amount = sdk.JSBI.multiply(sdk.JSBI.BigInt(10000000), sdk.JSBI.BigInt(Math.floor(Math.random() * 1000)));
                // Get UTXO for the amount to need.
                let spent_utxos = utxo_manager.getUTXO(send_amount, block_height);

                if (spent_utxos.length > 0)
                {
                    spent_utxos.forEach((u: sdk.UnspentTxOutput) => builder.addInput(u.utxo, u.amount));
                    tx = builder
                        .addOutput(destination_key_pair.address, send_amount)
                        .sign(sdk.TxType.Payment);
                    res.push(tx);
                    idx++
                }
            }
            resolve(res);
        }
    });
}

function createTransaction2 (): Promise<sdk.Transaction[]>
{
    return new Promise<sdk.Transaction[]>(async (resolve) => {

        let block_height: sdk.JSBI;

        try
        {
            block_height = await boa_client.getBlockHeight();
        }
        catch (ex)
        {
            block_height = sdk.JSBI.BigInt(0);
        }

        // 제네시스 블럭 키의 UTXO를 가져온다.
        if (sdk.JSBI.equal(block_height, sdk.JSBI.BigInt(0)))
        {
            if (already_use_genesis_tx)
            {
                resolve([]);
                return;
            }
            already_use_genesis_tx = true;
            let res: sdk.Transaction[] = [];
            let key_count = 1000;
            let utxos = await  boa_client.getUTXOs(WK.GenesisKey.address);
            let manager = new sdk.UTXOManager(utxos);
            let builder = new sdk.TxBuilder(WK.GenesisKey);
            let sum = manager.getSum()[0];
            logger.info(`sum: ${sum}`);
            let amount = sdk.JSBI.divide(sum, sdk.JSBI.BigInt(key_count));
            logger.info(`amount: ${amount}`);
            let remain = sdk.JSBI.subtract(sum, sdk.JSBI.multiply(amount, sdk.JSBI.BigInt(key_count)));
            logger.info(`remain: ${remain}`);
            for (let u of utxos)
                builder.addInput(u.utxo, u.amount);

            for (let idx = 0; idx < key_count; idx++) {
                if (idx < key_count-1)
                    builder.addOutput(WK.keys(idx % key_count).address, amount);
                else
                    builder.addOutput(WK.keys(idx % key_count).address, sdk.JSBI.add(amount, remain));
            }
            let payload = Buffer.alloc(600);
            for (let i = 0; i < payload.length; i++)
                payload[i] = i % 256;
            let vote_data = new sdk.DataPayload(payload);
            builder.assignPayload(vote_data)
            res.push(builder.sign(sdk.TxType.Payment));

            resolve(res);
        }
        else {
            let key_count = 80;
            let tx: sdk.Transaction;

            let res: sdk.Transaction[] = [];
            let idx: number = 0;
            let sources: Array<number> = [];
            while (idx < 8)
            {
                let source = Math.floor(Math.random() * key_count);
                while (sources.find(value => value == source) !== undefined)
                    source = Math.floor(Math.random() * key_count);
                sources.push(source);

                let destination = Math.floor(Math.random() * key_count);
                while (source === destination)
                    destination = Math.floor(Math.random() * key_count);
                let source_key_pair = WK.keys(source);
                let destination_key_pair = WK.keys(destination);

                //logger.info(`${source_key_pair.address.toString()} -> ${destination_key_pair.address.toString()}`)

                let utxos = await boa_client.getUTXOs(source_key_pair.address);
                let builder = new sdk.TxBuilder(source_key_pair);
                let utxo_manager = new sdk.UTXOManager(utxos);

                let send_amount = sdk.JSBI.multiply(sdk.JSBI.BigInt(10000000), sdk.JSBI.BigInt(Math.floor(Math.random() * 1000)));
                // Get UTXO for the amount to need.
                let spent_utxos = utxo_manager.getUTXO(send_amount, block_height);

                if (spent_utxos.length > 0)
                {
                    spent_utxos.forEach((u: sdk.UnspentTxOutput) => builder.addInput(u.utxo, u.amount));
                    tx = builder
                        .addOutput(destination_key_pair.address, send_amount)
                        .sign(sdk.TxType.Payment);
                    res.push(tx);
                    idx++
                }
            }
            resolve(res);
        }
    });
}


function createTransaction3 (): Promise<sdk.Transaction[]>
{
    return new Promise<sdk.Transaction[]>(async (resolve) => {

        let block_height: sdk.JSBI;

        try
        {
            block_height = await boa_client.getBlockHeight();
        }
        catch (ex)
        {
            block_height = sdk.JSBI.BigInt(0);
        }

        // 제네시스 블럭 키의 UTXO를 가져온다.
        if (sdk.JSBI.equal(block_height, sdk.JSBI.BigInt(0)))
        {
            if (already_use_genesis_tx)
            {
                resolve([]);
                return;
            }
            already_use_genesis_tx = true;
            let res: sdk.Transaction[] = [];
            let key_count = 10;
            let utxos = await  boa_client.getUTXOs(WK.GenesisKey.address);
            let manager = new sdk.UTXOManager(utxos);
            let builder = new sdk.TxBuilder(WK.GenesisKey);

            let payload = Buffer.alloc(600);
            for (let i = 0; i < payload.length; i++)
                payload[i] = i % 256;
            let vote_data = new sdk.DataPayload(payload);
            let fee = sdk.TxPayloadFee.getFee(vote_data.data.length);

            let sum: sdk.JSBI = manager.getSum()[0];
            logger.info(`sum: ${sum}`);
            let amount = sdk.JSBI.divide(sdk.JSBI.subtract(sum, fee), sdk.JSBI.BigInt(key_count));
            logger.info(`amount: ${amount}`);
            let remain = sdk.JSBI.subtract(sdk.JSBI.subtract(sum, fee), sdk.JSBI.multiply(amount, sdk.JSBI.BigInt(key_count)));
            logger.info(`remain: ${remain}`);
            for (let u of utxos)
                builder.addInput(u.utxo, u.amount);

            builder.assignPayload(vote_data);

            for (let idx = 0; idx < key_count; idx++) {
                if (idx < key_count-1)
                    builder.addOutput(WK.keys(idx % key_count).address, amount);
                else
                    builder.addOutput(WK.keys(idx % key_count).address, sdk.JSBI.add(amount, remain));
            }
            let tx = builder.sign(sdk.TxType.Payment, sdk.JSBI.BigInt(0), fee);
            logger.info(JSON.stringify(tx));
            //logger.info(sdk.hashFull(tx).toString());
            //logger.info(`TX_HASH (createTransaction3) : ${sdk.hashFull(tx).toString()}`);
            res.push(tx);

            resolve(res);
        }
        else {
            let key_count = 10;
            let tx: sdk.Transaction;

            let res: sdk.Transaction[] = [];
            let idx: number = 0;
            let sources: Array<number> = [];
            while (idx < 8)
            {
                let source = Math.floor(Math.random() * key_count);
                while (sources.find(value => value == source) !== undefined)
                    source = Math.floor(Math.random() * key_count);
                sources.push(source);

                let destination = Math.floor(Math.random() * key_count);
                while (source === destination)
                    destination = Math.floor(Math.random() * key_count);
                let source_key_pair = WK.keys(source);
                let destination_key_pair = WK.keys(destination);

                //logger.info(`${source_key_pair.address.toString()} -> ${destination_key_pair.address.toString()}`)

                let utxos = await boa_client.getUTXOs(source_key_pair.address);
                let builder = new sdk.TxBuilder(source_key_pair);
                let utxo_manager = new sdk.UTXOManager(utxos);

                let send_amount = sdk.JSBI.multiply(sdk.JSBI.BigInt(10000000), sdk.JSBI.BigInt(Math.floor(Math.random() * 1000)));
                // Get UTXO for the amount to need.
                let spent_utxos = utxo_manager.getUTXO(send_amount, block_height);

                if (spent_utxos.length > 0)
                {
                    spent_utxos.forEach((u: sdk.UnspentTxOutput) => builder.addInput(u.utxo, u.amount));
                    tx = builder
                        .addOutput(destination_key_pair.address, send_amount)
                        .sign(sdk.TxType.Payment);
                    res.push(tx);
                    idx++
                }
            }
            resolve(res);
        }
    });
}

function createTransaction_not_payload (): Promise<sdk.Transaction[]>
{
    return new Promise<sdk.Transaction[]>(async (resolve) => {

        let block_height: sdk.JSBI;

        try
        {
            block_height = await boa_client.getBlockHeight();
        }
        catch (ex)
        {
            block_height = sdk.JSBI.BigInt(0);
        }

        // 제네시스 블럭 키의 UTXO를 가져온다.
        if (sdk.JSBI.equal(block_height, sdk.JSBI.BigInt(0)))
        {
            if (already_use_genesis_tx)
            {
                resolve([]);
                return;
            }
            already_use_genesis_tx = true;
            let res: sdk.Transaction[] = [];
            let key_count = 10;
            let utxos = await boa_client.getUTXOs(WK.GenesisKey.address);
            let manager = new sdk.UTXOManager(utxos);
            let builder = new sdk.TxBuilder(WK.GenesisKey);

            let sum: sdk.JSBI = manager.getSum()[0];
            logger.info(`sum: ${sum}`);
            let amount = sdk.JSBI.divide(sum, sdk.JSBI.BigInt(key_count));
            logger.info(`amount: ${amount}`);
            let remain = sdk.JSBI.subtract(sum, sdk.JSBI.multiply(amount, sdk.JSBI.BigInt(key_count)));
            logger.info(`remain: ${remain}`);
            for (let u of utxos)
                builder.addInput(u.utxo, u.amount);

            for (let idx = 0; idx < key_count; idx++) {
                if (idx < key_count-1)
                    builder.addOutput(WK.keys(idx % key_count).address, amount);
                else
                    builder.addOutput(WK.keys(idx % key_count).address, sdk.JSBI.add(amount, remain));
            }
            let tx = builder.sign(sdk.TxType.Payment);
            logger.info(JSON.stringify(tx));
            //logger.info(sdk.hashFull(tx).toString());
            //logger.info(`TX_HASH (createTransaction3) : ${sdk.hashFull(tx).toString()}`);
            res.push(tx);

            resolve(res);
        }
        else {
            let key_count = 10;
            let tx: sdk.Transaction;

            let res: sdk.Transaction[] = [];
            let idx: number = 0;
            let sources: Array<number> = [];
            while (idx < 8)
            {
                let source = Math.floor(Math.random() * key_count);
                while (sources.find(value => value == source) !== undefined)
                    source = Math.floor(Math.random() * key_count);
                sources.push(source);

                let destination = Math.floor(Math.random() * key_count);
                while (source === destination)
                    destination = Math.floor(Math.random() * key_count);
                let source_key_pair = WK.keys(source);
                let destination_key_pair = WK.keys(destination);

                //logger.info(`${source_key_pair.address.toString()} -> ${destination_key_pair.address.toString()}`)

                let utxos = await boa_client.getUTXOs(source_key_pair.address);
                let builder = new sdk.TxBuilder(source_key_pair);
                let utxo_manager = new sdk.UTXOManager(utxos);

                let send_amount = sdk.JSBI.multiply(sdk.JSBI.BigInt(10000000), sdk.JSBI.BigInt(Math.floor(Math.random() * 1000)));
                // Get UTXO for the amount to need.
                let spent_utxos = utxo_manager.getUTXO(send_amount, block_height);

                if (spent_utxos.length > 0)
                {
                    spent_utxos.forEach((u: sdk.UnspentTxOutput) => builder.addInput(u.utxo, u.amount));
                    tx = builder
                        .addOutput(destination_key_pair.address, send_amount)
                        .sign(sdk.TxType.Payment);
                    res.push(tx);
                    idx++
                }
            }
            resolve(res);
        }
    });
}

function wait (interval: number): Promise<void>
{
    return new Promise<void>((resolve) => {
        setTimeout(() => {
            resolve();
        }, interval)
    })
}

function makeBlock(): Promise<void>
{
    return new Promise<void>(async (resolve) =>
    {
        logger.info(`Started`);

        let height = await boa_client.getBlockHeight();
        logger.info(`Current height is ${height}`);

        let txs = await createTransaction_not_payload();

        if (txs.length === 0) {
            await wait(5000);
        } else {
            for (let tx of txs) {
                //logger.info(JSON.stringify(tx));
                logger.info(`TX_HASH (send) : ${sdk.hashFull(tx).toString()}`);
                try {
                    await boa_client.sendTransaction(tx);
                } catch (e)
                {
                    logger.info(e);
                }
                await wait(15000);
            }
        }

        logger.info(`Fished`);

        resolve();
    });
}

(async () => {
    await prepare();
    WK.make();
    for (let idx = 0; idx < 1000; idx++)
    {
        await makeBlock();
    }
})();
