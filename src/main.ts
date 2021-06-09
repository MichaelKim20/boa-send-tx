import * as sdk from 'boa-sdk-ts';

import { logger, Logger } from './modules/common/Logger';
import { Config } from './modules/common/Config';
import { prepare, wait } from './modules/utils/Process';
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

function createTransaction (height: sdk.JSBI): Promise<sdk.Transaction[]>
{
    return new Promise<sdk.Transaction[]>(async (resolve, reject) => {
        try
        {
            // 제네시스 블럭 키의 UTXO를 가져온다.
            if (sdk.JSBI.equal(height, sdk.JSBI.BigInt(0)))
            {
                if (already_use_genesis_tx)
                    return resolve([]);

                already_use_genesis_tx = true;
                let res: sdk.Transaction[] = [];
                let key_count = config.process.key_count;
                let utxos: Array<sdk.UnspentTxOutput>;
                try {
                    utxos = await boa_client.getUTXOs(WK.GenesisKey.address);
                } catch (e) {
                    logger.error(e);
                    return reject(e);
                }
                if (utxos.length < 1)
                    return resolve([]);

                let count = utxos.length-1;
                let tx_out_count = Math.ceil(key_count / count);

                for (let idx = 0; idx < count; idx++)
                {
                    let tx_sz = sdk.Transaction.getEstimatedNumberOfBytes(1, tx_out_count, 0);
                    let fees = await boa_client.getTransactionFee(tx_sz);
                    let fee = sdk.JSBI.BigInt(fees.medium);

                    let sum: sdk.JSBI = sdk.JSBI.subtract(utxos[idx].amount, fee);
                    let amount = sdk.JSBI.divide(sum, sdk.JSBI.BigInt(tx_out_count));
                    let remain = sdk.JSBI.subtract(sum, sdk.JSBI.multiply(amount, sdk.JSBI.BigInt(tx_out_count)));

                    let builder = new sdk.TxBuilder(WK.GenesisKey);
                    builder.addInput(utxos[idx].utxo, utxos[idx].amount);
                    for (let key_idx = 0; key_idx < tx_out_count; key_idx++) {
                        if (key_idx < tx_out_count - 1)
                            builder.addOutput(WK.keys((idx * tx_out_count) + key_idx).address, amount);
                        else
                            builder.addOutput(WK.keys((idx * tx_out_count) + key_idx).address, sdk.JSBI.add(amount, remain));
                    }
                    let tx = builder.sign(sdk.OutputType.Payment, fee);
                    res.push(tx);
                }

                {
                    let validators = [
                        WK.NODE2().address,
                        WK.NODE3().address,
                        WK.NODE4().address,
                        WK.NODE5().address,
                        WK.NODE6().address,
                        WK.NODE7().address,
                        WK.NODE2().address,
                        WK.NODE3().address,
                        WK.NODE4().address,
                        WK.NODE5().address,
                        WK.NODE6().address,
                        WK.NODE7().address,
                        WK.NODE2().address,
                        WK.NODE3().address,
                        WK.NODE4().address,
                        WK.NODE5().address,
                        WK.NODE6().address,
                        WK.NODE7().address,
                        WK.NODE2().address,
                        WK.NODE3().address,
                        WK.NODE4().address,
                        WK.NODE5().address,
                        WK.NODE6().address,
                        WK.NODE7().address,
                        WK.NODE2().address,
                        WK.NODE3().address,
                        WK.NODE4().address,
                        WK.NODE5().address,
                        WK.NODE6().address,
                        WK.NODE7().address
                    ];
                    let tx_sz = sdk.Transaction.getEstimatedNumberOfBytes(1, validators.length, 0);
                    let fees = await boa_client.getTransactionFee(tx_sz);
                    let fee = sdk.JSBI.BigInt(fees.medium);

                    let idx = utxos.length - 1;
                    let sum: sdk.JSBI = sdk.JSBI.subtract(utxos[idx].amount, fee);
                    let amount = sdk.JSBI.divide(sum, sdk.JSBI.BigInt(validators.length));
                    let remain = sdk.JSBI.subtract(sum, sdk.JSBI.multiply(amount, sdk.JSBI.BigInt(validators.length)));
                    let builder = new sdk.TxBuilder(WK.GenesisKey);
                    builder.addInput(utxos[idx].utxo, utxos[idx].amount);
                    for (let key_idx = 0; key_idx < validators.length; key_idx++) {
                        if (key_idx < validators.length - 1)
                            builder.addOutput(validators[key_idx], amount);
                        else
                            builder.addOutput(validators[key_idx], sdk.JSBI.add(amount, remain));
                    }
                    let tx = builder.sign(sdk.OutputType.Payment, fee);
                    res.unshift(tx);
                }

                return resolve(res);
            }
            else if (!config.process.only_genesis) {
                let key_count = config.process.key_count;
                let tx: sdk.Transaction;

                let res: sdk.Transaction[] = [];
                let idx: number = 0;
                let sources: Array<number> = [];
                while (idx < 1) {
                    let utxos: Array<sdk.UnspentTxOutput> = [];
                    let source = Math.floor(Math.random() * key_count);
                    while (sources.find(value => value == source) !== undefined)
                        source = Math.floor(Math.random() * key_count);
                    sources.push(source);
                    let source_key_pair = WK.keys(source);
                    try {
                        utxos = await boa_client.getUTXOs(source_key_pair.address);
                    } catch (e) {
                    }
                    if (utxos.length === 0)
                        continue;

                    let destination = Math.floor(Math.random() * key_count);
                    while (source === destination)
                        destination = Math.floor(Math.random() * key_count);
                    let destination_key_pair = WK.keys(destination);

                    let builder = new sdk.TxBuilder(source_key_pair);
                    let utxo_manager = new sdk.UTXOManager(utxos);

                    let sum = utxo_manager.getSum()[0];
                    if (sdk.JSBI.lessThanOrEqual(sum, sdk.JSBI.BigInt(0)))
                        continue;

                    let tx_sz = sdk.Transaction.getEstimatedNumberOfBytes(2, 2, 0);
                    let fees = await boa_client.getTransactionFee(tx_sz);
                    let fee = sdk.JSBI.BigInt(fees.medium);

                    let range = sdk.JSBI.BigInt(Math.floor(Math.random() * 50) + 20);
                    let send_amount = sdk.JSBI.divide(sdk.JSBI.multiply(sum, range), sdk.JSBI.BigInt(100));

                    logger.info(`Sender: ${source_key_pair.address.toString()}, Receiver: ${destination_key_pair.address.toString()}, amount: ${send_amount.toString()}`);

                    // Get UTXO for the amount to need.
                    let spent_utxos = utxo_manager.getUTXO(sdk.JSBI.add(send_amount, fee), height);
                    if (spent_utxos.length > 0) {

                        tx_sz = sdk.Transaction.getEstimatedNumberOfBytes(spent_utxos.length, 2, 0);
                        fees = await boa_client.getTransactionFee(tx_sz);
                        fee = sdk.JSBI.BigInt(fees.medium);

                        spent_utxos.forEach((u: sdk.UnspentTxOutput) => builder.addInput(u.utxo, u.amount));
                        tx = builder
                            .addOutput(destination_key_pair.address, send_amount)
                            .sign(sdk.OutputType.Payment, fee);
                        res.push(tx);
                        idx++
                    }
                }
                return resolve(res);
            }
            else {
                resolve([]);
            }
        }
        catch (e)
        {
            reject(e);
        }
    });
}

function makeBlock(): Promise<void>
{
    return new Promise<void>(async (resolve, reject) =>
    {
        try
        {
            let height: sdk.JSBI = sdk.JSBI.BigInt(0);
            try {
                height = await boa_client.getBlockHeight();
            } catch (e) {
                logger.error(e);
                return reject(e);
            }

            let txs = await createTransaction(height);
            if (txs.length === 0) {
                await wait(5000);
            } else {
                for (let tx of txs) {
                    logger.info(`TX_HASH (send / ${height.toString()}) : ${sdk.hashFull(tx).toString()}`);
                    try {
                        await boa_client.sendTransaction(tx);
                    } catch (e)
                    {
                        logger.error(e);
                    }
                    await wait(config.process.delay);
                }
            }
            return resolve();
        }
        catch (e)
        {
            return reject(e);
        }
    });
}

(async () => {
    await prepare();
    WK.make();
    logger.info(`Started`);
    await wait(3000);
    if (config.process.enable)
    {
        for (let idx = 0; idx < 100000; idx++)
        {
            try {
                await makeBlock();
            } catch (e) {
            }
        }
    }
    logger.info(`Fished`);
})();
