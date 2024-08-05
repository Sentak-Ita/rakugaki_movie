using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace rakugaki_movie
{
    /// <summary>
    /// 設定
    /// </summary>
    /// <remarks></remarks>
    static class Setting
    {
        /// <summary>
        /// 設定ファイル名
        /// </summary>
        public static string FILE_NAME = "setting.json";

        /// <summary>
        /// 設定ファイルフルパス
        /// </summary>
        public static string FULL_PATH = Path.Combine(Application.StartupPath, FILE_NAME);

        /// <summary>
        /// 音量ボタン設定
        /// </summary>
        /// <remarks>true：音出す　false：ミュート</remarks>
        public static bool volume_button { get; set; } = true;

        /// <summary>
        /// ループ再生ボタン設定
        /// </summary>
        /// <remarks>true：ループする　false：しない</remarks>
        public static bool loop_button { get; set; } = false;

        /// <summary>
        /// スローボタン設定
        /// </summary>
        /// <remarks>true：スロー再生　false：通常</remarks>
        public static bool slow_button { get; set; } = false;

        /// <summary>
        /// 倍速ボタン設定
        /// </summary>
        /// <remarks>true：倍速再生　false：通常</remarks>
        public static bool fast_button { get; set; } = false;

        /// <summary>
        /// 監視ボタン設定
        /// </summary>
        /// <remarks>true：監視する　false：しない</remarks>
        public static bool monitoring_button { get; set; } = false;

        /// <summary>
        /// フルスクリーンボタン設定
        /// </summary>
        /// <remarks>true：フルスクリーン表示　false：ウィンドウ表示</remarks>
        public static bool fullscreen_button { get; set; } = false;

        /// <summary>
        /// 画面サイズ固定ボタン設定
        /// </summary>
        /// <remarks>true：固定する　false：固定しない</remarks>
        public static bool window_fix_button { get; set; } = false;

        /// <summary>
        /// 監視対象フォルダパス
        /// </summary>
        public static string monirotring_folder_reference { get; set; } = "";

        /// <summary>
        /// 再生/停止ボタン表示
        /// </summary>
        public static bool play_button_show { get; set; } = true;

        /// <summary>
        /// 音量ボタン表示
        /// </summary>
        public static bool volume_button_show { get; set; } = true;

        /// <summary>
        /// ループ再生ボタン表示
        /// </summary>
        public static bool loop_button_show { get; set; } = true;

        /// <summary>
        /// スローボタン表示
        /// </summary>
        public static bool slow_button_show { get; set; } = true;

        /// <summary>
        /// 倍速ボタン表示
        /// </summary>
        public static bool fast_button_show { get; set; } = true;

        /// <summary>
        /// 監視ボタン表示
        /// </summary>
        public static bool monitoring_button_show { get; set; } = true;

        /// <summary>
        /// フルスクリーンボタン表示
        /// </summary>
        public static bool fullscreen_button_show { get; set; } = true;

        /// <summary>
        /// 画面サイズ固定ボタン表示
        /// </summary>
        public static bool window_fix_button_show { get; set; } = true;

        /// <summary>
        /// ペン色表示
        /// </summary>
        public static bool pen_color_show { get; set; } = true;

        /// <summary>
        /// ウィンドウ初期表示位置設定済み
        /// </summary>
        /// <remarks>true：前回の位置にウィンドウを表示する　false：初期位置にウィンドウを表示する</remarks>
        public static bool position { get; set; } = false;

        /// <summary>
        /// 音量
        /// </summary>
        /// <remarks>0～100</remarks>
        public static int volume_range { get; set; } = 100;

        /// <summary>
        /// ペンの色
        /// </summary>
        public static string pen_color { get; set; } = "#000000";

        /// <summary>
        /// ウィンドウ固定幅
        /// </summary>
        public static int window_fix_width { get; set; } = 1920;

        /// <summary>
        /// ウィンドウ固定高さ
        /// </summary>
        public static int window_fix_height { get; set; } = 1080;

        /// <summary>
        /// ウィンドウ横位置
        /// </summary>
        public static int X { get; set; } = 0;

        /// <summary>
        /// ウィンドウ縦位置
        /// </summary>
        public static int Y { get; set; } = 0;

        /// <summary>
        /// ウィンドウ幅
        /// </summary>
        public static int Width { get; set; } = 800;

        /// <summary>
        /// ウィンドウ高さ
        /// </summary>
        public static int Height { get; set; } = 450;

        /// <summary>
        /// 設定を読み込む
        /// </summary>
        public static void Load()
        {
            if (File.Exists(FULL_PATH) == false)
            {
                return;
            }

            JObject json;

            using (var reader = new StreamReader(FULL_PATH))
            {
                json = JObject.Parse(reader.ReadToEnd());
            }

            typeof(Setting).GetProperties()
                .ToList()
                .ForEach(property =>
                {
                    if (json.TryGetValue(property.Name, out var value) == true)
                    {
                        property.SetValue(null, value.ToObject(property.PropertyType));
                    }
                });
        }

        /// <summary>
        /// 設定を保存する
        /// </summary>
        public static void Save()
        {
            var json = new JObject();

            typeof(Setting).GetProperties()
                .ToList()
                .ForEach(property =>
                {
#pragma warning disable CS8604 // Null 参照引数の可能性があります。
                    json[property.Name] = JToken.FromObject(property.GetValue(null));
#pragma warning restore CS8604 // Null 参照引数の可能性があります。
                });

            using (var writer = new StreamWriter(FULL_PATH))
            {
                writer.WriteLine(JsonConvert.SerializeObject(json, Formatting.Indented));
            }
        }
    }
}
