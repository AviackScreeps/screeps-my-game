var roleWaller = {

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
                delete creep.memory.target;
                return;

            }
            creep.memory.working = true;

            var targetStructure = undefined;
            if (creep.memory.target != undefined) {
                targetStructure = Game.getObjectById(creep.memory.target);
            } else {
                var targets = creep.room.find(FIND_STRUCTURES, {
                    filter: function (object) {
                        return ((object.hits < object.hitsMax) && (object.structureType == STRUCTURE_WALL || object.structureType == STRUCTURE_RAMPART));
                    }
                });
                var minHits = 2;
                for (var s in targets) {
                    if (s.hits / s.hitsMax > minHits) {
                        minHits = s.hits / s.hitsMax;
                        targetStructure = s;
                    }
                }
                //targetStructure = _.minBy(targets, (s) => (s.hits / s.hitsMax));
            }

            
            if (targetStructure != undefined) {
                console.log(creep + " is repairing");
                if (creep.repair(targetStructure) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targetStructure, { visualizePathStyle: { stroke: '#ffffff' } });
                }
                creep.memory.target = targetStructure.id;

            }

        }
    }
};


module.exports = roleWaller;