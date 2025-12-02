import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone } from "lucide-react";

function Footer() {
  return (
    <footer className="bg-[#0e0f12] text-gray-300 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-10">

        {/* Brand / About */}
        <div className="space-y-4">
          <img src="/logoJunior.png" alt="Okapi Junior Logo" className="h-20 w-auto"/>
          <h2 className="text-xl font-bold text-blue-400">Okapi Junior Academia</h2>
          <p className="text-gray-400 text-sm leading-relaxed">
            A modern digital learning platform providing flexible virtual classrooms,
            interactive lessons, and direct access to expert teachers. Our mission is to
            shape the next generation with innovative, high-quality education.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold text-blue-300 mb-4">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            {["Home", "About", "Courses", "My Class", "Contact"].map((link) => (
              <li key={link}>
                <a
                  href={link === "Home" ? "/" : `#${link.toLowerCase().replace(" ", "")}`}
                  className="hover:text-blue-400 transition-colors"
                >
                  {link}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Popular Courses */}
        <div>
          <h3 className="text-lg font-semibold text-blue-300 mb-4">Popular Courses</h3>
          <ul className="space-y-2 text-sm">
            {["English-French", "English-Swahili", "English-Lingala"].map((course) => (
              <li key={course}>
                <a href="#courses" className="hover:text-blue-400 transition-colors">
                  {course}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-lg font-semibold text-blue-300 mb-4">Contact Us</h3>
          <ul className="space-y-3 text-sm">
            <li className="flex items-center gap-2">
              <Mail size={16} className="text-blue-400"/>
              <span>john.muanda@okapijunioracademia.org</span>
            </li>
            <li className="flex items-center gap-2">
              <Phone size={16} className="text-blue-400"/>
              <span>+254 742 424660</span>
            </li>
            <li className="flex items-center gap-4 mt-4">
              {[Facebook, Twitter, Instagram, Linkedin].map((Icon, index) => (
                <a key={index} href="#" className="hover:text-blue-400 transition-colors">
                  <Icon size={20} />
                </a>
              ))}
            </li>
          </ul>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="mt-12 border-t border-gray-700 pt-6 text-center text-gray-500 text-sm">
        &copy; {new Date().getFullYear()} Okapi Junior Academia. All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;
