var roleUpgrader = require('role.upgrader');

var roleBuilder = {

    /** @param {Creep} creep **/
    run: function (creep) {
        if (creep.carry.energy < creep.carryCapacity && !creep.memory.working) {
            var source = creep.pos.findClosestByPath(FIND_SOURCES);
            if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
                creep.moveTo(source, { visualizePathStyle: { stroke: '#ffaa00' } });
            }
        }
        else {
            if (creep.carry.energy == 0) {
                creep.memory.working = false;
                return;

            }
            creep.memory.working = true;
            var target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: function (object) {
                    return ((object.hits / object.hitsMax) < 0.95 && object.structureType != STRUCTURE_WALL && object.structureType != STRUCTURE_RAMPART);
                }
            });
            if (target != undefined) {
                console.log(creep + " is repairing");
                if (creep.repair(target) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, { visualizePathStyle: { stroke: '#ffffff' } });
                }

            } else {

                var target = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
                if (target != undefined) {
                    console.log(creep + " is building");
                    if (creep.build(target) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(target, { visualizePathStyle: { stroke: '#ffffff' } });
                    }
                } else {
                    console.log(creep + " is walling");
                    var target = creep.room.find(FIND_STRUCTURES, {
                        filter: (s) => { s.structureType == STRUCTURE_RAMPART }
                    });
                    target = Game.getObjectByID(target.id);
                    repairResult = creep.repair(target);
                    console.log("repairing " + target.structureType + " " + target + " " + repairResult);
                    if (repairResult == ERR_NOT_IN_RANGE) {
                        creep.moveTo(target, { visualizePathStyle: { stroke: '#ffffff' } });
                    }

                }

            }

        }
    }
};


module.exports = roleBuilder;