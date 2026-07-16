import * as modmapper from "modmapper"
await modmapper.setDifficulty("ExpertPlusStandard.dat") // Make sure this matches the name of the diff you want to mod EXACTLY
// await modmapper.setInformation("Info.dat", {
//     requirements: [
//         "Chroma"
//     ],
//     environment: "BillieEnvironment",
//     settings: {
//         _playerOptions: {
//             _environmentEffectsFilterDefaultPreset: "AllEffects",
//             _environmentEffectsFilterExpertPlusPreset: "AllEffects",
//             _noTextsAndHuds: true,
//         }
//     },
//     information: ["Won't see much without all effects turned on"],
//     warnings: ["HEAVY EPILEPSY WARNING"]
// }) // You should leave the requirements as it is because chrome will not work if it isn't suggested or required.

// VVV code VVV

function removeEnvironmentObjects(ids) {
    for (let i = 0; i < ids.length; i++) {
        modmapper.modifyEnvironment({
            id: ids[i],
            lookupMethod: "Contains",
            position: [0, -100000, 0]
        })
    }
}

// Prepare environment
removeEnvironmentObjects(["BasicGameHUDBillie", "WaterRainRipples", "Clouds", "Rail", "DayAndNight", "Mountains", "Waterfall"])

// Fog settings
modmapper.modifyEnvironment({
    id: "BillieEnvironment.[0]Environment",
    lookupMethod: "Exact",
    rotation: [0, 0, 0],
    components: {
        BloomFogEnvironment: {
            attenuation: 0,
            height: 300,
            startY: -1000
        }
    }
})

// Clouds left/right
modmapper.modifyEnvironment({
    id: "Clouds",
    lookupMethod: "Contains",
    track: "Clouds",
    duplicate: 1,
    position: [0, 0, 0]
})

cloudRot(37, 30)
cloudRot(69, 14)
cloudRot(85, 16)
function cloudRot(startBeat, amount) {
    let previousCloudRot = 50
    for (let i = 0; i < amount; i++) {
        let dir = i % 2
        if (dir === 0) {
            dir = -1
        }
        modmapper.animateTrack({
            beat: i + startBeat,
            track: "Clouds",
            duration: 1,
            animation: {
                rotation: [
                    [-90, previousCloudRot, 0, 0],
                    [-90, 50 * dir, 0, 1]
                ],
                scale: [
                    [1, 1, 1, 0],
                    [2, 2, 2, 0.2],
                    [1, 1, 1, 1]
                ]
            }
        })
        previousCloudRot = 50 * dir
    }
}

// sky remove
modmapper.modifyEnvironment({
    id: "DayAndNight",
    lookupMethod: "Contains",
    active: false
})
// back light
modmapper.modifyEnvironment({
    id: "BillieEnvironment.[0]Environment.[34]LightRailingSegment (3).[1]NeonTubeDirectionalL",
    lookupMethod: "Exact",
    duplicate: 1,
    position: [-1000, 2, 100],
    rotation: [0, 0, 90],
    scale: [2, 10, 2],
    components: {
        ILightWithId: {
            lightID: 1000,
            type: 0
        },
        TubeBloomPrePassLight: {
            bloomFogIntensityMultiplier: 0.1
        }
    }
})

for (let i = 0; i < 30; i++) {
    modmapper.addLightEvent(i + 5, {
        brightness: i * 10,
        color: [.5, .5, .5],
        eventLane: 0,
        type: 4,
        lightID: [1000]
    })
}
modmapper.addLightEvent(35, {
    brightness: 1,
    color: [1, 1, 1],
    eventLane: 0,
    type: 0,
    lightID: [1000]
})
// pulse
dropPulse(37, 30)
dropPulse(69, 14)
dropPulse(85, 16)
function dropPulse(startBeat, amount) {
    modmapper.addLightEventInBetween(startBeat, 1, amount, {
        brightness: 1,
        color: [1, 1, 1],
        eventLane: 0,
        type: 0,
        lightID: [1000]
    })
    modmapper.addLightEventInBetween(startBeat + .2, 1, amount, {
        brightness: 1,
        color: [1, 0.7, 0.7],
        eventLane: 0,
        type: 3,
        lightID: [1000]
    })
    modmapper.editLightEvent(startBeat, {
        type: 0
    })
    modmapper.editLightEvent(startBeat + .2 + amount, {
        type: 0
    })
}

// beat 21 dushhh
let SideIds = [2000, 2001]
spawnSideLight(1)
spawnSideLight(-1)
function spawnSideLight(side) {
    modmapper.modifyEnvironment({
        id: "BillieEnvironment.[0]Environment.[34]LightRailingSegment (3).[1]NeonTubeDirectionalL",
        lookupMethod: "Exact",
        duplicate: 1,
        position: [25 * side, 500, 100],
        rotation: [0, 0, 0],
        scale: [2, 10, 2],
        components: {
            ILightWithId: {
                lightID: 2000,
                type: 1
            },
            TubeBloomPrePassLight: {
                bloomFogIntensityMultiplier: 10
            }
        }
    })
    modmapper.addLightEvent(21, {
        lightID: SideIds,
        brightness: 50,
        color: [1, 0, 0],
        eventLane: 1,
        type: 3
    })
}

flashLights(37, 67)
flashLights(69, 83)
flashLights(85, 101)
function flashLights(startBeat, endBeat) {
    // right light flash
    modmapper.addLightEventInBetween(startBeat, 0.5, modmapper.calculateAmount(startBeat, 0.5, endBeat - .5), {
        brightness: 50,
        color: [1, 1, 1],
        eventLane: 1,
        type: 1,
        lightID: 2000
    })
    modmapper.addLightEventInBetween(startBeat + 0.1, 0.5, modmapper.calculateAmount(startBeat, 0.5, endBeat - .5), {
        brightness: 0,
        color: [1, 1, 1],
        eventLane: 1,
        type: 0,
        lightID: 2000
    })
    // left light flash
    modmapper.addLightEventInBetween(startBeat + 0.25, 0.5, modmapper.calculateAmount(startBeat + .25, 0.5, endBeat), {
        brightness: 50,
        color: [1, 1, 1],
        eventLane: 1,
        type: 1,
        lightID: 2001
    })
    modmapper.addLightEventInBetween(startBeat + 0.35, 0.5, modmapper.calculateAmount(startBeat + .25, 0.5, endBeat), {
        brightness: 0,
        color: [1, 1, 1],
        eventLane: 1,
        type: 0,
        lightID: 2001
    })
}
// in between sections
let betweenBeats = [68, 83, 83.25, 83.5, 84, 84.25, 84.5]
for (let i = 0; i < betweenBeats.length; i++) {
    modmapper.addLightEvent(betweenBeats[i], {
        lightID: [2000, 2001],
        brightness: 10,
        color: [1, 0, 0],
        eventLane: 1,
        type: 4
    })
    modmapper.addLightEvent(betweenBeats[i] + 0.1, {
        lightID: [2000, 2001],
        brightness: 0,
        color: [1, 0, 0],
        eventLane: 1,
        type: 4
    })
    modmapper.addLightEvent(betweenBeats[i] - 0.1, {
        lightID: [2000, 2001],
        brightness: 0,
        color: [1, 0, 0],
        eventLane: 1,
        type: 4
    })
}

// end fade
modmapper.editLightEventInBetween(101, 102, {
    type: 4,
    brightness: 1,
    color: [1, 1, 1],
    eventLane: 0,
    lightID: 1000
}, 0)
modmapper.addLightEvent(125, {
    brightness: 0,
    color: [1, 1, 1],
    eventLane: 0,
    type: 4,
    lightID: 1000
})
// ^^^ code ^^^

// Make sure you run this function AFTER your code else it won't pick it up. And if you don't run this function then well it doesn't write any custom data (duhhh!)
modmapper.writeToFile()