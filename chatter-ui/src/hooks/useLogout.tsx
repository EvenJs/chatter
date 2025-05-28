const useLogout = () => {
  const logout = async () => {
    await fetch(`api/auth/logout`, {
      method: "POST",
    });
  };
  return { logout };
};

export { useLogout };
