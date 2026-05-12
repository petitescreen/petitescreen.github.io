// ================= ระบบพื้นฐาน (SPA & UI) =================
let counts = { lan: 1, shoe: 1, badge: 1, print: 1 };

function MapsTo(pageId) {
    document.querySelectorAll('.app-page').forEach(page => page.classList.remove('active-page'));
    const targetPage = document.getElementById(pageId);
    if(targetPage) targetPage.classList.add('active-page');
    const wrapper = document.querySelector('.wrapper');
    if (wrapper) wrapper.scrollTop = 0;
    
    // อัปเดตใบสรุปออเดอร์ทุกครั้งที่กดเปิดหน้า summary
    if(pageId === 'page-summary') {
        generateOrderSummary();
    }
}

function updateNav(element) {
    document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
    element.classList.add('active');
}

function showToast(msg) {
    const t = document.getElementById("toast");
    t.innerHTML = msg; t.className = "show";
    setTimeout(() => t.className = "", 3000);
}

function copyOrder(summaryId) {
    const summaryBox = document.getElementById(summaryId);
    if(!summaryBox.value) { showToast("⚠️ ยังไม่มีรายการสั่งซื้อค่ะ"); return; }
    summaryBox.select(); summaryBox.setSelectionRange(0, 99999);
    try { document.execCommand("copy"); showToast("📋 คัดลอกรายการแล้ว!"); } catch(e) { showToast("⚠️ กดค้างเพื่อก๊อปปี้"); }
}

function clearOrder(summaryId, counterId, type) {
    document.getElementById(summaryId).value = "";
    counts[type] = 1; document.getElementById(counterId).innerText = 1;
    showToast("🗑️ ล้างข้อมูลเรียบร้อยแล้วค่ะ");
}

function buildMixedFontHTML(text, thaiFont, engFont) {
    let resultHTML = "", currentType = null, currentChunk = "";
    for (let i = 0; i < text.length; i++) {
        let char = text[i];
        if (char === '\n') {
            if (currentChunk !== "") resultHTML += `<span style="font-family: ${currentType === 'thai' ? thaiFont : engFont};">${currentChunk}</span>`;
            resultHTML += `<br>`; currentChunk = ""; currentType = null; continue;
        }
        let type = /[\u0E00-\u0E7F]/.test(char) ? 'thai' : 'eng';
        if (currentType === null) { currentType = type; currentChunk = char; }
        else if (currentType === type) { currentChunk += char; }
        else {
            resultHTML += `<span style="font-family: ${currentType === 'thai' ? thaiFont : engFont};">${currentChunk}</span>`;
            currentType = type; currentChunk = char;
        }
    }
    if (currentChunk !== "") resultHTML += `<span style="font-family: ${currentType === 'thai' ? thaiFont : engFont};">${currentChunk}</span>`;
    return resultHTML;
}

function hsvToHex(h, s, v) {
    v /= 100; s /= 100; let f = (n, k = (n + h / 60) % 6) => v * (1 - s * Math.max(Math.min(k, 4 - k, 1), 0));
    let rgb = [f(5), f(3), f(1)].map(x => Math.round(x * 255).toString(16).padStart(2, '0'));
    return `#${rgb.join('')}`.toUpperCase();
}
function hexToHsv(hex) {
    if (!hex || hex === "transparent" || hex === "none") return {h:0, s:0, v:100};
    let r = parseInt(hex.slice(1, 3), 16) / 255, g = parseInt(hex.slice(3, 5), 16) / 255, b = parseInt(hex.slice(5, 7), 16) / 255;
    let max = Math.max(r, g, b), min = Math.min(r, g, b), h = 0, s = 0, v = max, d = max - min;
    s = max === 0 ? 0 : d / max;
    if (max !== min) { switch (max) { case r: h = (g - b) / d + (g < b ? 6 : 0); break; case g: h = (b - r) / d + 2; break; case b: h = (r - g) / d + 4; break; } h /= 6; }
    return { h: h * 360, s: s * 100, v: v * 100 };
}
function rgbToHex(c) {
    if (!c) return '#000000'; if (c.startsWith('#')) return c;
    const rgb = c.match(/\d+/g); if (!rgb) return '#000000';
    return '#' + rgb.slice(0, 3).map(x => parseInt(x).toString(16).padStart(2, '0')).join('').toUpperCase();
}

// ================= 1. ระบบสายคล้องแมสสกรีนชื่อ =================
function updateAllLanyard() {
    const text = document.getElementById("textInputLan").value || "น้องปั้นหยา Panyah";
    const thaiF = document.getElementById("thaiFontLan").value, engF = document.getElementById("engFontLan").value;
    const color = document.getElementById("colorSelectorLan").value, bg = document.getElementById("bgSelectorLan").value;
    const sampleText = document.getElementById("sampleTextLan");

    sampleText.innerHTML = buildMixedFontHTML(text, thaiF, engF);
    let fontSize = 42;
    sampleText.style.fontSize = fontSize + "px";
    while (sampleText.scrollWidth > sampleText.parentElement.clientWidth - 20 && fontSize > 10) {
        fontSize--; sampleText.style.fontSize = fontSize + "px";
    }

    if (color === "none") {
        sampleText.style.backgroundImage = "none"; sampleText.style.color = "#000000";
    } else if (color.startsWith('url')) {
        sampleText.style.color = "transparent"; sampleText.style.backgroundImage = color;
        sampleText.style.backgroundClip = "text"; sampleText.style.webkitBackgroundClip = "text";
    } else { 
        sampleText.style.backgroundImage = "none"; sampleText.style.color = color;
    }
    document.getElementById("sampleBoxLan").style.backgroundImage = bg !== "none" ? bg : "none";
}

function addToListLanyard() {
    const rawText = document.getElementById("textInputLan").value.trim(); 
    const bgVal = document.getElementById("bgSelectorLan").value;

    if (!rawText) { showToast("⚠️ กรุณาพิมพ์ชื่อที่ต้องการสกรีนด้วยค่ะ"); return; }
    if (bgVal === "none") { showToast("⚠️ กรุณาเลือกสีสายคล้องแมสด้วยค่ะ"); return; }

    const cartoonText = document.getElementById("cartoonInputLan").value || "-";
    const tFont = document.getElementById("thaiFontLan").options[document.getElementById("thaiFontLan").selectedIndex].text;
    const eFont = document.getElementById("engFontLan").options[document.getElementById("engFontLan").selectedIndex].text;
    const cName = document.getElementById("colorSelectorLan").options[document.getElementById("colorSelectorLan").selectedIndex].text;
    const bgName = document.getElementById("bgSelectorLan").options[document.getElementById("bgSelectorLan").selectedIndex].text;
    
    let fontSummary = /[\u0E00-\u0E7F]/.test(rawText) && /[a-zA-Z0-9]/.test(rawText) ?
    `ฟอนต์ไทย: ${tFont}\nฟอนต์อังกฤษ: ${eFont}` : `ฟอนต์: ${/[\u0E00-\u0E7F]/.test(rawText) ? tFont : eFont}`;

    document.getElementById("orderSummaryLan").value += `สายสกรีนเส้นที่ ${counts.lan}\nการ์ตูน: ${cartoonText}\nพิมพ์ชื่อ: ${rawText}\nสีสาย: ${bgName}\nสีอักษร: ${cName}\n${fontSummary}\n\n`;
    counts.lan++; document.getElementById("btnCounterLan").innerText = counts.lan; showToast("✨ เพิ่มรายการสำเร็จ!");
}

// ================= 2. ระบบสายคล้องแมสพิมพ์ลาย =================
const funColors = ["#f065a1", "#fba919", "#fae36c", "#a4cf57", "#4dc2f0", "#be8cbf"];
let customPrintColors = { text: "#FF0000", outline: "#FFFFFF", bg: "#F8BBD9" }, currentPrintTarget = 'text', hPrint = 0, sPrint = 100, vPrint = 100;

function resetAllPrintColors() { 
    document.getElementById("colorSelectorPrint").value = "FUN_COLORS"; 
    document.getElementById("bgSelectorPrint").value = "space.png"; 
    document.getElementById("toggleOutlinePrint").checked = false; 
    checkCustomPrintColor(); showToast("🔄 คืนค่าสีเริ่มต้นแล้ว");
}

function checkCustomPrintColor() {
    const textC = document.getElementById("colorSelectorPrint").value, bgC = document.getElementById("bgSelectorPrint").value;
    const outlineEnabled = document.getElementById("toggleOutlinePrint").checked, outlineC = document.getElementById("outlineColorSelectorPrint").value;
    
    document.getElementById("outlineRowPrint").style.display = outlineEnabled ? "flex" : "none";
    document.getElementById("btnTargetTextPrint").style.display = (textC === "CUSTOM") ? "block" : "none";
    document.getElementById("btnTargetOutlinePrint").style.display = (outlineEnabled && outlineC === "CUSTOM") ? "block" : "none";
    document.getElementById("btnTargetBgPrint").style.display = (bgC === "CUSTOM") ? "block" : "none";
    
    if (textC === "CUSTOM" || (outlineEnabled && outlineC === "CUSTOM") || bgC === "CUSTOM") { 
        document.getElementById("customPrintColorArea").style.display = "block"; syncPrintPickerToCustomColor();
    } else {
        document.getElementById("customPrintColorArea").style.display = "none";
    }
    updateAllPrint();
}

function setPrintPickerTarget(target, btn) { 
    currentPrintTarget = target; 
    document.querySelectorAll('#customPrintColorArea .target-btn').forEach(b => b.classList.remove('active')); 
    btn.classList.add('active'); syncPrintPickerToCustomColor();
}

function syncPrintPickerToCustomColor() { 
    let hsv = hexToHsv(customPrintColors[currentPrintTarget]); hPrint = hsv.h; sPrint = hsv.s; vPrint = hsv.v;
    document.getElementById('huePointerPrint').style.left = (hPrint / 360 * 100) + '%'; document.getElementById('svPointerPrint').style.left = sPrint + '%';
    document.getElementById('svPointerPrint').style.top = (100 - vPrint) + '%'; document.getElementById('svMapPrint').style.backgroundColor = `hsl(${hPrint},100%,50%)`; document.getElementById('hexValDisplayPrint').textContent = customPrintColors[currentPrintTarget];
}

function updateAllPrint() {
    const text = document.getElementById("textInputPrint").value || "PUNN";
    const thaiF = document.getElementById("thaiFontPrint").value, engF = document.getElementById("engFontPrint").value;
    const colorVal = document.getElementById("colorSelectorPrint").value, bgVal = document.getElementById("bgSelectorPrint").value;
    const outlineEnabled = document.getElementById("toggleOutlinePrint").checked, outlineVal = document.getElementById("outlineColorSelectorPrint").value;
    const sampleText = document.getElementById("sampleTextPrint"), sampleBox = document.getElementById("sampleBoxPrint");

    if (bgVal === "none") { sampleBox.style.backgroundImage = "none"; sampleBox.style.backgroundColor = "#e0e0e0"; }
    else if (bgVal === "CUSTOM") { sampleBox.style.backgroundImage = "none"; sampleBox.style.backgroundColor = customPrintColors.bg; }
    else { sampleBox.style.backgroundColor = "transparent"; sampleBox.style.backgroundImage = `url('https://raw.githubusercontent.com/sakulkarn93/petitefont/main/${bgVal}')`; }
    
    const lockedWhiteOutlines = ["BLACK_WHITE", "SKY", "CHASE", "RUBBLE", "ROCKY", "ZUMA", "EVEREST"];
    if (lockedWhiteOutlines.includes(colorVal)) { 
        sampleText.style.textShadow = `2px 2px 0 #FFFFFF, -2px -2px 0 #FFFFFF, 2px -2px 0 #FFFFFF, -2px 2px 0 #FFFFFF, 0px 2px 0 #FFFFFF, 0px -2px 0 #FFFFFF, 2px 0px 0 #FFFFFF, -2px 0px 0 #FFFFFF`;
    } else if (outlineEnabled) { 
        let oColor = (outlineVal === "CUSTOM") ? customPrintColors.outline : outlineVal; 
        sampleText.style.textShadow = `2px 2px 0 ${oColor}, -2px -2px 0 ${oColor}, 2px -2px 0 ${oColor}, -2px 2px 0 ${oColor}, 0px 2px 0 ${oColor}, 0px -2px 0 ${oColor}, 2px 0px 0 ${oColor}, -2px 0px 0 ${oColor}`;
    } else { sampleText.style.textShadow = "none"; }
    
    let html = "", colorIndex = 0;
    for (let char of text) {
        if (char === " ") { html += " "; continue; }
        let currentColor = "";
        if (colorVal === "none") currentColor = "#000000";
        else if (colorVal === "FUN_COLORS") { currentColor = funColors[colorIndex % funColors.length]; colorIndex++; }
        else if (colorVal === "BLACK_WHITE") currentColor = "#000000";
        else if (colorVal === "SKY") currentColor = "#f04898";
        else if (colorVal === "CHASE") currentColor = "#255dac";
        else if (colorVal === "RUBBLE") currentColor = "#aa6429";
        else if (colorVal === "ROCKY") currentColor = "#196f39";
        else if (colorVal === "ZUMA") currentColor = "#e95b2a";
        else if (colorVal === "EVEREST") currentColor = "#4f2e89";
        else if (colorVal === "CUSTOM") currentColor = customPrintColors.text;
        else currentColor = colorVal;
        html += `<span style="font-family: ${/[\u0E00-\u0E7F]/.test(char) ? thaiF : engF}; color: ${currentColor};">${char}</span>`;
    }
    sampleText.innerHTML = html;
    let fontSize = 70; sampleText.style.fontSize = fontSize + "px";
    while (sampleText.scrollWidth > sampleText.parentElement.clientWidth - 20 && fontSize > 10) { fontSize--; sampleText.style.fontSize = fontSize + "px"; }
}

function setupPrintPicker() {
    const hueElP = document.getElementById('hueSliderPrint'), svElP = document.getElementById('svMapPrint');
    const handleHP = (e) => { const rect = hueElP.getBoundingClientRect(); let x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
    hPrint = (Math.max(0, Math.min(x, rect.width)) / rect.width) * 360; document.getElementById('huePointerPrint').style.left = (Math.max(0, Math.min(x, rect.width)) / rect.width * 100) + '%';
    svElP.style.backgroundColor = `hsl(${hPrint},100%,50%)`; updateColP(); };
    const handleSVP = (e) => { const rect = svElP.getBoundingClientRect();
    let x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left, y = (e.touches ? e.touches[0].clientY : e.clientY) - rect.top;
    sPrint = (Math.max(0, Math.min(x, rect.width)) / rect.width) * 100; vPrint = 100 - (Math.max(0, Math.min(y, rect.height)) / rect.height) * 100;
    document.getElementById('svPointerPrint').style.left = (Math.max(0, Math.min(x, rect.width)) / rect.width * 100) + '%';
    document.getElementById('svPointerPrint').style.top = (Math.max(0, Math.min(y, rect.height)) / rect.height * 100) + '%'; updateColP(); };
    function updateColP() { customPrintColors[currentPrintTarget] = hsvToHex(hPrint, sPrint, vPrint); document.getElementById('hexValDisplayPrint').textContent = customPrintColors[currentPrintTarget]; updateAllPrint(); }
    
    hueElP.addEventListener('mousedown', e => { handleHP(e); window.addEventListener('mousemove', handleHP); });
    svElP.addEventListener('mousedown', e => { handleSVP(e); window.addEventListener('mousemove', handleSVP); });
    hueElP.addEventListener('touchstart', e => { handleHP(e); window.addEventListener('touchmove', handleHP); }, {passive:false});
    svElP.addEventListener('touchstart', e => { handleSVP(e); window.addEventListener('touchmove', handleSVP); }, {passive:false});
    window.addEventListener('mouseup', () => { window.removeEventListener('mousemove', handleHP); window.removeEventListener('mousemove', handleSVP); });
    window.addEventListener('touchend', () => { window.removeEventListener('touchmove', handleHP); window.removeEventListener('touchmove', handleSVP); });
}

function addToListPrint() {
    const rawText = document.getElementById("textInputPrint").value.trim();
    if (!rawText) { showToast("⚠️ กรุณาพิมพ์ชื่อที่ต้องการสกรีนด้วยค่ะ"); return; }

    const colorSelector = document.getElementById("colorSelectorPrint");
    let colorName = colorSelector.value === "CUSTOM" ? `เลือกเอง (${customPrintColors.text})` : colorSelector.options[colorSelector.selectedIndex].text;
    let bgName = document.getElementById("bgSelectorPrint").value === "CUSTOM" ? `พื้นหลังล้วน (${customPrintColors.bg})` : document.getElementById("bgSelectorPrint").options[document.getElementById("bgSelectorPrint").selectedIndex].text;
    let tFont = document.getElementById("thaiFontPrint").options[document.getElementById("thaiFontPrint").selectedIndex].text;
    let eFont = document.getElementById("engFontPrint").options[document.getElementById("engFontPrint").selectedIndex].text;
    let fontSummary = /[\u0E00-\u0E7F]/.test(rawText) && /[a-zA-Z0-9]/.test(rawText) ? `ฟอนต์ไทย: ${tFont}\nฟอนต์อังกฤษ: ${eFont}` : `ฟอนต์: ${/[\u0E00-\u0E7F]/.test(rawText) ? tFont : eFont}`;
    
    let outlineInfo = (["BLACK_WHITE", "SKY", "CHASE", "RUBBLE", "ROCKY", "ZUMA", "EVEREST"].includes(colorSelector.value)) ?
    "มีขอบ (สีขาว)" : (document.getElementById("toggleOutlinePrint").checked ? `มีขอบ (${document.getElementById("outlineColorSelectorPrint").value === "CUSTOM" ? customPrintColors.outline : document.getElementById("outlineColorSelectorPrint").options[document.getElementById("outlineColorSelectorPrint").selectedIndex].text})` : "ไม่มีขอบ");
    
    document.getElementById("orderSummaryPrint").value += `สายพิมพ์ลาย เส้นที่ ${counts.print}\nพิมพ์ชื่อ: ${rawText}\nลายสาย: ${bgName}\nสีอักษร: ${colorName}\nขอบอักษร: ${outlineInfo}\n${fontSummary}\n\n`;
    counts.print++; document.getElementById("btnCounterPrint").innerText = counts.print; showToast("✨ เพิ่มรายการสำเร็จ!");
}

// ================= 3. ระบบป้ายรองเท้า =================
function updateShoeTag() {
    const text = document.getElementById("textInputShoe").value || "PUNN";
    const thaiF = document.getElementById("thaiFontShoe").value, engF = document.getElementById("engFontShoe").value;
    const color = document.getElementById("tagColorShoe").value;
    const tagText = document.getElementById("shoeTagText"), tagBg = document.getElementById("shoeTagBg");
    
    if(color === 'white') tagBg.style.backgroundColor = '#ffffff'; 
    else if(color === 'black') tagBg.style.backgroundColor = '#1a1a1a';
    else tagBg.style.backgroundColor = '#e0e0e0';

    tagText.innerHTML = buildMixedFontHTML(text, thaiF, engF);
    let fontSize = 40; tagText.style.fontSize = fontSize + "px";
    while (tagText.scrollWidth > tagBg.clientWidth - 50 && fontSize > 10) { fontSize--; tagText.style.fontSize = fontSize + "px"; }
}

function addToListShoe() {
    const rawText = document.getElementById("textInputShoe").value.trim();
    const colorVal = document.getElementById("tagColorShoe").value;

    if (!rawText) { showToast("⚠️ กรุณาพิมพ์ชื่อด้วยค่ะ"); return; }
    if (colorVal === "none") { showToast("⚠️ กรุณาเลือกสีป้ายรองเท้าด้วยค่ะ"); return; }

    const thaiFontName = document.getElementById("thaiFontShoe").options[document.getElementById("thaiFontShoe").selectedIndex].text;
    const engFontName = document.getElementById("engFontShoe").options[document.getElementById("engFontShoe").selectedIndex].text;
    const colorName = document.getElementById("tagColorShoe").options[document.getElementById("tagColorShoe").selectedIndex].text;
    let fontSummary = /[\u0E00-\u0E7F]/.test(rawText) && /[a-zA-Z0-9]/.test(rawText) ? `ฟอนต์ไทย: ${thaiFontName}\nฟอนต์อังกฤษ: ${engFontName}` : `ฟอนต์: ${/[\u0E00-\u0E7F]/.test(rawText) ? thaiFontName : engFontName}`;
    
    document.getElementById("orderSummaryShoe").value += `ป้ายรองเท้า คู่ที่ ${counts.shoe}\nสีป้าย: ${colorName}\nพิมพ์ชื่อ: ${rawText}\n${fontSummary}\n\n`;
    counts.shoe++; document.getElementById("btnCounterShoe").innerText = counts.shoe; showToast("✨ เพิ่มรายการสำเร็จ!");
}

// ================= 4. ระบบเข็มกลัด =================
let cTargetBadge = 'ringBadge', hBadge = 330, sBadge = 24, vBadge = 97;
function initBadge() {
    if (document.getElementById('quickColorsBadge').innerHTML !== "") return;
    ['#FF0000', '#FFA500', '#FFD700', '#4CAF50', '#2196F3', '#9C27B0'].forEach(color => {
        let btn = document.createElement('div'); btn.className = 'quick-color'; btn.style.backgroundColor = color;
        btn.style.width = '100%'; btn.style.aspectRatio = '1'; btn.style.borderRadius = '6px'; btn.style.cursor = 'pointer'; btn.style.border = '1px solid #eaeaea';
        btn.onclick = () => applyQCBadge(color); document.getElementById('quickColorsBadge').appendChild(btn);
    });
    const hueEl = document.getElementById('hueSliderBadge'), svEl = document.getElementById('svMapBadge');
    const handleH = (e) => { const rect = hueEl.getBoundingClientRect(); let x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left; x = Math.max(0, Math.min(x, rect.width)); hBadge = (x / rect.width) * 360; document.getElementById('huePointerBadge').style.left = x + 'px'; svEl.style.backgroundColor = `hsl(${hBadge},100%,50%)`; updateColBadge(); };
    const handleSV = (e) => { const rect = svEl.getBoundingClientRect(); let x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left, y = (e.touches ? e.touches[0].clientY : e.clientY) - rect.top; x = Math.max(0, Math.min(x, rect.width)); y = Math.max(0, Math.min(y, rect.height)); sBadge = (x / rect.width) * 100; vBadge = 100 - (y / rect.height) * 100; document.getElementById('svPointerBadge').style.left = x + 'px'; document.getElementById('svPointerBadge').style.top = y + 'px'; updateColBadge(); };
    hueEl.addEventListener('mousedown', e => { handleH(e); window.addEventListener('mousemove', handleH); }); hueEl.addEventListener('touchstart', e => { handleH(e); window.addEventListener('touchmove', handleH); }, { passive: false });
    svEl.addEventListener('mousedown', e => { handleSV(e); window.addEventListener('mousemove', handleSV); }); svEl.addEventListener('touchstart', e => { handleSV(e); window.addEventListener('touchmove', handleSV); }, { passive: false });
    window.addEventListener('mouseup', () => { window.removeEventListener('mousemove', handleH); window.removeEventListener('mousemove', handleSV); }); window.addEventListener('touchend', () => { window.removeEventListener('touchmove', handleH); window.removeEventListener('touchmove', handleSV); });
    updateBadge();
}
function resetBadgeColors() { document.getElementById('ringBadge').style.backgroundColor = '#f8bbd9'; document.getElementById('bgBadge').style.backgroundColor = '#ffffff'; document.getElementById('badgeText').style.color = '#000000'; updatePickFromElBadge(); showToast("🔄 คืนค่าสีเริ่มต้นแล้ว"); }
function setTargetBadge(id, btn) { cTargetBadge = id; document.querySelectorAll('#page-badge .target-btn').forEach(b => b.classList.remove('active')); btn.classList.add('active'); updatePickFromElBadge(); }
function applyQCBadge(hex) { let hsv = hexToHsv(hex); hBadge = hsv.h; sBadge = hsv.s; vBadge = hsv.v; document.getElementById('huePointerBadge').style.left = (hBadge / 360) * 100 + '%'; document.getElementById('svPointerBadge').style.left = sBadge + '%'; document.getElementById('svPointerBadge').style.top = (100 - vBadge) + '%'; document.getElementById('svMapBadge').style.backgroundColor = `hsl(${hBadge}, 100%, 50%)`; updateColBadge(); }
function updateColBadge() { const color = hsvToHex(hBadge, sBadge, vBadge); document.getElementById('hexValBadge').textContent = color; const el = document.getElementById(cTargetBadge); if (cTargetBadge === 'badgeText') el.style.color = color; else el.style.backgroundColor = color; }
function updatePickFromElBadge() { const el = document.getElementById(cTargetBadge); const color = cTargetBadge === 'badgeText' ? el.style.color : el.style.backgroundColor; const hsv = hexToHsv(rgbToHex(color)); hBadge = hsv.h; sBadge = hsv.s; vBadge = hsv.v; document.getElementById('huePointerBadge').style.left = (hBadge / 360 * 100) + '%'; document.getElementById('svPointerBadge').style.left = sBadge + '%'; document.getElementById('svPointerBadge').style.top = (100 - vBadge) + '%'; document.getElementById('svMapBadge').style.backgroundColor = `hsl(${hBadge}, 100%, 50%)`; document.getElementById('hexValBadge').textContent = hsvToHex(hBadge, sBadge, vBadge); }
function updateBadge() { 
    let cartoonImg = document.getElementById("cartoonSelectorBadge").value;
    document.getElementById("badgeCartoon").src = `https://raw.githubusercontent.com/sakulkarn93/petitefont/main/${cartoonImg}.png`; 
    const displayText = document.getElementById("textInputBadge").value || "NAME"; 
    document.getElementById("badgeText").innerHTML = buildMixedFontHTML(displayText, document.getElementById("thaiFontSelectorBadge").value, document.getElementById("engFontSelectorBadge").value); 
}

function addToListBadge() {
    const rawText = document.getElementById("textInputBadge").value.trim();
    if (!rawText) { showToast("⚠️ กรุณาพิมพ์ชื่อด้วยค่ะ"); return; }

    const ringColor = rgbToHex(document.getElementById('ringBadge').style.backgroundColor || 'rgb(248, 187, 217)');
    const bgColor = rgbToHex(document.getElementById('bgBadge').style.backgroundColor || 'rgb(255, 255, 255)');
    const textColor = rgbToHex(document.getElementById('badgeText').style.color || 'rgb(0, 0, 0)');
    let fontSummary = /[\u0E00-\u0E7F]/.test(rawText) && /[a-zA-Z0-9]/.test(rawText) ? `ฟอนต์ไทย: ${document.getElementById("thaiFontSelectorBadge").options[document.getElementById("thaiFontSelectorBadge").selectedIndex].text}\nฟอนต์อังกฤษ: ${document.getElementById("engFontSelectorBadge").options[document.getElementById("engFontSelectorBadge").selectedIndex].text}` : `ฟอนต์: ${/[\u0E00-\u0E7F]/.test(rawText) ? document.getElementById("thaiFontSelectorBadge").options[document.getElementById("thaiFontSelectorBadge").selectedIndex].text : document.getElementById("engFontSelectorBadge").options[document.getElementById("engFontSelectorBadge").selectedIndex].text}`;
    
    document.getElementById("orderSummaryBadge").value += `เข็มกลัด ชิ้นที่ ${counts.badge}\nลาย: ${document.getElementById("cartoonSelectorBadge").options[document.getElementById("cartoonSelectorBadge").selectedIndex].text}\nพิมพ์ชื่อ: ${rawText}\nสีวงขอบ: ${ringColor}\nสีพื้นหลัง: ${bgColor}\nสีอักษร: ${textColor}\n${fontSummary}\n\n`;
    counts.badge++; document.getElementById("btnCounterBadge").innerText = counts.badge; showToast("✨ เพิ่มรายการสำเร็จ!");
}

// ================= 5. ใบสรุปออเดอร์ =================
function generateOrderSummary() {
    const summaryBox = document.getElementById('summary-content');
    if(!summaryBox) return;

    let allOrders = "";
    
    // ดึงข้อมูลจากกล่อง Textarea ที่ลูกค้ายืนยันมาแล้ว
    const lan = document.getElementById('orderSummaryLan')?.value.trim() || "";
    const print = document.getElementById('orderSummaryPrint')?.value.trim() || "";
    const shoe = document.getElementById('orderSummaryShoe')?.value.trim() || "";
    const badge = document.getElementById('orderSummaryBadge')?.value.trim() || "";

    // นำมาต่อกันด้วยข้อความธรรมดา เพื่อให้แก้ไขและก๊อปปี้ลง LINE ได้สวยๆ
    if(lan) allOrders += "--- [ สายคล้องแมสสกรีนชื่อ ] ---\n" + lan + "\n";
    if(print) allOrders += "--- [ สายพิมพ์ลาย ] ---\n" + print + "\n";
    if(shoe) allOrders += "--- [ ป้ายรองเท้า ] ---\n" + shoe + "\n";
    if(badge) allOrders += "--- [ เข็มกลัด ] ---\n" + badge + "\n";

    if(allOrders === "") {
        summaryBox.value = "ยังไม่มีรายการสั่งทำค่ะ\nกรุณาเลือกสินค้าและกดปุ่ม 'ยืนยันแบบ' ก่อนนะคะ";
    } else {
        summaryBox.value = allOrders;
    }
}

function copyOrderSummary() {
    const summaryBox = document.getElementById('summary-content');
    if (!summaryBox || summaryBox.value.includes('ยังไม่มีรายการสั่งทำ')) {
        showToast('⚠️ ไม่มีข้อมูลให้คัดลอกค่ะ');
        return;
    }
    
    // ระบบก๊อปปี้ข้อมูลสำหรับกล่อง Textarea
    summaryBox.select(); 
    summaryBox.setSelectionRange(0, 99999);
    try { 
        document.execCommand("copy"); 
        showToast('📋 คัดลอกใบสรุปลง Clipboard แล้วค่ะ!'); 
    } catch(e) { 
        showToast("⚠️ กดค้างที่ข้อความเพื่อก๊อปปี้แทนนะคะ"); 
    }
}

// ================= ระบบสไลเดอร์เลื่อนอัตโนมัติ =================
function initBannerSlider() {
    const slider = document.getElementById('homeBannerSlider');
    const dots = document.querySelectorAll('#homeSliderDots .dot');
    if(!slider) return;

    let currentIndex = 0;
    const totalSlides = dots.length;

    // ระบบจุด (Dots) เปลี่ยนสีตามภาพที่ลูกค้าปัด
    slider.addEventListener('scroll', () => {
        let index = Math.round(slider.scrollLeft / slider.clientWidth);
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });
        currentIndex = index;
    });

    // เลื่อนอัตโนมัติทุกๆ 3 วินาที (3000 มิลลิวินาที)
    setInterval(() => {
        currentIndex++;
        if (currentIndex >= totalSlides) {
            currentIndex = 0;
        }
        slider.scrollTo({
            left: currentIndex * slider.clientWidth,
            behavior: 'smooth'
        });
    }, 3000); 
}

// ================= โหลดครั้งแรกตอนเปิดหน้าเว็บ =================
window.onload = function() { 
    setupPrintPicker(); 
    resetAllPrintColors(); 
    updateShoeTag(); 
    updateAllLanyard(); 
    initBadge(); 
    initBannerSlider(); // <--- สั่งให้สไลเดอร์เริ่มทำงานตรงนี้
};

// Fix iOS เลื่อนทะลุ
(function() {
    var pickerSelectors = ['.sv-map', '.hue-slider']; var isDraggingPicker = false;
    document.addEventListener('touchstart', function(e) { var el = e.target; isDraggingPicker = pickerSelectors.some(function(sel) { return el.closest ? el.closest(sel) : false; }); }, { passive: true });
    document.addEventListener('touchmove', function(e) { if (!isDraggingPicker) return; }, { passive: true });
})();
