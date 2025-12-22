import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/lib/trpc";
import { Loader2, Send, ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import { toast } from "sonner";
import { Streamdown } from "streamdown";

type Message = {
  role: "user" | "assistant";
  content: string;
};

export default function Quote() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hello! I'm here to help you get a quote for your custom cabinet project. To get started, could you tell me what room you're looking to add cabinets to? (Kitchen, bathroom, office, etc.)",
    },
  ]);
  const [input, setInput] = useState("");
  const [quoteId, setQuoteId] = useState<number | undefined>();
  const [showContactForm, setShowContactForm] = useState(false);
  const [contactInfo, setContactInfo] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const sendMessage = trpc.chat.sendMessage.useMutation({
    onSuccess: (data) => {
      const messageText = typeof data.message === 'string' ? data.message : '';
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: messageText,
        },
      ]);
      
      // Check if AI is asking for contact info or ready to generate quote
      if (messageText.toLowerCase().includes("contact") || 
          messageText.toLowerCase().includes("email") ||
          messageText.toLowerCase().includes("quote")) {
        setShowContactForm(true);
      }
    },
    onError: (error) => {
      toast.error("Failed to send message. Please try again.");
      console.error(error);
    },
  });

  const createQuote = trpc.quotes.create.useMutation({
    onSuccess: (data) => {
      setQuoteId(data.quoteId);
      toast.success("Quote request submitted! We'll be in touch soon.");
      setShowContactForm(false);
    },
    onError: (error) => {
      toast.error("Failed to submit quote. Please try again.");
      console.error(error);
    },
  });

  const handleSendMessage = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      role: "user",
      content: input,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    sendMessage.mutate({
      messages: [...messages, userMessage],
      quoteId,
    });
  };

  const handleSubmitContact = () => {
    if (!contactInfo.name || !contactInfo.email) {
      toast.error("Please provide your name and email");
      return;
    }

    // Extract project details from conversation
    const conversationData = JSON.stringify(messages);

    createQuote.mutate({
      customerName: contactInfo.name,
      customerEmail: contactInfo.email,
      customerPhone: contactInfo.phone,
      conversationData,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/">
            <a className="flex items-center gap-2">
              <img src="/images/logo.png" alt="Critzer's Cabinets Logo" className="h-10 w-10" />
              <span className="text-xl font-bold">Critzer's Cabinets</span>
            </a>
          </Link>
          <Link href="/">
            <Button variant="outline" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </div>
      </header>

      <div className="container py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Get Your Custom Cabinet Quote</h1>
            <p className="text-muted-foreground">
              Tell us about your project and get an instant estimate from our expert team
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {/* Chat Interface */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Project Consultation</CardTitle>
                <CardDescription>
                  Answer a few questions about your project
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Messages */}
                <div className="space-y-4 mb-6 max-h-[500px] overflow-y-auto">
                  {messages.map((message, index) => (
                    <div
                      key={index}
                      className={`flex ${
                        message.role === "user" ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg px-4 py-3 ${
                          message.role === "user"
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted"
                        }`}
                      >
                        <Streamdown>{message.content}</Streamdown>
                      </div>
                    </div>
                  ))}
                  {sendMessage.isPending && (
                    <div className="flex justify-start">
                      <div className="bg-muted rounded-lg px-4 py-3">
                        <Loader2 className="h-4 w-4 animate-spin" />
                      </div>
                    </div>
                  )}
                </div>

                {/* Input */}
                <div className="flex gap-2">
                  <Input
                    placeholder="Type your message..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                    disabled={sendMessage.isPending}
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={sendMessage.isPending || !input.trim()}
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Contact Form / Summary */}
            <div className="space-y-6">
              {showContactForm && !quoteId ? (
                <Card>
                  <CardHeader>
                    <CardTitle>Your Information</CardTitle>
                    <CardDescription>
                      Let us know how to reach you
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name *</Label>
                      <Input
                        id="name"
                        value={contactInfo.name}
                        onChange={(e) =>
                          setContactInfo({ ...contactInfo, name: e.target.value })
                        }
                        placeholder="John Doe"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={contactInfo.email}
                        onChange={(e) =>
                          setContactInfo({ ...contactInfo, email: e.target.value })
                        }
                        placeholder="john@example.com"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={contactInfo.phone}
                        onChange={(e) =>
                          setContactInfo({ ...contactInfo, phone: e.target.value })
                        }
                        placeholder="(555) 123-4567"
                      />
                    </div>
                    <Button
                      className="w-full"
                      onClick={handleSubmitContact}
                      disabled={createQuote.isPending}
                    >
                      {createQuote.isPending && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      Submit Quote Request
                    </Button>
                  </CardContent>
                </Card>
              ) : quoteId ? (
                <Card className="bg-primary text-primary-foreground">
                  <CardHeader>
                    <CardTitle>Quote Submitted!</CardTitle>
                    <CardDescription className="text-primary-foreground/80">
                      We've received your request
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-4">
                      Thank you for your interest! We'll review your project details and 
                      send you a detailed quote within 24 hours.
                    </p>
                    <Link href="/dashboard">
                      <Button variant="secondary" className="w-full">
                        View Your Quotes
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardHeader>
                    <CardTitle>What to Expect</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 text-sm">
                    <div>
                      <h4 className="font-semibold mb-1">1. Quick Consultation</h4>
                      <p className="text-muted-foreground">
                        Answer a few questions about your project
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">2. Instant Estimate</h4>
                      <p className="text-muted-foreground">
                        Get a preliminary price range immediately
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">3. Detailed Quote</h4>
                      <p className="text-muted-foreground">
                        Receive a comprehensive quote within 24 hours
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">4. Design & Build</h4>
                      <p className="text-muted-foreground">
                        Work with our team to bring your vision to life
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
