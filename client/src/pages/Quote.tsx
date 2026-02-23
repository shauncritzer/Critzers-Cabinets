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
    // Educational questions
    currentCondition: "",
    timeline: "",
    budgetRange: "",
    stylePreference: "",
    specialFeatures: "",
    referralSource: "",
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
      customerPhone: contactInfo.phone || undefined,
      conversationData,
      // Pass all structured form fields directly for DB storage and email notification
      roomType: projectData.roomType || undefined,
      doorStyle: projectData.doorStyle || undefined,
      woodSpecies: projectData.woodSpecies || undefined,
      finish: projectData.finish || undefined,
      countertopType: projectData.countertopType || undefined,
      linearFeet: projectData.linearFeet || undefined,
      dimensions: projectData.dimensions || undefined,
      estimatedPrice: estimatedPrice || undefined,
      projectDescription: projectData.additionalNotes || undefined,
      // Educational qualification questions
      currentCondition: projectData.currentCondition || undefined,
      timeline: projectData.timeline || undefined,
      budgetRange: projectData.budgetRange || undefined,
      stylePreference: projectData.stylePreference || undefined,
      specialFeatures: projectData.specialFeatures || undefined,
      referralSource: projectData.referralSource || undefined,
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
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-2">
                      <p className="text-xs font-semibold text-blue-900 mb-2">📱 Need help measuring? Download these free apps:</p>
                      <div className="flex flex-wrap gap-2 text-xs">
                        <a href="https://apps.apple.com/us/app/magicplan/id427424432" target="_blank" rel="noopener noreferrer" className="bg-white border border-blue-300 text-blue-700 px-3 py-1 rounded hover:bg-blue-50 transition-colors">MagicPlan (iOS/Android)</a>
                        <a href="https://apps.apple.com/us/app/roomscan-pro/id571436618" target="_blank" rel="noopener noreferrer" className="bg-white border border-blue-300 text-blue-700 px-3 py-1 rounded hover:bg-blue-50 transition-colors">RoomScan Pro (iOS)</a>
                        <a href="https://play.google.com/store/apps/details?id=com.google.ar.measure" target="_blank" rel="noopener noreferrer" className="bg-white border border-blue-300 text-blue-700 px-3 py-1 rounded hover:bg-blue-50 transition-colors">Google Measure (Android)</a>
                      </div>
                    </div>
                  </div>

                  {/* Educational Questions */}
                  <div className="space-y-4 border-t pt-6">
                    <h3 className="font-semibold text-lg">Help Us Understand Your Project Better</h3>
                    
                    {/* Current Condition */}
                    <div className="space-y-2">
                      <Label htmlFor="currentCondition">What's the current condition? 💡</Label>
                      <p className="text-sm text-muted-foreground">This helps us understand the scope of work needed.</p>
                      <Select value={projectData.currentCondition} onValueChange={(value) => setProjectData({ ...projectData, currentCondition: value })}>
                        <SelectTrigger id="currentCondition">
                          <SelectValue placeholder="Select condition" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="new-construction">New Construction</SelectItem>
                          <SelectItem value="full-remodel">Full Remodel</SelectItem>
                          <SelectItem value="cabinet-replacement">Cabinet Replacement Only</SelectItem>
                          <SelectItem value="refacing">Cabinet Refacing</SelectItem>
                          <SelectItem value="repair">Repair/Restoration</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Timeline */}
                    <div className="space-y-2">
                      <Label htmlFor="timeline">When would you like to start? 💡</Label>
                      <p className="text-sm text-muted-foreground">Helps us schedule and plan materials.</p>
                      <Select value={projectData.timeline} onValueChange={(value) => setProjectData({ ...projectData, timeline: value })}>
                        <SelectTrigger id="timeline">
                          <SelectValue placeholder="Select timeline" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="asap">As Soon As Possible</SelectItem>
                          <SelectItem value="1-3-months">1-3 Months</SelectItem>
                          <SelectItem value="3-6-months">3-6 Months</SelectItem>
                          <SelectItem value="6-12-months">6-12 Months</SelectItem>
                          <SelectItem value="12plus-months">12+ Months (Planning Stage)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Budget Range */}
                    <div className="space-y-2">
                      <Label htmlFor="budgetRange">What's your budget range? 💡</Label>
                      <p className="text-sm text-muted-foreground">Helps us recommend options that fit your investment level.</p>
                      <Select value={projectData.budgetRange} onValueChange={(value) => setProjectData({ ...projectData, budgetRange: value })}>
                        <SelectTrigger id="budgetRange">
                          <SelectValue placeholder="Select budget range" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="under-10k">Under $10,000</SelectItem>
                          <SelectItem value="10k-25k">$10,000 - $25,000</SelectItem>
                          <SelectItem value="25k-50k">$25,000 - $50,000</SelectItem>
                          <SelectItem value="50k-75k">$50,000 - $75,000</SelectItem>
                          <SelectItem value="75k-plus">$75,000+</SelectItem>
                          <SelectItem value="flexible">Flexible/Not Sure</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Style Preference */}
                    <div className="space-y-2">
                      <Label htmlFor="stylePreference">What style do you prefer? 💡</Label>
                      <p className="text-sm text-muted-foreground">Helps us visualize your dream space.</p>
                      <Select value={projectData.stylePreference} onValueChange={(value) => setProjectData({ ...projectData, stylePreference: value })}>
                        <SelectTrigger id="stylePreference">
                          <SelectValue placeholder="Select style" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="traditional">Traditional</SelectItem>
                          <SelectItem value="modern">Modern/Contemporary</SelectItem>
                          <SelectItem value="farmhouse">Farmhouse/Rustic</SelectItem>
                          <SelectItem value="transitional">Transitional</SelectItem>
                          <SelectItem value="craftsman">Craftsman</SelectItem>
                          <SelectItem value="industrial">Industrial</SelectItem>
                          <SelectItem value="coastal">Coastal</SelectItem>
                          <SelectItem value="not-sure">Not Sure Yet</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Special Features */}
                    <div className="space-y-2">
                      <Label htmlFor="specialFeatures">Any special features needed? 💡</Label>
                      <p className="text-sm text-muted-foreground">Custom solutions we should consider.</p>
                      <Select value={projectData.specialFeatures} onValueChange={(value) => setProjectData({ ...projectData, specialFeatures: value })}>
                        <SelectTrigger id="specialFeatures">
                          <SelectValue placeholder="Select special features" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">None</SelectItem>
                          <SelectItem value="accessibility">Accessibility Features</SelectItem>
                          <SelectItem value="custom-storage">Custom Storage Solutions</SelectItem>
                          <SelectItem value="island">Kitchen Island</SelectItem>
                          <SelectItem value="pantry">Walk-in Pantry</SelectItem>
                          <SelectItem value="appliance-garage">Appliance Garage</SelectItem>
                          <SelectItem value="wine-storage">Wine Storage</SelectItem>
                          <SelectItem value="multiple">Multiple Features</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Referral Source */}
                    <div className="space-y-2">
                      <Label htmlFor="referralSource">How did you hear about us? 💡</Label>
                      <p className="text-sm text-muted-foreground">Helps us know what's working!</p>
                      <Select value={projectData.referralSource} onValueChange={(value) => setProjectData({ ...projectData, referralSource: value })}>
                        <SelectTrigger id="referralSource">
                          <SelectValue placeholder="Select source" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="google">Google Search</SelectItem>
                          <SelectItem value="social-media">Social Media</SelectItem>
                          <SelectItem value="referral">Friend/Family Referral</SelectItem>
                          <SelectItem value="contractor">Contractor Referral</SelectItem>
                          <SelectItem value="previous-customer">Previous Customer</SelectItem>
                          <SelectItem value="drive-by">Saw Your Work</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
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
