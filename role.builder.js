var roleUpgrader = require('role.upgrader');

var roleBuilder = {

    /** @param {Creep} creep **/
    run: function (creep) {
        if (creep.carry.energy < creep.carryCapacity) {
            var source = creep.pos.findClosestByPath(FIND_SOURCES);
            if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
                creep.moveTo(source, { visualizePathStyle: { stroke: '#ffaa00' } });
            }
        }
        else {
            var target = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
                filter: (s) => (s.hits / s.hitsMax) < 0.95 && s.structureType != STRUCTURE_WALL
            });

            if (target != undefined) {
                if (creep.repair(target) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, { visualizePathStyle: { stroke: '#ffffff' } });
                }

            } else { 

                var target = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
                if (target != undefined) {

                    if (creep.build(target) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(target, { visualizePathStyle: { stroke: '#ffffff' } });
                    }
                } else {
                    roleUpgrader.run(creep);

                }

            }
            
        }
    }
};


module.exports = roleBuilder;