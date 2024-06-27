const body = document.getElementsByTagName("body")[0];
const video = document.getElementsByTagName("video")[0];
const svg = document.getElementsByTagName("svg")[0];
const range = document.querySelector("input[type='range']");
const option = document.getElementById("option");

const play_button = document.getElementById("play_button");
const volume_button = document.getElementById("volume_button");
const loop_button = document.getElementById("loop_button");
const speed_button = document.getElementById("speed_button");
const monitoring_button = document.getElementById("monitoring_button");
const fullscreen_button = document.getElementById("fullscreen_button");
const window_fix_button = document.getElementById("window_fix_button");
const option_button = document.getElementById("option_button");

const play_button_show = document.getElementById("play_button_show");
const volume_button_show = document.getElementById("volume_button_show");
const loop_button_show = document.getElementById("loop_button_show");
const speed_button_show = document.getElementById("speed_button_show");
const monitoring_button_show = document.getElementById("monitoring_button_show");
const fullscreen_button_show = document.getElementById("fullscreen_button_show");
const window_fix_button_show = document.getElementById("window_fix_button_show");
const pen_color_show = document.getElementById("pen_color_show");

const link_button = document.getElementsByClassName("link");

const monirotring_folder = document.getElementById("monirotring_folder");
const monirotring_folder_reference = document.getElementById("monirotring_folder_reference");

const volume_range = document.getElementById("volume_range");

const window_size_change = document.getElementById("window_size_change");
const window_width = document.getElementById("window_width");
const window_height = document.getElementById("window_height");

monirotring_folder_reference.addEventListener("click", function () {
    window.chrome.webview.postMessage("monirotring_folder_reference");
});

window_size_change.addEventListener("click", function () {
    window.chrome.webview.postMessage(`window_size_change,${window_width.value},${window_height.value}`);
});

option_button.addEventListener("change", () => {
    if (option_button.checked === true) {
        option.setAttribute("show", "");
    } else {
        option.removeAttribute("show");
    }

});

Array.prototype.forEach.call(link_button, element => {
    element.addEventListener("click", function () {
        document.getElementsByName(element.name).forEach(linkElement => {
            linkElement.checked = element.checked;
        });
    }, false);
});

play_button.addEventListener("click", function () {
    if (video.src === "") {
        play_button.checked = false;
        return;
    }

    if (play_button.checked) {
        video.play();
    } else {
        video.pause();
    }
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

var playbackRate = 1;

speed_button.addEventListener("click", function () {
    playbackRate = speed_button.checked ? 0.5 : 1;

    video.playbackRate = playbackRate;
    document.getAnimations().forEach(anim => anim.playbackRate = playbackRate);
}, false);

monitoring_button.addEventListener("click", function () {
    window.chrome.webview.postMessage(monitoring_button.checked ? `minitoring_on,${monirotring_folder.value}` : "minitoring_off");
}, false);

fullscreen_button.addEventListener("click", function () {
    window.chrome.webview.postMessage(fullscreen_button.checked ? "fullscreen_on" : "fullscreen_off");
}, false);

window_fix_button.addEventListener("click", function () {
    window.chrome.webview.postMessage(window_fix_button.checked ? "window_fix_on" : "window_fix_off");
}, false);

volume_range.addEventListener("input", function () {
    video.volume = volume_range.value / 100;
}, false);


volume_range.addEventListener("change", function () {
    video.volume = volume_range.value / 100;
}, false);



// キーでどこでも再生・一時停止
body.addEventListener("keydown", function (e) {
    if (document.activeElement.tagName.toUpperCase() == "INPUT") {
        return;
    }

    switch (e.code) {
        case "Space":
            togglePlayPause();
            break;

        case "Digit0":
            break;

        case "Delete":
            clearPath();
            break;

        case "Digit1":
            set_pen_color("#000000");
            break;

        case "Digit2":
            set_pen_color("#FF0000");
            break;

        case "Digit3":
            set_pen_color("#00FF00");
            break;

        case "Digit4":
            set_pen_color("#0000FF");
            break;

        case "Digit5":
            set_pen_color("#FFFF00");
            break;

        case "Digit6":
            set_pen_color("#FF00FF");
            break;

        case "Digit7":
            set_pen_color("#00FFFF");
            break;

        case "Digit8":
            set_pen_color("#FFFFFF");
            break;
    }
}, false);

// 通常のドラッグイベント無効
body.addEventListener("dragenter", function (e) {
    e.stopPropagation();
    e.preventDefault();
}, false);

// 通常のドラッグイベント無効
body.addEventListener("dragover", function (e) {
    e.stopPropagation();
    e.preventDefault();
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
pen_color = "#000000", //描画色の初期化
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
    svg.lastElementChild.setAttribute("stroke", pen_color); //線の色
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

range.addEventListener("resize", function(){
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

volume_button.addEventListener("click", function () {
    window.chrome.webview.postMessage(`config,${this.id},${this.checked}`);
});

volume_range.addEventListener("input", function () {
    window.chrome.webview.postMessage(`config,${this.id},${this.value}`);
}, false);


volume_range.addEventListener("change", function () {
    window.chrome.webview.postMessage(`config,${this.id},${this.value}`);
}, false);

loop_button.addEventListener("click", function () {
    window.chrome.webview.postMessage(`config,${this.id},${this.checked}`);
});

speed_button.addEventListener("click", function () {
    window.chrome.webview.postMessage(`config,${this.id},${this.checked}`);
});

play_button_show.addEventListener("click", function () {
    window.chrome.webview.postMessage(`config,${this.id},${this.checked}`);
});

volume_button_show.addEventListener("click", function () {
    window.chrome.webview.postMessage(`config,${this.id},${this.checked}`);
});

loop_button_show.addEventListener("click", function () {
    window.chrome.webview.postMessage(`config,${this.id},${this.checked}`);
});

speed_button_show.addEventListener("click", function () {
    window.chrome.webview.postMessage(`config,${this.id},${this.checked}`);
});

monitoring_button_show.addEventListener("click", function () {
    window.chrome.webview.postMessage(`config,${this.id},${this.checked}`);
});

fullscreen_button_show.addEventListener("click", function () {
    window.chrome.webview.postMessage(`config,${this.id},${this.checked}`);
});

window_fix_button_show.addEventListener("click", function () {
    window.chrome.webview.postMessage(`config,${this.id},${this.checked}`);
});

pen_color_show.addEventListener("click", function () {
    window.chrome.webview.postMessage(`config,${this.id},${this.checked}`);
});

function set_pen_color(color) {
    pen_color = color;
    document.querySelector('.pen-color').style.color = color;
    window.chrome.webview.postMessage(`config,pen_color,${color}`);
}
