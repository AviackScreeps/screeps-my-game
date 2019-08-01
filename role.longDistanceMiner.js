

var roleLongDistanceMiner = {

    /** @param {Creep} creep **/
    run: function (creep) {

        //initialize memory
        if (creep.memory.miningLocation == undefined) {
            var yellowFlags = _.filter(Game.flags, (f) => f.color == COLOR_YELLOW && f.name == 'a3');
            var f = _.first(yellowFlags);

            //creep.memory.miningLocation = { x: f.pos.x, y: f.pos.y, room: f.room.name };
            creep.memory.miningLocation = { x: 19, y: 13, room: 'W13S3' };
        }
        if (creep.memory.mining == undefined) {
            creep.memory.mining = true;
        }

        if (creep.memory.mining == true && creep.carry == creep.carryCapacity) {
            creep.memory.mining == false;
        }
        if (creep.memory.mining == false && creep.carry == 0) {
            creep.memory.mining == false;
        }

        if (creep.memory.mining == true) {
            if (creep.room.name == creep.memory.miningLocation.room && creep.room.pos.getRangeTo(creep.memory.miningLocation.x, creep.memory.miningLocation.y) <= 1) {
                if (creep.memory.sourceId == undefined) {
                    creep.memory.sourceId = creep.pos.findClosestByRange(FIND_SOURCES).id;
                }
                var source = Game.getObjectById(creep.memory.sourceId);
                creep.harvest(source);
            } else {
                creep.moveTo(new RoomPosition(creep.memory.miningLocation.x, creep.memory.miningLocation.y, creep.memory.miningLocation.roomName));
            }
        } else {
            if (creep.memory.containerLocation == undefined) {
                if (creep.room.name == 'W12S3') {
                    var container = creep.pos.findClosestByPath(FIND_STRUCTURES,  {
                        filter: (s) => s.structureType == STRUCTURE_CONTAINER && (s.memory.owner == undefined || !Game.getObjectById(s.memory.owner))
                    }); 

                    creep.memory.containerLocation = { x: container.pos.x, y: container.pos.y, room: container.room.name };
                    creep.memory.containerId = container.id;
                    
                }
                var containerPostion = new RoomPosition(creep.memory.containerLocation.x, creep.memory.containerLocation.y, creep.memory.containerLocation.roomName);
                if (creep.pos.isEqualTo(containerPostion)) {
                    creep.drop(RESOURCE_ENERGY);
                } else {
                    creep.moveTo(containerPostion);
                }
            }
        }

    }
};


module.exports = roleLongDistanceMiner;