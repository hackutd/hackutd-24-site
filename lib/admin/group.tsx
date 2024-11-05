import { getGroupId } from '@/components/adminComponents/userApplicationAdmin/helpers';
import { create } from 'zustand';

interface UserGroupState {
  groups: UserIdentifier[][];
  allUsers: UserIdentifier[][];
  setUserGroup: (groups: UserIdentifier[][]) => void;
  setAllUserGroup: (allUsers: UserIdentifier[][]) => void;
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
        getGroupId(group) === groupId
          ? group.map((member) => ({ ...member, status: newVerdict }))
          : group,
      ),
    })),
}));
