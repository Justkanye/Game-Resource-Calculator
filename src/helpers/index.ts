import {
  NotificationRequestInput,
  scheduleNotificationAsync,
} from "expo-notifications";
import { Chess, Square } from "chess.js";
import { Vector } from "react-native-redash";

/**
 * Random uuid generator
 */
export const randomUUID = () =>
  new Date().toDateString() + "_" + Math.random().toString(36);

/**
 * format date in this format `9-10-2022`
 * @param dateString
 */
export const formatDate = (
  dateString?: string,
  mode: "calendar" | "normal" = "normal"
) => {
  if (!dateString) return "Unavailable";
  const date = new Date(dateString);
  if (mode === "normal") return date.toDateString();
  return date.getDay() + "-" + date.getMonth() + "-" + date.getFullYear();
};

/**
 * Accepts a number as string or number and returns the number as a comma seperated string
 *@param number number you want to format as string or number
 */
export const formatNumber = (number: string | number): string => {
  const numberAsString: string =
    typeof number === "string" ? number : number.toString();
  return numberAsString.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

/**
 * A simple wrapper for setTimeout with a default delay of 60ms (60fps)
 * @param func function to be run after the dela
 * @param delay in milliseconds
 */
export const runLater = (func = () => {}, delay = 60) => {
  setTimeout(() => {
    if (func) func();
  }, delay);
};

/**
 * Return a single element in an array in random order
 * @param arr array of any type
 */
export const getRandEl = <T>(arr: T[]): T => {
  return arr[Math.floor(Math.random() * arr.length)];
};

/**
 * Returns an updated object by combining two objects with the second object overriding the first's fields
 * `Note:` existing fields are not removed.
 * @param prev existing object
 * @param newObj new object
 */
export const updateObj = <T extends object>(prev: T, newObj?: T): T => {
  if (!newObj) return prev ?? {};
  let updatedObj = prev ?? {};
  Object.keys(newObj).forEach(key => {
    //@ts-ignore
    if (newObj[key])
      //@ts-ignore
      updatedObj[key] = newObj[key];
  });

  return updatedObj;
};

/**
 * Accepts a number as string or number and returns the number as a comma seperated string
 *@param count number you want to format as string or number
 */
export const optimizeCount = (count: number) => {
  const intlFormat = (num: number) =>
    (Math.floor(num * 10) / 10).toLocaleString();
  if (count >= 1000000) return intlFormat(count / 1000000) + "M";
  if (count >= 1000) return intlFormat(count / 1000) + "K";
  return intlFormat(count);
};

/**
 * Get an error message in string format
 * @param error
 */
export const getError = (error: any): string => {
  if (typeof error === "string") return error;
  if (typeof error === "object") {
    if (typeof error.message === "string") return error.message;
  }
  if (Array.isArray(error)) {
    if (typeof error[0] === "string") return error[0];
    if (typeof error[0] === "object") {
      if (typeof error[0].message === "string") return error[0].message;
    }
  }
  return "An error occured";
};

/**
 * @param parentName
 */
export const formatParentname = (parentName: string) => {
  const toUse = parentName?.toLowerCase();
  if (toUse?.endsWith("s"))
    return toUse[0].toUpperCase() + toUse.slice(1, toUse.length - 1);
  else return toUse[0].toUpperCase() + toUse.slice(1);
};

/**
 * Schedule a push notification
 * @param input
 */
export const schedulePushNotification = async (
  input: NotificationRequestInput = {
    content: {
      title: "You've got mail! 📬",
      body: "Here is the notification body",
      data: { data: "goes here" },
    },
    trigger: { seconds: 2 },
  }
) => {
  try {
    await scheduleNotificationAsync(input);
  } catch (error) {
    alert(getError(error));
  }
}

export const toTranslation = (to: Square, size: number) => {
  "worklet";
  const tokens = to.split("");
  const col = tokens[0];
  const row = tokens[1];
  if (!col || !row) throw new Error("Invalid notation: " + to);
  const x = col.charCodeAt(0) - "a".charCodeAt(0);
  const y = parseInt(row, 10) - 1;
  return {
    x: x * size,
    y: 7 * size - y * size,
  };
};

export const toPosition = ({ x, y }: Vector, size: number) => {
  "worklet";
  const col = String.fromCharCode(97 + Math.round(x / size));
  const row = `${8 - Math.round(y / size)}`;
  return `${col}${row}` as Square;
};

export const getChessGameResult = (chess: Chess) => {
  if (chess.isCheckmate()) {
    const winner = chess.turn() === "b" ? "White" : "Black";
    return { title: "Checkmate", desc: `Winner: ${winner}` };
  } else if (chess.isDraw()) {
    let reason = "50 moves rule";
    if (chess.isStalemate()) reason = "Stalemate";
    else if (chess.isThreefoldRepetition()) reason = "Repitition";
    else if (chess.isInsufficientMaterial()) reason = "Insuficient pieces";
    return { title: "Draw", desc: reason };
  }
  return { title: "Game Over", desc: "Unkown reason" };
};
