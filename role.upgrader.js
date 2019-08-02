var roleHarvester = require('role.harvester');
//asddsakjhk
var roleUpgrader = {

    /** @param {Creep} creep **/
    run: function (creep) {
        if (creep.memory.previousPosition = undefined) {
            creep.memory.previousPosition = { x: creep.pos.x, y: creep.pos.y, i: 0 };
        } else {
            creep.memory.previousPosition.i++;
        }
        if (creep.memory.previousPosition.i > 10) {
            delete Memory.creeps[creep.name];
        }

        if (creep.carry.energy < creep.carryCapacity && creep.memory.transfering == false) {

            var targetContainer = undefined;
            if (creep.memory.targetContainerId == undefined) {

                var targetContainer = creep.pos.findClosestByPath(FIND_STRUCTURES, { ignoreCreeps: true, filter: (s) => s.structureType == STRUCTURE_CONTAINER && s.store[RESOURCE_ENERGY] > 500 })

                //var maxContainer = undefined;
                //var maxEnergy = 0;
                //for (let cont of containers) {
                //    if (maxEnergy < cont.store[RESOURCE_ENERGY]) {
                //        maxEnergy = cont.store[RESOURCE_ENERGY];
                //        maxContainer = cont;
                //    }
                //}

                if (targetContainer != undefined) {
                    creep.memory.targetContainerId = targetContainer.id;
                }
            }
            else {
                targetContainer = Game.getObjectById(creep.memory.targetContainerId);
            }

            if (targetContainer != undefined) {
                var result = creep.withdraw(targetContainer, RESOURCE_ENERGY);
                //console.log(result);
                if (result == ERR_NOT_IN_RANGE) {

                    if (creep.memory.pathToContainer == undefined) {
                        creep.memory.pathToContainer = creep.pos.findPathTo(targetContainer.pos, { ignoreCreeps: true })
                    }
                    creep.moveByPath(creep.memory.pathToContainer);
                }
                else {
                    creep.memory.targetContainerId = undefined;
                    creep.memory.pathToContainer = undefined;
                }
            } else {
                var source = creep.pos.findClosestByPath(FIND_SOURCES);
                if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(source);
                }
            }

            
        }
        else {
            if (creep.carry.energy == 0) {
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