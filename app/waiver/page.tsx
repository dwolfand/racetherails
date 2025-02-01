import Link from "next/link";

export default function Waiver() {
  return (
    <div className="min-h-screen bg-white py-20">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8">Event Terms and Waiver</h1>

        <div className="prose prose-lg max-w-none">
          <p className="font-bold mb-6">
            DISCLAIMER: By signing up and participating in this event, you
            acknowledge and accept the terms outlined below...
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">Assumption of Risk</h2>
          <p>
            I understand and acknowledge that participating in the unsanctioned
            urban road race involves inherent risks, including but not limited
            to accidents, injuries, illness, and property damage. These risks
            may arise from various factors, such as the nature of the race
            course, weather conditions, road traffic, the actions of other
            participants, and my own physical condition.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">
            Voluntary Participation
          </h2>
          <p>
            I acknowledge that my participation in this unsanctioned urban road
            race is voluntary and that I have chosen to participate of my own
            free will.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">
            Personal Responsibility
          </h2>
          <p>
            I assume full personal responsibility for any and all risks
            associated with my participation in this race. I understand that no
            on-course support, traffic control, or medical assistance will be
            provided by the organizers. I am solely responsible for my own
            safety, including but not limited to following all applicable
            traffic laws, staying aware of my surroundings, and taking
            precautions to avoid accidents or injury.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">Release of Liability</h2>
          <p>
            In consideration of being allowed to participate in the unsanctioned
            urban road race, I hereby release, discharge, and hold harmless the
            organizers of this event from any and all claims, liabilities,
            demands, actions, causes of action, costs, and expenses (including
            legal fees) arising out of or in connection with my participation in
            the race, including but not limited to personal injury, property
            damage, or wrongful death.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">Indemnification</h2>
          <p>
            I agree to indemnify and hold harmless the organizers of this event
            from any and all claims, liabilities, demands, actions, causes of
            action, costs, and expenses (including legal fees) arising out of or
            in connection with my participation in the unsanctioned urban road
            race, including but not limited to personal injury, property damage,
            or wrongful death.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">
            Photography and Publicity
          </h2>
          <p>
            I understand that photographs, videos, and other media may be taken
            during the race, and I consent to the use of my image and likeness
            for promotional purposes by @racetherails, its sponsors, and
            partners, without any compensation to me.
          </p>

          <div className="mt-12 p-6 bg-gray-100 rounded-lg">
            <p>
              By signing up for this race, I acknowledge that I have read and
              understood this disclaimer and agreement, and I voluntarily agree
              to be bound by its terms. I understand that this agreement is
              legally binding and will be applicable to all aspects of my
              participation in the race, both before and during the event.
            </p>
          </div>

          <div className="mt-12">
            <Link
              href="/register"
              className="bg-metro-red text-white px-8 py-3 rounded-full text-lg font-semibold transition-colors hover:bg-metro-red/90"
            >
              Proceed to Registration
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
