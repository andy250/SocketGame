var Shot = function (id, x, y, r, t, p) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.r = r;
    this.t = t;
    this.p = p;
};

Shot.prototype.update = function () {
    this.x += Math.cos((this.r - 90) * Math.PI/ 180) * 10;
    this.y += Math.sin((this.r - 90) * Math.PI/ 180) * 10;
    return true;
};

Shot.prototype.draw = function (ctx) {
    ctx.fillStyle = 'Blue';
    ctx.translate(this.x, this.y);
    ctx.beginPath();
    ctx.arc(0 , 0, 5, 0, 2 * Math.PI, false);
    ctx.fill();
    ctx.lineWidth = 5;
    ctx.translate(-this.x, -this.y);
};