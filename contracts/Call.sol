contract Call_Callee {
    uint public number;

    function increment() public {
        number++;
    }
}

contract Call_Caller {
    address public immutable callee;

    constructor() {
        Call_Callee calleeContract = new Call_Callee();
        callee = address(calleeContract);
    }

    function callCallee() public returns (bool, bytes memory) {
        (bool success, bytes memory data) = callee.call(
            abi.encodeWithSignature("increment()")
        );

        return (success, data);
    }
}
