/* scorm12-helper.js — SCORM 1.2 helper (score+GUID single commit, long-GUID safe) */
(function(){
  var MAX_HOPS = 20;

  function getAPIFrom(win){ try { if (win && win.API) return win.API; } catch(e){} return null; }
  function getAPI(){
    var api=null, hop=0, w=window;
    while(w && hop++<MAX_HOPS && !api){
      api = getAPIFrom(w);
      if(!api && w.parent && w.parent!==w) w = w.parent; else break;
    }
    if(!api && window.opener){
      w = window.opener; hop=0;
      while(w && hop++<MAX_HOPS && !api){
        api = getAPIFrom(w);
        w = (w.parent && w.parent!==w) ? w.parent : (w.opener || null);
      }
    }
    return api;
  }

  function clampPct(n){ n = Number(n)||0; if(n<0) n=0; if(n>100) n=100; return Math.round(n); }
  function commit(api){ try { api && api.LMSCommit && api.LMSCommit(""); } catch(e){} }
  function postComplete(){ try { if (window.parent) window.parent.postMessage({ type: 'complete' }, '*'); } catch(e){} }

  function fnv1a32(str){
    var h = 0x811c9dc5 >>> 0;
    for (var i=0; i<str.length; i++){
      h ^= str.charCodeAt(i);
      h = (h + (h<<1) + (h<<4) + (h<<7) + (h<<8) + (h<<24)) >>> 0;
    }
    return ('00000000' + h.toString(16)).slice(-8);
  }

  function storeGuidFields(api, g, pct){
    try{
      var payload = JSON.stringify({ guid: String(g||''), score: pct, ts: (new Date()).toISOString() });
      if (payload.length <= 4000) {
        api.LMSSetValue('cmi.suspend_data', payload);
      } else {
        var head = String(g||'').substring(0, 3500);
        var truncated = JSON.stringify({ guid: head, truncated: true, total_len: String(g||'').length, score: pct, ts: (new Date()).toISOString() });
        api.LMSSetValue('cmi.suspend_data', truncated.substring(0, 4000));
      }
      var ref;
      if (g && g.length > 200) ref = 'guid-fnv32:' + fnv1a32(g) + ':' + g.length;
      else ref = 'guid:' + g;
      if (ref.length > 250) ref = ref.substring(0, 250);
      api.LMSSetValue('cmi.core.lesson_location', ref);
    }catch(e){}
  }

  window.reportScoreAndGUIDToLMS12 = function(rawPercent, guidToken, max, passMark){
    var api = getAPI(); if(!api) return false;
    var pct = clampPct(rawPercent);
    var maxScore = (typeof max === 'number') ? max : 100;
    var cut = (typeof passMark === 'number') ? passMark : 70;
    var status = (pct >= cut) ? 'passed' : 'failed';
    var g = String(guidToken || '');
    try{
      api.LMSSetValue('cmi.core.score.raw', String(pct));
      api.LMSSetValue('cmi.core.score.max', String(maxScore));
      api.LMSSetValue('cmi.core.score.min', '0');
      api.LMSSetValue('cmi.core.lesson_status', status);
      if (g) storeGuidFields(api, g, pct);
    }catch(e){}
    commit(api);
    postComplete();
    return true;
  };
})();