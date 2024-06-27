namespace WinFormsApp1
{
    /// <summary>
    /// 
    /// </summary>
    internal static class Program
    {
        /// <summary>
        /// エントリポイント
        /// </summary>
        [STAThread]
        static void Main()
        {
            AppDomain.CurrentDomain.UnhandledException += CurrentDomain_UnhandledException;
            Application.ThreadException += Application_ThreadException;
            ApplicationConfiguration.Initialize();
            Application.Run(new Form1());
        }

        /// <summary>
        /// アプリケーション ドメインによって処理されない例外によって発生したイベントを処理するメソッドを表します。
        /// </summary>>
        /// <param name="sender">イベントソース</param>
        /// <param name="e">イベントデータ</param>
        private static void CurrentDomain_UnhandledException(object sender, UnhandledExceptionEventArgs e)
        {
            MessageBox.Show($@"{((Exception)e.ExceptionObject)}", "エラー");
        }

        /// <summary>
        /// トラップされていないスレッド例外がスローされたときに発生します。
        /// </summary>>
        /// <param name="sender">イベントソース</param>
        /// <param name="e">イベントデータ</param>
        private static void Application_ThreadException(object sender, ThreadExceptionEventArgs e)
        {
            MessageBox.Show($@"{e.Exception}", "エラー");
        }
    }
}
