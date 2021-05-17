import { Transaction, Block } from 'boa-sdk-ts';

export class Genesis
{
    private static data =
        {
            "header": {
                "prev_block": "0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
                "merkle_root": "0xb33f170692b3db7f3b172b3d2c0c6b01eef033c0b3023e36ad24adacf2bb28732caf313ed873fa9b1dcc058b198a909c065181d9eb36559c5b71c85eba7f0e34",
                "random_seed": "0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
                "signature": "0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
                "validators": "[0]",
                "height": "0",
                "enrollments": [
                    {
                        "utxo_key": "0x1da29910b5ed5b9ea3bd4207016f485f763b44bd289444a4cef77faa96480d6833ce0b215c3ed6e00e9119352e49bb3e04054e0fca5fef35aeb47a9e425d7ddf",
                        "commitment": "0x87b84a41392a6de113dfebf8374de46e5b65dcdcfbb00d49804b5b198ed984bf67d736bf26812160a6e36f02ea040d305dc2f82a5dfb7006b772da4db395eb7b",
                        "cycle_length": 20,
                        "enroll_sig": "0x7c07d85a9d03fb09b20de2cad0b37f244790e13e525ebd898caa0b5e8bc8cb68081ee969fc1360c64ad7ca923ad3fac2cbfc0b51c21581cbdc75ddb7783b9c99"
                    }
                ],
                "missing_validators": [],
                "time_offset": 0
            },
            "txs": [
                {
                    "type": 0,
                    "inputs": [],
                    "outputs": [
                        {
                            "value": "610000000000000",
                            "lock": {
                                "type": 0,
                                "bytes": "zEaSXFXP+MEkXNzY/PKqJVlDr3SqEllx8QiEL/o+uII="
                            }
                        },
                        {
                            "value": "610000000000000",
                            "lock": {
                                "type": 0,
                                "bytes": "zEaSXFXP+MEkXNzY/PKqJVlDr3SqEllx8QiEL/o+uII="
                            }
                        },
                        {
                            "value": "610000000000000",
                            "lock": {
                                "type": 0,
                                "bytes": "zEaSXFXP+MEkXNzY/PKqJVlDr3SqEllx8QiEL/o+uII="
                            }
                        },
                        {
                            "value": "610000000000000",
                            "lock": {
                                "type": 0,
                                "bytes": "zEaSXFXP+MEkXNzY/PKqJVlDr3SqEllx8QiEL/o+uII="
                            }
                        },
                        {
                            "value": "610000000000000",
                            "lock": {
                                "type": 0,
                                "bytes": "zEaSXFXP+MEkXNzY/PKqJVlDr3SqEllx8QiEL/o+uII="
                            }
                        },
                        {
                            "value": "610000000000000",
                            "lock": {
                                "type": 0,
                                "bytes": "zEaSXFXP+MEkXNzY/PKqJVlDr3SqEllx8QiEL/o+uII="
                            }
                        },
                        {
                            "value": "610000000000000",
                            "lock": {
                                "type": 0,
                                "bytes": "zEaSXFXP+MEkXNzY/PKqJVlDr3SqEllx8QiEL/o+uII="
                            }
                        },
                        {
                            "value": "610000000000000",
                            "lock": {
                                "type": 0,
                                "bytes": "zEaSXFXP+MEkXNzY/PKqJVlDr3SqEllx8QiEL/o+uII="
                            }
                        }
                    ],
                    "payload": {"bytes":""},
                    "lock_height": "0"
                },
                {
                    "type": 1,
                    "inputs": [],
                    "outputs": [
                        {
                            "value": "20000000000000",
                            "lock": {
                                "type": 0,
                                "bytes": "2uGTSQ292nrVQ4ko7dNNCuO88yIXw0ENGHbKh9zqrgM="
                            }
                        },
                        {
                            "value": "20000000000000",
                            "lock": {
                                "type": 0,
                                "bytes": "2uGTbqv7n1m83anEqqNPnS1Y2c7euO7lJj4tSroc8z0="
                            }
                        },
                        {
                            "value": "20000000000000",
                            "lock": {
                                "type": 0,
                                "bytes": "2uGTl8KW5Ui+cDMe3vHwJyJ2hZ0ysRzzKljiEWWRGDY="
                            }
                        },
                        {
                            "value": "20000000000000",
                            "lock": {
                                "type": 0,
                                "bytes": "2uGTpBlHGfcGVpjs6Jsirf8IPm4fEFL6FbVGT5ra7WE="
                            }
                        },
                        {
                            "value": "20000000000000",
                            "lock": {
                                "type": 0,
                                "bytes": "2uGTzPrSXYxJ0oCAtuo6kDBMs/zZcQXkWcjyFFlu0X0="
                            }
                        },
                        {
                            "value": "20000000000000",
                            "lock": {
                                "type": 0,
                                "bytes": "2uGT7+ya0+sVo6ohySeAdjX7lf+hSRNV7iLceOZXMN8="
                            }
                        }
                    ],
                    "payload": {"bytes":""},
                    "lock_height": "0"
                }
            ],
            "merkle_tree": [
                "0x4ef4f7195db2e20f36b46cb3cda1f529b77e2cd8423241d1a4a779f3d7845d4f6543a6147956bf4fe52d5f5925a04102de59b2854f90fb3e8cc1a0e85fe9b11d",
                "0xb8f5a5f4544e75b5837a370d0070361aaaf97d3b02070d3d9845598c5f55105b6bd9ac8e9c53e74679db77cb512ffd88a9916754744f6b5eb2a812929651f84f",
                "0xb33f170692b3db7f3b172b3d2c0c6b01eef033c0b3023e36ad24adacf2bb28732caf313ed873fa9b1dcc058b198a909c065181d9eb36559c5b71c85eba7f0e34"
            ]
        }
    ;

    public static block (): Block
    {
        return Block.reviver("", Genesis.data);
    }

    public static transaction (): Transaction
    {
        return Genesis.block().txs[0];
    }
}
