import { atom } from "recoil";
import { IUser } from "./types";

export const userAtom = atom<IUser | null>({
  default: null,
  key: "userAtom",
});
