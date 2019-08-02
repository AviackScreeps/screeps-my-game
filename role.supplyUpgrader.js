

var roleSupplyUpgrader = {

    /** @param {Creep} creep **/
    run: function (creep) {
        if (creep.carry.energy < creep.carryCapacity && creep.memory.transfering == false) {

            var targetContainer = undefined;
            if (creep.memory.targetContainerId == undefined) {

                var containers = creep.room.find(FIND_STRUCTURES, { filter: (s) => s.structureType == STRUCTURE_CONTAINER && s.store[RESOURCE_ENERGY] > 0 })

                var maxContainer = undefined;
                var maxEnergy = 0;
                for (let cont of containers) {
                    if (maxEnergy < cont.store[RESOURCE_ENERGY]) {
                        maxEnergy = cont.store[RESOURCE_ENERGY];
                        maxContainer = cont;
                    }
                }

                if (maxContainer != undefined) {
                    creep.memory.targetContainerId = maxContainer.id;
                }
                targetContainer = maxContainer;
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
                var tomb = creep.pos.findClosestByPath(FIND_TOMBSTONES, { filter: (s) => s.store[RESOURCE_ENERGY]  > 0 });
                if (tomb != undefined) {
                    if (creep.withdraw(tomb, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(tomb);
                    }
                } else {
                    var res = creep.pos.findClosestByPath(FIND_DROPPED_ENERGY);
                    if (res != undefined) {
                        if (creep.pickup(res) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(res);
                        }
                    } else {
                        creep.moveTo(Game.flags.idleFlag);
                    }
                }
            }
        }
        else {
            if (creep.carry.energy == 0) {
                creep.memory.transfering = false;
            } else {
                creep.memory.transfering = true;
                if (Game.spawns['Spawn1'].energy < Game.spawns['Spawn1'].energyCapacity) {
                    if (creep.transfer(Game.spawns['Spawn1'], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(Game.spawns['Spawn1']);
                    }
                } else {
                    if (creep.transfer(creep.room.controller, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(creep.room.controller);
                    }
                }              
                
            }
        }
    }
};

module.exports = roleSupplyUpgrader;