
import { polyfillIfRequired } from 'esm-date-input-polyfill';

if (window.__gest_age_script_loaded) {
    // https://gist.github.com/samthor/64b114e4a4f539915a95b91ffd340acc
    throw new Error('simple-nicu-calcs has been executed twice - usually a Safari bug');
}
window.__gest_age_script_loaded = true;

export function gestAgePageScript() {
    const targetDateEl = document.getElementById('targetDate');
    const lmpDateEl = document.getElementById('lmpDate');
    const scanEddEl = document.getElementById('scanEdd');
    const msPerDay = 86400000;
    const termGestMs = 24192000000; // 40 weeks in ms
    polyfillIfRequired().then(function() {
        if (targetDateEl.valueAsDate === null) {
            setTargetNow(); 
        }
        elChange({target: targetDateEl});
    });

    [targetDateEl, lmpDateEl, scanEddEl].forEach(function(el) {
        el.addEventListener('change', elChange, { passive: true });
    });

    document.getElementsByTagName('form')[0].addEventListener('reset', function() {
        const cont = document.querySelectorAll('.output-container');
        for (let i = 0; i < cont.length; ++i) { //ie11 compat
            cont[i].classList.add('hidden');
        }
        if (lmpDateEl.getAttribute('data-has-picker') !== null) { // this is if the datepicker polyfill is used
            setTimeout(function() {
                [lmpDateEl, scanEddEl].forEach(function(el) { 
                    el.value='';
                });
            }, 1);
        }
        setTimeout(setTargetNow, 1);
    });

    function setTargetNow() {
        const now = new Date();
        now.setTime(now.getTime() - now.getTimezoneOffset() * 60000); 
        targetDateEl.valueAsDate = now;
    }

    function elChange(evt) {
        const maxOverTermMs = 4233600000; // 7 weeks in ms - 3 weeks for over term and 4 weeks max difference dates/scan
        const overDatesMs = termGestMs + maxOverTermMs;
        const eddByLmpOut = document.getElementById('eddByLmp');
        const lmpWeeksOut = document.getElementById('lmpCgaWeeks');
        const lmpDaysOut = document.getElementById('lmpCgaDays');
        const eddWeeksOut = document.getElementById('eddCgaWeeks');
        const eddDaysOut = document.getElementById('eddCgaDays');
        evt.target.form.reportValidity(); 
        const lmpDate = lmpDateEl.validity.valid 
            ? lmpDateEl.valueAsDate
            : null;
        const scanEdd = scanEddEl.validity.valid 
            ? scanEddEl.valueAsDate
            : null;
        const targetDate = targetDateEl.validity.valid 
            ? targetDateEl.valueAsDate
            : null;
        let lwd;
        let ewd;
        if (evt.target === targetDateEl) {
            if (targetDate) {
                lmpDateEl.min = asYMD(targetDate.getTime() - overDatesMs);
                lmpDateEl.max = asYMD(targetDate);
                scanEddEl.min = asYMD(targetDate.getTime() - maxOverTermMs);
                scanEddEl.max = asYMD(targetDate.getTime() + overDatesMs);
            } else {
                lmpDateEl.min = lmpDateEl.max = scanEddEl.min = scanEddEl.max = '';
            }
        } 
        if (lmpDate) {
            const lmpEdd = new Date(lmpDate.getTime() + termGestMs); 
            // ie 11 hack - doesn't have an output element with a value
            eddByLmpOut.innerHTML = lmpEdd.toLocaleDateString(void 0, { year: 'numeric', month: 'short', day: 'numeric', weekday: 'short' });
        }
        containerVis(eddByLmpOut, lmpDate);
        if (targetDate) {
            if (lmpDate) {
                lwd = cgaByLMP(lmpDate, targetDate);
                lmpWeeksOut.innerHTML = lwd.weeks;
                lmpDaysOut.innerHTML = lwd.days;
            }
            if (scanEdd) {
                ewd = cgaByEDD(scanEdd, targetDate);
                eddWeeksOut.innerHTML = ewd.weeks;
                eddDaysOut.innerHTML = ewd.days;
            }
        }
        containerVis(lmpWeeksOut, lwd);
        containerVis(eddWeeksOut, ewd);
    }

    function containerVis(el, isVis) {
        do {
            el = el.parentNode;
        } while(!el.classList.contains('output-container'));
        if (isVis) {
            el.classList.remove('hidden');
        } else {
            el.classList.add('hidden');
        }
    }
    function weeksDays(days) {
        let weeks = Math.floor(days / 7);
        days = Math.floor(days - weeks * 7);
        if (weeks > 44) { 
            weeks = '> 43'; 
            days = 'N/A';
        }
        if (weeks < 0) { 
            weeks = '< 0';
            days = 'N/A';
        }
        return { weeks: weeks, days: days }; // ie11 compatability!
    }
    function cgaByLMP(lmp, onDate) {
        let days = (onDate.getTime() - lmp.getTime()) / msPerDay;
        return weeksDays(days);
    }
    function cgaByEDD(edd, onDate) {
        let days = 280 - (edd.getTime() - onDate.getTime()) / msPerDay; // 280 = 40 weeks * 7 days/week
        return weeksDays(days);
    }

    function asYMD(dt) {
        if (typeof dt === 'number') {
            dt = new Date(dt);
        }
        return dt.toISOString().slice(0, 10);
    }
}