// SPDX-License-Identifier: MIT

// Implementing a ERC20 Token
// Will have basic functionalities like transfer/balance etc.
// Minting a million tokens and making them public for $2.
// Author : Yash Mathur

pragma solidity ^0.8.7;
import "./PriceConverter.sol";

contract YMToken {
    string public _symbol;
    string public _name;
    uint256 public _decimals;
    uint256 public _totalSupply;
    address public _minter;
    address public owner;

    mapping(address => uint256) balances;
    mapping(address => mapping(address => uint256)) allowances;

    event Transfer(address owner, address sender, uint256 value);
    event Approval(address owner, address sender, uint256 value);
    event Burn(address owner, uint256 value);
    event Transferrable(address owner, address sender, uint256 value);

    AggregatorV3Interface public priceFeed;

    constructor(address priceFeedAddress) {
        _symbol = "DUPL";
        _name = "DUPLICATE";
        _decimals = 18;
        _minter = msg.sender;
        _totalSupply = 1000000;
        priceFeed = AggregatorV3Interface(priceFeedAddress);
        owner = msg.sender;
        balances[_minter] = _totalSupply;
        allowances[_minter][_minter] = _totalSupply;
        emit Transfer(address(0), owner, _totalSupply);
    }

    function getName() public view returns (string memory) {
        return _name;
    }

    function getBalance(address add) public view returns (uint256) {
        return balances[add];
    }

    function getAllowance(address add) public view returns (uint256) {
        return allowances[add][msg.sender];
    }

    function getMinter() public view returns (address) {
        return _minter;
    }

    function getConversionRate() public view returns (uint256) {
        return PriceConverter.getPrice(priceFeed);
    }

    function getETHAmount(uint256 value) public view returns (uint256) {
        uint256 amountToBePaid = value * 2 * (10**18);
        uint256 ethAmountInUsd = PriceConverter.getConversionRate(
            amountToBePaid,
            priceFeed
        );

        return ethAmountInUsd;
    }

    function getSymbol() public view returns (string memory) {
        return _symbol;
    }

    function getDecimals() public view returns (uint256) {
        return _decimals;
    }

    function getTotalSupply() public view returns (uint256) {
        return _totalSupply;
    }

    function getPriceFeed() public view returns (AggregatorV3Interface) {
        return priceFeed;
    }

    function fund(address to, uint256 value) public payable {
        balances[owner] -= value;
        balances[to] += value;
        emit Transfer(owner, to, value);
    }

    function transfer(address to, uint256 value) public {
        uint256 amountToBePaid = value * 2 * (10**18);
        uint256 ethAmountInUsd = PriceConverter.getConversionRate(
            amountToBePaid,
            priceFeed
        );
        require(
            balances[msg.sender] >= value &&
                allowances[msg.sender][msg.sender] >= value &&
                ethAmountInUsd > 0,
            "Either you do not have sufficient balance or you are not allowed\
        to transfer this much amount or you are trying to transfer 0 amount"
        );

        emit Transferrable(msg.sender, to, value);
    }

    function transferFrom(
        address from,
        address to,
        uint256 value
    ) public payable returns (bool) {
        uint256 amountToBePaid = value * 2 * (10**18);
        uint256 ethAmountInUsd = PriceConverter.getConversionRate(
            amountToBePaid,
            priceFeed
        );
        require(
            balances[from] >= value &&
                allowances[from][msg.sender] >= value &&
                ethAmountInUsd > 0,
            "Either you do not have sufficient balance or you are not allowed\
        to transfer this much amount or you are trying to transfer 0 amount"
        );
        (bool callSuccess, ) = payable(from).call{value: ethAmountInUsd}("");
        balances[from] -= value;
        balances[to] += value;

        emit Transfer(from, to, value);

        return true;
    }

    function approve(address sender, uint256 value) public returns (bool) {
        allowances[sender][msg.sender] = value;
        emit Approval(msg.sender, sender, value);

        return true;
    }

    function burn(uint256 value) public returns (bool) {
        assert(balances[msg.sender] >= value);
        balances[msg.sender] -= value;
        _totalSupply -= value;

        emit Burn(msg.sender, value);

        return true;
    }
}
