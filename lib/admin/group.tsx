import { getGroupId } from '@/components/adminComponents/userApplicationAdmin/helpers';
import { create } from 'zustand';

export type ApplicationEntry = {
  index: number;
  application: UserIdentifier[];
};

interface UserGroupState {
  groups: ApplicationEntry[];
  allUsers: ApplicationEntry[];
  setUserGroup: (groups: ApplicationEntry[]) => void;
  setAllUserGroup: (allUsers: ApplicationEntry[]) => void;
  updateGroupVerdict: (groupId: string, newVerdict: string) => void;
}

export const useUserGroup = create<UserGroupState>((set) => ({
  groups: [],
  allUsers: [],
  setUserGroup: (groups) =>
    set(() => ({
      groups,
    })),
  setAllUserGroup: (allUsers) => set(() => ({ allUsers })),
  updateGroupVerdict: (groupId, newVerdict) =>
    set((state) => ({
      groups: state.groups.map((group) =>
        getGroupId(group.application) === groupId
          ? {
              ...group,
              application: group.application.map((member) => ({ ...member, status: newVerdict })),
            }
          : group,
      ),
    })),
}));
