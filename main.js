const { app, BrowserWindow, ipcMain, dialog, screen, shell } = require("electron")
const chokidar = require("chokidar")
const fs = require("fs")
const path = require("path")
const Setting = require("./setting")
const { electron } = require("process")
var window
var watcher

app.commandLine.appendSwitch('disable-gpu-sandbox')
process.env["ELECTRON_DISABLE_SECURITY_WARNINGS"] = true

const createWindow = () => {

    if (fs.existsSync(`${path.resolve().replace("\\", "/")}/setting.json`)) {
        try {
            let lines = fs.readFileSync(`${path.resolve().replace("\\", "/")}/setting.json`, "utf8")
            let data = JSON.parse(lines)
            for(let property in Setting) {
                if (data[property] === undefined) { continue; }
        
                switch (typeof(Setting[property])) {
                    case "string":
                        Setting[property] = String(data[property])
                        break;
        
                    case "number":
                        Setting[property] = Number(data[property])
                        break;
        
                    case "boolean":
                        Setting[property] = JSON.parse(String(data[property]).toLowerCase())
                        break;
                }
            }
        } catch {}
    } else {
        let primaryDisplay = screen.getPrimaryDisplay()
        let { width, height } = primaryDisplay.workAreaSize

        Setting.X = (width - Setting.Width) / 2
        Setting.Y =  (height - Setting.Height) / 2
    }

    window = new BrowserWindow({
        title: `${app.getName()} (ver${app.getVersion()})`,
        show: false,
        maximizable: false,
        hasShadow: false,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        },
    })

    window.setBounds({ x: Setting.X, y: Setting.Y, width: Setting.Width, height: Setting.Height })

    window.on('resized', () => {
        if (window.isFullScreen()) {
            return
        }

        let bounds = window.getBounds()

        Setting.X = bounds.x
        Setting.Y = bounds.y
        Setting.Width = bounds.width
        Setting.Height = bounds.height
        
        window.webContents.postMessage("function", `window_width.value = "${bounds.width}"`)
        window.webContents.postMessage("function", `window_height.value = "${bounds.height}"`)
    })

    window.on('moved', () => {
        if (window.isFullScreen()) {
            return
        }

        let bounds = window.getBounds()

        Setting.X = bounds.x
        Setting.Y = bounds.y
        Setting.Width = bounds.width
        Setting.Height = bounds.height
    })


    window.setMenu(null);

    if (Setting.auto_update_check === true) {
        checkUpdate()
    }

    window.once('ready-to-show', () => {
        window.show()

        if (!app.isPackaged) {
            window.webContents.openDevTools()
        }
    })

    window.loadFile("index.html")

    window.webContents.on("did-finish-load", () => {
        window.webContents.postMessage("function", `
            delete_shortcut.value = "${Setting.delete_shortcut}"
            play_shortcut.value = "${Setting.play_shortcut}"
            rewind_shortcut.value = "${Setting.rewind_shortcut}"
            forward_shortcut.value = "${Setting.forward_shortcut}"
            volume_shortcut.value = "${Setting.volume_shortcut}"
            volumeup_shortcut.value = "${Setting.volumeup_shortcut}"
            volumedown_shortcut.value = "${Setting.volumedown_shortcut}"
            loop_shortcut.value = "${Setting.loop_shortcut}"
            slow_shortcut.value = "${Setting.slow_shortcut}"
            fast_shortcut.value = "${Setting.fast_shortcut}"
            monitoring_shortcut.value = "${Setting.monitoring_shortcut}"
            pen_shortcut1.value = "${Setting.pen_shortcut1}"
            pen_shortcut2.value = "${Setting.pen_shortcut2}"
            pen_shortcut3.value = "${Setting.pen_shortcut3}"
            pen_shortcut4.value = "${Setting.pen_shortcut4}"
            pen_shortcut5.value = "${Setting.pen_shortcut5}"
            pen_shortcut6.value = "${Setting.pen_shortcut6}"
            pen_shortcut7.value = "${Setting.pen_shortcut7}"
            pen_shortcut8.value = "${Setting.pen_shortcut8}"
            pen_shortcut9.value = "${Setting.pen_shortcut9}"
            pen_shortcut0.value = "${Setting.pen_shortcut0}"
            window_fix_shortcut.value = "${Setting.window_fix_shortcut}"
            fullscreen_shortcut.value = "${Setting.fullscreen_shortcut}"
            fromt_most_shortcut.value = "${Setting.fromt_most_shortcut}"

            pen_color1.value = "${Setting.pen_color1}"
            pen_color2.value = "${Setting.pen_color2}"
            pen_color3.value = "${Setting.pen_color3}"
            pen_color4.value = "${Setting.pen_color4}"
            pen_color5.value = "${Setting.pen_color5}"
            pen_color6.value = "${Setting.pen_color6}"
            pen_color7.value = "${Setting.pen_color7}"
            pen_color8.value = "${Setting.pen_color8}"
            pen_color9.value = "${Setting.pen_color9}"
            pen_color0.value = "${Setting.pen_color0}"
            initPenColor()

            monirotring_folder.value = "${Setting.monirotring_folder_reference.replace('\\', '\\\\')}"
            volume_range.value = ${Setting.volume_range}
            volume_range_step.value = ${Setting.volume_range_step}
            volume_range_step.dataset.value = ${Setting.volume_range_step}
            slow_ratio.value = ${Setting.slow_ratio}
            slow_ratio.dataset.value = ${Setting.slow_ratio}
            fast_ratio.value = ${Setting.fast_ratio}
            fast_ratio.dataset.value = ${Setting.fast_ratio}
            changePenColorSelected("${Setting.pen_color_selector}")
            window_width.value = "${Setting.Width}"
            window_width.dataset.value = "${Setting.Width}"
            window_height.value = "${Setting.Height}"
            window_height.dataset.value = "${Setting.Height}"
            rewind_forward_seconds.value = "${Setting.rewind_forward_seconds}"
            rewind_forward_seconds.dataset.value = "${Setting.rewind_forward_seconds}"

            changeIconOrder("play_order", "${Setting.play_order}")
            changeIconOrder("rewind_order", "${Setting.rewind_order}")
            changeIconOrder("forward_order", "${Setting.forward_order}")
            changeIconOrder("seek_bar_order", "${Setting.seek_bar_order}")
            changeIconOrder("current_time_order", "${Setting.current_time_order}")
            changeIconOrder("volume_order", "${Setting.volume_order}")
            changeIconOrder("loop_order", "${Setting.loop_order}")
            changeIconOrder("slow_order", "${Setting.slow_order}")
            changeIconOrder("fast_order", "${Setting.fast_order}")
            changeIconOrder("monitoring_order", "${Setting.monitoring_order}")
            changeIconOrder("pen_color_order", "${Setting.pen_color_order}")
            changeIconOrder("window_fix_order", "${Setting.window_fix_order}")
            changeIconOrder("fullscreen_order", "${Setting.fullscreen_order}")
            changeIconOrder("fromt_most_order", "${Setting.fromt_most_order}")
            changeIconOrder("update_notification_order", "${Setting.update_notification_order}")
            changeIconOrder("shortcut_order", "${Setting.shortcut_order}")

            if (${Setting.volume_button}) { volume_button.click() }
            if (${Setting.loop_button}) { loop_button.click() }
            if (${Setting.slow_button}) { slow_button.click() }
            if (${Setting.fast_button}) { fast_button.click() }
            if (${Setting.monitoring_button}) { monitoring_button.click() }
            if (${Setting.window_fix_button}) { window_fix_button.click() }
            if (${Setting.fullscreen_button}) { fullscreen_button.click() }
            if (${Setting.fromt_most_button}) { fromt_most_button.click() }

            if (${Setting.auto_update_check}) { auto_update_check.click() }

            if (${Setting.play_button_show == false}) { play_button_show.click() }
            if (${Setting.rewind_button_show == false}) { rewind_button_show.click() }
            if (${Setting.forward_button_show == false}) { forward_button_show.click() }
            if (${Setting.seek_bar_show == false}) { seek_bar_show.click() }
            if (${Setting.current_time_show == false}) { current_time_show.click() }
            if (${Setting.volume_button_show == false}) { volume_button_show.click() }
            if (${Setting.loop_button_show == false}) { loop_button_show.click() }
            if (${Setting.slow_button_show == false}) { slow_button_show.click() }
            if (${Setting.fast_button_show == false}) { fast_button_show.click() }
            if (${Setting.monitoring_button_show == false}) { monitoring_button_show.click() }
            if (${Setting.pen_color_show == false}) { pen_color_show.click() }
            if (${Setting.window_fix_button_show == false}) { window_fix_button_show.click() }
            if (${Setting.fullscreen_button_show == false}) { fullscreen_button_show.click() }
            if (${Setting.fromt_most_button_show == false}) { fromt_most_button_show.click() }
            if (${Setting.update_notification_show == false}) { update_notification_show.click() }
            if (${Setting.shortcut_button_show == false}) { shortcut_button_show.click() }
        `);
    })
}

app.whenReady().then(() => {
    createWindow()

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow()
        }
    })
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        let json = {}

        for(let property in Setting) {
            json[property] = Setting[property]
        }

        fs.writeFileSync(`${path.resolve().replace("\\", "/")}/setting.json`, JSON.stringify(json))

        watcher?.close()
        app.quit()
    }
})

ipcMain.on("monirotring_folder_reference", async (event, args) => {
    return dialog
        .showOpenDialog(window, {
            title: "フォルダを指定してください",
            properties: ["openDirectory"],
        })
        .then((result) => {
            Setting.monirotring_folder_reference = result.filePaths[0].replaceAll("\\", "/")
            window.webContents.postMessage("function", `monirotring_folder.value = "${result.canceled ? "" : result.filePaths[0].replaceAll("\\", "/")}"`)
        })
        .catch((err) => console.error(err));
});

ipcMain.on("config", async (event, args) => {

    let fieldName = args.split(",")[0];
    let value = args.split(",")[1];

    Setting[fieldName] = value;
});

ipcMain.on("window_size_change", async (event, args) => {
    window.setBounds({ width: Number(args.split(",")[0]), height: Number(args.split(",")[1]) })

    Setting.Width = Number(args.split(",")[0]);
    Setting.Height = Number(args.split(",")[1]);
});

ipcMain.on("minitoring_on", async (event, args) => {
    fs.access(args, fs.constants.F_OK, (err) => {
        if (err) {
            window.webContents.postMessage("function", "monitoring_button.click()")
            return
        }

        watcher = chokidar.watch(args.replaceAll("\\", "/")
        , {
            persistent: false,
            ignoreInitial: true,
            awaitWriteFinish: true,
            depth: 0,
        })

        watcher.on('ready', (path, status) => {
            watcher.on('add', function (path, status) {
                if (path.endsWith(".mp4") === false) {
                    return
                }

                window.webContents.postMessage("function", `video.src = "${path.replaceAll("\\", "/")}"`)
            })
        })

    })
});

ipcMain.on("minitoring_off", async (event, args) => {
    watcher?.close()
});

ipcMain.on("window_fix_on", async (event, args) => {
    window.setResizable(false)
});

ipcMain.on("window_fix_off", async (event, args) => {
    window.setResizable(true)
});

ipcMain.on("fullscreen", async (event, args) => {
    window.setFullScreen(!window.isFullScreen())
});

ipcMain.on("fromt_most", async (event, args) => {
    window.setAlwaysOnTop(!window.isAlwaysOnTop())
});

ipcMain.on("check_update", async (event, args) => {
    checkUpdate()
});

ipcMain.on("update", async (event, args) => {
    fetch("https://github.com/Sentak-Ita/rakugaki_movie/releases/latest")
        .then(response => {
            shell.openExternal(response.url)
        })
});

function checkUpdate() {
    if (!app.isPackaged) {
        window.webContents.postMessage("function", "alert()")
        return
    }

    fetch("https://github.com/Sentak-Ita/rakugaki_movie/releases/latest")
        .then(response => {
            let latestVersion = response.url.replaceAll(/^.*\/([^\/]*)/g, "$1")

            if (app.getVersion() != latestVersion) {
                window.webContents.postMessage("function", "update_notification.dataset.canUpdate = true")
            }
        })
}

process.on("uncaughtException", (error) => {
    dialog.showErrorBox(error.name, error.stack)
    app.quit()
}); 