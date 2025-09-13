// 🟣 إعداد خط Tajawal كخط افتراضي في Tailwind
window.tailwind = window.tailwind || {};
tailwind.config = {
  theme: {
    extend: {
      fontFamily: {
        sans: ['Tajawal','system-ui','-apple-system','Segoe UI','Roboto','Arial','sans-serif']
      }
    }
  }
};

// 🟣 تبديل الوضع الداكن/الفاتح (زر id="darkModeBtn")
function toggleDarkMode() {
  const body = document.body;
  const btn  = document.getElementById("darkModeBtn");
  const now  = body.getAttribute("data-theme");

  if (now === "dark-navy") {
    body.setAttribute("data-theme", "dev-elegant");
    if (btn) btn.textContent = "🌙";
  } else {
    body.setAttribute("data-theme", "dark-navy");
    if (btn) btn.textContent = "☀️";
  }
}

// 🟣 تكرار النص في الشريط المتحرك
document.querySelectorAll('.outer').forEach(el => {
  const content = el.querySelector('.content');
  if (!content) return;
  repeatContent(content, el.offsetWidth);
  const slider = el.querySelector('.loop');
  if (slider) slider.innerHTML = slider.innerHTML + slider.innerHTML;
});

function repeatContent(el, till) {
  const html = el.innerHTML;
  let counter = 0;
  while (el.offsetWidth < till && counter < 100) {
    el.innerHTML += html;
    counter++;
  }
}
document.addEventListener("DOMContentLoaded", () => {
  const VISIBLE_COUNT = 2; // ✨ يعرض صورتين فقط بالبداية
  const items       = Array.from(document.querySelectorAll(".portfolio__item"));
  const loadMoreBtn = document.getElementById("loadMore");
  const tabs        = Array.from(document.querySelectorAll(".filter-tabs a"));

  // 💫 أنيميشن ظهور العناصر
  items.forEach((item, index) => {
    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setTimeout(() => item.classList.add("show"), index * 120);
          io.unobserve(item);
        }
      });
    }, { threshold: 0.15 });
    io.observe(item);
  });

  // تمييز الصور الطولية
  document.querySelectorAll(".portfolio__item img").forEach(img => {
    const mark = im => {
      if (im.naturalHeight > im.naturalWidth) {
        im.closest(".portfolio__item")?.classList.add("is-portrait");
      }
    };
    img.complete ? mark(img) : img.addEventListener("load", () => mark(img));
  });

  // توزيع يمين/يسار للعناصر المرئية
  function applyZigzag() {
    const visible = items.filter(el =>
      el.style.display !== "none" && !el.classList.contains("hidden")
    );
    visible.forEach((el, i) => {
      el.classList.remove("left","right");
      el.classList.add(i % 2 === 0 ? "right" : "left");
    });
  }

  // 🟣 فلترة التبويبات
  function applyFilter(filter, scrollIntoView = false) {
    // اخفي الكل
    items.forEach(it => { it.style.display = "none"; it.classList.remove("show"); });

    // طلع المطابق للفلاتر
    const matching = items.filter(it => filter === "all" || it.classList.contains(filter));
    matching.forEach(it => { it.style.display = ""; });

    // ✨ اعرض أول صورتين فقط، والباقي مخفي
    matching.forEach((it, idx) => {
      if (idx < VISIBLE_COUNT) {
        it.classList.remove("hidden");
      } else {
        it.classList.add("hidden");
      }
    });
// خلي الزر دايمًا ظاهر – وفعّليه/عطّليه حسب الحاجة
if (loadMoreBtn) {
  loadMoreBtn.style.display = "";            // 👈 دايمًا ظاهر
  loadMoreBtn.disabled = matching.length <= VISIBLE_COUNT;  // عطّله لو ما فيه مزيد
  loadMoreBtn.classList.toggle('is-disabled', loadMoreBtn.disabled);
}

    // مرر لأول عنصر
    if (scrollIntoView && matching[0]) {
      matching[0].scrollIntoView({ behavior: "smooth", block: "center" });
    }

    // وزّع يمين/يسار
    setTimeout(applyZigzag, 0);
  }

  // تغيير التبويب
  function setActiveTab(a) {
    tabs.forEach(t => t.classList.remove("active"));
    a.classList.add("active");
  }

  // أحداث التبويبات
  tabs.forEach(a => {
    a.addEventListener("click", e => {
      e.preventDefault();
      setActiveTab(a);
      applyFilter(a.dataset.filter, true);
    });
  });

  // زر "عرض المزيد"
  if (loadMoreBtn) {
    loadMoreBtn.addEventListener("click", () => {
      const active = document.querySelector(".filter-tabs a.active");
      if (!active) return;
      const filter = active.dataset.filter;
      document.querySelectorAll(`.portfolio__item.${filter}.hidden`)
        .forEach(el => el.classList.remove("hidden"));
      loadMoreBtn.style.display = "none";
      setTimeout(applyZigzag, 0);
    });
  }

  // التبويب الافتراضي
  const defaultActive = document.querySelector(".filter-tabs a.active") || tabs[0];
  if (defaultActive) {
    setActiveTab(defaultActive);
    applyFilter(defaultActive.dataset.filter);
  }
});





document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "visible") {
    // شيل transition مؤقتاً
    document.querySelectorAll(".portfolio__overlay").forEach(el => {
      el.style.transition = "none";
      // رجع transition بعد لحظة صغيرة
      setTimeout(() => {
        el.style.transition = "opacity .3s ease, visibility .3s ease";
      }, 50);
    });
  }
});

document.addEventListener("DOMContentLoaded", function () {
  const items = document.querySelectorAll(".portfolio__item");

  items.forEach(item => {
    item.addEventListener("click", function (e) {
      // إذا ضغط على زر أو رابط جوه الكرت، ما يلغي الرابط
      if (e.target.tagName.toLowerCase() === "a" || e.target.closest("a")) {
        return;
      }

      // يشيل active من كل العناصر
      items.forEach(i => i.classList.remove("active"));

      // يضيف active للعنصر المضغوط
      item.classList.add("active");
    });
  });
});
document.querySelectorAll('.portfolio__item').forEach(item => {
  const overlay = item.querySelector('.portfolio__overlay');

  // أول ضغطة: يظهر الظل
  item.addEventListener('click', function (e) {
    // لو الظل ظاهر بالفعل → ينقل للبيج
    if (item.classList.contains('show-overlay')) {
      window.location.href = "page.html"; 
    } else {
      e.preventDefault(); // منع النقل المباشر
      item.classList.add('show-overlay');
    }
  });

  // لو ضغط على أي مكان بالظل → ينقل
  if (overlay) {
    overlay.addEventListener('click', function () {
      window.location.href = "page.html";
    });
  }
});
document.querySelectorAll('.portfolio__item').forEach(item => {
  const overlay = item.querySelector('.portfolio__overlay');

  // أول ضغطة: يظهر الظل
  item.addEventListener('click', function (e) {
    // لو الظل ظاهر بالفعل → ينقل للبيج
    if (item.classList.contains('show-overlay')) {
      window.location.href = "page.html"; 
    } else {
      e.preventDefault(); // منع النقل المباشر
      item.classList.add('show-overlay');
    }
  });

  // لو ضغط على أي مكان بالظل → ينقل
  if (overlay) {
    overlay.addEventListener('click', function () {
      window.location.href = "page.html";
    });
  }
});