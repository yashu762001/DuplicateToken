const { getNamedAccounts, deployments, network, ethers } = require("hardhat");
const {
  developmentChains,
  decimals,
  INITIAL_ANSWER,
} = require("../helper-hardhat");

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId = network.config.chainId;
  const args = [decimals, INITIAL_ANSWER];

  if (chainId === 31337) {
    log("Deploying Mocks");
    // deploy VRF Coordinator.

    await deploy("MockV3Aggregator", {
      from: deployer,
      args: args,
      log: true,
    });

    log("Mocks are Deployed!!!");
    log("....................");
  }
};

module.exports.tags = ["all", "mocks"];
