let game = {
    money: 0,
    clickPower: 1,
    upgrades: [
        { id: 0, name: "Stronger Fingers", basePrice: 100, gain: 3, bought: false },
        { id: 1, name: "Cookies Shop", basePrice: 100, gain: 5, bought: false },
        { id: 2, name: "Industrial Oven", basePrice: 1000, gain: 10, bought: false },
        { id: 3, name: "Magic Yeast", basePrice: 10000, gain: 20, bought: false },
    ],
    missions: [
        { id: 0, text: "Click 50 times", target: 50, type: 'clicks', reward: 50, completed: false, collected: false },
        { id: 1, text: "Buy Cookies Shop", target: true, type: "buy", reward: 100, completed: false, collected: false },
        { id: 2, text: "Earn 500$ on your balance", target: 500, type: 'money', reward: 500, completed: false, collected: false },
        { id: 3, text: "Buy all Upgrades", target: true, type: 'buy', reward: 2500, completed: false, collected: false },
    ]
}

let myMoneyDisplay = document.getElementById("my-money")
const cookieBtn = document.getElementById("cookie-btn")
const missionTopBarDisplay = document.getElementById("mission-item")
const collectBtn = document.getElementById("collect-btn")
const upgradesContainer = document.getElementById("upgrades")
let powerValue = document.getElementById("power-value")
let clicks = 0
let currentMission = null

cookieBtn.addEventListener('click', () => {
    game.money += game.clickPower
    clicks++
    myMoneyDisplay.innerText = `Your money: ${game.money}$`
    verifyMissions()
    displayMissions()
})

collectBtn.addEventListener('click', () => {
    if (!currentMission) return
    game.money += currentMission.reward
    myMoneyDisplay.innerText = `Your money: ${game.money}$`
    currentMission.collected = true
    currentMission.completed = true
    collectBtn.style.display = 'none'
    displayMissions()
})

function createUpgradeButtons() {
    upgradesContainer.innerHTML = ''
    for (let upgrade of game.upgrades) {
        if (upgrade.bought) continue
        let span = document.createElement('span')
        span.classList.add('upgrade-item')
        let btn = document.createElement('button')
        btn.classList.add('button-buy')
        btn.innerText = `${upgrade.name} - ${upgrade.basePrice}$`
        btn.disabled = upgrade.bought
        btn.addEventListener('click', () => buyUpgrade(upgrade.id))
        span.appendChild(btn)
        upgradesContainer.appendChild(span)
    }
}

function buyUpgrade(id) {
    let upgrade = game.upgrades.find(u => u.id === id)
    if (!upgrade || upgrade.bought) return
    if (game.money >= upgrade.basePrice) {
        game.money -= upgrade.basePrice
        upgrade.bought = true
        game.clickPower += upgrade.gain
        powerValue.innerText = game.clickPower
        myMoneyDisplay.innerText = `Your money: ${game.money}$`
        createUpgradeButtons()
        verifyMissions()
        displayMissions()
    }
}

function verifyMissions() {
    for (let mission of game.missions) {
        if (mission.completed || mission.collected) continue
        if (mission.type === "clicks" && clicks >= mission.target) mission.completed = true
        if (mission.type === "money" && game.money >= mission.target) mission.completed = true
        if (mission.type === "buy") {
            if (mission.text.includes("Cookies Shop")) {
                let upgrade = game.upgrades.find(u => u.name === "Cookies Shop")
                if (upgrade && upgrade.bought) mission.completed = true
            }
            if (mission.text.includes("all Upgrades")) {
                let allBought = game.upgrades.every(u => u.bought)
                if (allBought) mission.completed = true
            }
        }
    }
}

function displayMissions() {
    let nextMission = game.missions.find(m => !m.collected)
    if (!nextMission) {
        currentMission = null
        missionTopBarDisplay.innerText = "All missions completed!"
        collectBtn.style.display = 'none'
        return
    }

    currentMission = nextMission
    missionTopBarDisplay.innerText = nextMission.text
    collectBtn.style.display = nextMission.completed && !nextMission.collected ? 'inline-block' : 'none'
    collectBtn.classList.add('collect-button') // додаємо клас для стилю з CSS
}

createUpgradeButtons()
displayMissions()
