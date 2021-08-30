import * as sdk from 'boa-sdk-ts';
import { WK } from '../src/modules/utils/WK';
import {BOASodium} from "boa-sodium-ts";
import moment from "moment";
import moment_tz from "moment-timezone";

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

describe("Test2", () => {
    before("Wait for the package libsodium to finish loading", () => {
        sdk.SodiumHelper.assign(new BOASodium());
        return sdk.SodiumHelper.init();
    });

    before("Make Key", () => {
        WK.make();
    });

    it("Test 2", () => {
        for (let key of WK._keys) {
            console.log(key.secret.toString(false));
            console.log(key.address.toString());
        }
    });

    it("Test 3", () => {
        console.log(WK.NODE2().secret.toString(false));
        console.log(WK.NODE2().address.toString());
        console.log(WK.NODE3().secret.toString(false));
        console.log(WK.NODE3().address.toString());
        console.log(WK.NODE4().secret.toString(false));
        console.log(WK.NODE4().address.toString());
        console.log(WK.NODE5().secret.toString(false));
        console.log(WK.NODE5().address.toString());
        console.log(WK.NODE6().secret.toString(false));
        console.log(WK.NODE6().address.toString());
        console.log(WK.NODE7().secret.toString(false));
        console.log(WK.NODE7().address.toString());
        console.log(WK.CommonsBudget().address.toString());
    });
});

describe("Test3", () => {

    it("Test 3", () => {
        console.log(moment().utc());
        console.log(moment_tz().utc());
        console.log(new Date().getTime())
    });
});
