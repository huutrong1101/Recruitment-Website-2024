import classNames from "classnames";
import moment from "moment";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../../utils/AxiosInstance";

export default function InterviewHistory() {
  const { userId } = useParams();
  const [interview, setInterview] = useState([]);
  const [interview2, setInterview2] = useState([]);
  let navigate = useNavigate();
  const routeChange = (jobId: string) => {
    let path = `../jobdetail/${jobId}`;
    navigate(path);
  };
  useEffect(() => {
    const getInterviewHistory = async () => {
      try {
        const response = await axiosInstance.get(
          `recruiter/candidates/${userId}/interviews`,
        );
        if (response.data.result !== null) {
          setInterview(response.data.result.contents);
        }
        setInterview2(response.data.result);
      } catch (error) {
        console.log(error);
      }
    };
    getInterviewHistory();
  }, [userId]);

  return (
    // <div className="History mt-8 bg-white p-6 border rounded-2xl">
    <div
      className={classNames(
        `border bg-white shadow-sm rounded-xl`,
        `px-8 py-8`,
        `text-justify`,
      )}
    >
      <h1 className="text-2xl font-semibold"> Interview History</h1>
      {interview2 ? (
        <div className="relative overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50    ">
              <tr>
                <th scope="col" className="px-6 py-4">
                  Position Recuruitment
                </th>
                <th scope="col" className="px-6 py-4">
                  Date
                </th>
                <th scope="col" className="px-6 py-4">
                  State
                </th>
              </tr>
            </thead>
            <tbody>
              {interview.map((interview: any, index) => {
                const date = moment(interview.time).format("Do MMM, YYYY");
                return (
                  <tr className="bg-white border-b" key={index}>
                    <td
                      scope="row"
                      className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                    >
                      <p
                        className="cursor-pointer w-fit hover:underline"
                        onClick={() => {
                          routeChange(interview.jobId);
                        }}
                      >
                        {interview.jobName}
                      </p>
                    </td>
                    <td className="px-6 py-4">{date}</td>
                    <td className="px-4 py-4 rounded-lg p-2 mx-2 my-1">
                      <span
                        className={`rounded-lg p-2 mx-2 my-1  ${
                          interview.state === "PASSED"
                            ? "bg-green-200"
                            : interview.state === "FAILED"
                            ? "bg-green-200"
                            : interview.state === "NOT_RECEIVED"
                            ? "bg-yellow-100"
                            : "bg-yellow-100"
                        }`}
                      >
                        {interview.state === "RECEIVED"
                          ? "Pending"
                          : interview.state === "NOT_RECEIVED"
                          ? "Pending"
                          : interview.state === "PASSED"
                          ? "Finish"
                          : "Finish"}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center text-[1.1rem]">
          No interviews found for this candidate
        </div>
      )}
    </div>
  );
}
