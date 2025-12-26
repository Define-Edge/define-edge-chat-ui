import isEmpty from "lodash/isEmpty";

export function getErrMsgKey(e: unknown, key: string) {
  return typeof e === "object" &&
    !isEmpty(e) &&
    key in e &&
    typeof e[key] === "string"
    ? e[key]
    : null;
}