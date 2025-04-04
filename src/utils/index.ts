export const getCutName = (name: string = "Usuario"): string => {
  return name.charAt(0).toUpperCase() + name.charAt(1).toUpperCase();
};
