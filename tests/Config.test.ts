/*******************************************************************************

    Test that parses config.

    Copyright:
        Copyright (c) 2020-2021 BOSAGORA Foundation
        All rights reserved.

    License:
        MIT License. See LICENSE for details.

 *******************************************************************************/

import { Config } from '../src/modules/common/Config';

import * as assert from 'assert';

describe('Test of Config', () => {
    it ('Test parsing the settings of a string', () => {
        let config_content =
            [
                "server:",
                "   stoa_endpoint: http://127.0.0.1:3826",
                "   agora_endpoint: http://127.0.0.1:2826",
                "logging:",
                "   folder: /stoa/logs/",
                "   level: debug",
                "process:",
                "   enable: true",
                "   only_genesis: true",
                "   delay: 1000",
                "   key_count: 100"
            ].join("\n");
        let config: Config = new Config();
        config.readFromString(config_content);
        assert.strictEqual(config.server.stoa_endpoint, "http://127.0.0.1:3826");
        assert.strictEqual(config.server.agora_endpoint.toString(), "http://127.0.0.1:2826");

        assert.strictEqual(config.logging.folder, "/stoa/logs");
        assert.strictEqual(config.logging.level, "debug");

        assert.strictEqual(config.process.enable, true);
        assert.strictEqual(config.process.only_genesis, true);
        assert.strictEqual(config.process.delay, 1000);
        assert.strictEqual(config.process.key_count, 100);
    });
});
