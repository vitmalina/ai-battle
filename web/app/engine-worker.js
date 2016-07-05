/**************************************************
 *  --- AI BAttle worker (for asynch calculations)
 */

var ais = {
    randy   : 'randy.js',
    lucy    : 'lucy.js',
    andi    : 'Andi/andi.02.js',
    jack    : 'jack.js'
};

addEventListener('message', message, false);
addEventListener('error', function error(error) {
    console.log('Worker ERROR:', error);
}, false);

function message(event) {
    var cmd = event.data.cmd;
    if (cmd == null) {
        console.log('Worker ERROR: Empty command.', event);
        return;
    }
    switch (cmd) {

        case 'init':
            var count = 0;
            // init events
            for (var a in ais) {
                count++;
                load('../ais/'+ ais[a], function (xhr) {
                    var engine, field, places, taken, history, ais; // prevent access to these vars
                    try {
                        eval(xhr.responseText);
                    } catch(e) {
                    }
                    if (ai == null || ai.name == null || typeof ai.next != 'function') {
                        console.log('ERROR: cannot load '+ a + '.ai. File needs to look like "var ai = { name: "name", next: function() {...} }');
                    }
                    _register(ai.name.toLowerCase(), ai);
                    count--;
                    if (count == 0) _done();
                });
                // this function is here for sand boxing
                function _register(name, ai) {
                    ais[name] = ai;
                }
                function _done() {
                    var keys = Object.keys(ais);
                    var ret  = {};
                    keys.forEach(function (nm) {
                        ret[nm] = { name: ais[nm].name, author: ais[nm].author, desc: ais[nm].desc };
                    });
                    postMessage({ cmd: cmd, ais: ret });
                }
            }
            break;

        case 'next':
            var ai = ais[event.data.ai];
            if (ai && typeof ai.next == 'function') {
                postMessage({ cmd: cmd, move: ai.next(event.data.state) });
            }
            break;
    }
}

// this function is used in some of the ais
function pretendMove(fld, mv) {
    if (arguments.length != 2) {
        mv  = fld;
        fld = null;
    }
    if (fld == null) fld = cloneField(field);
    var tmp = mv.split(':');
    var f1  = tmp[0][0];
    var i1  = parseInt(tmp[0][1]) - 1;
    var f2  = tmp[1][0];
    var i2  = parseInt(tmp[1][1]) - 1;
    fld[f2][i2] = fld[f1][i1];
    fld[f1][i1] = '';
    // white pawn promotion
    if (f1 == 'w' && i2 == 7 && field[f2][i2] == 'wp') {
        field[f2][i2] = 'wq';
    }
    // black pawn promotion
    if (f1 == 'b' && i2 == 0 && field[f2][i2] == 'bp') {
        field[f2][i2] = 'bq';
    }
    // casteling (white)
    if (f1 == 'w') {
        if (mv == 'e1:g1') {
            field['f'][0] = 'wr';
            field['h'][0] = '';
        }
        if (mv == 'e1:c1') {
            field['d'][0] = 'wr';
            field['a'][0] = '';
        }
    }
    // casteling (black)
    if (f1 == 'b') {
        if (mv == 'e8:g8') {
            field['f'][7] = 'br';
            field['h'][7] = '';
        }
        if (mv == 'e8:c8') {
            field['d'][7] = 'br';
            field['a'][7] = '';
        }
    }
    // save pretend field
    if (arguments.length != 2) this.field = fld;
    return fld;
}

// simple XHR request in pure JavaScript
function load(url, callback) {
    var xhr;
    if (typeof XMLHttpRequest !== 'undefined') {
        xhr = new XMLHttpRequest();
    } else {
        console.log('ERROR: Your browser does not suppport XMLHTTPRequest.');
        return;
    }
    xhr.onreadystatechange = function ensureReadiness() {
        if (xhr.readyState < 4 || xhr.status !== 200) return;
        if (xhr.readyState === 4) {
            callback(xhr);
        }
    }
    xhr.open('GET', url, true);
    xhr.send('');
}