import * as sdk from "boa-sdk-ts";
import { BOASodium } from 'boa-sodium-ts';

export function prepare (): Promise<void>
{
    return new Promise<void>((resolve) => {
        sdk.SodiumHelper.assign(new BOASodium());
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

export function wait (interval: number): Promise<void>
{
    return new Promise<void>((resolve) => {
        setTimeout(() => {
            resolve();
        }, interval)
    })
}
