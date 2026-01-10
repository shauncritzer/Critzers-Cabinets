import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Link } from "wouter";
import Navigation from "@/components/Navigation";
import { MapPin, Phone, Mail, Clock } from "lucide-react";


export default function Contact() {

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    setTimeout(() => {
      alert("Message sent! We'll get back to you within 1 business day.");
      setFormData({ name: "", email: "", phone: "", message: "" });
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary/10 to-primary/5 py-16">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <h1 className="text-5xl font-bold">Contact Us</h1>
            <p className="text-xl text-muted-foreground">
              Get in touch with our team for design consultations, quotes, or questions
            </p>
          </div>
        </div>
      </section>

      {/* Contact Info & Form Section */}
      <section className="py-16 bg-background">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Contact Information */}
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold mb-6">Get In Touch</h2>
                <p className="text-muted-foreground mb-8">
                  Visit our showroom, give us a call, or send us a message. We're here to help bring your
                  kitchen and bath vision to life.
                </p>
              </div>

              <Card>
                <CardHeader>
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <MapPin className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle>Visit Our Showroom</CardTitle>
                  <CardDescription>See our displays and meet with designers</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="font-semibold">661 Berkmar Court</p>
                  <p className="text-muted-foreground">Charlottesville, VA 22901</p>
                  <Button variant="outline" className="mt-4" asChild>
                    <a 
                      href="https://www.google.com/maps/search/?api=1&query=661+Berkmar+Court+Charlottesville+VA+22901" 
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      Get Directions
                    </a>
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <Phone className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle>Call Us</CardTitle>
                  <CardDescription>Speak with our team directly</CardDescription>
                </CardHeader>
                <CardContent>
                  <a href="tel:+14342960000" className="text-lg font-semibold hover:text-primary">
                    (434) 296-0000
                  </a>
                  <p className="text-sm text-muted-foreground mt-2">
                    Monday - Friday: 9:00 AM - 5:00 PM<br />
                    Saturday: By Appointment<br />
                    Sunday: Closed
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <Mail className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle>Email Us</CardTitle>
                  <CardDescription>Send us a message anytime</CardDescription>
                </CardHeader>
                <CardContent>
                  <a href="mailto:info@critzerscabinets.com" className="text-lg font-semibold hover:text-primary">
                    info@critzerscabinets.com
                  </a>
                  <p className="text-sm text-muted-foreground mt-2">
                    We typically respond within 1 business day
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Contact Form */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Send Us a Message</CardTitle>
                  <CardDescription>
                    Fill out the form below and we'll get back to you soon
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                        placeholder="Your full name"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                        placeholder="your@email.com"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="(434) 555-0000"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message">Message *</Label>
                      <Textarea
                        id="message"
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        required
                        placeholder="Tell us about your project or question..."
                        rows={6}
                      />
                    </div>

                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                      {isSubmitting ? "Sending..." : "Send Message"}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              <div className="mt-6 bg-emerald-50 border-2 border-emerald-200 rounded-lg p-6 text-center">
                <p className="font-bold text-emerald-800 mb-2">Need a Quote?</p>
                <p className="text-sm text-emerald-700 mb-4">
                  Get an instant preliminary quote with our AI-powered consultation system
                </p>
                <Link href="/quote">
                  <Button variant="outline" className="border-emerald-600 text-emerald-800 hover:bg-emerald-100">
                    Get Free Quote
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Hours Section */}
      <section className="py-16 bg-muted/30">
        <div className="container">
          <div className="max-w-3xl mx-auto">
            <Card>
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 mx-auto">
                  <Clock className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-center">Showroom Hours</CardTitle>
                <CardDescription className="text-center">
                  Visit us to see cabinet displays and meet with our design team
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6 text-center">
                  <div>
                    <p className="font-semibold mb-2">Weekdays</p>
                    <p className="text-muted-foreground">Monday - Friday</p>
                    <p className="text-lg font-bold text-primary">9:00 AM - 5:00 PM</p>
                  </div>
                  <div>
                    <p className="font-semibold mb-2">Weekend</p>
                    <p className="text-muted-foreground">Saturday</p>
                    <p className="text-lg font-bold text-primary">By Appointment Only</p>
                    <p className="text-sm text-muted-foreground mt-2">Sunday: Closed</p>
                  </div>
                </div>
                <div className="mt-6 pt-6 border-t text-center">
                  <p className="text-sm text-muted-foreground">
                    <strong>Note:</strong> We recommend scheduling an appointment to ensure a designer is available
                    to give you their full attention during your visit.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Map Section (Placeholder) */}
      <section className="py-16 bg-background">
        <div className="container">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-8">Find Us</h2>
            <div className="aspect-video bg-muted rounded-lg overflow-hidden">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3141.234567890123!2d-78.5!3d38.05!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzjCsDAzJzAwLjAiTiA3OMKwMzAnMDAuMCJX!5e0!3m2!1sen!2sus!4v1234567890123!5m2!1sen!2sus"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Critzer's Cabinet Creations Location"
              ></iframe>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
