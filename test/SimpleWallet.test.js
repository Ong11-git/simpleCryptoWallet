
const SimpleWallet = artifacts.require("SimpleWallet");

contract("SimpleWallet", (accounts) => {
  let simpleWallet;
  const owner = accounts[0];
  const recipientAddress = accounts[1];

  beforeEach(async () => {
    simpleWallet = await SimpleWallet.new({ from: owner });
  });

  it("should set the owner correctly", async () => {
    const contractOwner = await simpleWallet.owner();
    console.log(contractOwner);
    assert.equal(contractOwner, owner, "Owner is not set correctly");
  });

  it("should deposit funds and update balance", async () => {
    const depositAmount = web3.utils.toWei("10", "ether");
    await simpleWallet.deposit(depositAmount, { from: owner });
    
    // Retrieve the updated balance after the deposit
    const updatedBalance = await simpleWallet.getBalance();
    
    // Convert the BN value to a string for easier comparison
    const updatedBalanceString = updatedBalance.toString();
    
    console.log("Updated Balance:", updatedBalanceString);
    
    // Assert that the balance is updated correctly
    assert.equal(updatedBalanceString, depositAmount, "Balance not updated correctly");
  });

 

  const { BN, toWei, fromWei } = web3.utils;

  it("should transfer funds to another address and update balances", async () => {
    // Deposit a sufficient amount to the contract
    const depositAmount = toWei("10", "ether");
    await simpleWallet.deposit(depositAmount, { from: owner });
  
    // Get the initial balance
    const initialBalance = new BN(await simpleWallet.getBalance());
    console.log("Initial Balance:", fromWei(initialBalance, "ether"));
  
    // Specify the amount to transfer
    const transferAmount = toWei("5", "ether");
  
    // Specify the recipient address (replace with a valid address)
    const recipient = accounts[1];
  
    // Perform the transfer
    try {
      await simpleWallet.transferEther(recipient, transferAmount, { from: owner });
      
    } catch (error) {
      console.error("Transfer Error:", error.message);
    }
  
    // Get the updated balance after the transfer
    const updatedBalance = new BN(await simpleWallet.getBalance());
    console.log("Updated Balance:", fromWei(updatedBalance, "ether"));
  
    // Check if the balances are updated correctly
    const expectedBalance = initialBalance.sub(new BN(transferAmount));
  
    assert.equal(
      updatedBalance.toString(),
      expectedBalance.toString(),
      "Balance not updated correctly after transfer"
    );
  });
  
  
  
  
  

  // it("should update the owner correctly", async () => {
  //   const newOwner = accounts[2];
  //   await simpleWallet.updateOwner(newOwner, { from: owner });

  //   const contractOwner = await simpleWallet.owner();
  //   assert.equal(contractOwner, newOwner, "Owner is not updated correctly");
  // });
});
