import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/lib/trpc";
import { Loader2, CheckCircle, Calculator } from "lucide-react";
import { toast } from "sonner";
import Navigation from "@/components/Navigation";

export default function Quote() {
  const [step, setStep] = useState(1);
  const [estimatedPrice, setEstimatedPrice] = useState<number | null>(null);
  const [projectData, setProjectData] = useState({
    roomType: "",
    woodSpecies: "",
    doorStyle: "",
    finish: "",
    countertopType: "",
    dimensions: "",
    linearFeet: "",
    additionalNotes: "",
  });
  const [contactInfo, setContactInfo] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const createQuote = trpc.quotes.create.useMutation({
    onSuccess: () => {
      setSubmitted(true);
      toast.success("Quote request submitted! We'll contact you within 24 hours with a detailed quote.");
    },
    onError: (error) => {
      toast.error("Failed to submit quote. Please try again.");
      console.error(error);
    },
  });

  // Simple pricing calculator
  const calculateEstimate = () => {
    let basePrice = 0;
    const linearFeet = parseInt(projectData.linearFeet) || 0;

    // Base price per linear foot based on door style
    const doorStylePrices: Record<string, number> = {
      "shaker": 350,
      "raised-panel": 450,
      "flat-panel": 320,
      "beadboard": 380,
      "glass-front": 500,
    };

    // Wood species multiplier
    const woodMultipliers: Record<string, number> = {
      "oak": 1.0,
      "maple": 1.1,
      "cherry": 1.3,
      "hickory": 1.2,
      "birch": 0.9,
      "thermofoil": 0.8,
    };

    // Countertop additions (per linear foot)
    const countertopPrices: Record<string, number> = {
      "laminate": 50,
      "granite": 100,
      "quartz": 120,
      "marble": 140,
      "butcher-block": 80,
    };

    const doorStylePrice = doorStylePrices[projectData.doorStyle] || 200;
    const woodMultiplier = woodMultipliers[projectData.woodSpecies] || 1.0;
    const countertopPrice = countertopPrices[projectData.countertopType] || 0;

    basePrice = (doorStylePrice * woodMultiplier * linearFeet) + (countertopPrice * linearFeet);

    // Add 15% for hardware and installation
    basePrice = basePrice * 1.15;

    setEstimatedPrice(Math.round(basePrice));
  };

  const handleCalculate = () => {
    if (!projectData.linearFeet || !projectData.doorStyle || !projectData.woodSpecies) {
      toast.error("Please fill in room type, door style, wood species, and linear feet to calculate estimate");
      return;
    }
    calculateEstimate();
    setStep(2);
  };

  const handleSubmit = () => {
    if (!contactInfo.name || !contactInfo.email) {
      toast.error("Please provide your name and email");
      return;
    }

    const conversationData = JSON.stringify({
      projectData,
      estimatedPrice,
    });

    createQuote.mutate({
      customerName: contactInfo.name,
      customerEmail: contactInfo.email,
      customerPhone: contactInfo.phone,
      conversationData,
    });
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container py-16">
          <Card className="max-w-2xl mx-auto text-center">
            <CardHeader>
              <div className="flex justify-center mb-4">
                <CheckCircle className="h-16 w-16 text-green-600" />
              </div>
              <CardTitle className="text-3xl">Quote Request Submitted!</CardTitle>
              <CardDescription className="text-lg mt-4">
                Thank you for your interest. We'll review your project details and contact you within 24 hours with a detailed quote.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {estimatedPrice && (
                  <div className="bg-primary/10 p-6 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-2">Preliminary Estimate</p>
                    <p className="text-4xl font-bold text-primary">${estimatedPrice.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground mt-2">*This is a rough estimate. Final quote may vary based on specific requirements.</p>
                  </div>
                )}
                <p className="text-sm text-muted-foreground">
                  We've sent a confirmation email to <strong>{contactInfo.email}</strong>
                </p>
                <Button onClick={() => window.location.href = "/"} className="mt-4">
                  Return to Home
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero with Kitchen Background */}
      <div 
        className="relative bg-cover bg-center py-12"
        style={{
          backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url('/images/gallery/7nAUkEFBXEaf.jpg')",
        }}
      >
        <div className="container text-center text-white">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Get Your Free Quote</h1>
          <p className="text-lg opacity-90">
            Fill out the form below to get an instant preliminary estimate
          </p>
        </div>
      </div>

      <div className="container py-8">
        <div className="max-w-4xl mx-auto">
          {step === 1 && (
            <Card>
              <CardHeader>
                <CardTitle>Project Details</CardTitle>
                <CardDescription>
                  Tell us about your kitchen or bathroom project
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Room Type */}
                  <div className="space-y-2">
                    <Label htmlFor="roomType">Room Type *</Label>
                    <Select
                      value={projectData.roomType}
                      onValueChange={(value) => setProjectData({ ...projectData, roomType: value })}
                    >
                      <SelectTrigger id="roomType">
                        <SelectValue placeholder="Select room type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="kitchen">Kitchen</SelectItem>
                        <SelectItem value="bathroom">Bathroom</SelectItem>
                        <SelectItem value="laundry">Laundry Room</SelectItem>
                        <SelectItem value="mudroom">Mudroom</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Door Style */}
                  <div className="space-y-2">
                    <Label htmlFor="doorStyle">Door Style *</Label>
                    <Select
                      value={projectData.doorStyle}
                      onValueChange={(value) => setProjectData({ ...projectData, doorStyle: value })}
                    >
                      <SelectTrigger id="doorStyle">
                        <SelectValue placeholder="Select door style" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="shaker">Shaker</SelectItem>
                        <SelectItem value="raised-panel">Raised Panel</SelectItem>
                        <SelectItem value="flat-panel">Flat Panel / Slab</SelectItem>
                        <SelectItem value="beadboard">Beadboard</SelectItem>
                        <SelectItem value="glass-front">Glass Front</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Wood Species */}
                  <div className="space-y-2">
                    <Label htmlFor="woodSpecies">Wood Species / Material *</Label>
                    <Select
                      value={projectData.woodSpecies}
                      onValueChange={(value) => setProjectData({ ...projectData, woodSpecies: value })}
                    >
                      <SelectTrigger id="woodSpecies">
                        <SelectValue placeholder="Select wood species" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="oak">Oak</SelectItem>
                        <SelectItem value="maple">Maple</SelectItem>
                        <SelectItem value="cherry">Cherry</SelectItem>
                        <SelectItem value="hickory">Hickory</SelectItem>
                        <SelectItem value="birch">Birch</SelectItem>
                        <SelectItem value="thermofoil">Thermofoil</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Finish */}
                  <div className="space-y-2">
                    <Label htmlFor="finish">Finish</Label>
                    <Select
                      value={projectData.finish}
                      onValueChange={(value) => setProjectData({ ...projectData, finish: value })}
                    >
                      <SelectTrigger id="finish">
                        <SelectValue placeholder="Select finish" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="natural">Natural / Clear</SelectItem>
                        <SelectItem value="stain">Stain</SelectItem>
                        <SelectItem value="paint">Paint</SelectItem>
                        <SelectItem value="glaze">Glaze</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Countertop Type */}
                  <div className="space-y-2">
                    <Label htmlFor="countertopType">Countertop Material</Label>
                    <Select
                      value={projectData.countertopType}
                      onValueChange={(value) => setProjectData({ ...projectData, countertopType: value })}
                    >
                      <SelectTrigger id="countertopType">
                        <SelectValue placeholder="Select countertop material" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="laminate">Laminate</SelectItem>
                        <SelectItem value="granite">Granite</SelectItem>
                        <SelectItem value="quartz">Quartz</SelectItem>
                        <SelectItem value="marble">Marble</SelectItem>
                        <SelectItem value="butcher-block">Butcher Block</SelectItem>
                        <SelectItem value="none">No Countertop Needed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Linear Feet */}
                  <div className="space-y-2">
                    <Label htmlFor="linearFeet">Approximate Linear Feet of Cabinets *</Label>
                    <Input
                      id="linearFeet"
                      type="number"
                      placeholder="e.g., 20"
                      value={projectData.linearFeet}
                      onChange={(e) => setProjectData({ ...projectData, linearFeet: e.target.value })}
                    />
                    <p className="text-xs text-muted-foreground">
                      Measure the total length of wall space where cabinets will be installed
                    </p>
                  </div>

                  {/* Dimensions */}
                  <div className="space-y-2">
                    <Label htmlFor="dimensions">Room Dimensions (optional)</Label>
                    <Input
                      id="dimensions"
                      placeholder="e.g., 12' x 15'"
                      value={projectData.dimensions}
                      onChange={(e) => setProjectData({ ...projectData, dimensions: e.target.value })}
                    />
                  </div>

                  {/* Additional Notes */}
                  <div className="space-y-2">
                    <Label htmlFor="additionalNotes">Additional Notes</Label>
                    <Textarea
                      id="additionalNotes"
                      placeholder="Any special requirements, features, or questions..."
                      rows={4}
                      value={projectData.additionalNotes}
                      onChange={(e) => setProjectData({ ...projectData, additionalNotes: e.target.value })}
                    />
                  </div>

                  <Button onClick={handleCalculate} className="w-full" size="lg">
                    <Calculator className="mr-2 h-5 w-5" />
                    Calculate Estimate
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {step === 2 && (
            <Card>
              <CardHeader>
                <CardTitle>Your Preliminary Estimate</CardTitle>
                <CardDescription>
                  Based on the information provided
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {estimatedPrice && (
                    <div className="bg-primary/10 p-8 rounded-lg text-center">
                      <p className="text-sm text-muted-foreground mb-2">Estimated Project Cost</p>
                      <p className="text-5xl font-bold text-primary">${estimatedPrice.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground mt-4">
                        *This is a preliminary estimate based on average pricing. Final quote will be provided after consultation.
                      </p>
                    </div>
                  )}

                  <div className="border-t pt-6">
                    <h3 className="font-semibold mb-4">Project Summary</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Room Type</p>
                        <p className="font-medium capitalize">{projectData.roomType}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Door Style</p>
                        <p className="font-medium capitalize">{projectData.doorStyle.replace("-", " ")}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Wood Species</p>
                        <p className="font-medium capitalize">{projectData.woodSpecies}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Linear Feet</p>
                        <p className="font-medium">{projectData.linearFeet} ft</p>
                      </div>
                      {projectData.countertopType && projectData.countertopType !== "none" && (
                        <div>
                          <p className="text-muted-foreground">Countertop</p>
                          <p className="font-medium capitalize">{projectData.countertopType.replace("-", " ")}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="border-t pt-6">
                    <h3 className="font-semibold mb-4">Contact Information</h3>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name *</Label>
                        <Input
                          id="name"
                          placeholder="John Smith"
                          value={contactInfo.name}
                          onChange={(e) => setContactInfo({ ...contactInfo, name: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address *</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="john@example.com"
                          value={contactInfo.email}
                          onChange={(e) => setContactInfo({ ...contactInfo, email: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="(434) 973-1691"
                          value={contactInfo.phone}
                          onChange={(e) => setContactInfo({ ...contactInfo, phone: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
                      Back to Form
                    </Button>
                    <Button 
                      onClick={handleSubmit} 
                      disabled={createQuote.isPending}
                      className="flex-1"
                      size="lg"
                    >
                      {createQuote.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        "Submit Quote Request"
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
