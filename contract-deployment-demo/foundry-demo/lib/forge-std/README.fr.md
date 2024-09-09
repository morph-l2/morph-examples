# Forge Standard Library • [![CI status](https://github.com/foundry-rs/forge-std/actions/workflows/ci.yml/badge.svg)](https://github.com/foundry-rs/forge-std/actions/workflows/ci.yml)

[Lire en Anglais](./README.md)

Forge Standard Library est une collection de contrats et de bibliothèques utiles pour être utilisés avec [Forge and Foundry](https://github.com/foundry-rs/foundry). Elle utilise les "cheatcodes" de Forge pour faciliter et accélérer l'écriture des tests, tout en améliorant l'expérience utilisateur des cheatcodes.

**Apprenez à utiliser Forge-Std avec le [📖 Foundry Book (Forge-Std Guide)](https://book.getfoundry.sh/forge/forge-std.html).**

## Install

```bash
forge install foundry-rs/forge-std
```

## Contracts
### stdError

C'est un contrat d'aide pour les erreurs et les revers. Dans Forge, ce contrat est particulièrement utile pour le cheatcode`expectRevert` cheatcode, car il fournit toutes les erreurs intégrées du compilateur.

Voir le contrat pour tous les codes d'erreur.

#### Example usage

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

C'est un contrat assez grand à cause des nombreuses surcharges pour rendre l'expérience utilisateur meilleure. C'est principalement une enveloppe autour des cheatcodes `record` et `accesses`. Il peut *toujours* trouver et écrire dans les emplacements de stockage associés à une variable sans connaître la disposition du stockage. La seule limite _majeur_ est que, même si un emplacement peut être trouvé pour des variables de stockage groupées, nous ne pouvons pas y écrire en toute sécurité. Si un utilisateur essaie d'écrire dans un emplacement groupé, l'exécution génère une erreur, sauf si l'emplacement est non initialisé (`bytes32(0)`).

Cela fonctionne en enregistrant tous les `SLOAD`et `SSTORE` pendant un appel de fonction. S'il n'y a qu'un seul emplacement lu ou écrit, il le retourne immédiatement. Sinon, en arrière-plan, nous parcourons et vérifions chacun (en supposant que l'utilisateur ait passé un paramètre `depth`).  Si la variable est une structure, vous pouvez passer un paramètre `depth` qui est en gros la profondeur du champ.
I.e.:
```solidity
struct T {
    // depth 0
    uint256 a;
    // depth 1
    uint256 b;
}
```

#### Example usage

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

C'est un wrapper autour de divers cheatcodes qui nécessitent des wrappers pour être plus conviviaux pour les développeurs. Actuellement, il n'y a que des fonctions liées à `prank`.En général, les utilisateurs peuvent s'attendre à ce que de l'ETH soit envoyé à une adresse lors de `prank`, mais ce n'est pas le cas pour des raisons de sécurité. Explicitement, cette fonction`hoax` ne doit être utilisée que pour les adresses ayant des soldes attendus, car elle va les écraser. Si une adresse possède déjà de l'ETH, vous devriez simplement utiliser  `prank`.Si vous souhaitez modifier ce solde explicitement, utilisez  `deal`. Si vous voulez faire les deux,  `hoax`est également adapté.


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

### Std Assertions

Contient diverses assertions.

### `console.log`

L'utilisation suit le même format que [Hardhat](https://hardhat.org/hardhat-network/reference/#console-log).
Il est recommandé d'utiliser  `console2.sol`comme indiqué ci-dessous, car cela affiche les logs décodés dans les traces Forge.

```solidity
// import it indirectly via Test.sol
import "forge-std/Test.sol";
// or directly import it
import "forge-std/console2.sol";
...
console2.log(someValue);
```

Si vous avez besoin de compatibilité avec Hardhat, vous devez utiliser `console.sol`standard à la place. En raison d'un bug dans`console.sol`, les logs qui utilisent des types `uint256` ou `int256` ne seront pas correctement décodés dans les traces Forge.

```solidity
// import it indirectly via Test.sol
import "forge-std/Test.sol";
// or directly import it
import "forge-std/console.sol";
...
console.log(someValue);
```

## Licence

Forge Standard Library est proposé sous licence [MIT](LICENSE-MIT) ou [Apache 2.0](LICENSE-APACHE) .
