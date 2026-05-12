// ================= ระบบเปลี่ยนหน้าแบบ SPA =================
function MapsTo(pageId) {
    // ซ่อนทุกหน้า
    document.querySelectorAll('.app-page').forEach(page => {
        page.classList.remove('active-page');
    });
    
    // โชว์หน้าที่เลือก
    const targetPage = document.getElementById(pageId);
    if(targetPage) {
        targetPage.classList.add('active-page');
        
        // เลื่อนจอขึ้นบนสุด
        const wrapper = document.querySelector('.wrapper');
        if (wrapper) wrapper.scrollTop = 0;
        
        // ถ้ากดกลับมาหน้าแรก ให้ปรับไฟเมนูด้านล่างให้ถูกอันอัตโนมัติ
        if(pageId === 'page-home') {
            const firstNav = document.querySelector('.bottom-nav .nav-item:first-child');
            updateNav(firstNav);
        }
    }
}

// ================= ระบบเปลี่ยนสีเมนูด้านล่าง (Active) =================
function updateNav(element) {
    document.querySelectorAll('.bottom-nav .nav-item').forEach(item => {
        item.classList.remove('active');
    });
    element.classList.add('active');
}

// ================= ระบบแจ้งเตือน (Toast) =================
function showToast(msg) {
    const t = document.getElementById("toast");
    t.innerHTML = msg; 
    t.className = "show";
    setTimeout(() => t.className = "", 2500);
}
