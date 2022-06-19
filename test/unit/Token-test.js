const { assert, expect } = require("chai");
const { deployments, ethers, getNamedAccounts, network } = require("hardhat");
const { developmentChains, networkConfig } = require("../../helper-hardhat");

if (developmentChains.includes(network.name)) {
  describe("Testing Token", async function () {
    let deployer, mockV3Aggregator, token, accounts, using_account;
    const value = 10;
    const ethvalue = "10000000000000000";
    beforeEach(async function () {
      deployer = (await getNamedAccounts()).deployer;
      accounts = await ethers.getSigners();
      using_account = accounts[1];
      await deployments.fixture(["all"]);
      token = await ethers.getContract("YMToken", deployer);
      mockV3Aggregator = await ethers.getContract("MockV3Aggregator");
    });

    describe("Constructor", async function () {
      it("constructor is initialised correctly", async function () {
        const priceFeedAddress = await token.getPriceFeed();
        const name = await token.getName();
        const symbol = await token.getSymbol();
        const totalSupply = await token.getTotalSupply();
        const decimals = await token.getDecimals();
        const minter = await token.getMinter();
        const address = await mockV3Aggregator.address;
        assert.equal(priceFeedAddress, address);
        assert.equal(name, "DUPLICATE");
        assert.equal(symbol, "DUPL");
        assert.equal(totalSupply.toString(), "1000000");
        assert.equal(decimals.toString(), "18");
        assert.equal(minter, deployer);
      });
    });

    describe("transfer", async function () {
      it("tokens transferring from contract developer to any address", async function () {
        const starting_senders_balance = await token.getBalance(deployer);
        const starting_receiver_balance = await token.getBalance(
          using_account.address
        );
        const starting_wallet_balance = await token.provider.getBalance(
          token.address
        );

        await new Promise(async (resolve, reject) => {
          token.once("Transferrable", async () => {
            try {
              await new Promise(async (resolve, reject) => {
                token.once("Transfer", async () => {
                  try {
                    console.log("Money Transferred");
                    const ending_senders_balance = await token.getBalance(
                      deployer
                    );
                    const ending_receivers_balance = await token.getBalance(
                      using_account.address
                    );
                    const ending_wallet_balance =
                      await token.provider.getBalance(token.address);

                    assert.equal(
                      ending_receivers_balance.toString(),
                      starting_receiver_balance.add(value).toString()
                    );
                    assert.equal(
                      ending_senders_balance.toString(),
                      starting_senders_balance.sub(value).toString()
                    );
                    assert.equal(
                      ending_wallet_balance.toString(),
                      starting_wallet_balance.add(ethvalue).toString()
                    );

                    resolve();
                  } catch (err) {
                    reject(err);
                  }
                });
                const temp = await token.connect(using_account);
                try {
                  await temp.fund(using_account.address, value, {
                    value: ethvalue,
                  });
                } catch (err) {
                  console.log(err);
                }
              });

              resolve();
            } catch (err) {
              reject(err);
            }
          });
          await token.transfer(using_account.address, value);
        });

        // const starting_senders_balance = await token.getBalance(deployer);
        // const starting_receivers_balance = await token.getBalance(
        //   using_account.address
        // );
        // const starting_wallet_balance = await token.provider.getBalance(
        //   token.address
        // );

        // await token.transfer(using_account.address, value);
        // new Promise(async (resolve, reject) => {
        //   token.once("Transfer", async () => {
        //     try {
        // const temp = await token.connect(using_account);
        // await temp.fund({ value: ethvalue });
        // console.log(`Money transferred to ${using_account.address}`);
        // const ending_senders_balance = await token.getBalance(deployer);
        // const ending_receivers_balance = await token.getBalance(
        //   using_account.address
        // );
        // const ending_wallet_balance = await token.provider.getBalance(
        //   token.address
        // );

        // console.log(starting_senders_balance.toString());
        // console.log(ending_senders_balance.toString());

        // console.log(starting_receivers_balance.toString());
        // console.log(ending_receivers_balance.toString());

        // console.log(starting_wallet_balance.toString());
        // console.log(ending_wallet_balance.toString());

        // assert.equal(
        //   ending_receivers_balance.toString(),
        //   starting_receivers_balance.add(value).toString()
        // );
        // assert.equal(
        //   ending_senders_balance.toString(),
        //   starting_senders_balance.sub(value).toString()
        // );
        // assert.equal(
        //   ending_wallet_balance.toString(),
        //   starting_wallet_balance.add(ethvalue).toString()
        // );

        //     } catch (err) {
        //         console.log(err) ;
        //       reject(err);
        //     }
        //   });

        //});
      });
    });
  });
}
