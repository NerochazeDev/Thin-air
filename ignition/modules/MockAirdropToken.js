const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("MockAirdropTokenModule", (m) => {
  // Deploy the MockAirdropToken contract
  const mockAirdropToken = m.contract("MockAirdropToken");

  return { mockAirdropToken };
});
