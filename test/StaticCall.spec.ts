import { expect } from "chai";
import { ethers } from "hardhat";
import { Call_Callee, Call_Caller } from "../typechain-types";
describe("Call", () => {
  let caller: Call_Caller;
  let callee: Call_Callee;
  before(async () => {
    const caller_f = await ethers.getContractFactory("Call_Caller");
    caller = await caller_f.deploy();
  });
  it("Call Callee", async () => {
    const callee_address = await caller.callee();
    callee = await ethers.getContractAt("Call_Callee", callee_address);
    expect(await callee.number()).to.equal(0);

    await caller.callCallee(); // increase + 1
    expect(await callee.number()).to.equal(1);
  });
});
