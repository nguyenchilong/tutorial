
/**
 * list function build the same php built-in by javascript code
 * Created by longnc on 12/14/15.
 */


/**
 *
 * http://phpjs.org/functions/str_replace/
 * str_replace(['{name}', 'l'], ['hello', 'm'], '{name}, lars')
 *
 * @param search
 * @param replace
 * @param subject
 * @param count
 * @returns {*}
 */
exports.str_replace = function(search, replace, subject, count){
    var i = 0, j = 0, temp = '', repl = '', sl = 0,
        fl = 0, f = [].concat(search),
        r = [].concat(replace), s = subject,
        ra = Object.prototype.toString.call(r) === '[object Array]',
        sa = Object.prototype.toString.call(s) === '[object Array]';
    s = [].concat(s);
    if(count){this.window[count] = 0;}
    for(i = 0, sl = s.length; i < sl; i++) {
        if(s[i] === ''){continue;}
        for(j = 0, fl = f.length; j < fl; j++) {
            temp = s[i] + '';
            repl = ra ? (r[j] !== undefined ? r[j] : '') : r[0];
            s[i] = (temp).split(f[j]).join(repl);
            if (count && s[i] !== temp) {
                this.window[count] += (temp.length - s[i].length) / f[j].length;
            }
        }
    }
    return sa ? s : s[0];
};
/**
* hash string by sha1
* http://phpjs.org/functions/sha1
* example: call sha1('Kevin van Zonneveld');
* returns: '54916d2e62f65b3afa6e192e6a601cdbe5cb5897'
*
* @param str
* @returns {string}
*/
exports.sha1 = function(str) {
    var rotate_left = function(n, s) {var t4 = (n << s) | (n >>> (32 - s));return t4;};
    var cvt_hex = function(val) {var str = '', i, v; for (i = 7; i >= 0; i--) {v = (val >>> (i * 4)) & 0x0f;str += v.toString(16);}return str;};
    var blockstart, i, j, W = new Array(80), H0 = 0x67452301, H1 = 0xEFCDAB89, H2 = 0x98BADCFE, H3 = 0x10325476, H4 = 0xC3D2E1F0, A, B, C, D, E, temp;
    // utf8_encode
    str = unescape(encodeURIComponent(str));
    var str_len = str.length, word_array = [];
    for (i = 0; i < str_len - 3; i += 4) {
        j = str.charCodeAt(i) << 24 | str.charCodeAt(i + 1) << 16 | str.charCodeAt(i + 2) << 8 | str.charCodeAt(i + 3);
        word_array.push(j);
    }
    switch (str_len % 4) {
        case 0:i = 0x080000000;break;
        case 1:i = str.charCodeAt(str_len - 1) << 24 | 0x0800000;break;
        case 2:i = str.charCodeAt(str_len - 2) << 24 | str.charCodeAt(str_len - 1) << 16 | 0x08000;break;
        case 3:i = str.charCodeAt(str_len - 3) << 24 | str.charCodeAt(str_len - 2) << 16 | str.charCodeAt(str_len - 1) << 8 | 0x80;break;
    }
    word_array.push(i);
    while ((word_array.length % 16) != 14) {word_array.push(0);}
    word_array.push(str_len >>> 29);
    word_array.push((str_len << 3) & 0x0ffffffff);
    for (blockstart = 0; blockstart < word_array.length; blockstart += 16) {
        for (i = 0; i < 16; i++) {W[i] = word_array[blockstart + i];}
        for (i = 16; i <= 79; i++) {W[i] = rotate_left(W[i - 3] ^ W[i - 8] ^ W[i - 14] ^ W[i - 16], 1);}
        A = H0; B = H1; C = H2; D = H3; E = H4;
        for (i = 0; i <= 19; i++) {
            temp = (rotate_left(A, 5) + ((B & C) | (~B & D)) + E + W[i] + 0x5A827999) & 0x0ffffffff;
            E = D; D = C; C = rotate_left(B, 30); B = A; A = temp;
        }
        for (i = 20; i <= 39; i++) {
            temp = (rotate_left(A, 5) + (B ^ C ^ D) + E + W[i] + 0x6ED9EBA1) & 0x0ffffffff;
            E = D; D = C; C = rotate_left(B, 30); B = A; A = temp;
        }
        for (i = 40; i <= 59; i++) {
            temp = (rotate_left(A, 5) + ((B & C) | (B & D) | (C & D)) + E + W[i] + 0x8F1BBCDC) & 0x0ffffffff;
            E = D; D = C; C = rotate_left(B, 30); B = A; A = temp;
        }
        for (i = 60; i <= 79; i++) {
            temp = (rotate_left(A, 5) + (B ^ C ^ D) + E + W[i] + 0xCA62C1D6) & 0x0ffffffff;
            E = D; D = C; C = rotate_left(B, 30); B = A; A = temp;
        }
        H0 = (H0 + A) & 0x0ffffffff;
        H1 = (H1 + B) & 0x0ffffffff;
        H2 = (H2 + C) & 0x0ffffffff;
        H3 = (H3 + D) & 0x0ffffffff;
        H4 = (H4 + E) & 0x0ffffffff;
    }
    temp = cvt_hex(H0) + cvt_hex(H1) + cvt_hex(H2) + cvt_hex(H3) + cvt_hex(H4);
    return temp.toLowerCase();
};



