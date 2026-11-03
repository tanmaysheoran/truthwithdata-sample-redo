// Local-currency prices.
//
// Mark up any price as
//   <span data-price-amount="5.99" data-price-currency="GBP">£5.99</span>
// and this script rewrites it in the visitor's currency, e.g. "≈ $8.02" in the US
// or "≈ ₹761" in India. Elements with [data-price-note] are revealed when a price
// has been converted (use them to say what the checkout actually charges).
//
// Country: Netlify's IP geolocation (/api/geo), falling back to the browser's time
// zone and language. Rates: the free, daily @fawazahmed0/currency-api, cached for
// 12 hours, with a built-in table as a fallback. Without JavaScript, or when the
// visitor is in the price's own currency, the original text is left alone.
(function () {
    'use strict';

    // USD-based fallback rates (currency-api, 31 Oct 2026). Live rates replace these.
    var FALLBACK = { date: '2026-10-31', rates: {
        USD: 1, GBP: 0.7469, EUR: 0.895897, INR: 94.9182, CAD: 1.39747, AUD: 1.42212, NZD: 1.77595,
        JPY: 157.576, CNY: 6.6565, HKD: 7.845, SGD: 1.27826, AED: 3.6725, SAR: 3.75, CHF: 0.82495,
        SEK: 9.8265, NOK: 9.20315, DKK: 6.693, PLN: 3.94725, CZK: 21.8148, HUF: 327.97, RON: 4.78354,
        ZAR: 16.7089, NGN: 1346.55, KES: 129.846, BRL: 5.43935, MXN: 18.7873, KRW: 1333.53,
        MYR: 4.05834, THB: 33.765, IDR: 18139.5, PHP: 63.7647, PKR: 276.663, BDT: 124.163, LKR: 332.665,
        NPR: 151.94, TRY: 49.9551, ILS: 3.1445, EGP: 55.8789, QAR: 3.64, KWD: 0.31115, BHD: 0.376,
        OMR: 0.384395, TWD: 32.6201, VND: 25765.5, ARS: 1531.52, CLP: 993.389, COP: 3221.5, PEN: 3.4615,
        GHS: 11.6438, UAH: 45.3873, ISK: 121.805
    } };

    var EURO = 'AT BE BG HR CY EE FI FR DE GR IE IT LV LT LU MT NL PT SK SI ES AD MC SM VA ME XK'.split(' ');
    var COUNTRY_CURRENCY = {
        GB: 'GBP', IM: 'GBP', JE: 'GBP', GG: 'GBP', US: 'USD', PR: 'USD', EC: 'USD', SV: 'USD', PA: 'USD',
        IN: 'INR', CA: 'CAD', AU: 'AUD', NZ: 'NZD', JP: 'JPY', CN: 'CNY', HK: 'HKD', SG: 'SGD', AE: 'AED',
        SA: 'SAR', CH: 'CHF', LI: 'CHF', SE: 'SEK', NO: 'NOK', DK: 'DKK', PL: 'PLN', CZ: 'CZK', HU: 'HUF',
        RO: 'RON', ZA: 'ZAR', NG: 'NGN', KE: 'KES', BR: 'BRL', MX: 'MXN', KR: 'KRW', MY: 'MYR', TH: 'THB',
        ID: 'IDR', PH: 'PHP', PK: 'PKR', BD: 'BDT', LK: 'LKR', NP: 'NPR', TR: 'TRY', IL: 'ILS', EG: 'EGP',
        QA: 'QAR', KW: 'KWD', BH: 'BHD', OM: 'OMR', TW: 'TWD', VN: 'VND', AR: 'ARS', CL: 'CLP', CO: 'COP',
        PE: 'PEN', GH: 'GHS', UA: 'UAH', IS: 'ISK'
    };
    EURO.forEach(function (c) { COUNTRY_CURRENCY[c] = 'EUR'; });

    var TZ_COUNTRY = {
        'Europe/London': 'GB', 'Europe/Belfast': 'GB', 'Europe/Isle_of_Man': 'IM', 'Europe/Jersey': 'JE', 'Europe/Guernsey': 'GG',
        'Asia/Kolkata': 'IN', 'Asia/Calcutta': 'IN', 'Europe/Dublin': 'IE', 'Europe/Paris': 'FR', 'Europe/Berlin': 'DE',
        'Europe/Madrid': 'ES', 'Europe/Rome': 'IT', 'Europe/Amsterdam': 'NL', 'Europe/Brussels': 'BE', 'Europe/Vienna': 'AT',
        'Europe/Lisbon': 'PT', 'Europe/Helsinki': 'FI', 'Europe/Athens': 'GR', 'Europe/Luxembourg': 'LU', 'Europe/Malta': 'MT',
        'Europe/Tallinn': 'EE', 'Europe/Riga': 'LV', 'Europe/Vilnius': 'LT', 'Europe/Bratislava': 'SK', 'Europe/Ljubljana': 'SI',
        'Europe/Zagreb': 'HR', 'Asia/Nicosia': 'CY', 'Europe/Sofia': 'BG', 'Europe/Stockholm': 'SE', 'Europe/Oslo': 'NO',
        'Europe/Copenhagen': 'DK', 'Europe/Zurich': 'CH', 'Europe/Warsaw': 'PL', 'Europe/Prague': 'CZ', 'Europe/Budapest': 'HU',
        'Europe/Bucharest': 'RO', 'Europe/Istanbul': 'TR', 'Europe/Kiev': 'UA', 'Europe/Kyiv': 'UA', 'Atlantic/Reykjavik': 'IS',
        'America/New_York': 'US', 'America/Chicago': 'US', 'America/Denver': 'US', 'America/Los_Angeles': 'US',
        'America/Phoenix': 'US', 'America/Anchorage': 'US', 'America/Detroit': 'US', 'America/Boise': 'US',
        'America/Indiana/Indianapolis': 'US', 'Pacific/Honolulu': 'US', 'America/Puerto_Rico': 'PR',
        'America/Toronto': 'CA', 'America/Vancouver': 'CA', 'America/Edmonton': 'CA', 'America/Winnipeg': 'CA',
        'America/Halifax': 'CA', 'America/Regina': 'CA', 'America/St_Johns': 'CA', 'America/Mexico_City': 'MX',
        'America/Sao_Paulo': 'BR', 'America/Argentina/Buenos_Aires': 'AR', 'America/Buenos_Aires': 'AR',
        'America/Santiago': 'CL', 'America/Bogota': 'CO', 'America/Lima': 'PE', 'America/Panama': 'PA',
        'Australia/Sydney': 'AU', 'Australia/Melbourne': 'AU', 'Australia/Brisbane': 'AU', 'Australia/Perth': 'AU',
        'Australia/Adelaide': 'AU', 'Australia/Hobart': 'AU', 'Australia/Darwin': 'AU', 'Pacific/Auckland': 'NZ',
        'Asia/Dubai': 'AE', 'Asia/Riyadh': 'SA', 'Asia/Qatar': 'QA', 'Asia/Kuwait': 'KW', 'Asia/Bahrain': 'BH',
        'Asia/Muscat': 'OM', 'Asia/Jerusalem': 'IL', 'Asia/Tel_Aviv': 'IL', 'Africa/Cairo': 'EG',
        'Asia/Singapore': 'SG', 'Asia/Hong_Kong': 'HK', 'Asia/Tokyo': 'JP', 'Asia/Shanghai': 'CN', 'Asia/Seoul': 'KR',
        'Asia/Kuala_Lumpur': 'MY', 'Asia/Bangkok': 'TH', 'Asia/Jakarta': 'ID', 'Asia/Manila': 'PH', 'Asia/Taipei': 'TW',
        'Asia/Ho_Chi_Minh': 'VN', 'Asia/Saigon': 'VN', 'Asia/Karachi': 'PK', 'Asia/Dhaka': 'BD', 'Asia/Colombo': 'LK',
        'Asia/Kathmandu': 'NP', 'Asia/Katmandu': 'NP', 'Africa/Johannesburg': 'ZA', 'Africa/Lagos': 'NG',
        'Africa/Nairobi': 'KE', 'Africa/Accra': 'GH'
    };

    var RATE_URLS = [
        'https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/usd.min.json',
        'https://latest.currency-api.pages.dev/v1/currencies/usd.min.json'
    ];

    function store(key, value) {
        try {
            if (value === undefined) {
                var raw = localStorage.getItem(key);
                return raw ? JSON.parse(raw) : null;
            }
            localStorage.setItem(key, JSON.stringify(value));
        } catch (e) { /* storage blocked: fine */ }
        return null;
    }

    function fetchJSON(url, ms) {
        var ctl = typeof AbortController !== 'undefined' ? new AbortController() : null;
        var timer = setTimeout(function () { if (ctl) ctl.abort(); }, ms);
        return fetch(url, ctl ? { signal: ctl.signal } : {}).then(function (r) {
            if (!r.ok) throw new Error(r.status);
            return r.json();
        }).then(function (data) {
            clearTimeout(timer);
            return data;
        }, function (error) {
            clearTimeout(timer);
            throw error;
        });
    }

    function guessCountry() {
        try {
            var tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
            if (TZ_COUNTRY[tz]) return TZ_COUNTRY[tz];
        } catch (e) { /* old browser */ }
        var langs = navigator.languages || [navigator.language || ''];
        for (var i = 0; i < langs.length; i++) {
            var m = /[-_]([A-Za-z]{2})$/.exec(langs[i] || '');
            if (m && COUNTRY_CURRENCY[m[1].toUpperCase()]) return m[1].toUpperCase();
        }
        return null;
    }

    function detectCountry() {
        var override = /[?&]country=([A-Za-z]{2})\b/.exec(location.search);  // for testing: ?country=IN
        if (override) return Promise.resolve(override[1].toUpperCase());
        var cached = store('twd_geo');
        if (cached && cached.country && Date.now() - cached.t < 7 * 864e5) return Promise.resolve(cached.country);
        if (location.protocol === 'file:') return Promise.resolve(guessCountry());
        return fetchJSON('/api/geo', 1500).then(function (d) {
            var c = d && /^[A-Z]{2}$/.test(d.country || '') ? d.country : guessCountry();
            if (c) store('twd_geo', { country: c, t: Date.now() });
            return c;
        }).catch(guessCountry);
    }

    function loadRates() {
        var cached = store('twd_fx');
        if (cached && cached.rates && Date.now() - cached.t < 12 * 3600e3) return Promise.resolve(cached);
        function tryUrl(i) {
            if (i >= RATE_URLS.length) return Promise.resolve(FALLBACK);
            return fetchJSON(RATE_URLS[i], 2500).then(function (d) {
                if (!d || !d.usd || !d.usd.gbp) throw new Error('bad rates');
                var rates = {};
                Object.keys(FALLBACK.rates).forEach(function (c) {
                    var v = d.usd[c.toLowerCase()];
                    rates[c] = typeof v === 'number' && v > 0 ? v : FALLBACK.rates[c];
                });
                var out = { date: d.date, rates: rates, t: Date.now() };
                store('twd_fx', out);
                return out;
            }).catch(function () { return tryUrl(i + 1); });
        }
        return tryUrl(0);
    }

    function locale() {
        return (navigator.languages && navigator.languages[0]) || navigator.language || 'en-GB';
    }

    function format(amount, currency, converted) {
        var opts = { style: 'currency', currency: currency };
        if (converted ? amount >= 100 : Math.round(amount) === amount) {
            opts.minimumFractionDigits = 0;
            opts.maximumFractionDigits = 0;
        }
        try {
            return new Intl.NumberFormat(locale(), opts).format(amount);
        } catch (e) {
            return currency + ' ' + amount.toFixed(2);
        }
    }

    function convert(amount, from, to, rates) {
        if (from === to) return amount;
        if (!rates[from] || !rates[to]) return null;
        return amount / rates[from] * rates[to];
    }

    var state = { currency: null, rates: FALLBACK.rates, ratesDate: FALLBACK.date };

    function apply(root) {
        root = root || document;
        var anyConverted = false;
        var els = root.querySelectorAll('[data-price-amount]');
        for (var i = 0; i < els.length; i++) {
            var el = els[i];
            var amount = parseFloat(el.getAttribute('data-price-amount'));
            var base = (el.getAttribute('data-price-currency') || 'GBP').toUpperCase();
            if (isNaN(amount)) continue;
            var target = state.currency || base;
            var value = convert(amount, base, target, state.rates);
            if (value === null) { target = base; value = amount; }
            var converted = target !== base;
            el.textContent = (converted ? '≈ ' : '') + format(value, target, converted);
            el.classList.toggle('price-converted', converted);
            if (converted) {
                anyConverted = true;
                el.title = 'About ' + format(value, target, true) + ' at the ' + state.ratesDate +
                    ' exchange rate. The price is ' + format(amount, base, false) + '.';
            } else {
                el.removeAttribute('title');
            }
        }
        var notes = root.querySelectorAll('[data-price-note]');
        for (var j = 0; j < notes.length; j++) notes[j].hidden = !anyConverted;
    }

    var ready = Promise.all([detectCountry(), loadRates()]).then(function (res) {
        state.currency = (res[0] && COUNTRY_CURRENCY[res[0]]) || null;
        state.rates = res[1].rates;
        state.ratesDate = res[1].date || FALLBACK.date;
        return state;
    }).catch(function () { return state; });

    window.TWDCurrency = {
        ready: ready,
        apply: function (root) { return ready.then(function () { apply(root); }); },
        format: format
    };

    function start() { window.TWDCurrency.apply(document); }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
    else start();
})();
