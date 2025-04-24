import UserDetailPage from "./UserDetailPage";
import { useAuth } from "../hooks/useAuth";
import PageLivres from "./PageLivres";

export default function Page(){
  const { user } = useAuth();
  const id = user?.id ?? 0;

  return (
    id === 0 ? (
      <PageLivres />
    ) : (
    <UserDetailPage identifiant={id} />
  )
)
};
