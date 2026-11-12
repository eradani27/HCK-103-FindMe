// ========================================
// 1. STATE UTAMA: ARRAY OF OBJECTS
// ========================================

let missingPersons = [
  {
    id: 6,
    name: "Suparti Wulandari",
    age: "72",
    hair: "Rambut putih disanggul",
    heightWeight: "150 cm, 45 kg",
    lastSeenDate: "2026-11-02",
    lastSeenPlace: "Stasiun Manggarai, Jakarta Selatan",
    clothes: "daster batik cokelat dan sandal jepit",
    contact: "081200000142",
    status: "missing",
    imageUrl: "",
  },
  {
    id: 5,
    name: "Bagas Aditya",
    age: "16",
    hair: "Rambut ikal pendek",
    heightWeight: "165 cm, 52 kg",
    lastSeenDate: "2026-10-28",
    lastSeenPlace: "Terminal Kampung Rambutan, Jakarta Timur",
    clothes: "seragam SMA dan tas ransel hitam",
    contact: "081300000187",
    status: "missing",
    imageUrl: "",
  },
  {
    id: 4,
    name: "Dewi Anggraeni",
    age: "34",
    hair: "Rambut lurus sebahu",
    heightWeight: "158 cm, 50 kg",
    lastSeenDate: "2026-10-15",
    lastSeenPlace: "Jl. Margonda Raya, Depok",
    clothes: "kemeja biru dongker dan celana hitam",
    contact: "085700000119",
    status: "missing",
    imageUrl: "",
  },
  {
    id: 1,
    name: "Selene Johnson",
    age: "57",
    hair: "Rambut pendek",
    heightWeight: "193 cm, 57 kg",
    lastSeenDate: "2024-08-20",
    lastSeenPlace: "Jl. Contoh Raya, Jakarta Barat",
    clothes: "sweter putih dan jeans",
    contact: "081234567890",
    status: "missing",
    imageUrl:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400",
  },
  {
    id: 3,
    name: "Hartono Wijaya",
    age: "65",
    hair: "Beruban, botak tengah",
    heightWeight: "168 cm, 70 kg",
    lastSeenDate: "2026-10-05",
    lastSeenPlace: "Pasar Baru, Jakarta Pusat",
    clothes: "kemeja putih dan peci hitam",
    contact: "087800000133",
    status: "found",
    imageUrl: "",
  },
  {
    id: 2,
    name: "Rizki Maulana",
    age: "23",
    hair: "Rambut cepak",
    heightWeight: "172 cm, 68 kg",
    lastSeenDate: "2026-09-30",
    lastSeenPlace: "Alun-alun Kota Bogor",
    clothes: "jaket parasut hijau dan helm hitam",
    contact: "082100000165",
    status: "found",
    imageUrl: "",
  },
];

let featuredId = 6;
let targetDeleteId = null;
let editingId = null;
let currentFilter = "all";
let noticeTimer = null;

// ========================================
// 2. MENGAMBIL ELEMEN DOM
// ========================================

const listView = document.getElementById("beranda");
const formView = document.getElementById("form-view");

const hero = document.getElementById("hero");
const missingSection = document.getElementById("missing-section");
const missingGrid = document.getElementById("missing-grid");
const foundSection = document.getElementById("found-section");
const foundGrid = document.getElementById("found-grid");
const notice = document.getElementById("notice");

const personForm = document.getElementById("person-form");
const formTitle = document.getElementById("form-title");
const formError = document.getElementById("form-error");
const btnSaveForm = document.getElementById("btn-save-form");

const filterButtons = document.querySelectorAll(".filter-btn");
const navLinks = document.querySelectorAll(".nav-link");

const fields = {
  name: document.getElementById("input-name"),
  age: document.getElementById("input-age"),
  hair: document.getElementById("input-hair"),
  heightWeight: document.getElementById("input-hw"),
  lastSeenDate: document.getElementById("input-date"),
  lastSeenPlace: document.getElementById("input-place"),
  clothes: document.getElementById("input-clothes"),
  contact: document.getElementById("input-contact"),
  imageUrl: document.getElementById("input-image"),
};

// ========================================
// 3. FUNGSI PENGAMAN INPUT
// ========================================

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, (char) => {
    const entities = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };

    return entities[char];
  });
}

function getSafeImageUrl(url) {
  if (!url) return "";
  if (
    url.startsWith("data:image/") ||
    url.startsWith("http://") ||
    url.startsWith("https://")
  ) {
    return escapeHTML(url);
  }
  return "";
}

// ========================================
// 4. FUNGSI TANGGAL
// ========================================

const MONTH_NAMES = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];

function formatDate(isoDate) {
  const [year, month, day] = isoDate.split("-").map(Number);

  return `${day} ${MONTH_NAMES[month - 1]} ${year}`;
}

function getTodayIso() {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");

  return `${now.getFullYear()}-${month}-${day}`;
}

function getSearchDay(isoDate) {
  const [year, month, day] = isoDate.split("-").map(Number);
  const start = new Date(year, month - 1, day);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  return Math.round((today - start) / 86400000) + 1;
}

// ========================================
// 5. FOTO & SILUET
// ========================================

function placeholderHTML(isLarge) {
  return `
    <svg viewBox="0 0 200 220" aria-hidden="true">
      <circle cx="100" cy="82" r="46"></circle>
      <path d="M16 220c0-62 38-96 84-96s84 34 84 96z"></path>
    </svg>
    ${isLarge ? '<span class="photo-label">Belum ada foto</span>' : ""}
  `;
}

function photoHTML(person, isLarge) {
  const safeImage = getSafeImageUrl(person.imageUrl);
  const sizeClass = isLarge ? "hero-photo" : "card-photo";
  const content = safeImage
    ? `<img class="person-photo" src="${safeImage}" alt="Foto ${escapeHTML(person.name)}">`
    : placeholderHTML(isLarge);

  return `<div class="photo-frame ${sizeClass}">${content}</div>`;
}

document.addEventListener(
  "error",
  function (e) {
    if (e.target.classList && e.target.classList.contains("person-photo")) {
      const frame = e.target.closest(".photo-frame");

      frame.innerHTML = placeholderHTML(frame.classList.contains("hero-photo"));
    }
  },
  true,
);

// ========================================
// 6. TAMPILAN SOROTAN & KARTU
// ========================================

function heroHTML(person) {
  const safeName = escapeHTML(person.name);
  const firstName = escapeHTML(person.name.split(" ")[0]);

  return `
    <div class="hero-inner">
      ${photoHTML(person, true)}

      <div class="hero-text">
        <span class="day-badge">Hari ke-${getSearchDay(person.lastSeenDate)} pencarian</span>

        <h2>Bantu temukan ${firstName}.</h2>

        <p class="hero-story">
          ${safeName}, ${escapeHTML(person.age)} tahun, terakhir terlihat
          ${formatDate(person.lastSeenDate)} di ${escapeHTML(person.lastSeenPlace)},
          memakai ${escapeHTML(person.clothes)}.
        </p>

        <p class="hero-traits">
          ${escapeHTML(person.hair)}. Tinggi dan berat ${escapeHTML(person.heightWeight)}.
        </p>

        <div class="hero-contact">
          <span>Punya informasi? Hubungi</span>
          <strong>${escapeHTML(person.contact)}</strong>
        </div>

        <div class="hero-actions">
          <button type="button" class="btn btn-dark" data-action="toggle" data-id="${person.id}">
            Tandai Ditemukan
          </button>
          <button type="button" class="btn btn-ghost" data-action="edit" data-id="${person.id}">
            Edit
          </button>
        </div>
      </div>
    </div>
  `;
}

function missingCardHTML(person) {
  const safeName = escapeHTML(person.name);

  return `
    <article class="person-card">
      <div class="person-summary">
        ${photoHTML(person, false)}

        <div class="person-text">
          <h4>${safeName}</h4>
          <p>${escapeHTML(person.age)} tahun, ${escapeHTML(person.hair)}</p>
          <p>
            <strong class="day-count">Hari ke-${getSearchDay(person.lastSeenDate)}.</strong>
            Terakhir di ${escapeHTML(person.lastSeenPlace)}
          </p>
          <p class="person-contact">${escapeHTML(person.contact)}</p>
        </div>
      </div>

      <div class="card-actions">
        <button type="button" class="btn btn-small btn-primary" data-action="feature" data-id="${person.id}" aria-label="Lihat detail ${safeName}">
          Lihat Detail
        </button>
        <button type="button" class="btn btn-small" data-action="edit" data-id="${person.id}" aria-label="Edit data ${safeName}">
          Edit
        </button>
        <button type="button" class="btn btn-small btn-dark" data-action="toggle" data-id="${person.id}" aria-label="Tandai ${safeName} ditemukan">
          Tandai Ditemukan
        </button>
      </div>
    </article>
  `;
}

function foundCardHTML(person) {
  const safeName = escapeHTML(person.name);
  const confirmBox =
    targetDeleteId === person.id
      ? `
        <div class="confirm-box" role="alert">
          <p>Hapus data ${safeName} dari daftar? Data yang dihapus tidak bisa dikembalikan.</p>
          <div class="confirm-actions">
            <button type="button" class="btn btn-small" data-action="cancel-delete" data-id="${person.id}">
              Batal
            </button>
            <button type="button" class="btn btn-small btn-primary" data-action="confirm-delete" data-id="${person.id}">
              Ya, Hapus Data
            </button>
          </div>
        </div>
      `
      : "";

  return `
    <article class="person-card found">
      <div class="person-summary">
        ${photoHTML(person, false)}

        <div class="person-text">
          <span class="found-badge">&#10003; Telah Ditemukan</span>
          <h4>${safeName}</h4>
          <p>
            ${escapeHTML(person.age)} tahun. Hilang sejak
            ${formatDate(person.lastSeenDate)} di ${escapeHTML(person.lastSeenPlace)}
          </p>
        </div>
      </div>

      <div class="card-actions">
        <button type="button" class="btn btn-small" data-action="toggle" data-id="${person.id}" aria-label="Ubah ${safeName} menjadi masih hilang">
          Ubah Masih Hilang
        </button>
        <button type="button" class="btn btn-small" data-action="edit" data-id="${person.id}" aria-label="Edit data ${safeName}">
          Edit
        </button>
        <button type="button" class="btn btn-small btn-primary" data-action="ask-delete" data-id="${person.id}" aria-label="Hapus data ${safeName}">
          Hapus
        </button>
      </div>

      ${confirmBox}
    </article>
  `;
}

// ========================================
// 7. RENDER HALAMAN
// ========================================

function render() {
  const allMissing = missingPersons.filter((p) => p.status === "missing");
  const allFound = missingPersons.filter((p) => p.status === "found");

  const featured =
    allMissing.find((p) => p.id === featuredId) || allMissing[0] || null;

  const heroAllowed = currentFilter !== "found";
  const showHero = heroAllowed && featured !== null;

  const missingShown = currentFilter === "found" ? [] : allMissing;
  const foundShown = currentFilter === "missing" ? [] : allFound;

  const missingCards = missingShown.filter(
    (p) => !(showHero && p.id === featured.id),
  );

  if (showHero) {
    hero.innerHTML = heroHTML(featured);
  } else if (heroAllowed) {
    const message =
      missingPersons.length === 0
        ? "Belum ada data orang hilang."
        : "Semua orang di daftar sudah ditemukan.";

    hero.innerHTML = `<p class="hero-message">${message}</p>`;
  } else {
    hero.innerHTML = "";
  }

  hero.classList.toggle("hidden", !heroAllowed);

  missingGrid.innerHTML = missingCards.map(missingCardHTML).join("");
  foundGrid.innerHTML = foundShown.map(foundCardHTML).join("");

  missingSection.classList.toggle("hidden", missingCards.length === 0);
  foundSection.classList.toggle("hidden", foundShown.length === 0);

  document.querySelector('[data-count="all"]').textContent =
    missingPersons.length;
  document.querySelector('[data-count="missing"]').textContent =
    allMissing.length;
  document.querySelector('[data-count="found"]').textContent = allFound.length;
}

// ========================================
// 8. PESAN SINGKAT
// ========================================

function showNotice(message) {
  clearTimeout(noticeTimer);

  notice.textContent = message;

  noticeTimer = setTimeout(function () {
    notice.textContent = "";
  }, 4000);
}

// ========================================
// 9. FORMULIR TAMBAH & EDIT
// ========================================

function openForm(person) {
  editingId = person ? person.id : null;
  targetDeleteId = null;

  formTitle.textContent = person
    ? "Edit Data Orang Hilang"
    : "Tambah Data Orang Hilang";
  btnSaveForm.textContent = person
    ? "Simpan Perubahan"
    : "Simpan & Publikasikan";

  Object.keys(fields).forEach((key) => {
    if (key === "imageUrl") {
      fields[key].value = ""; // Reset input file
    } else {
      fields[key].value = person ? person[key] : "";
    }
  });

  fields.lastSeenDate.max = getTodayIso();
  formError.textContent = "";

  listView.classList.add("hidden");
  formView.classList.remove("hidden");

  window.scrollTo(0, 0);
  fields.name.focus();
}

function closeForm() {
  editingId = null;
  personForm.reset();
  formError.textContent = "";

  formView.classList.add("hidden");
  listView.classList.remove("hidden");

  render();
}

function validateForm(data) {
  const requiredFields = [
    ["name", "nama lengkap"],
    ["age", "usia"],
    ["hair", "ciri rambut"],
    ["heightWeight", "tinggi dan berat badan"],
    ["lastSeenDate", "tanggal terakhir terlihat"],
    ["lastSeenPlace", "lokasi terakhir terlihat"],
    ["clothes", "pakaian saat itu"],
    ["contact", "nomor kontak"],
  ];

  const emptyField = requiredFields.find(([key]) => !data[key]);

  if (emptyField) {
    return `Isi ${emptyField[1]} dulu, lalu simpan lagi.`;
  }

  const age = Number(data.age);

  if (!Number.isInteger(age) || age < 0 || age > 120) {
    return "Isi usia dengan angka bulat dari 0 sampai 120.";
  }

  if (data.lastSeenDate > getTodayIso()) {
    return "Tanggal terakhir terlihat tidak boleh setelah hari ini.";
  }

  // Validasi nomor telepon: hanya angka & maksimal 13 digit
  const phoneRegex = /^[0-9]+$/;
  if (!phoneRegex.test(data.contact)) {
    return "Nomor kontak / telepon harus berupa angka saja (tidak boleh ada huruf atau simbol).";
  }

  if (data.contact.length > 13) {
    return "Nomor kontak / telepon maksimal 13 digit.";
  }

  return "";
}

// Mencegah input huruf/simbol dan membatasi 13 digit secara real-time pada nomor kontak
fields.contact.addEventListener("input", function () {
  this.value = this.value.replace(/[^0-9]/g, "").slice(0, 13);
});

personForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const data = {};

  Object.keys(fields).forEach((key) => {
    if (key !== "imageUrl") {
      data[key] = fields[key].value.trim();
    }
  });

  const errorMessage = validateForm(data);

  if (errorMessage) {
    formError.textContent = errorMessage;
    return;
  }

  const fileInput = fields.imageUrl;
  const processSave = (imageUrl) => {
    if (editingId === null) {
      const newPerson = {
        ...data,
        imageUrl,
        id: Date.now(),
        status: "missing",
      };

      missingPersons.unshift(newPerson);
      featuredId = newPerson.id;

      setFilter("all");

      showNotice(`Data ${data.name} sudah ditambahkan dan kini disorot.`);
    } else {
      missingPersons = missingPersons.map((person) => {
        if (person.id === editingId) {
          return {
            ...person,
            ...data,
            imageUrl: imageUrl !== "" ? imageUrl : person.imageUrl,
          };
        }
        return person;
      });

      showNotice(`Perubahan data ${data.name} sudah disimpan.`);
    }

    closeForm();
    window.scrollTo(0, 0);
  };

  if (fileInput.files && fileInput.files[0]) {
    const reader = new FileReader();
    reader.onload = function (event) {
      processSave(event.target.result);
    };
    reader.readAsDataURL(fileInput.files[0]);
  } else {
    processSave("");
  }
});

document.getElementById("btn-open-form").addEventListener("click", function () {
  openForm(null);
});

document.getElementById("btn-back").addEventListener("click", closeForm);
document.getElementById("btn-cancel-form").addEventListener("click", closeForm);

// ========================================
// 10. AKSI PADA KARTU & SOROTAN
// ========================================

const actions = {
  feature(person) {
    featuredId = person.id;
    targetDeleteId = null;
    render();
    window.scrollTo(0, 0);
  },

  edit(person) {
    openForm(person);
  },

  toggle(person) {
    const isFound = person.status === "found";

    person.status = isFound ? "missing" : "found";
    targetDeleteId = null;
    render();

    showNotice(
      isFound
        ? `${person.name} kembali ditandai masih hilang.`
        : `${person.name} ditandai telah ditemukan.`,
    );
  },

  "ask-delete"(person) {
    targetDeleteId = person.id;
    render();
  },

  "cancel-delete"() {
    targetDeleteId = null;
    render();
  },

  "confirm-delete"(person) {
    missingPersons = missingPersons.filter((p) => p.id !== person.id);
    targetDeleteId = null;
    render();

    showNotice(`Data ${person.name} sudah dihapus.`);
  },
};

listView.addEventListener("click", function (e) {
  const button = e.target.closest("[data-action]");

  if (!button) {
    return;
  }

  const person = missingPersons.find((p) => p.id === Number(button.dataset.id));

  if (person) {
    actions[button.dataset.action](person);
  }
});


// ========================================
// 11. FILTER
// ========================================

function setFilter(filter) {
  currentFilter = filter;
  targetDeleteId = null;

  filterButtons.forEach((button) => {
    const isActive = button.dataset.filter === filter;

    button.classList.toggle("active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });
}

filterButtons.forEach((button) => {
  button.addEventListener("click", function () {
    setFilter(this.dataset.filter);
    render();
  });
});

// ========================================
// 12. NAVBAR NAVIGATION
// ========================================

navLinks.forEach((link) => {
  link.addEventListener("click", function () {
    if (!formView.classList.contains("hidden")) {
      closeForm();
    }

    navLinks.forEach((nav) => {
      nav.classList.remove("active");
    });

    this.classList.add("active");
  });
});

// ========================================
// 13. TOMBOL ESC
// ========================================

document.addEventListener("keydown", function (e) {
  if (e.key !== "Escape") {
    return;
  }

  if (!formView.classList.contains("hidden")) {
    closeForm();
  } else if (targetDeleteId !== null) {
    targetDeleteId = null;
    render();
  }
});

// ========================================
// 14. INISIALISASI AWAL
// ========================================

render();
