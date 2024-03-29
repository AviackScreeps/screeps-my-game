const roleHarvester = require('role.harvester');
const roleUpgrader = require('role.upgrader');
const roleBuilder = require('role.builder');
const roleRanged = require('role.ranged');
const roleWaller = require('role.waller');
const roleBaseMeleeDefender = require('role.baseMeleeDefender');
const roleAttacker = require('role.attacker');
const roleLongDistanceMiner = require('role.longDistanceMiner');
const roleSupplyUpgrader = require('role.supplyUpgrader');


module.exports.loop = function () {

    let newName;
    let name;
    if(Game.time % 250 === 0 || Memory.cleanNotifies === true) {
        for(name in Game.creeps) {
            Game.creeps[name].notifyWhenAttacked(false);

        }
        for(name in Game.structures) {
            Game.structures[name].notifyWhenAttacked(false);
        }
        Memory.cleanNotifies = false
    }

    if (Game.time % 250) {
        for (name in Memory.creeps) {
            if (!Game.creeps[name]) {
                delete Memory.creeps[name];
                //console.log('Clearing non-existing creep memory:', name);
            }
        }
    }

    if (Game.time % 5) {
        Memory.bucket = Game.cpu.bucket;
    }

   

    room = Game.rooms['W12S3'];
    //console.log(room);

    
     hostileCreeps = room.find(FIND_HOSTILE_CREEPS);
    
    

    var underAttack = (hostileCreeps.length > 0);
    //console.log("" + hostileCreeps + " " + underAttack);
    underAttack = false;

    if (underAttack) {
        console.log("attacked");

        if (Memory.defenceParameters === undefined) {
            initializeDefence(room);
        }

        var numOfDefenders = 0;
        if (Memory.defenceParameters.LeftSectorEnemies > 0) {
            numOfDefenders += 2;
        }
        if (Memory.defenceParameters.RightSectorEnemies > 0) {
            numOfDefenders += 2;
        }
        if (Memory.defenceParameters.UpperSectorEnemies > 0) {
            numOfDefenders += 1;
        }
        if (Memory.defenceParameters.BaseEnemies > 0) {
            console.log("they are trying to break through!");
            numOfDefenders = 99;
        }

        console.log('need ' + numOfDefenders + ' defenders');

        var defenders = _.filter(Game.creeps, (creep) => creep.memory.role === 'baseMeleeDefender' && creep.spawning === false);

        if (defenders.length < numOfDefenders) {
            newName = 'TikajZGorodu' + Game.time;
            Game.spawns['Spawn1'].spawnCreep([TOUGH, ATTACK, ATTACK, ATTACK, MOVE], newName,
                { memory: { role: 'baseMeleeDefender' } });
        }

        if (Memory.defenceParameters.BaseEnemies > 0) {
            for (let creep of defenders) {
                creep.memory.fightForYourLife = true;
            }
        } else {
            let freeRamparts = [];
            var buildings = undefined;
            if (Memory.defenceParameters.LeftSectorEnemies > 0) {
                buildings = room.lookForAtArea(LOOK_STRUCTURES, 31, 7, 37, 9, true);
                for (let s of buildings) {
                    if (s.structureType == STRUCTURE_RAMPART) {
                        freeRamparts[freeRamparts.length - 1] = s;
                    }
                }
                //freeRamparts = _.concat(freeRamparts, _.filter(buildings, (s) => s.structureType == STRUCTURE_RAMPART));
            }
            if (Memory.defenceParameters.RightSectorEnemies > 0) {
                buildings = room.lookForAtArea(LOOK_STRUCTURES, 30, 44, 46, 41, true);
                for (let s of buildings) {
                    if (s.structureType == STRUCTURE_RAMPART) {
                        freeRamparts[freeRamparts.length - 1] = s;
                    }
                }
                //freeRamparts = _.concat(freeRamparts, _.filter(buildings, (s) => s.structureType == STRUCTURE_RAMPART));
            }
            if (Memory.defenceParameters.UpperSectorEnemies > 0) {
                buildings = room.lookForAtArea(LOOK_STRUCTURES, 15, 23, 17, 27, true);
                for (let s of buildings) {
                    if (s.structureType == STRUCTURE_RAMPART) {
                        freeRamparts[freeRamparts.length - 1] = s;
                    }
                }
                //freeRamparts = _.concat(freeRamparts, _.filter(buildings, (s) => s.structureType == STRUCTURE_RAMPART));
            }
            for (let creep of defenders) {
                if (creep.memory.rampart == undefined) {
                    creep.memory.rampart = _.first(freeRamparts).id;
                    _.pullAt(freeRamparts, [0]);
                }

                let rampart = Game.getObjectById(creep.memory.rampart);
                if (rampart.pos.isEqualTo(creep.pos)) {
                    var hostilesInrange = creep.pos.findInRange(FIND_HOSTILE_CREEPS, 1);
                    if (hostilesInrange.length > 0) {
                        creep.attack(_.first(hostilesInrange));
                    } else {
                        if (creep.memory.waitForIt == undefined) {
                            creep.memory.waitForIt = 0;
                        }
                        creep.memory.waitForIt++;

                        if (creep.memory.waitForIt > 5) {
                            creep.moveTo(creep.pos.findClosestByPath(FIND_HOSTILE_CREEPS));
                        }
                    }
                } else {
                    creep.moveTo(rampart);
                }

            }
        }

        //console.log('towers');
        towers = _.filter(Game.structures, (s) => s.structureType === STRUCTURE_TOWER);

        for (let tower of towers) {
            target = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
            tower.attack(target);
        }

    }
    else {

        if (Memory.defenceParameters != undefined) {
            delete Memory.defenceParameters;
        }

        let harvesters = _.filter(Game.creeps, (creep) => creep.memory.role === 'harvester');
        let upgraders = _.filter(Game.creeps, (creep) => creep.memory.role === 'upgrader');
        let builders = _.filter(Game.creeps, (creep) => creep.memory.role === 'builder');
        let wallers = _.filter(Game.creeps, (creep) => creep.memory.role === 'waller');
        let attackers = _.filter(Game.creeps, (creep) => creep.memory.role === 'attacker');
        let SupplyUpgraders = _.filter(Game.creeps, (creep) => creep.memory.role === 'supplyupgrader');
        //console.log('Harvesters: ' + harvesters.length);
        let amountOfHarvesters = 3;
        let minimumAmountOfUpgraders = 1;
        let amountOfUpgraders = 6;
        let amountOfBuilders = 4;
        let amountOfWallers = 2;
        let amountOfAttackers = 0;
        //var amountOfLongDistanceMiners = 0;
        let amountOfSupplyUpgraders = 2;

        let longDistanceMiningLocations = roleLongDistanceMiner.getMiningLocations();
        let longDistanceMinersRequired = 0;
        for (let i of longDistanceMiningLocations) {
            longDistanceMinersRequired += i.maxMiners;
        }

        if (harvesters.length < amountOfHarvesters) {
            newName = 'Harvester' + Game.time;
            //console.log('Spawning new harvester: ' + newName);
            Game.spawns['Spawn1'].spawnCreep([WORK, WORK, WORK, CARRY, MOVE], newName,
                { memory: { role: 'harvester' } });
        }
        else if (upgraders.length < minimumAmountOfUpgraders) {
            newName = 'Upgrader' + Game.time;
            //console.log('Spawning new harvester: ' + newName);
            Game.spawns['Spawn1'].spawnCreep([WORK, CARRY, MOVE, MOVE], newName,
                { memory: { role: 'upgrader' } });
        }

        else if (builders.length < amountOfBuilders) {
            newName = 'Builder' + Game.time;
            Game.spawns['Spawn1'].spawnCreep([WORK, WORK, WORK, CARRY, MOVE, MOVE, MOVE], newName,
                    { memory: { role: 'builder' } });


        }
        else if (upgraders.length < amountOfUpgraders) {
            newName = 'Upgrader' + Game.time;
            //console.log('Spawning new harvester: ' + newName);
            Game.spawns['Spawn1'].spawnCreep([WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE], newName,
                { memory: { role: 'upgrader' } });
        }
        else if (longDistanceMinersRequired > 0) {
            console.log('required ' + longDistanceMinersRequired + 'long distance miners');
            newName = 'LongDistanceMiner' + Game.time;

            Game.spawns['Spawn1'].spawnCreep([WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE], newName,
                { memory: { role: 'longdistanceminer' } });
        }
        else if (SupplyUpgraders.length < amountOfSupplyUpgraders) {
            newName = 'SupplyUpgrader' + Game.time;

            Game.spawns['Spawn1'].spawnCreep([WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE], newName,
                { memory: { role: 'supplyupgrader' } });
        }
        else if (attackers.length < amountOfAttackers) {
            newName = 'NeOleg' + Game.time;
            //console.log('Spawning new harvester: ' + newName);
            Game.spawns['Spawn1'].spawnCreep([ATTACK, ATTACK, MOVE, MOVE], newName,
                { memory: { role: 'attacker' } });
        }
        else if (wallers.length < amountOfWallers) {
            newName = 'Waller' + Game.time;
            //console.log('Spawning new harvester: ' + newName);
            Game.spawns['Spawn1'].spawnCreep([WORK, WORK, CARRY, MOVE, MOVE, MOVE], newName,
                { memory: { role: 'waller' } });
        }


        if (Game.spawns['Spawn1'].spawning) {
            var spawningCreep = Game.creeps[Game.spawns['Spawn1'].spawning.name];
            Game.spawns['Spawn1'].room.visual.text(
                'oh no ' + spawningCreep.memory.role,
                Game.spawns['Spawn1'].pos.x + 1,
                Game.spawns['Spawn1'].pos.y,
                { align: 'left', opacity: 0.8 });
        }
    }
    for(name in Game.creeps) {
        let creep = Game.creeps[name];

        if (underAttack === false && creep.memory.rampart !== undefined) {
            delete creep.memory.rampart;    
        }

        if (creep.memory.role === undefined) {
            console.log('undefined role');
            let role = '';
            let numbers = '1234567890';
            for (c of creep.name) {
                if (numbers.search(c) === -1) {
                    role += c;
                }
                
            }
            role = role.toLowerCase();

            creep.memory.role = role;
        }

        creep.memory.role = creep.memory.role.toLowerCase();

        if(creep.memory.role === 'harvester') {
            roleHarvester.run(creep);
        }
        if(creep.memory.role === 'upgrader') {
            roleUpgrader.run(creep);
        }
        if(creep.memory.role === 'builder') {
            roleBuilder.run(creep);
        }
        if (creep.memory.role === 'ranged') {
            roleRanged.run(creep, hostileCreeps);
        }
        if (creep.memory.role === 'waller') {
            roleWaller.run(creep);
        }
        if (creep.memory.role === 'attacker') {
            roleAttacker.run(creep);
        }
        if (creep.memory.role === 'supplyupgrader') {
            roleSupplyUpgrader.run(creep);
        }
        if (creep.memory.role === 'longdistanceminer') {
            roleLongDistanceMiner.run(creep);
        }
    }

    if (Memory.attackByTower === true) {
        //console.log('towers attacking anyway');
        var towers = _.filter(Game.structures, (s) => s.structureType === STRUCTURE_TOWER);

        for (let tower of towers) {
            var target = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
            tower.attack(target);
        }
    }
 

}

function initializeDefence(room) {
    //console.log(' ====-1');
    Memory.defenceParameters = {};
    //console.log(' ====0');
    Memory.defenceParameters.UpperSectorEnemies = countHostilesInSector(room, 40, 0, Create2DArray(50));
    //console.log('====1');
    Memory.defenceParameters.LeftSectorEnemies = countHostilesInSector(room, 0, 30, Create2DArray(50));
    //console.log('====2');
    Memory.defenceParameters.RightSectorEnemies = countHostilesInSector(room, 50, 40, Create2DArray(50));
    //console.log('====3');
    Memory.defenceParameters.BaseEnemies = countHostilesInSector(room, 25, 25, Create2DArray(50));
    //console.log('====4');
}

function countHostilesInSector(room, x, y, visitedArray) {

    var result = 0;

    if (x < 0 || x >= 50 || y < 0 || y >= 50) {
        //console.log(' out of bounds ' + x + ' ' + y);
        return result;
    }

    if (visitedArray[x][y] == true) {
        //console.log('visited' + x + ' ' + y);
        return result;
    }

    if (room.getTerrain().get(x, y) == TERRAIN_MASK_WALL) {
        //console.log(' terrain ' + x + ' ' + y);
        return result;
    }

    visitedArray[x][y] = true;

    var objectsInTile = room.lookAt(x, y);
    var walls = _.filter(objectsInTile, (s) => s.type == 'structure');
    if (walls.length > 0) {
        //console.log(' wall ' + x + ' ' + y);
        return result;
    }

    var HostileCreeps = _.filter(objectsInTile, (s) => s.type == 'creep' && s.creep.my == false);
    if (HostileCreeps.length > 0) {
        result++;
    }

    result += countHostilesInSector(room, x - 1, y, visitedArray);
    result += countHostilesInSector(room, x + 1, y, visitedArray);
    result += countHostilesInSector(room, x, y - 1, visitedArray);
    result += countHostilesInSector(room, x, y + 1, visitedArray);

    //console.log('res = ' + result);

    return result;
}

function Create2DArray(rows) {
    var arr = [];

    for (var i = 0; i < rows; i++) {
        arr[i] = [];
    }

    return arr;
}