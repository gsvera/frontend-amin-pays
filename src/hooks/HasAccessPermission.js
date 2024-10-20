import { PROFILE_PERMISSIONS } from "@/config/constants";
import { useMemo } from "react";
import { useSelector } from "react-redux";

const HasAccessPermission = () => {
  const { dataUser } = useSelector((state) => state.userSlice);

  const dataPermission = useMemo(
    () =>
      dataUser?.listPermissions?.length > 0 ? dataUser?.listPermissions : [],
    [dataUser]
  );

  const hasAccess = (id) => {
    return dataPermission.find((to) => to?.idPermission === id);
  };

  return { hasAccess };
};

export { HasAccessPermission };
