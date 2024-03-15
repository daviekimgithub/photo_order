export const setLocalStorageSettings = async (settings: any) => {
  try {
    const authUserString = localStorage.getItem("authUser");
    if (authUserString) {
      const authUser = JSON.parse(authUserString);
      const updatedAuthUser = {
        ...authUser,
        firstName: settings?.name || "",
        phone: settings?.phone || "",
        lastName: settings?.lastName || "",
        email: settings?.email || "",
        street: settings?.address || "",
        zipCode: settings?.zipCode || "",
        city: settings?.city || "",
        country: settings?.country || "",
      };
      localStorage.setItem("authUser", JSON.stringify(updatedAuthUser));
    }
  } catch (error) {
    console.error('Error setting localStorage item:', error);
  }
};
  