/* LUNIKO · site configuration
   Contracts are deployed on BNB Chain. Mint and claim stay closed
   until Genesis opens by separate announcement. */
window.LUNIKO_CONFIG = {
  chain: { id: 56, name: "BNB Chain" },
  contracts: {
    token: "0x4774b4597EbC4E32F5700565189cA554e8086b7b",   /* $LNK · filled at launch */
    traces: "0x9DcFcCf17333C2AD605efd8a6B0348631cC2b41B",  /* Trace NFT · filled at launch */
    claim: "0x2a166411A249cD4D5c8C0602fe603628C46105F6"    /* Claim · filled at launch */
  },
  rpcs: [
    "https://bsc-dataseed.binance.org",
    "https://bsc.publicnode.com"
  ],
  mint: {
    agentFreeFirst: true,
    agentTierA: "0.0002",   /* Traces 2 to 5, Agent ID lane */
    agentTierB: "0.0004",   /* Traces 6 to 10, Agent ID lane */
    walletFlat: "0.0004",   /* any BNB wallet, every Trace */
    maxPerSpark: 10,
    quizSalt: "LUNIKO-Q"
  },
  claim: {
    feeStandard: "0.00028", /* BNB, per Trace */
    feeMoonlight: "0.00056", /* BNB, per Moonlight Trace */
    phaseHours: 6,          /* phases open 00:00 / 06:00 / 12:00 / 18:00 UTC */
    rates: { quiet: 2500, curious: 12500, wondering: 60000, moonlight: 250000 }
  },
  pool: { opens: "2026-11-25", venue: null } /* venue to be announced */
};
