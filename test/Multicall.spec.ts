import { expect } from "chai";
import { HardhatEthersSigner } from "./../node_modules/@nomicfoundation/hardhat-ethers/src/signers";
import { ethers } from "hardhat";
import { MockERC20, Multicall } from "../typechain-types";
import { Signer } from "ethers";

describe("Multicall", () => {
  let multicall: Multicall;
  let erc20: MockERC20;
  let owner: Signer, addr1: Signer, addr2: Signer, addr3: Signer;
  before(
    "Deploy Multicall & ERC20 & Minting Tokens to address 1, 2, 3",
    async () => {
      [owner, addr1, addr2, addr3] = await ethers.getSigners();
      const multicall_f = await ethers.getContractFactory("Multicall");
      multicall = await multicall_f.deploy();
      const erc20_f = await ethers.getContractFactory("MockERC20");
      erc20 = await erc20_f.deploy();
      await erc20.mint(100n);
      await erc20.connect(addr1).mint(80n);
      await erc20.connect(addr2).mint(90n);
      await erc20.connect(addr3).mint(500n);
    }
  );
  it("Multicall", async () => {
    const multicallData = [];
    const target = await erc20.getAddress();
    multicallData.push({
      target: target,
      callData: erc20.interface.encodeFunctionData("balanceOf", [
        await owner.getAddress(),
      ]),
    });
    multicallData.push({
      target: target,
      callData: erc20.interface.encodeFunctionData("balanceOf", [
        await addr1.getAddress(),
      ]),
    });
    multicallData.push({
      target: target,
      callData: erc20.interface.encodeFunctionData("balanceOf", [
        await addr2.getAddress(),
      ]),
    });
    multicallData.push({
      target: target,
      callData: erc20.interface.encodeFunctionData("balanceOf", [
        await addr3.getAddress(),
      ]),
    });
    const result = await multicall.aggregate.staticCall(multicallData);
    expect(BigInt(result.returnData[0])).deep.equal(100n);
    expect(BigInt(result.returnData[1])).deep.equal(80n);
    expect(BigInt(result.returnData[2])).deep.equal(90n);
    expect(BigInt(result.returnData[3])).deep.equal(500n);
  });
});
