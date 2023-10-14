import { Outlet } from "react-router-dom";

export default function EmailConfirmationLayout() {
  return (
    <div className="w-full flex flex-col items-center justify-center min-h-[80vh]">
      <Outlet />
    </div>
  );
}
