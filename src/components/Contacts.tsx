import axios from "axios";
import {
  Mail,
  Phone,
  MapPin,
  Facebook,
  Instagram,
  Linkedin,
  User,
  MessageSquare,
} from "lucide-react";

import { useState, type FormEvent, type ChangeEvent } from "react";
import { toast, ToastContainer } from "react-toastify";
import { API_URL } from "../constants/Api";

interface ContactForm {
  username: string;
  email: string;
  message: string;
}

function Contacts() {
  const [form, setForm] = useState<ContactForm>({
    username: "",
    email: "",
    message: "",
  });

  // HANDLE INPUT CHANGE
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // HANDLE FORM SUBMIT
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!form.username || !form.email || !form.message) {
      toast.error("All fields are required!");
      return;
    }

    try {
      await axios.post(`${API_URL}/contacts/create`, {
        username: form.username,
        email: form.email,
        message: form.message,
      });

      toast.success("Message sent successfully!");

      // Reset Form
      setForm({ username: "", email: "", message: "" });
    } catch (error) {
      console.error(error);
      toast.error("Failed to send message!");
    }
  };

  return (
    <section className="w-full bg-[#0e0f12] text-gray-200 py-16 px-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
        
        {/* LEFT SIDE — INFO */}
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-3">
            <div className="w-16 h-16 rounded-xl bg-white flex items-center justify-center shadow-lg">
              <span className="text-[#0e0f12] font-bold text-2xl">OJA</span>
            </div>
            <h1 className="text-3xl font-bold">Okapi Junior Academia</h1>
          </div>

          <p className="text-gray-400 leading-relaxed">
            Okapi Junior Academia is committed to shaping the next generation
            of leaders through quality education, creativity, and innovation.
          </p>

          {/* SOCIAL ICONS */}
          <div className="flex gap-5 mt-3">
            <a href="#" className="hover:text-white transition"><Facebook /></a>
            <a href="#" className="hover:text-white transition"><Instagram /></a>
            <a href="#" className="hover:text-white transition"><Linkedin /></a>
          </div>

          {/* CONTACT INFO */}
          <div className="flex flex-col gap-6 mt-5">
            <div className="flex items-start gap-4">
              <Mail className="text-blue-400" />
              <div>
                <p className="text-lg font-medium">Email</p>
                <p className="text-gray-400">john.muanda@okapijunioracademia.org</p>
    

              </div>
            </div>

            <div className="flex items-start gap-4">
              <Phone className="text-green-400" />
              <div>
                <p className="text-lg font-medium">Phone</p>
                <p className="text-gray-400">+254 742 424660</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <MapPin className="text-red-400" />
              <div>
                <p className="text-lg font-medium">Address</p>
                <p className="text-gray-400">Kinshasa, RD Congo</p>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE — FORM */}
        <div className="bg-[#15171c] rounded-2xl p-8 shadow-xl border border-gray-700">
          <h2 className="text-2xl font-semibold mb-6">Send Us a Message</h2>

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            {/* Username */}
            <div>
              <label className="flex items-center gap-2 text-gray-300 mb-1">
                <User size={18} /> Username
              </label>
              <input
                type="text"
                name="username"
                value={form.username}
                onChange={handleChange}
                placeholder="Your full name"
                className="w-full p-3 rounded-lg bg-[#0e0f12] border border-gray-700 text-white outline-none focus:border-blue-500"
              />
            </div>

            {/* Email */}
            <div>
              <label className="flex items-center gap-2 text-gray-300 mb-1">
                <Mail size={18} /> Email
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="email@example.com"
                className="w-full p-3 rounded-lg bg-[#0e0f12] border border-gray-700 text-white outline-none focus:border-blue-500"
              />
            </div>

            {/* Message */}
            <div>
              <label className="flex items-center gap-2 text-gray-300 mb-1">
                <MessageSquare size={18} /> Message
              </label>
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                rows={5}
                placeholder="Write your message..."
                className="w-full p-3 rounded-lg bg-[#0e0f12] border border-gray-700 text-white outline-none resize-none focus:border-blue-500"
              ></textarea>
            </div>

            {/* Submit Btn */}
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-lg font-semibold text-white transition"
            >
              Send Message
            </button>
          </form>
        </div>
        <ToastContainer/>
      </div>
    </section>
  );
}

export default Contacts;
