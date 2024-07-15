require([
    'common/main/lib/controller/ScreenReaderFocus',
    'common/main/lib/component/ListView',
    'common/main/lib/view/AdvancedSettingsWindow',
    'common/main/lib/view/AutoCorrectDialog',
    'common/main/lib/view/DocumentAccessDialog',
    'common/main/lib/view/UserNameDialog',
    'common/main/lib/view/SaveAsDlg',
    'common/main/lib/view/CopyWarningDialog',
    'common/main/lib/view/ImageFromUrlDialog',
    'common/main/lib/view/SelectFileDlg',
    'common/main/lib/view/SymbolTableDialog',
    'common/main/lib/view/OpenDialog',
    'common/main/lib/view/InsertTableDialog',
    'common/main/lib/view/SearchDialog'
], function () {
    Common.NotificationCenter.trigger('script:loaded');
});