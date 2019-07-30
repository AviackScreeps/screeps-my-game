var roleHarvester = require('role.harvester');

var roleUpgrader = {

    /** @param {Creep} creep **/
    run: function (creep) {
        if (creep.carry.energy < creep.carryCapacity && creep.memory.transfering == false) {
            var source = creep.pos.findClosestByPath(FIND_SOURCES);
            if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
                creep.moveTo(source, { visualizePathStyle: { stroke: '#bdbdbd' } });
            }
        }
        else {
            if (creep.carry.energy == 0) {}
                creep.memory.transfering = false;
            } else {
                creep.memory.transfering = true;
                if (creep.transfer(creep.room.controller, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(creep.room.controller, { visualizePathStyle: { stroke: '#bdbdbd' } });
                }
            }
        }
    }
};

module.exports = roleUpgrader;