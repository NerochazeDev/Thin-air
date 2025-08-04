const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("PolygonRewardDistributorModule", (m) => {
  // Deploy the PolygonRewardDistributor contract
  const rewardDistributor = m.contract("PolygonRewardDistributor");

  return { rewardDistributor };
});
