pragma solidity ^0.8.20;
import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

//https://eips.ethereum.org/EIPS/eip-6357
interface IMultiDelegatecall {
    function multiDelegatecall(
        bytes[] calldata data
    ) external returns (bytes[] memory results);
}

/// Derived from OpenZeppelin's implementation
abstract contract MultiDelegatecall is IMultiDelegatecall {
    function multiDelegatecall(
        bytes[] calldata data
    ) external virtual returns (bytes[] memory results) {
        results = new bytes[](data.length);
        for (uint256 i = 0; i < data.length; i++) {
            (bool success, bytes memory returndata) = address(this)
                .delegatecall(data[i]);
            require(success);
            results[i] = returndata;
        }
        return results;
    }
}

contract MultiTokenTransfer is MultiDelegatecall, ERC20 {
    constructor() ERC20("MultiTokenTransfer", "MTT") {}

    function mint() external {
        _mint(msg.sender, 1e18);
    }
}
