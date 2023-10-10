import { expect } from "chai";
import { ethers } from "hardhat";
import { StaticCall_Callee, StaticCall_Caller } from "../typechain-types";
describe("Call", () => {
  let caller: StaticCall_Caller;
  let callee: StaticCall_Callee;
  before(async () => {
    const caller_f = await ethers.getContractFactory("StaticCall_Caller");
    caller = await caller_f.deploy();
  });
  it("Call Callee", async () => {
    const callee_address = await caller.callee();
    callee = await ethers.getContractAt("StaticCall_Callee", callee_address);
    expect(await callee.number()).to.equal(0);

    // expect(caller.callCallee()).to.equal([false, "0x"]);
    expect(await callee.number()).to.equal(0);

    // static call로 StaticCall_Callee의 number()를 호출하면 값이 변하지 않지만 실행했을때의 결과값을 받을 수 있다.
    const result2 = await callee.increment.staticCall();
    // expect(result2).to.equal(1);
  });
});
