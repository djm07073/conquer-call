contract StaticCall_Callee {
    uint public number;

    function increment() public returns (uint) {
        number++;
        return number;
    }
}

contract StaticCall_Caller {
    address public immutable callee;

    constructor() {
        StaticCall_Callee calleeContract = new StaticCall_Callee();
        callee = address(calleeContract);
    }

    function callCallee() public view returns (bool, bytes memory) {
        (bool success, bytes memory data) = callee.staticcall(
            abi.encodeWithSignature("increment()")
        );

        return (success, data);
    }
}
