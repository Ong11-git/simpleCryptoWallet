// SPDX-License-Identifier: MIT
pragma solidity 0.8.0;

contract SimpleWallet {
    address public owner;
    uint256 public constant requiredDeposit = 10 ether;
    uint256 private balance;

    event Deposit(address indexed from, uint256 amount);
    event Transfer(address indexed to, uint256 amount);
    event OwnerUpdated(address indexed oldOwner, address indexed newOwner);

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Not the owner");
        _;
    }

    modifier hasRequiredDeposit(uint256 amount) {
        require(amount >= requiredDeposit, "Insufficient deposit");
        _;
    }

    // Deposit function to allow the owner to add funds to the contract
    function deposit(uint256 amount) external payable onlyOwner hasRequiredDeposit(amount) {
        // Increment the balance when funds are deposited
        balance += amount;
        emit Deposit(msg.sender, amount);
    }

    // Allows the owner to transfer Ether from the contract
    function transferEther(address payable to, uint256 amount) external onlyOwner {
        require(to != address(0), "Invalid recipient address");
        require(amount > 0 && amount <= balance, "Invalid amount");

        to.transfer(amount);
        // Decrement the balance when funds are transferred
        balance -= amount;
        emit Transfer(to, amount);
    }

    // Allows the owner to update the contract owner
    function updateOwner(address newOwner) external onlyOwner {
        require(newOwner != address(0), "Invalid new owner address");
        emit OwnerUpdated(owner, newOwner);
        owner = newOwner;
    }

    // Allows anyone to view the current balance of the contract
    function getBalance() external view returns (uint256) {
        return balance;
    }

    // Fallback function to receive Ether
    receive() external payable {
        // Increment the balance when funds are received through the fallback function
        balance += msg.value;
        emit Deposit(msg.sender, msg.value);
    }
}
