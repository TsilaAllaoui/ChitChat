// Get user initials
export const getInitiials = (name: string): string => {
  let tmp: string[] = name!.split(" ");
  let initials: string = "";
  if (tmp.length === 1) initials = name[0];
  else initials = tmp[0][0] + tmp[1][0];
  return initials;
};
