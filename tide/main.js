// I GOT A LOT OF USEFUL INFORMATION FROM https://heck.aeroluna.dev/ THEY HELPED ME A TON!!!

import fs from 'node:fs'

const colors = {
    reset: "\x1b[0m",
    red: "\x1b[31m",
    green: "\x1b[32m",
    yellow: "\x1b[33m",
    blue: "\x1b[34m",
    magenta: "\x1b[35m",
    cyan: "\x1b[36m",
    bold: "\x1b[1m",
};

console.log(colors.green, "[OK] Started " + import.meta.filename, colors.reset)

async function fileExists(path) {
    try {
        await fs.promises.access(path);
        console.log(colors.green, `[OK] ${path} found!`, colors.reset)
        return true;
    } catch (err) {
        console.log(colors.magenta, `[CRITICAL] VVV Wrong file name? File does not exist? VVV`, colors.reset)
        console.error(err)
        console.log(colors.magenta, `[CRITICAL] ^^^ Wrong file name? File does not exist? ^^^`, colors.reset)
        return false;
    }

}

let difficulty
let data
let diffJSON

/**
 * 
 * @param {string} diff - Pass in the name of the difficulty you want to edit with modmapper 
 */
export async function setDifficulty(diff) {
    difficulty = diff
    const found = await fileExists(difficulty)
    if (found) {
        data = fs.readFileSync(difficulty, "utf-8")
        diffJSON = JSON.parse(data)

        // erasing previous custom data
        diffJSON.customData = {}
        diffJSON.customData.customEvents = []
        diffJSON.customData.environment = []
        diffJSON.colorNotes.forEach(note => {
            delete note.customData
        })
        diffJSON.basicBeatmapEvents.forEach(event => {
            delete event.customData
        })
        diffJSON.customData.materials = {}
        diffJSON.basicBeatmapEvents = []
    }
    else {
        console.log(colors.magenta, `[CRITICAL] Could not find ${difficulty} in the current directonary`, colors.reset)
        return;
    }
}

// --- NOTES ---
/**
 * @typedef {Object} noteAnimationProperties
 * @property {boolean} [spawnEffect] - Should the note have a spawn effect? Either true or false. Default = true
 * @property {boolean} [disableNoteGravity] - When true, notes will no longer do their animation where they float up. Default = false
 * @property {boolean} [disableNoteLook] - When true, notes will no longer rotate towards the player. Default = false
 * @property {boolean} [disableBadCutDirection] - When true, the note cannot be cut from wrong direction. Default = false
 * @property {boolean} [disableBadCutSpeed] - When true, the note cannot be cut with insufficient speed. Default = false
 * @property {boolean} [disableBadCutSaberType] - When true, the note cannot be cut with the wrong saber. Default = false
 * @property {string} [link] - When cut, all notes with the same link string will also be cut.
 * @property {boolean} [uninteractable] - When true, the note/wall cannot be interacted with. This means notes cannot be cut and walls will not interact with sabers/putting your head in the wall. Notes will still count towards your score.
 * @property {string} [track] - A very powerful property. Assigns a track to an object. You can animate a track so that all of the objects assigned to that track get animated as well at the same time.
 * @property {{
 *      position?: [][]
 *      localPosition?: [][]
 *      offsetPosition?: [][]
 *      definitePosition?: [][]
 *      rotation?: [][]
 *      localRotation?: [][]
 *      offsetWorldRotation?: [][]
 *      dissolve?: [][]
 *      dissolveArrow?: [][]
 *      scale?: [][]
 * }} [animation]
 */

/**
 * Animates a note | Recommended to use with a for loop
 * @param {number} beat - The beat the note is on that you want to animate
 * @param {noteAnimationProperties} properties - How should the note behave?
 */
export function animateNote(beat, properties) {
    if (diffJSON.colorNotes.forEach(note => {
        if (note.b == beat) {
            note.customData = properties
        }
    }));
}

/**
 * Animates a set of notes in between 2 beats(INCLUSIVE) using a for loop
 * @param {number} beat1 - The start beat
 * @param {number} beat2 - The end beat
 * @param {noteAnimationProperties} properties - How should the note behave?
 */
export function animateNoteInBetween(beat1, beat2, properties) {
    if (properties) {
        for (const note of diffJSON.colorNotes) {
            if (note.b >= beat1 && note.b <= beat2) {
                note.customData = properties
            }
        }
    }
}

// --- TRACKS ---

/**
 * @typedef {Object} animateTrackProperties
 * @property {string} track - What track should be animated?
 * @property {number} duration - How many beats should the track animation last?
 * @property {number} beat - On what beat should the animation start?
 * @property {number} [repeat] - How many times does this animation repeat?
 * @property {{
 *      position?: [][]
 *      localPosition?: [][]
 *      offsetPosition?: [][]
 *      definitePosition?: [][]
 *      rotation?: [][]
 *      localRotation?: [][]
 *      offsetWorldRotation?: [][]
 *      dissolve?: [][]
 *      dissolveArrow?: [][]
 *      scale?: [][]
 * }} animation
 */

/**
 * Animates a track
 * @param {animateTrackProperties} properties
 */
export function animateTrack(properties) {
    if (diffJSON && properties) {
        const b = properties.beat
        const t = "AnimateTrack"
        const d = {
            track: properties.track,
            ...properties.animation,
            duration: properties.duration,
            easing: properties.animation.easing,
            repeat: properties.repeat
        }

        const newProperties = {
            b,
            t,
            d,
        }

        diffJSON.customData.customEvents.push(newProperties)
    }
}

// --- ENVIRONMENT ---

/**
 * @typedef {"Regex"|"Exact"|"Contains"|"StartsWith"|"EndsWith"} LookupMethod
 */

/**
 * @typedef {Object} modifyEnvironmentProperties
 * @property {string} id - Enter the id of the EnvironmentObject
 * @property {LookupMethod} lookupMethod - What method should be used to look up the object? Regex, Exact, Contains, StartsWith, EndsWith. Default = Regex
 * @property {number} [duplicate] - How many duplicates should be made of the object?
 * @property {boolean} [active] - Should the object activated? | true or false. Default = true
 * @property {any} [position] - Where should the object be positioned?
 * @property {any} [rotation] - How should the object be rotated?
 * @property {any} [scale] - How big should the object be?
 * @property {any} [localPosition] - Where should the object be positioned relitive to it's set position?
 * @property {any} [localRotation] - How should the object be rotated relative to it's set rotation??
 * @property {any} [track] - What track should be assigned to the object?
 * @property {{
 *      ILightWithId?: {
 *          lightID?: number
 *          type?: number
 *      }
 *      BloomFogEnvironment?: {
 *          attenuation?: number
 *          startY?: number
 *          height?: number
 *      }
 *      TubeBloomPrePassLight?: {
 *          colorAlphaMultiplier?: number
 *          bloomFogIntensityMultiplier?: number
 *      }
 * }} [components]
 */

/**
 * Used to modify(NOT ANIMATE) objects in the environment. It can be pretty complicated. For more information and guides go to the modmapper wiki(Doesn't exist yet)
 * @param {modifyEnvironmentProperties} properties
 */
export function modifyEnvironment(properties) {
    if (diffJSON && properties) {
        diffJSON.customData.environment.push(properties)
    }
}

// --- LIGHTS ---

/**
 * @typedef {Object} lightEventProperties
 * @property {number} [lightID] - What ID does the light event get?
 * @property {number} [brightness] - How bright should the light be? 1 is default brightness but can go way above or below.
 * @property {any} [color] - What color should the light be? You can set this is chromapper or manually do it here. Look at the wiki on how you should input colors.
 * @property {string} [easing] - What easing style should the light event have?
 * @property {string} [lerpType] - What lerping should the light even have? Either "RGB" or "HSV"
 * @property {number} [type] - Type of lighting event. 0 = off, 1 = on, 2 = flash, 3 = fade, 4 = transition.I think idk 67420
 * @property {number} [eventLane] - What should the event type be? (What lane?)
 */

/**
 * 
 * @param {number} beat - What beat should the new light event be placed at?
 * @param {lightEventProperties} properties - properties n' stuff
 */
export function addLightEvent(beat, properties) {
    if (diffJSON && properties) {
        let newLightEvent = {
            b: beat,
            i: properties.type,
            et: properties.eventLane,
            f: properties.brightness,
            customData: {
                color: properties.color,
                easing: properties.easing,
                lightID: properties.lightID,
                lerpType: properties.lerpType
            }
        }
        diffJSON.basicBeatmapEvents.push(newLightEvent)
    }
}

/**
 * 
 * @param {number} beat - Where should the light event start?
 * @param {number} step How many beats are skipped before place the next one?
 * @param {number} amount How many light events should be place?
 * @param {lightEventProperties} properties - 6742069 brr brr patapiem
 */
export function addLightEventInBetween(beat, step, amount, properties) {
    if (beat || beat == 0) {
        if (diffJSON && step && amount && properties) {
            const end = (step * amount) + beat
            for (let start = beat; start <= end; start += step) {
                addLightEvent(start, {
                    brightness: properties.brightness,
                    color: properties.color,
                    easing: properties.easing,
                    eventLane: properties.eventLane,
                    lerpType: properties.lerpType,
                    type: properties.type,
                    lightID: properties.lightID
                })
            }
        }
    }
}

/**
 * Used to edit a light event at a certain beat, recommended to use with a for loop or with modmapper.getlightinbetween().foreach().
 * @param {number} beat - At what beat should the light even take place?
 * @param {lightEventProperties} properties - What properties should the light event have?
 * @param {number} [et] - What lane does the event have to be in?
 */
export function editLightEvent(beat, properties, et) {
    if (diffJSON && properties) {
        diffJSON.basicBeatmapEvents.forEach(event => {
            if (!et && et != 0) {
                if (event.b == beat) {
                    event.i = properties.type ?? event.i
                    event.f = properties.brightness ?? event.f
                    event.et = properties.eventLane ?? event.et
                    event.customData = {
                        color: properties.color,
                        lightID: properties.lightID,
                        easing: properties.easing,
                        lerpType: properties.lerpType
                    }
                }
            }
            else if (et || et == 0) {
                if (event.b == beat && event.et == et) {
                    event.i = properties.type ?? event.i
                    event.f = properties.brightness ?? event.f
                    event.et = properties.eventLane ?? event.et
                    event.customData = {
                        color: properties.color,
                        lightID: properties.lightID,
                        easing: properties.easing,
                        lerpType: properties.lerpType
                    }
                }
            }
        })
    }
}

/**
 * Allows you to edit light events in between 2 beats(INVLUSIVE)
 * @param {number} beat1 - INCLUSIVE start beat
 * @param {number} beat2 - INCLUSIVE end beat
 * @param {lightEventProperties} properties - Some properties stuff idk lolol 67
 */
export function editLightEventInBetween(beat1, beat2, properties) {
    if (diffJSON && properties && beat1 && beat2) {
        diffJSON.basicBeatmapEvents.forEach((event) => {
            if (event.b >= beat1 && event.b <= beat2) {
                event.i = properties.eventType
                event.f = properties.brightness
                event.et = properties.type
                let newProperties = {
                    color: properties.color,
                    lightID: properties.lightID,
                    easing: properties.easing,
                    lerpType: properties.lerpType
                }
                event.customData = newProperties
            }
        })
    }
}

/**
 * Returns all of the data of the light event on the given beat.
 * @param {number} beat - What beat is the light event located at?
 */
export function getLightEvent(beat) {
    if (diffJSON && beat || diffJSON && beat == 0) {
        const result = diffJSON.basicBeatmapEvents.find(event => event.b === beat)
        return diffJSON.basicBeatmapEvents.find(event => event.b === beat)
    }
}

/**
 * Returns all of the data of the light event on the given beat.
 * @param {number} beat - What beat is the light event located at?
 */
export function getLightEventInBetween(beat1, beat2) {
    const events = []
    if (diffJSON && beat1 && beat2 || diffJSON && beat1 == 0 && beat2) {
        diffJSON.basicBeatmapEvents.forEach((event) => {
            if (event.b >= beat1 && event.b <= beat2) {
                events.push(event)
            }
        })

        return events
    }
}

// --- GEOMETRY ---
/**
 * @typedef {Object} materialProperties
 * @property {String} name - What is the name of this material?
 * @property {Array<number>} color - What color should the material have? This color will be the color of your geometry object.
 * @property {string} track - What track should be assigned to the material? You can use the track to animate the color later on.
 * @property {"Standard"|"Glowing"|"OpaqueLight"|"TransparentLight"|"BaseWater"|"BTSPillar"|"BillieWater"|"WaterfallMirror"|"InterscopeConcrete"|"InterscopeCar"} shader - What shader should the material have?
 */

/**
 * Adds a material to the material that you can use on a geometry object. Geometry objects REQUIRE a material.
 * @param {materialProperties} properties - What properties should the material have?
 */
export function addMaterial(properties) {
    if (diffJSON && properties) {
        diffJSON.customData.materials[properties.name] = {
            color: properties.color,
            shader: properties.shader,
            track: properties.track
        }
    }
}


/**
 * @typedef {object} geometryProperties
 * @property {number} [id] - What ID should be assigned to the object?
 * @property {number} [duplicate] - How many duplicates should be made? Don't defind to modify the original.
 * @property {LookupMethod} [lookupMethod] - How should the game search for the object?
 * @property {track} [track] - What track should be assigned to the  object?
 * @property {Array<number>} [position] - Where should the object be positioned?
 * @property {Array<number>} [rotation] - How should the object be rotated?
 * @property {Array<number>} [localPosition] - How should the object be positioned relative to its set position?
 * @property {Array<number>} [localRotation] - How should the object be rotated relative to its set rotation?
 * @property {Array<number>} [scale] - How big should the material be?
 * @property {{
 *      type: string
 *      material: {
 *          color: Array<number>
 *          shader: string
 *      }
 * }} geometry - Defind the shape and set the material of the object. Shapes: Sphere, Capsule, Plane, Cylinder, Cube, Quad, Triangle.
 * @property {{
 *      ILightWithId: {
 *          lightID: number
 *          type: number
 *      }
 * }} components - Set the lighting stuff (WIP)
 */

/**
 * Make a new geometry object.
 * @param {geometryProperties} properties - What properties does the object have?
 */
export function addGeometry(properties) {
    if (diffJSON && properties) {
        let newProperties = {
            id: properties.id,
            lookupMethod: properties.lookupMethod,
            components: properties.components,
            duplicate: properties.duplicate,
            geometry: properties.geometry,
            position: properties.position,
            track: properties.track,
            rotation: properties.rotation,
            localPosition: properties.localPosition,
            localRotation: properties.localRotation,
            scale: properties.scale
        }


        diffJSON.customData.environment.push(newProperties)
    }
}

// --- BLENDER ---
/**
 * @typedef {Object} rmmodelProperties
 * @property {Array<number>} position
 * @property {Array<number>} rotation
 * @property {Array<number>} scale
 * @property {string} track
 */

/**
 * Used to import blender stuff in beat saber
 * @param {any} rmmodelName - Name of the file. <YOUR_FILE_NAME>.rmmodel
 * @param {rmmodelProperties} properties - Some properties you can set.
 */
let takenModelNumberTracks = []
export function blenderImport(beat, endBeat, rmmodelName, properties) {
    if (diffJSON && fileExists(rmmodelName)) {
        let t = 0
        while (takenModelNumberTracks.includes(t)) {
            t++;
        }
        const data = fs.readFileSync(rmmodelName, "utf-8")
        const rmmodelJSON = JSON.parse(data)
        if (rmmodelJSON.objects) {
            const underWorld = 999999999
            properties.position[0] = properties.position[0]
            properties.position[1] = properties.position[1] - underWorld
            properties.position[2] = properties.position[2]
            rmmodelJSON.objects.forEach((object) => {
                if (!properties.position) {
                    properties.position = [0, -underWorld, 0]
                }
                if (!properties.rotation) {
                    properties.rotation = [0, 0, 0]
                }
                if (!properties.scale) {
                    properties.scale = [1, 1, 1]
                }
                if (!properties.material) {
                    properties.material = {
                        material: {
                            color: [0, 1, 0, 0.5],
                            shader: "BaseWater" // TransparentLight, Standard??
                        }
                    }
                }

                const finalPos = object.position.map((v, i) => v + properties.position[i])

                addGeometry({
                    geometry: {
                        type: "Cube",
                        material: properties.material
                    },
                    position: object.position.map((v, i) => v + properties.position[i]),
                    rotation: object.rotation.map((v, i) => v + properties.rotation[i]),
                    scale: object.scale.map((v, i) => v + properties.scale[i]),
                    track: `[${t}]ModMapperObjectTrack`
                })
                animateTrack({
                    track: `[${t}]ModMapperObjectTrack`,
                    duration: 1,
                    beat: beat,
                    animation: {
                        position: [
                            [finalPos[0], finalPos[1] + underWorld, finalPos[2], 0]
                        ]
                    }
                })
                animateTrack({
                    track: `[${t}]ModMapperObjectTrack`,
                    duration: 1,
                    beat: endBeat,
                    animation: {
                        position: [
                            [finalPos[0], finalPos[1], finalPos[2], 0]
                        ]
                    }
                })
                takenModelNumberTracks.push(t)
                t++;
            })
        }
    }
}

// --- TOOLS ---
/**
 * Used to calculate the amount of events you need to stop at the end beat
 * @param {number} beat - Starting beat
 * @param {number} step Step between beats
 * @param {number} endBeat Ending beat
 * @returns The calculated amount of events you need to stop at the end beat
 */
export function calculateAmount(beat, step, endBeat) {
    if (beat || beat == 0) {
        if (step, endBeat) {
            return (endBeat - beat) / step
        }
    }

}

export function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min
}

// --- WRITING TO FILE ---

/**
 * Writes the custom data to the file you have set with modmapper.setDifficulty
 */
export function writeToFile() {
    if (diffJSON) {
        console.log(colors.yellow, `[WARNING] writing to ${difficulty}...`, colors.reset)
        fs.writeFileSync(
            difficulty,
            JSON.stringify(diffJSON, null, 4)
        );
        console.log(colors.green, "[OK] Succesfully written to " + difficulty, colors.reset)
    }
    else {
        console.log(colors.red, `[ERROR] Error writing to ${difficulty}, did you set the correct difficulty name?`, colors.reset)
        return
    }
}