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
    /// ���C���t�H�[��
    /// </summary>
    public partial class Form1 : Form
    {
        /// <summary>
        /// �\��HTML�p�X
        /// </summary>
        string INDEX_FILE { get; } = @"resources\index.html";

        /// <summary>
        /// ����Ď������i�~���b�j
        /// </summary>
        int TIMER_INTERVAL { get; } = 1000;

        /// <summary>
        /// �Ώۊg���q
        /// </summary>
        string[] TARGET_EXTENSION { get; } = { ".mp4" };

        /// <summary>
        /// ���񃍁[�h�t���O
        /// </summary>
        bool isFirstLoad { get; set; } = true;

        /// <summary>
        /// ����Ď��^�C�}�[
        /// </summary>
        Timer timer { get; set; } = new Timer();

        /// <summary>
        /// ����Ď��Ώۃt�H���_�p�X
        /// </summary>
        string monitoringPath { get; set; } = "";

        /// <summary>
        /// �O��Ď��ŕ\���ΏۂɂȂ����t�@�C���̃p�X
        /// </summary>
        string lastFilePath { get; set; } = "";

        /// <summary>
        /// �J�n�J�n����
        /// </summary>
        /// <remarks>����ȍ~�ɍ쐬���ꂽ�t�@�C�����Ď��ΏۂƂ���</remarks>
        DateTime minitoringStartTime { get; set; }

        /// <summary>
        /// �O��Ď��ŕ\���ΏۂɂȂ����t�@�C���̍쐬����
        /// </summary>
        DateTime lastFileCreateDate { get; set; } = DateTime.MinValue;

        /// <summary>
        /// �t���X�N���[���\�����Ă��邩
        /// </summary>
        bool isMaximized { get; set; } = false;

        /// <summary>
        /// ��ʃT�C�Y���Œ肵�Ă��邩
        /// </summary>
        bool isWindowFixed { get; set; } = false;

        /// <summary>
        /// �E�B���h�E�\�����̉�ʃT�C�Y
        /// </summary>
        Rectangle before { get; set; } = new Rectangle();

        /// <summary>
        /// �R���X�g���N�^
        /// </summary>
        public Form1()
        {
            InitializeComponent();

            Setting.Load();
            SetPosition();
        }

        /// <summary>
        /// �E�B���h�E�̕\���ʒu�A�T�C�Y��ݒ肷��
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
        /// �t�H�[�����[�h�C�x���g
        /// </summary>
        /// <param name="sender">�C�x���g�\�[�X</param>
        /// <param name="e">�C�x���g�f�[�^</param>
        private void Form1_Load(object sender, EventArgs e)
        {
            InitializeWebViewAsync();
            InitializeTimer();
        }

        /// <summary>
        /// ����Ď��^�C�}�[������������
        /// </summary>
        private void InitializeTimer()
        {
            timer = new Timer(TIMER_INTERVAL);

            timer.SynchronizingObject = this;
            timer.Elapsed += Timer_Elapsed;
        }

        /// <summary>
        /// Webview2�R���g���[��������������
        /// </summary>
        public async void InitializeWebViewAsync()
        {
            var options = new CoreWebView2EnvironmentOptions("--disable-web-security --user-data-dir --disable-site-isolation-trials");
            var environment = await CoreWebView2Environment.CreateAsync(null, null, options);

            await webView2.EnsureCoreWebView2Async(environment);

            webView2.CoreWebView2.Settings.AreDefaultContextMenusEnabled = false;

#if DEBUG
#else
            webView2.CoreWebView2.Settings.AreBrowserAcceleratorKeysEnabled = false; //�t�@���N�V�����L�[����
#endif

            webView2.CoreWebView2.NewWindowRequested += CoreWebView2_NewWindowRequested;
            webView2.CoreWebView2.WebMessageReceived += CoreWebView2_MessageReceived;

            var uri = new UriBuilder(Path.Combine(Application.StartupPath, INDEX_FILE));
            webView2.CoreWebView2.Navigate(uri.ToString());
        }

        /// <summary>
        /// HTML�����_�����O�����C�x���g
        /// </summary>
        /// <param name="sender">�C�x���g�\�[�X</param>
        /// <param name="e">�C�x���g�f�[�^</param>
        private void webView2_NavigationCompleted(object sender, CoreWebView2NavigationCompletedEventArgs e)
        {
            SettingButtons();
        }

        /// <summary>
        /// �O��̃{�^���i���j�̐ݒ����ʂɔ��f����
        /// </summary>
        /// <remarks>���񃍁[�h���ɋN������������΂��̓�����Đ�����</remarks>
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
        /// JavaScript���烁�b�Z�[�W����M�����C�x���g
        /// </summary>
        /// <param name="sender">�C�x���g�\�[�X</param>
        /// <param name="e">�C�x���g�f�[�^</param>
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

                    fb.Description = "�t�H���_���w�肵�Ă��������B";
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
        /// ����̍Đ����Ԃ��擾����
        /// </summary>
        /// <param name="filePath"></param>
        /// <returns>����̍Đ����ԁ@�����悪�����������Ă��Ȃ��ꍇ�͋󕶎���Ԃ�</returns>
        /// <remarks>�Đ����Ԃ��擾�ł����琶�������Ƃ݂Ȃ�</remarks>
        public string GetVideoDurationText(string filePath)
        {
            var fileInfo = new FileInfo(filePath);
            var strFileName = fileInfo.FullName;
            var shellAppType = Type.GetTypeFromProgID("Shell.Application");
#pragma warning disable CS8600 // Null ���e�����܂��� Null �̉\��������l�� Null �񋖗e�^�ɕϊ����Ă��܂��B
#pragma warning disable CS8604 // Null �Q�ƈ����̉\��������܂��B
            dynamic shell = Activator.CreateInstance(shellAppType);
#pragma warning restore CS8604 // Null �Q�ƈ����̉\��������܂��B
#pragma warning restore CS8600 // Null ���e�����܂��� Null �̉\��������l�� Null �񋖗e�^�ɕϊ����Ă��܂��B

#pragma warning disable CS8602 // null �Q�Ƃ̉\����������̂̋t�Q�Ƃł��B
            var objFolder = shell.NameSpace(Path.GetDirectoryName(strFileName));
#pragma warning restore CS8602 // null �Q�Ƃ̉\����������̂̋t�Q�Ƃł��B
            var folderItem = objFolder.ParseName(Path.GetFileName(strFileName));

            var duration = objFolder.GetDetailsOf(folderItem, 27);

            return duration;
        }

        /// <summary>
        /// HTML�̓���Ď��{�^����ON�ɂ���
        /// </summary>
        private async void CheckOnMonitoringAsync()
        {
            await webView2.ExecuteScriptAsync($"monitoring_button.checked = true;");
        }

        /// <summary>
        /// �^�C�}�[�̊Ԋu�o�߃C�x���g
        /// </summary>
        /// <param name="sender">�C�x���g�\�[�X</param>
        /// <param name="e">�C�x���g�f�[�^</param>
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
        /// �O��̍Đ�����������V���������T��
        /// </summary>
        /// <returns>��������t�@�C���p�X�A�Ȃ�������null</returns>
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
        /// �V����Webview2�𐶐������C�x���g
        /// </summary>
        /// <param name="sender">�C�x���g�\�[�X</param>
        /// <param name="e">�C�x���g�f�[�^</param>
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
        /// �t�H�[�������Ă���Ƃ��ɔ������܂��B
        /// </summary>
        /// <param name="sender">�C�x���g�\�[�X</param>
        /// <param name="e">�C�x���g�f�[�^</param>
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
