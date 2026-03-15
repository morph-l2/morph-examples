// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/// @title SimpleDelegation
/// @notice A minimal EIP-7702 delegation contract for gas sponsorship demo
/// @dev EOA delegates its code to this contract via EIP-7702, then a sponsor
///      can submit transactions on behalf of the EOA (paying gas).
///      The EOA signs each operation off-chain to prove intent.
contract SimpleDelegation {
    /// @notice Replay protection nonce (stored in EOA's storage via delegatecall)
    uint256 public nonce;

    struct Call {
        address to;
        uint256 value;
        bytes data;
    }

    event Executed(address indexed sender, uint256 nonce, uint256 callCount);

    error InvalidSignature();
    error InvalidNonce();
    error CallFailed(uint256 index);

    /// @notice Execute a batch of calls, verified by EOA's signature
    /// @dev Anyone (sponsor) can call this, but the signature must be from the EOA
    ///      (address(this) in delegatecall context == EOA address)
    /// @param calls Array of calls to execute
    /// @param _nonce Expected nonce for replay protection
    /// @param signature EOA's ECDSA signature over the operation hash
    function execute(
        Call[] calldata calls,
        uint256 _nonce,
        bytes calldata signature
    ) external {
        if (_nonce != nonce) revert InvalidNonce();

        // Build the operation hash that the EOA must have signed
        bytes32 digest = getDigest(calls, _nonce);

        // Recover signer and verify it matches this address (the EOA)
        address signer = _recover(digest, signature);
        if (signer != address(this)) revert InvalidSignature();

        // Increment nonce
        unchecked {
            nonce++;
        }

        // Execute all calls
        for (uint256 i = 0; i < calls.length; i++) {
            (bool success,) = calls[i].to.call{value: calls[i].value}(calls[i].data);
            if (!success) revert CallFailed(i);
        }

        emit Executed(msg.sender, _nonce, calls.length);
    }

    /// @notice Compute the EIP-191 digest for a batch of calls
    /// @param calls Array of calls
    /// @param _nonce Nonce value
    /// @return The digest that must be signed by the EOA
    function getDigest(Call[] calldata calls, uint256 _nonce) public view returns (bytes32) {
        bytes32 dataHash = keccak256(abi.encode(
            calls,
            _nonce,
            block.chainid,
            address(this)
        ));
        return keccak256(abi.encodePacked(
            "\x19Ethereum Signed Message:\n32",
            dataHash
        ));
    }

    /// @notice Recover signer from ECDSA signature
    function _recover(bytes32 digest, bytes calldata sig) internal pure returns (address) {
        if (sig.length != 65) return address(0);

        bytes32 r;
        bytes32 s;
        uint8 v;

        assembly {
            r := calldataload(sig.offset)
            s := calldataload(add(sig.offset, 32))
            v := byte(0, calldataload(add(sig.offset, 64)))
        }

        if (v < 27) v += 27;

        return ecrecover(digest, v, r, s);
    }

    /// @notice Allow receiving ETH
    receive() external payable {}
}
