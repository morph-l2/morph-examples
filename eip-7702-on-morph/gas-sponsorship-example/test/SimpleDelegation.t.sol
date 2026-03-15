// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Test, console} from "forge-std/Test.sol";
import {SimpleDelegation} from "../src/SimpleDelegation.sol";

contract SimpleDelegationTest is Test {
    /// @dev Test EOA private key and address
    uint256 constant EOA_PK = 0xA11CE;
    address payable eoa;

    /// @dev Deployed implementation (for getting bytecode)
    SimpleDelegation impl;

    /// @dev Recipient for test transfers
    address recipient = makeAddr("recipient");

    function setUp() public {
        eoa = payable(vm.addr(EOA_PK));
        impl = new SimpleDelegation();

        // Simulate EIP-7702: set EOA's code to SimpleDelegation bytecode
        vm.etch(eoa, address(impl).code);

        // Fund the EOA with some ETH
        vm.deal(eoa, 10 ether);
    }

    function test_sponsoredGasTransfer() public {
        // 1. Build the calls: EOA wants to send 0.1 ETH to recipient
        SimpleDelegation.Call[] memory calls = new SimpleDelegation.Call[](1);
        calls[0] = SimpleDelegation.Call({
            to: recipient,
            value: 0.1 ether,
            data: ""
        });

        // 2. EOA signs the operation off-chain
        uint256 currentNonce = SimpleDelegation(eoa).nonce();
        bytes32 digest = _computeDigest(calls, currentNonce);
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(EOA_PK, digest);
        bytes memory signature = abi.encodePacked(r, s, v);

        // 3. Sponsor submits the transaction (pays gas)
        address sponsor = makeAddr("sponsor");
        vm.deal(sponsor, 1 ether);

        uint256 eoaBalanceBefore = eoa.balance;
        vm.prank(sponsor);
        SimpleDelegation(eoa).execute(calls, currentNonce, signature);

        // 4. Verify results
        assertEq(recipient.balance, 0.1 ether, "Recipient should receive 0.1 ETH");
        assertEq(eoa.balance, eoaBalanceBefore - 0.1 ether, "EOA balance should decrease by transfer amount only");
        assertEq(SimpleDelegation(eoa).nonce(), 1, "Nonce should increment");
    }

    function test_sponsoredBatchCalls() public {
        address recipient2 = makeAddr("recipient2");

        // Batch: send 0.1 ETH to recipient and 0.2 ETH to recipient2
        SimpleDelegation.Call[] memory calls = new SimpleDelegation.Call[](2);
        calls[0] = SimpleDelegation.Call({to: recipient, value: 0.1 ether, data: ""});
        calls[1] = SimpleDelegation.Call({to: recipient2, value: 0.2 ether, data: ""});

        uint256 currentNonce = SimpleDelegation(eoa).nonce();
        bytes32 digest = _computeDigest(calls, currentNonce);
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(EOA_PK, digest);
        bytes memory signature = abi.encodePacked(r, s, v);

        address sponsor = makeAddr("sponsor");
        vm.prank(sponsor);
        SimpleDelegation(eoa).execute(calls, currentNonce, signature);

        assertEq(recipient.balance, 0.1 ether);
        assertEq(recipient2.balance, 0.2 ether);
    }

    function test_revertInvalidSignature() public {
        SimpleDelegation.Call[] memory calls = new SimpleDelegation.Call[](1);
        calls[0] = SimpleDelegation.Call({to: recipient, value: 0.1 ether, data: ""});

        uint256 currentNonce = SimpleDelegation(eoa).nonce();

        // Sign with wrong key
        uint256 WRONG_PK = 0xDEAD;
        bytes32 digest = _computeDigest(calls, currentNonce);
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(WRONG_PK, digest);
        bytes memory signature = abi.encodePacked(r, s, v);

        vm.expectRevert(SimpleDelegation.InvalidSignature.selector);
        SimpleDelegation(eoa).execute(calls, currentNonce, signature);
    }

    function test_revertReplayAttack() public {
        SimpleDelegation.Call[] memory calls = new SimpleDelegation.Call[](1);
        calls[0] = SimpleDelegation.Call({to: recipient, value: 0.1 ether, data: ""});

        uint256 currentNonce = SimpleDelegation(eoa).nonce();
        bytes32 digest = _computeDigest(calls, currentNonce);
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(EOA_PK, digest);
        bytes memory signature = abi.encodePacked(r, s, v);

        // First execution succeeds
        SimpleDelegation(eoa).execute(calls, currentNonce, signature);

        // Replay with same signature fails (nonce already used)
        vm.expectRevert(SimpleDelegation.InvalidNonce.selector);
        SimpleDelegation(eoa).execute(calls, currentNonce, signature);
    }

    /// @dev Reproduce the same digest computation as the contract
    function _computeDigest(SimpleDelegation.Call[] memory calls, uint256 _nonce) internal view returns (bytes32) {
        bytes32 dataHash = keccak256(abi.encode(
            calls,
            _nonce,
            block.chainid,
            eoa
        ));
        return keccak256(abi.encodePacked(
            "\x19Ethereum Signed Message:\n32",
            dataHash
        ));
    }
}
