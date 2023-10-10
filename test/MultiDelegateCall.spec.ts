import { expect } from "chai";
import { MultiTokenTransfer } from "./../typechain-types/contracts/MultiDelegateCall.sol/MultiTokenTransfer";
import { Signer } from "ethers";
import { ethers } from "hardhat";
import { token } from "../typechain-types/@openzeppelin/contracts";

describe("MultiDelegateCall", () => {
  let tokenSupportedMultiDelegateCall: MultiTokenTransfer;

  let owner: Signer, addr1: Signer, addr2: Signer, addr3: Signer;
  before("Deploy MultiDelegateCall & Mint Tokens", async () => {
    [owner, addr1, addr2, addr3] = await ethers.getSigners();
    const tokenSupportedMultiDelegateCall_f = await ethers.getContractFactory(
      "MultiTokenTransfer"
    );

    tokenSupportedMultiDelegateCall =
      await tokenSupportedMultiDelegateCall_f.deploy();

    await tokenSupportedMultiDelegateCall.mint();
  });

  it("Multi Transfer to addr1, addr2, addr3", async () => {
    const tokenSupportedMultiDelegateCallData = [];
    const tokenItf = tokenSupportedMultiDelegateCall.interface;
    tokenSupportedMultiDelegateCallData.push(
      tokenItf.encodeFunctionData("transfer", [
        await addr1.getAddress(),
        ethers.parseEther("0.1"),
      ]),
      tokenItf.encodeFunctionData("transfer", [
        await addr2.getAddress(),
        ethers.parseEther("0.2"),
      ]),
      tokenItf.encodeFunctionData("transfer", [
        await addr3.getAddress(),
        ethers.parseEther("0.3"),
      ])
    );
    await tokenSupportedMultiDelegateCall.multiDelegatecall(
      tokenSupportedMultiDelegateCallData
    );

    expect(
      await tokenSupportedMultiDelegateCall.balanceOf(await addr1.getAddress())
    ).to.equal(ethers.parseEther("0.1"));
    expect(
      await tokenSupportedMultiDelegateCall.balanceOf(await addr2.getAddress())
    ).to.equal(ethers.parseEther("0.2"));
    expect(
      await tokenSupportedMultiDelegateCall.balanceOf(await addr3.getAddress())
    ).to.equal(ethers.parseEther("0.3"));
    expect(
      await tokenSupportedMultiDelegateCall.balanceOf(await owner.getAddress())
    ).to.equal(ethers.parseEther("0.4"));
  });
});
