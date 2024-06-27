namespace WinFormsApp1
{
    /// <summary>
    /// 
    /// </summary>
    internal static class Program
    {
        /// <summary>
        /// �G���g���|�C���g
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
        /// �A�v���P�[�V���� �h���C���ɂ���ď�������Ȃ���O�ɂ���Ĕ��������C�x���g���������郁�\�b�h��\���܂��B
        /// </summary>>
        /// <param name="sender">�C�x���g�\�[�X</param>
        /// <param name="e">�C�x���g�f�[�^</param>
        private static void CurrentDomain_UnhandledException(object sender, UnhandledExceptionEventArgs e)
        {
            MessageBox.Show($@"{((Exception)e.ExceptionObject)}", "�G���[");
        }

        /// <summary>
        /// �g���b�v����Ă��Ȃ��X���b�h��O���X���[���ꂽ�Ƃ��ɔ������܂��B
        /// </summary>>
        /// <param name="sender">�C�x���g�\�[�X</param>
        /// <param name="e">�C�x���g�f�[�^</param>
        private static void Application_ThreadException(object sender, ThreadExceptionEventArgs e)
        {
            MessageBox.Show($@"{e.Exception}", "�G���[");
        }
    }
}
