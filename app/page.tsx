import Image from "next/image";
import Link from "next/link";
import { FaChevronDown } from "react-icons/fa";

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative h-screen">
        <Image
          src="/images/hero/WMATA_metro_center_crossvault.jpg"
          alt="DC Metro Station with iconic waffle ceiling"
          fill
          className="object-cover grayscale"
          priority
          quality={100}
        />
        <div className="absolute inset-0 bg-black/70" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white z-10 px-4">
          <div className="w-48 h-48 mb-8 relative">
            <Image
              src="/images/logos/racetherails-logo.jpeg"
              alt="Race the Rails Logo"
              fill
              className="object-contain"
              priority
            />
          </div>
          <h1 className="text-6xl md:text-8xl font-bold mb-4 text-shadow-lg text-center">
            RACE THE RAILS
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-shadow text-center">
            Run DC, one line at a time. Are you on board?
          </p>
          <p className="text-2xl md:text-4xl mb-8 text-shadow">
            MARCH 22, 2025
          </p>
        </div>
        {/* Scroll Arrow */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white z-10 animate-bounce">
          <FaChevronDown size={40} />
        </div>
      </section>

      {/* Race Overview Section */}
      <section className="bg-zinc-900 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-5xl font-bold mb-12">Race Overview</h2>
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <p className="text-xl mb-6">
                <span className="text-metro-red">Race the Rails</span> is an
                unsanctioned, self-supported urban road race against DC's metro
                lines. Runners, individually or in relay teams of 3, will run
                from one end of a metro line to the other. You are responsible
                for getting yourself and your team members from the start to the
                finish. The race is held annually in the spring. The inaugural
                2025 edition will be against the{" "}
                <span className="text-metro-red">Red Line</span>.
              </p>
            </div>
            <div className="relative h-[300px] rounded-lg overflow-hidden">
              <Image
                src="/images/stations/Red_line_train.jpg"
                alt="DC Metro Red Line Train"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* What Does Unsanctioned Mean Section */}
      <section className="bg-white py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold mb-8">
            What does unsanctioned mean?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <p className="text-xl mb-4">
                Roads closed? <span className="font-bold">No.</span>
              </p>
              <p className="text-xl mb-4">
                Live timing? <span className="font-bold">No.</span>
              </p>
              <p className="text-xl mb-4">
                Water stops? <span className="font-bold">Maybe.</span>
              </p>
            </div>
            <div>
              <p className="text-xl mb-4">
                Aid stations? <span className="font-bold">Maybe.</span>
              </p>
              <p className="text-xl mb-4">
                Gear check? <span className="font-bold">Maybe.</span>
              </p>
              <p className="text-xl mb-4">
                Fun race? <span className="font-bold">Guaranteed.</span>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Safety Notice Section */}
      <section className="bg-metro-red text-white py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold mb-8">
            Are roads closed for this event?
          </h2>
          <p className="text-xl">
            No. Roads are NOT closed for this event. All pedestrian and general
            public safety laws remain in effect. Respect others. Be safe.
            Participate at your own risk.
          </p>
        </div>
      </section>

      {/* Schedule Section */}
      <section className="bg-zinc-900 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold mb-8">Schedule</h2>
          <div className="space-y-6">
            <p className="text-xl">
              <span className="font-bold">7am:</span> Race starts! The entire
              field will start in one mass start at 7am with a 7-hour time
              limit.
            </p>
            <p className="text-xl">
              For the 2025 race, we will have one water/snack station at
              Judiciary Square (approx halfway through). The time cutoff for the
              water/snack station is 11am (4 hours from race start).
            </p>
            <p className="text-xl">
              Participants missing any time cutoffs along the course must
              withdraw. Any participant not abiding by this request will be
              denied entry to future RTR events.
            </p>
            <p className="text-xl">
              <span className="font-bold">4-7pm:</span> Post-race party @
              metrobar (640 Rhode Island Ave NE Washington, DC 20002)
              <br />
              <span className="italic">Yes, it's Red Line accessible.</span>
            </p>
            <p className="text-xl">
              <span className="font-bold">7pm and beyond:</span> Unofficial
              after party, location TBA.
            </p>
          </div>
        </div>
      </section>

      {/* Route Section */}
      <section className="bg-white py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold mb-8">What is the route?</h2>
          <div className="grid md:grid-cols-2 gap-8 items-center mb-8">
            <div>
              <p className="text-xl mb-6">
                The route is approximately ~30 miles. There is no predetermined
                route for the race, but you must start at the Glenmont station
                and end at the Shady Grove station. You must also take a selfie
                at 14 different Red Line metro stations – it is up to you to
                determine which stations to stop at (there are 27 stations!), as
                long as 3 of the 14 stops are Glenmont, Judiciary Square, and
                Shady Grove.
              </p>
            </div>
            <div className="relative h-[300px] rounded-lg overflow-hidden">
              <Image
                src="/images/stations/Gallery_Place-Chinatown_Station_2.jpg"
                alt="Gallery Place-Chinatown Metro Station"
                fill
                className="object-cover"
              />
            </div>
          </div>
          <p className="text-xl">
            Selfies should be sent at the end of the race to
            racetherails@gmail.com within 30 minutes of crossing the finish line
            for verification. We're excited to see the routes you come up with!
          </p>
        </div>
      </section>

      {/* Registration Section */}
      <section className="bg-zinc-900 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold mb-8">Registration</h2>
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div className="bg-white text-black p-6 rounded-lg">
              <h3 className="text-2xl font-bold mb-4">EARLY BIRD</h3>
              <p className="text-lg mb-4">February 3-February 23, 2024</p>
              <ul className="space-y-2 mb-6">
                <li>Single Tracking (Individual) - $40</li>
                <li>Red Line Relay (max 3 runners) - $35 per participant</li>
              </ul>
              <Link
                href="/register"
                className="block w-full bg-metro-red text-white py-2 rounded-lg hover:bg-red-700 transition-colors text-center"
              >
                Register
              </Link>
            </div>
            <div className="bg-white text-black p-6 rounded-lg">
              <h3 className="text-2xl font-bold mb-4">REGULAR</h3>
              <p className="text-lg mb-4">February 24-March 10, 2025</p>
              <ul className="space-y-2 mb-6">
                <li>Single Tracking (Individual) - $50</li>
                <li>Red Line Relay (max 3 runners) - $45 per participant</li>
              </ul>
              <Link
                href="/register"
                className="block w-full bg-metro-red text-white py-2 rounded-lg hover:bg-red-700 transition-colors text-center"
              >
                Register
              </Link>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="relative h-[300px] rounded-lg overflow-hidden">
              <Image
                src="/images/stations/Foggy_Bottom_station_platform.jpg"
                alt="Foggy Bottom Metro Station Platform"
                fill
                className="object-cover"
              />
            </div>
            <div>
              <p className="text-xl mb-6">
                Secure your spot in DC's most exciting race!! Relay teams can be
                of any gender combination. It is up to you to determine who is
                running when, where, and for how long.
              </p>
              <p className="text-xl mb-6">
                If you need financial assistance, please send a brief
                description of your situation to racetherails@gmail.com and we
                will evaluate on a case-by-case basis.
              </p>
              <p className="text-xl">
                By signing up for the race, you agree to the event terms and
                waiver outlined{" "}
                <Link href="/waiver" className="text-metro-red hover:underline">
                  HERE
                </Link>
                .
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="bg-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-8">Contact Us</h2>
          <p className="text-xl mb-6">
            Email racetherails@gmail.com with any questions and we will do our
            best to respond to you within 48 hours. Tag us on Instagram
            (@racetherails) during your training and throughout the race!
          </p>
          <p className="text-xl italic">
            Inspired by the Charlie Card Challenge in Boston, MA.
          </p>
        </div>
      </section>

      {/* Register CTA Section */}
      <section className="bg-metro-red text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-8">Ready to Race?</h2>
          <Link
            href="/register"
            className="bg-white text-metro-red px-8 py-3 rounded-full text-lg font-semibold transition-colors hover:bg-gray-100 inline-block"
          >
            Register Now
          </Link>
        </div>
      </section>
    </>
  );
}
