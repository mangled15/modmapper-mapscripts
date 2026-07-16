import * as modmapper from "modmapper"
await modmapper.setDifficulty("ExpertPlusStandard.dat") // Make sure this matches the name of the diff you want to mod EXACTLY

/**
 * Important info
 * back light: id: 9999 type: 2 
 */


// --- SETUP ---
function removeEnv(id) {
    id.forEach(object => {
        modmapper.modifyEnvironment({
            id: object,
            lookupMethod: "Contains",
            position: [0, 6767676767, 0],
        })
    });
}

// removes all the thing I dont want
removeEnv([, "DynamicTeslaDisc", "DirectionalLights", "Tube", "GagaBasicGameHUD", "Logo", "Runway", "Tower", "RunwayPier", "[9]Construction", "FrontLasers", "PlayersPlace", "BackCube", "Smoke", "Aurora"])

modmapper.modifyEnvironment({
    id: "DynamicTeslaDisc\\.\\[\\d+\\]\\w+",
    lookupMethod: 'Regex',
    active: false
})

setupEnv()
function setupEnv() {
    // floor mirror
    modmapper.modifyEnvironment({
        id: "GagaEnvironment.[0]Environment.[10]PlayersPlace.[0]Mirror",
        lookupMethod: "Exact",
        duplicate: 1,
        position: [0, -5, 0],
        scale: [100, 1, 100],
    })
    // back light
    modmapper.modifyEnvironment({
        id: "GagaEnvironment.[0]Environment.[17]RunwayPillar.[3]RunwayLightR1",
        lookupMethod: "Exact",
        duplicate: 1,
        position: [-1000, 100, 1000],
        rotation: [0, 0, -90],
        scale: [.01, 8000, .01],
        track: "mainLight",
        components: {
            ILightWithId: {
                lightID: 9999,
                type: 3
            },
            TubeBloomPrePassLight: {
                bloomFogIntensityMultiplier: 1000
            }
        }
    })
    modmapper.addLightEvent(0, {
        brightness: 2,
        color: [0, 0.02, 0.04],
        eventLane: 3,
        lightID: 9999,
        type: 1
    })
    // fog settings
    modmapper.modifyEnvironment({
        id: "[0]Environment",
        lookupMethod: "EndsWith",
        components: {
            BloomFogEnvironment: {
                attenuation: 0.00001,
                height: 300,
                startY: -1000
            }
        }
    })
    // stars
    for (let i = 0; i <= 3; i++) {
        modmapper.modifyEnvironment({
            id: "StarSky",
            lookupMethod: "Contains",
            duplicate: 1,
            rotation: [15 * i, 3 * i, 7 * i]
        })
    }
}

introLights()
function introLights() {
    // cloning
    const introLightAmount = 3
    const introLightPositions = [
        [0, 500, 50],
        [50, 500, 100],
        [-50, 500, 100],
    ]
    let introLightIds = []
    for (let i = 0; i < introLightAmount; i++) {
        introLightIds.push(1000 + i)
    }
    // lights
    modmapper.addLightEvent(0, {
        lightID: introLightIds,
        eventLane: 0,
        brightness: 0.1,
        color: [1, 1, 1],
        type: 1
    })

    for (let i = 0; i < introLightAmount; i++) {
        modmapper.modifyEnvironment({
            id: "GagaEnvironment.[0]Environment.[17]RunwayPillar.[3]RunwayLightR1",
            lookupMethod: "Exact",
            position: introLightPositions[i],
            rotation: [0, 0, 0],
            scale: [0, 2000, 0],
            track: `introLight${i}`,
            duplicate: 1,
            components: {
                ILightWithId: {
                    lightID: 1000 + i,
                    type: 0
                }
            }
        })
        const introBeats = [8, 8.5, 9, 16, 16.5, 17, 20, 20.5, 21, 24, 24.5, 25, 32, 32.5, 33, 36, 36.5, 37, 40, 138, 138.25, 138.35, 138.5, 138.75, 139, 205, 205.5, 206, 207.5, 208, 208.5]

        for (let j = 0; j < introBeats.length; j++) {
            const lightIrn = j % introLightAmount
            // lights
            modmapper.addLightEvent(introBeats[j], {
                lightID: introLightIds[lightIrn],
                eventLane: 0,
                brightness: 1,
                color: [1, 1, 1],
                type: 3
            })

            // animations
            modmapper.animateTrack({
                track: `introLight${i}`,
                duration: 5,
                beat: introBeats[j],
                animation: {
                    // position: [
                    //     [introLightPositions[i][0], introLightPositions[i][1] - 500, introLightPositions[i][2], 0],
                    //     [introLightPositions[i][0], introLightPositions[i][1] + 500, introLightPositions[i][2], 0.5],
                    //     [introLightPositions[i][0], introLightPositions[i][1] - 500, introLightPositions[i][2], 1],
                    // ]
                    scale: [
                        [0, 2000, 0, 0],
                        [0, 2000, 0, 0.2],
                        [0, 2000, 0, 1]
                    ]
                }
            })
        }
    }
}

// beat 44 DROP
// interval ~=~ 8 beats
drop("right", 44, 1100, 1)

drop("left", 52, 1200, -1)

drop("right", 60, 1300, 1)

drop("left", 68, 1400, -1)

drop("right", 76, 1500, 1)

drop("left", 84, 1600, -1)

drop("left", 92, 1700, -1)
drop("right", 92, 1800, 1)

drop("left", 100, 1900, 1)
drop("right", 100, 2000, -1)

function drop(side, startBeat, startID, dir) {
    let x
    let rotDir = dir
    if (side == "right") {
        x = 5
    } else if (side == "left") {
        x = -5
    }
    else {
        x = 0
    }
    const rightSideBeamAmount = 70
    const lightEventIds = []
    for (let i = 0; i < rightSideBeamAmount; i++) {
        lightEventIds.push(startID + i)
    }
    //lights
    modmapper.addLightEvent(startBeat, {
        brightness: 1,
        type: 1,
        color: [1, 1, 1],
        eventLane: 0,
        lightID: lightEventIds
    })
    //lights
    modmapper.addLightEvent(startBeat + ((rightSideBeamAmount / 10) + 1), {
        brightness: 1,
        type: 3,
        color: [1, 0.8, 0.8],
        eventLane: 0,
        lightID: lightEventIds
    })

    // cloning
    for (let i = 0; i < rightSideBeamAmount; i++) {
        modmapper.modifyEnvironment({
            id: "GagaEnvironment.[0]Environment.[17]RunwayPillar.[3]RunwayLightR1",
            lookupMethod: "Exact",
            position: [x, 20, -1],
            rotation: [0, 0, 0],
            scale: [1, 2000, 1],
            track: `dropLight${startID + i}`,
            duplicate: 1,
            components: {
                ILightWithId: {
                    lightID: startID + i,
                    type: 0
                }
            }
        })
        // console.log(typeof (startID + i), startID + i)

        // animation
        modmapper.animateTrack({
            track: `dropLight${startID + i}`,
            duration: 10,
            beat: startBeat + (i / 10),
            animation: {
                position: [
                    [x, 100, -1, 0],
                    [x, 500, 500, 0.5, "easeInOutSine"]
                ],
                rotation: [
                    [0, 0, 0, 0],
                    [0, 0, (i * 2) * rotDir, 0.3],
                    [0, 0, (i * 2) * rotDir + 90, 0.3]
                ],
                scale: [
                    [1, 2000, 1, 0],
                    [1, 2000, 1, 0.2],
                    [1, 1, 1, 1]
                ]
            }
        })
    }
}

// IN BETWEEN DROPS
inBetweenDrops(108, 2100, 10, 40, -100, 0, false)

inBetweenDrops(112, 2200, -10, 40, 100, 0, false)

inBetweenDrops(116, 2300, 10, 40, -100, 0, false)

inBetweenDrops(120, 2400, 10, 80, -100, 0, true)

inBetweenDrops(120, 2500, -10, 80, 100, 0, true)

inBetweenDrops(128, 2600, 10, 40, -100, 0, false)

inBetweenDrops(132, 2700, 10, 40, 100, 0, false)

inBetweenDrops(136, 2800, -10, 20, -100, 0, false)

modmapper.addLightEvent(138, {
    brightness: 2,
    type: 3,
    eventLane: 3,
    lightID: 9999,
    color: [0, 0.02, 0.04]
})
modmapper.addLightEvent(138.1, {
    brightness: 1,
    type: 4,
    eventLane: 3,
    lightID: 9999,
    color: [0, 0, 0]
})
modmapper.addLightEvent(139.8, {
    brightness: 2,
    type: 0,
    eventLane: 3,
    lightID: 9999,
    color: [0, 0, 0]
})
modmapper.addLightEvent(140, {
    brightness: 2,
    type: 4,
    eventLane: 3,
    lightID: 9999,
    color: [0, 0.02, 0.04]
})

function inBetweenDrops(beat, startLightID, angle, amount, side, yaw, aa) {
    let startBeat = beat
    let allLightIDs = []
    for (let i = 0; i < amount; i++) {
        allLightIDs.push(startLightID + i)
    }
    modmapper.addLightEvent(startBeat, {
        lightID: allLightIDs,
        brightness: 1,
        color: [1, 1, 1],
        type: 1,
        eventLane: 0
    })
    modmapper.addLightEvent(startBeat + (amount / 10) + 1, {
        lightID: allLightIDs,
        brightness: 0,
        color: [1, 1, 1],
        type: 4
    })
    for (let i = 0; i < amount; i++) {
        modmapper.modifyEnvironment({
            id: "GagaEnvironment.[0]Environment.[17]RunwayPillar.[3]RunwayLightR1",
            lookupMethod: "Exact",
            position: [10, 20, -10],
            rotation: [10, yaw, angle],
            scale: [5, 2000, 5],
            track: `inBetweenLight${startLightID + i}`,
            duplicate: 1,
            components: {
                ILightWithId: {
                    lightID: startLightID + i,
                    type: 0
                }
            }
        })
        // animation
        modmapper.animateTrack({
            beat: startBeat + i / 10,
            duration: 1,
            track: `inBetweenLight${startLightID + i}`,
            animation: {
                position: [
                    [side, 0, -10, 0],
                    [side * -1, 0, 1000, 1, "easeOutSine"]
                ]
            }
        })
    }

    if (aa === true) {
        modmapper.addLightEvent(122, {
            brightness: 1,
            type: 0,
            lightID: allLightIDs,
            color: [1, 1, 1],
            eventLane: 0,
        })
        modmapper.addLightEvent(123, {
            brightness: 1,
            type: 0,
            lightID: allLightIDs,
            color: [1, 1, 1],
            eventLane: 0,
        })
        modmapper.addLightEvent(122.5, {
            brightness: 1,
            type: 1,
            lightID: allLightIDs,
            color: [1, 1, 1],
            eventLane: 0,
        })
        modmapper.addLightEvent(123.5, {
            brightness: 1,
            type: 1,
            lightID: allLightIDs,
            color: [1, 1, 1],
            eventLane: 0,
        })
    }
}

// I NEED YOU TO FOCUS. startBeat = 140. interval ~=~ 4 beats.
I_NEED_YOU_TO_FOCUS(140, -50, 100, 1, 3000, 20)

I_NEED_YOU_TO_FOCUS(144, 100, 300, -1, 3100, 20)

//154
I_NEED_YOU_TO_FOCUS(148, -275, 100, 1, 3200, 60)
I_NEED_YOU_TO_FOCUS(148, 275, 100, -1, 3300, 60)

I_NEED_YOU_TO_FOCUS(156, 50, 150, -1, 3400, 20)

I_NEED_YOU_TO_FOCUS(160, -100, 50, 1, 3500, 20)

I_NEED_YOU_TO_FOCUS(164, -100, 250, -1, 3600, 20)

I_NEED_YOU_TO_FOCUS(168, 125, 100, -1, 3700, 20)

I_NEED_YOU_TO_FOCUS(168, 75, 100, -1, 3800, 20)

I_NEED_YOU_TO_FOCUS(172, -125, 175, 1, 3900, 20)

I_NEED_YOU_TO_FOCUS(176, -100, 100, 1, 4000, 20)

I_NEED_YOU_TO_FOCUS(180, -275, 100, 1, 4100, 60)
I_NEED_YOU_TO_FOCUS(180, 275, 100, -1, 4200, 60)

I_NEED_YOU_TO_FOCUS(188, 150, 300, -1, 4300, 20)

I_NEED_YOU_TO_FOCUS(192, 50, 150, -1, 4400, 20)

I_NEED_YOU_TO_FOCUS(196, -100, 250, -1, 4500, 20)

// end
I_NEED_YOU_TO_FOCUS(200, -275, 100, 1, 4600, 20)
I_NEED_YOU_TO_FOCUS(200, 275, 100, -1, 4700, 20)
I_NEED_YOU_TO_FOCUS(200, 50, 150, -1, 4800, 20)
I_NEED_YOU_TO_FOCUS(200, -100, 50, 1, 4900, 20)
I_NEED_YOU_TO_FOCUS(200, -100, 250, -1, 5000, 20)
I_NEED_YOU_TO_FOCUS(200, 125, 100, -1, 5100, 20)
I_NEED_YOU_TO_FOCUS(200, 125, 100, -1, 5200, 20)
I_NEED_YOU_TO_FOCUS(200, -125, 175, 1, 5300, 20)
I_NEED_YOU_TO_FOCUS(200, -100, 100, 1, 5400, 20)
I_NEED_YOU_TO_FOCUS(200, -5, 100, 1, 5500, 20)
I_NEED_YOU_TO_FOCUS(200, 15, 100, -1, 5600, 20)
I_NEED_YOU_TO_FOCUS(200, 150, 300, -1, 5700, 20)
I_NEED_YOU_TO_FOCUS(200, 50, 150, -1, 5800, 20)
I_NEED_YOU_TO_FOCUS(200, -100, 250, -1, 5900, 20)

function I_NEED_YOU_TO_FOCUS(startBeat, x, z, dir, startLightID, num) {
    let amount = num
    let allLightIDs = []
    for (let i = 0; i < amount; i++) {
        allLightIDs.push(startLightID + i)
        modmapper.animateTrack({
            track: `focusLights${startLightID + i}`,
            beat: 0.5,
            duration: 1,
            animation: {
                position: [
                    [0, -2000, 0, 0],
                ]
            }
        })
    }
    modmapper.addLightEvent(140, {
        brightness: 0,
        lightID: allLightIDs,
        color: [1, 1, 1],
        eventLane: 0,
        type: 1
    })
    for (let i = 0; i < amount; i++) {
        modmapper.modifyEnvironment({
            id: "GagaEnvironment.[0]Environment.[17]RunwayPillar.[3]RunwayLightR1",
            lookupMethod: "Exact",
            position: [(x + ((i * 5) * dir)), 0, z],
            rotation: [0, 0, 0],
            scale: [1, 2000, 1],
            track: `focusLights${startLightID + i}`,
            duplicate: 1,
            components: {
                ILightWithId: {
                    lightID: startLightID + i,
                    type: 0
                }
            }
        })

        // lights
        modmapper.addLightEvent(startBeat + i / 10, {
            brightness: 1,
            color: [1, 1, 1],
            eventLane: 0,
            lightID: startLightID + i,
            type: 1
        })

        // animation
        modmapper.animateTrack({
            track: `focusLights${startLightID + i}`,
            beat: startBeat,
            duration: 1,
            animation: {
                position: [
                    [(x + (i * 5) * dir), 0, z, 0],
                ],
                scale: [
                    [0, 2000, 0, 0]
                ]
            }
        })
        modmapper.animateTrack({
            track: `focusLights${startLightID + i}`,
            beat: startBeat + i / 10,
            duration: 1,
            animation: {
                position: [
                    [(x + (i * 5) * dir), 0, z, 0],
                    [(x + (i * 5) * dir), 0, z, 0.9],
                    [(x + (i * 5) * dir), -2000, z, 1]
                ],
                scale: [
                    [1, 2000, 0, 0]
                ]
            }
        })
    }
    modmapper.addLightEvent(startBeat + amount / 10, {
        brightness: 1.5,
        color: [1, 0.8, 0.8],
        eventLane: 0,
        lightID: allLightIDs,
        type: 3
    })
}

// fade back light
modmapper.addLightEvent(206, {
    brightness: 0,
    type: 4,
    eventLane: 3,
    lightID: 9999,
    color: [0, 0.02, 0.04]
})

// ^^^ code ^^^

// Make sure you run this function AFTER your code else it won't pick it up. And if you don't run this function then well it doesn't write any custom data (duhhh!)
modmapper.writeToFile()