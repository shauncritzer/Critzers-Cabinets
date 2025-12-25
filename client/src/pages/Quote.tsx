import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/lib/trpc";
import { Loader2, Send, Smartphone, Ruler, ExternalLink, CheckCircle } from "lucide-react";
import { Link } from "wouter";
import { toast } from "sonner";
import { Streamdown } from "streamdown";
import Navigation from "@/components/Navigation";

type Message = {
  role: "user" | "assistant";
  content: string;
};

export default function Quote() {
  const [step, setStep] = useState(1);
  const [projectData, setProjectData] = useState({
    roomType: "",
    woodSpecies: "",
    doorStyle: "",
    finish: "",
    countertopType: "",
    dimensions: "",
    additionalNotes: "",
  });
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hello! I'm here to help you get a quote for your kitchen or bath project. Let's start by gathering some information about what you're looking for. You can fill out the quick form on the right, or just chat with me here!",
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
      
      if (messageText.toLowerCase().includes("contact") || 
          messageText.toLowerCase().includes("email") ||
          messageText.toLowerCase().includes("ready to provide")) {
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
      toast.success("Quote request submitted! We'll be in touch within 24 hours.");
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

  const handleQuickFormSubmit = () => {
    const summary = `
Room Type: ${projectData.roomType || 'Not specified'}
Wood Species: ${projectData.woodSpecies || 'Not specified'}
Door Style: ${projectData.doorStyle || 'Not specified'}
Finish: ${projectData.finish || 'Not specified'}
Countertop: ${projectData.countertopType || 'Not specified'}
Dimensions: ${projectData.dimensions || 'Not provided'}
Notes: ${projectData.additionalNotes || 'None'}
    `.trim();

    const userMessage: Message = {
      role: "user",
      content: `Here's my project information:\n${summary}`,
    };

    setMessages((prev) => [...prev, userMessage]);
    setShowContactForm(true);

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

    const conversationData = JSON.stringify({
      messages,
      projectData,
    });

    createQuote.mutate({
      customerName: contactInfo.name,
      customerEmail: contactInfo.email,
      customerPhone: contactInfo.phone,
      conversationData,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero with Kitchen Background */}
      <div 
        className="relative bg-cover bg-center py-12"
        style={{
          backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url('/images/gallery/omega-warm-cherry-kitchen.jpg')",
        }}
      >
        <div className="container text-center text-white">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Get Your Free Quote</h1>
          <p className="text-lg opacity-90">
            Answer a few questions and get a preliminary estimate within minutes
          </p>
        </div>
      </div>

      <div className="container py-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Chat Interface */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Project Consultation</CardTitle>
                <CardDescription>
                  Chat with us or fill out the quick form to get started
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Messages */}
                <div className="space-y-4 mb-6 max-h-[400px] overflow-y-auto">
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
                    placeholder="Type your message or ask a question..."
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

            {/* Right Sidebar */}
            <div className="space-y-6">
              {showContactForm && !quoteId ? (
                <Card>
                  <CardHeader>
                    <CardTitle>Almost Done!</CardTitle>
                    <CardDescription>
                      Enter your contact info to receive your quote
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
                      Get My Quote
                    </Button>
                  </CardContent>
                </Card>
              ) : quoteId ? (
                <Card className="bg-primary text-primary-foreground">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5" />
                      Quote Submitted!
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-4">
                      Thank you! We'll review your project and send a detailed quote within 24 hours.
                    </p>
                    <p className="text-sm opacity-80 mb-4">
                      Questions? Call us at (434) 973-1691
                    </p>
                    <Link href="/">
                      <Button variant="secondary" className="w-full">
                        Back to Home
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ) : (
                <>
                  {/* Quick Form */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Quick Quote Form</CardTitle>
                      <CardDescription>
                        Fill this out for faster quotes
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label>Room Type</Label>
                        <Select
                          value={projectData.roomType}
                          onValueChange={(v) => setProjectData({ ...projectData, roomType: v })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select room..." />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="kitchen">Kitchen</SelectItem>
                            <SelectItem value="bathroom">Bathroom</SelectItem>
                            <SelectItem value="laundry">Laundry Room</SelectItem>
                            <SelectItem value="office">Home Office</SelectItem>
                            <SelectItem value="garage">Garage</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>Wood Species (for stained look)</Label>
                        <Select
                          value={projectData.woodSpecies}
                          onValueChange={(v) => setProjectData({ ...projectData, woodSpecies: v })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select wood..." />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="oak">Oak</SelectItem>
                            <SelectItem value="cherry">Cherry</SelectItem>
                            <SelectItem value="maple">Maple</SelectItem>
                            <SelectItem value="hickory">Hickory</SelectItem>
                            <SelectItem value="painted">Painted (no wood grain)</SelectItem>
                            <SelectItem value="unsure">Not sure yet</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>Door Style</Label>
                        <Select
                          value={projectData.doorStyle}
                          onValueChange={(v) => setProjectData({ ...projectData, doorStyle: v })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select style..." />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="shaker">Shaker / Mission</SelectItem>
                            <SelectItem value="raised-panel">Traditional Raised Panel</SelectItem>
                            <SelectItem value="flat-panel">Flat Panel / Slab</SelectItem>
                            <SelectItem value="beaded">Beaded Inset</SelectItem>
                            <SelectItem value="ornate">Ornate / Decorative</SelectItem>
                            <SelectItem value="unsure">Not sure yet</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>Finish</Label>
                        <Select
                          value={projectData.finish}
                          onValueChange={(v) => setProjectData({ ...projectData, finish: v })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select finish..." />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="stained">Stained (natural wood)</SelectItem>
                            <SelectItem value="painted-white">Painted - White</SelectItem>
                            <SelectItem value="painted-color">Painted - Color</SelectItem>
                            <SelectItem value="glazed">Glazed</SelectItem>
                            <SelectItem value="distressed">Distressed / Antiqued</SelectItem>
                            <SelectItem value="unsure">Not sure yet</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>Countertop Type</Label>
                        <Select
                          value={projectData.countertopType}
                          onValueChange={(v) => setProjectData({ ...projectData, countertopType: v })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select countertop..." />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="granite">Granite</SelectItem>
                            <SelectItem value="quartz">Quartz (Engineered)</SelectItem>
                            <SelectItem value="marble">Marble</SelectItem>
                            <SelectItem value="soapstone">Soapstone</SelectItem>
                            <SelectItem value="solid-surface">Solid Surface</SelectItem>
                            <SelectItem value="none">No countertops needed</SelectItem>
                            <SelectItem value="unsure">Not sure yet</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>Approximate Dimensions</Label>
                        <Textarea
                          placeholder="e.g., 12' x 10' kitchen, 8 linear feet of cabinets..."
                          value={projectData.dimensions}
                          onChange={(e) => setProjectData({ ...projectData, dimensions: e.target.value })}
                          rows={2}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Additional Notes</Label>
                        <Textarea
                          placeholder="Any special requirements, timeline, budget range..."
                          value={projectData.additionalNotes}
                          onChange={(e) => setProjectData({ ...projectData, additionalNotes: e.target.value })}
                          rows={2}
                        />
                      </div>

                      <Button 
                        className="w-full" 
                        onClick={handleQuickFormSubmit}
                        disabled={sendMessage.isPending}
                      >
                        Submit & Get Quote
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Measurement Apps */}
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base flex items-center gap-2">
                        <Ruler className="h-4 w-4" />
                        Need Help Measuring?
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 text-sm">
                      <p className="text-muted-foreground">
                        Use your smartphone to measure your space:
                      </p>
                      <div className="space-y-2">
                        <a 
                          href="https://apps.apple.com/app/measure/id1383426740"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-primary hover:underline"
                        >
                          <Smartphone className="h-4 w-4" />
                          Apple Measure (iPhone)
                          <ExternalLink className="h-3 w-3" />
                        </a>
                        <a 
                          href="https://play.google.com/store/apps/details?id=com.google.tango.measure"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-primary hover:underline"
                        >
                          <Smartphone className="h-4 w-4" />
                          Google Measure (Android)
                          <ExternalLink className="h-3 w-3" />
                        </a>
                        <a 
                          href="https://www.magicplan.app/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-primary hover:underline"
                        >
                          <Smartphone className="h-4 w-4" />
                          magicplan (Floor Plans)
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Or just give us your best estimate - we'll verify measurements before ordering.
                      </p>
                    </CardContent>
                  </Card>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
