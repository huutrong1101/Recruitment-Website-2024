import classnames from "classnames";
import { Link } from "react-router-dom";

export default function Advertise() {
  return (
    <>
      <div className="my-[40px] md:my-[80px] w-full bg-white shadow-lg border rounded-xl p-6 flex flex-col">
        <h3 className={classnames("text-black md:text-2xl font-semibold mb-4")}>
          Explore jobs Now
        </h3>
        <div
          className={classnames(
            "flex flex-col md:flex-row items-center justify-between gap-4 md:gap-16",
          )}
        >
          <div className={classnames("flex-1")}>
            <p
              className={classnames(
                "text-gray-400 text-sm md:text-base font-normal",
              )}
            >
              Search all the open positions on the web. Get your own
              personalized salary estimate. Read reviews on over 30000+
              companies worldwide.
            </p>
          </div>
          <div className={classnames("flex gap-3 items-center justify-center")}>
            <Link
              to="/jobs"
              className={classnames(
                "bg-emerald-700 text-white p-2 rounded-md flex text-center",
              )}
            >
              Apply Now
            </Link>
            <Link
              to="/jobs"
              className={classnames(
                "bg-gray-300 text-emerald-700 p-2 rounded-md flex text-center",
              )}
            >
              Learn more
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
