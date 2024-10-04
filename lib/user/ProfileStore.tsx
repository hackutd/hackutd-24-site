import { create } from 'zustand';

interface ProfileState {
  profile: Registration | null;
  partialProfile: PartialRegistration | null;
  setProfile: (newProfile: Registration) => void;
  setPartialProfile: (newPartialProfile: PartialRegistration) => void;
}

export const useProfileStore = create<ProfileState>((set) => ({
  profile: null,
  partialProfile: null,
  setProfile: (newProfile) => set(() => ({ profile: newProfile })),
  setPartialProfile: (newPartialProfile) => set(() => ({ partialProfile: newPartialProfile })),
}));
