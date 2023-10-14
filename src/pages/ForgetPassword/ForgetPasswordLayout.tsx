import { Outlet } from "react-router-dom";

export default function ForgetPasswordLayout() {
  return (
    <div className="w-full flex flex-col items-center justify-center min-h-[60vh]">
      <Outlet />
    </div>
  );
}
