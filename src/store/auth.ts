import { atom } from "jotai";
import type { User } from "@/common/types";

export const userAtom = atom<User | null>(null);
export const isAuthenticatedAtom = atom<boolean>(false);
