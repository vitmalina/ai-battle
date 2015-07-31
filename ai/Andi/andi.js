var ai = {
    name: "Andi",
    author: "Vladimir Malinouski",
    color: "",
    lastMoves: [],
    next: function(a, b) {
        var c = [],
            d = 0;
        ai.color || (ai.color = a[b[0].substr(0, 1)][parseInt(b[0].substr(1, 1)) - 1].substr(0, 1), ai.op = "w" == ai.color ? "b" : "w", console.log(ai.color));
        for (var f = 0; f < b.length; f++) {
            var g = pretendMove($.extend(!0, {}, a), b[f]),
                h = getMoves($.extend(!0, {}, g), ai.color).length,
                i = "",
                j = b[f].split(":");
            j[2] && (i = j[2].substr(1, 1));
            for (var k = !1, l = getMoves($.extend(!0, {}, g), ai.op), m = 0; m < l.length; m++) {
                var n = l[m].split(":");
                n[1] == j[1] && (k = !0)
            }
            var o = parseInt(b[f].substr(1, 1));
            o -= 1;
            for (var p = a[b[f].substr(0, 1)][o].substr(1, 1), q = !1, r = getMoves($.extend(!0, {}, a), ai.op), m = 0; m < r.length; m++) {
                var n = r[m].split(":");
                j[0] == n[1] && (q = !0)
            }
            for (var s = !1, t = getMoves($.extend(!0, {}, g), ai.op), m = 0; m < t.length; m++) {
                var n = t[m].split(":");
                n[1] == j[1] && (s = !0)
            }
            c.push({
                availMoves: h,
                take: {
                    piece: i,
                    prot: k
                },
                move: b[f],
                piece: p,
                eThreat: q,
                mThreat: s,
                points: 0
            })
        }
        return d = ai.totalPoints(c), ai.lastMoves = b, d
    },
    totalPoints: function(a) {
        for (var b = a[0].move, c = 0, d = {
                p: 3,
                h: 8,
                b: 9,
                r: 20,
                q: 31
            }, e = 0; e < a.length; e++) "" != a[e].take.piece && (a[e].take.prot ? a[e].points -= d[a[e].piece] : a[e].points += d[a[e].take.piece]), a[e].availMoves > ai.lastMoves.length && "k" != a[e].piece && (a[e].points += a[e].availMoves / 50), a[e].eThreat && (a[e].points += d[a[e].piece], console.log(a[e].piece)), a[e].mThreat && (a[e].points -= 1.5 * d[a[e].piece]);
        for (var e = 0; e < a.length; e++) a[e].points >= c && (c = a[e].points, b = a[e].move);
        return b
    }
};