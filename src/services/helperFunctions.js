import _ from "lodash";
import { Platform } from "react-native";
import RNFS from "react-native-fs";
import FileViewer from "react-native-file-viewer";
import { showMessage } from "react-native-flash-message";

export const showNotificationMessage = (title = "", message = "", options = {}) => {
  showMessage({
    message: title,
    description: message,
    type: "info",
    hideOnPress: true,
    animated: true,
    autoHide: true,
    duration: 3000,
    hideStatusBar: true,
    floating: true,
    position: "top",
    ...options,
  });
};

export const getMessageText = (message = "", messageObject = {}) => {
  const msg = message || "";
  const msgObj = messageObject || {};
  const messageText = _.map(Object.values(msgObj), (val) => val[0] || "").filter(v => v).join("\n");
  return `${msg}\n${messageText}`;
};

export const getErrorMessage = (error = {}) => {
  const { message = "", response = {} } = error;
  const { data = {} } = response;
  if (!_.isEmpty(data)) {
    const { errors = {}, message: eMsg = "" } = data;
    const errorMessage = getMessageText(_.isEmpty(errors) ? eMsg : "", errors);
    return errorMessage || message;
  } else if (_.isString(data)) {
    return data;
  } else {
    return message;
  }
};

export const hasUrlPDF = (url = "") => {
  return (url.toLowerCase().indexOf(".pdf") > -1);
};

export const fileDownload = async (
  url = "",
  progressCallback,
  successCallBack,
  errorCallBack,
) => {
  try {
    const fileName = url.split("/").pop();
    const fileLocation = `${Platform.OS === "android" ? RNFS.DownloadDirectoryPath : RNFS.DocumentDirectoryPath}/${fileName}`;
    const isFileExist = await RNFS.exists(fileLocation);
    if (isFileExist) {
      successCallBack({
        fileUrl: fileLocation,
        fileContentUrl: fileLocation,
      });
      return null;
    }
    await RNFS.downloadFile({
      fromUrl: url,
      toFile: fileLocation,
      progress: (downloadProgress) => {
        // console.log(downloadProgress);
        const progress = downloadProgress.bytesWritten / downloadProgress.contentLength;
        if (_.isFunction(progressCallback)) {
          progressCallback(progress);
        }
      },
    }).promise;
    if (_.isFunction(successCallBack)) {
      successCallBack({
        fileUrl: fileLocation,
        fileContentUrl: fileLocation,
      });
    }
  } catch (error) {
    if (_.isFunction(errorCallBack)) { errorCallBack(error); }
  }
};

export const openFile = async ({ fileUrl = "" }) => {
  try {
    await FileViewer.open(fileUrl);
  } catch (error) {
  }
};

export const hexToRgb = (hex = "") => {
  const normal = hex.match(/^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i);
  if (normal) { return normal.slice(1).map(e => parseInt(e, 16)); }

  const shorthand = hex.match(/^#([0-9a-f])([0-9a-f])([0-9a-f])$/i);
  if (shorthand) { return shorthand.slice(1).map(e => 0x11 * parseInt(e, 16)); }

  return null;
};
