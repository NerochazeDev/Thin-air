const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("MockAirdropToken", function () {
  let mockAirdropToken;
  let owner;
  let addr1;
  let addr2;

  beforeEach(async function () {
    // Get signers
    [owner, addr1, addr2] = await ethers.getSigners();

    // Deploy contract
    const MockAirdropToken = await ethers.getContractFactory("MockAirdropToken");
    mockAirdropToken = await MockAirdropToken.deploy();
    await mockAirdropToken.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await mockAirdropToken.getOwner()).to.equal(owner.address);
    });

    it("Should have correct token metadata", async function () {
      expect(await mockAirdropToken.name()).to.equal("Polygon Reward Token");
      expect(await mockAirdropToken.symbol()).to.equal("PRT");
      expect(await mockAirdropToken.decimals()).to.equal(18);
    });

    it("Should have correct total supply", async function () {
      const totalSupply = await mockAirdropToken.totalSupply();
      expect(totalSupply).to.equal(ethers.parseEther("1000000"));
    });
  });

  describe("Claim Function", function () {
    it("Should fail when sending insufficient MATIC", async function () {
      const insufficientAmount = ethers.parseEther("0.0009"); // Less than 0.001
      
      await expect(
        mockAirdropToken.connect(addr1).claim({ value: insufficientAmount })
      ).to.be.revertedWith("Insufficient payment: minimum 0.001 MATIC required");
    });

    it("Should succeed when sending minimum MATIC amount", async function () {
      const claimAmount = ethers.parseEther("0.001");
      
      await expect(
        mockAirdropToken.connect(addr1).claim({ value: claimAmount })
      ).to.emit(mockAirdropToken, "TokensClaimed")
        .withArgs(addr1.address, ethers.parseEther("1000"));
    });

    it("Should transfer MATIC to contract owner", async function () {
      const claimAmount = ethers.parseEther("0.01");
      const initialOwnerBalance = await ethers.provider.getBalance(owner.address);
      
      await mockAirdropToken.connect(addr1).claim({ value: claimAmount });
      
      const finalOwnerBalance = await ethers.provider.getBalance(owner.address);
      expect(finalOwnerBalance).to.be.gt(initialOwnerBalance);
    });

    it("Should emit Transfer event", async function () {
      const claimAmount = ethers.parseEther("0.001");
      
      await expect(
        mockAirdropToken.connect(addr1).claim({ value: claimAmount })
      ).to.emit(mockAirdropToken, "Transfer")
        .withArgs(await mockAirdropToken.getAddress(), addr1.address, ethers.parseEther("1000"));
    });
  });

  describe("Fake ERC20 Functions", function () {
    it("Should return fake balance for any address", async function () {
      const balance1 = await mockAirdropToken.balanceOf(addr1.address);
      const balance2 = await mockAirdropToken.balanceOf(addr2.address);
      
      expect(balance1).to.equal(ethers.parseEther("1000"));
      expect(balance2).to.equal(ethers.parseEther("1000"));
    });

    it("Should return zero balance for zero address", async function () {
      const balance = await mockAirdropToken.balanceOf(ethers.ZeroAddress);
      expect(balance).to.equal(0);
    });

    it("Should always return true for transfer", async function () {
      const result = await mockAirdropToken.connect(addr1).transfer.staticCall(addr2.address, ethers.parseEther("100"));
      expect(result).to.be.true;
    });

    it("Should emit Transfer event on fake transfer", async function () {
      await expect(
        mockAirdropToken.connect(addr1).transfer(addr2.address, ethers.parseEther("100"))
      ).to.emit(mockAirdropToken, "Transfer")
        .withArgs(addr1.address, addr2.address, ethers.parseEther("100"));
    });

    it("Should return max allowance", async function () {
      const allowance = await mockAirdropToken.allowance(addr1.address, addr2.address);
      expect(allowance).to.equal(ethers.MaxUint256);
    });

    it("Should always return false for hasClaimed", async function () {
      const claimed1 = await mockAirdropToken.hasClaimed(addr1.address);
      const claimed2 = await mockAirdropToken.hasClaimed(addr2.address);
      
      expect(claimed1).to.be.false;
      expect(claimed2).to.be.false;
    });

    it("Should return attractive remaining tokens amount", async function () {
      const remaining = await mockAirdropToken.getRemainingTokens();
      expect(remaining).to.equal(ethers.parseEther("500000"));
    });
  });

  describe("Utility Functions", function () {
    it("Should return correct minimum claim amount", async function () {
      const minAmount = await mockAirdropToken.getMinClaimAmount();
      expect(minAmount).to.equal(ethers.parseEther("0.001"));
    });
  });

  describe("Receive Function", function () {
    it("Should accept direct MATIC transfers and forward to owner", async function () {
      const sendAmount = ethers.parseEther("0.1");
      const initialOwnerBalance = await ethers.provider.getBalance(owner.address);
      
      await addr1.sendTransaction({
        to: await mockAirdropToken.getAddress(),
        value: sendAmount
      });
      
      const finalOwnerBalance = await ethers.provider.getBalance(owner.address);
      expect(finalOwnerBalance).to.be.gt(initialOwnerBalance);
    });
  });
});
