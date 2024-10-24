export const getGroupId = (group: UserIdentifier[]): string => {
  return group
    .sort((a, b) => {
      return a.id.localeCompare(b.id);
    })
    .map((group) => group.id)
    .join('-');
};
