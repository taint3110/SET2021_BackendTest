const {cases} = require('./cases')
const {NOTIFY_MESSAGE} = require('./notify-message')
const firstCase = cases.firstCase
const secondCase = cases.secondCase
const thirdCase = cases.thirdCase

function optimizeSolution(contractsList, neededContainer = 0){
  contractsList =  Array.isArray(contractsList) ? contractsList : []
  const containersList = []
  const possibleSolutions = []
  contractsList.forEach(contract => {
    containersList.push(contract.container)
  }) 
  let currentContainer = containersList[0]

  containersList.forEach((container, index) => {
    if (container === neededContainer) {
      possibleSolutions.push({
        container: container,
        positions: index,
        price: contractsList[index].totalCost
      })
      currentContainer = 0
    }

    if (container < neededContainer) {
      currentContainer = container
      let positions = [index]

      for(let position = index; position < containersList.length - 1; position++){
        currentContainer += containersList[position+1]
        if (currentContainer === neededContainer) {
          positions.push(position + 1)
          let price = 0
          positions.forEach(position => {
            price += contractsList[position].totalCost
          })
          possibleSolutions.push({
            container: currentContainer,
            positions: positions,
            price: price
          })
          positions = []
        }
        positions.push(position + 1)

        if (currentContainer > neededContainer) {
          currentContainer -= container
          positions = [index + 1]
        }

        if(positions.length == containersList.length && possibleSolutions.length === 0 && currentContainer < neededContainer){
          let price = 0
          positions.forEach(position => {
            price += contractsList[position].totalCost
          })
          possibleSolutions.push({
            container: currentContainer,
            positions: positions,
            price: price
          })
        }
      }
    }
  })
  if(Array.isArray(possibleSolutions) && possibleSolutions.length > 0){
    let lowestPrice = possibleSolutions[0].price
    possibleSolutions.forEach(solution => {
      if(lowestPrice > solution.price){
        lowestPrice = solution.price
      }
    })
    possibleSolutions.forEach(solution => {
      if(solution.price == lowestPrice){
        return solution
      }
    })
  }
  return possibleSolutions[0]
}

function calculateSolution(contractsList, neededContainer){
  const bestSolution = optimizeSolution(contractsList, neededContainer)
  const positions = Array.isArray(bestSolution.positions) ? bestSolution.positions : [bestSolution.positions]
  positions.forEach(position => {
    let name = contractsList[position].name
    let container = contractsList[position].container
    let price = contractsList[position].totalCost
    console.log(`${NOTIFY_MESSAGE.CONTRACT_WITH} ${name} ${container}, ${NOTIFY_MESSAGE.PRICE} ${price}`)
  })
  if(bestSolution.container < neededContainer){
    console.log(NOTIFY_MESSAGE.NOT_ENOUGH_CONTAINER)
  }
  console.log(`${NOTIFY_MESSAGE.SUMMARY} ${bestSolution.price}`)
}

calculateSolution(firstCase.listings, firstCase.neededContainer)

module.exports = {calculateSolution, optimizeSolution} 