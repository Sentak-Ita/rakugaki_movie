class Setting {

        /**
         * 音量ボタン設定 \
         * true：音出す　false：ミュート</remarks>
         */
        static volume_button = true;

        /**
         * ループ再生ボタン設定 \
         * true：ループする　false：しない</remarks>
         */
        static loop_button = false;

        /**
         * スローボタン設定 \
         * true：スロー再生　false：通常</remarks>
         */
        static slow_button = false;

        /**
         * 倍速ボタン設定 \
         * true：倍速再生　false：通常</remarks>
         */
        static fast_button = false;

        /**
         * 監視ボタン設定 \
         * true：監視する　false：しない</remarks>
         */
        static monitoring_button = false;

        /**
         * 画面サイズ固定ボタン設定 \
         * true：固定する　false：固定しない</remarks>
         */
        static window_fix_button = false;

        /**
         * フルスクリーンボタン設定 \
         * true：フルスクリーン表示　false：ウィンドウ表示</remarks>
         */
        static fullscreen_button = false;

        /**
         * 監視対象フォルダパス
         */
        static monirotring_folder_reference = "";

        /**
         * 自動更新チェック
         */
        static auto_update_check = false;

        /**
         * 再生/停止ボタン表示
         */
        static play_button_show = true;

        /**
         * 早戻しボタン表示
         */
        static rewind_button_show = true;

        /**
         * 早送りボタン表示
         */
        static forward_button_show = true;

        /**
         * シークバー表示
         */
        static seek_bar_show = true;

        /**
         * 再生時間表示
         */
        static current_time_show = true;

        /**
         * 音量ボタン表示
         */
        static volume_button_show = true;

        /**
         * ループ再生ボタン表示
         */
        static loop_button_show = true;

        /**
         * スローボタン表示
         */
        static slow_button_show = true;

        /**
         * 倍速ボタン表示
         */
        static fast_button_show = true;

        /**
         * 監視ボタン表示
         */
        static monitoring_button_show = true;

        /**
         * フルスクリーンボタン表示
         */
        static fullscreen_button_show = true;

        /**
         * 画面サイズ固定ボタン表示
         */
        static window_fix_button_show = true;

        /**
         * ペン色表示
         */
        static pen_color_show = true;

        /**
         * 更新通知表示
         */
        static update_notification_show = true;

        /**
         * ショートカットボタン表示
         */
        static shortcut_button_show = true;

        /**
         * 再生/停止表示順
         */
        static play_order = 1;

        /**
         * 早戻し表示順
         */
        static rewind_order = 2;

        /**
         * 早送り表示順
         */
        static forward_order = 3;

        /**
         * シークバー表示順
         */
        static seek_bar_order = 4;

        /**
         * 再生時間表示順
         */
        static current_time_order = 5;

        /**
         * 音量表示順
         */
        static volume_order = 6;

        /**
         * 繰り返し表示順
         */
        static loop_order = 7;

        /**
         * スロー表示順
         */
        static slow_order = 8;

        /**
         * 倍速表示順
         */
        static fast_order = 9;

        /**
         * 監視表示順
         */
        static monitoring_order = 10;

        /**
         * ペン表示順
         */
        static pen_color_order = 11;

        /**
         * 画面サイズ固定表示順
         */
        static window_fix_order = 12;

        /**
         * フルスクリーン表示順
         */
        static fullscreen_order = 13;

        /**
         * 更新通知表示順
         */
        static update_notification_order = 14;

        /**
         * ショートカット表示順
         */
        static shortcut_order = 15;

        /**
         * ウィンドウ初期表示位置設定済み \
         * true：前回の位置にウィンドウを表示する　false：初期位置にウィンドウを表示する</remarks>
         */
        static position = false;

        /**
         * 音量 \
         * 0～100</remarks>
         */
        static volume_range = 100;

        /**
         * 選択してるペンの色番号
         */
        static pen_color_selector = "pen_color1";

        /**
         * ペンの色１
         */
        static pen_color1 = "#000000";

        /**
         * ペンの色２
         */
        static pen_color2 = "#FF0000";

        /**
         * ペンの色３
         */
        static pen_color3 = "#00FF00";

        /**
         * ペンの色４
         */
        static pen_color4 = "#0000FF";

        /**
         * ペンの色５
         */
        static pen_color5 = "#FFFF00";

        /**
         * ペンの色６
         */
        static pen_color6 = "#FF00FF";

        /**
         * ペンの色７
         */
        static pen_color7 = "#00FFFF";

        /**
         * ペンの色８
         */
        static pen_color8 = "#FFFFFF";

        /**
         * ペンの色９
         */
        static pen_color9 = "#FFFFFF";

        /**
         * ペンの色０
         */
        static pen_color0 = "#FFFFFF";

        /**
         * 早戻し／早送り秒数 \
         * 0～100</remarks>
         */
        static rewind_forward_seconds = 10;

        /**
         * 音量増減 \
         * 0～100</remarks>
         */
        static volume_range_step = 10;

        /**
         * スロー倍率 \
         * 25～99</remarks>
         */
        static slow_ratio = 50;

        /**
         * 倍速倍率 \
         * 101～400</remarks>
         */
        static fast_ratio = 200;

        /**
         * 再生／停止ショートカット
         */
        static play_shortcut = "Space";

        /**
         * 早戻しショートカット
         */
        static rewind_shortcut = "ArrowLeft";

        /**
         * 早送りショートカット
         */
        static forward_shortcut = "ArrowRight";

        /**
         * ミュートショートカット
         */
        static volume_shortcut = "";

        /**
         * 音量上げるショートカット
         */
        static volumeup_shortcut = "WheelUp";

        /**
         * 音量下げるショートカット
         */
        static volumedown_shortcut = "WheelDown";

        /**
         * 繰り返しショートカット
         */
        static loop_shortcut = "";

        /**
         * スローショートカット
         */
        static slow_shortcut = "ArrowDown";

        /**
         * 倍速ショートカット
         */
        static fast_shortcut = "ArrowUp";

        /**
         * 監視ショートカット
         */
        static monitoring_shortcut = "";

        /**
         * 線削除ショートカット
         */
        static delete_shortcut = "Delete";

        /**
         * ペン１ショートカット
         */
        static pen_shortcut1 = "Digit1";

        /**
         * ペン２ショートカット
         */
        static pen_shortcut2 = "Digit2";

        /**
         * ペン３ショートカット
         */
        static pen_shortcut3 = "Digit3";

        /**
         * ペン４ショートカット
         */
        static pen_shortcut4 = "Digit4";

        /**
         * ペン５ショートカット
         */
        static pen_shortcut5 = "Digit5";

        /**
         * ペン６ショートカット
         */
        static pen_shortcut6 = "Digit6";

        /**
         * ペン７ショートカット
         */
        static pen_shortcut7 = "Digit7";

        /**
         * ペン８ショートカット
         */
        static pen_shortcut8 = "Digit8";

        /**
         * ペン９ショートカット
         */
        static pen_shortcut9 = "Digit9";

        /**
         * ペン０ショートカット
         */
        static pen_shortcut0 = "Digit0";

        /**
         * 画面サイズ固定ショートカット
         */
        static window_fix_shortcut = "";

        /**
         * フルスクリーンショートカット
         */
        static fullscreen_shortcut = "";

        /**
         * ウィンドウ横位置
         */
        static X = 0;

        /**
         * ウィンドウ縦位置
         */
        static Y = 0;

        /**
         * ウィンドウ幅
         */
        static Width = 800;

        /**
         * ウィンドウ高さ
         */
        static Height = 450;
}

module.exports = Setting;
