
const fileMap = {
    bible1: "../data/jazz_standard_bible_1.json",
    bible2: "../data/jazz_standard_bible_2.json"
};

const selectedBooks = new Set(["bible_1"]);

function setupBookSelector() {
    const checkboxes = document.querySelectorAll('#bookSelector input[type="checkbox"]');
    checkboxes.forEach(cb => {
        cb.addEventListener('change', (event) => {
            const value = cb.value;

            if (cb.checked) {
                selectedBooks.add(value);
            } else {
                selectedBooks.delete(value);
            }

            loadSongs(); // データの再読み込み
        });
    });
}



function switchCarouselTab(groupId, tabElement) {
    document.querySelectorAll('.carousel-group').forEach(group => group.classList.remove('active'));
    document.getElementById(groupId).classList.add('active');

    document.querySelectorAll('.carousel-tabs div').forEach(btn => btn.classList.remove('active'));
    tabElement.classList.add('active');
}

function scrollCarousel(id, direction) {
    const container = document.getElementById(id);
    const item = container.querySelector('.carousel-item');
    const scrollAmount = item.offsetWidth + 12; // gap含む
    container.scrollBy({ left: direction * scrollAmount, behavior: 'smooth' });

    // 少し遅れて更新（スクロール完了後）
    setTimeout(() => updateButtonState(id), 100);
}



function updateButtonState(id) {
    const container = document.getElementById(id);
    const wrapper = container.closest('.carousel-wrapper');
    const leftBtn = wrapper.querySelector('.carousel-button.left');
    const rightBtn = wrapper.querySelector('.carousel-button.right');

    const maxScrollLeft = container.scrollWidth - container.clientWidth;
    const currentScrollLeft = container.scrollLeft;

    // 左端の場合
    if (currentScrollLeft <= 0) {
        leftBtn.disabled = true;
        leftBtn.style.opacity = 0.3;
        leftBtn.style.pointerEvents = 'none';
    } else {
        leftBtn.disabled = false;
        leftBtn.style.opacity = 1;
        leftBtn.style.pointerEvents = 'auto';
    }

    // 右端の場合
    if (currentScrollLeft >= maxScrollLeft - 1) {
        rightBtn.disabled = true;
        rightBtn.style.opacity = 0.3;
        rightBtn.style.pointerEvents = 'none';
    } else {
        rightBtn.disabled = false;
        rightBtn.style.opacity = 1;
        rightBtn.style.pointerEvents = 'auto';
    }
}



const keyOptions = ["C", "D♭", "D", "E♭", "E", "F", "G", "A♭", "A", "B♭", "B"];
const styleOptions = ["Jazz Standard", "Swing", "Ballad", "Blues", "Bebop", "Latin", "Hard Bop", "Jazz", "Funk"];
const keyTags = new Set();
const styleTags = new Set();
let allSongs = [];
let songs = [];
const historyList = [];


function normalizeKeys(keys) {
    return keys.split(/[,/]/).map(k => k.trim()).filter(Boolean);
}

function updateTagDisplay() {
    const kt = document.getElementById("keyTags");
    const st = document.getElementById("styleTags");
    kt.innerHTML = "";
    st.innerHTML = "";

    keyTags.forEach(k => {
        const span = document.createElement("span");
        span.className = "tag";
        span.innerHTML = `${k} <button onclick="removeTag('key', '${k}')">×</button>`;
        kt.appendChild(span);
    });
    styleTags.forEach(s => {
        const span = document.createElement("span");
        span.className = "tag";
        span.innerHTML = `${s} <button onclick="removeTag('style', '${s}')">×</button>`;
        st.appendChild(span);
    });
}

function removeTag(type, value) {
    if (type === 'key') keyTags.delete(value);
    if (type === 'style') styleTags.delete(value);
    updateTagDisplay();
    applyFilters();
}

function addTagFromSelector(selectorId, tagSet) {
    const selector = document.getElementById(selectorId);
    const val = selector.value;
    if (val && !tagSet.has(val)) {
        tagSet.add(val);
        selector.value = "";
        updateTagDisplay();
        applyFilters();
    }
}

setupBookSelector();

function setupTagSelectors() {
    const keySel = document.getElementById("keySelector");
    keyOptions.forEach(k => {
        const opt = document.createElement("option");
        opt.value = k;
        opt.textContent = k;
        keySel.appendChild(opt);
    });
    keySel.onchange = () => addTagFromSelector("keySelector", keyTags);

    const styleSel = document.getElementById("styleSelector");
    styleOptions.forEach(s => {
        const opt = document.createElement("option");
        opt.value = s;
        opt.textContent = s;
        styleSel.appendChild(opt);
    });
    styleSel.onchange = () => addTagFromSelector("styleSelector", styleTags);
}

function applyFilters() {
    const keySelected = [...keyTags];
    const styleSelected = [...styleTags];
    songs = allSongs.filter(song => {
        const keys = song.key ? normalizeKeys(song.key) : [];
        const styles = song.style ? song.style.split(',').map(s => s.trim()) : [];
        const keyMatch = keySelected.length === 0 || keySelected.some(k => keys.some(songKey => songKey.startsWith(k)));
        const styleMatch = styleSelected.length === 0 || styleSelected.some(s => styles.includes(s));
        return keyMatch && styleMatch;
    });
}

function updateHistory() {
    const ul = document.getElementById("historyList");
    ul.innerHTML = "";
    historyList.slice(0, 20).forEach(item => {
        const li = document.createElement("li");
        li.innerHTML = item;
        ul.appendChild(li);
    });
}

setupTagSelectors();
updateTagDisplay();
