const { ethers } = require('hardhat')
const hre = require('hardhat')
const { config } = require('./config.js')

let constructorArgs = [config.OGSFactory, config.WGCD]
// Deploy function
async function deploy() {
  console.log('Config:', config.OGSFactory, config.WGCD)
  let deployer = await getDeployer()
  let deployerAddress = deployer.address

  await deployRouter01()
  await deployRouter02()
}

async function getDeployer() {
  const [deployer] = await ethers.getSigners()
  console.log('Account :', deployer.address)

  return deployer
}

async function verify(_contractAddress, ...args) {
  try {
    console.log('Verifying contract...')
    await hre.run('verify:verify', {
      address: _contractAddress,
      constructorArguments: [...args]
    })
  } catch (err) {
    if (err.message.includes('Reason: Already Verified')) {
      console.log('Contract is already verified!')
    } else {
      console.log(err)
    }
  }
}

async function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

async function deployRouter01() {
  const contract = await ethers.getContractFactory('OGSRouter01')
  const contractInstance = await contract.deploy(config.OGSFactory, config.WGCD)
  await contractInstance.deployed()
  const contractAddress = contractInstance.address

  console.log(`OGSRouter01 deployed to: ${contractAddress}`)

  await delay(20000)
  await verify(contractAddress, constructorArgs)
}

async function deployRouter02() {
  const contract = await ethers.getContractFactory('OGSRouter02')
  const contractInstance = await contract.deploy(config.OGSFactory, config.WGCD)
  await contractInstance.deployed()
  const contractAddress = contractInstance.address

  console.log(`OGSRouter02 deployed to: ${contractAddress}`)

  await delay(20000)
  await verify(contractAddress, constructorArgs)
}

deploy()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error)
    process.exit(1)
  })
