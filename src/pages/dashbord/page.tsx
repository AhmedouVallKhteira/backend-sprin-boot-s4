import UserDetailPage from "../UserDetailPage";
import { useAuth } from "../../hooks/useAuth";

export default function Page(){
  const { user } = useAuth();
  const id = user?.id ?? 0;

  return (
    <UserDetailPage identifiant={id} />
  );
};
