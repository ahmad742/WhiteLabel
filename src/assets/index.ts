import Config from "react-native-config";
import { ConfigType } from "../config/Type";
import { Flavours } from "../config/Flavour";

const config = { ...Config } as ConfigType;

let files = {
  iconTransparent: require(`./swpsa/app-icon-transparent.png`),
  appIcon: require(`./swpsa/app-icon.png`),
  eventCardBackground: require(`./swpsa/event_card_bg.png`),
  logo: require(`./swpsa/logo.png`),
  notificationIcon: require(`./swpsa/notification-Icon.png`),
  splash: require(`./swpsa/splash.png`),
};

if (config.FLAVOUR === Flavours.GWP) {
  // TODO - replace refs
  files = {
    eventCardBackground: require(`./gwp/event_card_bg.png`),
    logo: require(`./gwp/logo.png`),
  };
}

if (config.FLAVOUR === Flavours.CTWP) {
  // TODO - replace refs
  files = {
    eventCardBackground: require(`./ctwp/event_card_bg.png`),
    appIcon: require(`./ctwp/logo_white.png`),
    logo: require(`./ctwp/logo.png`),
  };
}
if (config.FLAVOUR === Flavours.IHS) {
  // TODO - replace refs
  files = {
    eventCardBackground: require(`./ihsports/event_card_bg.png`),
    appIcon: require(`./ihsports/oldLogo.png`),
    logo: require(`./ihsports/logo.png`),
  };
}
if (config.FLAVOUR === Flavours.PPL) {
  // TODO - replace refs
  files = {
    eventCardBackground: require(`./ppl/event_card_bg.png`),
    appIcon: require(`./ppl/logo_white.png`),
    logo: require(`./ppl/logo.png`),
    splash: require('./ppl/game.png'),
  };
}
if (config.FLAVOUR === Flavours.SPC) {
  // TODO - replace refs
  files = {
    eventCardBackground: require(`./spc/event_card_bg.png`),
    logo: require(`./spc/logo.png`),
  };
}
if (config.FLAVOUR === Flavours.HJ) {
  // TODO - replace refs
  files = {
    eventCardBackground: require(`./hj/event_card_bg.png`),
    logo: require(`./hj/logo.png`),
  };
}

// TODO - Add remaining flavours.

export const images = files;
