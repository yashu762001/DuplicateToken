const { getNamedAccounts, deployments, network } = require("hardhat");
const { developmentChains, networkConfig } = require("../helper-hardhat");

module.exports = async function ({ getNamedAccounts, deployments }) {
  const deployer = (await getNamedAccounts()).deployer;
  const { deploy, log } = deployments;
  const chainId = network.config.chainId;

  let priceFeedAddress;

  if (chainId == 31337) {
    const ethUSDAggregator = await deployments.get("MockV3Aggregator");
    ethUSDpriceFeedAddress = ethUSDAggregator.address;
  } else {
    ethUSDpriceFeedAddress = networkConfig[chainId]["ethUSDpriceFeedAddress"];
  }

  const args = [ethUSDpriceFeedAddress];

  const token = await deploy("YMToken", {
    from: deployer,
    args: args,
    log: true,
  });

  if (
    !developmentChains.includes(network.name) &&
    process.env.ETHERSCAN_API_KEY
  ) {
    await verify(token.address, args);
  }

  log("............................");
};

module.exports.tags = ["all", "token"];
