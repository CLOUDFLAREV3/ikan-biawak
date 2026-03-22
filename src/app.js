/* ================================================================
   Gene v1.2 — src/app.js
   Web loadstring generator — standalone, tidak ada hubungan
   dengan project obfuscator.
   File ini di-obfuscate saat build → public/app.js
================================================================ */
;(function () {
    'use strict';

    /* ---- DOMAIN LOCK ------------------------------------------- */
    var ALLOWED = [
        'heaxon.vercel.app',  // ← ganti dengan domain Vercel kamu
        'localhost',
        '127.0.0.1',
    ];
    var host = (window.location.hostname || '').toLowerCase();
    var pass = false;
    for (var i = 0; i < ALLOWED.length; i++) {
        if (host === ALLOWED[i] || host.endsWith('.' + ALLOWED[i])) {
            pass = true; break;
        }
    }
    if (!pass) return; // domain tidak diizinkan → semua fungsi mati

    /* ---- CONSTANTS --------------------------------------------- */
    var MAX = 500;

    /* ---- VALIDATE ---------------------------------------------- */
    function _val(url) {
        if (!url)             return { ok:false, t:'error', m:'URL tidak boleh kosong.' };
        if (url.length > MAX) return { ok:false, t:'error', m:'URL terlalu panjang (maks '+MAX+' karakter).' };
        if (!url.startsWith('https://')) return { ok:false, t:'error', m:'URL harus diawali https://' };
        return { ok:true, t:'success', m:'URL valid \u2714' };
    }

    /* ---- FEEDBACK ---------------------------------------------- */
    function _fb(type, msg) {
        var box  = document.getElementById('feedbackMsg');
        var icon = document.getElementById('fbIcon');
        var text = document.getElementById('fbText');
        var inp  = document.getElementById('urlInput');
        box.classList.remove('error','warn','success','show');
        inp.classList.remove('state-error','state-warn','state-success');
        if (!type) return;
        icon.textContent = { error:'\u2716', warn:'\u26a0', success:'\u2714' }[type] || '';
        text.textContent = msg;
        box.classList.add(type, 'show');
        inp.classList.add('state-' + type);
    }
    function _clearFb() { _fb(null, ''); }

    /* ---- URL PREVIEW ------------------------------------------- */
    function _prev(url) {
        var el = document.getElementById('urlPreview');
        if (!url) { el.classList.remove('show'); el.innerHTML=''; return; }
        try {
            var u = new URL(url);
            var p = u.pathname.length > 55
                ? u.pathname.substring(0, 55) + '\u2026'
                : u.pathname;
            el.innerHTML = '\uD83D\uDD17 <span>' + u.hostname + '</span>'
                + (p && p !== '/' ? ' / <span>' + p + '</span>' : '');
            el.classList.add('show');
        } catch (e) { el.classList.remove('show'); }
    }

    /* ---- TOAST ------------------------------------------------- */
    var _tt;
    function _toast(msg, type, dur) {
        type = type || 'success'; dur = dur || 2000;
        var t = document.getElementById('toast');
        clearTimeout(_tt);
        t.textContent = msg;
        t.className   = type === 'error' ? 't-err' : '';
        void t.offsetWidth;
        t.classList.add('show');
        _tt = setTimeout(function () { t.classList.remove('show'); }, dur);
    }

    /* ---- CHAR COUNT -------------------------------------------- */
    function _cnt(len) {
        var el = document.getElementById('charCount');
        el.textContent = len + ' / ' + MAX;
        el.className   = len > MAX * 0.85 ? 'warn' : '';
    }

    /* ---- GENERATE ---------------------------------------------- */
    function _gen() {
        var url = document.getElementById('urlInput').value.trim();
        var out = document.getElementById('output');
        var res = _val(url);
        _fb(res.t, res.m);
        _prev(res.ok ? url : null);
        if (!res.ok) { out.value = ''; return; }
        out.value = 'loadstring(game:HttpGet("' + url + '"))()';
        _toast('\u2714 Loadstring dibuat!');
    }

    /* ---- COPY -------------------------------------------------- */
    function _copy() {
        var out = document.getElementById('output');
        var btn = document.getElementById('copyBtn');
        if (!out.value) {
            _fb('error', 'Tidak ada kode! Klik GEN terlebih dahulu.');
            _toast('\u2716 Tidak ada kode!', 'error');
            btn.classList.add('copy-error');
            setTimeout(function () { btn.classList.remove('copy-error'); }, 1500);
            return;
        }
        function win() {
            btn.textContent = '\u2713 COPIED!';
            btn.classList.add('copied');
            _toast('\u2714 Disalin ke clipboard!');
            setTimeout(function () {
                btn.textContent = '\u29c9 \u00a0COPY TO CLIPBOARD';
                btn.classList.remove('copied');
            }, 1800);
        }
        function fail(e) {
            _fb('error', 'Gagal menyalin. Salin manual dari kotak output.');
            _toast('\u2716 Gagal menyalin!', 'error', 3000);
            btn.classList.add('copy-error');
            setTimeout(function () {
                btn.textContent = '\u29c9 \u00a0COPY TO CLIPBOARD';
                btn.classList.remove('copy-error');
            }, 1800);
            console.error('[Gene]', e);
        }
        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(out.value).then(win).catch(fail);
        } else {
            try {
                out.select();
                out.setSelectionRange(0, 99999);
                document.execCommand('copy');
                win();
            } catch (e) { fail(e); }
        }
    }

    /* ---- CLEAR ------------------------------------------------- */
    function _clr() {
        document.getElementById('urlInput').value = '';
        document.getElementById('output').value   = '';
        _clearFb();
        _prev(null);
        _cnt(0);
        _toast('\uD83D\uDDD1 Dibersihkan', 'success', 1200);
    }

    /* ---- EVENTS ------------------------------------------------ */
    document.addEventListener('DOMContentLoaded', function () {
        var el = document.getElementById('urlInput');
        el.addEventListener('keypress', function (e) {
            if (e.key === 'Enter') { e.preventDefault(); _gen(); }
        });
        el.addEventListener('input', function () {
            _clearFb(); _prev(null); _cnt(this.value.length);
        });
        el.addEventListener('paste', function () {
            var s = this;
            setTimeout(function () {
                var v = s.value.trim();
                _cnt(v.length);
                if (v.length > 8) {
                    var r = _val(v);
                    _fb(r.t, r.m);
                    if (r.ok) _prev(v);
                }
            }, 50);
        });
    });

    /* ---- EXPOSE ke window (dipanggil HTML onclick) ------------- */
    window.generate        = _gen;
    window.copyToClipboard = _copy;
    window.clearAll        = _clr;

})();
