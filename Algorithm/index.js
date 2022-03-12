const {cases} = require('./cases')
const {NOTIFY_MESSAGE} = require('./notify-message')

function selectContainers(iCase = {}){
  const rentedContainers = optimizeRentedContainer(iCase);
  return rentedContainers
}

function optimizeRentedContainer(iCase = {}){
  const containerList =  Array.isArray(iCase.listings) ? iCase.listings : []
  const neededContainer = iCase.neededContainer;
  const rentedContainers = {}
  const allSolutions = []
  // container.point = container.container / container.totalCost * 100 - container.container * 10
  let minContainer = containerList[0].container
  let maxContainer = containerList[0].container
  containerList.forEach((container) => {
    if (minContainer > container.container){
      minContainer = container.container
    }
    if (maxContainer < container.container){
      maxContainer = container.container
    }
  })
  let solution = resetSolution()
  if (minContainer <= neededContainer){
    // const loopTime = (neededContainer / minContainer).toFixed
    // const loops = new Array(loopTime).fill(0)
    containerList.forEach((container, index) => {
      console.log(solution)
      solution.containerType[index] += 1
      solution.containerAmount += container.container
      solution.totalCost += container.totalCost
      // allSolutions.push(index)
      
      containerList.forEach((container2, index2) => {
        console.log(solution)
        solution.containerAmount += container2.container
        solution.totalCost += container2.totalCost
        solution.containerType[index2] += 1
    
        allSolutions.push(solution)
      })
    })
  }
}


function resetSolution(){
  return {
    containerAmount: 0,
    totalCost: 0,
    containerType: [
      0, 0 ,0
    ]
  }
}

function displayOutput(algorithmCase){
  
}

selectContainers(cases.firstCase);