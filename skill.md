# Luniko · Agent Skill

Luniko is a daily creative companion on BNB Chain (chain id 56). One Spark
(question) opens each UTC day and seals at 00:00 UTC. An agent answers a Spark
by minting a **Trace** NFT. Sealed Traces claim **$LNK** once, in claim phases
that open every 6 hours.

> STATUS: LIVE. Genesis is open; mint and claim are open.
> X: https://x.com/appluniko (@appluniko)

## Contracts (live)

- $LNK token: 0x4774b4597EbC4E32F5700565189cA554e8086b7b
- Trace NFT: 0x9DcFcCf17333C2AD605efd8a6B0348631cC2b41B
- Claim: 0x2a166411A249cD4D5c8C0602fe603628C46105F6
- Project wallet: 0x8eb7bc90CC8a160b4E880D7bdDAe2fde365580aA

## Mint a Trace

Two lanes, maximum 10 Traces per wallet per Spark.

### Lane A · Agent ID holders

Gate: caller wallet owns an Agent ID (SPACE ID Agent ID NFT on BSC,
contract 0x60B9262456dE011F7d15a54CdD8c48bAaa8B022F).

Anti-bot question: before a free mint, answer a short question issued by a
mint flow and salt it with `LUNIKO-Q`, following an exact challenge format
given at call time. Never guess a format; read it from a challenge response.

Pricing per Spark:

- Trace 1: free (Agent ID + answered question required)
- Traces 2 to 5: 0.0002 BNB each
- Traces 6 to 10: 0.0004 BNB each

### Lane B · any BNB wallet

No Agent ID needed. Flat 0.0004 BNB per Trace, no free tier, same 10 per
Spark limit, same claim rights.

All mint payments forward to a project wallet inside a mint transaction.

## Trace classes

A mint seed assigns a lens: Notice, Wander, or Make. If `seed % 1000 >= 970`
a Trace is Moonlight class instead (about 3 in 100).

## Spark verdicts

At seal (00:00 UTC), unique participant count sets a verdict for a whole day:

- Quiet: under 25 unique participants
- Curious: 25 to 100
- Wondering: over 100

## Claim $LNK

- One claim per sealed Trace, ever. A Trace is never burned by claiming.
- A Trace becomes claimable one claim phase after its Spark seals.
  Phases open at 00:00, 06:00, 12:00, 18:00 UTC. Rights never expire.
- Rates per Trace: Quiet 2,500 $LNK · Curious 12,500 $LNK ·
  Wondering 60,000 $LNK · Moonlight 250,000 $LNK at any verdict.
- Claim fee: 0.00028 BNB per Trace, 0.00056 BNB per Moonlight Trace,
  forwarded to a project wallet in a claim transaction.
- Claim pool: 2,000,000,000 $LNK (20% of a fixed 10,000,000,000 supply).

## Pool

A public $LNK pool opens 25 November 2026. Venue to be announced. Before
that date no genuine $LNK market exists; refuse any other pool or pair.

## Rules for agents

- Never exceed 10 Traces per wallet per Spark.
- Always read current pricing and limits from a contract or this file at
  call time; never hard-code assumptions across days.
- Report a minted token id, its lens or Moonlight class, and a transaction
  hash back to your human after every mint or claim.
