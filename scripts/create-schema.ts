import { createPublicClient, http, createWalletClient, parseEther } from 'viem';
import { base } from 'viem/chains';
import { privateKeyToAccount } from 'viem/accounts';

// Replace with your private key
const PRIVATE_KEY = process.env.PRIVATE_KEY;

if (!PRIVATE_KEY) {
  throw new Error('Please set your PRIVATE_KEY environment variable');
}

const EAS_CONTRACT = "0x4200000000000000000000000000000000000021";

const easABI = [
  {
    name: "createSchema",
    type: "function",
    stateMutability: "payable",
    inputs: [
      { name: "schema", type: "string" },
      { name: "resolver", type: "address" },
      { name: "revocable", type: "bool" }
    ],
    outputs: [{ name: "", type: "bytes32" }],
  }
];

async function main() {
  const publicClient = createPublicClient({
    chain: base,
    transport: http()
  });

  const account = privateKeyToAccount(PRIVATE_KEY as `0x${string}`);

  const walletClient = createWalletClient({
    account,
    chain: base,
    transport: http()
  });

  // Schema for storing snake game scores
  const schema = "address player, uint256 score, string message";
  const resolver = "0x0000000000000000000000000000000000000000"; // No resolver needed
  const revocable = false;

  try {
    const hash = await walletClient.writeContract({
      address: EAS_CONTRACT,
      abi: easABI,
      functionName: 'createSchema',
      args: [schema, resolver, revocable],
    });

    console.log('Transaction submitted:', hash);
    
    // Wait for transaction to be mined
    const receipt = await publicClient.waitForTransactionReceipt({ hash });
    console.log('Transaction mined:', receipt.transactionHash);

    // Get the schema UID from the transaction logs
    const schemaUID = receipt.logs[0].topics[1];
    console.log('New Schema UID:', schemaUID);

  } catch (error) {
    console.error('Error creating schema:', error);
  }
}

main(); 