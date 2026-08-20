import ServicePageLayout from "@/components/ServicePageLayout";
import { Card, CardContent } from "@/components/ui/card";

const MATERIALS = [
  {
    name: "Cambria Quartz",
    image: "/countertop-quartz.jpg",
    alt: "Cambria quartz countertop surface with natural veining detail",
    copy: "American-made, non-porous, and never needs sealing. As an authorized Cambria dealer we can order any design in their collection.",
  },
  {
    name: "Granite",
    image: "/countertop-granite.jpg",
    alt: "Polished granite countertop slab with speckled natural stone pattern",
    copy: "Natural stone with unmatched variation. We help you choose a slab in person so you know exactly what you are getting.",
  },
  {
    name: "Marble",
    image: "/countertop-marble.jpg",
    alt: "White marble countertop with soft gray veining",
    copy: "Classic veining for baths, bars, and baking stations, with an honest conversation about etching and care.",
  },
  {
    name: "Solid Surface",
    image: "/countertop-corian.jpg",
    alt: "Solid surface Corian countertop with integrated sink",
    copy: "Seamless joints and integral sinks. Repairable and renewable, which makes it a favorite for busy family baths.",
  },
  {
    name: "Laminate",
    image: "/countertop-laminate.jpg",
    alt: "High-definition laminate countertop in a stone-look pattern",
    copy: "Today's high-definition laminates look nothing like the 1980s. The most budget-friendly way to change a kitchen's whole look.",
  },
];

export default function CountertopReplacement() {
  return (
    <ServicePageLayout
      eyebrow="Authorized Cambria Quartz Dealer"
      headline="New Countertops Without the Guesswork"
      subheadline="Templated, fabricated, and installed by one accountable team — quartz, granite, marble, solid surface, and premium laminate."
      heroImage="/countertop-quartz.jpg"
      heroImageAlt="Newly installed quartz kitchen countertop with undermount sink and modern faucet"
      primaryCtaLabel="Get a Countertop Quote"
      body={[
        "Countertops are the single fastest way to change how a kitchen feels. Swapping tired laminate or dated 1990s stone for quartz transforms the room in about two weeks without touching a single cabinet. Critzer's Cabinet Creations handles the entire process: we measure your existing tops, digitally template after demolition, coordinate fabrication, and install with our own crew so there is never a question about who is responsible for the result.",
        "We are an authorized Cambria quartz dealer, which matters more than it sounds. Cambria is American-made, completely non-porous, and never needs to be sealed — no annual maintenance, no worrying about red wine or olive oil. Because we order directly, you get the full Cambria collection with factory warranty support rather than whatever remnant a fabricator happens to have on the floor. We are equally happy to walk a granite yard with you if natural stone is what you have your heart set on.",
        "Every quote includes the details that surprise people on cheaper bids: sink cutouts, faucet and soap dispenser holes, edge profile fabrication, cooktop cutouts, seam placement planning, backsplash returns, and haul-away of the old tops. We coordinate with your plumber for disconnect and reconnect, or handle straightforward sink and faucet swaps ourselves. If you are replacing countertops and refreshing cabinets at the same time, we sequence both so you are only without a kitchen once.",
      ]}
      bullets={[
        "Digital templating for precise fit around walls that are never quite square",
        "Sink, faucet, cooktop, and soap dispenser cutouts included in the quote",
        "Full range of edge profiles, from eased and bullnose to ogee and mitered",
        "Thoughtful seam placement to keep joints out of sight lines",
        "Old countertop removal and disposal",
        "Coordination with plumbing disconnect and reconnect",
        "Backsplash, window sill, and bar top returns in matching material",
      ]}
      highlights={[
        {
          title: "About Two Weeks Start to Finish",
          description:
            "From template to installation, most countertop replacements are complete in roughly two weeks with only one day of real disruption.",
        },
        {
          title: "Cambria Factory Warranty",
          description:
            "Ordering through an authorized dealer means full manufacturer warranty coverage on the material, not just our labor.",
        },
        {
          title: "See It Before You Buy It",
          description:
            "Full-size samples in our Charlottesville showroom, plus slab yard visits for natural stone so there are no surprises.",
        },
      ]}
      faqs={[
        {
          question: "Do I have to replace my cabinets to get new countertops?",
          answer:
            "No. If your cabinet boxes are level and sound, we can replace the tops on their own. Countertops on existing cabinets is one of our most common projects, and it pairs well with cabinet refacing if you want the whole kitchen to feel new.",
        },
        {
          question: "Quartz or granite — which should I choose?",
          answer:
            "Quartz like Cambria is engineered, so patterning is consistent, it is non-porous, and it requires no sealing. Granite is natural, so every slab is unique but it needs periodic sealing. If you want predictability and zero maintenance, choose quartz. If you want one-of-a-kind stone, choose granite.",
        },
        {
          question: "How long will my kitchen be out of service?",
          answer:
            "Typically one day. We remove the old tops in the morning and set the new ones the same day. Your sink is generally back in service that evening or the following morning after the plumbing is reconnected and the seams cure.",
        },
      ]}
    >
      <section className="py-16 bg-background">
        <div className="container">
          <h2 className="text-3xl font-bold text-center mb-4">Materials We Install</h2>
          <p className="text-center text-muted-foreground max-w-2xl mx-auto mb-10">
            Every material below is available through our Charlottesville showroom, with
            samples you can take home and hold up against your cabinets and flooring.
          </p>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {MATERIALS.map(material => (
              <Card key={material.name} className="overflow-hidden">
                <div className="h-44 overflow-hidden bg-muted">
                  <img
                    src={material.image}
                    alt={material.alt}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                <CardContent className="p-6 space-y-2">
                  <h3 className="text-xl font-bold">{material.name}</h3>
                  <p className="text-muted-foreground text-sm">{material.copy}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </ServicePageLayout>
  );
}
