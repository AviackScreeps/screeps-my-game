

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
            var target = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);

            if (target != undefined && target != null) {
                if (creep.build(target[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target[0], { visualizePathStyle: { stroke: '#ffffff' } });
                }
            } else {
                creep.moveTo(Game.flags.IdleFlag);
            }
        }
    }
};


module.exports = roleBuilder;