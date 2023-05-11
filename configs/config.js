import axios from "axios";
import defaultImage from "../assets/images/logo.png";
const baseURL = "http://ownrare.alshumaal.com/";

export const profileImageURL = `${baseURL}/assets/profile/display/`;
export const coverImageURL = `${baseURL}/assets/profile/cover/`;

export const BoaxUrl = axios.create({ baseURL });

export const getProfileURL = (asset) => {
  if (!asset) return defaultImage.src;
  return `${profileImageURL}/${asset}`;
};
