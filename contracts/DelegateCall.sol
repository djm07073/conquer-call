contract DeCall_Callee {
    uint public number;

    function increment() public {
        number++;
    }
}

contract DeCall_Caller {
    uint public number;
    address public immutable callee;

    constructor() {
        DeCall_Callee calleeContract = new DeCall_Callee();
        callee = address(calleeContract);
    }

    function callCallee() public returns (bool, bytes memory) {
        (bool success, bytes memory data) = callee.delegatecall(
            abi.encodeWithSignature("increment()")
        );

        return (success, data);
    }
}
