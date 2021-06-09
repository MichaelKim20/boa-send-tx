import * as sdk from 'boa-sdk-ts';
import { WK } from '../src/modules/utils/WK';
import {BOASodium} from "boa-sodium-ts";

import * as assert from 'assert';

describe ('Test1', () =>
{
    before('Wait for the package libsodium to finish loading', () =>
    {
        sdk.SodiumHelper.assign(new BOASodium());
        return sdk.SodiumHelper.init();
    });

    before('Make Key', () =>
    {
        WK.make();
    });
});
