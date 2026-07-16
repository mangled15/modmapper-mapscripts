import * as modmapper from "./main.js"
await modmapper.setDifficulty("ExpertPlusStandard.dat") // Make sure this matches the name of the diff you want to mod EXACTLY


// VVV code VVV

// ---------- INTRO ----------

function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min
}

const startID = 1000
const randomLightsAmount = 300

removeEnvironment()
fogSettings()
lightBars()
lights()
animateBars()

function removeEnvironment() {
    modmapper.modifyEnvironment({
        id: "TriangleEnvironment",
        lookupMethod: "Contains",
        position: [0, 999999, 0]
    })
    modmapper.modifyEnvironment({
        id: "GameCore",
        lookupMethod: "Contains",
        position: [0, 999999, 0]
    })

    modmapper.animateNoteInBetween(0, 999, {
        spawnEffect: false
    })
}

function fogSettings() {
    modmapper.modifyEnvironment({
        id: "Environment",
        lookupMethod: "EndsWith",
        components: {
            BloomFogEnvironment: {
                attenuation: 0.00005,
                height: -300,
                startY: 1000
            }
        }
    })
}

function lightBars() {
    for (let i = 0; i <= randomLightsAmount; i++) {
        modmapper.modifyEnvironment({
            id: "TriangleEnvironment.[0]Environment.[29]DoubleColorLaser (1)",
            lookupMethod: "Exact",
            track: `lightBars${i}`,
            position: [randomInt(-1000, 1000), 200, randomInt(-50, 600)],
            rotation: [randomInt(-10, 10), 0, randomInt(-10, 10)],
            scale: [1, 50, 1],
            duplicate: 1,
            components: {
                ILightWithId: {
                    lightID: startID,
                },
                TubeBloomPrePassLight: {
                    bloomFogIntensityMultiplier: 1
                }
            }
        })
    }
}

function lights() {
    let pruplelights = []
    let greenlights = []
    let bluelights = []

    for (let i = 0; i <= randomLightsAmount; i++) {
        let id = startID + i
        if (i % 3 === 0) {
            pruplelights.push(id)
        } else if ((i + 1) % 3 === 0) {
            greenlights.push(id)
        } else {
            bluelights.push(id)
        }
    }

    modmapper.addLightEventInBetween(0.5, 4, 16, {
        brightness: .3,
        color: [1, 0, 1],
        eventLane: 0,
        type: 2,
        lightID: pruplelights
    })

    modmapper.addLightEventInBetween(0.5, 4, 16, {
        brightness: .3,
        color: [0, 1, 0],
        eventLane: 0,
        type: 2,
        lightID: greenlights
    })

    modmapper.addLightEventInBetween(0.5, 4, 16, {
        brightness: .3,
        color: [0, 0, 1],
        eventLane: 0,
        type: 2,
        lightID: bluelights
    })
}
function animateBars() {
    for (let i = 0; i <= randomLightsAmount; i++) {
        let randomX = randomInt(-1000, 1000)
        let randomZ = randomInt(-100, 600)
        modmapper.animateTrack({
            track: `lightBars${i}`,
            beat: 0,
            duration: 58,
            animation: {
                position: [
                    [randomX, 2000, randomZ, 0],
                    [randomX, 2000, randomZ - 400, 1, "easeOutSine"]
                ],
                rotation: [
                    [0, 0, 0, 1]
                ]
            }
        })

        modmapper.animateTrack({
            track: `lightBars${i}`,
            beat: 58,
            duration: 6,
            animation: {
                position: [
                    [randomX, 2000, randomZ - 400, 0.1],
                    [randomX, 2000, randomZ - 500, 1, "easeInExpo"],
                    [-69420, -69420, -69420, 1]
                ],
                rotation: [
                    [0, 0, 0, 1]
                ]
            }
        })
    }
}


// ---------- First drop ----------

// start 64
modmapper.blenderImport(64, 220, "envWithUgleTree.rmmodel", {
    position: [0, -5, 0],
})

modmapper.modifyEnvironment({
    id: "TriangleEnvironment.[0]Environment.[29]DoubleColorLaser (1)",
    lookupMethod: "Exact",
    track: `plasmaBeam`,
    position: [-700, 2000, 500],
    rotation: [-10, 0, 20],
    scale: [1, 50, 1],
    duplicate: 1,
    components: {
        ILightWithId: {
            lightID: 100,
            type: 1
        },
        TubeBloomPrePassLight: {
            bloomFogIntensityMultiplier: 1000
        }
    }
})

modmapper.addLightEventInBetween(64, 0.25, 520, {
    brightness: 2.5,
    color: [0.9412, 0.6392, 0.2431],
    eventLane: 1,
    type: 2,
    lightID: 100
})

modmapper.addLightEventInBetween(64.1, 0.25, 519, {
    brightness: 2,
    color: [0.9412, 0.6392, 0.2431],
    eventLane: 1,
    type: 3,
    lightID: 100
})

for (let i = 194; i <= 210; i += 0.25) {
    let b = 0
    let t = 1
    if (2 / (i - 193) <= 0.13) {
        b = 0
        break
    } else if (2 / (i - 193) <= 0.14) {
        t = 3
        b = 2 / (i - 193)
    } else {
        b = 2 / (i - 193)
    }
    modmapper.addLightEvent(i, {
        brightness: b,
        color: [0.9412, 0.6392, 0.2431],
        eventLane: 1,
        type: t,
        lightID: 100
    })
}

// --- DON'T GIVE UP(outro) ---
let endLights = []
let xPos = [-500, -400, -300, -200, -100, 0, 100, 200, 300, 400, 500]
for (let i = 0; i < 20; i++) {
    modmapper.modifyEnvironment({
        id: "TriangleEnvironment.[0]Environment.[29]DoubleColorLaser (1)",
        lookupMethod: "Exact",
        position: [xPos[i], 100, 500],
        rotation: [0, 0, 0],
        scale: [1, 1, 1],
        duplicate: 1,
        components: {
            ILightWithId: {
                lightID: 10000 + i,
                type: 2
            },
            TubeBloomPrePassLight: {
                bloomFogIntensityMultiplier: 1000
            }
        }
    })
    endLights.push(10000 + i)
    // console.log(xPos[i] / 500)
}

const lyricBeats = [227, 228, 229.5, 231, 238, 239, 246, 247, 259, 260, 261.2, 262.75, 265, 270, 271, 278]
let r = 10000

let y = []
for (let i = 0; i <= 5; i++) {
    y.push(i / 5)
}
for (let i = 4; i >= 0; i--) {
    y.push(i / 5)
}

// console.log(endLights)

let blabla = 0

for (let i = 0; i < lyricBeats.length; i++) {
    modmapper.addLightEvent(lyricBeats[i], {
        brightness: 0.1,
        color: [1, 1, 1],
        eventLane: 2,
        type: 3,
        lightID: [endLights[blabla], endLights[blabla + 1]]
    })
    blabla += 1
    blabla = (blabla + 1) % endLights.length
}

modmapper.addLightEvent(279, {
    brightness: 0.2,
    type: 8,
    eventLane: 2,
    color: [0.8, 1, 0.8]
})
modmapper.addLightEvent(279.25, {
    brightness: 0.2,
    type: 3,
    eventLane: 2,
    color: [0.8, 1, 0.8]
})

const katoekBeat = [285, 285.5, 286.5, 287, 289, 289.5, 290.5, 291, 293, 293.5, 294.5, 295, 297, 297.5, 298.5, 299, 300.5, 301, 302, 302.5, 303.5, 304, 304.5, 305.5, 306, 307.5, 308, 309, 309.5, 311, 311.5, 312.5, 313, 314.5, 315, 316, 316.5]

for (let i = 0; i <= katoekBeat.length; i++) {
    modmapper.addLightEvent(katoekBeat[i], {
        brightness: 0.05,
        color: [0.8, 1, 0.8],
        type: 3,
        eventLane: 2,
        lightID: [endLights[0], endLights[1], endLights.at(-1), endLights.at(-2)]
    })
}

let extraKatoekBeatR = [301, 302.5]
let extraKatoekBeatL = [303.5]
for (let i = 0; i < extraKatoekBeatR.length; i++) {
    modmapper.editLightEvent(extraKatoekBeatR[i], {
        lightID: [endLights.at(-1), endLights.at(-2), endLights.at(-3), endLights.at(-4)],
        color: [0.5, 1, 1]
    }, 2)
}

for (let i = 0; i < extraKatoekBeatL.length; i++) {
    modmapper.editLightEvent(extraKatoekBeatL[i], {
        lightID: [endLights[0], endLights[1], endLights[2], endLights[3]],
        color: [0.5, 1, 1]
    }, 2)
}

// 310 bright fade start
for (let i = 0; i < 9; i += 0.1) {
    modmapper.addLightEvent(i + 308, {
        brightness: i / 100,
        color: [1, 1, 1],
        eventLane: 2,
        type: 1,
        lightID: endLights.slice(2, -2),
        easing: "easeInExpo"
    })
}

// ^^^ code ^^^

// Make sure you run this function AFTER your code else it won't pick it up. And if you don't run this function then well it doesn't write any custom data (duhhh!)
modmapper.writeToFile()
