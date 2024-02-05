import axios from "axios";
import * as config from "../config/config";

export let apiInstance = axios.create({
  baseURL: config.BASE_URL,
  timeout: 60 * 1000,
  headers: {
    // "customer_id": 21,
    Accept: "application/json",
    Authorization: `Bearer ${config.BEARER_TOKEN}`,
  },
});

const get = (url = "", headers = {}) => {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await apiInstance.get(url, {
        headers: { ...headers },
      });
      resolve(res);
    } catch (error) {
      reject(error);
    }
  });
};

const post = (url = "", data = {}, headers = {}) => {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await apiInstance.post(`${url}`, data, {
        headers: { ...headers },
      });
      resolve(res);
    } catch (error) {
      reject(error);
    }
  });
};

const patch = (url = "", data = {}, headers = {}) => {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await apiInstance.patch(`${url}`, data, {
        headers: { ...headers },
      });
      resolve(res);
    } catch (error) {
      reject(error);
    }
  });
};

const APIs = {
  //User APIs
  emailPasswordLogin: (data) => post("users/1/login", data),
  emailPasswordRegister: (data) => post("users/1/register", data),
  forgotPassword: (data) => post("users/1/forgot-password", data),
  resetPassword: (data) => post("users/1/reset-password", data),

  idLogin: (data) => post("users/2/login1", data),
  idVerification: (data) => post("users/2/login2", data),
  idRegister: (data) => post("users/2/register", data),

  updateUser: (data) => post("users/update", data),
  getUserProfile: (headers) => get("users/profile", headers),
  updateUserProfile: (data, headers) => post("users/profile", data, headers),
  deleteUser: (data, headers) => post("users/profile/delete", data, headers),

  //Events APIs
  getAllEventsTypes: (headers) => get("events/types", headers),
  getAllEventsHosts: (headers) => get("events/hosts", headers),
  getAllEvents: (data, headers) => post("events", data, headers),
  getEventDetails: (data, headers) => post("event", data, headers),
  getEventStat: (data, headers) => post("event/stats", data, headers),
  getEventPools: (data, headers) => post("event/pools", data, headers),
  getEventTeams: (data, headers) => post("event/teams", data, headers),
  getEventPhotos: (data, headers) => post("event/photos", data, headers),
  getEvetStreams: (data, headers) => post("event/streams", data, headers),
  getEventResults: (data, headers) => post("event/results", data, headers),
  getEvetSponsors: (data, headers) => post("event/sponsors", data, headers),
  getEvetsPrograms: (data, headers) => post("event/programs", data, headers),
  getEvetsPerformers: (data, headers) =>
    post("event/performers", data, headers),
  getEventsProjects: (data, headers) => post("event/projects", data, headers),
  getEventsJudges: (data, headers) => post("event/judges", data, headers),
  getEvetsTopPerformers: (data, headers) =>
    post("event/top_performers", data, headers),
  getEventPlacings: (data, headers) => post("event/placings", data, headers),
  getEventDocuments: (data, headers) => post("event/documents", data, headers),
  getFeaturedEvents: (data, headers) => post("events/featured", data, headers),
  getFavouriteEvents: (data, headers) =>
    post("events/favourites", data, headers),
  getEventTeamPlayers: (data, headers) =>
    post("event/teams/players", data, headers),
  getEvetTitleSponsors: (data, headers) =>
    post("event/title_sponsors", data, headers),

  //Program APIS
  getProgramDetails: (data, headers) => post("event/program", data, headers),
  getProgramScrore: (data, headers) =>
    post("event/program/score", data, headers),
  updateProgramScrore: (data, headers) =>
    patch("event/program/score", data, headers),
  getProgramStats: (data, headers) =>
    post("event/program/game_stats", data, headers),
  getPlayerStats: (data, headers) =>
    post("event/program/player_stats_new", data, headers),
  getUpcomingPrograms: (data, headers) =>
    post("event/programs/upcoming", data, headers),
  getProgramCommentry: (data, headers) =>
    post("event/program/commentary", data, headers),
  getProgramFilters: (data, headers) =>
    post("event/programs/filters", data, headers),

  uploadEventPhoto: (data, headers) => post("event/photo", data, headers),
  setEventFavourite: (data, headers) => post("event/favourite", data, headers),
  setHostFavourite: (data, headers) =>
    post("event/host/favourite", data, headers),
  setEventProgramFavourite: (data, headers) =>
    post("event/program/favourite", data, headers),

  getSponsorDetails: (headers) => get("sponsor", headers),

  //Download API
  getDownloads: (data, headers) => post("downloads", data, headers),

  //News API
  getNews: (headers) => get("news", headers),
  getNewsDetails: (data, headers) => post("news/item", data, headers),

  //Venues API
  getVenuesTypes: (headers) => get("venues/types", headers),
  getVenues: (data, headers) => post("venues", data, headers),
  getVenueDetails: (data, headers) => post("venue", data, headers),
  getFacilities: (headers) => get("facilities", headers),
  getFacilitieDetails: (data, headers) =>
    post("facilities/facility", data, headers),

  //Customer API
  getCustomerDetails: (headers) => get("customer", headers),

  //General API
  search: (data, headers) => post("search", data, headers),
  getIcons: (headers) => get("icons", headers),

  //Notification API
  getAllNotification: (headers) => get("notifications", headers),
  getNotificationDetails: (data, headers) =>
    post("notifications/item", data, headers),

  //Team Placing API
  getEventPlacing: (data, headers) => post("event/placings", data, headers),
};

export default APIs;
