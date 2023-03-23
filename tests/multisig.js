const anchor = require("@coral-xyz/anchor");
const { PublicKey } = require("@solana/web3.js");
const assert = require("assert");
const idl = require("../target/idl/orbit_multisig.json");

describe("multisig", () => {
  // Configure the client to use the local cluster.
  const providerKP = anchor.web3.Keypair.fromSecretKey(Uint8Array.from([129,120,182,228,196,158,63,17,41,199,69,153,125,205,238,247,124,231,160,96,137,101,247,246,66,241,145,144,180,195,125,19,90,87,80,176,36,52,249,53,169,199,213,208,207,182,87,248,108,210,169,1,214,195,71,34,118,172,224,198,217,60,2,68]));
  const providerWallet = new anchor.Wallet(providerKP);
  let connection = new anchor.web3.Connection("https://api.devnet.solana.com");
  const provider = new anchor.AnchorProvider(connection, providerWallet, {preflightCommitment: "processed"});
  anchor.setProvider(provider);

  const program = anchor.workspace.OrbitMultisig;
  

  it("Tests the multisig program", async () => {
    const multisig = anchor.web3.Keypair.generate();
    const [multisigSigner, nonce] =
      await anchor.web3.PublicKey.findProgramAddress(
        [multisig.publicKey.toBuffer()],
        program.programId
      );
    const multisigSize = 200; // Big enough.

    // accounts
    // // digital
    // console.log(new Uint8Array(new PublicKey("DpKqMhUHc6YDjzGmxEKGZK8MxpdtW9X6jmYZrJ9UZj4g").toBytes()))
    // // commission
    // console.log(new Uint8Array(new PublicKey("9kTSzk3yQZBn2esehyucammd1WJ65GKcVAVCBGMdbcL5").toBytes()))
    // // physical
    // console.log(new Uint8Array(new PublicKey("HgZsfGTHEygTLSRDoKZkQMkJPm8jesNtUgjSQgFwVh7S").toBytes()))

    console.log("MULTISIG STRUCT ADDR");
    console.log(new Uint8Array(multisig.publicKey.toBuffer()));
    console.log(multisig.secretKey);
    console.log(nonce.toString());

    console.log("SIGNER");
    console.log(multisigSigner.toString());
    console.log(multisigSigner.toBuffer());

    const ownerA = new PublicKey("BRurf331BxKY9HqdepyCSmPKHSmsJYRNGP8oM61eFbwQ");
    const ownerB = new PublicKey("494PxdBr4ATRERvA1vcxfYkrgyUYHshDCiSTD9V6TSLu");
    const ownerC = new PublicKey("E5EP2qkdXmPwXA9ANzoG69Gmj86Jdqepjw2XrQDGj9sM");
    const owners = [ownerA, ownerB, ownerC];

    const threshold = new anchor.BN(2);
    await program.rpc.createMultisig(owners, threshold, nonce, {
      accounts: {
        multisig: multisig.publicKey,
      },
      instructions: [
        await program.account.multisig.createInstruction(
          multisig,
          multisigSize
        ),
      ],
      signers: [multisig],
    });

    // let multisigAccount = await program.account.multisig.fetch(
    //   multisig.publicKey
    // );
    // assert.strictEqual(multisigAccount.nonce, nonce);
    // assert.ok(multisigAccount.threshold.eq(new anchor.BN(2)));
    // assert.deepStrictEqual(multisigAccount.owners, owners);
    // assert.ok(multisigAccount.ownerSetSeqno === 0);

    /////////////////////////// TO HERE

  //   const pid = program.programId;
  //   const accounts = [
  //     {
  //       pubkey: multisig.publicKey,
  //       isWritable: true,
  //       isSigner: false,
  //     },
  //     {
  //       pubkey: multisigSigner,
  //       isWritable: false,
  //       isSigner: true,
  //     },
  //   ];
  //   const newOwners = [ownerA.publicKey, ownerB.publicKey, ownerD.publicKey];
  //   const data = program.coder.instruction.encode("set_owners", {
  //     owners: newOwners,
  //   });

  //   const transaction = anchor.web3.Keypair.generate();
  //   const txSize = 1000; // Big enough, cuz I'm lazy.
  //   await program.rpc.createTransaction(pid, accounts, data, {
  //     accounts: {
  //       multisig: multisig.publicKey,
  //       transaction: transaction.publicKey,
  //       proposer: ownerA.publicKey,
  //     },
  //     instructions: [
  //       await program.account.transaction.createInstruction(
  //         transaction,
  //         txSize
  //       ),
  //     ],
  //     signers: [transaction, ownerA],
  //   });

  //   const txAccount = await program.account.transaction.fetch(
  //     transaction.publicKey
  //   );

  //   assert.ok(txAccount.programId.equals(pid));
  //   assert.deepStrictEqual(txAccount.accounts, accounts);
  //   assert.deepStrictEqual(txAccount.data, data);
  //   assert.ok(txAccount.multisig.equals(multisig.publicKey));
  //   assert.deepStrictEqual(txAccount.didExecute, false);
  //   assert.ok(txAccount.ownerSetSeqno === 0);

  //   // Other owner approves transactoin.
  //   await program.rpc.approve({
  //     accounts: {
  //       multisig: multisig.publicKey,
  //       transaction: transaction.publicKey,
  //       owner: ownerB.publicKey,
  //     },
  //     signers: [ownerB],
  //   });

  //   // Now that we've reached the threshold, send the transactoin.
  //   await program.rpc.executeTransaction({
  //     accounts: {
  //       multisig: multisig.publicKey,
  //       multisigSigner,
  //       transaction: transaction.publicKey,
  //     },
  //     remainingAccounts: program.instruction.setOwners
  //       .accounts({
  //         multisig: multisig.publicKey,
  //         multisigSigner,
  //       })
  //       // Change the signer status on the vendor signer since it's signed by the program, not the client.
  //       .map((meta) =>
  //         meta.pubkey.equals(multisigSigner)
  //           ? { ...meta, isSigner: false }
  //           : meta
  //       )
  //       .concat({
  //         pubkey: program.programId,
  //         isWritable: false,
  //         isSigner: false,
  //       }),
  //   });

  //   multisigAccount = await program.account.multisig.fetch(multisig.publicKey);

  //   assert.strictEqual(multisigAccount.nonce, nonce);
  //   assert.ok(multisigAccount.threshold.eq(new anchor.BN(2)));
  //   assert.deepStrictEqual(multisigAccount.owners, newOwners);
  //   assert.ok(multisigAccount.ownerSetSeqno === 1);
  // });

  // it("Assert Unique Owners", async () => {
  //   const multisig = anchor.web3.Keypair.generate();
  //   const [_multisigSigner, nonce] =
  //     await anchor.web3.PublicKey.findProgramAddress(
  //       [multisig.publicKey.toBuffer()],
  //       program.programId
  //     );
  //   const multisigSize = 200; // Big enough.

  //   const ownerA = anchor.web3.Keypair.generate();
  //   const ownerB = anchor.web3.Keypair.generate();
  //   const owners = [ownerA.publicKey, ownerB.publicKey, ownerA.publicKey];

  //   const threshold = new anchor.BN(2);
  //   try {
  //     await program.rpc.createMultisig(owners, threshold, nonce, {
  //       accounts: {
  //         multisig: multisig.publicKey,
  //         rent: anchor.web3.SYSVAR_RENT_PUBKEY,
  //       },
  //       instructions: [
  //         await program.account.multisig.createInstruction(
  //           multisig,
  //           multisigSize
  //         ),
  //       ],
  //       signers: [multisig],
  //     });
  //     assert.fail();
  //   } catch (err) {
  //     const error = err.error;
  //     assert.strictEqual(error.errorCode.number, 6008);
  //     assert.strictEqual(error.errorMessage, "Owners must be unique");
  //   }
  });
});
