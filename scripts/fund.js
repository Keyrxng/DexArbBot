const hre = require('hardhat')
const fs = require('fs')
const { ethers } = require('hardhat')
require('dotenv').config()

let config, arb, owner
const network = hre.network.name

if (network === 'aurora') config = require('./../config/aurora.json')
if (network === 'fantom') config = require('./../config/fantom.json')

const main = async () => {
  ;[owner] = await ethers.getSigners()
  console.log(`Owner: ${owner.address}`)
  const IArb = await ethers.getContractFactory('Arb')
  arb = await IArb.attach(config.arbContract)
  const interface = await ethers.getContractFactory('WETH9')
  for (let i = 0; i < config.baseAssets.length; i++) {
    const asset = config.baseAssets[i]
    const tokenAsset = await interface.attach(asset.address)
    const ownerBal = await tokenAsset.balanceOf(owner.address)
    console.log(`${asset.sym} Owner Balance: `, arbBalance.toString())

    const arbBal = await arb.getBalance(asset.address)
    console.log(`${asset.sym} Original Arb Balance: `, arbBalance.toString())

    const tx = await tokenAsset.transfer(config.arbContract, ownerBal)
    await tx.wait()
    await new Promise((r) => setTimeout(r, 10000))
    const postFundBal = await arb.getBalance(asset.address)
    console.log(`${asset.sym} New Arb Balance: `, postFundBal.toString())
  }
  console.log(
    'Note it might take a while for the funds to show up, try balances.js in a few mins',
  )
}

process.on('uncaughtException', function (err) {
  console.log('Uncaught exception 83: ' + err)
  console.log(err.stack)
  fs.appendFile('./critical.txt', err.stack, function () {})
})

process.on('unhandledRejection', (reason, p) => {
  console.log('unhandled rejection at: ' + p + ' - reason: ' + reason)
})

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
