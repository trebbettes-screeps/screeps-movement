Creep.prototype.setStatic = function(value: boolean = true): void {
    this.memory._moveStatic = value ? true : undefined;
};
