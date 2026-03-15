// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script, console} from "forge-std/Script.sol";
import {SimpleDelegation} from "../src/SimpleDelegation.sol";

contract DeployScript is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("DEPLOYER_PRIVATE_KEY");

        vm.startBroadcast(deployerPrivateKey);

        SimpleDelegation delegation = new SimpleDelegation();

        vm.stopBroadcast();

        console.log("SimpleDelegation deployed at:", address(delegation));
    }
}
