var Player = function (id, n, h, x, y, r) {
    this.shot = false;
    this.lastShot = 0;
    this.lastHit = null;
    this.n = n;
    this.id = id;
    this.x = x;
    this.y = y;
    this.r = r;
    this.h = 0;
    this.speed = 0;
    this.setHealth(h);
};

Player.prototype.setHealth = function (delta) {
    this.h += delta;
    if (this.h > 1000) {
        this.h = 1000;
    } else if (this.h < 0) {
        this.h = 0;
    }
    $('.my-health-value').css('width', (100 * (this.h / 1000)) + '%');
    this.speed = 2 + 1000 / Math.max(this.h, 200);
};

Player.prototype.shoot = function (keys) {
    this.shot = false;
    var now = new Date().getTime();
    if (keys.sp) {
        if (now - this.lastShot > 1000) {
            this.shot = true;
            this.lastShot = now;
            // this.setHealth(-25);
        }
    }
};

Player.prototype.update = function(keys) {
    var prevX = this.x;
    var prevY = this.y;
    var prevR = this.r;

    // Up key takes priority over down
    if (keys.up) {
        this.x += Math.cos((this.r - 90) * Math.PI / 180) * this.speed;
        this.y += Math.sin((this.r - 90) * Math.PI / 180) * this.speed;
    } else if (keys.down) {
        this.x -= Math.cos((this.r - 90) * Math.PI / 180) * this.speed;
        this.y -= Math.sin((this.r - 90) * Math.PI / 180) * this.speed;
    };

    // Left key takes priority over right
    if (keys.left) {
        this.r -= this.speed;
    } else if (keys.right) {
        this.r += this.speed;
    };

    return prevX !== this.x || prevY !== this.y || prevR !== this.r;
};

Player.prototype.collides = function(shot) {
    if (shot.p !== this.id) {
        if (Math.abs(this.x - shot.x) < 50 && Math.abs(this.y - shot.y) < 50) {
            return true;
        } else {
            return false;
        }
    }
};

Player.prototype.draw = function(ctx) {
    var img = ship;
    if (this.lastHit != null) {
        if (new Date().getTime() - this.lastHit < 1000) {
            img = ship_hit;
        } else {
            this.lastHit = null;
        }
    }

    ctx.fillStyle = 'Red';
    ctx.font = "bold 11px Verdana";
    ctx.translate(this.x, this.y);
    ctx.rotate(this.r * Math.PI / 180);
    ctx.drawImage(img, -25, -20);
    ctx.fillText(this.n, 0, 33);
    ctx.rotate(-this.r * Math.PI / 180);
    ctx.translate(-this.x, -this.y);
};