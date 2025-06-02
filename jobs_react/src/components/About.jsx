import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Shield, Users, Globe } from "lucide-react";

const About = () => {
 return (
    <section id="about" className="relative">
      {/* Background gradient */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-blue-50 via-white to-emerald-50" />

      <div className="container mx-auto px-4 py-20">
        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-4xl md:text-6xl font-extrabold text-center mb-8"
        >
          Empowering Government Innovation
        </motion.h2>

        {/* Intro Paragraph */}
        <motion.p
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
          className="max-w-3xl mx-auto text-lg md:text-xl text-center text-gray-700"
        >
          TriPowers LLC is a Texas‑based, Service‑Disabled Veteran‑Owned Small Business delivering cutting‑edge technology, human resources, and travel logistics solutions for federal, state, and municipal agencies.
        </motion.p>

        {/* Photo Grid */}
        <div className="mt-16 grid md:grid-cols-3 gap-6">
          <motion.img
            src="src/assets/kimberly-jenkins.jpg"
            alt="Kimberly Jenkins, Founder & CEO"
            className="rounded-2xl shadow-lg object-cover h-72 w-full"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          />
          <motion.img
            src="src/assets/kenyatta-powers.jpg"
            alt="Kenyatta Powers‑Rucker, Vice President"
            className="rounded-2xl shadow-lg object-cover h-72 w-full"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.15 }}
          />
          <motion.img
            src="/src/assets/team-hq.png"
            alt="TriPowers team collaborating"
            className="rounded-2xl shadow-lg object-cover h-72 w-full"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          />
        </div>

        {/* Stats Cards */}
        <div className="mt-20 grid md:grid-cols-3 gap-8">
          <Card className="hover:-translate-y-2 transition-transform duration-300">
            <CardContent className="p-8 text-center">
              <Shield className="mx-auto h-10 w-10 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Certified SDVOSB</h3>
              <p className="text-gray-600">
                Proudly veteran‑owned and SBA‑certified to serve federal missions.
              </p>
            </CardContent>
          </Card>

          <Card className="hover:-translate-y-2 transition-transform duration-300">
            <CardContent className="p-8 text-center">
              <Users className="mx-auto h-10 w-10 mb-4" />
              <h3 className="text-xl font-semibold mb-2">People‑First</h3>
              <p className="text-gray-600">
                20+ years of HR expertise ensure we recruit and retain top talent.
              </p>
            </CardContent>
          </Card>

          <Card className="hover:-translate-y-2 transition-transform duration-300">
            <CardContent className="p-8 text-center">
              <Globe className="mx-auto h-10 w-10 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Full‑Stack Solutions</h3>
              <p className="text-gray-600">
                From cloud‑native apps to analytics dashboards, we build secure, scalable systems.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Mission & Vision */}
        <div className="mt-20 grid md:grid-cols-2 gap-10 items-start">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="text-2xl font-bold mb-4">Mission</h3>
            <p className="text-gray-700">
              We empower agencies to achieve their objectives by delivering innovative technology and exceptional personnel, guided by integrity, service, and continuous improvement.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h3 className="text-2xl font-bold mb-4">Vision</h3>
            <p className="text-gray-700">
              To be the premier partner for government transformation, recognized for agility, expertise, and unwavering commitment to mission success.
            </p>
          </motion.div>
        </div>

        {/* Badge Row */}
        <div className="mt-16 flex flex-wrap justify-center gap-4">
          <Badge variant="outline" className="text-base rounded-full px-6 py-2">
            Minority‑Owned
          </Badge>
          <Badge variant="outline" className="text-base rounded-full px-6 py-2">
            ISO‑Ready Processes
          </Badge>
          <Badge variant="outline" className="text-base rounded-full px-6 py-2">
            Texas HQ
          </Badge>
        </div>
      </div>
    </section>
  );
}

export default About