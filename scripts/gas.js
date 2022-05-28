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
  const gasPrice = await ethers.providers.getGasPrice()
  console.log(`Gas Price: ${gasPrice.toString()}`)
  const recommened = (gasPrice * 10) / 9
  console.log(`Recommened gas price: ${recommened.toString()}`)
}

process.on('uncaughtException', function (err) {
  console.log('UnCaught Exception 83: ' + err)
  console.error(err.stack)
  fs.appendFile('./critical.txt', err.stack, function () {})
})

process.on('unhandledRejection', (reason, p) => {
  console.log('Unhandled Rejection at: ' + p + ' - reason: ' + reason)
})

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
