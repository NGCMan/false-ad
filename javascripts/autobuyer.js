var Autobuyer = function (target) {
    this.target = target;
    this.cost = 1;
    this.interval = 5000;
    this.priority = 1;
    this.ticks = 0;
    this.isOn = false;
    this.tier = 1;
    this.bulk = 1;
    this.mode = 'single';
}
