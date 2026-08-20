import ServicePageLayout from "@/components/ServicePageLayout";

export default function CabinetRepair() {
  return (
    <ServicePageLayout
      eyebrow="Cabinet Repair"
      headline="Cabinet Repair by Craftsmen Who Build Cabinets"
      subheadline="Sagging doors, sticking drawers, water damage, worn finishes — we fix cabinetry of every brand and vintage, including cabinets we did not install."
      heroImage="/service-installation.jpg"
      heroImageAlt="Craftsman repairing a kitchen cabinet door hinge with hand tools"
      primaryCtaLabel="Request a Repair Visit"
      body={[
        "A cabinet problem rarely justifies a new kitchen. A door that will not stay closed, a drawer that grinds on its glides, a sink base swollen from a slow supply-line leak — these are afternoon repairs for someone who works with cabinetry every day. Critzer's has been building and installing cabinets in Charlottesville since 1986, and that same crew handles repairs on cabinetry of any brand, age, or origin. We regularly service cabinets installed by builders and companies that are no longer in business.",
        "Hardware is the most common culprit. Hinges wear and lose their adjustment, Euro-style cup hinges break their springs, and older epoxy-coated drawer glides simply reach the end of their life. We stock and source the replacements, including upgrades to soft-close hinges and full-extension undermount glides, so your existing cabinets end up functioning better than they did when they were new. Where a drawer box itself has failed, we rebuild it in our shop to the original dimensions.",
        "We also handle the repairs most people assume require replacement. Water-damaged sink bases and toe kicks can be cut out and rebuilt in place. Delaminated thermofoil doors, chipped finishes, sun-faded panels, and scratched surfaces can be refinished or color-matched. If a repair genuinely is not worth doing, we will tell you that too, and walk you through refacing or replacement instead of selling you an expensive band-aid.",
      ]}
      bullets={[
        "Hinge replacement, door realignment, and soft-close conversions",
        "Drawer box rebuilds and full-extension or undermount glide upgrades",
        "Water-damaged sink base, deck, and toe kick replacement",
        "Finish touch-up, refinishing, and color matching",
        "Delaminated thermofoil and veneer repair",
        "Shelf, rollout, organizer, and lazy susan retrofits",
        "Cabinet leveling, shimming, and re-anchoring after settling",
      ]}
      highlights={[
        {
          title: "Any Brand, Any Age",
          description:
            "We service cabinetry regardless of who built it, including lines that have been discontinued for decades.",
        },
        {
          title: "Upgrade While We're There",
          description:
            "Most repairs are the perfect opportunity to add soft-close hardware or rollout shelving at minimal extra labor.",
        },
        {
          title: "Honest Assessments",
          description:
            "If a repair is not economical, we will say so and show you what refacing or replacement would cost instead.",
        },
      ]}
      faqs={[
        {
          question: "Do you repair cabinets you did not install?",
          answer:
            "Constantly. A large share of our repair work is on builder-grade cabinetry and on lines from companies that are no longer around. Bring us a photo of the hinge or glide and we can usually identify the part before we arrive.",
        },
        {
          question: "Can you match my existing door if one is damaged beyond repair?",
          answer:
            "In many cases yes, either through the original manufacturer or by having a matching door built. If an exact match is not available, we will show you the closest options and discuss whether refacing the run makes more sense.",
        },
        {
          question: "How quickly can someone come out?",
          answer:
            "Call (434) 973-1691 and we will schedule an assessment, typically within the same week. Saturday and evening appointments are available by request if weekday hours do not work for you.",
        },
      ]}
    />
  );
}
