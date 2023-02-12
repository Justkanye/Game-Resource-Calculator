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
