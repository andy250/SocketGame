var canvas,			// Canvas DOM element
	ctx,			// Canvas rendering context
	keys,			// Keyboard input
	localPlayer;	// Local player

var players = {};
var shots = {};
var game = null;
var ship = null;
var ship_hit = null;

function animate() {
    update();
    draw();

    // Request a new animation frame using Paul Irish's shim
    window.requestAnimFrame(animate);
};

function update() {
    if (localPlayer) {
        if (localPlayer.update(keys)) {
            console.log('moving');
            var mvi = { x: localPlayer.x, y: localPlayer.y, r: localPlayer.r };
            game.emit("move", mvi);
        }

        localPlayer.shoot(keys);
        if (localPlayer.shot) {
            var s = new Shot(localPlayer.id + '_' + localPlayer.lastShot.toString(), localPlayer.x, localPlayer.y, localPlayer.r, localPlayer.lastShot, localPlayer.id);
            shots[s.id] = s;
            game.emit("shoot", s);
        }

        for (var k in shots) {
            if (shots.hasOwnProperty(k)) {
                if (localPlayer.collides(shots[k])) {
                    game.emit('hit');
                    game.emit('shotend', shots[k].id);
                    localPlayer.setHealth(-30);
                    if (localPlayer.h < 100) {
                        localPlayer = null;
                        game.emit('death');
                        break;
                    }
                }
            }
        }
    }
};

function draw() {
    // Wipe the canvas clean
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw the local player
    for (var key1 in players) {
        if (players.hasOwnProperty(key1)) {
            players[key1].draw(ctx);
        }
    }

    var now = new Date().getTime();
    for (var key2 in shots) {
        if (shots.hasOwnProperty(key2)) {
            if (now - shots[key2].t > 2500) {
                delete shots[key2];
            } else {
                shots[key2].update();
                shots[key2].draw(ctx);
            }
        }
    }
};


/**************************************************
** GAME INITIALISATION
**************************************************/
function init() {
    // Declare the canvas and rendering context
    canvas = document.getElementById("gameCanvas");
    ctx = canvas.getContext("2d");

    // Maximise the canvas
    onResize();

    // Initialise keyboard controls
    keys = new Keys();

    // Calculate a random start position for the local player
    // The minus 5 (half a player size) stops the player being
    // placed right on the egde of the screen
    var startX = Math.round(Math.random() * (canvas.width - 5)),
		startY = Math.round(Math.random() * (canvas.height - 5));

    // Start listening for events
    setEventHandlers();

    game = io('http://plakowal:8666');
    game.on('connect', function () {
        // Initialise the local player
        localPlayer = new Player(game.id, $('.game').data('player'), 600, startX, startY, 0);
        players[game.id] = localPlayer;

        game.on('newplayer', function (msg) {
            var player = new Player(msg.id, msg.n, msg.h, msg.x, msg.y, msg.r);
            players[msg.id] = player;
        });

        game.on('dumpplayer', function (msg) {
            if (players[msg]) {
                delete players[msg];
            }
        });

        game.on('move', function (msg) {
            if (players[msg.id]) {
                players[msg.id].x = msg.x;
                players[msg.id].y = msg.y;
                players[msg.id].r = msg.r;
            }
        });

        game.on('shoot', function (msg) {
            var shot = new Shot(msg.id, msg.x, msg.y, msg.r, msg.t, msg.p);
            shots[msg.id] = shot;
        });

        game.on('shotend', function (msg) {
            if (shots[msg]) {
                delete shots[msg];
            }
        });

        game.on('hit', function (msg) {
            if (players[msg]) {
                players[msg].lastHit = new Date().getTime();
            }
        });

        game.on('death', function (msg) {
            if (players[msg]) {
                $('.msg').text(players[msg].n + ' is dead');
                delete players[msg];
            }
        });

        game.emit('newplayer', localPlayer);

        animate();
    });
};


/**************************************************
** GAME EVENT HANDLERS
**************************************************/
var setEventHandlers = function () {
    // Keyboard
    window.addEventListener("keydown", onKeydown, false);
    window.addEventListener("keyup", onKeyup, false);
};

// Keyboard key down
function onKeydown(e) {
    if (localPlayer) {
        keys.onKeyDown(e);
    };
};

// Keyboard key up
function onKeyup(e) {
    if (localPlayer) {
        keys.onKeyUp(e);
    };
};

// Browser window resize
function onResize() {
    // Maximise the canvas
    canvas.width = 1600;
    canvas.height = 800;
};

$(function () {
    ship = document.getElementById('ship');
    ship_hit = document.getElementById('ship_hit');

    $(document).on('menu-hlt', function (e, hlt) {
        localPlayer.setHealth(hlt);
    });

    $('nav a').on('click', function(e) {
        e.preventDefault();
        var a = $(this);
        $
            .get(a.attr('href'))
            .done(function(result) {
                $(document).trigger('menu-' + a.data('ev'), result);
            });
    });

    init();
});