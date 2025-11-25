const rtl = document.getElementById("rtlToggle");
const fs = document.getElementById("fontSize");
const op = document.getElementById("opacity");
const fsVal = document.getElementById("fsVal");
const opVal = document.getElementById("opVal");

chrome.storage.sync.get({rtl:true,fontSize:28,opacity:0.85},function(cfg){
  rtl.checked = cfg.rtl;
  fs.value = cfg.fontSize;
  op.value = cfg.opacity;
  fsVal.textContent = cfg.fontSize;
  opVal.textContent = cfg.opacity;
});

function save(){
  chrome.storage.sync.set({
    rtl: rtl.checked,
    fontSize: parseInt(fs.value),
    opacity: parseFloat(op.value)
  });
}

rtl.onchange = save;
fs.oninput = function(){ fsVal.textContent = fs.value; save(); };
op.oninput = function(){ opVal.textContent = op.value; save(); };
