import { getGroupId } from '@/components/adminComponents/userApplicationAdmin/helpers';
import { create } from 'zustand';

interface UserGroupState {
  groups: UserIdentifier[][];
  setUserGroup: (groups: UserIdentifier[][]) => void;
  updateGroupVerdict: (groupId: string, newVerdict: string) => void;
}

export const useUserGroup = create<UserGroupState>((set) => ({
  groups: [],
  setUserGroup: (groups) =>
    set(() => ({
      groups,
    })),
  updateGroupVerdict: (groupId, newVerdict) =>
    set((state) => ({
      groups: state.groups.map((group) =>
        getGroupId(group) === groupId
          ? group.map((member) => ({ ...member, status: newVerdict }))
          : group,
      ),
    })),
}));
