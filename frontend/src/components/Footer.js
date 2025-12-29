
    export default function Footer() {
  return (
    <footer className="bg-[#0f2f25] text-[#e6f4ee]">
      <div className="footer-container max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 px-8 py-14">

        <div>
          <h3 className="text-[#8fd3b6] mb-3 font-semibold text-lg">
            About SwadSeva
          </h3>
          <p className="text-sm text-[#cfe9df] leading-relaxed">
            SwadSeva is a patient-focused food ordering platform providing
            nutritious, hygienic meals designed to support recovery, wellness,
            and daily care — delivered with trust.
          </p>
        </div>

        <div>
          <h3 className="text-[#8fd3b6] mb-3 font-semibold text-lg">
            Navigation
          </h3>
          <ul className="list-none space-y-2 text-sm">
            <li>
              <a href="/" className="hover:text-white transition">
                Home
              </a>
            </li>
            <li>
              <a href="/about" className="hover:text-white transition">
                About
              </a>
            </li>
            <li>
              <a href="/menu" className="hover:text-white transition">
                Menu
              </a>
            </li>
            <li>
              <a href="/contact" className="hover:text-white transition">
                Care & Support
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-[#8fd3b6] mb-3 font-semibold text-lg">
            Quick Links
          </h3>
          <ul className="list-none space-y-2 text-sm">
            <li>
              <a href="/menu" className="hover:text-white transition">
                Diet-Based Meals
              </a>
            </li>
            <li>
              <a href="/orders" className="hover:text-white transition">
                Track Your Order
              </a>
            </li>
            <li>
              <a href="/about" className="hover:text-white transition">
                Our Care Mission
              </a>
            </li>
            <li>
              <a href="/about" className="hover:text-white transition">
                Nutrition Guidance
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-[#8fd3b6] mb-3 font-semibold text-lg">
            Connect With Us
          </h3>
          <div className="flex gap-3">
            {[
              "facebook-f",
              "linkedin-in",
              "twitter",
              "instagram",
            ].map((icon, idx) => (
              <a
                key={idx}
                href="#"
                className="w-10 h-10 rounded-full border border-[#8fd3b6] inline-flex items-center justify-center text-[#8fd3b6]
                hover:bg-[#8fd3b6] hover:text-[#0f2f25] transition transform hover:scale-110"
              >
                <i className={`fab fa-${icon}`}></i>
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="footer-bottom text-center text-sm text-[#b7dccc] border-t border-[rgba(255,255,255,0.1)] py-5">
        © 2025 SwadSeva. All rights reserved.{" "}
        <a href="#" className="underline hover:text-white">
          Terms of Use
        </a>{" "}
        |{" "}
        <a href="#" className="underline hover:text-white">
          Privacy Policy
        </a>
      </div>
    </footer>
  );
}
