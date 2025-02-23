const { ipcRenderer, webUtils } = require("electron");

const body = document.getElementsByTagName("body")[0];
const video = document.getElementsByTagName("video")[0];
const svg = document.getElementsByTagName("svg")[0];
const range = document.querySelector("input[type='range']");
const current_time = document.getElementById("current_time");
const shortcut = document.getElementById("shortcut");
const option = document.getElementById("option");

const play_button = document.getElementById("play_button");
const rewind_button = document.getElementById("rewind_button");
const forward_button = document.getElementById("forward_button");
const volume_button = document.getElementById("volume_button");
const loop_button = document.getElementById("loop_button");
const slow_button = document.getElementById("slow_button");
const fast_button = document.getElementById("fast_button");
const monitoring_button = document.getElementById("monitoring_button");
const pen_color_button = document.getElementById("pen_color_button");
const window_fix_button = document.getElementById("window_fix_button");
const fullscreen_button = document.getElementById("fullscreen_button");
const update_notification = document.getElementById("update_notification");
const shortcut_button = document.getElementById("shortcut_button");
const option_button = document.getElementById("option_button");

const delete_shortcut = document.getElementById("delete_shortcut");
const play_shortcut = document.getElementById("play_shortcut");
const rewind_shortcut = document.getElementById("rewind_shortcut");
const forward_shortcut = document.getElementById("forward_shortcut");
const volume_shortcut = document.getElementById("volume_shortcut");
const volumeup_shortcut = document.getElementById("volumeup_shortcut");
const volumedown_shortcut = document.getElementById("volumedown_shortcut");
const loop_shortcut = document.getElementById("loop_shortcut");
const slow_shortcut = document.getElementById("slow_shortcut");
const fast_shortcut = document.getElementById("fast_shortcut");
const monitoring_shortcut = document.getElementById("monitoring_shortcut");
const pen_shortcut1 = document.getElementById("pen_shortcut1");
const pen_shortcut2 = document.getElementById("pen_shortcut2");
const pen_shortcut3 = document.getElementById("pen_shortcut3");
const pen_shortcut4 = document.getElementById("pen_shortcut4");
const pen_shortcut5 = document.getElementById("pen_shortcut5");
const pen_shortcut6 = document.getElementById("pen_shortcut6");
const pen_shortcut7 = document.getElementById("pen_shortcut7");
const pen_shortcut8 = document.getElementById("pen_shortcut8");
const pen_shortcut9 = document.getElementById("pen_shortcut9");
const pen_shortcut0 = document.getElementById("pen_shortcut0");
const window_fix_shortcut = document.getElementById("window_fix_shortcut");
const fullscreen_shortcut = document.getElementById("fullscreen_shortcut");

const pen_color_selector = document.getElementById("pen_color_selector");
const pen_color1 = document.getElementById("pen_color1");
const pen_color2 = document.getElementById("pen_color2");
const pen_color3 = document.getElementById("pen_color3");
const pen_color4 = document.getElementById("pen_color4");
const pen_color5 = document.getElementById("pen_color5");
const pen_color6 = document.getElementById("pen_color6");
const pen_color7 = document.getElementById("pen_color7");
const pen_color8 = document.getElementById("pen_color8");
const pen_color9 = document.getElementById("pen_color9");
const pen_color0 = document.getElementById("pen_color0");

const link_button = document.getElementsByClassName("link");

const monirotring_folder = document.getElementById("monirotring_folder");
const monirotring_folder_reference = document.getElementById("monirotring_folder_reference");

const rewind_forward_seconds = document.getElementById("rewind_forward_seconds");

const slow_ratio = document.getElementById("slow_ratio");
const fast_ratio = document.getElementById("fast_ratio");

const volume_range_step = document.getElementById("volume_range_step");
const volume_range = document.getElementById("volume_range");

const window_size_change = document.getElementById("window_size_change");
const window_width = document.getElementById("window_width");
const window_height = document.getElementById("window_height");

const pen_color_reset = document.getElementById("pen_color_reset");

var playbackRate = 1;

monirotring_folder_reference.addEventListener("click", function () {
    ipcRenderer.postMessage("monirotring_folder_reference");
});

window_size_change.addEventListener("click", function () {
    ipcRenderer.postMessage("window_size_change", `${window_width.value},${window_height.value}`);
});

pen_color_reset.addEventListener("click", function () {
    if (confirm("初期化しますか？") === false) {
        return;
    }

    document.querySelectorAll("input[type='color']").forEach(element => {
        element.value = element.dataset.defaultColor;

        ipcRenderer.postMessage("config", `${element.id},${element.value}`);
    });

    initPenColor();
    changePenColorSelected(pen_color_selector.dataset.selected);
});

pen_color_button.addEventListener("change", () => {
    if (pen_color_button.checked === true) {
        pen_color_selector.setAttribute("show", "");
    } else {
        pen_color_selector.removeAttribute("show");
    }

    option_button.checked = false;
    option.removeAttribute("show");

    shortcut_button.checked = false;
    shortcut.removeAttribute("show");
});

shortcut_button.addEventListener("change", () => {
    if (shortcut_button.checked === true) {
        shortcut.setAttribute("show", "");
    } else {
        shortcut.removeAttribute("show");
    }

    pen_color_button.checked = false;
    pen_color_selector.removeAttribute("show");

    option_button.checked = false;
    option.removeAttribute("show");
});

auto_update_check.addEventListener("change", () => {
    if (auto_update_check.checked) {
        ipcRenderer.postMessage("check_update");
    }
});

update_notification.addEventListener("change", () => {
    if (update_notification.dataset.canUpdate == "true") {
        if (window.confirm("ダウンロードページをブラウザで開きます") === true) {
            ipcRenderer.postMessage("update");
        }
    }
});

option_button.addEventListener("change", () => {
    if (option_button.checked === true) {
        option.setAttribute("show", "");
    } else {
        option.removeAttribute("show");
    }

    pen_color_button.checked = false;
    pen_color_selector.removeAttribute("show");

    shortcut_button.checked = false;
    shortcut.removeAttribute("show");
});

Array.prototype.forEach.call(link_button, element => {
    element.addEventListener("click", function () {
        document.getElementsByName(element.name).forEach(linkElement => {
            linkElement.checked = element.checked;
        });
    }, false);
});

play_button.addEventListener("click", function () {
    togglePlayPause();
}, false);

rewind_button.addEventListener("click", function () {
    if (video.src === "") {
        return;
    }

    if (video.currentTime === 0) {
        return;
    }

    let afterValue = Number(range.value) - Number(rewind_forward_seconds.value);
    let minValue = 0;

    if (afterValue < minValue) {
        afterValue = minValue;
    }

    range.value = afterValue;
    range.dispatchEvent(new Event('input'));
    range.dispatchEvent(new Event('change'));
}, false);

forward_button.addEventListener("click", function () {
    if (video.src === "") {
        return;
    }

    if (video.ended) {
        return;
    }

    let afterValue = Number(range.value) + Number(rewind_forward_seconds.value);
    let maxValue = Number(range.getAttribute("max"));

    if (afterValue > maxValue) {
        afterValue = maxValue;
    }

    range.value = afterValue;
    range.dispatchEvent(new Event('input'));
    range.dispatchEvent(new Event('change'));
}, false);

volume_button.addEventListener("click", function () {
    volume_range.disabled = !volume_button.checked;

    video.muted = !volume_button.checked;
}, false);

loop_button.addEventListener("click", function () {
    if (loop_button.checked && video.ended) {
        video.play();
    }

    video.loop = loop_button.checked;
}, false);

slow_button.addEventListener("click", function () {
    fast_button.checked = false;
    playbackRate = slow_button.checked ? slow_ratio.value / 100 : 1;

    video.playbackRate = playbackRate;
    document.getAnimations().forEach(anim => anim.playbackRate = playbackRate);
}, false);

fast_button.addEventListener("click", function () {
    slow_button.checked = false;
    playbackRate = fast_button.checked ? fast_ratio.value / 100 : 1;

    video.playbackRate = playbackRate;
    document.getAnimations().forEach(anim => anim.playbackRate = playbackRate);
}, false);

monitoring_button.addEventListener("click", function () {
    if (monitoring_button.checked) {
        ipcRenderer.postMessage("minitoring_on", `${monirotring_folder.value}`);
    } else {
        ipcRenderer.postMessage("minitoring_off");
    }
}, false);

window_fix_button.addEventListener("click", function () {
    if (fullscreen_button.checked) {
        window_fix_button.checked = false;
    } else {
        ipcRenderer.postMessage(window_fix_button.checked ? "window_fix_on" : "window_fix_off");
    }
}, false);

fullscreen_button.addEventListener("click", function () {
    if (window_fix_button.checked) {
        fullscreen_button.checked = false;
    } else {
        ipcRenderer.postMessage("fullscreen");
    }
}, false);

volume_range_step.addEventListener("input", function () {
    volume_range.step = volume_range_step.value;
});

volume_range_step.addEventListener("change", function () {
    volume_range.step = volume_range_step.value;
});

body.addEventListener("change", function (e) {
    if (e.target.classList.contains("config-number") === false) {
        return;
    }

    if (e.target.value.match(/^[0-9]$/) === false) {
        e.target.value = e.target.dataset.value;
        return;
    }

    if (Number(e.target.value) > Number(e.target.max)){
        e.target.value = e.target.max;
    }

    if (Number(e.target.value) < Number(e.target.min)) {
        e.target.value = e.target.min;
    }

    e.target.dataset.value = e.target.value;
});

volume_range.addEventListener("input", function () {
    video.volume = volume_range.value / 100;

    ipcRenderer.postMessage("config", `${volume_range.id},${volume_range.value}`);
}, false);

volume_range.addEventListener("change", function () {
    video.volume = volume_range.value / 100;

    ipcRenderer.postMessage("config", `${volume_range.id},${volume_range.value}`);
}, false);

// キーショートカット
body.addEventListener("keydown", function (e) {
    if (document.activeElement.tagName.toUpperCase() == "INPUT") {
        return;
    }

    shortcutAction(e);
}, false);

// マウスホイールショートカット
body.addEventListener("wheel", function (e) {
    if (document.activeElement.tagName.toUpperCase() == "INPUT") {
        return;
    }

    if (e.target.closest(".option-vertical") !== null) {
        return;
    }

    shortcutAction(e);
}, false);

function shortcutAction(e) {
    switch (makeKeyCode(e)) {
        case delete_shortcut.value:
            clearPath();
            break;

        case play_shortcut.value:
            play_button.click();
            break;

        case rewind_shortcut.value:
            rewind_button.click();
            break;

        case forward_shortcut.value:
            forward_button.click();
            break;

        case volume_shortcut.value:
            volume_button.click();
            break;

        case volumeup_shortcut.value:
            volume_range.value = (Math.floor(volume_range.value / volume_range_step.value) + 1) * volume_range_step.value;
            volume_range.dispatchEvent(new Event("change"));
            break;

        case volumedown_shortcut.value:
            volume_range.value = (Math.floor(volume_range.value / volume_range_step.value) - 1) * volume_range_step.value;
            volume_range.dispatchEvent(new Event("change"));
            break;

        case loop_shortcut.value:
            loop_button.click();
            break;

        case slow_shortcut.value:
            slow_button.click();
            break;

        case fast_shortcut.value:
            fast_button.click();
            break;

        case monitoring_shortcut.value:
            monitoring_button.click();
            break;

        case pen_shortcut1.value:
            changePenColorSelected(pen_color1.id);
            break;

        case pen_shortcut2.value:
            changePenColorSelected(pen_color2.id);
            break;

        case pen_shortcut3.value:
            changePenColorSelected(pen_color3.id);
            break;

        case pen_shortcut4.value:
            changePenColorSelected(pen_color4.id);
            break;

        case pen_shortcut5.value:
            changePenColorSelected(pen_color5.id);
            break;

        case pen_shortcut6.value:
            changePenColorSelected(pen_color6.id);
            break;

        case pen_shortcut7.value:
            changePenColorSelected(pen_color7.id);
            break;

        case pen_shortcut8.value:
            changePenColorSelected(pen_color8.id);
            break;

        case pen_shortcut9.value:
            changePenColorSelected(pen_color9.id);
            break;

        case pen_shortcut0.value:
            changePenColorSelected(pen_color0.id);
            break;

        case window_fix_shortcut.value:
            window_fix_button.click();
            break;

        case fullscreen_shortcut.value:
            fullscreen_button.click();
            break;
    }
}

body.addEventListener("change", function (e) {
    if (e.target.classList.contains("config-change-value") === false) {
        return;
    }

    ipcRenderer.postMessage("config", `${e.target.id},${e.target.value}`);
});

body.addEventListener("change", function (e) {
    if (e.target.classList.contains("config-change-checked") === false) {
        return;
    }

    ipcRenderer.postMessage("config", `${e.target.id},${e.target.checked}`);
});

body.addEventListener("click", function (e) {
    if (e.target.tagName !== "INPUT" || e.target.getAttribute("type") !== "color") {
        return;
    }

    // 入力キャンセル
    e.stopPropagation();
    e.preventDefault();
});

body.addEventListener("click", function (e) {
    if (e.target.classList.contains("pen-color-item") === false) {
        return;
    }

    changePenColorSelected(e.target.dataset.target);

    pen_color_button.checked = false;
    pen_color_selector.removeAttribute("show");
});

var isClickPenColorItem = false;
var clickPenColorItem = null;

body.addEventListener("mousedown", function (e) {
    if (e.target.classList.contains("pen-color-item") === false) {
        return;
    }

    switch (e.button) {
        // 右クリック
        case 2:
            isClickPenColorItem = true;
            clickPenColorItem = e.target;
            break;
    }
});

body.addEventListener("mouseleave", function (e) {
    if (e.target.classList.contains("pen-color-item") === false) {
        return;
    }

    isClickPenColorItem = false;
});

body.addEventListener("mouseup", function (e) {
    if (e.target.classList.contains("pen-color-item") === false) {
        return;
    }

    if (isClickPenColorItem === false) {
        return;
    }

    if (clickPenColorItem !== e.target) {
        return;
    }

    switch (e.button) {
        // 右クリック
        case 2:
            document.getElementById(e.target.dataset.target).showPicker();
            break;
    }

    clickPenColorItem = false;
});

body.addEventListener("input", function (e) {
    if (e.target.getAttribute("type") !== "color") {
        return;
    }

    document.querySelector(`#${e.target.id} ~ .pen-color`).style.color = e.target.value;

    if (pen_color_selector.dataset.selected === e.target.id) {
        changePenColorSelected(e.target.id);
    }
});

body.addEventListener("change", function (e) {
    if (e.target.getAttribute("type") !== "color") {
        return;
    }

    document.querySelector(`#${e.target.id} ~ .pen-color`).style.color = e.target.value;

    if (pen_color_selector.dataset.selected === e.target.id) {
        changePenColorSelected(e.target.id);
    }
});


// ショートカット設定用
body.addEventListener("keydown", function (e) {
    if (document.activeElement.classList.contains("shortcut-input") === false) {
        return;
    }

    if (["Tab", "ControlLeft", "ControlRight", "ShiftLeft", "ShiftRight", "AltLeft", "AltRight"].includes(e.code)) {
        // 入力キャンセル
        e.stopPropagation();
        e.preventDefault();
        return;
    }

    let keyCode = makeKeyCode(e);

    if (keyCode !== "") {
        document.querySelectorAll(".shortcut-input").forEach(element => {
            if (element.value === keyCode) {
                element.value = "";

                ipcRenderer.postMessage("config", `${element.id},${element.value}`);
            }
        })
    }

    document.activeElement.value = keyCode;

    ipcRenderer.postMessage("config", `${document.activeElement.id},${document.activeElement.value}`);

    // 入力キャンセル
    e.stopPropagation();
    e.preventDefault();
}, false);

body.addEventListener("wheel", function (e) {
    if (document.activeElement.classList.contains("shortcut-input") === false) {
        return;
    }

    document.activeElement.value = makeKeyCode(e);

    ipcRenderer.postMessage("config", `${document.activeElement.id},${document.activeElement.value}`);

    // 入力キャンセル
    e.stopPropagation();
    e.preventDefault();
}, { passive: false } );

function makeKeyCode(e) {
    switch (e.type) {
        case "keydown":
            if (e.code === "Escape") {
                return "";
            }

            return ((e.ctrlKey ? "Ctrl + " : "") + (e.shiftKey ? "Shift + " : "") + (e.altKey ? "Alt + " : "") + e.code);
            break;

        case "wheel":
            if (e.deltaY < 0) {
                return "WheelUp";
            }

            if (e.deltaY > 0) {
                return "WheelDown";
            }
            break;
    }
}

// 通常のドラッグイベント無効
document.addEventListener("dragstart", function (e) {
    e.stopPropagation();
    e.preventDefault();
}, false);

// 通常のドラッグイベント無効
document.addEventListener("dragenter", function (e) {
    e.stopPropagation();
    e.preventDefault();
}, false);

// 通常のドラッグイベント無効
document.addEventListener("dragover", function (e) {
    e.stopPropagation();
    e.preventDefault();
}, false);

// 通常のドラッグイベント無効
document.addEventListener("drop", function (e) {
    e.stopPropagation();
    e.preventDefault();

    video.src = webUtils.getPathForFile(e.dataTransfer.files[0]);
}, false);

video.addEventListener("loadedmetadata", function () {
    var width = video.videoWidth;
    var height = video.videoHeight;

    svg.setAttribute("viewBox", `0 0 ${width} ${height}`);

    clearPath();

    range.disabled = false;
    range.setAttribute("max", video.duration);
    range.setAttribute("value", 0);
    range.setAttribute("step", video.duration / range.clientWidth);

    video.playbackRate = playbackRate;
    video.muted = !volume_button.checked;
    video.volume = volume_range.value / 100;
});

var videoInterval;

video.addEventListener("play", function () {
    video.setAttribute("running", "");
    play_button.checked = true;

    if (videoInterval) { 
        return;
    }

    videoInterval = setInterval(function () {
        Array.from(document.getElementsByTagName("path")).forEach(element => {
            if (element.hasAttribute("running") && element.hasAttribute("writing")) {
                return;
            }

            let startTime = Number(element.style.getPropertyValue("--time"));

            if (video.currentTime >= startTime && video.currentTime < startTime + 0.5) {
                element.setAttribute("running", "");
            }
        });

        range.value = video.currentTime;

        let currentTimeMinute = (Math.floor(Math.floor(video.currentTime) / 60)).toString();
        let currentTimeSecond = (Math.floor(video.currentTime) % 60).toString();
        let durationMinute = (Math.floor(Math.floor(video.duration) / 60)).toString();
        let durationSecond = (Math.floor(video.duration) % 60).toString();

        currentTimeMinute = currentTimeMinute.padStart(durationMinute.length, "0");
        currentTimeSecond = currentTimeSecond.padStart(2, "0");
        durationMinute = durationMinute.padStart(durationMinute.length, "0");
        durationSecond = durationSecond.padStart(2, "0");

        current_time.innerText = `${currentTimeMinute}:${currentTimeSecond}/${durationMinute}:${durationSecond}`;
    }, 50);
});

video.addEventListener("pause", function() {
    video.removeAttribute("running", "");
    play_button.checked = false;
});

video.addEventListener("ended", function () {
    Array.from(document.getElementsByTagName("path")).forEach(element => {
        if (element.hasAttribute("running") || element.hasAttribute("writing")) {
            element.animate().cancel();
        }
    });

    video.removeAttribute("running", "");
    range.value = video.currentTime;
});

var animationstart = function (element) {
    document.getAnimations().forEach(anim => anim.playbackRate = playbackRate);
};

var animationend = function (element) {
    this.removeAttribute("running", "");
    this.removeAttribute("writing", "");
};



// ここからsvg

//初期設定
var movetoX = 0, //開始点(横方向)の初期化
movetoY = 0, //開始点(縦方向)の初期化
linetoStr = "", //LineToコマンド値の初期化
drawType = "none"; //塗りつぶしの初期化
strokeWidth = "7"; //線の太さ

var linetoX = [], //描画点の横座標の初期化
linetoY = [], //描画点の縦座標の初期化
cntMoveto = 0; //描画点のカウンターを初期化

var isDown = false; // マウス押してる

svg.addEventListener("mousedown", function (event) {
    if (video.paused === false) {
        return;
    }

    var click_x = event.pageX;
	var click_y = event.pageY;
    var a = event.target.parentNode;

    // 要素の位置を取得
    var client_rect = this.getBoundingClientRect() ;
    var position_x = client_rect.left + window.pageXOffset;
    var position_y = client_rect.top + window.pageYOffset;

    // 要素の拡縮率を計算
    var scale = 1 / (client_rect.height / svg.viewBox.baseVal.height);

    movetoX = parseInt((click_x - position_x) * scale);
    movetoY = parseInt((click_y - position_y) * scale);

    var pathElm = document.createElementNS("http://www.w3.org/2000/svg", "path"); //SVGのpath要素を作成
    svg.append(pathElm); //SVGに作成したpathを追加

    //追加したpathの各属性を設定
    svg.lastElementChild.setAttribute("d", ""); //pathデータ
    svg.lastElementChild.setAttribute("fill", drawType); //塗りつぶし
    svg.lastElementChild.setAttribute("stroke", getPencolor()); //線の色
    svg.lastElementChild.setAttribute("stroke-width", strokeWidth); //線の太さ
    svg.lastElementChild.setAttribute("stroke-linecap", "round"); //線の端を丸める
    svg.lastElementChild.setAttribute("stroke-linejoin", "round"); //線の端を丸める
    svg.lastElementChild.setAttribute("writing", "");
    svg.lastElementChild.setAttribute("draggable", "false");
    svg.lastElementChild.addEventListener("animationstart", animationstart);
    svg.lastElementChild.addEventListener("animationend", animationend);

    linetoX = [];  //描画点の横座標の初期化
    linetoY = [];  //描画点の縦座標の初期化
    cntMoveto = 0; //描画点のカウンターを初期化
    linetoStr = 'M ' + movetoX + ' ' + movetoY + ' '; //d要素でpathの開始点を設定

    isDown = true;
}, false);

svg.addEventListener("mousemove", function (event) {
    if (video.paused === false) {
        return;
    }

    if (isDown === false) {
        return;
    }
    var click_x = event.pageX;
	var click_y = event.pageY;

	// 要素の位置を取得
	var client_rect = this.getBoundingClientRect() ;
	var position_x = client_rect.left + window.pageXOffset;
	var position_y = client_rect.top + window.pageYOffset;

    // 要素の拡縮率を計算
    var scale = 1 / (client_rect.height / svg.viewBox.baseVal.height);

    event.preventDefault();
    linetoX[cntMoveto] = parseInt((click_x - position_x) * scale); //SVG上のマウス座標(横方向)の取得
    linetoY[cntMoveto] = parseInt((click_y - position_y) * scale); //SVG上のマウス座標(縦方向)の取得
    linetoStr = linetoStr + " L " + linetoX[cntMoveto] + " " + linetoY[cntMoveto]; //動いた後の新たなマウス座標を描画点として追加
    
    svg.lastElementChild.setAttribute("d", linetoStr); //pathデータ(d属性)の値を更新
    
    cntMoveto++; //カウンターをセット
}, false);

svg.addEventListener("mouseup", function (event) {
    endLine(event);
}, false);


svg.addEventListener("mouseleave", function (event) {
    endLine(event);
}, false);

function endLine(event) {
    if (video.paused === false) {
        return;
    }

    if (isDown === false) {
        return;
    }

    // 短い線は消す
    if (parseInt(svg.lastElementChild.getTotalLength()) < 20) {
        svg.lastElementChild.remove();
    } else {
        svg.lastElementChild.style.setProperty("--stroke-dasharray", parseInt(svg.lastElementChild.getTotalLength())); //
        svg.lastElementChild.style.setProperty("--time", video.currentTime); //
    }

    isDown = false;
}

range.addEventListener("input", function () {
    if (video.hasAttribute("running")) {
        video.setAttribute("pause", "");
    }

    video.pause();

    resetPathAnimation();

    video.currentTime = range.value;
}, false);

range.addEventListener("change", function() {
    if (video.hasAttribute("pause")) {
        video.removeAttribute("pause");

        video.play();
    }

    range.blur();
}, false);

range.addEventListener("resize", function() {
    range.setAttribute("step", video.duration / range.clientWidth);
}, false);

function resetPathAnimation() {
    Array.from(document.getElementsByTagName("path")).forEach(element => {
        element.removeAttribute("running", "");
        element.removeAttribute("writing", "");
    });
}

function clearPath() {
    svg.innerHTML = "";
}

function togglePlayPause() {
    if (video.src === "") {
        return;
    }

    if (video.paused) {
        video.play();
    }
    else {
        video.pause();
    }
}

function initPenColor() {
    document.querySelectorAll("input[type='color']").forEach(element => {
        document.querySelector(`#${element.id} ~ .pen-color`).style.color = element.value;
    });
}

function getPencolor() {
    return document.getElementById(pen_color_selector.dataset.selected).value;
}

function changePenColorSelected(colorElementId) {
    pen_color_selector.dataset.selected = colorElementId;
    ipcRenderer.postMessage("config", `${pen_color_selector.id},${pen_color_selector.dataset.selected}`);
    document.getElementById("pen-color").style.color = getPencolor();
}

function changeIconOrder(name, order) {
    let oldOrder = document.querySelector(`[data-order-name='${name}']`).style.order;

    document.querySelectorAll(`[data-order-name]`).forEach(element => {
        if (element.style.order === order.toString()) {
            element.style.order = oldOrder;
            ipcRenderer.postMessage("config", `${element.dataset.orderName},${element.style.order}`);
        }
    });

    document.querySelectorAll(`[data-order-name='${name}']`).forEach(element => {
        element.style.order = order.toString();
        ipcRenderer.postMessage("config", `${element.dataset.orderName},${element.style.order}`);
    });

    let min = 999;
    let minElement;
    let max = 0;
    let maxElement;

    document.querySelectorAll(".order-up").forEach(element => {
        element.removeAttribute("disabled");

        if (Number(element.parentNode.style.order) < min) {
            min = Number(element.parentNode.style.order);
            minElement = element;
        }
    });
    minElement.setAttribute("disabled", "");

    document.querySelectorAll(".order-down").forEach(element => {
        element.removeAttribute("disabled");

        if (Number(element.parentNode.style.order) > max) {
            max = Number(element.parentNode.style.order);
            maxElement = element;
        }
    });
    maxElement.setAttribute("disabled", "");
}

document.querySelectorAll(".order-up").forEach(element => {
    element.addEventListener("click", function (e) {
        changeIconOrder(e.target.parentNode.dataset.orderName, Number(e.target.parentNode.style.order) - 1);
    });
});

document.querySelectorAll(".order-down").forEach(element => {
    element.addEventListener("click", function (e) {
        changeIconOrder(e.target.parentNode.dataset.orderName, Number(e.target.parentNode.style.order) + 1);
    });
});

ipcRenderer.on("function", (event, args) => {
    Function(args)();
});
