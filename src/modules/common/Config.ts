/*******************************************************************************

    Define the configuration objects that are used through the application

    Copyright:
        Copyright (c) 2020-2021 BOSAGORA Foundation
    All rights reserved.

    License:
        MIT License. See LICENSE for details.

*******************************************************************************/

import { Utils } from 'boa-sdk-ts';

import {ArgumentParser} from 'argparse';
import extend from 'extend';
import fs from "fs";
import path from 'path';
import { URL } from 'url';
import yaml from 'js-yaml';

/**
 * Main config
 */
export class Config implements IConfig
{
    /**
     * Server config
     */
    public server: ServerConfig;

    /**
     * Logging config
     */
    public logging: LoggingConfig;

    public process: ProcessConfig;

    /**
     * Constructor
     */
    constructor ()
    {
        this.server = new ServerConfig();
        this.logging = new LoggingConfig();
        this.process = new ProcessConfig();
    }

    /**
     * Reads from file
     * @param config_file The file name of configuration
     */
    public readFromFile (config_file: string)
    {
        let config_content = fs.readFileSync(path.resolve(Utils.getInitCWD(), config_file), 'utf8');
        this.readFromString(config_content);
    }

    /**
     * Reads from string
     * @param config_content The content of configuration
     */
    public readFromString (config_content: string)
    {
        const cfg = yaml.safeLoad(config_content) as IConfig;
        this.server.readFromObject(cfg.server);
        this.logging.readFromObject(cfg.logging);
        this.process.readFromObject(cfg.process);
    }

    /**
     * Parses the command line arguments, Reads from the configuration file
     */
    public static createWithArgument (): Config
    {
        // Parse the arguments
        const parser = new ArgumentParser();
        parser.add_argument('-c', '--config', {
            default: "config.yaml",
            help: "Path to the config file to use",
        });
        let args = parser.parse_args();

        const configPath = path.resolve(Utils.getInitCWD(), args.config);
        if (!fs.existsSync(configPath)) {
            console.error(`Config file '${configPath}' does not exists`);
            process.exit(1);
        }

        let cfg = new Config();
        try
        {
            cfg.readFromFile(configPath);
        }
        catch (error)
        {
            // Logging setup has not been completed and is output to the console.
            console.error(error.message);

            // If the process fails to read the configuration file, the process exits.
            process.exit(1);
        }
        return cfg;
    }
}

export class ProcessConfig implements IProcessConfig
{
    public enable: boolean;

    public only_genesis: boolean

    public delay : number;

    public key_count: number;

    constructor (enable?: boolean, only_genesis?: boolean, delay?: number, key_count?: number)
    {
        let conf = extend(true, {}, ProcessConfig.defaultValue());
        extend(true, conf, {enable: enable, only_genesis: only_genesis, delay : delay, key_count: key_count});

        this.enable = conf.enable;
        this.only_genesis = conf.only_genesis;
        this.delay = conf.delay;
        this.key_count = conf.key_count;
    }

    /**
     * Reads from Object
     * @param config The object of IServerConfig
     */
    public readFromObject (config: IProcessConfig)
    {
        let conf = extend(true, {}, ProcessConfig.defaultValue());
        extend(true, conf, config);

        this.enable = conf.enable;
        this.only_genesis = conf.only_genesis;
        this.delay = conf.delay;
        this.key_count = conf.key_count;
    }

    /**
     * Returns default value
     */
    public static defaultValue (): IProcessConfig
    {
        return {
            enable: true,
            only_genesis: false,
            delay: 3000,
            key_count: 1000
        }
    }
}

/**
 * Server config
 */
export class ServerConfig implements IServerConfig
{
    /**
     * THe address to which we bind
     */
    public stoa_endpoint: URL;

    /**
     * The endpoint of Agora
     */
    public agora_endpoint: URL;

    /**
     * Constructor
     * @param address The address to which we bind
     * @param port The port on which we bind
     * @param agora_endpoint The endpoint of Agora
     */
    constructor (stoa_endpoint?: string, agora_endpoint?: string)
    {
        let conf = extend(true, {}, ServerConfig.defaultValue());
        extend(true, conf, {stoa_endpoint: stoa_endpoint, agora_endpoint: agora_endpoint});

        this.stoa_endpoint = conf.stoa_endpoint;
        this.agora_endpoint = conf.agora_endpoint;
    }

    /**
     * Reads from Object
     * @param config The object of IServerConfig
     */
    public readFromObject (config: IServerConfig)
    {
        let conf = extend(true, {}, ServerConfig.defaultValue());
        extend(true, conf, config);

        this.stoa_endpoint = conf.stoa_endpoint;
        this.agora_endpoint = conf.agora_endpoint;
    }

    /**
     * Returns default value
     */
    public static defaultValue (): IServerConfig
    {
        return {
            stoa_endpoint: new URL("http://127.0.0.1:3836"),
            agora_endpoint: new URL("http://127.0.0.1:2826")
        }
    }
}

/**
 * Logging config
 */
export class LoggingConfig implements ILoggingConfig
{
    /**
     * The path of logging files
     */
    public folder: string;

    /**
     * The level of logging
     */
    public level: string;

    /**
     * Whether the console is enabled as well
     */
    public console: boolean;

    /**
     * Constructor
     */
    constructor ()
    {
        const defaults = LoggingConfig.defaultValue();
        this.folder = path.resolve(Utils.getInitCWD(), defaults.folder);
        this.level = defaults.level;
        this.console = defaults.console;
    }

    /**
     * Reads from Object
     * @param config The object of ILoggingConfig
     */
    public readFromObject (config: ILoggingConfig)
    {
        if (config.folder)
            this.folder = path.resolve(Utils.getInitCWD(), config.folder);
        if (config.level)
            this.level = config.level;
        if (config.console !== undefined)
            this.console = config.console;
    }

    /**
     * Returns default value
     */
    public static defaultValue (): ILoggingConfig
    {
        return {
            folder: path.resolve(Utils.getInitCWD(), "logs/"),
            level: "info",
            console: false
        }
    }
}

export interface IProcessConfig
{
    enable: boolean;

    only_genesis: boolean

    delay : number;

    key_count: number;
}

/**
 * The interface of server config
 */
export interface IServerConfig
{
    /**
     * The endpoint of Stoa
     */
    stoa_endpoint: URL;

    /**
     * The endpoint of Agora
     */
    agora_endpoint: URL;
}

/**
 * The interface of logging config
 */
export interface ILoggingConfig
{
    /**
     * The path of logging files
     */
    folder: string;

    /**
     * The level of logging
     */
    level: string;

    /**
     * Whether the console is enabled as well
     */
    console: boolean;
}

/**
 * The interface of main config
 */
export interface IConfig
{
    /**
     * Server config
     */
    server: IServerConfig;

    /**
     * Logging config
     */
    logging: ILoggingConfig;


    process: IProcessConfig;
}
