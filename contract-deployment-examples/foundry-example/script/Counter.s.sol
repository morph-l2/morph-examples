// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;

import {Script, console2} from "forge-std/Script.sol";
import {Counter} from "../src/Counter.sol";

contract CounterScript is Script {
    function run() external returns (Counter) {
       vm.startBroadcast();

       Counter counter = new Counter();

       vm.stopBroadcast();
       return counter;
   }

   // To deploy the contract, run the following command:
   // source .env
   // forge script script/Counter.s.sol:CounterScript --rpc-url $RPC_URL --broadcast --legacy --private-key $PRIVATE_KEY
}