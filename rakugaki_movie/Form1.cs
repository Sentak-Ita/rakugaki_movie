using Microsoft.Web.WebView2.Core;
//using Microsoft.WindowsAPICodePack.Dialogs;
using rakugaki_movie;
using Shell32;
using System.Configuration;
using System.Diagnostics;
using System.Timers;
using Timer = System.Timers.Timer;

namespace WinFormsApp1
{
    /// <summary>
    /// メインフォーム
    /// </summary>
    public partial class Form1 : Form
    {
        /// <summary>
        /// 表示HTMLパス
        /// </summary>
        string INDEX_FILE { get; } = @"resources\index.html";

        /// <summary>
        /// 動画監視周期（ミリ秒）
        /// </summary>
        int TIMER_INTERVAL { get; } = 1000;

        /// <summary>
        /// 対象拡張子
        /// </summary>
        string[] TARGET_EXTENSION { get; } = { ".mp4" };

        /// <summary>
        /// 初回ロードフラグ
        /// </summary>
        bool isFirstLoad { get; set; } = true;

        /// <summary>
        /// 動画監視タイマー
        /// </summary>
        Timer timer { get; set; } = new Timer();

        /// <summary>
        /// 動画監視対象フォルダパス
        /// </summary>
        string monitoringPath { get; set; } = "";

        /// <summary>
        /// 前回監視で表示対象になったファイルのパス
        /// </summary>
        string lastFilePath { get; set; } = "";

        /// <summary>
        /// 開始開始日時
        /// </summary>
        /// <remarks>これ以降に作成されたファイルを監視対象とする</remarks>
        DateTime minitoringStartTime { get; set; }

        /// <summary>
        /// 前回監視で表示対象になったファイルの作成日時
        /// </summary>
        DateTime lastFileCreateDate { get; set; } = DateTime.MinValue;

        /// <summary>
        /// フルスクリーン表示しているか
        /// </summary>
        bool isMaximized { get; set; } = false;

        /// <summary>
        /// 画面サイズを固定しているか
        /// </summary>
        bool isWindowFixed { get; set; } = false;

        /// <summary>
        /// ウィンドウ表示時の画面サイズ
        /// </summary>
        Rectangle before { get; set; } = new Rectangle();

        /// <summary>
        /// コンストラクタ
        /// </summary>
        public Form1()
        {
            InitializeComponent();

            Setting.Load();
            SetPosition();
        }

        /// <summary>
        /// ウィンドウの表示位置、サイズを設定する
        /// </summary>
        private void SetPosition()
        {
            if (!Setting.position)
            {
                return;
            }

            this.StartPosition = FormStartPosition.Manual;
            this.Left = Setting.X;
            this.Top = Setting.Y;
            this.Width = Setting.Width;
            this.Height = Setting.Height;
        }

        /// <summary>
        /// フォームロードイベント
        /// </summary>
        /// <param name="sender">イベントソース</param>
        /// <param name="e">イベントデータ</param>
        private void Form1_Load(object sender, EventArgs e)
        {
            InitializeWebViewAsync();
            InitializeTimer();
        }

        /// <summary>
        /// 動画監視タイマーを初期化する
        /// </summary>
        private void InitializeTimer()
        {
            timer = new Timer(TIMER_INTERVAL);

            timer.SynchronizingObject = this;
            timer.Elapsed += Timer_Elapsed;
        }

        /// <summary>
        /// Webview2コントロールを初期化する
        /// </summary>
        public async void InitializeWebViewAsync()
        {
            var options = new CoreWebView2EnvironmentOptions("--disable-web-security --user-data-dir --disable-site-isolation-trials");
            var environment = await CoreWebView2Environment.CreateAsync(null, null, options);

            await webView2.EnsureCoreWebView2Async(environment);

            webView2.CoreWebView2.Settings.AreDefaultContextMenusEnabled = false;

#if DEBUG
#else
            webView2.CoreWebView2.Settings.AreBrowserAcceleratorKeysEnabled = false; //ファンクションキー無効
#endif

            webView2.CoreWebView2.NewWindowRequested += CoreWebView2_NewWindowRequested;
            webView2.CoreWebView2.WebMessageReceived += CoreWebView2_MessageReceived;

            var uri = new UriBuilder(Path.Combine(Application.StartupPath, INDEX_FILE));
            webView2.CoreWebView2.Navigate(uri.ToString());
        }

        /// <summary>
        /// HTMLレンダリング完了イベント
        /// </summary>
        /// <param name="sender">イベントソース</param>
        /// <param name="e">イベントデータ</param>
        private void webView2_NavigationCompleted(object sender, CoreWebView2NavigationCompletedEventArgs e)
        {
            SettingButtons();
        }

        /// <summary>
        /// 前回のボタン（等）の設定を画面に反映する
        /// </summary>
        /// <remarks>初回ロード時に起動引数があればその動画を再生する</remarks>
        private async void SettingButtons()
        {
            await webView2.ExecuteScriptAsync(@$"monirotring_folder.value = '{Setting.monirotring_folder_reference.Replace(@"\", @"\\")}'");
            await webView2.ExecuteScriptAsync(@$"volume_range.value = {Setting.volume_range}");
            await webView2.ExecuteScriptAsync(@$"set_pen_color('{Setting.pen_color}')");
            await webView2.ExecuteScriptAsync(@$"window_width.value = '{this.Width}'");
            await webView2.ExecuteScriptAsync(@$"window_height.value = '{this.Height}'");

            if (Setting.fullscreen_button)
            {
                await webView2.ExecuteScriptAsync("fullscreen_button.click();");
            }
            if (Setting.window_fix_button)
            {
                await webView2.ExecuteScriptAsync("window_fix_button.click();");
            }
            if (Setting.volume_button)
            {
                await webView2.ExecuteScriptAsync("volume_button.click();");
            }
            if (Setting.loop_button)
            {
                await webView2.ExecuteScriptAsync("loop_button.click();");
            }
            if (Setting.slow_button)
            {
                await webView2.ExecuteScriptAsync("slow_button.click();");
            }
            if (Setting.fast_button)
            {
                await webView2.ExecuteScriptAsync("fast_button.click();");
            }
            if (Setting.monitoring_button)
            {
                await webView2.ExecuteScriptAsync("monitoring_button.click();");
            }
            if (Setting.play_button_show == false)
            {
                await webView2.ExecuteScriptAsync("play_button_show.click();");
            }
            if (Setting.volume_button_show == false)
            {
                await webView2.ExecuteScriptAsync("volume_button_show.click();");
            }
            if (Setting.loop_button_show == false)
            {
                await webView2.ExecuteScriptAsync("loop_button_show.click();");
            }
            if (Setting.slow_button_show == false)
            {
                await webView2.ExecuteScriptAsync("slow_button_show.click();");
            }
            if (Setting.fast_button_show == false)
            {
                await webView2.ExecuteScriptAsync("fast_button_show.click();");
            }
            if (Setting.monitoring_button_show == false)
            {
                await webView2.ExecuteScriptAsync("monitoring_button_show.click();");
            }
            if (Setting.fullscreen_button_show == false)
            {
                await webView2.ExecuteScriptAsync("fullscreen_button_show.click();");
            }
            if (Setting.window_fix_button_show == false)
            {
                await webView2.ExecuteScriptAsync("window_fix_button_show.click();");
            }
            if (Setting.pen_color_show == false)
            {
                await webView2.ExecuteScriptAsync("pen_color_show.click();");
            }

            if (isFirstLoad && Environment.GetCommandLineArgs().Length > 1)
            {
                await webView2.ExecuteScriptAsync($"video.src = '{"file:///" + Environment.GetCommandLineArgs()[1].ToString().Replace(@"\", "/")}';");
            }

            isFirstLoad = false;
        }

        /// <summary>
        /// JavaScriptからメッセージを受信したイベント
        /// </summary>
        /// <param name="sender">イベントソース</param>
        /// <param name="e">イベントデータ</param>
        private async void CoreWebView2_MessageReceived(object? sender, CoreWebView2WebMessageReceivedEventArgs e)
        {
            var command = e.TryGetWebMessageAsString().Split(',');

            switch (command[0])
            {
                case "minitoring_on":
                    if (timer.Enabled)
                    {
                        await webView2.ExecuteScriptAsync("monitoring_button.checked = false;");
                        return;
                    }

                    if (command[1] == "")
                    {
                        await webView2.ExecuteScriptAsync("monitoring_button.checked = false;");
                        return;
                    }

                    if (Directory.Exists(command[1]) == false)
                    {
                        await webView2.ExecuteScriptAsync("monitoring_button.checked = false;");
                        return;
                    }

                    monitoringPath = command[1];
                    minitoringStartTime = DateTime.Now;
                    CheckOnMonitoringAsync();
                    timer.Start();
                    break;

                case "minitoring_off":
                    timer.Stop();
                    break;

                case "fullscreen_on":
                    FullScreenOn();
                    break;

                case "fullscreen_off":
                    FullScreenOff();
                    break;

                case "window_fix_on":
                    WindowFixOn();
                    break;

                case "window_fix_off":
                    WindowFixOff();
                    break;

                case "monirotring_folder_reference":
                    var fb = new FolderBrowserDialog();

                    fb.Description = "フォルダを指定してください。";
                    fb.RootFolder = Environment.SpecialFolder.Desktop;
                    fb.SelectedPath = Setting.monirotring_folder_reference;

                    if (fb.ShowDialog(this) != DialogResult.OK)
                    {
                        return;
                    }

                    Setting.monirotring_folder_reference = fb.SelectedPath;
                    await webView2.ExecuteScriptAsync(@$"monirotring_folder.value = '{fb.SelectedPath.Replace(@"\", @"\\")}'");
                    break;

                case "window_size_change":
                    if (isMaximized == true)
                    {
                        return;
                    }

                    this.Width = int.Parse(command[1]);
                    this.Height = int.Parse(command[2]);
                    break;

                case "config":
                    if (command[1] == "")
                    {
                        return;
                    }
                    var property = typeof(Setting).GetProperty(command[1]);
                    if (property == null)
                    {
                        return;
                    }

                    switch (property.PropertyType)
                    {
                        case Type @_ when @_ == typeof(string):
                            property.SetValue(null, command[2]);
                            break;

                        case Type @_ when @_ == typeof(bool):
                            property.SetValue(null, bool.Parse(command[2]));
                            break;

                        case Type @_ when @_ == typeof(int):
                            property.SetValue(null, int.Parse(command[2]));
                            break;
                    }
                    break;
            }
        }

        /// <summary>
        /// 動画の再生時間を取得する
        /// </summary>
        /// <param name="filePath"></param>
        /// <returns>動画の再生時間　※動画が生成完了していない場合は空文字を返す</returns>
        /// <remarks>再生時間が取得できたら生成完了とみなす</remarks>
        public string GetVideoDurationText(string filePath)
        {
            var fileInfo = new FileInfo(filePath);
            var strFileName = fileInfo.FullName;
            var shellAppType = Type.GetTypeFromProgID("Shell.Application");
#pragma warning disable CS8600 // Null リテラルまたは Null の可能性がある値を Null 非許容型に変換しています。
#pragma warning disable CS8604 // Null 参照引数の可能性があります。
            dynamic shell = Activator.CreateInstance(shellAppType);
#pragma warning restore CS8604 // Null 参照引数の可能性があります。
#pragma warning restore CS8600 // Null リテラルまたは Null の可能性がある値を Null 非許容型に変換しています。

#pragma warning disable CS8602 // null 参照の可能性があるものの逆参照です。
            var objFolder = shell.NameSpace(Path.GetDirectoryName(strFileName));
#pragma warning restore CS8602 // null 参照の可能性があるものの逆参照です。
            var folderItem = objFolder.ParseName(Path.GetFileName(strFileName));

            var duration = objFolder.GetDetailsOf(folderItem, 27);

            return duration;
        }

        /// <summary>
        /// HTMLの動画監視ボタンをONにする
        /// </summary>
        private async void CheckOnMonitoringAsync()
        {
            await webView2.ExecuteScriptAsync($"monitoring_button.checked = true;");
        }

        /// <summary>
        /// タイマーの間隔経過イベント
        /// </summary>
        /// <param name="sender">イベントソース</param>
        /// <param name="e">イベントデータ</param>
        private void Timer_Elapsed(object? sender, ElapsedEventArgs e)
        {
            var newestFile = SearchNewestVideo();

            if (newestFile == null)
            {
                return;
            }

            lastFilePath = newestFile;
            lastFileCreateDate = File.GetCreationTime(newestFile);

            VideoSrcChangeAsync();
        }

        /// <summary>
        /// 前回の再生した動画より新しい動画を探す
        /// </summary>
        /// <returns>あったらファイルパス、なかったらnull</returns>
        private string? SearchNewestVideo()
        {
            var newestFile = Directory.GetFiles(monitoringPath)
                .Where(file => TARGET_EXTENSION.Contains(Path.GetExtension(file)))
                .Where(file => File.GetCreationTime(file) > minitoringStartTime)
                .OrderByDescending(file => File.GetCreationTime(file))
                .FirstOrDefault();

            if (newestFile == null)
            {
                return null;
            }

            if (newestFile == lastFilePath)
            {
                return null;
            }

            if (File.GetCreationTime(newestFile) <= lastFileCreateDate)
            {
                return null;
            }

            if (GetVideoDurationText(newestFile) == "")
            {
                return null;
            }

            return newestFile;
        }

        /// <summary>
        /// 
        /// </summary>
        private async void VideoSrcChangeAsync()
        {
            await webView2.ExecuteScriptAsync($"video.src = '{"file:///" + lastFilePath.Replace(@"\", "/")}';");
        }

        /// <summary>
        /// 新しくWebview2を生成したイベント
        /// </summary>
        /// <param name="sender">イベントソース</param>
        /// <param name="e">イベントデータ</param>
        private async void CoreWebView2_NewWindowRequested(object? sender, CoreWebView2NewWindowRequestedEventArgs e)
        {
            e.Handled = true;

            var decordedFilePath = System.Web.HttpUtility.UrlDecode(e.Uri.ToString());

            await webView2.ExecuteScriptAsync($"video.src = '{decordedFilePath}';");
        }

        /// <summary>
        /// 
        /// </summary>
        private void FullScreenOn()
        {
            this.FormBorderStyle = FormBorderStyle.None;

            before = new Rectangle(this.Left, this.Top, this.Width, this.Height);

            var workingarea = Screen.FromControl(this);
            this.Left = workingarea.Bounds.X;
            this.Top = workingarea.Bounds.Y;
            this.Width = workingarea.Bounds.Width;
            this.Height = workingarea.Bounds.Height;

            isMaximized = true;
        }

        /// <summary>
        /// 
        /// </summary>
        private void FullScreenOff()
        {
            this.Left = before.X;
            this.Top = before.Y;
            this.Width = before.Width;
            this.Height = before.Height;

            this.FormBorderStyle = FormBorderStyle.Sizable;

            isMaximized = false;

            if (isWindowFixed == true)
            {
                this.FormBorderStyle = FormBorderStyle.FixedSingle;
            }
        }


        /// <summary>
        /// 
        /// </summary>
        private void WindowFixOn()
        {
            isWindowFixed = true;

            if (isMaximized == true)
            {
                return;
            }

            this.FormBorderStyle = FormBorderStyle.FixedSingle;
        }

        /// <summary>
        /// 
        /// </summary>
        private void WindowFixOff()
        {
            isWindowFixed = false;

            if (isMaximized == true)
            {
                return;
            }

            this.FormBorderStyle = FormBorderStyle.Sizable;
        }

        /// <summary>
        /// フォームが閉じているときに発生します。
        /// </summary>
        /// <param name="sender">イベントソース</param>
        /// <param name="e">イベントデータ</param>
        private void Form1_FormClosing(object sender, FormClosingEventArgs e)
        {
            if (isMaximized)
            {
                Setting.X = before.X;
                Setting.Y = before.Y;
                Setting.Width = before.Width;
                Setting.Height = before.Height;
            }
            else
            {
                Setting.X = this.Left;
                Setting.Y = this.Top;
                Setting.Width = this.Width;
                Setting.Height = this.Height;
            }

            Setting.monitoring_button = timer.Enabled;
            Setting.window_fix_button = isWindowFixed;
            Setting.fullscreen_button = isMaximized;
            Setting.position = true;
            Setting.Save();
        }


        private async void Form1_ResizeEnd(object sender, EventArgs e)
        {
            if (isFirstLoad == true)
            {
                return;
            }

            await webView2.ExecuteScriptAsync(@$"window_width.value = '{this.Width}'");
            await webView2.ExecuteScriptAsync(@$"window_height.value = '{this.Height}'");
        }
    }
}
