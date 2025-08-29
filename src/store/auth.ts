import { atom } from 'jotai';
import type { User } from '@/common/types';

export const userAtom = atom<User | null>(null);
export const isLoadingAtom = atom<boolean>(true);
export const isAuthenticatedAtom = atom<boolean>((get) => get(userAtom) !== null);

export const userRoleAtom = atom<string | null>((get) => get(userAtom)?.role || null);

export const isAdminAtom = atom<boolean>((get) => get(userRoleAtom) === 'admin');
export const isOrphanageAtom = atom<boolean>((get) => get(userRoleAtom) === 'orphanage');
export const isDonorAtom = atom<boolean>((get) => get(userRoleAtom) === 'donor');
