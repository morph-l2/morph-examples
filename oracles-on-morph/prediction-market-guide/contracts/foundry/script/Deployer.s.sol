// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script, console} from "forge-std/Script.sol";
import {CryptoPredictionsMarket} from "../src/market.sol";
import {OkidoToken} from "../src/token.sol";



contract DeployerScript is Script {
    function setUp() public {}

   function run() public returns (CryptoPredictionsMarket)  {
        vm.startBroadcast();
        OkidoToken token = new OkidoToken(1000000);
        CryptoPredictionsMarket market = new CryptoPredictionsMarket(address(token), 0x2880aB155794e7179c9eE2e38200202908C17B43);
 
        vm.stopBroadcast();

         return market;

    }
}

// To deploy, run
// source .env
// forge script script/Deployer.s.sol --rpc-url $RPC_URL --broadcast --legacy --private-key $PRIVATE_KEY