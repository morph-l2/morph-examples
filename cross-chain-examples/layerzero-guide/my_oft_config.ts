import { EndpointId } from '@layerzerolabs/lz-definitions'
const morph_holeskyContract = {
    eid: EndpointId.MORPH_V2_TESTNET,
    contractName: 'MyOFT',
}
const sepolia_testnetContract = {
    eid: EndpointId.SEPOLIA_V2_TESTNET,
    contractName: 'MyOFT',
}
export default {
    contracts: [{ contract: morph_holeskyContract }, { contract: sepolia_testnetContract }],
    connections: [
        {
            from: morph_holeskyContract,
            to: sepolia_testnetContract,
            config: {
                sendLibrary: '0xd682ECF100f6F4284138AA925348633B0611Ae21',
                receiveLibraryConfig: { receiveLibrary: '0xcF1B0F4106B0324F96fEfcC31bA9498caa80701C', gracePeriod: 0 },
                sendConfig: {
                    executorConfig: { maxMessageSize: 10000, executor: '0x701f3927871EfcEa1235dB722f9E608aE120d243' },
                    ulnConfig: {
                        confirmations: 1,
                        requiredDVNs: ['0xF49d162484290EAeAd7bb8C2c7E3a6f8f52e32d6'],
                        optionalDVNs: [],
                        optionalDVNThreshold: 0,
                    },
                },
                receiveConfig: {
                    ulnConfig: {
                        confirmations: 2,
                        requiredDVNs: ['0xF49d162484290EAeAd7bb8C2c7E3a6f8f52e32d6'],
                        optionalDVNs: [],
                        optionalDVNThreshold: 0,
                    },
                },
            },
        },
        {
            from: sepolia_testnetContract,
            to: morph_holeskyContract,
            config: {
                sendLibrary: '0xcc1ae8Cf5D3904Cef3360A9532B477529b177cCE',
                receiveLibraryConfig: { receiveLibrary: '0xdAf00F5eE2158dD58E0d3857851c432E34A3A851', gracePeriod: 0 },
                sendConfig: {
                    executorConfig: { maxMessageSize: 10000, executor: '0x718B92b5CB0a5552039B593faF724D182A881eDA' },
                    ulnConfig: {
                        confirmations: 2,
                        requiredDVNs: ['0x8eebf8b423B73bFCa51a1Db4B7354AA0bFCA9193'],
                        optionalDVNs: [],
                        optionalDVNThreshold: 0,
                    },
                },
                receiveConfig: {
                    ulnConfig: {
                        confirmations: 1,
                        requiredDVNs: ['0x8eebf8b423B73bFCa51a1Db4B7354AA0bFCA9193'],
                        optionalDVNs: [],
                        optionalDVNThreshold: 0,
                    },
                },
            },
        },
    ],
}
