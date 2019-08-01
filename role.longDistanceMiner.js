

var roleLongDistanceMiner = {

    /** @param {Creep} creep **/
    run: function (creep) {
        //creep.moveTo(Game.flags.IdleFlag);
        //return;
        //initialize memory
        creep.memory.longDistanceMining = undefined;
        console.log('' + creep + ' ' + creep.memory.longDistanceMining);

        if (creep.memory.longDistanceMining == undefined) {
            //console.log('INIT MINER');
            creep.memory.longDistanceMining = {};
            var miningLocations = _.filter(this.getMiningLocations(), (elem) => elem.maxMiners > 0);
            //console.log('miningLocations=' + miningLocations);

            if (miningLocations.length > 0) {
                var location = _.first(miningLocations);
                creep.memory.longDistanceMining.room = location.room;
                creep.memory.longDistanceMining.x = location.x;
                creep.memory.longDistanceMining.y = location.y;

                if (creep.room.name != location.room) {
                    var exitCode = creep.room.findExitTo(location.room);
                    var exitPos = creep.pos.findClosestByPath(exitCode);
                    creep.memory.longDistanceMining.exitToMining = { x: exitPos.x, y: exitPos.y};
                }
            } else {
                creep.moveTo(Game.flags.idleFlag)
            }            
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
            if (creep.room.name == creep.memory.longDistanceMining.room && creep.room.pos.getRangeTo(creep.memory.longDistanceMining.x, creep.memory.longDistanceMining.y) <= 1) {
                if (creep.memory.longDistanceMining.sourceId == undefined) {
                    creep.memory.longDistanceMining.sourceId = creep.pos.findClosestByRange(FIND_SOURCES).id;
                }
                var source = Game.getObjectById(creep.memory.longDistanceMining.sourceId);
                creep.harvest(source);
            } else if (creep.room.name != creep.memory.longDistanceMining.room) {
                creep.moveTo(new RoomPosition(creep.memory.longDistanceMining.exitToMining.x, creep.memory.longDistanceMining.exitToMining.y, creep.room.name));
            } else {
                creep.moveTo(new RoomPosition(creep.memory.longDistanceMining.x, creep.memory.longDistanceMining.y, creep.memory.longDistanceMining.room));
            }
        } else {
            if (creep.memory.longDistanceMining.containerLocation == undefined) {
                if (creep.room.name == creep.memory.longDistanceMining.room) {
                    var container = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                        filter: (s) => s.structureType == STRUCTURE_CONTAINER && (s.memory.owner == undefined || !Game.getObjectById(s.memory.owner))
                    });

                    creep.memory.longDistanceMining.containerLocation = { x: container.pos.x, y: container.pos.y, room: container.room.name };
                    creep.memory.longDistanceMining.containerId = container.id;

                    var containerPostion = new RoomPosition(creep.memory.longDistanceMining.containerLocation.x, creep.memory.longDistanceMining.containerLocation.y, creep.memory.longDistanceMining.containerLocation.roomName);
                    if (creep.pos.isEqualTo(containerPostion)) {
                        creep.drop(RESOURCE_ENERGY);
                    } else {
                        creep.moveTo(containerPostion);
                    }

                } else {
                    if (creep.memory.longDistanceMining.exitHome == undefined) {
                        var exitCode = creep.room.findExitTo('W12S3');
                        var exitPos = creep.pos.findClosestByPath(exitCode);
                        creep.memory.longDistanceMining.exitHome = { x: exitPos.x, y: exitPos.y };
                    }
                    creep.moveTo(new RoomPosition(creep.memory.exitHome.x, creep.memory.exitHome.y, creep.room.name));
                    
                }
                
            }
        }

    }
    ,
    getMiningLocations: function () {
        var locations = [{ room: 'W13S3', x: 19, y: 3, maxMiners: 3 }, { room: 'W13S3', x: 6, y: 45, maxMiners: 2 }];;

        var assignedMiners = _.filter(Memory.creeps, (elem) => elem.longDistanceMining != undefined);

        for (let l of locations) {
            
            minersInLocation = _.filter(assignedMiners, (elem) => elem.longDistanceMining.x == l.x && elem.longDistanceMining.y == l.y && elem.longDistanceMining.room == l.room);
            l.maxMiners -= minersInLocation.length;

        }

        return locations;
    }
};


module.exports = roleLongDistanceMiner;