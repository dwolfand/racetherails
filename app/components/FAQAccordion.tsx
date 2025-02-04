"use client";

import { useState } from "react";
import { FaChevronDown } from "react-icons/fa";

function FAQItem({
  question,
  answer,
  isLarge = false,
}: {
  question: string;
  answer: string | JSX.Element;
  isLarge?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className={`border-b border-gray-200 last:border-0 ${
        isLarge ? "md:col-span-2" : ""
      }`}
    >
      <button
        className="w-full py-4 text-left flex justify-between items-center hover:text-red-600 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h4 className="font-bold text-base pr-4">{question}</h4>
        <FaChevronDown
          className={`transform transition-transform ${
            isOpen ? "rotate-180" : ""
          } ml-2 flex-shrink-0`}
          size={14}
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ${
          isOpen ? "max-h-[500px] mb-4" : "max-h-0"
        }`}
      >
        <div className="text-gray-700 text-sm pr-4">
          {typeof answer === "string" ? <p>{answer}</p> : answer}
        </div>
      </div>
    </div>
  );
}

export default function FAQAccordion() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-0 md:gap-x-8">
      {/* Schedule and Time Cutoffs - Full width on all screens */}
      <div className="col-span-1 md:col-span-2">
        <FAQItem
          question="What is the schedule?"
          answer={
            <div>
              <p className="mb-2">
                <strong>7:00 AM:</strong> Race starts at Glenmont station! The
                entire field will start in one mass start with a 7-hour time
                limit.
              </p>
              <p className="mb-2">
                <strong>11:00 AM:</strong> Time cut-off at Judiciary Square for
                water/snack station.
              </p>
              <p className="mb-2">
                <strong>4:00-7:00 PM:</strong> Post-race party @ metrobar (640
                Rhode Island Ave NE Washington, DC 20002)
              </p>
              <p className="italic mb-2">Yes, it's Red Line accessible.</p>
              <p>
                <strong>7:00 PM and beyond:</strong> Unofficial after party,
                location TBA.
              </p>
            </div>
          }
        />
        <FAQItem
          question="Are there time cutoffs?"
          answer="For the safety of both runners and volunteers, the course has a 7-hour time limit. In addition, the time cutoff for the water/snack station is 11am (4 hours from race start). Participants that miss the time cutoff must withdraw. Any participant not abiding by this request will be denied entry to future RTR events."
        />
      </div>

      {/* Rest of the FAQs - Two columns on desktop, one on mobile */}
      <FAQItem
        question="Will roads be closed?"
        answer="No. All pedestrian and general public safety laws remain in effect. You will be running on walking paths, not highways."
      />
      <FAQItem
        question="Will there be water and snack stops?"
        answer="For the 2025 race, we will have at least one water/snack station at Judiciary Square. Stay tuned for more updates."
      />
      <FAQItem
        question="Will I receive a bib?"
        answer="No, we don't want to attract too much attention. Participants will be given a sweat band to wear, so that participants can identify other runners on the route."
      />
      <FAQItem question="Will there be live tracking?" answer="No." />
      <FAQItem question="Will there be gear check?" answer="No." />
      <FAQItem
        question="Does every runner need to run the same distance?"
        answer="No. It is up to you to determine who is running when, where, and for how long."
      />
      <FAQItem question="Is there a cancellation policy?" answer="No." />
      <FAQItem
        question="Is there any financial assistance?"
        answer="Maybe. Please send a brief description of your situation to racetherails@gmail.com and we will evaluate on a case-by-case basis."
      />
      <FAQItem
        question="Will the route be the same next year?"
        answer="Likely not. Our goal is to organize runs along all six Metro lines: red (2025), orange, silver, blue, yellow, and green."
      />
      <FAQItem
        question="Will there be merch?"
        answer="Ideally yes, but check back here for more information."
      />
      <FAQItem question="Will there be prizes?" answer="Stay tuned." />
    </div>
  );
}
