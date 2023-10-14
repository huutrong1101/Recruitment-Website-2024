import { Disclosure, Transition } from "@headlessui/react";
import { QuestionMarkCircleIcon } from "@heroicons/react/24/outline";

interface QAProps {
  questionsAnswers: {
    id: number;
    ques: string;
    ans: string;
  }[];
}

export default function QuestionsAnswers({ questionsAnswers }: QAProps) {
  return (
    <>
      <div className="flex flex-col items-start justify-start w-1/2 gap-2">
        <div>
          <Disclosure as="div" className="h-1/2">
            {({ open }) => (
              <>
                <Disclosure.Button
                  className={"flex text-left font-semibold text-[20px]"}
                >
                  <QuestionMarkCircleIcon className="w-6 h-6 mr-2 text-emerald-500" />
                  {questionsAnswers[0].ques}
                </Disclosure.Button>

                <Transition
                  show={open}
                  enter="transition duration-100 ease-out"
                  enterFrom="transform translateY(-50%) opacity-0"
                  enterTo="transform translateY(0%) opacity-100"
                  leave="transition duration-75 ease-out"
                  leaveFrom="transform translateY(0%) opacity-100"
                  leaveTo="transform translateY(-50%) opacity-0"
                >
                  <Disclosure.Panel
                    static
                    className="text-[15px] text-gray-400 capitalize"
                  >
                    {questionsAnswers[0].ans}
                  </Disclosure.Panel>
                </Transition>
              </>
            )}
          </Disclosure>
        </div>
        <Disclosure as="div" className="h-1/2">
          {({ open }) => (
            <>
              <Disclosure.Button
                className={"flex text-left font-semibold text-[20px]"}
              >
                <QuestionMarkCircleIcon className="w-6 h-6 mr-2 text-emerald-500" />
                {questionsAnswers[1].ques}
              </Disclosure.Button>

              <Transition
                show={open}
                enter="transition duration-100 ease-out"
                enterFrom="transform translateY(-50%) opacity-0"
                enterTo="transform translateY(0%) opacity-100"
                leave="transition duration-75 ease-out"
                leaveFrom="transform translateY(0%) opacity-100"
                leaveTo="transform translateY(-50%) opacity-0"
              >
                <Disclosure.Panel
                  static
                  className="text-[15px] text-gray-400 capitalize"
                >
                  {questionsAnswers[0].ans}
                </Disclosure.Panel>
              </Transition>
            </>
          )}
        </Disclosure>
      </div>
      <div className="flex flex-col items-start justify-start w-1/2 gap-2">
        <Disclosure as="div" className="h-1/2">
          {({ open }) => (
            <>
              <Disclosure.Button
                className={"flex text-left font-semibold text-[20px]"}
              >
                <QuestionMarkCircleIcon className="w-6 h-6 mr-2 text-emerald-500" />
                {questionsAnswers[2].ques}
              </Disclosure.Button>

              <Transition
                show={open}
                enter="transition duration-100 ease-out"
                enterFrom="transform translateY(-50%) opacity-0"
                enterTo="transform translateY(0%) opacity-100"
                leave="transition duration-75 ease-out"
                leaveFrom="transform translateY(0%) opacity-100"
                leaveTo="transform translateY(-50%) opacity-0"
              >
                <Disclosure.Panel
                  static
                  className="text-[15px] text-gray-400 capitalize"
                >
                  {questionsAnswers[2].ans}
                </Disclosure.Panel>
              </Transition>
            </>
          )}
        </Disclosure>
        <Disclosure as="div" className="h-1/2">
          {({ open }) => (
            <>
              <Disclosure.Button
                className={"flex text-left font-semibold text-[20px]"}
              >
                <QuestionMarkCircleIcon className="w-6 h-6 mr-2 text-emerald-500" />
                {questionsAnswers[3].ques}
              </Disclosure.Button>

              <Transition
                show={open}
                enter="transition duration-100 ease-out"
                enterFrom="transform translateY(-50%) opacity-0"
                enterTo="transform translateY(0%) opacity-100"
                leave="transition duration-75 ease-out"
                leaveFrom="transform translateY(0%) opacity-100"
                leaveTo="transform translateY(-50%) opacity-0"
              >
                <Disclosure.Panel
                  static
                  className="text-[15px] text-gray-400 capitalize"
                >
                  {questionsAnswers[3].ans}
                </Disclosure.Panel>
              </Transition>
            </>
          )}
        </Disclosure>
      </div>
    </>
  );
}
