var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleRanged = require('role.ranged');

module.exports.loop = function () {
   
    if(Game.time % 250 == 0 || Memory.cleanNotifies == true) {
        for(var name in Game.creeps) {
            Game.creeps[name].notifyWhenAttacked(false);

        }
        for(var name in Game.structures) {
            Game.structures[name].notifyWhenAttacked(false);
        }
        Memory.cleanNotifies = false
    }

    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }

    var hostileCreeps = [];
    if (Game.creeps.length > 0) {
        hostileCreeps = Game.creeps[Object.keys(Memory.creeps)[0]].room.find(FIND_HOSTILE_CREEPS);
    }
    

    var underAttack = (hostileCreeps.length > 0);

    if (underAttack) {
        console.log("attacked");
        var newName = 'TikajZGorodu' + Game.time;
        Game.spawns['Spawn1'].spawnCreep([TOUGH, TOUGH, TOUGH, RANGED_ATTACK, MOVE, MOVE], newName,
            { memory: { role: 'ranged' } });
    }
    else {

        var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
        var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
        var builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');
        //console.log('Harvesters: ' + harvesters.length);
        var amountOfHarvesters = 3;
        var minimumAmountOfUpgraders = 1;
        var amountOfUpgraders = 6;
        var amountOfBuilders = 3;

        if (harvesters.length < amountOfHarvesters) {
            var newName = 'Harvester' + Game.time;
            //console.log('Spawning new harvester: ' + newName);
            Game.spawns['Spawn1'].spawnCreep([WORK, CARRY, MOVE], newName,
                { memory: { role: 'harvester' } });
        }
        else if (upgraders.length < minimumAmountOfUpgraders) {
            var newName = 'Upgrader' + Game.time;
            //console.log('Spawning new harvester: ' + newName);
            Game.spawns['Spawn1'].spawnCreep([WORK, CARRY, MOVE], newName,
                { memory: { role: 'upgrader' } });
        }
        else if (builders.length < amountOfBuilders) {
            var newName = 'Builder' + Game.time;
            Game.spawns['Spawn1'].spawnCreep([WORK, CARRY, MOVE], newName,
                { memory: { role: 'builder' } });
        }
        else if (upgraders.length < amountOfUpgraders) {
            var newName = 'Upgrader' + Game.time;
            //console.log('Spawning new harvester: ' + newName);
            Game.spawns['Spawn1'].spawnCreep([WORK, CARRY, MOVE], newName,
                { memory: { role: 'upgrader' } });
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
    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        if(creep.memory.role == 'harvester') {
            roleHarvester.run(creep);
        }
        if(creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep);
        }
        if(creep.memory.role == 'builder') {
            roleBuilder.run(creep);
        }
        if (creep.memory.role == 'ranged') {
            roleRanged.run(creep, hostileCreeps);
        }
    }
}
