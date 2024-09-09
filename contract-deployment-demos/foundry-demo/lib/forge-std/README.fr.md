[Read in English](./README.md)
# La Bibliothèque Standard de Forge • [![CI status](https://github.com/foundry-rs/forge-std/actions/workflows/ci.yml/badge.svg)](https://github.com/foundry-rs/forge-std/actions/workflows/ci.yml)

est une collection de contrats et de bibliothèques utiles à utiliser avec  [Forge and Foundry](https://github.com/foundry-rs/foundry).  Elle utilise les "cheatcodes" de Forge pour faciliter et accélérer l’écriture des tests, tout en améliorant l’expérience utilisateur des cheatcodes.

**Apprenez à utiliser Forge-Std avec le [📖 Foundry Book (Forge-Std Guide)](https://book.getfoundry.sh/forge/forge-std.html).**

## Install

```bash
forge install foundry-rs/forge-std
```

## Contracts
### stdError

Ceci est un contrat d'aide pour gérer les erreurs et les "reverts" (annulations). Dans Forge, ce contrat est très utile pour le cheatcode`expectRevert` cheatcode,  car il fournit toutes les erreurs par défaut du compilateur.
Consultez le contrat lui-même pour voir tous les codes d'erreurs.

#### Exemple d'utilisation

```solidity

import "forge-std/Test.sol";

contract TestContract is Test {
    ErrorsTest test;

    function setUp() public {
        test = new ErrorsTest();
    }

    function testExpectArithmetic() public {
        vm.expectRevert(stdError.arithmeticError);
        test.arithmeticError(10);
    }
}

contract ErrorsTest {
    function arithmeticError(uint256 a) public {
        uint256 a = a - 100;
    }
}
```

### stdStorage

Ce contrat est assez volumineux car il surcharge plusieurs fonctions pour rendre l’expérience utilisateur meilleure. Principalement, il enveloppe les cheatcodes  `record` et `accesses` (accès).Il peut *always* trouver et écrire dans l'emplacement de stockage associé à une variable particulière sans connaître la structure exacte du stockage.

L'exception principale est que, bien qu'il puisse trouver l'emplacement de variables stockées de manière compressée, il n'est pas possible d’écrire dans ces emplacements de manière sûre. Si un utilisateur tente de le faire, une erreur est levée, sauf si la variable n’est pas initialisée(`bytes32(0)`).

Cela fonctionne en enregistrant tous les appels de`SLOAD`s et `SSTORE`s(écriture de stockage) pendant l’exécution d’une fonction. Si un seul emplacement de stockage est lu ou écrit, il est retourné immédiatement. Sinon, le contrat parcourt les emplacements pour vérifier (en supposant que l'utilisateur a passé un paramètre `depth` (profondeur)).

I.e.:
```solidity
struct T {
    // depth 0
    uint256 a;
    // depth 1
    uint256 b;
}
```

#### Exemple d'utilisation

```solidity
import "forge-std/Test.sol";

contract TestContract is Test {
    using stdStorage for StdStorage;

    Storage test;

    function setUp() public {
        test = new Storage();
    }

    function testFindExists() public {
        // Lets say we want to find the slot for the public
        // variable `exists`. We just pass in the function selector
        // to the `find` command
        uint256 slot = stdstore.target(address(test)).sig("exists()").find();
        assertEq(slot, 0);
    }

    function testWriteExists() public {
        // Lets say we want to write to the slot for the public
        // variable `exists`. We just pass in the function selector
        // to the `checked_write` command
        stdstore.target(address(test)).sig("exists()").checked_write(100);
        assertEq(test.exists(), 100);
    }

    // It supports arbitrary storage layouts, like assembly based storage locations
    function testFindHidden() public {
        // `hidden` is a random hash of a bytes, iteration through slots would
        // not find it. Our mechanism does
        // Also, you can use the selector instead of a string
        uint256 slot = stdstore.target(address(test)).sig(test.hidden.selector).find();
        assertEq(slot, uint256(keccak256("my.random.var")));
    }

    // If targeting a mapping, you have to pass in the keys necessary to perform the find
    // i.e.:
    function testFindMapping() public {
        uint256 slot = stdstore
            .target(address(test))
            .sig(test.map_addr.selector)
            .with_key(address(this))
            .find();
        // in the `Storage` constructor, we wrote that this address' value was 1 in the map
        // so when we load the slot, we expect it to be 1
        assertEq(uint(vm.load(address(test), bytes32(slot))), 1);
    }

    // If the target is a struct, you can specify the field depth:
    function testFindStruct() public {
        // NOTE: see the depth parameter - 0 means 0th field, 1 means 1st field, etc.
        uint256 slot_for_a_field = stdstore
            .target(address(test))
            .sig(test.basicStruct.selector)
            .depth(0)
            .find();

        uint256 slot_for_b_field = stdstore
            .target(address(test))
            .sig(test.basicStruct.selector)
            .depth(1)
            .find();

        assertEq(uint(vm.load(address(test), bytes32(slot_for_a_field))), 1);
        assertEq(uint(vm.load(address(test), bytes32(slot_for_b_field))), 2);
    }
}

// A complex storage contract
contract Storage {
    struct UnpackedStruct {
        uint256 a;
        uint256 b;
    }

    constructor() {
        map_addr[msg.sender] = 1;
    }

    uint256 public exists = 1;
    mapping(address => uint256) public map_addr;
    // mapping(address => Packed) public map_packed;
    mapping(address => UnpackedStruct) public map_struct;
    mapping(address => mapping(address => uint256)) public deep_map;
    mapping(address => mapping(address => UnpackedStruct)) public deep_map_struct;
    UnpackedStruct public basicStruct = UnpackedStruct({
        a: 1,
        b: 2
    });

    function hidden() public view returns (bytes32 t) {
        // an extremely hidden storage slot
        bytes32 slot = keccak256("my.random.var");
        assembly {
            t := sload(slot)
        }
    }
}
```

### stdCheats

C'est un ensemble de "cheatcodes" divers qui nécessitent des enveloppes pour être plus conviviaux pour les développeurs. Actuellement, seules les fonctions liées à `prank`.  (tromperie) sont présentes. En général, les utilisateurs s'attendent à ce que de l'ETH soit ajouté à une adresse lors de l’utilisation de  `prank`,  mais ce n'est pas le cas pour des raisons de sécurité. Plus précisément, la fonction `hoax`doit seulement être utilisée pour une adresse ayant un solde attendu, car celui-ci sera écrasé. Si une adresse possède déjà de l'ETH, utilisez simplement`prank`. Si vous voulez changer explicitement ce solde, utilisez  `deal`. Si vous voulez faire les deux, `hoax` est aussi la bonne option.


#### Exemple d'utilisation :
```solidity

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "forge-std/Test.sol";

// Inherit the stdCheats
contract StdCheatsTest is Test {
    Bar test;
    function setUp() public {
        test = new Bar();
    }

    function testHoax() public {
        // we call `hoax`, which gives the target address
        // eth and then calls `prank`
        hoax(address(1337));
        test.bar{value: 100}(address(1337));

        // overloaded to allow you to specify how much eth to
        // initialize the address with
        hoax(address(1337), 1);
        test.bar{value: 1}(address(1337));
    }

    function testStartHoax() public {
        // we call `startHoax`, which gives the target address
        // eth and then calls `startPrank`
        //
        // it is also overloaded so that you can specify an eth amount
        startHoax(address(1337));
        test.bar{value: 100}(address(1337));
        test.bar{value: 100}(address(1337));
        vm.stopPrank();
        test.bar(address(this));
    }
}

contract Bar {
    function bar(address expectedSender) public payable {
        require(msg.sender == expectedSender, "!prank");
    }
}
```

### Std Assertions (Assertions Standard)

Contient diverses assertions pour vérifier les résultats dans les tests.

### `console.log`

L'utilisation suit le même format que [Hardhat](https://hardhat.org/hardhat-network/reference/#console-log).
Il est recommandé d'utiliser  `console2.sol` comme montré ci-dessous, car cela affichera les logs décodés dans les traces de Forge.

```solidity
// import it indirectly via Test.sol
import "forge-std/Test.sol";
// or directly import it
import "forge-std/console2.sol";
...
console2.log(someValue);
```

Si vous avez besoin de compatibilité avec Hardhat, vous devez utiliser  `console.sol` à la place. En raison d'un bug dans  `console.sol`, les logs qui utilisent les types `uint256` ou `int256` ne seront pas correctement décodés dans les traces de Forge.

```solidity
// import it indirectly via Test.sol
import "forge-std/Test.sol";
// or directly import it
import "forge-std/console.sol";
...
console.log(someValue);
```

## License

La Forge Standard Library est proposée sous la licence  [MIT](LICENSE-MIT) or [Apache 2.0](LICENSE-APACHE) .
