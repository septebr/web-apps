import React, { useEffect } from 'react';
import { f7 } from 'framework7-react';
import { useTranslation } from 'react-i18next';
import IrregularStack from "../../../../common/mobile/utils/IrregularStack";

const LongActionsController = () => {
    const {t} = useTranslation();
    const _t = t("LongActions", { returnObjects: true });

    const ApplyEditRights = -255;
    const LoadingDocument = -256;

    const stackLongActions = new IrregularStack({
        strongCompare   : function(obj1, obj2){return obj1.id === obj2.id && obj1.type === obj2.type;},
        weakCompare     : function(obj1, obj2){return obj1.type === obj2.type;}
    });

    let loadMask = null;

    const closePreloader = () => {
        if (loadMask && loadMask.el) {
            f7.dialog.close(loadMask.el);
        }
    };

    useEffect( () => {
        Common.Notifications.on('engineCreated', (api) => {
            api.asc_registerCallback('asc_onStartAction', onLongActionBegin);
            api.asc_registerCallback('asc_onEndAction', onLongActionEnd);
            api.asc_registerCallback('asc_onOpenDocumentProgress', onOpenDocument);
            api.asc_registerCallback('asc_onConfirmAction', onConfirmAction);
        });
        Common.Notifications.on('preloader:endAction', onLongActionEnd);
        Common.Notifications.on('preloader:beginAction', onLongActionBegin);
        Common.Notifications.on('preloader:close', closePreloader);

        return ( () => {
            const api = Common.EditorApi.get();
            api.asc_unregisterCallback('asc_onStartAction', onLongActionBegin);
            api.asc_unregisterCallback('asc_onEndAction', onLongActionEnd);
            api.asc_unregisterCallback('asc_onOpenDocumentProgress', onOpenDocument);
            api.asc_unregisterCallback('asc_onConfirmAction', onConfirmAction);

            Common.Notifications.off('preloader:endAction', (type, id) => {
                if (stackLongActions.exist({id: id, type: type})) {
                    onLongActionEnd(type, id);
                }
            });
            Common.Notifications.off('preloader:beginAction', onLongActionBegin);
            Common.Notifications.off('preloader:close', closePreloader);
        })
    });

    const onLongActionBegin = (type, id) => {
        const action = {id: id, type: type};
        stackLongActions.push(action);
        setLongActionView(action);
    };

    const onLongActionEnd = (type, id) => {
        let action = {id: id, type: type};
        stackLongActions.pop(action);

        //this.updateWindowTitle(true);

        action = stackLongActions.get({type: Asc.c_oAscAsyncActionType.Information});

        if (action) {
            setLongActionView(action)
        }

        action = stackLongActions.get({type: Asc.c_oAscAsyncActionType.BlockInteraction});

        if (action) {
            setLongActionView(action)
        } else {
            loadMask && loadMask.el && loadMask.el.classList.contains('modal-in') && f7.dialog.close(loadMask.el);
        }
    };

    const setLongActionView = (action) => {
        let title = '';
        let text = '';
        switch (action.id) {
            case Asc.c_oAscAsyncAction['Open']:
                title   = _t.openTitleText;
                text    = _t.openTextText;
                break;

            case Asc.c_oAscAsyncAction['Save']:
                title   = _t.saveTitleText;
                text    = _t.saveTextText;
                break;

            case Asc.c_oAscAsyncAction['LoadDocumentFonts']:
                title   = _t.loadFontsTitleText;
                text    = _t.loadFontsTextText;
                break;

            case Asc.c_oAscAsyncAction['LoadDocumentImages']:
                title   = _t.loadImagesTitleText;
                text    = _t.loadImagesTextText;
                break;

            case Asc.c_oAscAsyncAction['LoadFont']:
                title   = _t.loadFontTitleText;
                text    = _t.loadFontTextText;
                break;

            case Asc.c_oAscAsyncAction['LoadImage']:
                title   = _t.loadImageTitleText;
                text    = _t.loadImageTextText;
                break;

            case Asc.c_oAscAsyncAction['DownloadAs']:
                title   = _t.downloadTitleText;
                text    = _t.downloadTextText;
                break;

            case Asc.c_oAscAsyncAction['Print']:
                title   = _t.printTitleText;
                text    = _t.printTextText;
                break;

            case Asc.c_oAscAsyncAction['UploadImage']:
                title   = _t.uploadImageTitleText;
                text    = _t.uploadImageTextText;
                break;

            case Asc.c_oAscAsyncAction['ApplyChanges']:
                title   = _t.applyChangesTitleText;
                text    = _t.applyChangesTextText;
                break;

            case Asc.c_oAscAsyncAction['PrepareToSave']:
                title   = _t.savePreparingText;
                text    = _t.savePreparingTitle;
                break;

            case Asc.c_oAscAsyncAction['MailMergeLoadFile']:
                title   = _t.mailMergeLoadFileText;
                text    = _t.mailMergeLoadFileTitle;
                break;

            case Asc.c_oAscAsyncAction['DownloadMerge']:
                title   = _t.downloadMergeTitle;
                text    = _t.downloadMergeText;
                break;

            case Asc.c_oAscAsyncAction['SendMailMerge']:
                title   = _t.sendMergeTitle;
                text    = _t.sendMergeText;
                break;

            case Asc.c_oAscAsyncAction['Waiting']:
                title   = _t.waitText;
                text    = _t.waitText;
                break;

            case ApplyEditRights:
                title   = _t.txtEditingMode;
                text    = _t.txtEditingMode;
                break;

            case LoadingDocument:
                title   = _t.loadingDocumentTitleText;
                text    = _t.loadingDocumentTextText;
                break;
            default:
                if (typeof action.id == 'string'){
                    title   = action.id;
                    text    = action.id;
                }
                break;
        }

        if (action.type == Asc.c_oAscAsyncActionType.BlockInteraction) {
            if (loadMask && loadMask.el && loadMask.el.classList.contains('modal-in')) {
                loadMask.el.getElementsByClassName('dialog-title')[0].innerHTML = title;
            } else {
                loadMask = f7.dialog.preloader(title);
            }
        }

    };

    const onConfirmAction = (id, apiCallback) => {
        if (id === Asc.c_oAscConfirm.ConfirmReplaceRange) {
            f7.dialog.create({
                title: _t.notcriticalErrorTitle,
                text: _t.confirmMoveCellRange,
                buttons: [
                    {text: _t.textYes,
                        onClick: () => {
                            if (apiCallback) apiCallback(true);
                        }},
                    {text: _t.textNo,
                        onClick: () => {
                            if (apiCallback) apiCallback(false);
                        }}
                ],
            }).open();
        } else if (id === Asc.c_oAscConfirm.ConfirmPutMergeRange) {
            f7.dialog.create({
                title: _t.notcriticalErrorTitle,
                text: _t.confirmPutMergeRange,
                buttons: [
                    {text: _t.textOk,
                        onClick: () => {
                            if (apiCallback) apiCallback();
                        }},
                ],
            }).open();
        }
    };

    const onOpenDocument = (progress) => {
        if (loadMask && loadMask.el) {
            const $title = loadMask.el.getElementsByClassName('dialog-title')[0];
            const proc = (progress.asc_getCurrentFont() + progress.asc_getCurrentImage())/(progress.asc_getFontsCount() + progress.asc_getImagesCount());

            $title.innerHTML = `${_t.textLoadingDocument}: ${Math.min(Math.round(proc * 100), 100)}%`;
        }
    };

    return null;
};

export default LongActionsController;