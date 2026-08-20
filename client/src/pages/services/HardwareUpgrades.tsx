import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, ShoppingCart } from "lucide-react";
import ServicePageLayout from "@/components/ServicePageLayout";

const COLLECTIONS = [
  {
    name: "Bar Pulls",
    image: "/images/topknobs/bar-pulls-collection.jpg",
    alt: "Top Knobs bar pull cabinet hardware in several finishes",
  },
  {
    name: "Mercer",
    image: "/images/topknobs/mercer-collection.jpg",
    alt: "Top Knobs Mercer collection cabinet knobs and pulls",
  },
  {
    name: "Serene",
    image: "/images/topknobs/serene-collection.jpg",
    alt: "Top Knobs Serene collection decorative cabinet hardware",
  },
  {
    name: "Transcend",
    image: "/images/topknobs/transcend-collection.jpg",
    alt: "Top Knobs Transcend collection modern cabinet pulls",
  },
  {
    name: "Lynwood",
    image: "/images/topknobs/lynwood-collection.jpg",
    alt: "Top Knobs Lynwood collection traditional cabinet hardware",
  },
  {
    name: "Riverside",
    image: "/images/topknobs/riverside-collection.jpg",
    alt: "Top Knobs Riverside collection cabinet knobs and pulls",
  },
];

export default function HardwareUpgrades() {
  return (
    <ServicePageLayout
      eyebrow="Authorized Top Knobs Dealer"
      headline="The Fastest Upgrade in Any Kitchen"
      subheadline="Over 7,000 knobs, pulls, and appliance handles — shop online, or let our team template and install a whole-kitchen refresh."
      heroImage="/images/hardware/topknobs-showcase-1.png"
      heroImageAlt="Display board of Top Knobs cabinet knobs and pulls in a variety of finishes"
      primaryCtaLabel="Get a Hardware Quote"
      body={[
        "Nothing changes a kitchen's personality faster or cheaper than new hardware. Swapping dated brass knobs for matte black bar pulls, or plain builder pulls for something with real weight and detail, costs a small fraction of any other renovation and takes an afternoon. Critzer's Cabinet Creations is an authorized Top Knobs dealer with more than 7,000 knobs, pulls, cup pulls, appliance handles, and hooks available, in finishes ranging from polished chrome and brushed satin nickel to flat black, honey bronze, and polished nickel.",
        "The part most homeowners underestimate is placement. Pull length has to relate to drawer width, knob position has to be consistent across dozens of doors, and holes drilled in the wrong spot are permanent. Our installers template every door and drawer, drill from a jig so spacing is identical throughout the kitchen, and handle the awkward cases — appliance panels, false fronts, glass doors, and pantry pulls that need to clear adjacent trim. If you have existing holes at 3-inch centers, we will show you which pulls fit them so no filling and refinishing is required.",
        "You can shop the full catalog yourself in our online store with free shipping on orders over $100, or come to the Berkmar Court showroom and hold the actual samples. Feeling the weight and seeing the finish under real light is genuinely different from looking at a website. Either way, if you would rather not spend a Saturday with a drill, we will supply and install the whole kitchen for you.",
      ]}
      bullets={[
        "7,000+ Top Knobs knobs, pulls, cup pulls, appliance handles, and hooks",
        "Finishes including polished chrome, brushed satin nickel, flat black, honey bronze, ash gray, and polished nickel",
        "Physical samples in the showroom so you can feel the weight and finish",
        "Professional templating and jig-drilled installation for perfect consistency",
        "Retrofit advice for existing 3-inch and 96mm hole spacing",
        "Free shipping on online hardware orders over $100",
      ]}
      highlights={[
        {
          title: "Shop Online Anytime",
          description:
            "Browse the full catalog, filter by collection and finish, and check out securely in our online hardware store.",
        },
        {
          title: "Whole-Kitchen Installation",
          description:
            "We template, drill, and install every piece so spacing is dead consistent across every door and drawer.",
        },
        {
          title: "Coordinate With Your Whole Project",
          description:
            "Choosing hardware alongside cabinets and countertops means finishes actually relate to each other.",
        },
      ]}
      faqs={[
        {
          question: "Can I reuse my existing holes?",
          answer:
            "Often yes. Most older pulls are on 3-inch centers, and plenty of current Top Knobs styles are available in that spacing. Send us a photo and a measurement between hole centers and we will point you to compatible options.",
        },
        {
          question: "How many pulls does a typical kitchen need?",
          answer:
            "A mid-size kitchen usually lands between 25 and 40 pieces once you count every door, drawer, and pantry. We will do an exact count during the estimate so you are not ordering three short on installation day.",
        },
        {
          question: "Should knobs or pulls go on doors?",
          answer:
            "Both are correct. Knobs read more traditional and pulls more contemporary, and many kitchens mix knobs on doors with pulls on drawers. Bring photos of your cabinets and we will show you what works with your door style.",
        },
      ]}
    >
      <section className="py-16 bg-muted/30">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-10 space-y-4">
            <h2 className="text-3xl font-bold">Popular Top Knobs Collections</h2>
            <p className="text-muted-foreground">
              A sample of what is available. The full catalog with every finish and size is
              in our online store.
            </p>
            <Link href="/shop">
              <Button size="lg" className="gap-2">
                <ShoppingCart className="h-4 w-4" aria-hidden="true" /> Shop Hardware Online
              </Button>
            </Link>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {COLLECTIONS.map(collection => (
              <Card key={collection.name} className="overflow-hidden">
                <div className="h-44 overflow-hidden bg-white">
                  <img
                    src={collection.image}
                    alt={collection.alt}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                <CardContent className="p-5 flex items-center justify-between">
                  <h3 className="text-lg font-semibold">{collection.name}</h3>
                  <Link
                    href="/shop"
                    className="text-primary text-sm font-medium inline-flex items-center gap-1 hover:underline"
                  >
                    Shop <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </ServicePageLayout>
  );
}
