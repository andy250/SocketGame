/**************************************************
** GAME KEYBOARD CLASS
**************************************************/
var Keys = function (up, left, right, down, r, l, sp) {
    var up = up || false,
		left = left || false,
		right = right || false,
		down = down || false,
		    r = r || false,
            l = l || false,
		    sp = sp || false;

    var onKeyDown = function (e) {
        var that = this,
			c = e.keyCode;
        switch (c) {
            // Controls
            case 37: // Left
                that.left = true;
                break;
            case 38: // Up
                that.up = true;
                break;
            case 39: // Right
                that.right = true; // Will take priority over the left key
                break;
            case 40: // Down
                that.down = true;
                break;
            case 81: // left rot
                that.l = true;
                break;
            case 87: // right rot
                that.r = true;
                break;
            case 32: // space
                that.sp = true;
                break;
        };
    };

    var onKeyUp = function (e) {
        var that = this,
			c = e.keyCode;
        switch (c) {
            case 37: // Left
                that.left = false;
                break;
            case 38: // Up
                that.up = false;
                break;
            case 39: // Right
                that.right = false;
                break;
            case 40: // Down
                that.down = false;
                break;
            case 81: // left rot
                that.l = false;
                break;
            case 87: // right rot
                that.r = false;
                break;
            case 32: // space
                that.sp = false;
                break;
        };
    };

    return {
        up: up,
        left: left,
        right: right,
        down: down,
        l: l,
        r: r,
        sp: sp,
        onKeyDown: onKeyDown,
        onKeyUp: onKeyUp
    };
};