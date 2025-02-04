import Image from "next/image";
import Link from "next/link";
import { FaChevronDown, FaGithub } from "react-icons/fa";
import FAQAccordion from "./components/FAQAccordion";

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative h-screen">
        <Image
          src="/images/hero/WMATA_metro_center_crossvault.jpg"
          alt="DC Metro Station with iconic waffle ceiling"
          fill
          className="object-cover"
          style={{
            filter: "brightness(0.7) sepia(0.3) hue-rotate(-20deg)",
          }}
          priority
          quality={100}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-red-900/50 to-black/70" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white z-10 px-4">
          <div className="flex items-center justify-center gap-6 mb-8">
            <div className="w-36 h-36 relative">
              <Image
                src="/images/logos/racetherails-logo.jpeg"
                alt="Race the Rails Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
            <span className="text-4xl font-bold text-red-500">×</span>
            <div className="w-36 h-36 relative">
              <Image
                src="/images/logos/netc_logo_small_color.jpg"
                alt="Northeast Track Club Logo"
                fill
                className="object-contain rounded-lg"
                priority
              />
            </div>
          </div>
          <h1 className="text-6xl md:text-8xl font-bold mb-4 text-shadow-lg text-center">
            RACE THE <span className="text-red-500">RAILS</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-shadow text-center max-w-2xl">
            DC's first-ever metro line challenge. 30 miles. 27 stations.
            Infinite possibilities.
            <br />
            Choose your path. Make your stops. Beat the clock.
          </p>
          <div className="flex flex-col items-center gap-4">
            <p className="text-2xl md:text-4xl text-shadow">MARCH 22, 2025</p>
            <Link
              href="/register"
              className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-full text-xl font-bold transition-all transform hover:scale-105"
            >
              Join the Challenge
            </Link>
          </div>
        </div>
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white z-10 animate-bounce">
          <FaChevronDown size={40} />
        </div>
      </section>

      {/* Race Overview Section */}
      <section className="bg-rtr-dark text-rtr-cream py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-5xl font-bold mb-12">Not Your Average Race</h2>
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <p className="text-xl mb-6">
                <span className="text-red-500">Race the Rails</span> reimagines
                urban running. Unlike traditional point-to-point races, this is
                a strategic adventure where YOU decide your route from Glenmont
                to Shady Grove — following the Red Line tracks.
              </p>
              <p className="text-xl mb-6">
                The challenge? Hit 14 stations along the way, document your
                journey, and race against time. With 27 possible stops, every
                runner's path will be unique.
              </p>
              <div className="bg-red-900/30 p-4 rounded-lg">
                <h3 className="text-lg font-bold mb-2">Key Stats:</h3>
                <ul className="space-y-2">
                  <li>🏃‍♂️ ~30 miles total distance</li>
                  <li>📸 14 required station check-ins</li>
                  <li>⏱️ 7-hour time limit</li>
                  <li>🎯 27 possible stations</li>
                </ul>
              </div>
            </div>
            <div className="relative h-[300px] rounded-lg overflow-hidden">
              <Image
                src="/images/stations/Red_line_train.jpg"
                alt="DC Metro Red Line Train"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-red-900/50 to-transparent" />
            </div>
          </div>
        </div>
      </section>

      {/* What Does Unsanctioned Mean Section */}
      <section className="bg-white py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold mb-8 text-red-600">
            The Raw Urban Experience
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-100 p-6 rounded-lg transform hover:scale-105 transition-transform">
              <h3 className="text-xl font-bold mb-4">Your Route</h3>
              <p className="text-lg">
                No marked course. No closed roads. Just you, your navigation
                skills, and the city streets of DC. Plan wisely.
              </p>
            </div>
            <div className="bg-gray-100 p-6 rounded-lg transform hover:scale-105 transition-transform">
              <h3 className="text-xl font-bold mb-4">Your Strategy</h3>
              <p className="text-lg">
                Choose your stations. Pick your path. Run solo or coordinate
                with your relay team. The decisions are yours.
              </p>
            </div>
            <div className="bg-gray-100 p-6 rounded-lg transform hover:scale-105 transition-transform">
              <h3 className="text-xl font-bold mb-4">Your Adventure</h3>
              <p className="text-lg">
                Document your journey with station selfies. Experience DC's
                neighborhoods. Create your own race story.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Safety Notice Section */}
      <section className="bg-red-600 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold mb-8">
            Safety First, Adventure Second
          </h2>
          <div className="bg-white/10 p-6 rounded-lg backdrop-blur-sm">
            <p className="text-xl mb-4">
              This is an unsanctioned event. Roads remain open. Traffic laws
              apply. Your safety is your responsibility.
            </p>
            <ul className="space-y-4 text-lg">
              <li className="flex items-center gap-2">
                <span className="text-2xl">🚦</span> Obey all traffic signals
                and laws
              </li>
              <li className="flex items-center gap-2">
                <span className="text-2xl">🚶</span> Respect pedestrians and
                other road users
              </li>
              <li className="flex items-center gap-2">
                <span className="text-2xl">📱</span> Keep emergency contacts
                handy
              </li>
              <li className="flex items-center gap-2">
                <span className="text-2xl">💧</span> Stay hydrated and aware of
                your surroundings
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Schedule Section */}
      <section className="bg-rtr-dark text-rtr-cream py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold mb-12">Race Day Timeline</h2>
          <div className="space-y-8">
            <div className="relative pl-8 border-l-4 border-red-600">
              <time className="text-red-500 font-bold text-xl">7:00 AM</time>
              <h3 className="text-2xl font-bold mb-2">Mass Start @ Glenmont</h3>
              <p className="text-lg">
                The adventure begins! All participants start together from
                Glenmont Station. Get ready for an epic journey across DC.
              </p>
            </div>

            <div className="relative pl-8 border-l-4 border-red-600">
              <time className="text-red-500 font-bold text-xl">11:00 AM</time>
              <h3 className="text-2xl font-bold mb-2">Midpoint Cutoff</h3>
              <p className="text-lg">
                Last chance to reach the Judiciary Square water station. Missing
                the cutoff means mandatory withdrawal.
              </p>
            </div>

            <div className="relative pl-8 border-l-4 border-red-600">
              <time className="text-red-500 font-bold text-xl">2:00 PM</time>
              <h3 className="text-2xl font-bold mb-2">Course Closes</h3>
              <p className="text-lg">
                7-hour time limit ends. Submit your station selfies within 30
                minutes of finishing at Shady Grove.
              </p>
            </div>

            <div className="relative pl-8 border-l-4 border-red-600">
              <time className="text-red-500 font-bold text-xl">
                4:00 - 7:00 PM
              </time>
              <h3 className="text-2xl font-bold mb-2">Victory Celebration</h3>
              <p className="text-lg">
                Join us at metrobar (640 Rhode Island Ave NE) to share stories,
                compare routes, and celebrate your achievement!
                <br />
                <span className="italic text-red-400">
                  Yes, it's Red Line accessible.
                </span>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Route Section */}
      <section className="bg-white py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold mb-8">Chart Your Course</h2>
          <div className="grid md:grid-cols-2 gap-12 items-start">
            <div>
              <div className="bg-gray-100 p-6 rounded-lg mb-8">
                <h3 className="text-2xl font-bold mb-4 text-red-600">
                  The Challenge
                </h3>
                <ul className="space-y-4">
                  <li className="flex items-start gap-4">
                    <span className="text-2xl">🚉</span>
                    <div>
                      <p className="font-bold">Required Stations</p>
                      <p>
                        Glenmont (Start), Judiciary Square (Midpoint), Shady
                        Grove (Finish)
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-4">
                    <span className="text-2xl">📸</span>
                    <div>
                      <p className="font-bold">Station Check-ins</p>
                      <p>
                        Take selfies at 14 different stations of your choice
                        (including the required ones)
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-4">
                    <span className="text-2xl">📏</span>
                    <div>
                      <p className="font-bold">Distance</p>
                      <p>
                        Approximately 30 miles, but your exact route is up to
                        you
                      </p>
                    </div>
                  </li>
                </ul>
              </div>
              <div className="bg-red-600 text-white p-6 rounded-lg">
                <h3 className="text-2xl font-bold mb-4">Verification</h3>
                <p className="mb-4">
                  Send your station selfies to racetherails@gmail.com within 30
                  minutes of finishing. Each photo should clearly show:
                </p>
                <ul className="space-y-2 ml-6 list-disc">
                  <li>You at the station</li>
                  <li>Station name visible</li>
                  <li>Timestamp (if possible)</li>
                </ul>
              </div>
            </div>
            <div>
              <div className="sticky top-4">
                <div className="relative h-[500px] rounded-lg overflow-hidden">
                  <Image
                    src="/images/stations/Gallery_Place-Chinatown_Station_2.jpg"
                    alt="Gallery Place-Chinatown Metro Station"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <h3 className="text-2xl font-bold mb-4">Pro Tips</h3>
                    <ul className="space-y-3">
                      <li className="flex items-center gap-2">
                        <span>🗺️</span> Study the Red Line map in advance
                      </li>
                      <li className="flex items-center gap-2">
                        <span>📱</span> Download offline maps
                      </li>
                      <li className="flex items-center gap-2">
                        <span>🏃</span> Plan your station spacing strategically
                      </li>
                      <li className="flex items-center gap-2">
                        <span>🌡️</span> Check weather conditions
                      </li>
                      <li className="flex items-center gap-2">
                        <span>⚡</span> Keep your phone charged
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-white py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold mb-12">
            Frequently Asked Questions
          </h2>
          <FAQAccordion />
        </div>
      </section>

      {/* Registration Section */}
      <section className="bg-rtr-dark text-rtr-cream py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold mb-8">Registration</h2>
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div className="bg-rtr-cream text-rtr-dark p-6 rounded-lg">
              <h3 className="text-2xl font-bold mb-4">EARLY BIRD</h3>
              <p className="text-lg mb-4">February 3-February 23, 2024</p>
              <ul className="space-y-2 mb-6">
                <li>Single Tracking (Individual) - $25</li>
                <li>Red Line Relay (max 6 runners) - $25 per participant</li>
              </ul>
              <Link
                href="/register"
                className="block w-full bg-rtr-bronze text-rtr-dark py-2 rounded-lg hover:bg-rtr-gold transition-colors text-center font-semibold"
              >
                Register
              </Link>
            </div>
            <div className="bg-rtr-cream text-rtr-dark p-6 rounded-lg">
              <h3 className="text-2xl font-bold mb-4">REGULAR</h3>
              <p className="text-lg mb-4">February 24-March 10, 2025</p>
              <ul className="space-y-2 mb-6">
                <li>Single Tracking (Individual) - $30</li>
                <li>Red Line Relay (max 6 runners) - $30 per participant</li>
              </ul>
              <Link
                href="/register"
                className="block w-full bg-rtr-bronze text-rtr-dark py-2 rounded-lg hover:bg-rtr-gold transition-colors text-center font-semibold"
              >
                Register
              </Link>
            </div>
          </div>
          <div className="bg-red-900/30 p-6 rounded-lg text-center mb-8">
            <p className="text-lg">
              A portion of all registration proceeds will support{" "}
              <a
                href="https://netrackclub.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-red-400 hover:text-red-300 underline font-semibold"
              >
                Northeast Track Club's
              </a>{" "}
              2025 Speed Project Team
            </p>
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
                <Link href="/waiver" className="text-rtr-gold hover:underline">
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
      <section className="bg-rtr-bronze text-rtr-dark py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-8">Ready to Race?</h2>
          <Link
            href="/register"
            className="bg-rtr-dark text-rtr-cream px-8 py-3 rounded-full text-lg font-semibold transition-colors hover:bg-black inline-block"
          >
            Register Now
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-rtr-dark text-rtr-cream py-6 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-sm flex items-center justify-center gap-2">
            Made with 🏃 in DC{" "}
            <a
              href="https://github.com/dwolfand/racetherails"
              target="_blank"
              rel="noopener noreferrer"
              className="text-rtr-gold hover:text-rtr-bronze transition-colors"
            >
              <FaGithub size={20} />
            </a>
          </p>
        </div>
      </footer>
    </>
  );
}
