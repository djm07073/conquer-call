import { expect } from "chai";
import { ethers } from "hardhat";
import { DeCall_Callee, DeCall_Caller } from "../typechain-types";

describe("Call", () => {
  let caller: DeCall_Caller;
  let callee: DeCall_Callee;
  before(async () => {
    const caller_f = await ethers.getContractFactory("DeCall_Caller");
    caller = await caller_f.deploy();
  });
  it("Delegate Call Callee", async () => {
    const callee_address = await caller.callee();
    callee = await ethers.getContractAt("DeCall_Callee", callee_address);
    expect(await callee.number()).to.equal(0);
    expect(await caller.number()).to.equal(0);

    await caller.callCallee(); // increase + 1
    expect(await callee.number()).to.equal(1);

    expect(await caller.number()).to.equal(1);
  });
});
