const { ethers } = require('hardhat')
const hre = require('hardhat')

async function main() {
  ;[owner] = await ethers.getSigners()
  console.log(`Owner: ${owner.address}`)

  const name = 'Arb'
  await hre.run('compile')

  const smartContract = await hre.ethers.getContractFactory(name)
  const contract = await smartContract.deploy()
  await contract.deployed()

  console.log(`${name} deployed to: ${contract.address}`)
  console.log('Put the above address into the .env file under arbContract')
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
