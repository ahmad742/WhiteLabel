import { ConfigType } from "./Type";
import Config from "react-native-config";

const config = { ...Config } as ConfigType;

const BASE_URL = config.BASE_URL;
const facebookAppId = config.FACEBOOK_APP_ID;
const iOSClientId = config.IOS_CLIENT_ID;
const webClientId = config.WEB_CLIENT_ID;
const androidClientId = config.ANDROID_CLIENT_ID;
const expoGoProxyClientId = config.EXPO_GO_PROXY_CLIENT_ID;
const BEARER_TOKEN = config.BEARER_TOKEN;
const PRIVACY_POLICY_URL = config.PRIVACY_POLICY_URL;

export {
  BASE_URL,
  facebookAppId,
  iOSClientId,
  webClientId,
  androidClientId,
  expoGoProxyClientId,
  BEARER_TOKEN,
  PRIVACY_POLICY_URL,
};
